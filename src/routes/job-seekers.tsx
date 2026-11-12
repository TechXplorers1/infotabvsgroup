import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  Sparkles,
  Search,
  UserCheck,
  Building2,
  Layers,
  HeartHandshake,
  FileText,
  Handshake,
  Compass,
  Users,
  Briefcase,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ServicesAccordion } from "@/components/home/ServicesAccordion";
import { useInView } from "@/hooks/useInView";
import hero from "@/assets/hero.jpg";
import intro from "@/assets/intro.jpg";

export const Route = createFileRoute("/job-seekers")({
  head: () => ({
    meta: [
      { title: "For Job Seekers — TAB V&S Group Recruitment Agency" },
      {
        name: "description",
        content:
          "Your next career opportunity starts here. Explore direct-hire employment opportunities across Data Centers, IT, Warehousing, Healthcare, and Cleaning Services with TAB V&S Group.",
      },
      { property: "og:title", content: "For Job Seekers — TAB V&S Group Recruitment Agency" },
      {
        property: "og:description",
        content:
          "Connecting candidates with career opportunities across technology, healthcare, logistics, and facility services. 100% free candidate support.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: JobSeekersPage,
});

export default function JobSeekersPage() {
  // Intersection observer triggers for section animations
  const [heroRef, heroInView] = useInView<HTMLElement>({ threshold: 0.1, triggerOnce: true });
  const [introRef, introInView] = useInView<HTMLElement>({ threshold: 0.15, triggerOnce: true });
  const [industriesRef, industriesInView] = useInView<HTMLElement>({ threshold: 0.1, triggerOnce: true });
  const [whyRef, whyInView] = useInView<HTMLElement>({ threshold: 0.15, triggerOnce: true });
  const [processRef, processInView] = useInView<HTMLElement>({ threshold: 0.15, triggerOnce: true });
  const [benefitsRef, benefitsInView] = useInView<HTMLElement>({ threshold: 0.15, triggerOnce: true });
  const [submitCtaRef, submitCtaInView] = useInView<HTMLElement>({ threshold: 0.15, triggerOnce: true });
  const [faqRef, faqInView] = useInView<HTMLElement>({ threshold: 0.15, triggerOnce: true });
  const [finalCtaRef, finalCtaInView] = useInView<HTMLElement>({ threshold: 0.15, triggerOnce: true });

  const introHighlights = [
    {
      num: "01.",
      title: "Explore Opportunities.",
      desc: "Discover employment opportunities across different industries.",
      icon: Compass,
    },
    {
      num: "02.",
      title: "Recruitment Support.",
      desc: "Connect with our recruitment team and receive guidance throughout the recruitment process.",
      icon: UserCheck,
    },
    {
      num: "03.",
      title: "Employer Connections.",
      desc: "Explore opportunities to connect with businesses looking for qualified professionals.",
      icon: Building2,
    },
  ];

  const whyChooseUsFeatures = [
    {
      num: "01.",
      title: "Multi-Industry Opportunities.",
      desc: "Explore potential opportunities across different industries.",
      icon: Layers,
    },
    {
      num: "02.",
      title: "Candidate Matching.",
      desc: "Your experience and qualifications can be considered for relevant roles.",
      icon: UserCheck,
    },
    {
      num: "03.",
      title: "Recruitment Support.",
      desc: "Receive communication and guidance during the recruitment process.",
      icon: HeartHandshake,
    },
    {
      num: "04.",
      title: "Employer Connections.",
      desc: "Connect with employers looking for suitable candidates.",
      icon: Building2,
    },
  ];

  const processSteps = [
    {
      step: "01",
      title: "Submit Your Resume.",
      desc: "Share your contact information, qualifications and professional experience.",
      icon: FileText,
    },
    {
      step: "02",
      title: "Profile Review.",
      desc: "Our recruitment team reviews your profile against relevant opportunities.",
      icon: Search,
    },
    {
      step: "03",
      title: "Candidate Matching.",
      desc: "Where a suitable vacancy is available, your profile may be considered for the role.",
      icon: UserCheck,
    },
    {
      step: "04",
      title: "Employer Connection.",
      desc: "Suitable candidates may be introduced to employers for further recruitment consideration.",
      icon: Handshake,
    },
  ];

  const candidateBenefits = [
    {
      title: "Access to opportunities across multiple industries.",
      desc: "Explore diverse openings spanning technology infrastructure, healthcare administration, logistics operations, and commercial facilities.",
    },
    {
      title: "Simple candidate registration.",
      desc: "A quick, transparent intake process that respects your time and captures your key technical competencies and career preferences.",
    },
    {
      title: "Recruitment communication and guidance.",
      desc: "Clear updates, respectful feedback, and dedicated recruiter coordination at each phase of your interview journey.",
    },
    {
      title: "Opportunities to connect with potential employers.",
      desc: "Direct introductions to forward-thinking employers seeking motivated candidates for permanent, direct-hire placement.",
    },
  ];

  const faqs = [
    {
      q: "How can I register with TAB V&S Group?",
      a: "You can submit your resume and profile details through our online registration page or connect with our recruitment team directly. Registration is completely free for all job seekers.",
    },
    {
      q: "What industries does the agency recruit for?",
      a: "We specialize in five core operational disciplines: Data Center Operations & Technician, Information Technology, Warehouse Associate Placement, Healthcare Services Placement, and Commercial Cleaning Services.",
    },
    {
      q: "How can I submit my resume?",
      a: "Click 'Submit Your Resume' to open our Contact Inquiry Form. Select Job Seeker and Job Opportunities, then share your Google Drive resume link so our team can review your profile.",
    },
    {
      q: "Can I apply for multiple positions?",
      a: "Yes. Once registered in our candidate network, our recruiters will consider your background for any open or upcoming positions across our partner employers that match your skill set.",
    },
    {
      q: "How will I know if my profile is shortlisted?",
      a: "Our recruitment team carefully reviews incoming profiles. If your experience and qualifications align with an active employer vacancy, a recruiter will reach out directly via phone or email to discuss next steps.",
    },
    {
      q: "Does submitting my resume guarantee employment?",
      a: "No. While we actively work to connect qualified candidates with hiring employers, candidate selection and final hiring decisions rest with the prospective employer.",
    },
    {
      q: "How can I contact the recruitment team?",
      a: "You can reach our team via phone at 380-206-4792, via email at tabeng14@infotabvsgroup.com, or through the contact options on our website.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-[#344054]">
      {/* 02. Sticky Global Navbar */}
      <Navbar currentPath="/job-seekers" />

      {/* =========================================================================
          SECTION 01 – JOB SEEKERS HERO
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
                FOR JOB SEEKERS.
              </p>

              {/* Main Heading with Orange Highlight */}
              <h1 className="mt-3.5 text-4xl font-bold tracking-tight text-[#0B1F3A] sm:text-5xl lg:text-[54px] lg:leading-[1.12]">
                Your Next{" "}
                <span className="text-[#F47B20]">Career Opportunity</span>{" "}
                Starts Here.
              </h1>

              {/* Supporting Description */}
              <p className="mt-5 text-[17px] sm:text-[18px] leading-relaxed text-[#344054] max-w-xl">
                Looking for your next opportunity? TAB V&amp;S Group connects job seekers with
                potential employment opportunities across technology, data centers, healthcare,
                warehouse operations and cleaning services.
              </p>

              {/* Dual Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button
                  asChild
                  className="h-12 px-7 rounded-[8px] bg-[#F47B20] hover:bg-[#e06d17] text-white text-[15px] font-semibold shadow-[0_4px_16px_rgba(244,123,32,0.28)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_6px_22px_rgba(244,123,32,0.4)] group"
                >
                  <Link
                    to="/contact"
                    search={{ candidate: true }}
                    hash="contact-form"
                    className="inline-flex items-center gap-2"
                  >
                    <span>Explore Available Jobs</span>
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="h-12 px-7 rounded-[8px] border-[#D0D5DD] bg-white text-[#0B1F3A] hover:bg-[#F7F8FA] hover:border-[#0B1F3A] text-[15px] font-semibold transition-all duration-200 ease-out hover:-translate-y-0.5 group inline-flex items-center gap-2 cursor-pointer"
                >
                  <Link
                    to="/contact"
                    search={{ candidate: true }}
                    hash="contact-form"
                    data-resume-contact
                  >
                    <span>Submit Your Resume</span>
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>

              {/* 3-Column Proof Strip */}
              <div className="mt-10 pt-7 border-t border-[#E8ECF1] grid grid-cols-3 gap-3 sm:gap-6 max-w-lg">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#667085]">
                    CANDIDATE FEE
                  </p>
                  <p className="mt-1 text-[13px] sm:text-[15px] font-semibold text-[#0B1F3A]">
                    100% Free
                  </p>
                  <p className="text-[11px] sm:text-[12px] text-[#667085]">No costs for job seekers</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#667085]">
                    PLACEMENT TYPE
                  </p>
                  <p className="mt-1 text-[13px] sm:text-[15px] font-semibold text-[#0B1F3A]">
                    Direct-Hire
                  </p>
                  <p className="text-[11px] sm:text-[12px] text-[#667085]">Long-term careers</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#667085]">
                    SECTORS
                  </p>
                  <p className="mt-1 text-[13px] sm:text-[15px] font-semibold text-[#0B1F3A]">
                    5 Disciplines
                  </p>
                  <p className="text-[11px] sm:text-[12px] text-[#667085]">Dedicated recruiters</p>
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
              {/* Subtle orange decorative border outline accent peeking top-right */}
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
                  src={hero}
                  alt="Diverse American professionals collaborating in a modern corporate recruitment environment"
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
                      Dedicated Recruitment Guidance
                    </h4>
                    <p className="mt-0.5 text-[12.5px] text-white/75 leading-tight">
                      Connecting motivated professionals with direct-hire career opportunities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 02 – INTRODUCTION
          Off White #F7F8FA background, 3-column highlights, minimal icons
          ========================================================================= */}
      <section
        ref={introRef}
        className="bg-[#F7F8FA] py-20 md:py-26 border-b border-[#E8ECF1]"
      >
        <div className="container-x">
          <div
            className="mx-auto max-w-3xl text-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              opacity: introInView ? 1 : 0,
              transform: introInView ? "translateY(0)" : "translateY(24px)",
            }}
          >
            <p className="eyebrow text-[13px] font-semibold uppercase tracking-[0.14em] text-[#F47B20]">
              YOUR CAREER, OUR CONNECTION.
            </p>
            <h2 className="mt-2.5 text-3xl font-bold tracking-tight text-[#0B1F3A] sm:text-[40px] sm:leading-[1.15]">
              Your Skills Deserve the Right Opportunity.
            </h2>
            <p className="mt-4 text-[16px] sm:text-[17px] leading-relaxed text-[#344054]">
              At TAB V&amp;S Group, we understand that finding the right job is an important step in
              your career. Our recruitment approach focuses on connecting candidates with employers
              looking for suitable talent across multiple industries.
            </p>
          </div>

          {/* Three Supporting Highlights */}
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {introHighlights.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.num}
                  className="rounded-[12px] border border-[#E8ECF1] bg-white p-8 shadow-sm transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-md hover:border-[#F47B20]/40 group"
                  style={{
                    opacity: introInView ? 1 : 0,
                    transform: introInView ? "translateY(0)" : "translateY(20px)",
                    transitionDelay: `${100 + idx * 80}ms`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-bold tracking-wider text-[#F47B20]">
                      {item.num}
                    </span>
                    <div className="grid size-12 place-items-center rounded-lg bg-[#FFF1E5] text-[#F47B20] transition-transform duration-200 group-hover:scale-105">
                      <Icon className="size-6 stroke-[1.8]" />
                    </div>
                  </div>
                  <h3 className="mt-5 text-[20px] font-semibold text-[#0B1F3A] transition-colors duration-200 group-hover:text-[#F47B20]">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-[#344054]">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 03 – INDUSTRIES WE RECRUIT FOR
          White background, 5 premium industry cards, preselected filters
          ========================================================================= */}
      <section
        ref={industriesRef}
        id="industries"
        className="bg-white py-20 md:py-28 border-b border-[#E8ECF1]"
      >
        <div className="container-x">
          <div
            className="mx-auto max-w-3xl text-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              opacity: industriesInView ? 1 : 0,
              transform: industriesInView ? "translateY(0)" : "translateY(24px)",
            }}
          >
            <p className="eyebrow text-[13px] font-semibold uppercase tracking-[0.14em] text-[#F47B20]">
              EXPLORE CAREER PATHS.
            </p>
            <h2 className="mt-2.5 text-3xl font-bold tracking-tight text-[#0B1F3A] sm:text-[40px] sm:leading-[1.15]">
              Opportunities Across Multiple Industries.
            </h2>
            <p className="mt-4 text-[16px] sm:text-[17px] leading-relaxed text-[#344054]">
              Explore the industries where TAB V&amp;S Group supports recruitment and candidate placement.
            </p>
          </div>

          {/* Interactive Horizontal Expanding Accordion (Matching User Reference Image) */}
          <div
            className="mt-14 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] delay-200"
            style={{
              opacity: industriesInView ? 1 : 0,
              transform: industriesInView ? "translateY(0)" : "translateY(24px)",
            }}
          >
            <ServicesAccordion
              mode="job-seekers"
              ctaLabel="Explore Service"
              defaultExpandedIndex={2}
            />
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 04 – WHY WORK WITH TAB V&S GROUP?
          Off White background, 4 feature cards, responsible promises
          ========================================================================= */}
      <section
        ref={whyRef}
        className="bg-[#F7F8FA] py-20 md:py-26 border-b border-[#E8ECF1]"
      >
        <div className="container-x">
          <div
            className="mx-auto max-w-3xl text-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              opacity: whyInView ? 1 : 0,
              transform: whyInView ? "translateY(0)" : "translateY(24px)",
            }}
          >
            <p className="eyebrow text-[13px] font-semibold uppercase tracking-[0.14em] text-[#F47B20]">
              WHY CHOOSE US.
            </p>
            <h2 className="mt-2.5 text-3xl font-bold tracking-tight text-[#0B1F3A] sm:text-[40px] sm:leading-[1.15]">
              Your Career Journey Deserves the Right Support.
            </h2>
            <p className="mt-4 text-[16px] sm:text-[17px] leading-relaxed text-[#344054]">
              We offer structured guidance, attentive communication, and focused industry alignments
              to support your long-term career aspirations.
            </p>
          </div>

          {/* 4 Feature Cards */}
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyChooseUsFeatures.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.num}
                  className="rounded-[12px] border border-[#E8ECF1] bg-white p-7 shadow-sm transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-md hover:border-[#F47B20]/40 group flex flex-col justify-between"
                  style={{
                    opacity: whyInView ? 1 : 0,
                    transform: whyInView ? "translateY(0)" : "translateY(20px)",
                    transitionDelay: `${100 + idx * 70}ms`,
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-bold tracking-wider text-[#F47B20]">
                        {feat.num}
                      </span>
                      <div className="grid size-11 place-items-center rounded-lg bg-[#FFF1E5] text-[#F47B20] transition-transform duration-200 group-hover:scale-105">
                        <Icon className="size-5 stroke-[1.8]" />
                      </div>
                    </div>
                    <h3 className="mt-5 text-[18px] font-semibold text-[#0B1F3A] transition-colors duration-200 group-hover:text-[#F47B20]">
                      {feat.title}
                    </h3>
                    <p className="mt-2 text-[14.5px] leading-relaxed text-[#344054]">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 05 – HOW OUR RECRUITMENT PROCESS WORKS
          Navy Blue #0B1F3A, 4-step horizontal timeline with connecting line
          ========================================================================= */}
      <section
        ref={processRef}
        className="relative bg-[#0B1F3A] py-20 md:py-28 text-white overflow-hidden border-b border-[#142F52]"
      >
        {/* Subtle Ambient Radial Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(244,123,32,0.15),transparent_70%)]"
        />

        <div className="container-x relative">
          <div
            className="mx-auto max-w-3xl text-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              opacity: processInView ? 1 : 0,
              transform: processInView ? "translateY(0)" : "translateY(24px)",
            }}
          >
            <p className="eyebrow text-[13px] font-semibold uppercase tracking-[0.14em] text-[#F47B20]">
              YOUR JOURNEY.
            </p>
            <h2 className="mt-2.5 text-3xl font-bold tracking-tight text-white sm:text-[40px] sm:leading-[1.15]">
              A Simple Path Towards Your Next Opportunity.
            </h2>
            <p className="mt-4 text-[16px] sm:text-[17px] leading-relaxed text-white/80">
              Here's how our recruitment process helps connect candidates with suitable opportunities.
            </p>
          </div>

          {/* 4-Step Timeline Container */}
          <div className="relative mt-16">
            {/* Desktop Connecting Line */}
            <div
              aria-hidden="true"
              className="hidden lg:block absolute top-7 left-12 right-12 h-[2px] bg-white/15 -z-0"
            >
              <div
                className="h-full bg-gradient-to-r from-[#F47B20] via-[#F47B20] to-[#F47B20]/40 origin-left transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  transform: processInView ? "scaleX(1)" : "scaleX(0)",
                }}
              />
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 relative z-10">
              {processSteps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.step}
                    className="flex flex-col items-center text-center transition-all duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] group"
                    style={{
                      opacity: processInView ? 1 : 0,
                      transform: processInView ? "translateY(0)" : "translateY(24px)",
                      transitionDelay: `${150 + idx * 90}ms`,
                    }}
                  >
                    {/* Numbered Circle Badge */}
                    <div className="grid size-14 place-items-center rounded-full bg-[#F47B20] text-white font-bold text-[17px] shadow-[0_0_24px_rgba(244,123,32,0.4)] ring-4 ring-[#0B1F3A] transition-transform duration-300 group-hover:scale-110">
                      <span>{step.step}</span>
                    </div>

                    {/* Step Icon Badge */}
                    <div className="mt-5 grid size-10 place-items-center rounded-lg bg-white/10 text-white border border-white/15">
                      <Icon className="size-5 stroke-[1.8]" />
                    </div>

                    {/* Heading */}
                    <h3 className="mt-4 text-[18px] font-semibold text-white">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-2 text-[14.5px] leading-relaxed text-white/75">
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Timeline Footer Note */}
          <div className="mt-14 pt-8 border-t border-white/10 text-center">
            <p className="text-[14px] text-white/60">
              Direct-hire model: You become a permanent employee of the hiring organization from day one.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 06 – CANDIDATE BENEFITS
          White background, 2-column editorial layout with recruiter photograph
          ========================================================================= */}
      <section
        ref={benefitsRef}
        className="bg-white py-20 md:py-28 border-b border-[#E8ECF1]"
      >
        <div className="container-x">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Left Column: Photograph of recruiter and candidate discussion */}
            <div
              className="lg:col-span-6 relative transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                opacity: benefitsInView ? 1 : 0,
                transform: benefitsInView ? "translateX(0)" : "translateX(-24px)",
              }}
            >
              <div className="relative overflow-hidden rounded-[16px] border border-[#E8ECF1] bg-[#0B1F3A] shadow-[0_12px_36px_rgba(11,31,58,0.08)]">
                <img
                  src={intro}
                  alt="Candidate speaking with a professional recruiter in a modern American corporate office"
                  loading="lazy"
                  width={1200}
                  height={912}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                />

                <div className="p-5 sm:p-6 bg-white border-t border-[#E8ECF1]">
                  <div className="flex items-center gap-4">
                    <div className="grid size-12 shrink-0 place-items-center rounded-[8px] bg-[#FFF1E5] text-[#F47B20]">
                      <Briefcase className="size-6 stroke-[1.8]" />
                    </div>
                    <div>
                      <h4 className="text-[16px] font-semibold text-[#0B1F3A]">
                        Candidate-First Partnership
                      </h4>
                      <p className="text-[13px] text-[#344054]">
                        Personalized recruiter support matching your background with long-term careers.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Benefits Content & Checklist */}
            <div
              className="lg:col-span-6 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] delay-100"
              style={{
                opacity: benefitsInView ? 1 : 0,
                transform: benefitsInView ? "translateX(0)" : "translateX(24px)",
              }}
            >
              <p className="eyebrow text-[13px] font-semibold uppercase tracking-[0.14em] text-[#F47B20]">
                CANDIDATE ADVANTAGES.
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#0B1F3A] sm:text-[40px] sm:leading-[1.15]">
                More Than Just Finding a Job.
              </h2>
              <p className="mt-4 text-[16px] leading-relaxed text-[#344054]">
                We aim to make the process of connecting with potential employment opportunities
                clear and accessible.
              </p>

              {/* 4 Benefits with Orange Check Icons */}
              <div className="mt-8 space-y-5">
                {candidateBenefits.map((b, idx) => (
                  <div key={idx} className="flex items-start gap-3.5">
                    <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-[#FFF1E5] text-[#F47B20]">
                      <Check className="size-3.5 stroke-[2.5]" />
                    </span>
                    <div>
                      <h3 className="text-[16px] sm:text-[17px] font-semibold text-[#0B1F3A]">
                        {b.title}
                      </h3>
                      <p className="mt-1 text-[14.5px] leading-relaxed text-[#344054]">
                        {b.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Button */}
              <div className="mt-9">
                <Button
                  asChild
                  className="h-12 px-7 rounded-[8px] bg-[#F47B20] hover:bg-[#e06d17] text-white text-[15px] font-semibold shadow-[0_4px_16px_rgba(244,123,32,0.25)] transition-all duration-200 ease-out hover:-translate-y-0.5 group"
                >
                  <Link
                    to="/jobs"
                    className="inline-flex items-center gap-2"
                  >
                    <span>Explore Opportunities</span>
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 07 – SUBMIT YOUR RESUME
          Navy Blue #0B1F3A, Candidate Registration CTA panel (no large form here)
          ========================================================================= */}
      <section
        ref={submitCtaRef}
        className="relative bg-[#0B1F3A] py-20 md:py-24 text-white overflow-hidden border-y border-[#142F52]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,123,32,0.18),transparent_65%)]"
        />

        <div className="container-x relative">
          <div
            className="mx-auto max-w-3xl text-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              opacity: submitCtaInView ? 1 : 0,
              transform: submitCtaInView ? "translateY(0)" : "translateY(24px)",
            }}
          >
            {/* Heading */}
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-[42px] sm:leading-[1.15]">
              Ready to Take the Next Step?
            </h2>

            {/* Description */}
            <p className="mt-4 text-[16px] sm:text-[17px] leading-relaxed text-white/80 max-w-2xl mx-auto">
              Share your resume with TAB V&amp;S Group and let our recruitment team know what type of
              opportunity you're looking for.
            </p>

            {/* Dual CTAs */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button
              asChild
              className="h-12 px-8 rounded-[8px] bg-[#F47B20] hover:bg-[#e06d17] text-white text-[15px] font-semibold shadow-[0_4px_20px_rgba(244,123,32,0.4)] transition-all duration-200 hover:-translate-y-0.5 group inline-flex items-center gap-2 cursor-pointer"
              >
              <Link
                to="/contact"
                search={{ candidate: true }}
                hash="contact-form"
                data-resume-contact
              >
                <span>Submit Your Resume</span>
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-12 px-8 rounded-[8px] border-white/40 bg-white/5 text-white hover:bg-white hover:text-[#0B1F3A] text-[15px] font-semibold backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5"
              >
                <Link to="/contact" search={{ candidate: true }} hash="contact-form">
                  Explore Available Jobs
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 08 – FREQUENTLY ASKED QUESTIONS
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
              CANDIDATE FAQ.
            </p>
            <h2 className="mt-2.5 text-3xl font-bold tracking-tight text-[#0B1F3A] sm:text-[40px] sm:leading-[1.15]">
              Frequently Asked Questions.
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-[#344054]">
              Common questions about registration, resume submissions, candidate matching, and our
              direct-hire recruitment model.
            </p>
          </div>

          {/* Accordion List */}
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
              {faqs.map((f, i) => (
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
          SECTION 09 – FINAL CTA
          Navy Blue background, centered layout with orange decorative elements
          ========================================================================= */}
      <section
        ref={finalCtaRef}
        className="relative bg-[#0B1F3A] py-20 md:py-26 text-center text-white overflow-hidden"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,123,32,0.14),transparent_65%)]"
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
              Your Next Opportunity Could Be One Step Away.
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-white/80 max-w-xl mx-auto">
              Explore available opportunities and take the next step in your career journey.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button
                asChild
                className="h-12 px-8 rounded-[8px] bg-[#F47B20] hover:bg-[#e06d17] text-white text-[15px] font-semibold shadow-[0_4px_20px_rgba(244,123,32,0.35)] transition-all duration-200 hover:-translate-y-0.5 group"
              >
                <Link
                  to="/contact"
                  search={{ candidate: true }}
                  hash="contact-form"
                  className="inline-flex items-center gap-2"
                >
                  <span>Find Available Jobs</span>
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-12 px-8 rounded-[8px] border-white/40 bg-white/5 text-white hover:bg-white hover:text-[#0B1F3A] text-[15px] font-semibold backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
              >
                <Link
                  to="/contact"
                  search={{ candidate: true }}
                  hash="contact-form"
                  data-resume-contact
                >
                  Submit Your Resume
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 12. Sticky/Global Footer */}
      <Footer currentPath="/job-seekers" />
    </div>
  );
}
