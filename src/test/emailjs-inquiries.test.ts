import { afterEach, describe, expect, it, vi } from "vitest";

import { sendContactInquiryEmail, sendStaffingInquiryEmail } from "@/services/emailjs";
import type { StoredContactInquiry } from "@/services/contact-inquiries";
import type { StoredStaffingInquiry } from "@/services/staffing-inquiries";

const contactInquiry: StoredContactInquiry = {
  id: "contact-1",
  referenceNumber: "TAB-MSG-2026-12345",
  submittedAt: "2026-11-10T12:00:00.000Z",
  status: "Received",
  fullName: "Contact Person",
  emailAddress: "contact@example.com",
  phoneNumber: "555-0100",
  userType: "Job Seeker",
  subject: "Support Engineer",
  inquiryType: "Job Opportunities",
  message: "I would like to ask a general question.",
  resumeDriveLink: "https://drive.google.com/file/d/example/view",
  privacyConsent: true,
  confirmationEmail: {
    to: "contact@example.com",
    subject: "Contact confirmation",
    sentAt: "2026-11-10T12:00:00.000Z",
    preview: "Thank you",
  },
  internalAlert: {
    to: "team@example.com",
    subject: "New contact inquiry",
    sentAt: "2026-11-10T12:00:00.000Z",
    priority: "Normal",
  },
};

const staffingInquiry: StoredStaffingInquiry = {
  id: "staffing-1",
  referenceNumber: "TAB-STAFF-2026-12345",
  submittedAt: "2026-11-10T12:00:00.000Z",
  status: "New",
  companyName: "Example Company",
  companyWebsite: "https://example.com",
  industry: "Technology",
  companyLocation: "Columbus, Ohio",
  contactPerson: "Hiring Manager",
  businessEmail: "hiring@example.com",
  phoneNumber: "555-0101",
  jobTitle: "Hiring Manager",
  serviceCategory: "it",
  serviceDisplayName: "Information Technology",
  positionTitle: "Support Engineer",
  employeeCount: "2",
  employmentType: "Full-time",
  requiredExperience: "3 years",
  expectedTimeline: "Within one month",
  jobDescription: "Provide technical support.",
  additionalMessage: "Please contact by email.",
  preferredContactMethod: "Email",
  privacyConsent: true,
  confirmationEmail: {
    to: "hiring@example.com",
    subject: "Staffing confirmation",
    sentAt: "2026-11-10T12:00:00.000Z",
    preview: "Thank you",
  },
  internalAlert: {
    to: "team@example.com",
    subject: "New staffing inquiry",
    sentAt: "2026-11-10T12:00:00.000Z",
    priority: "Standard",
  },
};

describe("inquiry EmailJS templates", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sends contact inquiry fields using the contact template", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    vi.stubGlobal("fetch", fetchMock);

    await sendContactInquiryEmail(contactInquiry);

    const request = JSON.parse(fetchMock.mock.calls[0]?.[1]?.body as string) as {
      template_id: string;
      template_params: Record<string, unknown>;
    };
    expect(request.template_id).toBe("template_mz83mel");
    expect(request.template_params["message"]).toContain("CONTACT INQUIRY FORM");
    expect(request.template_params["message"]).toContain(contactInquiry.resumeDriveLink);
    expect(request.template_params["html_message"]).toContain("New Contact Form Message");
    expect(request.template_params["html_message"]).toContain(contactInquiry.resumeDriveLink);
    expect(request.template_params["resume_drive_link"]).toBe(contactInquiry.resumeDriveLink);
    expect(request.template_params).not.toHaveProperty("company_name");
    expect(request.template_params).not.toHaveProperty("employee_count");
    expect(request.template_params).not.toHaveProperty("job_description");
  });

  it("omits the resume link from direct contact inquiry emails", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    vi.stubGlobal("fetch", fetchMock);
    const directInquiry = {
      ...contactInquiry,
      userType: "Employer" as const,
      inquiryType: "General Inquiry" as const,
    };
    delete directInquiry.resumeDriveLink;

    await sendContactInquiryEmail(directInquiry);

    const request = JSON.parse(fetchMock.mock.calls[0]?.[1]?.body as string) as {
      template_params: Record<string, unknown>;
    };
    expect(request.template_params["message"]).not.toContain("Google Drive Resume Link");
    expect(request.template_params["html_message"]).not.toContain("Google Drive Resume:");
    expect(request.template_params).not.toHaveProperty("resume_drive_link");
    expect(request.template_params).not.toHaveProperty("resume_link");
  });

  it("returns an error when the contact template rejects the request", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      statusText: "Bad Request",
      text: async () => "Template configuration error",
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await sendContactInquiryEmail(contactInquiry);

    expect(result.success).toBe(false);
    expect(result.status).toBe(400);
    expect(result.message).toContain("Template configuration error");
  });

  it("sends employer intake fields using the staffing template", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    vi.stubGlobal("fetch", fetchMock);

    await sendStaffingInquiryEmail(staffingInquiry);

    const request = JSON.parse(fetchMock.mock.calls[0]?.[1]?.body as string) as {
      template_id: string;
      template_params: Record<string, unknown>;
    };
    expect(request.template_id).toBe("template_kgdwzmr");
    expect(request.template_params["message"]).toContain("EMPLOYER INTAKE FORM");
    expect(request.template_params["html_message"]).toContain("New Staffing & Hiring Requirements");
    expect(request.template_params).not.toHaveProperty("inquiry_type");
    expect(request.template_params).not.toHaveProperty("inquiry_subject");
  });

  it("trims whitespace from template IDs when customConfig is provided", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    vi.stubGlobal("fetch", fetchMock);

    await sendStaffingInquiryEmail(staffingInquiry, {
      templateId: " template_kgdwzmr ",
    });

    const request = JSON.parse(fetchMock.mock.calls[0]?.[1]?.body as string) as {
      template_id: string;
    };
    expect(request.template_id).toBe("template_kgdwzmr");
  });
});
