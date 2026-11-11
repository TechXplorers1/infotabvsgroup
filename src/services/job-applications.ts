/**
 * Direct-Hire Job Application Submission Service
 * Manages validation, reference generation, local persistence,
 * and candidate application confirmations.
 */

export interface JobApplicationPayload {
  jobId: string;
  jobTitle: string;
  jobIndustry: string;
  jobLocation: string;
  fullName: string;
  email: string;
  phone: string;
  currentCity?: string | undefined;
  experienceLevel?: string | undefined;
  resumeFileName?: string | undefined;
  resumeLink?: string | undefined;
  coverNote?: string | undefined;
  privacyConsent: boolean;
}

export interface StoredJobApplication extends JobApplicationPayload {
  id: string;
  referenceNumber: string;
  submittedAt: string;
  status: "received" | "under_review" | "contacted";
  confirmationEmail: {
    dispatched: boolean;
    to: string;
    subject: string;
    timestamp: string;
  };
}

export type JobApplicationErrors = Partial<Record<keyof JobApplicationPayload, string>>;

export const JOB_APPLICATIONS_STORAGE_KEY = "tab_vs_group_job_applications_v1";

/**
 * Validates a job application payload
 */
export function validateJobApplication(
  data: Partial<JobApplicationPayload>,
): { isValid: boolean; errors: JobApplicationErrors } {
  const errors: JobApplicationErrors = {};

  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.fullName = "Please enter your full legal name.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  const phoneDigits = (data.phone || "").replace(/\D/g, "");
  if (!data.phone || phoneDigits.length < 7) {
    errors.phone = "Please enter a valid phone number (at least 7 digits).";
  }

  if (!data.privacyConsent) {
    errors.privacyConsent = "You must agree to the privacy consent to submit your application.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Generates a branded application reference ID
 * Format: TAB-APP-2026-XXXXX
 */
export function generateJobAppReferenceNumber(): string {
  const randomFive = Math.floor(10000 + Math.random() * 90000);
  return `TAB-APP-2026-${randomFive}`;
}

/**
 * Processes and persists a validated job application
 */
export function processJobApplication(
  payload: JobApplicationPayload,
): StoredJobApplication {
  const refNumber = generateJobAppReferenceNumber();
  const id = `job_app_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const submittedAt = new Date().toISOString();

  const record: StoredJobApplication = {
    ...payload,
    id,
    referenceNumber: refNumber,
    submittedAt,
    status: "received",
    confirmationEmail: {
      dispatched: true,
      to: payload.email,
      subject: `Application Received: ${payload.jobTitle} [${refNumber}] — TAB V&S Group`,
      timestamp: submittedAt,
    },
  };

  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const existingRaw = window.localStorage.getItem(JOB_APPLICATIONS_STORAGE_KEY);
      const existing: StoredJobApplication[] = existingRaw ? JSON.parse(existingRaw) : [];
      existing.unshift(record);
      window.localStorage.setItem(JOB_APPLICATIONS_STORAGE_KEY, JSON.stringify(existing));
    }
  } catch (err) {
    console.warn("Could not persist job application to localStorage:", err);
  }

  return record;
}

/**
 * Retrieves all stored job applications
 */
export function getStoredJobApplications(): StoredJobApplication[] {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const raw = window.localStorage.getItem(JOB_APPLICATIONS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    }
  } catch {
    // Return empty array on failure
  }
  return [];
}
