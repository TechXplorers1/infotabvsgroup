export interface ContactInquiryPayload {
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  userType: "Employer" | "Job Seeker" | "Other";
  subject: string;
  inquiryType:
  | "Recruitment & Staffing"
  | "Data Center Operations"
  | "Information Technology"
  | "Warehouse Staffing"
  | "Healthcare Staffing"
  | "Cleaning Services"
  | "Job Opportunities"
  | "General Inquiry";
  message: string;
  resumeDriveLink?: string;
  privacyConsent: boolean;
}

export type ContactFormErrors = Partial<Record<keyof ContactInquiryPayload, string>>;

export interface StoredContactInquiry extends ContactInquiryPayload {
  id: string;
  referenceNumber: string;
  submittedAt: string;
  status: "Received" | "Under Review" | "Responded";
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

const STORAGE_KEY = "tab_vs_group_contact_inquiries_v1";

export function validateContactInquiry(payload: Partial<ContactInquiryPayload>): {
  isValid: boolean;
  errors: ContactFormErrors;
} {
  const errors: ContactFormErrors = {};

  if (!payload.fullName || payload.fullName.trim().length < 2) {
    errors.fullName = "Please enter your full name (at least 2 characters).";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!payload.emailAddress || !emailRegex.test(payload.emailAddress.trim())) {
    errors.emailAddress = "Please enter a valid email address.";
  }

  const phoneRegex = /^[\d\s()+-]{7,25}$/;
  if (!payload.phoneNumber || !phoneRegex.test(payload.phoneNumber.trim())) {
    errors.phoneNumber = "Please provide a valid contact phone number (at least 7 digits).";
  }

  if (!payload.userType) {
    errors.userType = "Please select whether you are an Employer, Job Seeker, or Other.";
  }

  if (!payload.subject || payload.subject.trim().length < 3) {
    errors.subject = "Please enter a subject for your inquiry.";
  }

  if (!payload.inquiryType) {
    errors.inquiryType = "Please select an inquiry type.";
  }

  if (!payload.message || payload.message.trim().length < 10) {
    errors.message = "Please provide details about your inquiry (minimum 10 characters).";
  }

  if (payload.userType === "Job Seeker" && payload.inquiryType === "Job Opportunities") {
    const resumeDriveLink = payload.resumeDriveLink?.trim();
    if (!resumeDriveLink) {
      errors.resumeDriveLink = "Please provide a Google Drive link to your resume.";
    } else {
      try {
        const resumeUrl = new URL(resumeDriveLink);
        if (
          resumeUrl.protocol !== "https:" ||
          !["drive.google.com", "docs.google.com"].includes(resumeUrl.hostname)
        ) {
          errors.resumeDriveLink = "Please enter a valid Google Drive or Google Docs link.";
        }
      } catch {
        errors.resumeDriveLink = "Please enter a valid Google Drive or Google Docs link.";
      }
    }
  }

  if (!payload.privacyConsent) {
    errors.privacyConsent = "You must accept the privacy policy to submit your message.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function processContactInquiry(payload: ContactInquiryPayload): StoredContactInquiry {
  const validation = validateContactInquiry(payload);
  if (!validation.isValid) {
    const errorKeys = Object.keys(validation.errors).join(", ");
    throw new Error(`Contact inquiry validation failed on: ${errorKeys}`);
  }

  const now = new Date();
  const timestamp = now.toISOString();
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const referenceNumber = `TAB-MSG-${now.getFullYear()}-${randomSuffix}`;
  const id = `contact_${Date.now()}_${randomSuffix}`;

  const storedInquiry: StoredContactInquiry = {
    ...payload,
    id,
    referenceNumber,
    submittedAt: timestamp,
    status: "Received",
    confirmationEmail: {
      to: payload.emailAddress,
      subject: `Inquiry Confirmation: ${referenceNumber} — TAB V&S Group Recruitment Agency`,
      sentAt: timestamp,
      preview: `Hello ${payload.fullName}, thank you for contacting TAB V&S Group. We have received your inquiry regarding "${payload.subject}" and our team will follow up promptly.`,
    },
    internalAlert: {
      to: "tabeng14@infotabvsgroup.com",
      subject: `[New Inquiry] ${referenceNumber}: ${payload.subject} (${payload.userType})`,
      sentAt: timestamp,
      priority: payload.userType === "Employer" ? "High" : "Normal",
    },
  };

  if (typeof window !== "undefined" && window.localStorage) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const existing: StoredContactInquiry[] = raw ? JSON.parse(raw) : [];
      existing.unshift(storedInquiry);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(0, 50)));
    } catch (e) {
      console.warn("[Contact Inquiries] Could not persist to localStorage:", e);
    }
  }

  console.info(
    `[Contact Inquiries] Processed message ${referenceNumber} for ${payload.fullName} (${payload.emailAddress}).`
  );

  return storedInquiry;
}
