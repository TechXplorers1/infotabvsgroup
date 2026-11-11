import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Building2,
  Briefcase,
  Users,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Send,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useInView } from "@/hooks/useInView";
import hero from "@/assets/hero.jpg";
import intro from "@/assets/intro.jpg";
import {
  processContactInquiry,
  validateContactInquiry,
  ContactInquiryPayload,
  ContactFormErrors,
  StoredContactInquiry,
} from "@/services/contact-inquiries";
import { sendContactInquiryEmail } from "@/services/emailjs";

type ContactSearch = {
  candidate?: boolean;
  subject?: string;
};

export const Route = createFileRoute("/contact")({
  validateSearch: (search: Record<string, unknown>): ContactSearch => {
    const subject = typeof search["subject"] === "string" ? search["subject"] : undefined;
    return {
      candidate: search["candidate"] === true || search["candidate"] === "true",
      ...(subject ? { subject } : {}),
    };
  },
  head: () => ({
    meta: [
      { title: "Contact Us — TAB V&S Group Recruitment Agency" },
      {
        name: "description",
        content:
          "Connect with TAB V&S Group Recruitment Agency in Westerville, Ohio. Dedicated direct-hire recruitment communication for employers and job seekers.",
      },
      { property: "og:title", content: "Contact Us — TAB V&S Group Recruitment Agency" },
      {
        property: "og:description",
        content:
          "Call 380-206-4792 or message our recruitment team at 5749 Pittsford Dr, Westerville, Ohio. We connect businesses and talent across 5 key industries.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

export default function ContactPage() {
  const search = Route.useSearch();
  // Viewport detection hooks for coordinated scroll reveals
  const [heroRef, heroInView] = useInView<HTMLElement>({ threshold: 0.1, triggerOnce: true });
  const [infoRef, infoInView] = useInView<HTMLElement>({ threshold: 0.15, triggerOnce: true });
  const [inquiryRef, inquiryInView] = useInView<HTMLElement>({ threshold: 0.15, triggerOnce: true });
  const [formRef, formInView] = useInView<HTMLElement>({ threshold: 0.1, triggerOnce: true });
  const [locationRef, locationInView] = useInView<HTMLElement>({ threshold: 0.1, triggerOnce: true });
  const [faqRef, faqInView] = useInView<HTMLElement>({ threshold: 0.15, triggerOnce: true });
  const [finalCtaRef, finalCtaInView] = useInView<HTMLElement>({ threshold: 0.15, triggerOnce: true });

  // Contact form state
  const [formData, setFormData] = useState<ContactInquiryPayload>({
    fullName: "",
    emailAddress: "",
    phoneNumber: "",
    userType: search.candidate ? "Job Seeker" : "Employer",
    subject: search.subject ?? "",
    inquiryType: search.candidate ? "Job Opportunities" : "Recruitment & Staffing",
    message: "",
    privacyConsent: false,
  });
  const [formErrors, setFormErrors] = useState<ContactFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<StoredContactInquiry | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [pendingInquiry, setPendingInquiry] = useState<StoredContactInquiry | null>(null);
  const isCandidateInquiry =
    formData.userType === "Job Seeker" && formData.inquiryType === "Job Opportunities";

  useEffect(() => {
    setFormData((previous) => ({
      ...previous,
      userType: search.candidate ? "Job Seeker" : "Employer",
      inquiryType: search.candidate ? "Job Opportunities" : "Recruitment & Staffing",
      subject: search.candidate ? (search.subject ?? "") : "",
      resumeDriveLink: "",
    }));
    setFormErrors({});

    if (search.candidate) {
      requestAnimationFrame(() => {
        document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, [search.candidate, search.subject]);

  const handleInputChange = <K extends keyof ContactInquiryPayload>(
    field: K,
    value: ContactInquiryPayload[K],
  ) => {
    setPendingInquiry(null);
    setSubmissionError(null);
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (
        (field === "userType" || field === "inquiryType") &&
        !(updated.userType === "Job Seeker" && updated.inquiryType === "Job Opportunities")
      ) {
        updated.resumeDriveLink = "";
      }
      return updated;
    });
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateContactInquiry(formData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    setFormErrors({});
    setSubmissionError(null);

    try {
      const stored = pendingInquiry ?? processContactInquiry(formData);
      setPendingInquiry(stored);
      const emailResult = await sendContactInquiryEmail(stored);
      if (!emailResult.success) {
        console.error("[ContactForm] EmailJS dispatch failed:", emailResult.message);
        setSubmissionError(
          `We couldn't send your inquiry. ${emailResult.message} Please try again, or contact us at info@tabvsgroup.com.`,
        );
        return;
      }
      setPendingInquiry(null);
      setSubmissionResult(stored);
    } catch (err) {
      console.error("[ContactForm] Submission error:", err);
      setSubmissionError(
        err instanceof Error
          ? `We couldn't send your inquiry. ${err.message} Please try again, or contact us at info@tabvsgroup.com.`
          : "We couldn't send your inquiry. Please try again, or contact us at info@tabvsgroup.com.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmissionResult(null);
    setSubmissionError(null);
    setPendingInquiry(null);
    setFormData({
      fullName: "",
      emailAddress: "",
      phoneNumber: "",
      userType: "Employer",
      subject: "",
      inquiryType: "Recruitment & Staffing",
      message: "",
      ...(search.candidate
        ? {
            userType: "Job Seeker" as const,
            subject: search.subject ?? "",
            inquiryType: "Job Opportunities" as const,
          }
        : {}),
      resumeDriveLink: "",
      privacyConsent: false,
    });
    setFormErrors({});
  };

  const contactFaqs = [
    {
      q: "How can businesses request staffing support?",
      a: "Employers can submit an inquiry through our dedicated Employer Staffing Request form, send us a direct message on this page, or call our recruiting desk at 380-206-4792. A recruiter will schedule an initial consultation to review your technical standards and headcount needs.",
    },
    {
      q: "What industries does TAB V&S Group recruit for?",
      a: "We specialize in five mission-critical operational disciplines: Data Center Operations & Technician, Information Technology, Warehouse Associate Placement, Healthcare Services Placement, and Commercial Cleaning Services.",
    },
    {
      q: "How can I submit a recruitment inquiry?",
      a: "You can use the contact form on this page to detail your organization's hiring goals or general questions. Alternatively, email our recruitment team at tabeng14@infotabvsgroup.com.",
    },
    {
      q: "How can job seekers apply for available positions?",
      a: "Browse positions on our Find Jobs page and select Apply for Position, or use Submit Your Resume on the Job Seekers page. Both options open the Contact Inquiry Form, where you can share your details and a Google Drive resume link. Our services are free for job seekers.",
    },
    {
      q: "How long does the recruitment process take?",
      a: "Timelines depend on specific role specializations, shift requirements, and screening criteria. On average, our direct-hire sourcing and interview coordination delivers qualified candidate profiles within 1 to 2 weeks.",
    },
    {
      q: "Does TAB V&S Group charge job seekers?",
      a: "No. All recruitment services, profile reviews, and interview coordination are completely free for job seekers. Employers compensate TAB V&S Group only upon a successful candidate placement.",
    },
    {
      q: "How can I contact the recruitment team?",
      a: "You can reach us by phone at 380-206-4792, via email at tabeng14@infotabvsgroup.com, or visit our primary office at 5749 Pittsford Dr, Westerville, Ohio.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-[#344054]">
      {/* 02. Sticky Global Navbar */}
      <Navbar currentPath="/contact" />

      {/* =========================================================================
          SECTION 01 – CONTACT HERO
          White background, 2-column layout, Inter typography, orange highlights
          ========================================================================= */}
      <section
        ref={heroRef}
        className="relative bg-white pt-10 pb-16 md:pt-16 md:pb-24 overflow-hidden border-b border-[#E8ECF1]"
      >
        <div className="container-x">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
            {/* Left Column: Hero Editorial & Actions */}
            <div
              className="lg:col-span-6 xl:col-span-6 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                opacity: heroInView ? 1 : 0,
                transform: heroInView ? "translateY(0)" : "translateY(24px)",
              }}
            >
              {/* Eyebrow: Plain text, uppercase, warm orange, no pill/bullet dot */}
              <p className="eyebrow text-[13px] font-semibold uppercase tracking-[0.14em] text-[#F47B20]">
                GET IN TOUCH.
              </p>

              {/* Main Heading with Orange Highlight */}
              <h1 className="mt-3.5 text-4xl font-bold tracking-tight text-[#0B1F3A] sm:text-5xl lg:text-[54px] lg:leading-[1.12]">
                Let's{" "}
                <span className="text-[#F47B20]">Start a Conversation</span>.
              </h1>

              {/* Supporting Description */}
              <p className="mt-5 text-[17px] sm:text-[18px] leading-relaxed text-[#344054] max-w-xl">
                Whether you're looking for qualified talent or exploring your next career opportunity,
                TAB V&amp;S Group is here to help you make the right connection.
              </p>

              {/* Dual Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button
                  asChild
                  className="h-12 px-7 rounded-[8px] bg-[#F47B20] hover:bg-[#e06d17] text-white text-[15px] font-semibold shadow-[0_4px_16px_rgba(244,123,32,0.28)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_6px_22px_rgba(244,123,32,0.4)] group"
                >
                  <a href="#contact-form" className="inline-flex items-center gap-2">
                    <span>Contact Our Team</span>
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </a>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="h-12 px-7 rounded-[8px] border-[#D0D5DD] bg-white text-[#0B1F3A] hover:bg-[#F7F8FA] hover:border-[#0B1F3A] text-[15px] font-semibold transition-all duration-200 ease-out hover:-translate-y-0.5 group"
                >
                  <Link to="/jobs" className="inline-flex items-center gap-2">
                    <span>Explore Job Opportunities</span>
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>

              {/* 3-Column Proof Strip */}
              <div className="mt-10 pt-7 border-t border-[#E8ECF1] grid grid-cols-1 xs:grid-cols-3 gap-3.5 sm:gap-6 max-w-lg">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#667085]">
                    RESPONSE TIME
                  </p>
                  <p className="mt-1 text-[14px] sm:text-[15px] font-semibold text-[#0B1F3A]">
                    &lt; 24 Hours
                  </p>
                  <p className="text-[12px] text-[#667085]">Rapid business follow-up</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#667085]">
                    HEADQUARTERS
                  </p>
                  <p className="mt-1 text-[14px] sm:text-[15px] font-semibold text-[#0B1F3A]">
                    Westerville, OH
                  </p>
                  <p className="text-[12px] text-[#667085]">Nationwide reach</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#667085]">
                    MODEL
                  </p>
                  <p className="mt-1 text-[14px] sm:text-[15px] font-semibold text-[#0B1F3A]">
                    Direct-Hire
                  </p>
                  <p className="text-[12px] text-[#667085]">Verified placements</p>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Showcase */}
            <div
              className="lg:col-span-6 xl:col-span-6 relative transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] delay-150"
              style={{
                opacity: heroInView ? 1 : 0,
                transform: heroInView ? "scale(1)" : "scale(0.95)",
              }}
            >
              {/* Subtle orange decorative border outline accent */}
              <div
                aria-hidden="true"
                className="absolute -top-3 -right-3 w-40 h-40 rounded-[20px] border-2 border-[#F47B20]/60 pointer-events-none -z-0 hidden sm:block"
              />

              {/* Decorative Orange Dot Grid */}
              <div
                aria-hidden="true"
                className="absolute -bottom-6 -left-6 z-0 pointer-events-none hidden sm:grid grid-cols-6 gap-2"
              >
                {Array.from({ length: 24 }).map((_, i) => (
                  <span key={i} className="size-1.5 rounded-full bg-[#F47B20]/40" />
                ))}
              </div>

              {/* Main Image Container */}
              <div className="relative z-10 overflow-hidden rounded-[16px] shadow-[0_12px_36px_rgba(11,31,58,0.12)] border border-[#E8ECF1] bg-[#0B1F3A]">
                <img
                  src={intro}
                  alt="Recruiter collaborating with candidates in a modern American corporate office"
                  loading="eager"
                  width={1200}
                  height={912}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                />

                {/* Floating Bottom Card */}
                <div className="absolute bottom-4 left-4 right-4 z-20 rounded-xl bg-[#0B1F3A]/95 backdrop-blur-md border border-white/10 p-3.5 sm:p-4 shadow-2xl flex items-center gap-3.5">
                  <div className="grid size-11 shrink-0 place-items-center rounded-lg bg-[#F47B20] text-white shadow-md">
                    <Users className="size-5.5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-[15px] font-semibold text-white leading-tight">
                      Direct Recruiter Access
                    </h4>
                    <p className="mt-0.5 text-[12.5px] text-white/75 leading-tight">
                      Dedicated professionals responding directly to your workforce &amp; career inquiries.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 02 – CONTACT INFORMATION
          Off White background, 3 premium contact cards, clickable links
          ========================================================================= */}
      <section
        ref={infoRef}
        className="bg-[#F7F8FA] py-18 md:py-24 border-b border-[#E8ECF1]"
      >
        <div className="container-x">
          <div
            className="mx-auto max-w-3xl text-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              opacity: infoInView ? 1 : 0,
              transform: infoInView ? "translateY(0)" : "translateY(24px)",
            }}
          >
            <p className="eyebrow text-[13px] font-semibold uppercase tracking-[0.14em] text-[#F47B20]">
              CONTACT INFORMATION.
            </p>
            <h2 className="mt-2.5 text-3xl font-bold tracking-tight text-[#0B1F3A] sm:text-[40px] sm:leading-[1.15]">
              We're Just a Conversation Away.
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-[#344054]">
              Connect with our recruitment leadership team through our verified business channels.
            </p>
          </div>

          {/* Three Contact Cards Grid */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* CARD 01 – PHONE */}
            <div
              className="rounded-[12px] border border-[#E8ECF1] bg-white p-8 shadow-sm transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-md hover:border-[#F47B20]/40 group flex flex-col justify-between"
              style={{
                opacity: infoInView ? 1 : 0,
                transform: infoInView ? "translateY(0)" : "translateY(20px)",
                transitionDelay: "100ms",
              }}
            >
              <div>
                <div className="grid size-12 place-items-center rounded-lg bg-[#FFF1E5] text-[#F47B20] transition-transform duration-200 group-hover:scale-105">
                  <Phone className="size-6 stroke-[1.8]" />
                </div>
                <h3 className="mt-6 text-[18px] font-semibold text-[#0B1F3A]">Call Our Team.</h3>
                <p className="mt-1 text-[13.5px] text-[#667085]">Direct recruitment assistance</p>
                <div className="mt-4">
                  <a
                    href="tel:3802064792"
                    className="text-[17px] font-bold text-[#0B1F3A] hover:text-[#F47B20] transition-colors"
                  >
                    380-206-4792
                  </a>
                </div>
              </div>
              <p className="mt-6 pt-4 border-t border-[#E8ECF1] text-[13px] text-[#667085]">
                Available Mon–Fri, 8:00 AM – 5:00 PM EST
              </p>
            </div>

            {/* CARD 02 – EMAIL */}
            <div
              className="rounded-[12px] border border-[#E8ECF1] bg-white p-8 shadow-sm transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-md hover:border-[#F47B20]/40 group flex flex-col justify-between"
              style={{
                opacity: infoInView ? 1 : 0,
                transform: infoInView ? "translateY(0)" : "translateY(20px)",
                transitionDelay: "180ms",
              }}
            >
              <div>
                <div className="grid size-12 place-items-center rounded-lg bg-[#FFF1E5] text-[#F47B20] transition-transform duration-200 group-hover:scale-105">
                  <Mail className="size-6 stroke-[1.8]" />
                </div>
                <h3 className="mt-6 text-[18px] font-semibold text-[#0B1F3A]">Email Us.</h3>
                <p className="mt-1 text-[13.5px] text-[#667085]">General and staffing inquiries</p>
                <div className="mt-4">
                  <a
                    href="mailto:tabeng14@infotabvsgroup.com"
                    className="text-[16px] font-bold text-[#0B1F3A] hover:text-[#F47B20] transition-colors break-all"
                  >
                    tabeng14@infotabvsgroup.com
                  </a>
                </div>
              </div>
              <p className="mt-6 pt-4 border-t border-[#E8ECF1] text-[13px] text-[#667085]">
                Replies dispatched within 1 business day
              </p>
            </div>

            {/* CARD 03 – LOCATION */}
            <div
              className="rounded-[12px] border border-[#E8ECF1] bg-white p-8 shadow-sm transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-md hover:border-[#F47B20]/40 group flex flex-col justify-between sm:col-span-2 lg:col-span-1"
              style={{
                opacity: infoInView ? 1 : 0,
                transform: infoInView ? "translateY(0)" : "translateY(20px)",
                transitionDelay: "260ms",
              }}
            >
              <div>
                <div className="grid size-12 place-items-center rounded-lg bg-[#FFF1E5] text-[#F47B20] transition-transform duration-200 group-hover:scale-105">
                  <MapPin className="size-6 stroke-[1.8]" />
                </div>
                <h3 className="mt-6 text-[18px] font-semibold text-[#0B1F3A]">Visit Our Office.</h3>
                <p className="mt-1 text-[13.5px] text-[#667085]">Westerville Headquarters</p>
                <div className="mt-3 text-[14.5px] font-medium text-[#0B1F3A] leading-relaxed">
                  5749 Pittsford Dr,
                  <br />
                  Westerville, Ohio, USA
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E8ECF1]">
                <a
                  href="https://maps.google.com/?q=5749+Pittsford+Dr,+Westerville,+Ohio,+USA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#F47B20] hover:underline"
                >
                  <span>View Directions</span>
                  <ExternalLink className="size-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 03 – CHOOSE YOUR INQUIRY
          White background, 2 interactive inquiry cards (Employers vs Job Seekers)
          ========================================================================= */}
      <section
        ref={inquiryRef}
        className="bg-white py-20 md:py-28 border-b border-[#E8ECF1]"
      >
        <div className="container-x">
          <div
            className="mx-auto max-w-3xl text-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              opacity: inquiryInView ? 1 : 0,
              transform: inquiryInView ? "translateY(0)" : "translateY(24px)",
            }}
          >
            <p className="eyebrow text-[13px] font-semibold uppercase tracking-[0.14em] text-[#F47B20]">
              HOW CAN WE HELP?
            </p>
            <h2 className="mt-2.5 text-3xl font-bold tracking-tight text-[#0B1F3A] sm:text-[40px] sm:leading-[1.15]">
              Let's Get You to the Right Team.
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-[#344054]">
              Select your inquiry pathway for specialized recruitment support and dedicated coordination.
            </p>
          </div>

          {/* Two Large Interactive Cards */}
          <div className="mt-14 grid gap-8 md:grid-cols-2">
            {/* CARD 01 – EMPLOYERS */}
            <div
              className="group flex flex-col justify-between overflow-hidden rounded-[16px] border border-[#E8ECF1] bg-white shadow-sm transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-xl hover:border-[#F47B20]/40"
              style={{
                opacity: inquiryInView ? 1 : 0,
                transform: inquiryInView ? "translateY(0)" : "translateY(24px)",
                transitionDelay: "100ms",
              }}
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#0B1F3A]">
                <img
                  src={hero}
                  alt="Professional recruiter meeting with a business client regarding workforce staffing"
                  loading="lazy"
                  width={800}
                  height={500}
                  className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 rounded-md bg-[#0B1F3A]/90 px-3 py-1 text-[12px] font-bold text-white uppercase tracking-wider backdrop-blur-sm border border-white/10">
                  FOR EMPLOYERS
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-between p-8 sm:p-9">
                <div>
                  <h3 className="text-2xl font-bold text-[#0B1F3A] transition-colors duration-200 group-hover:text-[#F47B20]">
                    Looking for Qualified Talent?
                  </h3>
                  <p className="mt-3 text-[15.5px] leading-relaxed text-[#344054]">
                    Tell us about your staffing requirements. Our recruitment team can help you
                    explore suitable recruitment solutions across Data Centers, IT, Logistics,
                    Healthcare, and Cleaning.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-[#E8ECF1]">
                  <Button
                    asChild
                    className="h-12 px-7 rounded-[8px] bg-[#F47B20] hover:bg-[#e06d17] text-white text-[15px] font-semibold shadow-sm transition-all hover:-translate-y-0.5 group w-full sm:w-auto"
                  >
                    <Link to="/request-staffing" className="inline-flex items-center gap-2">
                      <span>Request Staffing Support</span>
                      <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* CARD 02 – JOB SEEKERS */}
            <div
              className="group flex flex-col justify-between overflow-hidden rounded-[16px] border border-[#E8ECF1] bg-white shadow-sm transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-xl hover:border-[#F47B20]/40"
              style={{
                opacity: inquiryInView ? 1 : 0,
                transform: inquiryInView ? "translateY(0)" : "translateY(24px)",
                transitionDelay: "200ms",
              }}
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#0B1F3A]">
                <img
                  src={intro}
                  alt="Professional candidate discussing career opportunities with a recruiter"
                  loading="lazy"
                  width={800}
                  height={500}
                  className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 rounded-md bg-[#0B1F3A]/90 px-3 py-1 text-[12px] font-bold text-white uppercase tracking-wider backdrop-blur-sm border border-white/10">
                  FOR JOB SEEKERS
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-between p-8 sm:p-9">
                <div>
                  <h3 className="text-2xl font-bold text-[#0B1F3A] transition-colors duration-200 group-hover:text-[#F47B20]">
                    Looking for Your Next Opportunity?
                  </h3>
                  <p className="mt-3 text-[15.5px] leading-relaxed text-[#344054]">
                    Explore available positions and discover opportunities across the industries we
                    support. Direct-hire placements with 100% free candidate support.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-[#E8ECF1]">
                  <Button
                    asChild
                    className="h-12 px-7 rounded-[8px] bg-[#F47B20] hover:bg-[#e06d17] text-white text-[15px] font-semibold shadow-sm transition-all hover:-translate-y-0.5 group w-full sm:w-auto"
                  >
                    <Link to="/jobs" className="inline-flex items-center gap-2">
                      <span>Explore Available Jobs</span>
                      <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 04 – CONTACT INQUIRY FORM
          Off White background, split-layout (Navy Left, White Right with working form)
          ========================================================================= */}
      <section
        id="contact-form"
        ref={formRef}
        className="bg-[#F7F8FA] py-20 md:py-28 border-b border-[#E8ECF1]"
      >
        <div className="container-x max-w-[1180px]">
          {/* Split Container Card */}
          <div
            className="overflow-hidden rounded-2xl border border-[#E8ECF1] bg-white shadow-[0_20px_60px_-15px_rgba(11,31,58,0.08)] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              opacity: formInView ? 1 : 0,
              transform: formInView ? "translateY(0)" : "translateY(30px)",
            }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* LEFT PANEL: Navy Blue #0B1F3A */}
              <div className="relative flex flex-col justify-between bg-[#0B1F3A] p-5 sm:p-8 md:p-10 lg:col-span-5 lg:p-12 overflow-hidden">
                {/* Subtle Ambient Decorative Glow */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full border border-[#F47B20]/15 bg-[radial-gradient(circle,rgba(244,123,32,0.12),transparent_70%)] animate-slow-float"
                />

                <div className="relative z-10">
                  <p className="eyebrow text-[12px] font-semibold uppercase tracking-[0.14em] text-[#F47B20]">
                    SEND US A MESSAGE.
                  </p>
                  <h3 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-[34px] sm:leading-[1.18]">
                    How Can We Help You?
                  </h3>
                  <p className="mt-3.5 text-[15px] sm:text-[16px] leading-relaxed text-white/80">
                    Have a question or need recruitment assistance? Send us a message and our team
                    will review your inquiry promptly.
                  </p>

                  {/* Contact Info Items */}
                  <div className="mt-8 sm:mt-10 space-y-4 sm:space-y-5 border-t border-white/10 pt-6 sm:pt-8">
                    <div className="flex items-center gap-3.5">
                      <div className="grid size-10 place-items-center rounded-lg bg-white/10 text-[#F47B20] shrink-0 border border-white/15">
                        <Phone className="size-4.5" />
                      </div>
                      <div>
                        <p className="text-[12px] uppercase tracking-wider text-white/60">Phone</p>
                        <a
                          href="tel:3802064792"
                          className="text-[15px] font-semibold text-white hover:text-[#F47B20] transition-colors"
                        >
                          380-206-4792
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3.5">
                      <div className="grid size-10 place-items-center rounded-lg bg-white/10 text-[#F47B20] shrink-0 border border-white/15">
                        <Mail className="size-4.5" />
                      </div>
                      <div>
                        <p className="text-[12px] uppercase tracking-wider text-white/60">Email</p>
                        <a
                          href="mailto:tabeng14@infotabvsgroup.com"
                          className="text-[15px] font-semibold text-white hover:text-[#F47B20] transition-colors break-all"
                        >
                          tabeng14@infotabvsgroup.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3.5">
                      <div className="grid size-10 place-items-center rounded-lg bg-white/10 text-[#F47B20] shrink-0 border border-white/15">
                        <MapPin className="size-4.5" />
                      </div>
                      <div>
                        <p className="text-[12px] uppercase tracking-wider text-white/60">Location</p>
                        <p className="text-[15px] font-semibold text-white">
                          5749 Pittsford Dr, Westerville, OH
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Direct-Hire Commitment Box */}
                <div className="relative z-10 mt-8 sm:mt-10 rounded-xl bg-white/5 p-4 border border-white/10">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="size-5 text-[#F47B20] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[14px] font-semibold text-white">Direct-Hire Standard</h4>
                      <p className="mt-1 text-[12.5px] leading-relaxed text-white/70">
                        Employers pay upon successful placement under agreed terms. Free support for
                        candidates.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT PANEL: White Background with Functional Form */}
              <div className="flex flex-col justify-between bg-white p-5 sm:p-8 md:p-10 lg:col-span-7 lg:p-12">
                {submissionResult ? (
                  /* Success Confirmation View */
                  <div className="my-auto py-8 text-center animate-fade-in">
                    <div className="mx-auto grid size-16 place-items-center rounded-full bg-[#FFF1E5] text-[#F47B20] mb-5">
                      <CheckCircle2 className="size-8 stroke-[2.2]" />
                    </div>

                    <span className="rounded-full bg-[#FFF1E5] px-4 py-1 text-[13px] font-bold text-[#F47B20]">
                      REFERENCE #{submissionResult.referenceNumber}
                    </span>

                    <h3 className="mt-4 text-2xl font-bold text-[#0B1F3A]">
                      Message Received Successfully
                    </h3>

                    <p className="mt-3 text-[15.5px] text-[#344054] max-w-md mx-auto leading-relaxed">
                      Thank you, <strong>{submissionResult.fullName}</strong>. Your inquiry was sent
                      to TAB V&amp;S Group.
                    </p>

                    <div className="mt-6 rounded-xl bg-[#F7F8FA] p-5 text-left border border-[#E8ECF1] text-[13.5px] text-[#344054]">
                      <p className="font-semibold text-[#0B1F3A] mb-1">What Happens Next?</p>
                      <p>
                        A TAB V&amp;S Group specialist will review your details and respond within 24
                        business hours. For immediate inquiries, feel free to call us directly at
                        (380) 206-4792.
                      </p>
                    </div>

                    <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                      <Button
                        type="button"
                        onClick={resetForm}
                        className="bg-[#F47B20] hover:bg-[#e06d17] text-white font-semibold h-11 px-6 rounded-[8px]"
                      >
                        Send Another Message
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="h-11 px-6 rounded-[8px] border-[#D0D5DD] text-[#0B1F3A]"
                      >
                        <Link to="/">Return to Homepage</Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Interactive Contact Form */
                  <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div>
                      <h4 className="text-xl font-bold text-[#0B1F3A]">Contact Inquiry Form</h4>
                      <p className="mt-1 text-[13.5px] text-[#667085]">
                        All fields marked with an asterisk (<span className="text-[#F47B20]">*</span>) are required.
                      </p>
                    </div>

                    {/* 1. Full Name & Email */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-[13.5px] font-medium text-[#344054] mb-1.5">
                          Full Name <span className="text-[#F47B20]">*</span>
                        </label>
                        <Input
                          type="text"
                          placeholder="Alex Morgan"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange("fullName", e.target.value)}
                          className={`h-11 ${formErrors.fullName ? "border-red-500 focus-visible:ring-red-400" : ""}`}
                        />
                        {formErrors.fullName && (
                          <p className="mt-1 text-[12px] text-red-600 flex items-center gap-1">
                            <AlertCircle className="size-3" />
                            {formErrors.fullName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-[13.5px] font-medium text-[#344054] mb-1.5">
                          Email Address <span className="text-[#F47B20]">*</span>
                        </label>
                        <Input
                          type="email"
                          placeholder="alex@company.com"
                          value={formData.emailAddress}
                          onChange={(e) => handleInputChange("emailAddress", e.target.value)}
                          className={`h-11 ${formErrors.emailAddress ? "border-red-500 focus-visible:ring-red-400" : ""}`}
                        />
                        {formErrors.emailAddress && (
                          <p className="mt-1 text-[12px] text-red-600 flex items-center gap-1">
                            <AlertCircle className="size-3" />
                            {formErrors.emailAddress}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* 2. Phone Number & I Am A */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-[13.5px] font-medium text-[#344054] mb-1.5">
                          Phone Number <span className="text-[#F47B20]">*</span>
                        </label>
                        <Input
                          type="tel"
                          placeholder="(380) 000-0000"
                          value={formData.phoneNumber}
                          onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                          className={`h-11 ${formErrors.phoneNumber ? "border-red-500 focus-visible:ring-red-400" : ""}`}
                        />
                        {formErrors.phoneNumber && (
                          <p className="mt-1 text-[12px] text-red-600 flex items-center gap-1">
                            <AlertCircle className="size-3" />
                            {formErrors.phoneNumber}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-[13.5px] font-medium text-[#344054] mb-1.5">
                          I Am A <span className="text-[#F47B20]">*</span>
                        </label>
                        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                          {(["Employer", "Job Seeker", "Other"] as const).map((type) => {
                            const isSelected = formData.userType === type;
                            return (
                              <button
                                key={type}
                                type="button"
                                onClick={() => handleInputChange("userType", type)}
                                className={`h-11 px-1 rounded-md text-[12px] sm:text-[13px] font-semibold border transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-[#0B1F3A] text-white border-[#0B1F3A]"
                                    : "bg-white text-[#344054] border-[#E8ECF1] hover:border-[#F47B20]/60"
                                }`}
                              >
                                {type}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {isCandidateInquiry && (
                      <div>
                        <label className="block text-[13.5px] font-medium text-[#344054] mb-1.5">
                          Upload Google Drive Resume Link{" "}
                          <span className="text-[#F47B20]">*</span>
                        </label>
                        <Input
                          type="url"
                          required={isCandidateInquiry}
                          placeholder="https://drive.google.com/..."
                          value={formData.resumeDriveLink ?? ""}
                          onChange={(e) => handleInputChange("resumeDriveLink", e.target.value)}
                          aria-invalid={Boolean(formErrors.resumeDriveLink)}
                          className={`h-11 ${formErrors.resumeDriveLink ? "border-red-500 focus-visible:ring-red-400" : ""}`}
                        />
                        <p className="mt-1 text-[12px] text-[#667085]">
                          Set your Google Drive or Google Docs resume link access to anyone with the link.
                        </p>
                        {formErrors.resumeDriveLink && (
                          <p className="mt-1 text-[12px] text-red-600 flex items-center gap-1">
                            <AlertCircle className="size-3" />
                            {formErrors.resumeDriveLink}
                          </p>
                        )}
                      </div>
                    )}

                    {/* 3. Subject & Inquiry Type */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-[13.5px] font-medium text-[#344054] mb-1.5">
                          Subject <span className="text-[#F47B20]">*</span>
                        </label>
                        <Input
                          type="text"
                          placeholder="e.g. Data Center Staffing Inquiry"
                          value={formData.subject}
                          onChange={(e) => handleInputChange("subject", e.target.value)}
                          className={`h-11 ${formErrors.subject ? "border-red-500 focus-visible:ring-red-400" : ""}`}
                        />
                        {formErrors.subject && (
                          <p className="mt-1 text-[12px] text-red-600 flex items-center gap-1">
                            <AlertCircle className="size-3" />
                            {formErrors.subject}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-[13.5px] font-medium text-[#344054] mb-1.5">
                          Inquiry Type <span className="text-[#F47B20]">*</span>
                        </label>
                        <select
                          aria-label="Inquiry Type"
                          value={formData.inquiryType}
                          onChange={(e) =>
                            handleInputChange(
                              "inquiryType",
                              e.target.value as ContactInquiryPayload["inquiryType"]
                            )
                          }
                          className="h-11 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base md:text-sm text-[#0B1F3A] focus:outline-none focus:ring-1 focus:ring-[#F47B20]"
                        >
                          <option value="Recruitment & Staffing">Recruitment &amp; Staffing</option>
                          <option value="Data Center Operations">Data Center Operations</option>
                          <option value="Information Technology">Information Technology</option>
                          <option value="Warehouse Staffing">Warehouse Staffing</option>
                          <option value="Healthcare Staffing">Healthcare Staffing</option>
                          <option value="Cleaning Services">Cleaning Services</option>
                          <option value="Job Opportunities">Job Opportunities</option>
                          <option value="General Inquiry">General Inquiry</option>
                        </select>
                      </div>
                    </div>

                    {/* 4. Message */}
                    <div>
                      <label className="block text-[13.5px] font-medium text-[#344054] mb-1.5">
                        Message <span className="text-[#F47B20]">*</span>
                      </label>
                      <Textarea
                        rows={4}
                        placeholder="Please describe your requirements, headcount needs, or questions..."
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        className={`text-[14px] leading-relaxed ${
                          formErrors.message ? "border-red-500 focus-visible:ring-red-400" : ""
                        }`}
                      />
                      {formErrors.message && (
                        <p className="mt-1 text-[12px] text-red-600 flex items-center gap-1">
                          <AlertCircle className="size-3" />
                          {formErrors.message}
                        </p>
                      )}
                    </div>

                    {/* 5. Privacy Policy Consent Checkbox */}
                    <div>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.privacyConsent}
                          onChange={(e) => handleInputChange("privacyConsent", e.target.checked)}
                          className="mt-1 size-4 rounded border-gray-300 text-[#F47B20] focus:ring-[#F47B20]"
                        />
                        <span className="text-[13px] text-[#667085] leading-normal">
                          I agree to the{" "}
                          <a href="#" className="text-[#F47B20] hover:underline font-medium">
                            Privacy Policy
                          </a>{" "}
                          and consent to TAB V&amp;S Group contacting me regarding this inquiry.
                        </span>
                      </label>
                      {formErrors.privacyConsent && (
                        <p className="mt-1.5 text-[12px] text-red-600 flex items-center gap-1">
                          <AlertCircle className="size-3" />
                          {formErrors.privacyConsent}
                        </p>
                      )}
                    </div>

                    {/* CTA Button */}
                    <div className="pt-2">
                      {submissionError && (
                        <p
                          className="mb-3 rounded-md border border-red-200 bg-red-50 p-3 text-left text-[13px] text-red-700"
                          role="alert"
                        >
                          {submissionError}
                        </p>
                      )}
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="h-12 w-full sm:w-auto px-8 rounded-[8px] bg-[#F47B20] hover:bg-[#e06d17] text-white text-[15px] font-semibold shadow-md transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
                      >
                        {isSubmitting ? (
                          <span>Sending Message...</span>
                        ) : (
                          <>
                            <span>Send Your Message</span>
                            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 05 – OFFICE LOCATION
          White background, verified address, responsive Google Maps embed
          ========================================================================= */}
      <section
        ref={locationRef}
        className="bg-white py-20 md:py-28 border-b border-[#E8ECF1]"
      >
        <div className="container-x">
          <div
            className="mx-auto max-w-3xl text-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              opacity: locationInView ? 1 : 0,
              transform: locationInView ? "translateY(0)" : "translateY(24px)",
            }}
          >
            <p className="eyebrow text-[13px] font-semibold uppercase tracking-[0.14em] text-[#F47B20]">
              OUR LOCATION.
            </p>
            <h2 className="mt-2.5 text-3xl font-bold tracking-tight text-[#0B1F3A] sm:text-[40px] sm:leading-[1.15]">
              Find Us in Westerville, Ohio.
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-[#344054]">
              Conveniently headquartered in Central Ohio to coordinate regional and national staffing
              operations.
            </p>
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-12 items-stretch">
            {/* Address Details Card */}
            <div
              className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-[#E8ECF1] bg-[#F7F8FA] p-8 sm:p-10 shadow-sm transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                opacity: locationInView ? 1 : 0,
                transform: locationInView ? "translateX(0)" : "translateX(-24px)",
              }}
            >
              <div>
                <span className="rounded-md bg-[#FFF1E5] px-3 py-1 text-[12px] font-bold text-[#F47B20] uppercase tracking-wider">
                  CORPORATE HEADQUARTERS
                </span>
                <h3 className="mt-4 text-2xl font-bold text-[#0B1F3A]">
                  TAB V&amp;S Group Recruitment Agency
                </h3>

                <div className="mt-6 space-y-4 text-[15px]">
                  <div className="flex items-start gap-3">
                    <MapPin className="size-5 text-[#F47B20] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[#0B1F3A]">Office Address:</strong>
                      <span className="text-[#344054] leading-relaxed">
                        5749 Pittsford Dr,
                        <br />
                        Westerville, Ohio, USA
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="size-5 text-[#F47B20] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[#0B1F3A]">Phone:</strong>
                      <a href="tel:3802064792" className="text-[#F47B20] hover:underline font-semibold">
                        380-206-4792
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="size-5 text-[#F47B20] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[#0B1F3A]">Business Hours:</strong>
                      <span className="text-[#344054]">Monday – Friday: 8:00 AM – 5:00 PM EST</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#E8ECF1]">
                <Button
                  asChild
                  className="h-12 w-full rounded-[8px] bg-[#0B1F3A] hover:bg-[#142F52] text-white text-[15px] font-semibold transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
                >
                  <a
                    href="https://maps.google.com/?q=5749+Pittsford+Dr,+Westerville,+Ohio,+USA"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>View Directions on Google Maps</span>
                    <ExternalLink className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Google Maps Embed Container */}
            <div
              className="lg:col-span-7 overflow-hidden rounded-2xl border border-[#E8ECF1] bg-white shadow-sm min-h-[380px] lg:min-h-full transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] delay-100"
              style={{
                opacity: locationInView ? 1 : 0,
                transform: locationInView ? "translateX(0)" : "translateX(24px)",
              }}
            >
              <iframe
                title="TAB V&S Group Office Location"
                src="https://maps.google.com/maps?q=5749+Pittsford+Dr,+Westerville,+OH+43081&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                className="w-full h-full min-h-[380px] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 06 – FREQUENTLY ASKED QUESTIONS
          Off White background, accessible Radix Accordion with 7 specific questions
          ========================================================================= */}
      <section
        ref={faqRef}
        className="bg-[#F7F8FA] py-20 md:py-26 border-b border-[#E8ECF1]"
      >
        <div className="container-x">
          <div
            className="mx-auto max-w-3xl text-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              opacity: faqInView ? 1 : 0,
              transform: faqInView ? "translateY(0)" : "translateY(24px)",
            }}
          >
            <p className="eyebrow text-[13px] font-semibold uppercase tracking-[0.14em] text-[#F47B20]">
              QUESTIONS &amp; ANSWERS.
            </p>
            <h2 className="mt-2.5 text-3xl font-bold tracking-tight text-[#0B1F3A] sm:text-[40px] sm:leading-[1.15]">
              Frequently Asked Questions.
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-[#344054]">
              Clear information regarding our staffing inquiries, candidate registration, and
              direct-hire placement process.
            </p>
          </div>

          <div
            className="mt-12 mx-auto max-w-3xl transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] delay-100"
            style={{
              opacity: faqInView ? 1 : 0,
              transform: faqInView ? "translateY(0)" : "translateY(16px)",
            }}
          >
            <Accordion
              type="single"
              collapsible
              defaultValue="0"
              className="rounded-xl border border-[#E8ECF1] bg-white px-6 sm:px-8 shadow-sm"
            >
              {contactFaqs.map((f, i) => (
                <AccordionItem
                  key={i}
                  value={String(i)}
                  className="border-[#E8ECF1] last:border-0"
                >
                  <AccordionTrigger className="py-5 text-left text-[16.5px] font-semibold text-[#0B1F3A] hover:no-underline hover:text-[#F47B20] transition-colors duration-200 [&[data-state=open]]:text-[#F47B20]">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-[15px] leading-relaxed text-[#344054]">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 07 – FINAL CTA
          Navy Blue #0B1F3A, large white typography, orange accents
          ========================================================================= */}
      <section
        ref={finalCtaRef}
        className="relative bg-[#0B1F3A] py-20 md:py-26 text-center text-white overflow-hidden"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,123,32,0.15),transparent_65%)]"
        />

        <div className="container-x relative">
          <div
            className="mx-auto max-w-3xl transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              opacity: finalCtaInView ? 1 : 0,
              transform: finalCtaInView ? "translateY(0)" : "translateY(24px)",
            }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-[40px] sm:leading-[1.15]">
              Let's Build the Right Connection Together.
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-white/80 max-w-xl mx-auto">
              Whether you're hiring or searching, our team is ready to help.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button
                asChild
                className="h-12 px-8 rounded-[8px] bg-[#F47B20] hover:bg-[#e06d17] text-white text-[15px] font-semibold shadow-[0_4px_20px_rgba(244,123,32,0.35)] transition-all duration-200 hover:-translate-y-0.5 group"
              >
                <a href="#contact-form" className="inline-flex items-center gap-2">
                  <span>Get in Touch</span>
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                </a>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-12 px-8 rounded-[8px] border-white/40 bg-white/5 text-white hover:bg-white hover:text-[#0B1F3A] text-[15px] font-semibold backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5"
              >
                <Link to="/services">Explore Our Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Sticky/Global Footer */}
      <Footer currentPath="/contact" />
    </div>
  );
}
