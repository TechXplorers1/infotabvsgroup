/**
 * EmailJS Client Integration Service
 * Dispatches form submissions to the EmailJS REST API.
 * 
 * Works seamlessly with environment variables:
 * - VITE_EMAILJS_SERVICE_ID
 * - VITE_EMAILJS_TEMPLATE_ID (or VITE_EMAILJS_JOB_TEMPLATE_ID)
 * - VITE_EMAILJS_PUBLIC_KEY
 */

import type { StoredJobApplication } from "./job-applications";
import type { StoredResumeSubmission } from "./resume-submissions";
import type { StoredContactInquiry } from "./contact-inquiries";
import type { StoredStaffingInquiry } from "./staffing-inquiries";

export interface EmailJSConfig {
  serviceId: string;
  templateId: string;
  staffingTemplateId?: string;
  contactTemplateId?: string;
  publicKey: string;
}

export const EMAILJS_CONFIG: EmailJSConfig = {
  serviceId: (
    (import.meta.env["VITE_EMAILJS_SERVICE_ID"] as string | undefined) || "service_1aig5dj"
  ).trim(),
  templateId: (
    (import.meta.env["VITE_EMAILJS_TEMPLATE_ID"] as string | undefined) || "template_un8tzws"
  ).trim(),
  staffingTemplateId: (
    (import.meta.env["VITE_EMAILJS_STAFFING_TEMPLATE_ID"] as string | undefined) || "template_fbf5fm6"
  ).trim(),
  contactTemplateId: (
    (import.meta.env["VITE_EMAILJS_CONTACT_TEMPLATE_ID"] as string | undefined) || "template_un8tzws"
  ).trim(),
  publicKey: (
    (import.meta.env["VITE_EMAILJS_PUBLIC_KEY"] as string | undefined) || "knbgmJkufTt_pX4fp"
  ).trim(),
};

export interface EmailJSSendResult {
  success: boolean;
  message: string;
  status?: number;
}

/**
 * Dispatches an email using the official EmailJS REST API.
 * Uses native fetch with 0 extra client bundle overhead.
 */
export async function sendEmailJS(
  templateParams: Record<string, unknown>,
  customConfig?: Partial<EmailJSConfig>
): Promise<EmailJSSendResult> {
  const serviceId = (customConfig?.serviceId || EMAILJS_CONFIG.serviceId)?.trim();
  const templateId = (customConfig?.templateId || EMAILJS_CONFIG.templateId)?.trim();
  const publicKey = (customConfig?.publicKey || EMAILJS_CONFIG.publicKey)?.trim();

  // If credentials are not configured yet, provide helpful console log and return gracefully
  if (!serviceId || !templateId || !publicKey) {
    const missing = [
      !serviceId && "VITE_EMAILJS_SERVICE_ID",
      !templateId && "VITE_EMAILJS_TEMPLATE_ID",
      !publicKey && "VITE_EMAILJS_PUBLIC_KEY",
    ]
      .filter(Boolean)
      .join(", ");

    console.warn(
      `[EmailJS] Missing configuration: ${missing}. Please set these variables in your .env file or EMAILJS_CONFIG in src/services/emailjs.ts.\nPayload prepared for sending:`,
      templateParams
    );

    return {
      success: false,
      message: `EmailJS credentials missing (${missing})`,
    };
  }

  console.log(`[EmailJS Sending]`, {
    serviceId,
    templateId,
    publicKey,
    to: templateParams["to_email"] || templateParams["to"],
  });

  try {
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lib_version: "5.0.3",
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: templateParams,
      }),
    });

    if (response.ok) {
      console.log(
        `[EmailJS] Successfully dispatched email for ${typeof templateParams["reference_number"] === "string"
          ? templateParams["reference_number"]
          : "submission"
        } via template "${templateId}".`
      );
      return {
        success: true,
        status: response.status,
        message: "Email successfully sent via EmailJS!",
      };
    } else {
      const errorText = await response.text();
      console.error(
        `[EmailJS] Dispatch error (${response.status}) [Service: "${serviceId}", Template: "${templateId}", Key: "${publicKey}"]:`,
        errorText
      );
      return {
        success: false,
        status: response.status,
        message: `${errorText || response.statusText} [Sent -> Service: "${serviceId}", Template: "${templateId}", Key: "${publicKey}"]`,
      };
    }
  } catch (error) {
    console.error("[EmailJS] Network or dispatch exception:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to communicate with EmailJS service.",
    };
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Sends a Job Application email with all fields mapped to EmailJS template variables.
 */
export async function sendJobApplicationEmail(
  record: StoredJobApplication,
  customConfig?: Partial<EmailJSConfig>
): Promise<EmailJSSendResult> {
  const formattedDate = new Date(record.submittedAt).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const resumeLinkUrl = record.resumeLink?.trim() || "";
  const resumeDisplay = resumeLinkUrl || record.resumeFileName || "No Google Drive Link Provided";
  const notesDisplay = record.coverNote?.trim() || "No additional comments or availability notes provided.";

  const messageSummary = [
    `==================================================`,
    `   JOB APPLICATION SUBMISSION: TAB V&S GROUP`,
    `==================================================`,
    `Position Applied: ${record.jobTitle}`,
    `Reference ID:     ${record.referenceNumber}`,
    `Submitted At:     ${formattedDate}`,
    `Target Recipient: tabeng14@infotabvsgroup.com`,
    ``,
    `[1] CANDIDATE DETAILS`,
    `--------------------------------------------------`,
    `• Candidate Name:      ${record.fullName}`,
    `• Email Address:       ${record.email}`,
    `• Phone Number:        ${record.phone}`,
    `• Current City / Area: ${record.currentCity || "Not Provided"}`,
    `• Experience Level:    ${record.experienceLevel || "Entry Level (0–1 Year)"}`,
    ``,
    `[2] RESUME & QUALIFICATIONS`,
    `--------------------------------------------------`,
    `• Google Drive Link:   ${resumeDisplay}`,
    `• Cover Note / Notes:`,
    notesDisplay,
    ``,
    `[3] CONSENT`,
    `--------------------------------------------------`,
    `• Privacy Consent:     ${record.privacyConsent ? "Agreed (100% Free Placement Consent)" : "Declined"}`,
    `==================================================`,
  ].join("\n");

  const htmlSummary = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; background-color: #ffffff; border: 1px solid #E8ECF1; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
  <div style="background-color: #0B1F3A; padding: 24px 30px; border-bottom: 4px solid #F47B20;">
    <p style="margin: 0; color: #F47B20; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">TAB V&S GROUP • JOB APPLICATION</p>
    <h1 style="margin: 8px 0 0 0; color: #ffffff; font-size: 22px; font-weight: 700;">${escapeHtml(record.jobTitle)}</h1>
    <p style="margin: 6px 0 0 0; color: #98A2B3; font-size: 13px;">Ref: <strong style="color: #ffffff;">${escapeHtml(record.referenceNumber)}</strong> • Submitted: ${escapeHtml(formattedDate)}</p>
  </div>

  <div style="padding: 24px 30px;">
    <!-- Recipient Banner -->
    <div style="background-color: #FFF1E5; border-left: 4px solid #F47B20; padding: 12px 16px; border-radius: 4px; margin-bottom: 24px;">
      <p style="margin: 0; font-size: 13px; color: #0B1F3A;"><strong>Destination:</strong> This application was submitted for <strong>tabeng14@infotabvsgroup.com</strong>.</p>
    </div>

    <!-- Candidate Information -->
    <div style="margin-bottom: 24px;">
      <h2 style="font-size: 15px; text-transform: uppercase; letter-spacing: 1px; color: #0B1F3A; border-bottom: 2px solid #F7F8FA; padding-bottom: 8px; margin-bottom: 12px;">Candidate Profile</h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr>
          <td style="padding: 6px 0; color: #667085; width: 35%;">Full Name:</td>
          <td style="padding: 6px 0; color: #0B1F3A; font-weight: 600;">${escapeHtml(record.fullName)}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #667085;">Email Address:</td>
          <td style="padding: 6px 0; color: #0B1F3A;"><a href="mailto:${escapeHtml(record.email)}" style="color: #F47B20; font-weight: 600; text-decoration: none;">${escapeHtml(record.email)}</a></td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #667085;">Phone Number:</td>
          <td style="padding: 6px 0; color: #0B1F3A;"><a href="tel:${escapeHtml(record.phone)}" style="color: #0B1F3A; text-decoration: none;">${escapeHtml(record.phone)}</a></td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #667085;">Current City / Area:</td>
          <td style="padding: 6px 0; color: #0B1F3A;">${escapeHtml(record.currentCity || "Not Provided")}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #667085;">Relevant Experience:</td>
          <td style="padding: 6px 0; color: #0B1F3A;"><span style="display: inline-block; background-color: #E8F8F0; color: #059669; padding: 2px 8px; border-radius: 4px; font-weight: 600; font-size: 12px;">${escapeHtml(record.experienceLevel || "Entry Level")}</span></td>
        </tr>
      </table>
    </div>

    <!-- Resume Link Box -->
    <div style="margin-bottom: 24px; background-color: #F7F8FA; border: 1px solid #E8ECF1; border-radius: 8px; padding: 16px;">
      <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 700; text-transform: uppercase; color: #667085;">Google Drive Resume Link:</p>
      ${resumeLinkUrl ? `<a href="${escapeHtml(resumeLinkUrl)}" target="_blank" style="display: inline-block; background-color: #F47B20; color: #ffffff; padding: 8px 16px; border-radius: 6px; font-weight: 600; font-size: 13px; text-decoration: none;">📄 Open Resume Link &rarr;</a><div style="margin-top: 8px; font-size: 12px; color: #667085; word-break: break-all;">${escapeHtml(resumeLinkUrl)}</div>` : `<p style="margin: 0; color: #667085; font-size: 13px;">${escapeHtml(resumeDisplay)}</p>`}
    </div>

    <!-- Cover Note -->
    <div style="margin-bottom: 24px;">
      <h2 style="font-size: 15px; text-transform: uppercase; letter-spacing: 1px; color: #0B1F3A; border-bottom: 2px solid #F7F8FA; padding-bottom: 8px; margin-bottom: 12px;">Cover Note / Qualifications</h2>
      <div style="background-color: #F7F8FA; border-left: 3px solid #0B1F3A; padding: 14px 18px; border-radius: 0 6px 6px 0;">
        <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #344054; white-space: pre-wrap;">${escapeHtml(notesDisplay)}</p>
      </div>
    </div>
  </div>

  <div style="background-color: #F7F8FA; padding: 16px 30px; border-top: 1px solid #E8ECF1; text-align: center;">
    <p style="margin: 0; font-size: 12px; color: #98A2B3;">TAB V&S Group Recruitment Agency • Automated System Dispatch to tabeng14@infotabvsgroup.com</p>
  </div>
</div>
`.trim();

  const templateParams: Record<string, unknown> = {
    // Direct Routing to tabeng14@infotabvsgroup.com
    to_email: "tabeng14@infotabvsgroup.com",
    recipient_email: "tabeng14@infotabvsgroup.com",
    target_email: "tabeng14@infotabvsgroup.com",
    admin_email: "tabeng14@infotabvsgroup.com",
    to: "tabeng14@infotabvsgroup.com",
    to_name: "Sandeep Sapare",

    // Subject
    subject: `🚨 [Job Application] ${record.jobTitle} — ${record.fullName} [Ref: ${record.referenceNumber}]`,
    email_subject: `🚨 [Job Application] ${record.jobTitle} — ${record.fullName} [Ref: ${record.referenceNumber}]`,

    // Custom form fields matching our EmailJS template
    job_title: record.jobTitle,
    job_id: record.jobId,
    job_industry: record.jobIndustry,
    job_location: record.jobLocation,
    position_title: record.jobTitle,
    full_name: record.fullName,
    fullName: record.fullName,
    name: record.fullName,
    contact_person: record.fullName,
    email: record.email,
    reply_to: record.email,
    business_email: record.email,
    phone: record.phone,
    phone_number: record.phone,
    current_city: record.currentCity || "Not Provided",
    experience_level: record.experienceLevel || "Entry Level (0–1 Year)",
    required_experience: record.experienceLevel || "Entry Level (0–1 Year)",
    resume_link: resumeLinkUrl,
    resume_url: resumeLinkUrl,
    resume_file_name: resumeDisplay,
    cover_note: notesDisplay,
    job_description: notesDisplay,
    privacy_consent: record.privacyConsent ? "Agreed (100% Free Placement Consent)" : "Declined",
    reference_number: record.referenceNumber,
    submitted_at: formattedDate,

    // Default EmailJS variables fallback
    from_name: `${record.fullName} (Applicant: ${record.jobTitle})`,
    message: messageSummary,
    html_message: htmlSummary,
    message_html: htmlSummary,
    details_html: htmlSummary,
    content: messageSummary,
    user_email: record.email,
    user_name: record.fullName,
  };

  const primaryTemplateId = customConfig?.templateId || EMAILJS_CONFIG.templateId;
  let result = await sendEmailJS(templateParams, {
    ...customConfig,
    templateId: primaryTemplateId,
  });

  if (!result.success && EMAILJS_CONFIG.staffingTemplateId && EMAILJS_CONFIG.staffingTemplateId !== primaryTemplateId) {
    console.warn(
      `[EmailJS Job Application] Primary template (${primaryTemplateId}) failed. Retrying with fallback template (${EMAILJS_CONFIG.staffingTemplateId})...`
    );
    const fallbackResult = await sendEmailJS(templateParams, {
      ...customConfig,
      templateId: EMAILJS_CONFIG.staffingTemplateId,
    });
    if (fallbackResult.success) {
      result = fallbackResult;
    }
  }

  return result;
}

/**
 * Sends a General Resume Submission email.
 */
export async function sendResumeSubmissionEmail(
  record: StoredResumeSubmission,
  customConfig?: Partial<EmailJSConfig>
): Promise<EmailJSSendResult> {
  const formattedDate = new Date(record.submittedAt).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const resumeLinkUrl = record.resumeLink?.trim() || "";
  const resumeDisplay = resumeLinkUrl || record.resumeFileName || "Resume Link Attached";
  const summaryDisplay = record.resumeSummary || "None provided";

  const messageSummary = [
    `==================================================`,
    `   GENERAL RESUME SUBMISSION: TAB V&S GROUP`,
    `==================================================`,
    `Industry Interest: ${record.industry}`,
    `Desired Position:  ${record.desiredPosition || "General Direct-Hire Placement"}`,
    `Reference ID:      ${record.referenceNumber}`,
    `Submitted At:      ${formattedDate}`,
    `Target Recipient:  tabeng14@infotabvsgroup.com`,
    ``,
    `[1] CANDIDATE DETAILS`,
    `--------------------------------------------------`,
    `• Candidate Name:    ${record.fullName}`,
    `• Email Address:     ${record.email}`,
    `• Phone Number:      ${record.phone}`,
    `• Experience:        ${record.experience}`,
    `• Desired Position:  ${record.desiredPosition || "Open to relevant opportunities"}`,
    ``,
    `[2] RESUME LINK & PROFILE`,
    `--------------------------------------------------`,
    `• Google Drive Link: ${resumeDisplay}`,
    `• Profile Summary:`,
    summaryDisplay,
    ``,
    `[3] CONSENT`,
    `--------------------------------------------------`,
    `• Privacy Consent:   ${record.privacyConsent ? "Agreed" : "Declined"}`,
    `==================================================`,
  ].join("\n");

  const htmlSummary = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; background-color: #ffffff; border: 1px solid #E8ECF1; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
  <div style="background-color: #0B1F3A; padding: 24px 30px; border-bottom: 4px solid #F47B20;">
    <p style="margin: 0; color: #F47B20; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">TAB V&S GROUP • RESUME SUBMISSION</p>
    <h1 style="margin: 8px 0 0 0; color: #ffffff; font-size: 22px; font-weight: 700;">General Candidate Talent Pool</h1>
    <p style="margin: 6px 0 0 0; color: #98A2B3; font-size: 13px;">Ref: <strong style="color: #ffffff;">${escapeHtml(record.referenceNumber)}</strong> • Submitted: ${escapeHtml(formattedDate)}</p>
  </div>

  <div style="padding: 24px 30px;">
    <!-- Recipient Banner -->
    <div style="background-color: #FFF1E5; border-left: 4px solid #F47B20; padding: 12px 16px; border-radius: 4px; margin-bottom: 24px;">
      <p style="margin: 0; font-size: 13px; color: #0B1F3A;"><strong>Destination:</strong> This resume was submitted for <strong>tabeng14@infotabvsgroup.com</strong>.</p>
    </div>

    <!-- Candidate Profile -->
    <div style="margin-bottom: 24px;">
      <h2 style="font-size: 15px; text-transform: uppercase; letter-spacing: 1px; color: #0B1F3A; border-bottom: 2px solid #F7F8FA; padding-bottom: 8px; margin-bottom: 12px;">Candidate Profile</h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr>
          <td style="padding: 6px 0; color: #667085; width: 35%;">Full Name:</td>
          <td style="padding: 6px 0; color: #0B1F3A; font-weight: 600;">${escapeHtml(record.fullName)}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #667085;">Email Address:</td>
          <td style="padding: 6px 0; color: #0B1F3A;"><a href="mailto:${escapeHtml(record.email)}" style="color: #F47B20; font-weight: 600; text-decoration: none;">${escapeHtml(record.email)}</a></td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #667085;">Phone Number:</td>
          <td style="padding: 6px 0; color: #0B1F3A;"><a href="tel:${escapeHtml(record.phone)}" style="color: #0B1F3A; text-decoration: none;">${escapeHtml(record.phone)}</a></td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #667085;">Industry Interest:</td>
          <td style="padding: 6px 0; color: #0B1F3A; font-weight: 600;">${escapeHtml(record.industry)}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #667085;">Desired Position:</td>
          <td style="padding: 6px 0; color: #F47B20; font-weight: 600;">${escapeHtml(record.desiredPosition || "Open to relevant opportunities")}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #667085;">Experience Level:</td>
          <td style="padding: 6px 0; color: #0B1F3A;"><span style="display: inline-block; background-color: #E8F8F0; color: #059669; padding: 2px 8px; border-radius: 4px; font-weight: 600; font-size: 12px;">${escapeHtml(record.experience)}</span></td>
        </tr>
      </table>
    </div>

    <!-- Resume Link Box -->
    <div style="margin-bottom: 24px; background-color: #F7F8FA; border: 1px solid #E8ECF1; border-radius: 8px; padding: 16px;">
      <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 700; text-transform: uppercase; color: #667085;">Google Drive Resume Link:</p>
      ${resumeLinkUrl ? `<a href="${escapeHtml(resumeLinkUrl)}" target="_blank" style="display: inline-block; background-color: #F47B20; color: #ffffff; padding: 8px 16px; border-radius: 6px; font-weight: 600; font-size: 13px; text-decoration: none;">📄 Open Resume Link &rarr;</a><div style="margin-top: 8px; font-size: 12px; color: #667085; word-break: break-all;">${escapeHtml(resumeLinkUrl)}</div>` : `<p style="margin: 0; color: #667085; font-size: 13px;">${escapeHtml(resumeDisplay)}</p>`}
    </div>

    <!-- Profile Summary -->
    <div style="margin-bottom: 24px;">
      <h2 style="font-size: 15px; text-transform: uppercase; letter-spacing: 1px; color: #0B1F3A; border-bottom: 2px solid #F7F8FA; padding-bottom: 8px; margin-bottom: 12px;">Candidate Summary</h2>
      <div style="background-color: #F7F8FA; border-left: 3px solid #0B1F3A; padding: 14px 18px; border-radius: 0 6px 6px 0;">
        <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #344054; white-space: pre-wrap;">${escapeHtml(summaryDisplay)}</p>
      </div>
    </div>
  </div>

  <div style="background-color: #F7F8FA; padding: 16px 30px; border-top: 1px solid #E8ECF1; text-align: center;">
    <p style="margin: 0; font-size: 12px; color: #98A2B3;">TAB V&S Group Recruitment Agency • Automated System Dispatch to tabeng14@infotabvsgroup.com</p>
  </div>
</div>
`.trim();

  const templateParams: Record<string, unknown> = {
    // Direct Routing to tabeng14@infotabvsgroup.com
    to_email: "tabeng14@infotabvsgroup.com",
    recipient_email: "tabeng14@infotabvsgroup.com",
    target_email: "tabeng14@infotabvsgroup.com",
    admin_email: "tabeng14@infotabvsgroup.com",
    to: "tabeng14@infotabvsgroup.com",
    to_name: "Sandeep Sapare",

    // Subject
    subject: `🚨 [Resume Submission] ${record.fullName} — ${record.industry} [Ref: ${record.referenceNumber}]`,
    email_subject: `🚨 [Resume Submission] ${record.fullName} — ${record.industry} [Ref: ${record.referenceNumber}]`,

    full_name: record.fullName,
    fullName: record.fullName,
    name: record.fullName,
    contact_person: record.fullName,
    email: record.email,
    business_email: record.email,
    reply_to: record.email,
    phone: record.phone,
    phone_number: record.phone,
    industry: record.industry,
    service_display_name: record.industry,
    desired_position: record.desiredPosition || "Open to relevant opportunities",
    position_title: record.desiredPosition || "General Direct-Hire Placement",
    experience: record.experience,
    required_experience: record.experience,
    resume_link: resumeLinkUrl,
    resume_url: resumeLinkUrl,
    resume_file_name: resumeDisplay,
    resume_summary: summaryDisplay,
    job_description: summaryDisplay,
    privacy_consent: record.privacyConsent ? "Agreed" : "Declined",
    reference_number: record.referenceNumber,
    submitted_at: formattedDate,

    from_name: `${record.fullName} (Resume: ${record.industry})`,
    message: messageSummary,
    html_message: htmlSummary,
    message_html: htmlSummary,
    details_html: htmlSummary,
    content: messageSummary,
    user_email: record.email,
    user_name: record.fullName,
  };

  const primaryTemplateId = customConfig?.templateId || EMAILJS_CONFIG.templateId;
  let result = await sendEmailJS(templateParams, {
    ...customConfig,
    templateId: primaryTemplateId,
  });

  if (!result.success && EMAILJS_CONFIG.staffingTemplateId && EMAILJS_CONFIG.staffingTemplateId !== primaryTemplateId) {
    console.warn(
      `[EmailJS Resume] Primary template (${primaryTemplateId}) failed. Retrying with fallback template (${EMAILJS_CONFIG.staffingTemplateId})...`
    );
    const fallbackResult = await sendEmailJS(templateParams, {
      ...customConfig,
      templateId: EMAILJS_CONFIG.staffingTemplateId,
    });
    if (fallbackResult.success) {
      result = fallbackResult;
    }
  }

  return result;
}

/**
 * Sends a Contact Message / Inquiry email.
 * Sends contact-only fields through the contact inquiry template.
 */
export async function sendContactInquiryEmail(
  record: StoredContactInquiry,
  customConfig?: Partial<EmailJSConfig>
): Promise<EmailJSSendResult> {
  const formattedDate = new Date(record.submittedAt).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  // Plain-Text formatted breakdown
  const messageSummary = [
    `==================================================`,
    `   CONTACT INQUIRY FORM: TAB V&S GROUP`,
    `==================================================`,
    `Reference Number: ${record.referenceNumber}`,
    `Submitted At:     ${formattedDate}`,
    `Target Recipient: tabeng14@infotabvsgroup.com`,
    ``,
    `[1] SENDER DETAILS`,
    `--------------------------------------------------`,
    `• Full Name:      ${record.fullName}`,
    `• Email Address:  ${record.emailAddress}`,
    `• Phone Number:   ${record.phoneNumber}`,
    `• User Role:      ${record.userType}`,
    ``,
    `[2] INQUIRY DETAILS`,
    `--------------------------------------------------`,
    `• Topic / Area:   ${record.inquiryType}`,
    `• Subject:        ${record.subject}`,
    ``,
    `[3] MESSAGE CONTENT`,
    `--------------------------------------------------`,
    record.message,
    ``,
    ...(record.resumeDriveLink
      ? [
        `[4] RESUME`,
        `--------------------------------------------------`,
        `• Google Drive Resume Link: ${record.resumeDriveLink}`,
        ``,
      ]
      : []),
    `[${record.resumeDriveLink ? "5" : "4"}] CONSENT`,
    `--------------------------------------------------`,
    `• Privacy Consent: ${record.privacyConsent ? "Agreed" : "Declined"}`,
    `==================================================`,
  ].join("\n");

  // Rich HTML formatted card (renders automatically if template uses {{{html_message}}})
  const htmlSummary = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; background-color: #ffffff; border: 1px solid #E8ECF1; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
  <div style="background-color: #0B1F3A; padding: 24px 30px; border-bottom: 4px solid #F47B20;">
    <p style="margin: 0; color: #F47B20; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">TAB V&S GROUP • CONTACT INQUIRY</p>
    <h1 style="margin: 8px 0 0 0; color: #ffffff; font-size: 22px; font-weight: 700;">New Contact Form Message</h1>
    <p style="margin: 6px 0 0 0; color: #98A2B3; font-size: 13px;">Ref: <strong style="color: #ffffff;">${escapeHtml(record.referenceNumber)}</strong> • Submitted: ${escapeHtml(formattedDate)}</p>
  </div>

  <div style="padding: 24px 30px;">
    <!-- Recipient Banner -->
    <div style="background-color: #FFF1E5; border-left: 4px solid #F47B20; padding: 12px 16px; border-radius: 4px; margin-bottom: 24px;">
      <p style="margin: 0; font-size: 13px; color: #0B1F3A;"><strong>Destination:</strong> This inquiry was submitted for <strong>tabeng14@infotabvsgroup.com</strong>.</p>
    </div>

    <!-- Sender Details -->
    <div style="margin-bottom: 24px;">
      <h2 style="font-size: 15px; text-transform: uppercase; letter-spacing: 1px; color: #0B1F3A; border-bottom: 2px solid #F7F8FA; padding-bottom: 8px; margin-bottom: 12px;">1. Sender Details</h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr>
          <td style="padding: 6px 0; color: #667085; width: 35%;">Full Name:</td>
          <td style="padding: 6px 0; color: #0B1F3A; font-weight: 600;">${escapeHtml(record.fullName)}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #667085;">Email Address:</td>
          <td style="padding: 6px 0; color: #0B1F3A;"><a href="mailto:${escapeHtml(record.emailAddress)}" style="color: #F47B20; font-weight: 600; text-decoration: none;">${escapeHtml(record.emailAddress)}</a></td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #667085;">Phone Number:</td>
          <td style="padding: 6px 0; color: #0B1F3A;"><a href="tel:${escapeHtml(record.phoneNumber)}" style="color: #0B1F3A; text-decoration: none;">${escapeHtml(record.phoneNumber)}</a></td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #667085;">User Role (I Am A):</td>
          <td style="padding: 6px 0; color: #0B1F3A;"><span style="display: inline-block; background-color: #0B1F3A; color: #ffffff; padding: 3px 10px; border-radius: 4px; font-weight: 600; font-size: 12px;">${escapeHtml(record.userType)}</span></td>
        </tr>
      </table>
    </div>

    <!-- Inquiry Details -->
    <div style="margin-bottom: 24px;">
      <h2 style="font-size: 15px; text-transform: uppercase; letter-spacing: 1px; color: #0B1F3A; border-bottom: 2px solid #F7F8FA; padding-bottom: 8px; margin-bottom: 12px;">2. Inquiry Details</h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr>
          <td style="padding: 6px 0; color: #667085; width: 35%;">Inquiry Type:</td>
          <td style="padding: 6px 0; color: #0B1F3A; font-weight: 600;">${escapeHtml(record.inquiryType)}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #667085;">Subject:</td>
          <td style="padding: 6px 0; color: #F47B20; font-weight: 700; font-size: 15px;">${escapeHtml(record.subject)}</td>
        </tr>
      </table>

      ${record.resumeDriveLink ? `<div style="margin-top: 16px; padding: 14px 18px; background-color: #FFF1E5; border-radius: 6px;"><strong style="color: #0B1F3A;">Google Drive Resume:</strong> <a href="${escapeHtml(record.resumeDriveLink)}" target="_blank" rel="noopener noreferrer" style="color: #F47B20; word-break: break-all;">${escapeHtml(record.resumeDriveLink)}</a></div>` : ""}

      <!-- Message Content -->
      <div style="margin-top: 16px; background-color: #F7F8FA; border-left: 3px solid #0B1F3A; padding: 14px 18px; border-radius: 0 6px 6px 0;">
        <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 700; text-transform: uppercase; color: #667085;">Message Content:</p>
        <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #344054; white-space: pre-wrap;">${escapeHtml(record.message)}</p>
      </div>
    </div>

    <!-- Consent -->
    <div style="margin-bottom: 16px;">
      <p style="margin: 0; font-size: 13px; color: #667085;">Privacy Policy Consent: <strong style="color: #059669;">${record.privacyConsent ? "Agreed" : "Declined"}</strong></p>
    </div>
  </div>

  <div style="background-color: #F7F8FA; padding: 16px 30px; border-top: 1px solid #E8ECF1; text-align: center;">
    <p style="margin: 0; font-size: 12px; color: #98A2B3;">TAB V&S Group Recruitment Agency • Automated System Dispatch to tabeng14@infotabvsgroup.com</p>
  </div>
</div>
`.trim();

  // Contact-specific template parameters for template_un8tzws.
  const templateParams: Record<string, unknown> = {
    // Direct routing to tabeng14@infotabvsgroup.com
    to_email: "tabeng14@infotabvsgroup.com",
    recipient_email: "tabeng14@infotabvsgroup.com",
    target_email: "tabeng14@infotabvsgroup.com",
    admin_email: "tabeng14@infotabvsgroup.com",
    to: "tabeng14@infotabvsgroup.com",
    to_name: "Sandeep Sapare",

    // Subject lines
    subject: `🚨 [Contact Inquiry] ${record.subject} — ${record.fullName} (${record.userType}) [Ref: ${record.referenceNumber}]`,
    email_subject: `🚨 [Contact Inquiry] ${record.subject} — ${record.fullName} (${record.userType}) [Ref: ${record.referenceNumber}]`,

    // Sender identifiers
    from_name: `${record.fullName} (${record.userType})`,
    from_email: record.emailAddress,
    sender_email: record.emailAddress,
    client_email: record.emailAddress,
    email: record.emailAddress,
    email_address: record.emailAddress,
    emailAddress: record.emailAddress,
    reply_to: record.emailAddress,
    user_email: record.emailAddress,
    user_name: record.fullName,

    // Contact person & Phone
    full_name: record.fullName,
    fullName: record.fullName,
    name: record.fullName,
    phone: record.phoneNumber,
    phone_number: record.phoneNumber,
    phoneNumber: record.phoneNumber,

    // Role & Classification
    user_type: record.userType,
    userType: record.userType,
    role: record.userType,

    // Contact inquiry details
    inquiry_type: record.inquiryType,
    inquiryType: record.inquiryType,
    inquiry_subject: record.subject,
    ...(record.resumeDriveLink
      ? {
        resume_drive_link: record.resumeDriveLink,
        resume_link: record.resumeDriveLink,
      }
      : {}),

    // Body content (Plain text & Rich HTML)
    message: messageSummary,
    html_message: htmlSummary,
    message_html: htmlSummary,
    details_html: htmlSummary,
    message_body: record.message,
    inquiry_message: record.message,
    notes: record.message,
    content: messageSummary,

    // Tracking & Consent
    reference_number: record.referenceNumber,
    referenceNumber: record.referenceNumber,
    ref_id: record.referenceNumber,
    submitted_at: formattedDate,
    submittedAt: formattedDate,
    date: formattedDate,
    privacy_consent: record.privacyConsent ? "Agreed" : "Declined",
    privacyConsent: record.privacyConsent ? "Agreed" : "Declined",
  };

  const primaryTemplateId = (
    customConfig?.templateId || EMAILJS_CONFIG.contactTemplateId || "template_un8tzws"
  )?.trim();

  return sendEmailJS(templateParams, {
    ...customConfig,
    templateId: primaryTemplateId,
  });
}

/**
 * Sends an Employer / Request Staffing Inquiry email.
 */
export async function sendStaffingInquiryEmail(
  record: StoredStaffingInquiry,
  customConfig?: Partial<EmailJSConfig>
): Promise<EmailJSSendResult> {
  const formattedDate = new Date(record.submittedAt).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const websiteDisplay = record.companyWebsite?.trim() || "Not Provided";
  const notesDisplay = record.additionalMessage?.trim() || "None provided";

  // Plain Text formatted summary
  const messageSummary = [
    `==================================================`,
    `   EMPLOYER INTAKE FORM: STAFFING & HIRING REQUIREMENTS`,
    `==================================================`,
    `Reference Number: ${record.referenceNumber}`,
    `Submitted At:     ${formattedDate}`,
    `Target Recipient: tabeng14@infotabvsgroup.com`,
    ``,
    `[1] COMPANY INFORMATION`,
    `--------------------------------------------------`,
    `• Company Name:        ${record.companyName}`,
    `• Company Website:     ${websiteDisplay}`,
    `• Industry Sector:     ${record.industry}`,
    `• Primary Location:    ${record.companyLocation}`,
    ``,
    `[2] CONTACT INFORMATION`,
    `--------------------------------------------------`,
    `• Contact Person:      ${record.contactPerson}`,
    `• Job Title / Role:    ${record.jobTitle}`,
    `• Business Email:      ${record.businessEmail}`,
    `• Phone Number:        ${record.phoneNumber}`,
    `• Preferred Contact:   ${record.preferredContactMethod}`,
    ``,
    `[3] HIRING REQUIREMENTS`,
    `--------------------------------------------------`,
    `• Service Category:    ${record.serviceDisplayName}`,
    `• Target Position:     ${record.positionTitle}`,
    `• Personnel Required:  ${record.employeeCount}`,
    `• Employment Type:     ${record.employmentType}`,
    `• Required Experience: ${record.requiredExperience}`,
    `• Expected Timeline:   ${record.expectedTimeline}`,
    ``,
    `• Job Description & Candidate Requirements:`,
    record.jobDescription,
    ``,
    `[4] ADDITIONAL INFORMATION & CONSENT`,
    `--------------------------------------------------`,
    `• Additional Notes:    ${notesDisplay}`,
    `• Privacy Consent:     ${record.privacyConsent ? "Agreed" : "Declined"}`,
    `==================================================`,
  ].join("\n");

  // Rich HTML formatted summary (renders beautifully in Gmail and webmail)
  const htmlSummary = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; background-color: #ffffff; border: 1px solid #E8ECF1; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
  <div style="background-color: #0B1F3A; padding: 24px 30px; border-bottom: 4px solid #F47B20;">
    <p style="margin: 0; color: #F47B20; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">TAB V&S GROUP • EMPLOYER INTAKE</p>
    <h1 style="margin: 8px 0 0 0; color: #ffffff; font-size: 22px; font-weight: 700;">New Staffing & Hiring Requirements</h1>
    <p style="margin: 6px 0 0 0; color: #98A2B3; font-size: 13px;">Ref: <strong style="color: #ffffff;">${escapeHtml(record.referenceNumber)}</strong> • Submitted: ${escapeHtml(formattedDate)}</p>
  </div>

  <div style="padding: 24px 30px;">
    <!-- Recipient Banner -->
    <div style="background-color: #FFF1E5; border-left: 4px solid #F47B20; padding: 12px 16px; border-radius: 4px; margin-bottom: 24px;">
      <p style="margin: 0; font-size: 13px; color: #0B1F3A;"><strong>Destination:</strong> This request was submitted for <strong>tabeng14@infotabvsgroup.com</strong>.</p>
    </div>

    <!-- Section 1: Company Information -->
    <div style="margin-bottom: 24px;">
      <h2 style="font-size: 15px; text-transform: uppercase; letter-spacing: 1px; color: #0B1F3A; border-bottom: 2px solid #F7F8FA; padding-bottom: 8px; margin-bottom: 12px;">1. Company Information</h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr>
          <td style="padding: 6px 0; color: #667085; width: 35%;">Company Name:</td>
          <td style="padding: 6px 0; color: #0B1F3A; font-weight: 600;">${escapeHtml(record.companyName)}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #667085;">Company Website:</td>
          <td style="padding: 6px 0; color: #0B1F3A;">${record.companyWebsite ? `<a href="${escapeHtml(record.companyWebsite)}" style="color: #F47B20; text-decoration: underline;" target="_blank">${escapeHtml(record.companyWebsite)}</a>` : '<span style="color: #98A2B3;">Not Provided</span>'}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #667085;">Industry Sector:</td>
          <td style="padding: 6px 0; color: #0B1F3A; font-weight: 500;">${escapeHtml(record.industry)}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #667085;">Primary Work Location:</td>
          <td style="padding: 6px 0; color: #0B1F3A; font-weight: 500;">${escapeHtml(record.companyLocation)}</td>
        </tr>
      </table>
    </div>

    <!-- Section 2: Contact Information -->
    <div style="margin-bottom: 24px;">
      <h2 style="font-size: 15px; text-transform: uppercase; letter-spacing: 1px; color: #0B1F3A; border-bottom: 2px solid #F7F8FA; padding-bottom: 8px; margin-bottom: 12px;">2. Contact Information</h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr>
          <td style="padding: 6px 0; color: #667085; width: 35%;">Contact Person:</td>
          <td style="padding: 6px 0; color: #0B1F3A; font-weight: 600;">${escapeHtml(record.contactPerson)}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #667085;">Job Title / Role:</td>
          <td style="padding: 6px 0; color: #0B1F3A;">${escapeHtml(record.jobTitle)}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #667085;">Business Email:</td>
          <td style="padding: 6px 0; color: #0B1F3A;"><a href="mailto:${escapeHtml(record.businessEmail)}" style="color: #F47B20; font-weight: 600; text-decoration: none;">${escapeHtml(record.businessEmail)}</a></td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #667085;">Phone Number:</td>
          <td style="padding: 6px 0; color: #0B1F3A;"><a href="tel:${escapeHtml(record.phoneNumber)}" style="color: #0B1F3A; text-decoration: none;">${escapeHtml(record.phoneNumber)}</a></td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #667085;">Preferred Contact Method:</td>
          <td style="padding: 6px 0; color: #0B1F3A;"><span style="display: inline-block; background-color: #E8F8F0; color: #059669; padding: 2px 8px; border-radius: 4px; font-weight: 600; font-size: 12px;">${escapeHtml(record.preferredContactMethod)}</span></td>
        </tr>
      </table>
    </div>

    <!-- Section 3: Hiring Requirements -->
    <div style="margin-bottom: 24px;">
      <h2 style="font-size: 15px; text-transform: uppercase; letter-spacing: 1px; color: #0B1F3A; border-bottom: 2px solid #F7F8FA; padding-bottom: 8px; margin-bottom: 12px;">3. Hiring Requirements</h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr>
          <td style="padding: 6px 0; color: #667085; width: 35%;">Service Category:</td>
          <td style="padding: 6px 0; color: #0B1F3A; font-weight: 600;">${escapeHtml(record.serviceDisplayName)}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #667085;">Target Position / Job Title:</td>
          <td style="padding: 6px 0; color: #F47B20; font-weight: 700; font-size: 15px;">${escapeHtml(record.positionTitle)}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #667085;">Employees Required:</td>
          <td style="padding: 6px 0; color: #0B1F3A; font-weight: 600;">${escapeHtml(record.employeeCount)}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #667085;">Employment Type:</td>
          <td style="padding: 6px 0; color: #0B1F3A;">${escapeHtml(record.employmentType)}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #667085;">Required Experience:</td>
          <td style="padding: 6px 0; color: #0B1F3A;">${escapeHtml(record.requiredExperience)}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #667085;">Expected Timeline:</td>
          <td style="padding: 6px 0; color: #0B1F3A;"><span style="display: inline-block; background-color: #FFF1E5; color: #C25607; padding: 2px 8px; border-radius: 4px; font-weight: 600; font-size: 12px;">${escapeHtml(record.expectedTimeline)}</span></td>
        </tr>
      </table>

      <div style="margin-top: 12px; background-color: #F7F8FA; border-left: 3px solid #0B1F3A; padding: 12px 16px; border-radius: 0 6px 6px 0;">
        <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 700; text-transform: uppercase; color: #667085;">Job Description & Candidate Requirements:</p>
        <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #344054; white-space: pre-wrap;">${escapeHtml(record.jobDescription)}</p>
      </div>
    </div>

    <!-- Section 4: Additional Information -->
    <div style="margin-bottom: 24px;">
      <h2 style="font-size: 15px; text-transform: uppercase; letter-spacing: 1px; color: #0B1F3A; border-bottom: 2px solid #F7F8FA; padding-bottom: 8px; margin-bottom: 12px;">4. Additional Information & Consent</h2>
      <div style="background-color: #F7F8FA; padding: 12px 16px; border-radius: 6px; margin-bottom: 12px;">
        <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 700; text-transform: uppercase; color: #667085;">Additional Notes / Instructions:</p>
        <p style="margin: 0; font-size: 14px; color: #344054; white-space: pre-wrap;">${escapeHtml(notesDisplay)}</p>
      </div>
      <p style="margin: 0; font-size: 13px; color: #667085;">Privacy Consent: <strong style="color: #059669;">${record.privacyConsent ? "Agreed to Privacy Policy" : "Declined"}</strong></p>
    </div>
  </div>

  <div style="background-color: #F7F8FA; padding: 16px 30px; border-top: 1px solid #E8ECF1; text-align: center;">
    <p style="margin: 0; font-size: 12px; color: #98A2B3;">TAB V&S Group Recruitment Agency • Automated System Dispatch to tabeng14@infotabvsgroup.com</p>
  </div>
</div>
`.trim();

  const templateParams: Record<string, unknown> = {
    // Subject & Recipient Targeting (Direct to tabeng14@infotabvsgroup.com)
    subject: `🚨 Employer Staffing Request: ${record.companyName} — ${record.positionTitle} [Ref: ${record.referenceNumber}]`,
    email_subject: `🚨 Employer Staffing Request: ${record.companyName} — ${record.positionTitle} [Ref: ${record.referenceNumber}]`,
    to_email: "tabeng14@infotabvsgroup.com",
    recipient_email: "tabeng14@infotabvsgroup.com",
    target_email: "tabeng14@infotabvsgroup.com",
    admin_email: "tabeng14@infotabvsgroup.com",
    to: "tabeng14@infotabvsgroup.com",
    to_name: "Sandeep Sapare",

    // Sender details
    from_name: `${record.contactPerson} (${record.companyName})`,
    from_email: record.businessEmail,
    sender_email: record.businessEmail,
    client_email: record.businessEmail,
    business_email: record.businessEmail,
    businessEmail: record.businessEmail,
    reply_to: record.businessEmail,
    email: record.businessEmail,
    user_email: record.businessEmail,
    user_name: record.contactPerson,

    // Section 1: Company Information
    company_name: record.companyName,
    companyName: record.companyName,
    company: record.companyName,
    company_website: websiteDisplay,
    companyWebsite: websiteDisplay,
    website: websiteDisplay,
    industry: record.industry,
    industry_sector: record.industry,
    industrySector: record.industry,
    company_location: record.companyLocation,
    companyLocation: record.companyLocation,
    work_location: record.companyLocation,
    location: record.companyLocation,

    // Section 2: Contact Information
    contact_person: record.contactPerson,
    contactPerson: record.contactPerson,
    full_name: record.contactPerson,
    fullName: record.contactPerson,
    name: record.contactPerson,
    job_title: record.jobTitle,
    jobTitle: record.jobTitle,
    designation: record.jobTitle,
    contact_role: record.jobTitle,
    phone_number: record.phoneNumber,
    phoneNumber: record.phoneNumber,
    phone: record.phoneNumber,
    preferred_contact_method: record.preferredContactMethod,
    preferredContactMethod: record.preferredContactMethod,
    contact_method: record.preferredContactMethod,

    // Section 3: Hiring Requirements
    service_category: record.serviceCategory,
    serviceCategory: record.serviceCategory,
    service_display_name: record.serviceDisplayName,
    serviceDisplayName: record.serviceDisplayName,
    service_name: record.serviceDisplayName,
    recruitment_service: record.serviceDisplayName,
    position_title: record.positionTitle,
    positionTitle: record.positionTitle,
    target_position: record.positionTitle,
    role: record.positionTitle,
    job_role: record.positionTitle,
    employee_count: record.employeeCount,
    employeeCount: record.employeeCount,
    headcount: record.employeeCount,
    openings: record.employeeCount,
    employment_type: record.employmentType,
    employmentType: record.employmentType,
    required_experience: record.requiredExperience,
    requiredExperience: record.requiredExperience,
    experience: record.requiredExperience,
    expected_timeline: record.expectedTimeline,
    expectedTimeline: record.expectedTimeline,
    timeline: record.expectedTimeline,
    job_description: record.jobDescription,
    jobDescription: record.jobDescription,
    requirements: record.jobDescription,

    // Section 4: Additional Information & Consent
    additional_message: notesDisplay,
    additionalMessage: notesDisplay,
    notes: notesDisplay,
    comments: notesDisplay,
    privacy_consent: record.privacyConsent ? "Agreed" : "Declined",
    privacyConsent: record.privacyConsent ? "Agreed" : "Declined",

    // Tracking & Metadata
    reference_number: record.referenceNumber,
    referenceNumber: record.referenceNumber,
    ref_id: record.referenceNumber,
    submitted_at: formattedDate,
    submittedAt: formattedDate,
    date: formattedDate,

    // Formatted Body (Plain Text & HTML)
    message: messageSummary,
    html_message: htmlSummary,
    message_html: htmlSummary,
    details_html: htmlSummary,
    content: messageSummary,
  };

  const primaryTemplateId = (
    customConfig?.templateId || EMAILJS_CONFIG.staffingTemplateId || "template_fbf5fm6"
  )?.trim();

  return sendEmailJS(templateParams, {
    ...customConfig,
    templateId: primaryTemplateId,
  });
}
