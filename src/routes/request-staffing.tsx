import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  Server,
  Monitor,
  Package,
  HeartPulse,
  Sparkles,
  ShieldCheck,
  Phone,
  Mail,
  Clock,
  MapPin,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import dc from "@/assets/svc-datacenter.jpg";
import it from "@/assets/svc-it.jpg";
import wh from "@/assets/svc-warehouse.jpg";
import hc from "@/assets/svc-healthcare.jpg";
import cl from "@/assets/svc-cleaning.jpg";
import {
  processStaffingInquiry,
  SERVICE_METADATA,
  ServiceKey,
  normalizeServiceKey,
  StaffingInquiryPayload,
  StaffingFormErrors,
  StoredStaffingInquiry,
  validateStaffingInquiry,
} from "@/services/staffing-inquiries";
import { sendStaffingInquiryEmail } from "@/services/emailjs";

type StaffingSearchParams = {
  service?: string | undefined;
};

export const Route = createFileRoute("/request-staffing")({
  validateSearch: (search: Record<string, unknown>): StaffingSearchParams => {
    const raw = search["service"];
    return {
      service: typeof raw === "string" ? raw : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Employer Staffing Request — TAB V&S Group" },
      {
        name: "description",
        content:
          "Submit your staffing requirements to TAB V&S Group Recruitment Agency. Direct-hire recruitment solutions across data centers, IT, warehousing, healthcare, and cleaning operations.",
      },
      { property: "og:title", content: "Employer Staffing Request — TAB V&S Group" },
      {
        property: "og:description",
        content:
          "Connect with qualified direct-hire talent. Submit your hiring requirements for personalized staffing support.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: RequestStaffingPage,
});

const serviceImages: Record<ServiceKey, string> = {
  "data-center": dc,
  it: it,
  warehouse: wh,
  healthcare: hc,
  cleaning: cl,
};

const serviceIcons: Record<ServiceKey, React.ComponentType<{ className?: string }>> = {
  "data-center": Server,
  it: Monitor,
  warehouse: Package,
  healthcare: HeartPulse,
  cleaning: Sparkles,
};

export default function RequestStaffingPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();

  // Selected Service State
  const initialService = normalizeServiceKey(search.service);
  const [selectedService, setSelectedService] = useState<ServiceKey>(initialService);

  // Sync state if URL query param changes
  useEffect(() => {
    const normalized = normalizeServiceKey(search.service);
    if (normalized !== selectedService) {
      setSelectedService(normalized);
      setFormData((prev) => ({ ...prev, serviceCategory: normalized }));
    }
  }, [search.service, selectedService]);

  // Form State
  const [formData, setFormData] = useState<StaffingInquiryPayload>({
    companyName: "",
    companyWebsite: "",
    industry: "",
    companyLocation: "",
    contactPerson: "",
    businessEmail: "",
    phoneNumber: "",
    jobTitle: "",
    serviceCategory: initialService,
    positionTitle: "",
    employeeCount: "",
    employmentType: "Direct-Hire Full-Time",
    requiredExperience: "",
    expectedTimeline: "",
    jobDescription: "",
    additionalMessage: "",
    preferredContactMethod: "Email",
    privacyConsent: false,
  });

  const [fieldErrors, setFieldErrors] = useState<StaffingFormErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<StoredStaffingInquiry | null>(null);

  // Keep form data service in sync with selectedService
  const handleServiceChange = (newService: ServiceKey) => {
    setSelectedService(newService);
    setFormData((prev) => ({ ...prev, serviceCategory: newService }));
    // Update URL query parameter without full reload using exact canonical parameter names
    const paramMapping: Record<ServiceKey, string> = {
      "data-center": "data-center",
      it: "information-technology",
      warehouse: "warehouse",
      healthcare: "healthcare",
      cleaning: "cleaning",
    };
    navigate({
      to: "/request-staffing",
      search: { service: paramMapping[newService] },
      replace: true,
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const errorKey = name as keyof StaffingInquiryPayload;
    if (fieldErrors[errorKey]) {
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy[errorKey];
        return copy;
      });
    }
    if (generalError) setGeneralError(null);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
    const errorKey = name as keyof StaffingInquiryPayload;
    if (fieldErrors[errorKey]) {
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy[errorKey];
        return copy;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    // Client-side quick check
    const validation = validateStaffingInquiry(formData);
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      setGeneralError("Please complete all required fields indicated in red.");
      // Scroll to the first error
      const keys = Object.keys(validation.errors) as (keyof StaffingInquiryPayload)[];
      const firstKey = keys[0];
      if (firstKey) {
        const el = document.getElementsByName(firstKey)[0];
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await processStaffingInquiry({
        ...formData,
        serviceCategory: selectedService,
      });
      if (response.success) {
        // Dispatch to EmailJS
        try {
          const emailResult = await sendStaffingInquiryEmail(response.inquiry);
          if (!emailResult.success) {
            console.error("[EmailJS Staffing Error]:", emailResult.message);
          } else {
            console.log("[EmailJS Staffing Success]: Dispatched via EmailJS (status: " + emailResult.status + ")");
          }
        } catch (emailErr) {
          console.warn("[RequestStaffing] EmailJS dispatch issue:", emailErr);
        }

        setIsSubmitted(true);
        setTimeout(() => {
          setSubmissionResult(response.inquiry);
          setTimeout(() => {
            const el = document.getElementById("staffing-confirmation");
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "start" });
              el.focus();
            } else {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }, 50);
        }, 500);
      } else {
        setGeneralError(response.error);
        if (response.errors) setFieldErrors(response.errors);
      }
    } catch {
      setGeneralError(
        "A network error occurred while submitting your request. Please try again or contact us directly at sandeepsapare.tx@gmail.com.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setIsSubmitted(false);
    setSubmissionResult(null);
    setFormData({
      companyName: "",
      companyWebsite: "",
      industry: "",
      companyLocation: "",
      contactPerson: "",
      businessEmail: "",
      phoneNumber: "",
      jobTitle: "",
      serviceCategory: selectedService,
      positionTitle: "",
      employeeCount: "",
      employmentType: "Direct-Hire Full-Time",
      requiredExperience: "",
      expectedTimeline: "",
      jobDescription: "",
      additionalMessage: "",
      preferredContactMethod: "Email",
      privacyConsent: false,
    });
    setFieldErrors({});
    setGeneralError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentServiceMeta = SERVICE_METADATA[selectedService];
  const CurrentServiceIcon = serviceIcons[selectedService];
  const currentServiceImg = serviceImages[selectedService];

  return (
    <div className="min-h-screen bg-white text-[#344054]">
      {/* 01. Global Sticky Navbar */}
      <Navbar currentPath="/request-staffing" />

      {/* 02. HERO SECTION */}
      <section className="border-b border-[#E8ECF1] bg-[#F7F8FA] pt-12 pb-14 md:pt-16 md:pb-16">
        <div className="container-x">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-[13px] text-[#344054]/70 mb-5">
            <Link to="/" className="hover:text-[#0B1F3A] transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3.5 text-[#F47B20]" />
            <Link to="/services" className="hover:text-[#0B1F3A] transition-colors">
              Services
            </Link>
            <ChevronRight className="size-3.5 text-[#F47B20]" />
            <span className="font-semibold text-[#0B1F3A]">Staffing Request</span>
          </div>

          <div className="max-w-3xl">
            {/* Eyebrow */}
            <p className="eyebrow text-[13px] font-semibold uppercase tracking-[0.14em] text-[#F47B20]">
              EMPLOYER STAFFING REQUEST
            </p>

            {/* Heading */}
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#0B1F3A] md:text-[48px] md:leading-[1.15]">
              Let&apos;s Find the Right Talent for Your Business.
            </h1>

            {/* Description */}
            <p className="mt-4 text-[17px] font-normal leading-relaxed text-[#344054]">
              Tell us about your organization&apos;s hiring criteria and talent requirements. Our
              specialized recruitment practice will evaluate your technical needs, source pre-vetted
              candidates, and deliver qualified direct-hire professionals.
            </p>
          </div>

          {/* NAVY HIGHLIGHTED INFORMATION PANEL (Selected Service) */}
          <div className="mt-8 rounded-[14px] bg-[#0B1F3A] p-5 md:p-6 text-white shadow-soft">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="grid size-12 shrink-0 place-items-center rounded-[10px] bg-[#142F52] text-[#F47B20] ring-1 ring-white/10">
                  <CurrentServiceIcon className="size-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold tracking-[0.16em] uppercase text-[#F47B20]">
                    SELECTED RECRUITMENT SERVICE
                  </span>
                  <h2 className="text-[20px] font-bold text-white md:text-[22px]">
                    {currentServiceMeta.name}
                  </h2>
                  <p className="mt-1 text-[13px] text-white/70 max-w-2xl">
                    {currentServiceMeta.description}
                  </p>
                </div>
              </div>

              {/* Service Switcher Buttons */}
              <div className="shrink-0 border-t border-white/10 pt-4 lg:border-t-0 lg:pt-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-white/60 mb-2">
                  Switch Target Discipline:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(Object.keys(SERVICE_METADATA) as ServiceKey[]).map((key) => {
                    const isCurrent = key === selectedService;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleServiceChange(key)}
                        className={`rounded-[6px] px-3 py-1.5 text-[12px] font-medium transition-all ${isCurrent
                          ? "bg-[#F47B20] text-white font-semibold shadow-sm"
                          : "bg-[#142F52] text-white/80 hover:bg-white/15 hover:text-white"
                          }`}
                      >
                        {SERVICE_METADATA[key].shortName}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 03. MAIN TWO-COLUMN CONTENT */}
      <section className="py-12 md:py-16">
        <div className="container-x">
          {submissionResult ? (
            /* ================================================================= */
            /* SUCCESS CONFIRMATION STATE / PAGE                                 */
            /* ================================================================= */
            <div
              id="staffing-confirmation"
              tabIndex={-1}
              className="mx-auto max-w-3xl rounded-[16px] border border-[#E8ECF1] bg-white p-8 md:p-12 shadow-[0_16px_48px_rgba(11,31,58,0.08)] animate-in fade-in-50 duration-300"
            >
              {/* Success Badge */}
              <div className="text-center">
                <div className="mx-auto grid size-16 place-items-center rounded-full bg-[#10B981]/15 text-[#059669]">
                  <CheckCircle2 className="size-10 stroke-[2.5]" />
                </div>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#10B981]/10 px-4 py-1.5 text-[14px] font-semibold text-[#059669]">
                  <CheckCircle2 className="size-4 stroke-[2.5]" />
                  Submission Completed
                </div>
                <h2 className="mt-4 text-2xl font-bold text-[#0B1F3A] md:text-[34px]">
                  Submission Completed — Thank You!
                </h2>
                <p className="mt-3 text-[16px] leading-relaxed text-[#344054]">
                  Your recruitment requirements have been received and logged directly into our
                  direct-hire talent matching system. A senior recruitment specialist will review your
                  job criteria and contact you within <strong>1 business day</strong>.
                </p>

                {/* Status confirmation banner */}
                <div className="mt-5 inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#E8F8F0] border border-[#10B981]/30 px-5 py-2.5 text-[#059669] font-medium text-[14px]">
                  <CheckCircle2 className="size-4 shrink-0" />
                  <span>Staffing inquiry submitted and completed successfully.</span>
                </div>

                {/* Reference Box */}
                <div className="mt-8 rounded-[12px] border border-[#F47B20]/40 bg-[#FFF1E5]/40 p-6 text-center">
                  <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#F47B20]">
                    Inquiry Reference Number
                  </p>
                  <p className="mt-2 font-mono text-2xl font-bold tracking-wider text-[#0B1F3A] md:text-3xl">
                    {submissionResult.referenceNumber}
                  </p>
                  <p className="mt-2 text-[13px] text-[#344054]/80">
                    A confirmation email has been dispatched to{" "}
                    <span className="font-semibold text-[#0B1F3A]">
                      {submissionResult.businessEmail}
                    </span>
                    , and full requirements have been routed to{" "}
                    <span className="font-semibold text-[#0B1F3A]">
                      sandeepsapare.tx@gmail.com
                    </span>
                    .
                  </p>
                </div>

                {/* Submitted Summary Grid */}
                <div className="mt-8 rounded-[12px] border border-[#E8ECF1] bg-[#F7F8FA] p-6 text-left">
                  <h3 className="text-[14px] font-bold uppercase tracking-wider text-[#0B1F3A]">
                    Submission Overview
                  </h3>
                  <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-[14px]">
                    <div>
                      <dt className="text-[#344054]/70">Company Name:</dt>
                      <dd className="font-semibold text-[#0B1F3A]">{submissionResult.companyName}</dd>
                    </div>
                    <div>
                      <dt className="text-[#344054]/70">Contact Person:</dt>
                      <dd className="font-semibold text-[#0B1F3A]">{submissionResult.contactPerson}</dd>
                    </div>
                    <div>
                      <dt className="text-[#344054]/70">Service Practice:</dt>
                      <dd className="font-semibold text-[#F47B20]">
                        {submissionResult.serviceDisplayName}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[#344054]/70">Target Position:</dt>
                      <dd className="font-semibold text-[#0B1F3A]">
                        {submissionResult.positionTitle}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[#344054]/70">Personnel Required:</dt>
                      <dd className="font-semibold text-[#0B1F3A]">
                        {submissionResult.employeeCount}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[#344054]/70">Hiring Timeline:</dt>
                      <dd className="font-semibold text-[#0B1F3A]">
                        {submissionResult.expectedTimeline}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Action Buttons */}
                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                  <Button
                    asChild
                    className="h-12 px-7 rounded-[8px] bg-[#F47B20] hover:bg-[#e06d17] text-white text-[15px] font-semibold shadow-sm transition-all"
                  >
                    <Link to="/services">
                      Explore Our Services <ArrowRight className="size-4 ml-1.5" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="h-12 px-7 rounded-[8px] border-[#0B1F3A] text-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-white text-[15px] font-semibold transition-all"
                  >
                    <Link to="/">Return to Home</Link>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleResetForm}
                    className="h-12 px-5 text-[14px] text-[#344054] hover:text-[#0B1F3A]"
                  >
                    <RotateCcw className="size-4 mr-2" /> Submit Another Request
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            /* ================================================================= */
            /* TWO-COLUMN LAYOUT: LEFT INFO & RIGHT FORM                         */
            /* ================================================================= */
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
              {/* =============================================================== */}
              {/* LEFT COLUMN: SERVICE DETAILS, BENEFITS, PROCESS & CONTACT       */}
              {/* =============================================================== */}
              <div className="space-y-8 lg:col-span-5">
                {/* 1. Selected Service Snapshot Card */}
                <div className="rounded-[14px] border border-[#E8ECF1] bg-[#F7F8FA] p-6 shadow-sm">
                  <div className="relative overflow-hidden rounded-[10px] border border-[#E8ECF1] mb-5">
                    <img
                      src={currentServiceImg}
                      alt={currentServiceMeta.name}
                      width={600}
                      height={400}
                      className="aspect-[16/10] w-full object-cover"
                    />
                  </div>

                  <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#F47B20]">
                    {currentServiceMeta.eyebrow}
                  </span>
                  <h3 className="mt-1.5 text-xl font-bold text-[#0B1F3A]">
                    {currentServiceMeta.name}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-[#344054]">
                    {currentServiceMeta.description}
                  </p>

                  <div className="mt-5 border-t border-[#E8ECF1] pt-4">
                    <p className="text-[12px] font-semibold uppercase tracking-wider text-[#0B1F3A] mb-2.5">
                      Common Roles Placed in This Practice:
                    </p>
                    <ul className="space-y-2 text-[13px] text-[#344054]">
                      {currentServiceMeta.roles.map((role) => (
                        <li key={role} className="flex items-center gap-2">
                          <Check className="size-4 shrink-0 text-[#F47B20]" />
                          <span>{role}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 2. Direct-Hire Benefits Card */}
                <div className="rounded-[14px] border border-[#E8ECF1] bg-white p-6 shadow-sm">
                  <h3 className="text-[16px] font-bold text-[#0B1F3A] flex items-center gap-2">
                    <ShieldCheck className="size-5 text-[#F47B20]" />
                    Direct-Hire Placement Benefits
                  </h3>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[#FFF1E5] text-[#F47B20]">
                        <Check className="size-3.5 stroke-[2.5]" />
                      </span>
                      <div>
                        <h4 className="text-[14px] font-semibold text-[#0B1F3A]">
                          100% Direct-Hire Alignment
                        </h4>
                        <p className="text-[13px] text-[#344054]">
                          Candidates become permanent employees from day one, fostering retention and loyalty.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[#FFF1E5] text-[#F47B20]">
                        <Check className="size-3.5 stroke-[2.5]" />
                      </span>
                      <div>
                        <h4 className="text-[14px] font-semibold text-[#0B1F3A]">
                          Pre-Screened &amp; Vetted
                        </h4>
                        <p className="text-[13px] text-[#344054]">
                          Hands-on skill assessments, credentials verification, and reference checks.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[#FFF1E5] text-[#F47B20]">
                        <Check className="size-3.5 stroke-[2.5]" />
                      </span>
                      <div>
                        <h4 className="text-[14px] font-semibold text-[#0B1F3A]">
                          Dedicated Account Lead
                        </h4>
                        <p className="text-[13px] text-[#344054]">
                          Single point of contact for transparent communication throughout sourcing.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Four-Step Recruitment Process Card */}
                <div className="rounded-[14px] border border-[#E8ECF1] bg-[#F7F8FA] p-6 shadow-sm">
                  <h3 className="text-[16px] font-bold text-[#0B1F3A] mb-4">
                    Our 4-Step Placement Process
                  </h3>
                  <ol className="relative border-l border-[#F47B20]/40 pl-5 space-y-4">
                    <li className="relative">
                      <span className="absolute -left-[27px] top-1 grid size-4 rounded-full bg-[#F47B20] text-white" />
                      <span className="text-[11px] font-bold text-[#F47B20] uppercase tracking-wider">
                        STEP 01
                      </span>
                      <h4 className="text-[14px] font-bold text-[#0B1F3A]">Understand Requirements</h4>
                      <p className="text-[12.5px] text-[#344054]">
                        We analyze your operational needs, shift patterns, and technical requirements.
                      </p>
                    </li>
                    <li className="relative">
                      <span className="absolute -left-[27px] top-1 grid size-4 rounded-full bg-[#F47B20] text-white" />
                      <span className="text-[11px] font-bold text-[#F47B20] uppercase tracking-wider">
                        STEP 02
                      </span>
                      <h4 className="text-[14px] font-bold text-[#0B1F3A]">Identify Candidates</h4>
                      <p className="text-[12.5px] text-[#344054]">
                        Thorough multi-tier screening, credentials validation, and cultural fit review.
                      </p>
                    </li>
                    <li className="relative">
                      <span className="absolute -left-[27px] top-1 grid size-4 rounded-full bg-[#F47B20] text-white" />
                      <span className="text-[11px] font-bold text-[#F47B20] uppercase tracking-wider">
                        STEP 03
                      </span>
                      <h4 className="text-[14px] font-bold text-[#0B1F3A]">Connect With Talent</h4>
                      <p className="text-[12.5px] text-[#344054]">
                        Targeted candidate profiles presented with seamless interview coordination.
                      </p>
                    </li>
                    <li className="relative">
                      <span className="absolute -left-[27px] top-1 grid size-4 rounded-full bg-[#F47B20] text-white" />
                      <span className="text-[11px] font-bold text-[#F47B20] uppercase tracking-wider">
                        STEP 04
                      </span>
                      <h4 className="text-[14px] font-bold text-[#0B1F3A]">Complete Direct-Hire Placement</h4>
                      <p className="text-[12.5px] text-[#344054]">
                        Offer facilitation, onboarding alignment, and post-placement check-ins.
                      </p>
                    </li>
                  </ol>
                </div>

                {/* 4. Business Contact Card */}
                <div className="rounded-[14px] border border-[#E8ECF1] bg-white p-6 shadow-sm">
                  <h3 className="text-[15px] font-bold text-[#0B1F3A] mb-3">
                    Need Direct Assistance?
                  </h3>
                  <div className="space-y-3 text-[13.5px]">
                    <div className="flex items-center gap-3 text-[#344054]">
                      <Phone className="size-4 text-[#F47B20]" />
                      <span className="font-semibold text-[#0B1F3A]">(555) 019-2834</span>
                    </div>
                    <div className="flex items-center gap-3 text-[#344054]">
                      <Mail className="size-4 text-[#F47B20]" />
                      <span>tabeng14@infotabvsgroup.com</span>
                    </div>
                    <div className="flex items-center gap-3 text-[#344054]">
                      <Clock className="size-4 text-[#F47B20]" />
                      <span>Mon – Fri: 8:00 AM – 6:00 PM EST</span>
                    </div>
                    <div className="flex items-center gap-3 text-[#344054]">
                      <MapPin className="size-4 text-[#F47B20]" />
                      <span>Washington, D.C. Metropolitan Area, USA</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* =============================================================== */}
              {/* RIGHT COLUMN: 4-SECTION STAFFING REQUEST FORM CARD              */}
              {/* =============================================================== */}
              <div className="lg:col-span-7">
                <div className="rounded-[16px] border border-[#E8ECF1] bg-white p-5 sm:p-8 md:p-10 shadow-[0_12px_40px_rgba(11,31,58,0.06)]">
                  {/* Form Header */}
                  <div className="border-b border-[#E8ECF1] pb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#F47B20]">
                        EMPLOYER INTAKE FORM
                      </span>
                      <span className="rounded-[6px] bg-[#F7F8FA] px-2.5 py-0.5 text-[11px] font-semibold text-[#0B1F3A] border border-[#E8ECF1]">
                        Confidential &amp; Secure
                      </span>
                    </div>
                    <h2 className="mt-2 text-2xl font-bold text-[#0B1F3A] md:text-[28px]">
                      Staffing &amp; Hiring Requirements
                    </h2>
                    <p className="mt-1.5 text-[14px] text-[#344054]">
                      Fields marked with an asterisk (<span className="text-[#F47B20] font-bold">*</span>) are required.
                    </p>
                  </div>

                  {/* General Error Banner */}
                  {generalError && (
                    <div className="mt-6 rounded-[8px] border border-red-200 bg-red-50 p-4 text-[14px] text-red-800 flex items-start gap-3">
                      <AlertCircle className="size-5 shrink-0 text-red-600 mt-0.5" />
                      <div>
                        <p className="font-semibold">Unable to process request</p>
                        <p className="mt-0.5 text-[13px]">{generalError}</p>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-10">
                    {/* --------------------------------------------------------- */}
                    {/* SECTION 1: COMPANY INFORMATION                           */}
                    {/* --------------------------------------------------------- */}
                    <div>
                      <div className="flex items-center gap-2.5 mb-4">
                        <span className="grid size-6 place-items-center rounded-full bg-[#0B1F3A] text-white text-[12px] font-bold">
                          1
                        </span>
                        <h3 className="text-[17px] font-bold text-[#0B1F3A]">Company Information</h3>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        {/* Company Name */}
                        <div>
                          <label
                            htmlFor="companyName"
                            className="block text-[13px] font-semibold text-[#0B1F3A] mb-1.5"
                          >
                            Company Name <span className="text-[#F47B20]">*</span>
                          </label>
                          <Input
                            id="companyName"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleInputChange}
                            placeholder="e.g. Acme Cloud Technologies"
                            className={`h-11 rounded-[8px] ${fieldErrors.companyName ? "border-red-500 focus-visible:ring-red-400" : ""
                              }`}
                          />
                          {fieldErrors.companyName && (
                            <p className="mt-1 text-[12px] text-red-600 font-medium">
                              {fieldErrors.companyName}
                            </p>
                          )}
                        </div>

                        {/* Company Website */}
                        <div>
                          <label
                            htmlFor="companyWebsite"
                            className="block text-[13px] font-semibold text-[#0B1F3A] mb-1.5"
                          >
                            Company Website (Optional)
                          </label>
                          <Input
                            id="companyWebsite"
                            name="companyWebsite"
                            value={formData.companyWebsite}
                            onChange={handleInputChange}
                            placeholder="https://example.com"
                            className="h-11 rounded-[8px]"
                          />
                        </div>

                        {/* Industry */}
                        <div>
                          <label
                            htmlFor="industry"
                            className="block text-[13px] font-semibold text-[#0B1F3A] mb-1.5"
                          >
                            Industry Sector <span className="text-[#F47B20]">*</span>
                          </label>
                          <select
                            id="industry"
                            name="industry"
                            value={formData.industry}
                            onChange={handleInputChange}
                            className={`flex h-11 w-full rounded-[8px] border bg-transparent px-3 py-1 text-base md:text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F47B20] ${fieldErrors.industry
                              ? "border-red-500"
                              : "border-input text-[#0B1F3A]"
                              }`}
                          >
                            <option value="">Select your industry...</option>
                            <option value="Data Center & Cloud Infrastructure">Data Center &amp; Cloud Infrastructure</option>
                            <option value="Information Technology & Software">Information Technology &amp; Software</option>
                            <option value="Warehousing, Logistics & Supply Chain">Warehousing, Logistics &amp; Supply Chain</option>
                            <option value="Healthcare & Life Sciences">Healthcare &amp; Life Sciences</option>
                            <option value="Commercial Real Estate & Facilities">Commercial Real Estate &amp; Facilities</option>
                            <option value="Manufacturing & Industrial">Manufacturing &amp; Industrial</option>
                            <option value="Corporate / Financial Services">Corporate / Financial Services</option>
                            <option value="Other Industry">Other Industry</option>
                          </select>
                          {fieldErrors.industry && (
                            <p className="mt-1 text-[12px] text-red-600 font-medium">
                              {fieldErrors.industry}
                            </p>
                          )}
                        </div>

                        {/* Company Location */}
                        <div>
                          <label
                            htmlFor="companyLocation"
                            className="block text-[13px] font-semibold text-[#0B1F3A] mb-1.5"
                          >
                            Primary Work Location (City, State) <span className="text-[#F47B20]">*</span>
                          </label>
                          <Input
                            id="companyLocation"
                            name="companyLocation"
                            value={formData.companyLocation}
                            onChange={handleInputChange}
                            placeholder="e.g. Ashburn, VA or Dallas, TX"
                            className={`h-11 rounded-[8px] ${fieldErrors.companyLocation ? "border-red-500 focus-visible:ring-red-400" : ""
                              }`}
                          />
                          {fieldErrors.companyLocation && (
                            <p className="mt-1 text-[12px] text-red-600 font-medium">
                              {fieldErrors.companyLocation}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* --------------------------------------------------------- */}
                    {/* SECTION 2: CONTACT INFORMATION                           */}
                    {/* --------------------------------------------------------- */}
                    <div className="border-t border-[#E8ECF1] pt-8">
                      <div className="flex items-center gap-2.5 mb-4">
                        <span className="grid size-6 place-items-center rounded-full bg-[#0B1F3A] text-white text-[12px] font-bold">
                          2
                        </span>
                        <h3 className="text-[17px] font-bold text-[#0B1F3A]">Contact Information</h3>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        {/* Contact Person */}
                        <div>
                          <label
                            htmlFor="contactPerson"
                            className="block text-[13px] font-semibold text-[#0B1F3A] mb-1.5"
                          >
                            Contact Person <span className="text-[#F47B20]">*</span>
                          </label>
                          <Input
                            id="contactPerson"
                            name="contactPerson"
                            value={formData.contactPerson}
                            onChange={handleInputChange}
                            placeholder="Full Name"
                            className={`h-11 rounded-[8px] ${fieldErrors.contactPerson ? "border-red-500 focus-visible:ring-red-400" : ""
                              }`}
                          />
                          {fieldErrors.contactPerson && (
                            <p className="mt-1 text-[12px] text-red-600 font-medium">
                              {fieldErrors.contactPerson}
                            </p>
                          )}
                        </div>

                        {/* Job Title */}
                        <div>
                          <label
                            htmlFor="jobTitle"
                            className="block text-[13px] font-semibold text-[#0B1F3A] mb-1.5"
                          >
                            Job Title / Designation <span className="text-[#F47B20]">*</span>
                          </label>
                          <Input
                            id="jobTitle"
                            name="jobTitle"
                            value={formData.jobTitle}
                            onChange={handleInputChange}
                            placeholder="e.g. Director of Operations, HR Manager"
                            className={`h-11 rounded-[8px] ${fieldErrors.jobTitle ? "border-red-500 focus-visible:ring-red-400" : ""
                              }`}
                          />
                          {fieldErrors.jobTitle && (
                            <p className="mt-1 text-[12px] text-red-600 font-medium">
                              {fieldErrors.jobTitle}
                            </p>
                          )}
                        </div>

                        {/* Business Email */}
                        <div>
                          <label
                            htmlFor="businessEmail"
                            className="block text-[13px] font-semibold text-[#0B1F3A] mb-1.5"
                          >
                            Business Email <span className="text-[#F47B20]">*</span>
                          </label>
                          <Input
                            id="businessEmail"
                            name="businessEmail"
                            type="email"
                            value={formData.businessEmail}
                            onChange={handleInputChange}
                            placeholder="name@company.com"
                            className={`h-11 rounded-[8px] ${fieldErrors.businessEmail ? "border-red-500 focus-visible:ring-red-400" : ""
                              }`}
                          />
                          {fieldErrors.businessEmail && (
                            <p className="mt-1 text-[12px] text-red-600 font-medium">
                              {fieldErrors.businessEmail}
                            </p>
                          )}
                        </div>

                        {/* Phone Number */}
                        <div>
                          <label
                            htmlFor="phoneNumber"
                            className="block text-[13px] font-semibold text-[#0B1F3A] mb-1.5"
                          >
                            Phone Number <span className="text-[#F47B20]">*</span>
                          </label>
                          <Input
                            id="phoneNumber"
                            name="phoneNumber"
                            type="tel"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            placeholder="(555) 123-4567"
                            className={`h-11 rounded-[8px] ${fieldErrors.phoneNumber ? "border-red-500 focus-visible:ring-red-400" : ""
                              }`}
                          />
                          {fieldErrors.phoneNumber && (
                            <p className="mt-1 text-[12px] text-red-600 font-medium">
                              {fieldErrors.phoneNumber}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* --------------------------------------------------------- */}
                    {/* SECTION 3: HIRING REQUIREMENTS                           */}
                    {/* --------------------------------------------------------- */}
                    <div className="border-t border-[#E8ECF1] pt-8">
                      <div className="flex items-center gap-2.5 mb-4">
                        <span className="grid size-6 place-items-center rounded-full bg-[#0B1F3A] text-white text-[12px] font-bold">
                          3
                        </span>
                        <h3 className="text-[17px] font-bold text-[#0B1F3A]">Hiring Requirements</h3>
                      </div>

                      <div className="space-y-4">
                        {/* Service Category */}
                        <div>
                          <label
                            htmlFor="serviceCategory"
                            className="block text-[13px] font-semibold text-[#0B1F3A] mb-1.5"
                          >
                            Recruitment Service Category <span className="text-[#F47B20]">*</span>
                          </label>
                          <select
                            id="serviceCategory"
                            name="serviceCategory"
                            value={formData.serviceCategory}
                            onChange={(e) => handleServiceChange(normalizeServiceKey(e.target.value))}
                            className={`flex h-11 w-full rounded-[8px] border bg-transparent px-3 py-1 text-base md:text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F47B20] ${fieldErrors.serviceCategory ? "border-red-500" : "border-input text-[#0B1F3A]"
                              }`}
                          >
                            <option value="data-center">01 – Data Center Operations &amp; Technician</option>
                            <option value="it">02 – Information Technology</option>
                            <option value="warehouse">03 – Warehouse Associate Placement</option>
                            <option value="healthcare">04 – Healthcare Services Placement</option>
                            <option value="cleaning">05 – Cleaning Services Placement</option>
                          </select>
                          {fieldErrors.serviceCategory && (
                            <p className="mt-1 text-[12px] text-red-600 font-medium">
                              {fieldErrors.serviceCategory}
                            </p>
                          )}
                        </div>

                        {/* Position Title & Employee Count */}
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label
                              htmlFor="positionTitle"
                              className="block text-[13px] font-semibold text-[#0B1F3A] mb-1.5"
                            >
                              Target Position / Job Title <span className="text-[#F47B20]">*</span>
                            </label>
                            <Input
                              id="positionTitle"
                              name="positionTitle"
                              value={formData.positionTitle}
                              onChange={handleInputChange}
                              placeholder="e.g. Senior Data Center Tech"
                              className={`h-11 rounded-[8px] ${fieldErrors.positionTitle ? "border-red-500 focus-visible:ring-red-400" : ""
                                }`}
                            />
                            {fieldErrors.positionTitle && (
                              <p className="mt-1 text-[12px] text-red-600 font-medium">
                                {fieldErrors.positionTitle}
                              </p>
                            )}
                          </div>

                          <div>
                            <label
                              htmlFor="employeeCount"
                              className="block text-[13px] font-semibold text-[#0B1F3A] mb-1.5"
                            >
                              Number of Employees Required <span className="text-[#F47B20]">*</span>
                            </label>
                            <select
                              id="employeeCount"
                              name="employeeCount"
                              value={formData.employeeCount}
                              onChange={handleInputChange}
                              className={`flex h-11 w-full rounded-[8px] border bg-transparent px-3 py-1 text-base md:text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F47B20] ${fieldErrors.employeeCount ? "border-red-500" : "border-input text-[#0B1F3A]"
                                }`}
                            >
                              <option value="">Select headcount...</option>
                              <option value="1 Employee">1 Individual Placement</option>
                              <option value="2-4 Employees">2 – 4 Employees</option>
                              <option value="5-10 Employees">5 – 10 Employees</option>
                              <option value="10+ Employees">10+ Team Build / Multi-hire</option>
                            </select>
                            {fieldErrors.employeeCount && (
                              <p className="mt-1 text-[12px] text-red-600 font-medium">
                                {fieldErrors.employeeCount}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Employment Type & Required Experience */}
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label
                              htmlFor="employmentType"
                              className="block text-[13px] font-semibold text-[#0B1F3A] mb-1.5"
                            >
                              Employment Type <span className="text-[#F47B20]">*</span>
                            </label>
                            <select
                              id="employmentType"
                              name="employmentType"
                              value={formData.employmentType}
                              onChange={handleInputChange}
                              className="flex h-11 w-full rounded-[8px] border border-input bg-transparent px-3 py-1 text-base md:text-sm text-[#0B1F3A] shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F47B20]"
                            >
                              <option value="Direct-Hire Full-Time">Direct-Hire Full-Time</option>
                              <option value="Direct-Hire Part-Time">Direct-Hire Part-Time</option>
                              <option value="Executive / Specialized Direct-Hire">Executive / Specialized Direct-Hire</option>
                            </select>
                          </div>

                          <div>
                            <label
                              htmlFor="requiredExperience"
                              className="block text-[13px] font-semibold text-[#0B1F3A] mb-1.5"
                            >
                              Required Experience Level <span className="text-[#F47B20]">*</span>
                            </label>
                            <select
                              id="requiredExperience"
                              name="requiredExperience"
                              value={formData.requiredExperience}
                              onChange={handleInputChange}
                              className={`flex h-11 w-full rounded-[8px] border bg-transparent px-3 py-1 text-base md:text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F47B20] ${fieldErrors.requiredExperience ? "border-red-500" : "border-input text-[#0B1F3A]"
                                }`}
                            >
                              <option value="">Select experience level...</option>
                              <option value="Entry-Level (0-1 Years)">Entry-Level (0 – 1 Years)</option>
                              <option value="Mid-Level (2-4 Years)">Mid-Level (2 – 4 Years)</option>
                              <option value="Senior Level (5+ Years)">Senior Level (5+ Years)</option>
                              <option value="Lead / Supervisory">Lead / Supervisory</option>
                              <option value="Flexible / Various Levels">Flexible / Various Levels</option>
                            </select>
                            {fieldErrors.requiredExperience && (
                              <p className="mt-1 text-[12px] text-red-600 font-medium">
                                {fieldErrors.requiredExperience}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Expected Timeline */}
                        <div>
                          <label
                            htmlFor="expectedTimeline"
                            className="block text-[13px] font-semibold text-[#0B1F3A] mb-1.5"
                          >
                            Expected Hiring Timeline <span className="text-[#F47B20]">*</span>
                          </label>
                          <select
                            id="expectedTimeline"
                            name="expectedTimeline"
                            value={formData.expectedTimeline}
                            onChange={handleInputChange}
                            className={`flex h-11 w-full rounded-[8px] border bg-transparent px-3 py-1 text-base md:text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F47B20] ${fieldErrors.expectedTimeline ? "border-red-500" : "border-input text-[#0B1F3A]"
                              }`}
                          >
                            <option value="">Select timeline...</option>
                            <option value="Immediate / Urgent (1-2 Weeks)">Immediate / Urgent (Within 1-2 Weeks)</option>
                            <option value="2-4 Weeks">Standard (2 – 4 Weeks)</option>
                            <option value="1-2 Months">Upcoming Month (1 – 2 Months)</option>
                            <option value="Planning / Future Quarter">Strategic Planning / Future Quarter</option>
                          </select>
                          {fieldErrors.expectedTimeline && (
                            <p className="mt-1 text-[12px] text-red-600 font-medium">
                              {fieldErrors.expectedTimeline}
                            </p>
                          )}
                        </div>

                        {/* Job Description / Requirements */}
                        <div>
                          <label
                            htmlFor="jobDescription"
                            className="block text-[13px] font-semibold text-[#0B1F3A] mb-1.5"
                          >
                            Job Description &amp; Candidate Requirements <span className="text-[#F47B20]">*</span>
                          </label>
                          <Textarea
                            id="jobDescription"
                            name="jobDescription"
                            rows={4}
                            value={formData.jobDescription}
                            onChange={handleInputChange}
                            placeholder="Describe the key responsibilities, shift requirements (e.g. 1st/2nd/3rd shift), technical skills, tools, or certifications (e.g. OSHA, CompTIA, CPR) needed for this role..."
                            className={`rounded-[8px] resize-y ${fieldErrors.jobDescription ? "border-red-500 focus-visible:ring-red-400" : ""
                              }`}
                          />
                          {fieldErrors.jobDescription && (
                            <p className="mt-1 text-[12px] text-red-600 font-medium">
                              {fieldErrors.jobDescription}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* --------------------------------------------------------- */}
                    {/* SECTION 4: ADDITIONAL INFORMATION & CONSENT              */}
                    {/* --------------------------------------------------------- */}
                    <div className="border-t border-[#E8ECF1] pt-8">
                      <div className="flex items-center gap-2.5 mb-4">
                        <span className="grid size-6 place-items-center rounded-full bg-[#0B1F3A] text-white text-[12px] font-bold">
                          4
                        </span>
                        <h3 className="text-[17px] font-bold text-[#0B1F3A]">
                          Additional Information &amp; Consent
                        </h3>
                      </div>

                      <div className="space-y-4">
                        {/* Additional Message */}
                        <div>
                          <label
                            htmlFor="additionalMessage"
                            className="block text-[13px] font-semibold text-[#0B1F3A] mb-1.5"
                          >
                            Additional Notes or Questions (Optional)
                          </label>
                          <Textarea
                            id="additionalMessage"
                            name="additionalMessage"
                            rows={2}
                            value={formData.additionalMessage}
                            onChange={handleInputChange}
                            placeholder="Any special budget considerations, onboarding instructions, or notes for our recruitment lead..."
                            className="rounded-[8px] resize-y"
                          />
                        </div>

                        {/* Preferred Contact Method */}
                        <div>
                          <label className="block text-[13px] font-semibold text-[#0B1F3A] mb-2">
                            Preferred Contact Method
                          </label>
                          <div className="flex flex-wrap gap-4 text-[14px]">
                            {(["Email", "Phone", "Either"] as const).map((method) => (
                              <label
                                key={method}
                                className="flex items-center gap-2 cursor-pointer text-[#344054]"
                              >
                                <input
                                  type="radio"
                                  name="preferredContactMethod"
                                  value={method}
                                  checked={formData.preferredContactMethod === method}
                                  onChange={handleInputChange}
                                  className="accent-[#F47B20] size-4"
                                />
                                <span>{method}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Privacy Consent Checkbox */}
                        <div className="pt-2">
                          <label className="flex items-start gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              name="privacyConsent"
                              checked={formData.privacyConsent}
                              onChange={handleCheckboxChange}
                              className="mt-1 accent-[#F47B20] size-4 shrink-0 rounded border-[#E8ECF1]"
                            />
                            <span className="text-[13px] leading-relaxed text-[#344054]">
                              I consent to TAB V&amp;S Group collecting and processing my company and
                              contact details to evaluate and fulfill this staffing inquiry in
                              accordance with the{" "}
                              <span className="text-[#0B1F3A] underline underline-offset-2 font-medium">
                                Privacy Policy
                              </span>
                              . <span className="text-[#F47B20] font-bold">*</span>
                            </span>
                          </label>
                          {fieldErrors.privacyConsent && (
                            <p className="mt-1.5 text-[12px] text-red-600 font-medium">
                              {fieldErrors.privacyConsent}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="border-t border-[#E8ECF1] pt-6">
                      <Button
                        type="submit"
                        disabled={!formData.privacyConsent || isSubmitting || isSubmitted}
                        className={`w-full h-12 rounded-[8px] text-[15px] font-semibold shadow-md transition-all flex items-center justify-center gap-2 ${isSubmitted
                          ? "bg-[#10B981] hover:bg-[#10B981] text-white"
                          : !formData.privacyConsent
                            ? "bg-[#F47B20] text-white opacity-40 cursor-not-allowed hover:bg-[#F47B20] hover:translate-y-0 shadow-none"
                            : "bg-[#F47B20] hover:bg-[#e06d17] text-white hover:-translate-y-px cursor-pointer"
                          }`}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            <span>Processing Staffing Request...</span>
                          </>
                        ) : isSubmitted ? (
                          <>
                            <CheckCircle2 className="size-5" />
                            <span>Submission Completed!</span>
                          </>
                        ) : (
                          <>
                            <span>Submit Staffing Request</span>
                            <ArrowRight className="size-4" />
                          </>
                        )}
                      </Button>
                      <p className="mt-3 text-center text-[12px] text-[#344054]/70">
                        🔒 Direct-hire inquiry submitted securely. {!formData.privacyConsent ? "Check consent box above to enable submission." : "Response guaranteed within 1 business day."}
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 04. Global Navy Footer */}
      <Footer currentPath="/request-staffing" />
    </div>
  );
}
