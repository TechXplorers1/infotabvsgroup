import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronRight,
  Target,
  UserCheck,
  HeartHandshake,
  Briefcase,
  Compass,
  CheckCircle2,
  Users,
  Search,
  Check,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { IndustriesShowcase } from "@/components/about/IndustriesShowcase";
import hero from "@/assets/hero.jpg";
import intro from "@/assets/intro.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — TAB V&S Group Recruitment Agency" },
      {
        name: "description",
        content:
          "Building connections that create opportunities. Learn about TAB V&S Group's direct-hire recruitment philosophy, mission, vision, and supported industries.",
      },
      { property: "og:title", content: "About Us — TAB V&S Group Recruitment Agency" },
      {
        property: "og:description",
        content:
          "A recruitment partner focused on people and possibilities. Connecting employers with qualified talent across critical industries.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

export default function AboutPage() {
  const whyChooseUs = [
    {
      icon: Target,
      title: "Focused Recruitment",
      desc: "We concentrate our efforts on specialized industry sectors. This dedicated focus enables our team to understand distinct operational requirements, specialized skill sets, and working conditions far better than broad generalist agencies.",
    },
    {
      icon: UserCheck,
      title: "Candidate Matching",
      desc: "Our screening methodology evaluates practical experience, verified credentials, and career objectives to ensure each candidate aligns with both the technical demands of the role and the organization's work environment.",
    },
    {
      icon: HeartHandshake,
      title: "Personalized Support",
      desc: "We assign dedicated recruitment specialists to provide close, attentive guidance for employers and job seekers alike, maintaining open communication and responsive coordination at every step.",
    },
    {
      icon: Briefcase,
      title: "Direct-Hire Approach",
      desc: "We focus on direct-hire placements where candidates become direct employees of your organization from day one, fostering mutual loyalty, organizational stability, and sustainable career advancement.",
    },
  ];

  const philosophyPillars = [
    {
      step: "01",
      title: "Understanding Employer Requirements",
      desc: "We invest time up front to examine each client's specific operational needs, workflows, team culture, and technical criteria before initiating candidate sourcing.",
    },
    {
      step: "02",
      title: "Holistic Candidate Suitability",
      desc: "We evaluate candidates beyond their resumes—assessing hands-on competencies, work ethic, professional aspirations, and long-term suitability for the workplace.",
    },
    {
      step: "03",
      title: "Relationship-Driven Matching",
      desc: "We treat recruitment as a collaborative partnership rather than a short-term transaction, focusing on placements where candidates thrive and employers build lasting strength.",
    },
    {
      step: "04",
      title: "Transparent & Honest Communication",
      desc: "We uphold clear expectations and continuous feedback throughout the hiring cycle, ensuring clarity, trust, and mutual alignment for all parties.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-[#344054]">
      {/* Sticky Header */}
      <Navbar currentPath="/about" />

      {/* SECTION 01 – ABOUT TAB V&S GROUP (MINIMALIST CORPORATE HERO) */}
      <section className="relative bg-white pt-10 pb-16 md:pt-16 md:pb-24 overflow-hidden border-b border-[#E8ECF1]">
        <div className="container-x">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
            {/* Left Column: Hero Editorial & Actions */}
            <div className="lg:col-span-6 xl:col-span-6">
              {/* Eyebrow: Plain text, uppercase, no badge container or dot */}
              <p className="eyebrow text-[13px] font-semibold uppercase tracking-[0.14em] text-[#F47B20]">
                ABOUT TAB V&amp;S GROUP.
              </p>

              {/* Main Headline */}
              <h1 className="mt-3.5 text-4xl font-bold tracking-tight text-[#0B1F3A] sm:text-[48px] sm:leading-[1.12]">
                Building Connections That Create{" "}
                <span className="text-[#F47B20]">Opportunities.</span>
              </h1>

              {/* Short Description (max 2–3 lines on desktop) */}
              <p className="mt-5 text-[15px] sm:text-[16px] leading-relaxed text-[#344054] max-w-xl">
                We connect businesses with qualified professionals through reliable, direct-hire
                recruitment solutions across five essential industries.
              </p>

              {/* Dual Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button
                  asChild
                  className="h-11 px-6 rounded-[8px] bg-[#F47B20] hover:bg-[#e06d17] text-white text-[14px] font-semibold shadow-[0_4px_16px_rgba(244,123,32,0.25)] transition-all duration-200 ease-out hover:-translate-y-0.5 group cursor-pointer"
                >
                  <Link to="/request-staffing" className="flex items-center gap-2">
                    <span>Hire Talent</span>
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="h-11 px-6 rounded-[8px] border-[#D0D5DD] bg-white text-[#0B1F3A] hover:bg-[#F7F8FA] hover:border-[#0B1F3A] text-[14px] font-semibold transition-all duration-200 ease-out hover:-translate-y-0.5 cursor-pointer"
                >
                  <a href="#industries" className="flex items-center gap-2">
                    <span>Explore Our Sectors</span>
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </a>
                </Button>
              </div>

              {/* 3 Compact Information Points */}
              <div className="mt-10 pt-7 border-t border-[#E8ECF1] grid grid-cols-1 xs:grid-cols-3 gap-3.5 sm:gap-6 max-w-lg">
                <div>
                  <p className="text-[12px] font-bold uppercase tracking-wider text-[#667085]">
                    MODEL:
                  </p>
                  <p className="mt-1 text-[14px] sm:text-[15px] font-semibold text-[#0B1F3A]">
                    Direct-Hire Placements.
                  </p>
                </div>
                <div>
                  <p className="text-[12px] font-bold uppercase tracking-wider text-[#667085]">
                    FOCUS:
                  </p>
                  <p className="mt-1 text-[14px] sm:text-[15px] font-semibold text-[#0B1F3A]">
                    5 Essential Sectors.
                  </p>
                </div>
                <div>
                  <p className="text-[12px] font-bold uppercase tracking-wider text-[#667085]">
                    APPROACH:
                  </p>
                  <p className="mt-1 text-[14px] sm:text-[15px] font-semibold text-[#0B1F3A]">
                    People-First Fit.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Showcase */}
            <div className="lg:col-span-6 xl:col-span-6 relative">
              {/* Subtle Orange Outline Decoration */}
              <div
                aria-hidden="true"
                className="absolute -top-3 -right-3 w-40 h-40 rounded-[18px] border-2 border-[#F47B20]/50 pointer-events-none -z-0 hidden sm:block"
              />

              {/* Decorative Dot Grid */}
              <div
                aria-hidden="true"
                className="absolute -bottom-6 -left-6 z-0 pointer-events-none hidden sm:grid grid-cols-6 gap-2"
              >
                {Array.from({ length: 24 }).map((_, i) => (
                  <span key={i} className="size-1.5 rounded-full bg-[#F47B20]/40" />
                ))}
              </div>

              {/* Main Image Container */}
              <div className="relative z-10 overflow-hidden rounded-[14px] shadow-[0_12px_36px_rgba(11,31,58,0.12)] border border-[#E8ECF1] bg-[#0B1F3A]">
                <img
                  src={intro}
                  alt="TAB V&S Group collaborative recruitment team meeting in a modern corporate setting"
                  loading="eager"
                  width={1200}
                  height={912}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                />

                {/* Minimal Floating Information Label */}
                <div className="absolute bottom-4 left-4 right-4 z-20 rounded-xl bg-[#0B1F3A]/95 backdrop-blur-md border border-white/10 p-3.5 sm:p-4 shadow-2xl flex items-center gap-3.5">
                  <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#F47B20] text-white shadow-md">
                    <Users className="size-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-[15px] font-semibold text-white leading-tight">
                      Collaborative Staffing Team
                    </h4>
                    <p className="mt-0.5 text-[13px] text-white/75 leading-tight">
                      Connecting people with opportunities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 02 – COMPANY INTRODUCTION (CONCISE HOW WE WORK) */}
      <section className="bg-[#F7F8FA] py-16 md:py-24 border-b border-[#E8ECF1]">
        <div className="container-x">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left Column: Introduction */}
            <div>
              {/* Eyebrow: Plain text, uppercase, no badge container, no horizontal bar, no dot */}
              <p className="eyebrow text-[13px] font-semibold uppercase tracking-[0.14em] text-[#F47B20]">
                COMPANY INTRODUCTION.
              </p>

              <h2 className="mt-3.5 text-3xl sm:text-[38px] sm:leading-[1.18] font-bold tracking-tight text-[#0B1F3A]">
                A Recruitment Partner Focused on People and Possibilities.
              </h2>

              <p className="mt-5 text-[15px] sm:text-[16px] leading-relaxed text-[#344054] max-w-xl">
                We bring employers and talented professionals together through thoughtful recruitment,
                clear communication and lasting connections.
              </p>

              {/* 4 Compact Value Points (2x2 layout, small orange outline icons, no sub-descriptions) */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
                {[
                  "Industry-Focused Recruitment.",
                  "Quality Candidate Matching.",
                  "Personalized Support.",
                  "Direct-Hire Placements.",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full border border-[#F47B20]/40 bg-[#FFF1E5] text-[#F47B20]">
                      <Check className="size-3.5 text-[#F47B20]" strokeWidth={2.5} />
                    </span>
                    <span className="text-[14px] sm:text-[15px] font-medium text-[#0B1F3A]">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Professional Corporate Office Photograph */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-[14px] border border-[#E8ECF1] bg-white shadow-[0_8px_30px_rgba(11,31,58,0.08)]">
                <img
                  src={hero}
                  alt="Professional corporate office environment representing TAB V&S Group's corporate headquarters"
                  loading="lazy"
                  width={1200}
                  height={912}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                />
                <div className="p-5 bg-white border-t border-[#E8ECF1]">
                  <div className="flex items-center gap-3.5">
                    <div className="grid size-11 shrink-0 place-items-center rounded-[8px] bg-[#FFF1E5] text-[#F47B20]">
                      <Building2 className="size-5.5" strokeWidth={1.75} />
                    </div>
                    <div>
                      <h4 className="text-[16px] font-semibold text-[#0B1F3A] leading-tight">
                        Professional Workplace &amp; Operations
                      </h4>
                      <p className="mt-0.5 text-[13px] text-[#667085] leading-tight">
                        Connecting businesses and professionals.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 03 – MISSION AND VISION */}
      <section className="bg-white py-20 md:py-28 border-b border-[#E8ECF1]">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-[13px] font-semibold uppercase tracking-[0.14em] text-[#F47B20]">
              Guiding Principles
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0B1F3A] md:text-[40px] md:leading-[1.15]">
              Our Mission and Vision
            </h2>
            <p className="mt-4 text-[16px] text-[#344054]">
              Clear standards that shape how we serve our client partners and candidates every day.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-2">
            {/* Card 01 – Our Mission */}
            <div className="group relative flex flex-col justify-between rounded-[12px] border border-[#E8ECF1] bg-[#F7F8FA] p-8 md:p-10 shadow-[0_2px_8px_rgba(11,31,58,0.04)] transition-all duration-300 hover:border-[#F47B20]/40 hover:bg-white hover:shadow-[0_8px_24px_rgba(11,31,58,0.08)]">
              <div>
                <div className="flex items-center justify-between">
                  <span className="grid size-12 place-items-center rounded-[8px] bg-[#FFF1E5] text-[#F47B20] transition-colors group-hover:bg-[#F47B20] group-hover:text-white">
                    <Target className="size-6" strokeWidth={1.75} />
                  </span>
                  <span className="text-[13px] font-semibold uppercase tracking-wider text-[#0B1F3A]/50">
                    Mission Statement
                  </span>
                </div>

                <h3 className="mt-6 text-2xl font-semibold text-[#0B1F3A] md:text-[28px] leading-snug">
                  Our Mission
                </h3>

                <blockquote className="mt-4 border-l-2 border-[#F47B20] pl-4 text-[18px] font-normal leading-relaxed text-[#344054]">
                  "To connect businesses with qualified talent while helping individuals access
                  meaningful career opportunities."
                </blockquote>

                <p className="mt-6 text-[15px] leading-relaxed text-[#344054]/90">
                  We strive every day to deliver measurable hiring value to employers while
                  supporting job seekers with respect, advocacy, and authentic career advancement.
                </p>
              </div>

              <div className="mt-8 flex items-center gap-2 text-[13px] font-semibold text-[#0B1F3A]">
                <CheckCircle2 className="size-4 text-[#F47B20]" />
                <span>Purpose-Driven Service</span>
              </div>
            </div>

            {/* Card 02 – Our Vision */}
            <div className="group relative flex flex-col justify-between rounded-[12px] border border-[#E8ECF1] bg-[#F7F8FA] p-8 md:p-10 shadow-[0_2px_8px_rgba(11,31,58,0.04)] transition-all duration-300 hover:border-[#F47B20]/40 hover:bg-white hover:shadow-[0_8px_24px_rgba(11,31,58,0.08)]">
              <div>
                <div className="flex items-center justify-between">
                  <span className="grid size-12 place-items-center rounded-[8px] bg-[#FFF1E5] text-[#F47B20] transition-colors group-hover:bg-[#F47B20] group-hover:text-white">
                    <Compass className="size-6" strokeWidth={1.75} />
                  </span>
                  <span className="text-[13px] font-semibold uppercase tracking-wider text-[#0B1F3A]/50">
                    Vision Statement
                  </span>
                </div>

                <h3 className="mt-6 text-2xl font-semibold text-[#0B1F3A] md:text-[28px] leading-snug">
                  Our Vision
                </h3>

                <blockquote className="mt-4 border-l-2 border-[#F47B20] pl-4 text-[18px] font-normal leading-relaxed text-[#344054]">
                  "To build trusted recruitment connections that support businesses and
                  professional growth."
                </blockquote>

                <p className="mt-6 text-[15px] leading-relaxed text-[#344054]/90">
                  We envision a recruitment ecosystem where organizations rely on our agency as a
                  trusted extension of their workforce strategy and candidates see us as a partner
                  in lifelong success.
                </p>
              </div>

              <div className="mt-8 flex items-center gap-2 text-[13px] font-semibold text-[#0B1F3A]">
                <CheckCircle2 className="size-4 text-[#F47B20]" />
                <span>Long-Term Value Creation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 04 – OUR RECRUITMENT PHILOSOPHY */}
      <section className="bg-[#0B1F3A] py-20 md:py-28 text-white">
        <div className="container-x">
          <div className="max-w-3xl">
            <p className="eyebrow flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#F47B20]">
              <span className="h-0.5 w-6 bg-[#F47B20]" />
              Our Recruitment Philosophy
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-[40px] md:leading-[1.15]">
              People First. Purpose-Driven Recruitment.
            </h2>

            <p className="mt-5 text-[18px] font-normal leading-relaxed text-white/80">
              Recruitment is not an automated numbers game. Effective recruitment demands an
              in-depth understanding of employer requirements and genuine evaluation of candidate
              suitability. When both criteria align, organizations build resilient teams and
              candidates thrive in roles matched to their true abilities.
            </p>
          </div>

          {/* Philosophy Pillars with Orange Visual Indicators */}
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {philosophyPillars.map((pillar) => (
              <div
                key={pillar.step}
                className="group relative flex flex-col justify-between rounded-[12px] border border-white/10 bg-[#142F52]/60 p-7 transition-all duration-300 hover:border-[#F47B20]/60 hover:bg-[#142F52]"
              >
                <div>
                  {/* Orange Visual Indicator */}
                  <div className="flex items-center justify-between">
                    <span className="grid size-11 place-items-center rounded-[8px] bg-[#F47B20] text-[15px] font-bold text-white shadow-sm">
                      {pillar.step}
                    </span>
                    <span className="h-1 w-8 rounded-full bg-[#F47B20]/40 group-hover:bg-[#F47B20] transition-colors" />
                  </div>

                  <h3 className="mt-6 text-[20px] font-semibold leading-snug text-white">
                    {pillar.title}
                  </h3>

                  <p className="mt-3 text-[15px] leading-relaxed text-white/75">
                    {pillar.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 text-[13px] text-[#FFF1E5] font-medium">
                  <CheckCircle2 className="size-4 text-[#F47B20]" />
                  <span>Quality Standard</span>
                </div>
              </div>
            ))}
          </div>

          {/* Core Philosophy Detail Callout */}
          <div className="mt-12 rounded-[12px] border border-white/10 bg-[#142F52]/40 p-6 md:p-8">
            <div className="grid gap-6 md:grid-cols-2 md:items-center">
              <div>
                <h4 className="text-[20px] font-semibold text-white">
                  Why Understanding Requirements Matters
                </h4>
                <p className="mt-2 text-[15px] text-white/75">
                  Misaligned hires waste time and create operational friction. By clarifying exact
                  competencies, shift requirements, and workplace dynamics, we eliminate guesswork
                  and introduce candidates who fit smoothly into your operations.
                </p>
              </div>
              <div className="md:border-l md:border-white/10 md:pl-8">
                <h4 className="text-[20px] font-semibold text-white">
                  Why Assessing Candidate Suitability Matters
                </h4>
                <p className="mt-2 text-[15px] text-white/75">
                  Job satisfaction and long-term retention happen when candidates feel valued and
                  engaged. We ensure candidate career aspirations align with the position, resulting
                  in dependable attendance, higher morale, and lower turnover.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 05 – INDUSTRIES WE SUPPORT (STICKY SCROLL SERVICE SHOWCASE) */}
      <IndustriesShowcase />

      {/* SECTION 06 – WHY CHOOSE TAB V&S? */}
      <section className="bg-[#F7F8FA] py-20 md:py-28 border-b border-[#E8ECF1]">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-[13px] font-semibold uppercase tracking-[0.14em] text-[#F47B20]">
              The TAB V&amp;S Difference
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0B1F3A] md:text-[40px] md:leading-[1.15]">
              Why Choose TAB V&amp;S?
            </h2>
            <p className="mt-4 text-[16px] text-[#344054]">
              A steadfast commitment to focused recruitment, thorough screening, and direct-hire
              partnerships.
            </p>
          </div>

          {/* Bento Grid: 4 Feature Cards matching wireframe layout */}
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
            {/* CARD 01 (Left Full-Height Pillar): Focused Recruitment */}
            <div className="group relative flex flex-col justify-between rounded-[16px] border border-[#E8ECF1] bg-white p-8 lg:p-10 shadow-[0_2px_12px_rgba(11,31,58,0.04)] transition-all duration-300 hover:border-[#F47B20]/50 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(11,31,58,0.08)] sm:col-span-2 lg:col-span-2 lg:row-span-2 overflow-hidden">
              {/* Subtle ambient orange corner decoration on hover */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-[radial-gradient(circle,rgba(244,123,32,0.12),transparent_70%)] transition-opacity duration-300 opacity-60 group-hover:opacity-100"
              />

              <div className="relative z-10">
                {/* Header row with Icon and Badge */}
                <div className="flex items-center justify-between">
                  <span className="grid size-14 place-items-center rounded-[10px] bg-[#FFF1E5] text-[#F47B20] transition-all duration-300 group-hover:bg-[#F47B20] group-hover:text-white group-hover:scale-105 shadow-sm">
                    <Target className="size-7" strokeWidth={1.75} />
                  </span>
                  <span className="text-[12px] font-bold tracking-wider text-[#F47B20] uppercase bg-[#FFF1E5] px-3 py-1 rounded-full border border-[#F47B20]/25">
                    01 / Specialization
                  </span>
                </div>

                <h3 className="mt-7 text-2xl lg:text-[28px] font-bold leading-tight text-[#0B1F3A]">
                  Focused Recruitment
                </h3>

                <p className="mt-4 text-[15px] lg:text-[16px] leading-relaxed text-[#344054]">
                  We concentrate our efforts on specialized industry sectors. This dedicated focus
                  enables our team to understand distinct operational requirements, specialized skill
                  sets, and working conditions far better than broad generalist agencies.
                </p>

                {/* Focus Sectors Tags */}
                <div className="mt-8 pt-6 border-t border-[#E8ECF1]/80">
                  <p className="text-[12px] font-bold uppercase tracking-wider text-[#667085] mb-3">
                    Five Core Industry Sectors:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Data Center Operations",
                      "Information Technology",
                      "Warehouse & Logistics",
                      "Healthcare Services",
                      "Cleaning & Facilities",
                    ].map((sec) => (
                      <span
                        key={sec}
                        className="rounded-full bg-[#F7F8FA] border border-[#E8ECF1] px-3 py-1 text-[12px] font-medium text-[#0B1F3A] transition-colors group-hover:border-[#F47B20]/30"
                      >
                        {sec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative z-10 mt-8 pt-5 border-t border-[#E8ECF1] flex items-center justify-between text-[13px] font-semibold text-[#0B1F3A]">
                <div className="flex items-center gap-2">
                  <Check className="size-4 text-[#F47B20]" strokeWidth={2.5} />
                  <span>Direct-Hire Focus</span>
                </div>
                <span className="text-[12px] font-medium text-[#667085]">Dedicated Specialists</span>
              </div>
            </div>

            {/* CARD 02 (Top-Right Left Box): Candidate Matching */}
            <div className="group relative flex flex-col justify-between rounded-[16px] border border-[#E8ECF1] bg-white p-7 shadow-[0_2px_12px_rgba(11,31,58,0.04)] transition-all duration-300 hover:border-[#F47B20]/50 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(11,31,58,0.08)] sm:col-span-1 lg:col-span-1 lg:row-span-1">
              <div>
                <div className="flex items-center justify-between">
                  <span className="grid size-12 place-items-center rounded-[8px] bg-[#FFF1E5] text-[#F47B20] transition-colors duration-200 group-hover:bg-[#F47B20] group-hover:text-white">
                    <UserCheck className="size-6" strokeWidth={1.75} />
                  </span>
                  <span className="text-[12px] font-bold text-[#667085]">02</span>
                </div>

                <h3 className="mt-5 text-[20px] font-bold leading-snug text-[#0B1F3A]">
                  Candidate Matching
                </h3>

                <p className="mt-3 text-[14px] leading-relaxed text-[#344054]">
                  Our screening methodology evaluates practical experience, verified credentials,
                  and career objectives to ensure each candidate aligns with both the technical
                  demands of the role and the organization's work environment.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E8ECF1] flex items-center gap-2 text-[13px] font-semibold text-[#0B1F3A]">
                <Check className="size-4 text-[#F47B20]" strokeWidth={2.5} />
                <span>Direct-Hire Focus</span>
              </div>
            </div>

            {/* CARD 03 (Top-Right Right Box): Personalized Support */}
            <div className="group relative flex flex-col justify-between rounded-[16px] border border-[#E8ECF1] bg-white p-7 shadow-[0_2px_12px_rgba(11,31,58,0.04)] transition-all duration-300 hover:border-[#F47B20]/50 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(11,31,58,0.08)] sm:col-span-1 lg:col-span-1 lg:row-span-1">
              <div>
                <div className="flex items-center justify-between">
                  <span className="grid size-12 place-items-center rounded-[8px] bg-[#FFF1E5] text-[#F47B20] transition-colors duration-200 group-hover:bg-[#F47B20] group-hover:text-white">
                    <HeartHandshake className="size-6" strokeWidth={1.75} />
                  </span>
                  <span className="text-[12px] font-bold text-[#667085]">03</span>
                </div>

                <h3 className="mt-5 text-[20px] font-bold leading-snug text-[#0B1F3A]">
                  Personalized Support
                </h3>

                <p className="mt-3 text-[14px] leading-relaxed text-[#344054]">
                  We assign dedicated recruitment specialists to provide close, attentive guidance
                  for employers and job seekers alike, maintaining open communication and
                  responsive coordination at every step.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E8ECF1] flex items-center gap-2 text-[13px] font-semibold text-[#0B1F3A]">
                <Check className="size-4 text-[#F47B20]" strokeWidth={2.5} />
                <span>Direct-Hire Focus</span>
              </div>
            </div>

            {/* CARD 04 (Bottom-Right Wide Box): Direct-Hire Approach */}
            <div className="group relative flex flex-col justify-between rounded-[16px] border border-[#E8ECF1] bg-white p-7 lg:p-8 shadow-[0_2px_12px_rgba(11,31,58,0.04)] transition-all duration-300 hover:border-[#F47B20]/50 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(11,31,58,0.08)] sm:col-span-2 lg:col-span-2 lg:row-span-1">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <span className="grid size-12 place-items-center rounded-[8px] bg-[#FFF1E5] text-[#F47B20] transition-colors duration-200 group-hover:bg-[#F47B20] group-hover:text-white">
                      <Briefcase className="size-6" strokeWidth={1.75} />
                    </span>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#F47B20]">
                        Placement Model
                      </span>
                      <h3 className="text-[20px] lg:text-[22px] font-bold text-[#0B1F3A]">
                        Direct-Hire Approach
                      </h3>
                    </div>
                  </div>
                  <span className="text-[12px] font-bold text-[#667085]">04</span>
                </div>

                <p className="mt-4 text-[14.5px] lg:text-[15px] leading-relaxed text-[#344054]">
                  We focus on direct-hire placements where candidates become direct employees of
                  your organization from day one, fostering mutual loyalty, organizational
                  stability, and sustainable career advancement.
                </p>

                {/* Direct-Hire Key Advantages */}
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF1E5] px-3 py-1 text-[12px] font-semibold text-[#F47B20]">
                    <Check className="size-3.5" strokeWidth={2.5} /> Day-One Employee
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F7F8FA] border border-[#E8ECF1] px-3 py-1 text-[12px] font-semibold text-[#0B1F3A]">
                    <Check className="size-3.5 text-[#F47B20]" strokeWidth={2.5} /> Long-Term Retention
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F7F8FA] border border-[#E8ECF1] px-3 py-1 text-[12px] font-semibold text-[#0B1F3A]">
                    <Check className="size-3.5 text-[#F47B20]" strokeWidth={2.5} /> Mutual Loyalty
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E8ECF1] flex items-center justify-between text-[13px] font-semibold text-[#0B1F3A]">
                <div className="flex items-center gap-2">
                  <Check className="size-4 text-[#F47B20]" strokeWidth={2.5} />
                  <span>Direct-Hire Focus</span>
                </div>
                <span className="text-[12px] font-medium text-[#667085]">Full Employee Commitment</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 07 – FINAL CTA */}
      <section className="bg-[#0B1F3A] py-20 text-center md:py-24 relative overflow-hidden">
        {/* Subtle decorative background circles in #142F52 */}
        <div className="absolute -left-20 -top-20 size-80 rounded-full border border-[#142F52]/60 pointer-events-none" />
        <div className="absolute -right-20 -bottom-20 size-80 rounded-full border border-[#142F52]/60 pointer-events-none" />

        <div className="container-x relative">
          <p className="eyebrow inline-block text-[13px] font-semibold uppercase tracking-[0.14em] text-[#F47B20]">
            Take the Next Step
          </p>

          <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-bold tracking-tight text-white md:text-[40px] md:leading-tight">
            Let's Build the Right Connection.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-[18px] font-normal leading-relaxed text-white/80">
            Whether your organization is seeking qualified talent or you are a professional ready to
            take your next career step, our team is here to assist.
          </p>

          {/* Action Buttons: Orange Hire Talent + White Contact Us */}
          <div className="mt-9 flex flex-wrap justify-center items-center gap-4">
            <Button
              asChild
              className="h-12 px-8 rounded-[8px] bg-[#F47B20] hover:bg-[#e06d17] text-white text-[15px] font-semibold shadow-sm transition-all hover:-translate-y-px cursor-pointer"
            >
              <Link to="/request-staffing" className="flex items-center gap-2">
                <span>Hire Talent</span>
                <ArrowRight className="size-4" />
              </Link>
            </Button>

            <Button
              asChild
              className="h-12 px-8 rounded-[8px] bg-white hover:bg-[#F7F8FA] text-[#0B1F3A] text-[15px] font-semibold border border-white shadow-sm transition-all hover:-translate-y-px cursor-pointer"
            >
              <Link to="/contact" className="flex items-center gap-2">
                <span>Contact Us</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer currentPath="/about" />
    </div>
  );
}

