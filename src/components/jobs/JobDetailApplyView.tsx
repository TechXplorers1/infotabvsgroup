import { useState, useRef, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  MapPin,
  Building2,
  DollarSign,
  Clock,
  CheckCircle2,
  ShieldCheck,
  User,
  Mail,
  Phone,
  Check,
  Share2,
  Sparkles,
  Award,
  ChevronRight,
  Link2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { JobListing } from "@/services/job-listings";
import {
  processJobApplication,
  validateJobApplication,
  StoredJobApplication,
  JobApplicationErrors,
} from "@/services/job-applications";
import { sendJobApplicationEmail } from "@/services/emailjs";

interface JobDetailApplyViewProps {
  job: JobListing;
  onBackToJobs?: () => void;
}

export function JobDetailApplyView({ job, onBackToJobs }: JobDetailApplyViewProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    currentCity: "",
    experienceLevel: job.experience || "1–3 Years Experience",
    resumeLink: "",
    coverNote: "",
    privacyConsent: false,
  });

  const [errors, setErrors] = useState<JobApplicationErrors & { resumeLink?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState<StoredJobApplication | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const formTopRef = useRef<HTMLDivElement>(null);

  // Scroll to top when view loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [job.id]);

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

    const validation = validateJobApplication({
      ...formData,
      jobId: job.id,
      jobTitle: job.title,
      jobIndustry: job.industryLabel,
      jobLocation: job.location,
      resumeLink: formattedResumeLink || undefined,
    });

    const currentErrors: typeof errors = { ...validation.errors };
    if (!formattedResumeLink) {
      currentErrors.resumeLink = "Please provide your Google Drive resume link.";
    }

    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors);
      if (formTopRef.current) {
        formTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const record = processJobApplication({
        ...formData,
        jobId: job.id,
        jobTitle: job.title,
        jobIndustry: job.industryLabel,
        jobLocation: job.location,
        resumeLink: formattedResumeLink,
        resumeFileName: formattedResumeLink,
      });

      // Dispatch to EmailJS
      await sendJobApplicationEmail(record);

      setSubmittedRecord(record);
      if (formTopRef.current) {
        formTopRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } catch (err) {
      console.error("Application submission failed:", err);
      alert("An error occurred while submitting your application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="bg-[#F7F8FA] min-h-screen text-[#344054]">
      {/* =========================================================================
          TOP BREADCRUMB STRIP & BACK LINK
          ========================================================================= */}
      <section className="bg-white border-b border-[#E8ECF1] py-3.5">
        <div className="container-x flex flex-wrap items-center justify-between gap-3 text-[13.5px]">
          <div className="flex items-center gap-2 text-[#667085]">
            <Link to="/" className="hover:text-[#F47B20] transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3 text-[#98A2B3]" />
            <Link
              to="/jobs"
              onClick={onBackToJobs}
              className="hover:text-[#F47B20] transition-colors"
            >
              Find Jobs
            </Link>
            <ChevronRight className="size-3 text-[#98A2B3]" />
            <span className="text-[#0B1F3A] font-medium truncate max-w-[200px] sm:max-w-none">
              {job.title}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B1F3A] hover:text-[#F47B20] px-3 py-1.5 rounded-md border border-[#E8ECF1] bg-white transition-colors cursor-pointer"
            >
              <Share2 className="size-3.5 text-[#F47B20]" />
              <span>{copiedLink ? "Link Copied!" : "Share Job"}</span>
            </button>

            <Link
              to="/jobs"
              onClick={onBackToJobs}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B1F3A] hover:text-[#F47B20] px-3 py-1.5 rounded-md border border-[#E8ECF1] bg-white transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              <span>All Openings</span>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          JOB HERO / POSITION TITLE BANNER
          ========================================================================= */}
      <section className="relative bg-[#0B1F3A] py-10 md:py-14 text-white overflow-hidden border-b border-[#142F52]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(244,123,32,0.18),transparent_60%)]"
        />

        <div className="container-x relative">
          <div className="max-w-3xl">
            {/* Industry Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-[#FFF1E5] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#F47B20]">
              <Sparkles className="size-3.5" />
              <span>{job.industryLabel}</span>
            </div>

            {/* Job Title */}
            <h1 className="mt-3.5 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-[42px] leading-tight">
              {job.title}
            </h1>

            {/* Metadata Badges */}
            <div className="mt-5 flex flex-wrap items-center gap-y-2.5 gap-x-5 text-[14.5px] text-white/90">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-4 text-[#F47B20] shrink-0" />
                <span>{job.location}</span>
              </span>

              <span className="inline-flex items-center gap-1.5">
                <Building2 className="size-4 text-[#F47B20] shrink-0" />
                <span>{job.type}</span>
              </span>

              <span className="inline-flex items-center gap-1.5">
                <Briefcase className="size-4 text-[#F47B20] shrink-0" />
                <span>{job.experience}</span>
              </span>

              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-4 text-[#F47B20] shrink-0" />
                <span>{job.schedule}</span>
              </span>
            </div>

            {/* Compensation & Free Candidate Placement Strip */}
            <div className="mt-6 flex flex-wrap items-center gap-4 pt-5 border-t border-white/10">
              <div className="rounded-[8px] bg-white/10 backdrop-blur-sm px-4 py-2 border border-white/15">
                <span className="block text-[11px] uppercase tracking-wider text-white/70 font-semibold">
                  Estimated Compensation
                </span>
                <span className="text-lg font-bold text-white flex items-center gap-1 mt-0.5">
                  <DollarSign className="size-4 text-[#F47B20]" />
                  <span>{job.salaryRange}</span>
                </span>
              </div>

              <div className="rounded-[8px] bg-[#10B981]/15 px-4 py-2 border border-[#10B981]/30 text-[#10B981]">
                <span className="block text-[11px] uppercase tracking-wider text-white/70 font-semibold">
                  Candidate Placement Fee
                </span>
                <span className="text-lg font-bold text-white flex items-center gap-1.5 mt-0.5">
                  <CheckCircle2 className="size-4 text-[#10B981]" />
                  <span>100% Free Placement</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          MAIN 2-COLUMN SECTION: JOB DETAILS (LEFT) & APPLICATION FORM (RIGHT)
          ========================================================================= */}
      <section className="py-10 md:py-14">
        <div className="container-x">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* -------------------------------------------------------------------
                LEFT COLUMN (7 cols): Full Job Breakdown & Responsibilities
                ------------------------------------------------------------------- */}
            <div className="lg:col-span-7 space-y-8">
              {/* Role Overview Card */}
              <div className="rounded-[16px] border border-[#E8ECF1] bg-white p-6 sm:p-8 shadow-sm">
                <h2 className="text-xl font-bold text-[#0B1F3A] sm:text-2xl flex items-center gap-2.5">
                  <span className="size-2 rounded-full bg-[#F47B20]" />
                  <span>Role Overview</span>
                </h2>
                <p className="mt-4 text-[15.5px] leading-relaxed text-[#344054]">
                  {job.description}
                </p>
                <div className="mt-5 p-4 rounded-[10px] bg-[#FFF1E5]/50 border border-[#F47B20]/20 flex items-start gap-3">
                  <Award className="size-5 text-[#F47B20] shrink-0 mt-0.5" />
                  <p className="text-[13.5px] text-[#0B1F3A] leading-relaxed">
                    <strong>Direct-Hire Placement:</strong> Selected candidate will become a direct,
                    permanent employee of the hiring organization from day one with full company
                    benefits and long-term career advancement opportunities.
                  </p>
                </div>
              </div>

              {/* Key Responsibilities */}
              <div className="rounded-[16px] border border-[#E8ECF1] bg-white p-6 sm:p-8 shadow-sm">
                <h3 className="text-lg font-bold text-[#0B1F3A] sm:text-xl">
                  Key Responsibilities
                </h3>
                <p className="mt-1.5 text-[14px] text-[#667085]">
                  Daily operational expectations and core duties for this position:
                </p>

                <ul className="mt-5 space-y-3.5">
                  {job.responsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="grid size-5.5 shrink-0 place-items-center rounded-full bg-[#FFF1E5] text-[#F47B20] mt-0.5">
                        <Check className="size-3.5 stroke-[3]" />
                      </div>
                      <span className="text-[14.5px] text-[#344054] leading-relaxed">
                        {resp}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Requirements & Qualifications */}
              <div className="rounded-[16px] border border-[#E8ECF1] bg-white p-6 sm:p-8 shadow-sm">
                <h3 className="text-lg font-bold text-[#0B1F3A] sm:text-xl">
                  Candidate Requirements &amp; Qualifications
                </h3>
                <p className="mt-1.5 text-[14px] text-[#667085]">
                  Experience, technical competencies, and background criteria:
                </p>

                <ul className="mt-5 space-y-3.5">
                  {job.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="grid size-5.5 shrink-0 place-items-center rounded-full bg-[#0B1F3A]/10 text-[#0B1F3A] mt-0.5">
                        <CheckCircle2 className="size-3.5 text-[#F47B20]" />
                      </div>
                      <span className="text-[14.5px] text-[#344054] leading-relaxed">
                        {req}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What This Direct-Hire Placement Offers */}
              <div className="rounded-[16px] border border-[#E8ECF1] bg-white p-6 sm:p-8 shadow-sm">
                <h3 className="text-lg font-bold text-[#0B1F3A] sm:text-xl">
                  What This Position Offers
                </h3>
                <p className="mt-1.5 text-[14px] text-[#667085]">
                  Direct-hire employee perks provided by the partner employer:
                </p>

                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {job.benefits.map((benefit, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-[10px] border border-[#E8ECF1] bg-[#F7F8FA]"
                    >
                      <div className="flex items-center gap-2 text-[#059669] font-semibold text-[13px]">
                        <CheckCircle2 className="size-4 shrink-0" />
                        <span>Included Benefit</span>
                      </div>
                      <p className="mt-1.5 text-[13.5px] text-[#344054] leading-relaxed">
                        {benefit}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust & Zero-Fee Guarantee */}
              <div className="rounded-[16px] bg-[#0B1F3A] p-6 sm:p-8 text-white">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-lg bg-[#F47B20] text-white">
                    <ShieldCheck className="size-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">
                      100% Free Placement Guarantee
                    </h4>
                    <p className="text-xs text-white/70">TAB V&amp;S Group Candidate Charter</p>
                  </div>
                </div>
                <p className="mt-3.5 text-[14px] leading-relaxed text-white/80">
                  Job seekers are never charged any registration fee, placement fee, or salary
                  deduction. Our recruitment services are entirely paid by our verified employer
                  partners who value qualified, dependable direct-hire talent.
                </p>
              </div>
            </div>

            {/* -------------------------------------------------------------------
                RIGHT COLUMN (5 cols): Application Form / Confirmation State
                ------------------------------------------------------------------- */}
            <div className="lg:col-span-5 sticky top-24" ref={formTopRef}>
              <div className="rounded-[20px] border border-[#E8ECF1] bg-white p-6 sm:p-8 shadow-[0_12px_40px_rgba(11,31,58,0.08)]">
                {submittedRecord ? (
                  /* =================================================================
                     AFTER APPLYING CONFIRMATION STATE ("after applying messsage should show")
                     ================================================================= */
                  <div className="text-center py-4 animate-in fade-in duration-300">
                    {/* Green Checkmark Badge */}
                    <div className="mx-auto grid size-16 place-items-center rounded-full bg-[#10B981]/15 text-[#059669]">
                      <CheckCircle2 className="size-10 stroke-[2.5]" />
                    </div>

                    <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#10B981]/10 px-3.5 py-1 text-xs font-semibold text-[#059669]">
                      <Check className="size-3.5 stroke-[3]" />
                      Application Submitted Successfully!
                    </span>

                    <h3 className="mt-3 text-2xl font-bold text-[#0B1F3A]">
                      Thank You, {submittedRecord.fullName}!
                    </h3>

                    <p className="mt-2.5 text-[14.5px] leading-relaxed text-[#344054]">
                      Your application for{" "}
                      <strong className="text-[#0B1F3A]">{submittedRecord.jobTitle}</strong> has
                      been officially received by TAB V&amp;S Group.
                    </p>

                    {/* Reference Card */}
                    <div className="mt-6 rounded-[12px] border border-[#10B981]/30 bg-[#E8F8F0]/50 p-4 text-center">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#059669]">
                        Application Reference ID
                      </p>
                      <p className="mt-1 font-mono text-xl font-bold tracking-wider text-[#0B1F3A]">
                        {submittedRecord.referenceNumber}
                      </p>
                      <p className="mt-1 text-[12px] text-[#344054]/80">
                        Dispatched to:{" "}
                        <span className="font-semibold text-[#0B1F3A]">
                          {submittedRecord.email}
                        </span>
                      </p>
                      {submittedRecord.resumeLink && (
                        <div className="mt-2.5 pt-2 border-t border-[#10B981]/20 flex items-center justify-center gap-1.5 text-[12px]">
                          <span className="text-[#667085]">Resume Link:</span>
                          <a
                            href={submittedRecord.resumeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-[#F47B20] hover:underline inline-flex items-center gap-1"
                          >
                            <span>Open Google Drive File</span>
                            <ExternalLink className="size-3" />
                          </a>
                        </div>
                      )}
                    </div>

                    {/* What Happens Next 3-Step Timeline */}
                    <div className="mt-6 text-left border-t border-[#E8ECF1] pt-5">
                      <p className="text-xs font-bold uppercase tracking-wider text-[#667085] mb-3">
                        What Happens Next:
                      </p>
                      <div className="space-y-3 text-[13px]">
                        <div className="flex items-start gap-2.5">
                          <span className="grid size-5 shrink-0 place-items-center rounded-full bg-[#F47B20] text-white text-[11px] font-bold">
                            1
                          </span>
                          <span className="text-[#344054]">
                            <strong>Recruiter Review:</strong> Our specialist evaluates your
                            qualifications against this role within 1 business day.
                          </span>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <span className="grid size-5 shrink-0 place-items-center rounded-full bg-[#0B1F3A] text-white text-[11px] font-bold">
                            2
                          </span>
                          <span className="text-[#344054]">
                            <strong>Phone Introduction:</strong> We schedule a quick consultation to
                            discuss your career goals and role details.
                          </span>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <span className="grid size-5 shrink-0 place-items-center rounded-full bg-[#0B1F3A] text-white text-[11px] font-bold">
                            3
                          </span>
                          <span className="text-[#344054]">
                            <strong>Employer Interview:</strong> Qualified candidates are presented
                            directly to hiring managers for interview coordination.
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-7 flex flex-col gap-2.5">
                      <Button
                        asChild
                        className="w-full h-11 rounded-[8px] bg-[#F47B20] hover:bg-[#e06d17] text-white font-semibold text-[14px] shadow-sm"
                      >
                        <Link to="/jobs" onClick={onBackToJobs}>
                          <span>Browse More Available Jobs</span>
                          <ArrowRight className="size-4 ml-1.5" />
                        </Link>
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setSubmittedRecord(null);
                          setFormData({
                            fullName: "",
                            email: "",
                            phone: "",
                            currentCity: "",
                            experienceLevel: job.experience,
                            resumeLink: "",
                            coverNote: "",
                            privacyConsent: false,
                          });
                        }}
                        className="w-full h-10 rounded-[8px] border-[#D0D5DD] text-[#344054] text-[13px] font-medium"
                      >
                        Apply for Another Position
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* =================================================================
                     APPLICATION FORM STATE
                     ================================================================= */
                  <div>
                    {/* Header */}
                    <div>
                      <span className="inline-block text-[11.5px] font-bold uppercase tracking-[0.14em] text-[#F47B20]">
                        DIRECT-HIRE APPLICATION • 100% FREE
                      </span>
                      <h3 className="mt-1 text-2xl font-bold text-[#0B1F3A]">
                        Apply for Position
                      </h3>
                      <p className="mt-1 text-[13.5px] text-[#667085]">
                        Submit your details to be considered for{" "}
                        <strong className="text-[#0B1F3A]">{job.title}</strong>.
                      </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="mt-5 space-y-4">
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
                            placeholder="e.g. Jordan Smith"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className={`pl-10 h-11 rounded-[8px] border-[#E8ECF1] text-base md:text-sm focus-visible:ring-[#F47B20] ${
                              errors.fullName ? "border-red-500 bg-red-50/20" : ""
                            }`}
                          />
                        </div>
                        {errors.fullName && (
                          <p className="mt-1 text-xs text-red-600 font-medium">
                            {errors.fullName}
                          </p>
                        )}
                      </div>

                      {/* Email Address */}
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
                            placeholder="jordan@example.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`pl-10 h-11 rounded-[8px] border-[#E8ECF1] text-base md:text-sm focus-visible:ring-[#F47B20] ${
                              errors.email ? "border-red-500 bg-red-50/20" : ""
                            }`}
                          />
                        </div>
                        {errors.email && (
                          <p className="mt-1 text-xs text-red-600 font-medium">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      {/* Phone & Current City */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
                              className={`pl-10 h-11 rounded-[8px] border-[#E8ECF1] text-base md:text-sm focus-visible:ring-[#F47B20] ${
                                errors.phone ? "border-red-500 bg-red-50/20" : ""
                              }`}
                            />
                          </div>
                          {errors.phone && (
                            <p className="mt-1 text-xs text-red-600 font-medium">
                              {errors.phone}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-[13px] font-semibold text-[#0B1F3A] mb-1">
                            Current City / Area
                          </label>
                          <div className="relative">
                            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#98A2B3]" />
                            <Input
                              name="currentCity"
                              placeholder="e.g. Columbus, OH"
                              value={formData.currentCity}
                              onChange={handleInputChange}
                              className="pl-10 h-11 rounded-[8px] border-[#E8ECF1] text-base md:text-sm focus-visible:ring-[#F47B20]"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Relevant Experience Level */}
                      <div>
                        <label className="block text-[13px] font-semibold text-[#0B1F3A] mb-1">
                          Relevant Experience
                        </label>
                        <select
                          name="experienceLevel"
                          value={formData.experienceLevel}
                          onChange={handleInputChange}
                          className="w-full h-11 px-3 rounded-[8px] border border-[#E8ECF1] bg-white text-base md:text-sm text-[#0B1F3A] focus:outline-none focus:ring-2 focus:ring-[#F47B20] cursor-pointer"
                        >
                          <option value="Entry Level (0–1 Year)">Entry Level (0–1 Year)</option>
                          <option value="1–3 Years Experience">1–3 Years Experience</option>
                          <option value="3–5 Years Experience">3–5 Years Experience</option>
                          <option value="5+ Years Experience">5+ Years Experience (Senior)</option>
                        </select>
                      </div>

                      {/* Upload Google Drive Resume Link */}
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
                            className={`pl-10 h-11 rounded-[8px] border-[#E8ECF1] text-base md:text-sm focus-visible:ring-[#F47B20] ${
                              errors.resumeLink ? "border-red-500 bg-red-50/20" : ""
                            }`}
                          />
                        </div>
                        {errors.resumeLink ? (
                          <p className="mt-1 text-xs text-red-600 font-medium">
                            {errors.resumeLink}
                          </p>
                        ) : (
                          <p className="mt-1.5 text-[11.5px] text-[#667085] flex items-center gap-1.5">
                            <span className="inline-block size-1.5 rounded-full bg-[#10B981] shrink-0" />
                            <span>Ensure Google Drive link access is set to <strong>"Anyone with the link can view"</strong></span>
                          </p>
                        )}
                      </div>

                      {/* Cover Note / Key Qualifications */}
                      <div>
                        <label className="block text-[13px] font-semibold text-[#0B1F3A] mb-1">
                          Brief Qualifications / Availability (Optional)
                        </label>
                        <Textarea
                          name="coverNote"
                          rows={2}
                          placeholder="Highlight certifications, preferred shift, or earlist start date..."
                          value={formData.coverNote}
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
                              setFormData((prev) => ({
                                ...prev,
                                privacyConsent: e.target.checked,
                              }));
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
                          <span className="text-[12px] leading-snug text-[#344054]">
                            I consent to TAB V&amp;S Group processing my application for{" "}
                            <strong>{job.title}</strong> and sharing my credentials with hiring
                            managers in accordance with the{" "}
                            <span className="font-semibold text-[#0B1F3A] underline">
                              Privacy Policy
                            </span>
                            . <span className="text-[#F47B20] font-bold">*</span>
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
                              <span>Submitting Application...</span>
                            </>
                          ) : (
                            <>
                              <span>Submit Application for Position</span>
                              <ArrowRight className="size-4" />
                            </>
                          )}
                        </Button>

                        <p className="mt-2.5 text-center text-[11.5px] text-[#667085] flex items-center justify-center gap-1.5">
                          <ShieldCheck className="size-3.5 text-[#10B981]" />
                          <span>Direct-hire review • Confidential • Response within 1 day</span>
                        </p>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

