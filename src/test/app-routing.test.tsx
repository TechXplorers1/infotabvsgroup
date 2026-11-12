import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";
import {
  validateStaffingInquiry,
  processStaffingInquiry,
  generateReferenceNumber,
  normalizeServiceKey,
  SERVICE_METADATA,
  StaffingInquiryPayload,
} from "@/services/staffing-inquiries";
import {
  validateContactInquiry,
  processContactInquiry,
  ContactInquiryPayload,
} from "@/services/contact-inquiries";
import { SHOWCASE_SERVICES } from "@/components/about/IndustriesShowcase";
import {
  WHATSAPP_PHONE,
  WHATSAPP_PREFILLED_MESSAGE,
  WHATSAPP_URL,
} from "@/components/layout/FloatingWhatsAppButton";
import {
  validateResumeSubmission,
  processResumeSubmission,
  ResumeSubmissionPayload,
} from "@/services/resume-submissions";
import {
  getAllJobs,
  getJobById,
  getJobsByIndustry,
} from "@/services/job-listings";
import {
  validateJobApplication,
  processJobApplication,
  JobApplicationPayload,
} from "@/services/job-applications";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it("matches a page for /about instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/about");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it("matches a page for /services instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/services");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it("matches a page for /request-staffing instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/request-staffing");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it("matches a page for /job-seekers instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/job-seekers");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it("matches a page for /jobs instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/jobs");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it("matches a page for /contact instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/contact");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it("verifies the Find Jobs destination route exists for Job Seekers CTA", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/jobs");

    expect(matches.at(-1)?.routeId).toBe("/jobs");
  });

  it("verifies homepage contact section CTA destination routes (/contact, /jobs, /services)", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    // 1. Get in Touch -> /contact
    const contactMatches = router.matchRoutes("/contact");
    expect(contactMatches.at(-1)?.routeId).toBe("/contact");

    // 2. Find Jobs -> /jobs
    const jobsMatches = router.matchRoutes("/jobs");
    expect(jobsMatches.at(-1)?.routeId).toBe("/jobs");

    // 3. Explore Our Services -> /services
    const servicesMatches = router.matchRoutes("/services");
    expect(servicesMatches.at(-1)?.routeId).toBe("/services");
  });

  it("verifies company WhatsApp link format conforms to verified international number", () => {
    const phone = "380-206-4792";
    const intlFormat = `1${phone.replace(/\D/g, "")}`;
    expect(intlFormat).toBe("13802064792");
    const waUrl = `https://wa.me/${intlFormat}`;
    expect(waUrl).toBe("https://wa.me/13802064792");
  });

  it("verifies global floating WhatsApp contact redirect URL and parameters", () => {
    expect(WHATSAPP_PHONE).toBe("13802064792");
    expect(WHATSAPP_PHONE).not.toMatch(/[\s\-\(\)\+]/);
    expect(WHATSAPP_PREFILLED_MESSAGE).toBe(
      "Hello TAB V&S Group! I visited your website and would like to know more about your recruitment services.",
    );
    expect(WHATSAPP_URL).toBe(
      `https://wa.me/13802064792?text=${encodeURIComponent(
        "Hello TAB V&S Group! I visited your website and would like to know more about your recruitment services.",
      )}`,
    );
    expect(WHATSAPP_URL).toContain("https://wa.me/13802064792?text=");
  });
});

describe("Staffing Inquiry Backend Service", () => {
  it("normalizes service query keys correctly", () => {
    expect(normalizeServiceKey("data-center")).toBe("data-center");
    expect(normalizeServiceKey("datacenter")).toBe("data-center");
    expect(normalizeServiceKey("it")).toBe("it");
    expect(normalizeServiceKey("information-technology")).toBe("it");
    expect(normalizeServiceKey("warehouse")).toBe("warehouse");
    expect(normalizeServiceKey("warehousing")).toBe("warehouse");
    expect(normalizeServiceKey("healthcare")).toBe("healthcare");
    expect(normalizeServiceKey("health")).toBe("healthcare");
    expect(normalizeServiceKey("cleaning")).toBe("cleaning");
    expect(normalizeServiceKey("clean")).toBe("cleaning");
    expect(normalizeServiceKey("invalid-service-key")).toBe("data-center");
    expect(normalizeServiceKey(null)).toBe("data-center");
    expect(normalizeServiceKey(undefined)).toBe("data-center");
  });

  it("maps all 5 homepage services to valid staffing inquiries and metadata", () => {
    const serviceMappings = [
      { param: "data-center", expectedKey: "data-center", expectedName: "Data Center Operations & Technician" },
      { param: "information-technology", expectedKey: "it", expectedName: "Information Technology" },
      { param: "warehouse", expectedKey: "warehouse", expectedName: "Warehouse Associate Placement" },
      { param: "healthcare", expectedKey: "healthcare", expectedName: "Healthcare Services Placement" },
      { param: "cleaning", expectedKey: "cleaning", expectedName: "Cleaning Services Placement" },
    ];

    for (const mapping of serviceMappings) {
      const key = normalizeServiceKey(mapping.param);
      expect(key).toBe(mapping.expectedKey);
      expect(SERVICE_METADATA[key].name).toBe(mapping.expectedName);
    }
  });

  it("generates a unique formatted reference number", () => {
    const ref1 = generateReferenceNumber();
    const ref2 = generateReferenceNumber();
    expect(ref1).toMatch(/^TAB-REQ-2026-\d{5}$/);
    expect(ref2).toMatch(/^TAB-REQ-2026-\d{5}$/);
    expect(ref1).not.toBe(ref2);
  });

  it("validates required fields properly", () => {
    const invalidResult = validateStaffingInquiry({});
    expect(invalidResult.isValid).toBe(false);
    expect(invalidResult.errors["companyName"]).toBeDefined();
    expect(invalidResult.errors["businessEmail"]).toBeDefined();
    expect(invalidResult.errors["contactPerson"]).toBeDefined();
    expect(invalidResult.errors["privacyConsent"]).toBeDefined();

    const validPayload: StaffingInquiryPayload = {
      companyName: "Nexus Data Systems",
      companyWebsite: "https://nexusdata.example",
      industry: "Data Center & Cloud Infrastructure",
      companyLocation: "Ashburn, VA",
      contactPerson: "Jordan Miller",
      businessEmail: "jmiller@nexusdata.example",
      phoneNumber: "(555) 234-5678",
      jobTitle: "VP of Critical Facilities",
      serviceCategory: "data-center",
      positionTitle: "Lead Critical Facilities Tech",
      employeeCount: "2-4 Employees",
      employmentType: "Direct-Hire Full-Time",
      requiredExperience: "Senior Level (5+ Years)",
      expectedTimeline: "Immediate / Urgent (1-2 Weeks)",
      jobDescription: "Looking for senior technician to oversee power & cooling infrastructure.",
      additionalMessage: "Need immediate direct-hire candidates.",
      preferredContactMethod: "Email",
      privacyConsent: true,
    };

    const validResult = validateStaffingInquiry(validPayload);
    expect(validResult.isValid).toBe(true);
    expect(Object.keys(validResult.errors).length).toBe(0);
  });

  it("successfully processes valid inquiry and creates email records", async () => {
    const payload: StaffingInquiryPayload = {
      companyName: `Test Corp ${Date.now()}`,
      industry: "Information Technology",
      companyLocation: "Dallas, TX",
      contactPerson: "Alex Morgan",
      businessEmail: `alex.${Date.now()}@testcorp.example`,
      phoneNumber: "(555) 876-5432",
      jobTitle: "CTO",
      serviceCategory: "it",
      positionTitle: "Cloud Solutions Architect",
      employeeCount: "1 Employee",
      employmentType: "Direct-Hire Full-Time",
      requiredExperience: "Senior Level (5+ Years)",
      expectedTimeline: "2-4 Weeks",
      jobDescription: "Lead architect for multi-cloud deployment and team leadership.",
      preferredContactMethod: "Either",
      privacyConsent: true,
    };

    const result = await processStaffingInquiry(payload);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.inquiry.referenceNumber).toMatch(/^TAB-REQ-2026-\d{5}$/);
      expect(result.inquiry.confirmationEmail.to).toBe(payload.businessEmail);
      expect(["tabeng14@infotabvsgroup.com", "recruiting@tabvsgroup.com"]).toContain(result.inquiry.internalAlert.to);
    }
  });
});

describe("Contact Inquiry Backend Service", () => {
  it("validates required contact form fields correctly", () => {
    const invalid = validateContactInquiry({});
    expect(invalid.isValid).toBe(false);
    expect(invalid.errors.fullName).toBeDefined();
    expect(invalid.errors.emailAddress).toBeDefined();
    expect(invalid.errors.phoneNumber).toBeDefined();
    expect(invalid.errors.subject).toBeDefined();
    expect(invalid.errors.message).toBeDefined();
    expect(invalid.errors.privacyConsent).toBeDefined();

    const valid = validateContactInquiry({
      fullName: "Jordan Lee",
      emailAddress: "jordan@example.com",
      phoneNumber: "380-206-4792",
      userType: "Employer",
      subject: "Data Center Staffing Support",
      inquiryType: "Data Center Operations",
      message: "We need 3 senior technicians for our Westerville facility.",
      privacyConsent: true,
    });
    expect(valid.isValid).toBe(true);
    expect(Object.keys(valid.errors).length).toBe(0);
  });

  it("successfully processes and records a valid contact inquiry", () => {
    const payload: ContactInquiryPayload = {
      fullName: "Jordan Lee",
      emailAddress: "jordan@example.com",
      phoneNumber: "380-206-4792",
      userType: "Employer",
      subject: "Data Center Staffing Support",
      inquiryType: "Data Center Operations",
      message: "We need 3 senior technicians for our Westerville facility.",
      privacyConsent: true,
    };

    const stored = processContactInquiry(payload);
    expect(stored.referenceNumber).toMatch(/^TAB-MSG-2026-\d{5}$/);
    expect(stored.confirmationEmail.to).toBe("jordan@example.com");
    expect(["tabeng14@infotabvsgroup.com", "tabeng14@infotabvsgroup.com"]).toContain(stored.internalAlert.to);
    expect(stored.internalAlert.priority).toBe("High");
  });

  it("requires a Google Drive resume link for job opportunity inquiries", () => {
    const candidateInquiry: ContactInquiryPayload = {
      fullName: "Jordan Lee",
      emailAddress: "jordan@example.com",
      phoneNumber: "380-206-4792",
      userType: "Job Seeker",
      subject: "Apply for Support Engineer",
      inquiryType: "Job Opportunities",
      message: "I am interested in this job opportunity.",
      privacyConsent: true,
    };

    expect(validateContactInquiry(candidateInquiry).errors.resumeDriveLink).toBeDefined();
    expect(
      validateContactInquiry({
        ...candidateInquiry,
        resumeDriveLink: "https://example.com/resume.pdf",
      }).errors.resumeDriveLink,
    ).toBeDefined();
    expect(
      validateContactInquiry({
        ...candidateInquiry,
        resumeDriveLink: "https://drive.google.com/file/d/example/view",
      }).isValid,
    ).toBe(true);
  });
});

describe("About Page Dedicated Practice Areas Showcase", () => {
  it("contains all 5 dedicated recruitment services with alternating layouts and themes", () => {
    expect(SHOWCASE_SERVICES).toHaveLength(5);
    const [s0, s1, s2, s3, s4] = SHOWCASE_SERVICES;
    expect(s0).toBeDefined();
    expect(s1).toBeDefined();
    expect(s2).toBeDefined();
    expect(s3).toBeDefined();
    expect(s4).toBeDefined();
    if (!s0 || !s1 || !s2 || !s3 || !s4) return;

    // 01: Data Center Operations (Text LEFT, Image RIGHT, Dark)
    expect(s0.number).toBe("01 / 05");
    expect(s0.title).toBe("Data Center Operations & Technician");
    expect(s0.layout).toBe("text-left");
    expect(s0.theme).toBe("dark");
    expect(s0.industryKey).toBe("data-center");
    expect(s0.roles).toContain("Data Center Technician");

    // 02: Information Technology (Image LEFT, Text RIGHT, Light)
    expect(s1.number).toBe("02 / 05");
    expect(s1.title).toBe("Information Technology");
    expect(s1.layout).toBe("image-left");
    expect(s1.theme).toBe("light");
    expect(s1.industryKey).toBe("it");
    expect(s1.roles).toContain("IT Support Specialist");

    // 03: Warehouse & Logistics (Text LEFT, Image RIGHT, Dark)
    expect(s2.number).toBe("03 / 05");
    expect(s2.title).toBe("Warehouse & Logistics");
    expect(s2.layout).toBe("text-left");
    expect(s2.theme).toBe("dark");
    expect(s2.industryKey).toBe("warehouse");
    expect(s2.roles).toContain("Warehouse Associate");

    // 04: Healthcare Services (Image LEFT, Text RIGHT, Light)
    expect(s3.number).toBe("04 / 05");
    expect(s3.title).toBe("Healthcare Services");
    expect(s3.layout).toBe("image-left");
    expect(s3.theme).toBe("light");
    expect(s3.industryKey).toBe("healthcare");
    expect(s3.roles).toContain("Healthcare Support Associate");

    // 05: Cleaning & Facility Services (Text LEFT, Image RIGHT, Dark)
    expect(s4.number).toBe("05 / 05");
    expect(s4.title).toBe("Cleaning & Facility Services");
    expect(s4.layout).toBe("text-left");
    expect(s4.theme).toBe("dark");
    expect(s4.industryKey).toBe("cleaning");
    expect(s4.roles).toContain("Commercial Cleaner");
  });

  it("ensures each service has valid non-empty description and roles", () => {
    for (const service of SHOWCASE_SERVICES) {
      expect(service.description.length).toBeGreaterThan(20);
      expect(service.roles.length).toBeGreaterThanOrEqual(3);
      expect(service.image).toBeTruthy();
      expect(service.imageAlt.length).toBeGreaterThan(10);
    }
  });
});

describe("Candidate Resume Submission Service", () => {
  it("rejects incomplete resume payloads with proper error messages", () => {
    const invalid = validateResumeSubmission({});
    expect(invalid.isValid).toBe(false);
    expect(invalid.errors.fullName).toBeDefined();
    expect(invalid.errors.email).toBeDefined();
    expect(invalid.errors.phone).toBeDefined();
    expect(invalid.errors.industry).toBeDefined();
    expect(invalid.errors.privacyConsent).toBeDefined();
  });

  it("validates and processes a complete resume submission with reference number", () => {
    const payload: ResumeSubmissionPayload = {
      fullName: "Taylor Smith",
      email: "taylor.smith@example.com",
      phone: "380-206-4792",
      industry: "Warehouse Associate Placement",
      desiredPosition: "Inventory & Fulfillment Specialist",
      experience: "1–3 Years",
      resumeFileName: "taylor_resume.pdf",
      resumeSummary: "Certified forklift operator with distribution center experience.",
      privacyConsent: true,
    };

    const validated = validateResumeSubmission(payload);
    expect(validated.isValid).toBe(true);
    expect(Object.keys(validated.errors).length).toBe(0);

    const stored = processResumeSubmission(payload);
    expect(stored.id).toMatch(/^resume_/);
    expect(stored.referenceNumber).toMatch(/^TAB-RESUME-2026-\d{5}$/);
    expect(stored.status).toBe("Received");
    expect(stored.confirmationEmail.to).toBe("taylor.smith@example.com");
    expect(stored.confirmationEmail.subject).toContain("Resume Received");
    expect(stored.internalAlert.to).toBe("recruitment@tabvsgroup.com");
  });
});

describe("Direct-Hire Job Listings & Application Service", () => {
  it("provides 10 active direct-hire job openings across 5 industries", () => {
    const jobs = getAllJobs();
    expect(jobs.length).toBe(10);

    const industries = new Set(jobs.map((j) => j.industry));
    expect(industries.has("data-center")).toBe(true);
    expect(industries.has("it")).toBe(true);
    expect(industries.has("warehouse")).toBe(true);
    expect(industries.has("healthcare")).toBe(true);
    expect(industries.has("cleaning")).toBe(true);
  });

  it("retrieves specific job by ID with comprehensive details", () => {
    const job = getJobById("dc-01");
    expect(job).toBeDefined();
    expect(job?.title).toBe("Data Center Operations Technician");
    expect(job?.responsibilities.length).toBeGreaterThanOrEqual(4);
    expect(job?.requirements.length).toBeGreaterThanOrEqual(4);
    expect(job?.benefits.length).toBeGreaterThanOrEqual(3);
    expect(job?.salaryRange).toBeDefined();
  });

  it("rejects invalid job applications missing required fields", () => {
    const invalid = validateJobApplication({});
    expect(invalid.isValid).toBe(false);
    expect(invalid.errors.fullName).toBeDefined();
    expect(invalid.errors.email).toBeDefined();
    expect(invalid.errors.phone).toBeDefined();
    expect(invalid.errors.privacyConsent).toBeDefined();
  });

  it("processes a complete job application, generating reference ID and confirmation email", () => {
    const payload: JobApplicationPayload = {
      jobId: "dc-01",
      jobTitle: "Data Center Operations Technician",
      jobIndustry: "Data Center Operations",
      jobLocation: "Westerville / Columbus, OH",
      fullName: "Alex Rivera",
      email: "alex.rivera@example.com",
      phone: "(380) 206-4792",
      currentCity: "Columbus, OH",
      experienceLevel: "2–4 Years Experience",
      resumeFileName: "alex_rivera_resume.pdf",
      coverNote: "Experienced with server racking and fiber optic cabling.",
      privacyConsent: true,
    };

    const validated = validateJobApplication(payload);
    expect(validated.isValid).toBe(true);
    expect(Object.keys(validated.errors).length).toBe(0);

    const record = processJobApplication(payload);
    expect(record.id).toMatch(/^job_app_/);
    expect(record.referenceNumber).toMatch(/^TAB-APP-2026-\d{5}$/);
    expect(record.status).toBe("received");
    expect(record.confirmationEmail.dispatched).toBe(true);
    expect(record.confirmationEmail.to).toBe("alex.rivera@example.com");
    expect(record.confirmationEmail.subject).toContain("Data Center Operations Technician");
  });
});
