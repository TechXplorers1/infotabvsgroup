import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  FileText,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building2,
  Clock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { processResumeSubmission } from "@/services/resume-submissions";
import { sendResumeSubmissionEmail } from "@/services/emailjs";

type CandidateRegisterSearchParams = {
  industry?: string | undefined;
  position?: string | undefined;
};

export const Route = createFileRoute("/job-seekers/register")({
  validateSearch: (search: Record<string, unknown>): CandidateRegisterSearchParams => {
    const rawIndustry = search["industry"];
    const rawPosition = search["position"];
    return {
      industry: typeof rawIndustry === "string" ? rawIndustry : undefined,
      position: typeof rawPosition === "string" ? rawPosition : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Candidate Registration — TAB V&S Group Recruitment Agency" },
      {
        name: "description",
        content:
          "Register with TAB V&S Group to be considered for direct-hire career opportunities across Data Centers, IT, Warehousing, Healthcare, and Cleaning Services.",
      },
      { property: "og:title", content: "Candidate Registration — TAB V&S Group" },
      {
        property: "og:description",
        content: "Submit your resume to our direct-hire candidate network. 100% free for job seekers.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: CandidateRegistrationPage,
});

export default function CandidateRegistrationPage() {
  const search = Route.useSearch();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    industry: search.industry || "data-center",
    desiredPosition: search.position || "",
    experience: "1–3 years",
    availability: "Immediately",
    linkedin: "",
    resumeSummary: "",
    consent: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone || !formData.consent) {
      alert("Please fill in all required fields and accept the privacy consent.");
      return;
    }

    setIsSubmitting(true);
    try {
      const summaryParts = [
        formData.location ? `Location: ${formData.location}` : "",
        formData.availability ? `Availability: ${formData.availability}` : "",
        formData.linkedin ? `LinkedIn/Portfolio: ${formData.linkedin}` : "",
        formData.resumeSummary ? `Summary:\n${formData.resumeSummary}` : "",
      ]
        .filter(Boolean)
        .join("\n\n");

      const record = processResumeSubmission({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        industry: formData.industry,
        desiredPosition: formData.desiredPosition?.trim() || undefined,
        experience: formData.experience,
        resumeLink: formData.linkedin?.trim() || undefined,
        resumeSummary: summaryParts,
        privacyConsent: formData.consent,
      });

      // Dispatch to EmailJS
      try {
        await sendResumeSubmissionEmail(record);
      } catch (err) {
        console.warn("[CandidateRegister] EmailJS dispatch issue:", err);
      }

      setSubmittedRef(record.referenceNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("[CandidateRegister] Submission error:", err);
      alert("An error occurred while submitting your registration. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#344054]">
      <Navbar currentPath="/job-seekers" />

      {/* Header Banner */}
      <section className="relative overflow-hidden bg-[#0B1F3A] py-14 md:py-18 text-white border-b border-[#142F52]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(244,123,32,0.18),transparent_70%)]"
        />

        <div className="container-x relative">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow text-[13px] font-semibold uppercase tracking-[0.14em] text-[#F47B20]">
              CANDIDATE INTAKE
            </p>
            <h1 className="mt-2.5 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[46px]">
              Submit Your Resume to{" "}
              <span className="text-[#F47B20]">TAB V&amp;S Group</span>
            </h1>
            <p className="mt-3.5 text-[16px] text-white/80 leading-relaxed max-w-xl mx-auto">
              Our recruitment team matches qualified candidates with verified direct-hire opportunities.
              Registration is completely free.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="bg-[#F7F8FA] py-14 md:py-20 border-b border-[#E8ECF1]">
        <div className="container-x max-w-4xl">
          {submittedRef ? (
            /* Success Confirmation State */
            <div className="rounded-2xl border border-[#E8ECF1] bg-white p-8 sm:p-12 shadow-lg text-center animate-fade-in">
              <div className="mx-auto grid size-16 place-items-center rounded-full bg-[#FFF1E5] text-[#F47B20] mb-6">
                <CheckCircle2 className="size-8 stroke-[2.2]" />
              </div>

              <span className="rounded-full bg-[#FFF1E5] px-4 py-1 text-[13px] font-bold text-[#F47B20]">
                REFERENCE #{submittedRef}
              </span>

              <h2 className="mt-4 text-3xl font-bold text-[#0B1F3A]">
                Resume Received Successfully
              </h2>

              <p className="mt-3 text-[16px] text-[#344054] max-w-xl mx-auto leading-relaxed">
                Thank you, <strong>{formData.fullName}</strong>. Your candidate registration has been
                logged with our recruitment desk. A confirmation has been recorded for{" "}
                <strong>{formData.email}</strong>.
              </p>

              {/* What Happens Next */}
              <div className="mt-8 rounded-xl bg-[#F7F8FA] p-6 text-left border border-[#E8ECF1]">
                <h4 className="text-[15px] font-semibold text-[#0B1F3A] mb-3 flex items-center gap-2">
                  <Clock className="size-4 text-[#F47B20]" />
                  What Happens Next?
                </h4>
                <ol className="space-y-2 text-[14px] text-[#344054] list-decimal list-inside">
                  <li>Our sector recruiter reviews your qualifications against active employer openings.</li>
                  <li>If your background matches an open vacancy, we will contact you directly via phone or email.</li>
                  <li>Direct-hire placement: You interview directly with hiring managers for permanent roles.</li>
                </ol>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Button
                  asChild
                  className="bg-[#F47B20] hover:bg-[#e06d17] text-white font-semibold h-11 px-6 rounded-[8px]"
                >
                  <Link to="/jobs">Explore Available Jobs</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-11 px-6 rounded-[8px] border-[#D0D5DD] text-[#0B1F3A]"
                >
                  <Link to="/job-seekers">Back to Job Seekers</Link>
                </Button>
              </div>
            </div>
          ) : (
            /* Registration Form */
            <div className="rounded-2xl border border-[#E8ECF1] bg-white p-5 sm:p-8 md:p-12 shadow-sm">
              <div className="border-b border-[#E8ECF1] pb-6 mb-8">
                <h2 className="text-2xl font-bold text-[#0B1F3A]">Candidate Registration Form</h2>
                <p className="mt-1.5 text-[14.5px] text-[#667085]">
                  Please provide accurate information so our recruiters can match you with the right employers.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* 1. Contact Information */}
                <div>
                  <h3 className="text-[17px] font-semibold text-[#0B1F3A] mb-4 flex items-center gap-2">
                    <User className="size-4.5 text-[#F47B20]" />
                    1. Contact Information
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-[13.5px] font-medium text-[#344054] mb-1.5">
                        Full Name <span className="text-[#F47B20]">*</span>
                      </label>
                      <Input
                        required
                        type="text"
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="h-11"
                      />
                    </div>

                    <div>
                      <label className="block text-[13.5px] font-medium text-[#344054] mb-1.5">
                        Email Address <span className="text-[#F47B20]">*</span>
                      </label>
                      <Input
                        required
                        type="email"
                        placeholder="john.doe@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="h-11"
                      />
                    </div>

                    <div>
                      <label className="block text-[13.5px] font-medium text-[#344054] mb-1.5">
                        Phone Number <span className="text-[#F47B20]">*</span>
                      </label>
                      <Input
                        required
                        type="tel"
                        placeholder="(000) 000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="h-11"
                      />
                    </div>

                    <div>
                      <label className="block text-[13.5px] font-medium text-[#344054] mb-1.5">
                        City, State <span className="text-[#F47B20]">*</span>
                      </label>
                      <Input
                        required
                        type="text"
                        placeholder="Westerville, OH"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="h-11"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Target Discipline & Position */}
                <div className="pt-6 border-t border-[#E8ECF1]">
                  <h3 className="text-[17px] font-semibold text-[#0B1F3A] mb-4 flex items-center gap-2">
                    <Briefcase className="size-4.5 text-[#F47B20]" />
                    2. Career Target &amp; Background
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-[13.5px] font-medium text-[#344054] mb-1.5">
                        Target Industry <span className="text-[#F47B20]">*</span>
                      </label>
                      <select
                        aria-label="Target Industry"
                        value={formData.industry}
                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                        className="h-11 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base md:text-sm text-[#0B1F3A] focus:outline-none focus:ring-1 focus:ring-[#F47B20]"
                      >
                        <option value="data-center">Data Center Operations &amp; Technician</option>
                        <option value="it">Information Technology</option>
                        <option value="warehouse">Warehouse Associate Placement</option>
                        <option value="healthcare">Healthcare Services Placement</option>
                        <option value="cleaning">Cleaning Services Placement</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[13.5px] font-medium text-[#344054] mb-1.5">
                        Desired Role / Job Title
                      </label>
                      <Input
                        type="text"
                        placeholder="e.g. Systems Administrator, Warehouse Lead"
                        value={formData.desiredPosition}
                        onChange={(e) => setFormData({ ...formData, desiredPosition: e.target.value })}
                        className="h-11"
                      />
                    </div>

                    <div>
                      <label className="block text-[13.5px] font-medium text-[#344054] mb-1.5">
                        Relevant Experience
                      </label>
                      <select
                        aria-label="Relevant Experience"
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                        className="h-11 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base md:text-sm text-[#0B1F3A] focus:outline-none focus:ring-1 focus:ring-[#F47B20]"
                      >
                        <option value="Entry Level (< 1 year)">Entry Level (&lt; 1 year)</option>
                        <option value="1–3 years">1–3 years</option>
                        <option value="3–5 years">3–5 years</option>
                        <option value="5+ years">5+ years</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[13.5px] font-medium text-[#344054] mb-1.5">
                        Availability / Notice Period
                      </label>
                      <select
                        aria-label="Availability / Notice Period"
                        value={formData.availability}
                        onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                        className="h-11 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base md:text-sm text-[#0B1F3A] focus:outline-none focus:ring-1 focus:ring-[#F47B20]"
                      >
                        <option value="Immediately">Immediately</option>
                        <option value="1–2 Weeks Notice">1–2 Weeks Notice</option>
                        <option value="1 Month Notice">1 Month Notice</option>
                        <option value="Exploring Options">Exploring Options</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 3. Resume & Profile Summary */}
                <div className="pt-6 border-t border-[#E8ECF1]">
                  <h3 className="text-[17px] font-semibold text-[#0B1F3A] mb-4 flex items-center gap-2">
                    <FileText className="size-4.5 text-[#F47B20]" />
                    3. Resume &amp; Qualifications
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[13.5px] font-medium text-[#344054] mb-1.5">
                        LinkedIn / Portfolio URL (Optional)
                      </label>
                      <Input
                        type="url"
                        placeholder="https://linkedin.com/in/yourprofile"
                        value={formData.linkedin}
                        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                        className="h-11"
                      />
                    </div>

                    <div>
                      <label className="block text-[13.5px] font-medium text-[#344054] mb-1.5">
                        Professional Summary &amp; Key Certifications <span className="text-[#F47B20]">*</span>
                      </label>
                      <Textarea
                        required
                        rows={5}
                        placeholder="Paste your career overview, key certifications, equipment or technical systems experience, and previous employer roles here..."
                        value={formData.resumeSummary}
                        onChange={(e) => setFormData({ ...formData, resumeSummary: e.target.value })}
                        className="text-[14px] leading-relaxed"
                      />
                    </div>

                    {/* Privacy Consent */}
                    <div className="pt-2">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          required
                          checked={formData.consent}
                          onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                          className="mt-1 size-4 rounded border-gray-300 text-[#F47B20] focus:ring-[#F47B20]"
                        />
                        <span className="text-[13px] text-[#667085] leading-normal">
                          I consent to TAB V&amp;S Group storing my contact details and professional
                          summary for recruitment matching with prospective hiring employers under direct-hire terms.
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-6 border-t border-[#E8ECF1] flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-[13px] text-[#667085]">
                    <ShieldCheck className="size-4 text-[#F47B20]" />
                    <span>Your information is kept secure and confidential.</span>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-12 px-8 rounded-[8px] bg-[#F47B20] hover:bg-[#e06d17] text-white text-[15px] font-semibold shadow-md transition-all hover:-translate-y-0.5"
                  >
                    {isSubmitting ? "Submitting Registration..." : "Complete Registration →"}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>

      <Footer currentPath="/job-seekers" />
    </div>
  );
}
