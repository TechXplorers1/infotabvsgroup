export interface ResumeSubmissionPayload {
  fullName: string;
  email: string;
  phone: string;
  industry: string;
  desiredPosition?: string | undefined;
  experience: string;
  resumeFileName?: string | undefined;
  resumeLink?: string | undefined;
  resumeSummary?: string | undefined;
  privacyConsent: boolean;
}

export type ResumeFormErrors = Partial<Record<keyof ResumeSubmissionPayload, string>>;

export interface StoredResumeSubmission extends ResumeSubmissionPayload {
  id: string;
  referenceNumber: string;
  submittedAt: string;
  status: "Received" | "Under Review" | "Candidate Matched";
  confirmationEmail: {
    to: string;
    subject: string;
    sentAt: string;
    preview: string;
  };
  internalAlert: {
    to: string;
    subject: string;
    sentAt: string;
    priority: "Normal" | "High";
  };
}

const STORAGE_KEY = "tab_vs_group_resume_submissions_v1";

export function validateResumeSubmission(payload: Partial<ResumeSubmissionPayload>): {
  isValid: boolean;
  errors: ResumeFormErrors;
} {
  const errors: ResumeFormErrors = {};

  if (!payload.fullName || payload.fullName.trim().length < 2) {
    errors.fullName = "Please enter your full name (at least 2 characters).";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!payload.email || !emailRegex.test(payload.email.trim())) {
    errors.email = "Please provide a valid email address.";
  }

  const phoneDigits = (payload.phone || "").replace(/\D/g, "");
  if (!payload.phone || phoneDigits.length < 7) {
    errors.phone = "Please provide a valid contact telephone number.";
  }

  if (!payload.industry || payload.industry.trim().length === 0) {
    errors.industry = "Please select your primary industry or field of interest.";
  }

  if (!payload.privacyConsent) {
    errors.privacyConsent = "You must agree to the privacy consent to submit your resume.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function generateResumeReferenceNumber(): string {
  const currentYear = new Date().getFullYear();
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  return `TAB-RESUME-${currentYear}-${randomSuffix}`;
}

export function processResumeSubmission(payload: ResumeSubmissionPayload): StoredResumeSubmission {
  const validation = validateResumeSubmission(payload);
  if (!validation.isValid) {
    throw new Error("Invalid resume submission payload.");
  }

  const id = `resume_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const referenceNumber = generateResumeReferenceNumber();
  const now = new Date().toISOString();

  const record: StoredResumeSubmission = {
    ...payload,
    id,
    referenceNumber,
    submittedAt: now,
    status: "Received",
    confirmationEmail: {
      to: payload.email.trim(),
      subject: `Resume Received — Reference ${referenceNumber} | TAB V&S Group`,
      sentAt: now,
      preview: `Dear ${payload.fullName.trim()}, thank you for submitting your resume to TAB V&S Group. A recruiter will review your profile.`,
    },
    internalAlert: {
      to: "recruitment@tabvsgroup.com",
      subject: `[Candidate Resume] ${payload.fullName} - ${payload.industry}`,
      sentAt: now,
      priority: "Normal",
    },
  };

  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const existingRaw = window.localStorage.getItem(STORAGE_KEY);
      const existing: StoredResumeSubmission[] = existingRaw ? JSON.parse(existingRaw) : [];
      existing.unshift(record);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(0, 100)));
    }
  } catch {
    // Graceful fallback for non-storage environments
  }

  return record;
}
