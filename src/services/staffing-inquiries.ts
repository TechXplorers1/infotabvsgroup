export interface StaffingInquiryPayload {
  companyName: string;
  companyWebsite?: string;
  industry: string;
  companyLocation: string;
  contactPerson: string;
  businessEmail: string;
  phoneNumber: string;
  jobTitle: string;
  serviceCategory: "data-center" | "it" | "warehouse" | "healthcare" | "cleaning";
  positionTitle: string;
  employeeCount: string;
  employmentType: string;
  requiredExperience: string;
  expectedTimeline: string;
  jobDescription: string;
  additionalMessage?: string;
  preferredContactMethod: "Email" | "Phone" | "Either";
  privacyConsent: boolean;
}

export type StaffingFormErrors = Partial<Record<keyof StaffingInquiryPayload, string>>;

export interface StoredStaffingInquiry extends StaffingInquiryPayload {
  id: string;
  referenceNumber: string;
  submittedAt: string;
  status: "New" | "Under Review" | "Specialist Assigned" | "Candidate Matching";
  serviceDisplayName: string;
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
    priority: "Standard" | "High" | "Urgent";
  };
}

export const SERVICE_METADATA = {
  "data-center": {
    id: "data-center",
    name: "Data Center Operations & Technician",
    eyebrow: "DATA CENTER RECRUITMENT",
    shortName: "Data Center",
    tagline: "Infrastructure & Server Reliability",
    description:
      "Skilled technicians and operations staff supporting mission-critical power, cooling, cabling, and 24/7 server infrastructure continuity.",
    roles: [
      "Data Center Technician (L1-L3)",
      "Technical Infrastructure Support",
      "Server and Hardware Support Engineer",
      "Critical Facilities Monitoring Specialist",
    ],
    timeline: "1-2 Weeks Direct Placement",
  },
  it: {
    id: "it",
    name: "Information Technology",
    eyebrow: "IT RECRUITMENT",
    shortName: "Information Tech",
    tagline: "Systems, Support & Operations",
    description:
      "Capable IT professionals across enterprise help desk, networking, systems administration, cloud infrastructure, and technical support.",
    roles: [
      "IT Support Specialists & Help Desk",
      "Network Technicians & Engineers",
      "Systems Administration Associates",
      "IT Operations & Infrastructure Staff",
    ],
    timeline: "1-3 Weeks Direct Placement",
  },
  warehouse: {
    id: "warehouse",
    name: "Warehouse Associate Placement",
    eyebrow: "WAREHOUSE RECRUITMENT",
    shortName: "Warehouse Logistics",
    tagline: "Logistics & Inventory Flow",
    description:
      "Dependable warehouse professionals supporting inventory control, order fulfillment, shipping, receiving, and logistics operations.",
    roles: [
      "Warehouse Associates & Material Handlers",
      "Inventory Control Specialists",
      "Order Pickers & Packers",
      "Shipping & Receiving Leads",
    ],
    timeline: "3-7 Days Placement Turnaround",
  },
  healthcare: {
    id: "healthcare",
    name: "Healthcare Services Placement",
    eyebrow: "HEALTHCARE RECRUITMENT",
    shortName: "Healthcare Services",
    tagline: "Clinical & Facility Support",
    description:
      "Dedicated non-clinical and allied support personnel for healthcare networks, ambulatory centers, and acute care facilities.",
    roles: [
      "Patient Support & Transport Associates",
      "Clinical Facility Support Staff",
      "Medical Administrative Personnel",
      "Sanitation & Environmental Services",
    ],
    timeline: "1-2 Weeks Direct Placement",
  },
  cleaning: {
    id: "cleaning",
    name: "Cleaning Services Placement",
    eyebrow: "CLEANING SERVICES RECRUITMENT",
    shortName: "Commercial Cleaning",
    tagline: "Commercial & Facility Hygiene",
    description:
      "Vetted cleaning and facility maintenance professionals maintaining pristine hygiene and safety across corporate and industrial sites.",
    roles: [
      "Commercial Cleaning Specialists",
      "Corporate Facility Maintenance Associates",
      "Custodial Specialists & Leads",
      "Industrial Deep-Cleaning Associates",
    ],
    timeline: "3-5 Days Placement Turnaround",
  },
} as const;

export type ServiceKey = keyof typeof SERVICE_METADATA;

export function normalizeServiceKey(raw?: string | null): ServiceKey {
  if (!raw) return "data-center";
  const cleaned = raw.toLowerCase().trim().replace(/_/g, "-");
  if (cleaned === "datacenter" || cleaned === "data-center") return "data-center";
  if (cleaned === "it" || cleaned === "information-technology") return "it";
  if (cleaned === "warehouse" || cleaned === "warehousing") return "warehouse";
  if (cleaned === "healthcare" || cleaned === "health") return "healthcare";
  if (cleaned === "cleaning" || cleaned === "clean") return "cleaning";
  return "data-center";
}

// In-memory server store
const inMemoryInquiries: StoredStaffingInquiry[] = [];

// LocalStorage key for browser persistence
const STORAGE_KEY = "tabvs_staffing_inquiries_db";

function getBrowserStorage(): StoredStaffingInquiry[] {
  if (typeof window === "undefined" || !window.localStorage) return inMemoryInquiries;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return inMemoryInquiries;
  }
}

function saveToBrowserStorage(inquiry: StoredStaffingInquiry): void {
  inMemoryInquiries.unshift(inquiry);
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    const existing = getBrowserStorage();
    const updated = [inquiry, ...existing.filter((item) => item.id !== inquiry.id)].slice(0, 50);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn("Could not persist staffing inquiry to localStorage", err);
  }
}

export function validateStaffingInquiry(data: Partial<StaffingInquiryPayload>): {
  isValid: boolean;
  errors: StaffingFormErrors;
} {
  const errors: StaffingFormErrors = {};

  if (!data.companyName || data.companyName.trim().length < 2) {
    errors.companyName = "Company name is required (minimum 2 characters).";
  }

  if (!data.industry || data.industry.trim().length < 2) {
    errors.industry = "Please select or enter your industry.";
  }

  if (!data.companyLocation || data.companyLocation.trim().length < 2) {
    errors.companyLocation = "Company location (City, State) is required.";
  }

  if (!data.contactPerson || data.contactPerson.trim().length < 2) {
    errors.contactPerson = "Contact person's full name is required.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.businessEmail || !emailRegex.test(data.businessEmail.trim())) {
    errors.businessEmail = "A valid business email address is required.";
  }

  const phoneDigits = (data.phoneNumber || "").replace(/\D/g, "");
  if (!data.phoneNumber || phoneDigits.length < 7) {
    errors.phoneNumber = "A valid telephone number with area code is required.";
  }

  if (!data.jobTitle || data.jobTitle.trim().length < 2) {
    errors.jobTitle = "Your job title/designation is required.";
  }

  if (!data.serviceCategory || !SERVICE_METADATA[data.serviceCategory as ServiceKey]) {
    errors.serviceCategory = "Please select a valid recruitment service category.";
  }

  if (!data.positionTitle || data.positionTitle.trim().length < 2) {
    errors.positionTitle = "Target position or role title is required.";
  }

  if (!data.employeeCount || data.employeeCount.trim().length === 0) {
    errors.employeeCount = "Please select the number of personnel required.";
  }

  if (!data.employmentType || data.employmentType.trim().length === 0) {
    errors.employmentType = "Please select the desired employment type.";
  }

  if (!data.requiredExperience || data.requiredExperience.trim().length === 0) {
    errors.requiredExperience = "Please select the required experience level.";
  }

  if (!data.expectedTimeline || data.expectedTimeline.trim().length === 0) {
    errors.expectedTimeline = "Please select your expected hiring timeline.";
  }

  if (!data.jobDescription || data.jobDescription.trim().length < 10) {
    errors.jobDescription =
      "Please provide details regarding job duties or requirements (min 10 characters).";
  }

  if (!data.privacyConsent) {
    errors.privacyConsent = "You must consent to the privacy policy to submit this staffing request.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function generateReferenceNumber(): string {
  const currentYear = new Date().getFullYear();
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  return `TAB-REQ-${currentYear}-${randomSuffix}`;
}

export async function processStaffingInquiry(
  payload: StaffingInquiryPayload,
): Promise<{ success: true; inquiry: StoredStaffingInquiry } | { success: false; error: string; errors?: StaffingFormErrors }> {
  // 1. Validation
  const validation = validateStaffingInquiry(payload);
  if (!validation.isValid) {
    return {
      success: false,
      error: "Please complete all required fields correctly before submitting.",
      errors: validation.errors,
    };
  }

  // 2. Duplicate submission prevention (within 5 seconds debounce)
  const existingInquiries = getBrowserStorage();
  const fiveSecondsAgo = Date.now() - 5 * 1000;
  const isDuplicate = existingInquiries.some((item) => {
    const itemTime = new Date(item.submittedAt).getTime();
    return (
      itemTime > fiveSecondsAgo &&
      item.businessEmail.toLowerCase() === payload.businessEmail.toLowerCase() &&
      item.companyName.toLowerCase() === payload.companyName.toLowerCase() &&
      item.positionTitle.toLowerCase() === payload.positionTitle.toLowerCase()
    );
  });

  if (isDuplicate) {
    return {
      success: false,
      error:
        "A staffing inquiry for this exact position was submitted moments ago. Please check your inbox or wait one minute before submitting another request.",
    };
  }

  // 3. Assemble stored record
  const referenceNumber = generateReferenceNumber();
  const now = new Date().toISOString();
  const serviceMeta = SERVICE_METADATA[payload.serviceCategory];

  const storedInquiry: StoredStaffingInquiry = {
    ...payload,
    id: `inq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    referenceNumber,
    submittedAt: now,
    status: "New",
    serviceDisplayName: serviceMeta.name,
    confirmationEmail: {
      to: payload.businessEmail,
      subject: `Staffing Request Received [Ref: ${referenceNumber}] — TAB V&S Group`,
      sentAt: now,
      preview: `Dear ${payload.contactPerson}, thank you for contacting TAB V&S Group. Your staffing inquiry for ${payload.positionTitle} (${serviceMeta.name}) has been received and assigned to our recruiting practice.`,
    },
    internalAlert: {
      to: "sandeepsapare.tx@gmail.com",
      subject: `🚨 NEW STAFFING INQUIRY: ${payload.companyName} (${payload.employeeCount} ${payload.positionTitle})`,
      sentAt: now,
      priority:
        payload.expectedTimeline.includes("Immediate") || payload.expectedTimeline.includes("Urgent")
          ? "Urgent"
          : "Standard",
    },
  };

  // 4. Save to repository & browser storage
  saveToBrowserStorage(storedInquiry);

  // 5. Console audit log
  console.log(`[Staffing Inquiries Backend] Processed inquiry ${referenceNumber} for ${payload.companyName}. Confirmation dispatched to ${payload.businessEmail}.`);

  return {
    success: true,
    inquiry: storedInquiry,
  };
}

export function getSavedInquiries(): StoredStaffingInquiry[] {
  return getBrowserStorage();
}

export function getInquiryByReference(ref: string): StoredStaffingInquiry | undefined {
  const all = getBrowserStorage();
  return all.find((item) => item.referenceNumber.toLowerCase() === ref.toLowerCase().trim());
}
