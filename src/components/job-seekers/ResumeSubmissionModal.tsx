import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "@tanstack/react-router";
import {
  X,
  CheckCircle2,
  FileText,
  User,
  Mail,
  Phone,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  Check,
  Link2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  processResumeSubmission,
  validateResumeSubmission,
  StoredResumeSubmission,
  ResumeFormErrors,
} from "@/services/resume-submissions";
import { sendResumeSubmissionEmail } from "@/services/emailjs";

interface ResumeModalContextType {
  isOpen: boolean;
  openModal: (options?: { industry?: string; position?: string }) => void;
  closeModal: () => void;
}

const ResumeModalContext = createContext<ResumeModalContextType>({
  isOpen: false,
  openModal: () => {},
  closeModal: () => {},
});

export const useResumeModal = () => useContext(ResumeModalContext);

/** Helper to dispatch global window event or direct invoke to open resume modal from any component */
export function openResumeModal(options?: { industry?: string; position?: string }) {
  if (typeof window !== "undefined") {
    const customWindow = window as Window & {
      __TAB_OPEN_RESUME_MODAL__?: (opts?: { industry?: string; position?: string }) => void;
    };
    if (typeof customWindow.__TAB_OPEN_RESUME_MODAL__ === "function") {
      customWindow.__TAB_OPEN_RESUME_MODAL__(options);
    } else {
      window.dispatchEvent(
        new CustomEvent("open-resume-modal", { detail: options || {} }),
      );
    }
  }
}

export function ResumeModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialOptions, setInitialOptions] = useState<{ industry?: string; position?: string }>({});

  const openModal = (options?: { industry?: string; position?: string }) => {
    if (options) setInitialOptions(options);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const customWindow = window as Window & {
      __TAB_OPEN_RESUME_MODAL__?: (opts?: { industry?: string; position?: string }) => void;
    };
    customWindow.__TAB_OPEN_RESUME_MODAL__ = openModal;

    const handleCustomOpen = (e: CustomEvent<{ industry?: string; position?: string }>) => {
      openModal(e.detail);
    };

    window.addEventListener("open-resume-modal", handleCustomOpen as EventListener);

    // Global site-wide click interceptor: ensures ANY button/link titled "Submit Your Resume" opens the modal
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const clickable = target.closest("button, a") as HTMLElement | null;
      if (!clickable) return;

      // Do not intercept if clicking inside the open dialog itself
      if (clickable.closest("[role='dialog']")) return;
      if (clickable.hasAttribute("data-resume-contact")) return;

      const text = clickable.textContent?.trim();
      const hasAttr = clickable.hasAttribute("data-open-resume-modal");
      if (
        hasAttr ||
        (text &&
          (text === "Submit Your Resume" ||
            text === "Submit Your Resume →" ||
            text.startsWith("Submit Your Resume")))
      ) {
        e.preventDefault();
        e.stopPropagation();
        openModal();
      }
    };

    document.addEventListener("click", handleDocumentClick, { capture: true });

    return () => {
      delete customWindow.__TAB_OPEN_RESUME_MODAL__;
      window.removeEventListener("open-resume-modal", handleCustomOpen as EventListener);
      document.removeEventListener("click", handleDocumentClick, { capture: true });
    };
  }, []);

  return (
    <ResumeModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
      <ResumeSubmissionModal
        isOpen={isOpen}
        onClose={closeModal}
        initialIndustry={initialOptions.industry}
        initialPosition={initialOptions.position}
      />
    </ResumeModalContext.Provider>
  );
}

export interface ResumeModalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialIndustry?: string | undefined;
  initialPosition?: string | undefined;
}

export function ResumeSubmissionModal({
  isOpen,
  onClose,
  initialIndustry,
  initialPosition,
}: ResumeModalDialogProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <ResumeModalDialog
      isOpen={isOpen}
      onClose={onClose}
      initialIndustry={initialIndustry}
      initialPosition={initialPosition}
    />,
    document.body,
  );
}

function ResumeModalDialog({
  onClose,
  initialIndustry,
  initialPosition,
}: ResumeModalDialogProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    industry: initialIndustry || "Data Center Operations & Technician",
    desiredPosition: initialPosition || "",
    experience: "1–3 Years",
    resumeLink: "",
    resumeSummary: "",
    privacyConsent: false,
  });

  const [errors, setErrors] = useState<ResumeFormErrors & { resumeLink?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState<StoredResumeSubmission | null>(null);

  const modalContentRef = useRef<HTMLDivElement>(null);

  // Close on Escape key & disable body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name as keyof typeof errors];
        return copy;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let formattedResumeLink = formData.resumeLink.trim();
    if (formattedResumeLink && !/^https?:\/\//i.test(formattedResumeLink)) {
      formattedResumeLink = `https://${formattedResumeLink}`;
    }

    const validation = validateResumeSubmission({
      ...formData,
      resumeLink: formattedResumeLink || undefined,
    });

    const currentErrors: typeof errors = { ...validation.errors };
    if (!formattedResumeLink) {
      currentErrors.resumeLink = "Please provide your Google Drive resume link.";
    }

    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const record = processResumeSubmission({
        ...formData,
        resumeLink: formattedResumeLink,
        resumeFileName: formattedResumeLink,
      });
      await sendResumeSubmissionEmail(record);
      setSubmittedRecord(record);
    } catch {
      alert("An error occurred while submitting your resume. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmittedRecord(null);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-modal-title"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-y-auto bg-[#0B1F3A]/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalContentRef}
        className="relative w-full max-w-xl max-h-[92dvh] overflow-y-auto rounded-[20px] bg-white border border-[#E8ECF1] shadow-[0_24px_64px_rgba(11,31,58,0.24)] text-[#344054] animate-in zoom-in-95 duration-200"
      >
        {/* Close Button (X) */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-10 grid size-10 sm:size-9 place-items-center rounded-full bg-[#F7F8FA] text-[#667085] hover:bg-[#E8ECF1] hover:text-[#0B1F3A] transition-colors cursor-pointer"
        >
          <X className="size-4.5 stroke-[2.5]" />
        </button>

        {submittedRecord ? (
          /* =========================================================================
             SUBMITTED CONFIRMATION STATE ("Your resume has been submitted")
             ========================================================================= */
          <div className="p-8 sm:p-10 text-center animate-in fade-in duration-300">
            {/* Green Success Badge */}
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-[#10B981]/15 text-[#059669]">
              <CheckCircle2 className="size-10 stroke-[2.5]" />
            </div>

            <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#10B981]/10 px-3.5 py-1 text-xs font-semibold text-[#059669]">
              <Check className="size-3.5 stroke-[3]" />
              Submission Confirmed
            </span>

            <h3
              id="resume-modal-title"
              className="mt-3 text-2xl font-bold text-[#0B1F3A] sm:text-3xl"
            >
              Your Resume Has Been Submitted!
            </h3>

            <p className="mt-3 text-[15px] leading-relaxed text-[#344054]">
              Thank you, <strong className="text-[#0B1F3A]">{submittedRecord.fullName}</strong>. Your
              resume has been successfully received and cataloged into our direct-hire talent network.
              A recruitment specialist will review your qualifications and contact you within{" "}
              <strong>1 business day</strong>.
            </p>

            {/* Reference Box */}
            <div className="mt-6 rounded-[12px] border border-[#10B981]/30 bg-[#E8F8F0]/40 p-4 text-center">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#059669]">
                Application Reference ID
              </p>
              <p className="mt-1 font-mono text-xl font-bold tracking-wider text-[#0B1F3A]">
                {submittedRecord.referenceNumber}
              </p>
              <p className="mt-1 text-[12px] text-[#344054]/80">
                A confirmation has been sent to{" "}
                <span className="font-semibold text-[#0B1F3A]">{submittedRecord.email}</span>.
              </p>
            </div>

            {/* Submitted Summary Overview */}
            <div className="mt-5 rounded-[12px] border border-[#E8ECF1] bg-[#F7F8FA] p-4 text-left text-[13.5px]">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <span className="text-[#667085] block text-[11px] uppercase font-bold tracking-wider">
                    Candidate:
                  </span>
                  <span className="font-semibold text-[#0B1F3A]">{submittedRecord.fullName}</span>
                </div>
                <div>
                  <span className="text-[#667085] block text-[11px] uppercase font-bold tracking-wider">
                    Discipline:
                  </span>
                  <span className="font-semibold text-[#F47B20]">{submittedRecord.industry}</span>
                </div>
                <div className="col-span-2 pt-2 border-t border-[#E8ECF1]">
                  <span className="text-[#667085] block text-[11px] uppercase font-bold tracking-wider">
                    Google Drive Resume:
                  </span>
                  {submittedRecord.resumeLink ? (
                    <a
                      href={submittedRecord.resumeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-[#F47B20] hover:underline inline-flex items-center gap-1.5 mt-0.5"
                    >
                      <Link2 className="size-3.5" />
                      <span>View Google Drive Document ↗</span>
                    </a>
                  ) : (
                    <span className="font-medium text-[#0B1F3A] inline-flex items-center gap-1.5 mt-0.5">
                      <FileText className="size-3.5 text-[#F47B20]" />
                      {submittedRecord.resumeFileName || "Profile Summary Submitted"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                asChild
                className="w-full sm:w-auto h-11 px-6 rounded-[8px] bg-[#F47B20] hover:bg-[#e06d17] text-white text-[14px] font-semibold shadow-sm transition-all"
              >
                <Link to="/jobs" onClick={handleResetAndClose}>
                  Explore Available Jobs <ArrowRight className="size-4 ml-1.5" />
                </Link>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleResetAndClose}
                className="w-full sm:w-auto h-11 px-6 rounded-[8px] border-[#D0D5DD] text-[#344054] hover:bg-[#F7F8FA] text-[14px] font-semibold"
              >
                Done / Close
              </Button>
            </div>
          </div>
        ) : (
          /* =========================================================================
             FORM STATE: Submit Your Resume
             ========================================================================= */
          <div className="p-6 sm:p-8">
            {/* Header */}
            <div>
              <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#F47B20]">
                CANDIDATE NETWORK • 100% FREE
              </span>
              <h3
                id="resume-modal-title"
                className="mt-1 text-2xl font-bold tracking-tight text-[#0B1F3A] sm:text-[28px]"
              >
                Submit Your Resume
              </h3>
              <p className="mt-1.5 text-[14px] leading-relaxed text-[#344054]">
                Share your credentials with our recruitment team to be matched with direct-hire career
                opportunities across our employer client network.
              </p>
            </div>

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-[13px] font-semibold text-[#0B1F3A] mb-1">
                  Full Name <span className="text-[#F47B20]">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#98A2B3]" />
                  <Input
                    name="fullName"
                    required
                    placeholder="e.g. Alex Morgan"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`pl-10 h-11 rounded-[8px] border-[#E8ECF1] text-[14px] focus-visible:ring-[#F47B20] ${
                      errors.fullName ? "border-red-500 bg-red-50/20" : ""
                    }`}
                  />
                </div>
                {errors.fullName && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{errors.fullName}</p>
                )}
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[13px] font-semibold text-[#0B1F3A] mb-1">
                    Email Address <span className="text-[#F47B20]">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#98A2B3]" />
                    <Input
                      type="email"
                      name="email"
                      required
                      placeholder="alex@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`pl-10 h-11 rounded-[8px] border-[#E8ECF1] text-[14px] focus-visible:ring-[#F47B20] ${
                        errors.email ? "border-red-500 bg-red-50/20" : ""
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600 font-medium">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-[#0B1F3A] mb-1">
                    Phone Number <span className="text-[#F47B20]">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#98A2B3]" />
                    <Input
                      type="tel"
                      name="phone"
                      required
                      placeholder="(380) 206-4792"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`pl-10 h-11 rounded-[8px] border-[#E8ECF1] text-[14px] focus-visible:ring-[#F47B20] ${
                        errors.phone ? "border-red-500 bg-red-50/20" : ""
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-600 font-medium">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Preferred Industry / Field */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[13px] font-semibold text-[#0B1F3A] mb-1">
                    Target Industry <span className="text-[#F47B20]">*</span>
                  </label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className="w-full h-11 px-3 rounded-[8px] border border-[#E8ECF1] bg-white text-[14px] text-[#0B1F3A] focus:outline-none focus:ring-2 focus:ring-[#F47B20] focus:border-transparent cursor-pointer"
                  >
                    <option value="Data Center Operations & Technician">
                      Data Center Operations & Technician
                    </option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Warehouse Associate Placement">
                      Warehouse Associate Placement
                    </option>
                    <option value="Healthcare Services Placement">
                      Healthcare Services Placement
                    </option>
                    <option value="Cleaning Services Placement">
                      Cleaning Services Placement
                    </option>
                    <option value="General Recruitment / Other">General Recruitment / Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-[#0B1F3A] mb-1">
                    Experience Level
                  </label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full h-11 px-3 rounded-[8px] border border-[#E8ECF1] bg-white text-[14px] text-[#0B1F3A] focus:outline-none focus:ring-2 focus:ring-[#F47B20] focus:border-transparent cursor-pointer"
                  >
                    <option value="Entry Level (0–1 Year)">Entry Level (0–1 Year)</option>
                    <option value="1–3 Years">1–3 Years Experience</option>
                    <option value="3–5 Years">3–5 Years Experience</option>
                    <option value="5+ Years">5+ Years Experience (Senior)</option>
                  </select>
                </div>
              </div>

              {/* Desired Position Title */}
              <div>
                <label className="block text-[13px] font-semibold text-[#0B1F3A] mb-1">
                  Target Job Title / Specialty (Optional)
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#98A2B3]" />
                  <Input
                    name="desiredPosition"
                    placeholder="e.g. Data Center Tech, IT Support, Inventory Specialist..."
                    value={formData.desiredPosition}
                    onChange={handleInputChange}
                    className="pl-10 h-11 rounded-[8px] border-[#E8ECF1] text-[14px] focus-visible:ring-[#F47B20]"
                  />
                </div>
              </div>

              {/* Google Drive Resume Link Input */}
              <div>
                <label className="block text-[13px] font-semibold text-[#0B1F3A] mb-1">
                  Upload Google Drive Resume Link <span className="text-[#F47B20]">*</span>
                </label>
                <div className="relative">
                  <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#98A2B3]" />
                  <Input
                    type="url"
                    name="resumeLink"
                    required
                    placeholder="https://drive.google.com/file/d/... or Google Drive link"
                    value={formData.resumeLink}
                    onChange={handleInputChange}
                    className={`pl-10 h-11 rounded-[8px] border-[#E8ECF1] text-[14px] focus-visible:ring-[#F47B20] ${
                      errors.resumeLink ? "border-red-500 bg-red-50/20" : ""
                    }`}
                  />
                </div>
                {errors.resumeLink ? (
                  <p className="mt-1 text-xs text-red-600 font-medium">{errors.resumeLink}</p>
                ) : (
                  <p className="mt-1.5 text-[11.5px] text-[#667085] flex items-center gap-1.5">
                    <span className="inline-block size-1.5 rounded-full bg-[#10B981] shrink-0" />
                    <span>Ensure Google Drive link access is set to <strong>"Anyone with the link can view"</strong></span>
                  </p>
                )}
              </div>

              {/* Brief Qualifications / Cover Note (Optional) */}
              <div>
                <label className="block text-[13px] font-semibold text-[#0B1F3A] mb-1">
                  Brief Skills or Note (Optional)
                </label>
                <Textarea
                  name="resumeSummary"
                  rows={2}
                  placeholder="Share certifications, key skills, or preferred shifts..."
                  value={formData.resumeSummary}
                  onChange={handleInputChange}
                  className="rounded-[8px] border-[#E8ECF1] text-[13.5px] resize-none focus-visible:ring-[#F47B20]"
                />
              </div>

              {/* Privacy Consent Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    name="privacyConsent"
                    checked={formData.privacyConsent}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, privacyConsent: e.target.checked }));
                      if (errors.privacyConsent) {
                        setErrors((prev) => {
                          const copy = { ...prev };
                          delete copy.privacyConsent;
                          return copy;
                        });
                      }
                    }}
                    className="mt-0.5 accent-[#F47B20] size-4 rounded cursor-pointer shrink-0"
                  />
                  <span className="text-[12.5px] leading-snug text-[#344054]">
                    I consent to TAB V&amp;S Group collecting and processing my resume and contact
                    details to evaluate career placement in accordance with the{" "}
                    <span className="font-semibold text-[#0B1F3A] underline">Privacy Policy</span>.{" "}
                    <span className="text-[#F47B20] font-bold">*</span>
                  </span>
                </label>
                {errors.privacyConsent && (
                  <p className="mt-1 text-xs text-red-600 font-medium">
                    {errors.privacyConsent}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-3 border-t border-[#E8ECF1]">
                <Button
                  type="submit"
                  disabled={!formData.privacyConsent || isSubmitting}
                  className="w-full h-12 rounded-[8px] bg-[#F47B20] hover:bg-[#e06d17] text-white font-semibold text-[15px] shadow-md transition-all hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#F47B20] disabled:hover:translate-y-0 disabled:shadow-none flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Submitting Your Resume...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Your Resume</span>
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </Button>
                <p className="mt-2 text-center text-[11.5px] text-[#667085] flex items-center justify-center gap-1.5">
                  <ShieldCheck className="size-3.5 text-[#10B981]" />
                  <span>100% Free for job seekers. Direct-hire placement network.</span>
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
