import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  Server,
  Monitor,
  Package,
  HeartPulse,
  Sparkles,
  ClipboardList,
  Search,
  Handshake,
  BadgeCheck,
  Briefcase,
  Target,
  UserCheck,
  MessagesSquare,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { RecruitmentProcessTimeline } from "@/components/services/RecruitmentProcessTimeline";
import dc from "@/assets/svc-datacenter.jpg";
import it from "@/assets/svc-it.jpg";
import wh from "@/assets/svc-warehouse.jpg";
import hc from "@/assets/svc-healthcare.jpg";
import cl from "@/assets/svc-cleaning.jpg";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Our Recruitment Services — TAB V&S Group" },
      {
        name: "description",
        content:
          "Connecting businesses with qualified professionals through focused recruitment solutions across data centers, IT, warehousing, healthcare, and cleaning operations.",
      },
      { property: "og:title", content: "Our Recruitment Services — TAB V&S Group" },
      {
        property: "og:description",
        content:
          "Explore TAB V&S Group's direct-hire recruitment services across mission-critical industries.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ServicesPage,
});

const serviceRows = [
  {
    id: "datacenter",
    serviceKey: "data-center",
    num: "01.",
    eyebrow: "DATA CENTER RECRUITMENT.",
    heading: "Data Center Operations & Technician.",
    description:
      "Connect your organization with skilled technicians and operations professionals who support critical data center infrastructure, equipment and operational requirements.",
    highlights: [
      "Data Center Operations.",
      "Technical Infrastructure Support.",
      "Server and Hardware Support.",
      "Equipment Monitoring.",
    ],
    image: dc,
    alt: "Authentic professional data center technician working inside a modern server facility with organized server racks",
    imageOnLeft: true,
    icon: Server,
  },
  {
    id: "it",
    serviceKey: "it",
    num: "02.",
    eyebrow: "IT RECRUITMENT.",
    heading: "Information Technology.",
    description:
      "Connect your business with capable IT professionals across technical support, networking, systems and technology operations.",
    highlights: [
      "IT Support Specialists.",
      "Technical Support Associates.",
      "Network Technicians.",
      "IT Operations Personnel.",
    ],
    image: it,
    alt: "Professional IT engineers collaborating in a modern corporate technology environment with computer monitors and networking equipment",
    imageOnLeft: false,
    icon: Monitor,
  },
  {
    id: "warehouse",
    serviceKey: "warehouse",
    num: "03.",
    eyebrow: "WAREHOUSE RECRUITMENT.",
    heading: "Warehouse Associate Placement.",
    description:
      "Find dependable warehouse professionals to support inventory management, order picking, packing, shipping and logistics operations.",
    highlights: [
      "Warehouse Associates.",
      "Inventory Associates.",
      "Order Pickers.",
      "Packing and Shipping Associates.",
    ],
    image: wh,
    alt: "Professional warehouse employees working in a modern American distribution center with shelves, packages and scanning equipment",
    imageOnLeft: true,
    icon: Package,
  },
  {
    id: "healthcare",
    serviceKey: "healthcare",
    num: "04.",
    eyebrow: "HEALTHCARE RECRUITMENT.",
    heading: "Healthcare Services Placement.",
    description:
      "Support healthcare facilities and medical organizations with dedicated support personnel across administrative, patient support and facility services.",
    highlights: [
      "Healthcare Support Personnel.",
      "Facility Support Staff.",
      "Patient Support Associates.",
      "Administrative Healthcare Staff.",
    ],
    image: hc,
    alt: "Compassionate healthcare support professionals walking and collaborating in a clean, modern American clinical hallway",
    imageOnLeft: false,
    icon: HeartPulse,
  },
  {
    id: "cleaning",
    serviceKey: "cleaning",
    num: "05.",
    eyebrow: "CLEANING SERVICES RECRUITMENT.",
    heading: "Cleaning Services Placement.",
    description:
      "Connect with reliable cleaning and maintenance professionals who keep corporate facilities, commercial offices and industrial spaces clean, safe and well-maintained.",
    highlights: [
      "Commercial Cleaning Staff.",
      "Facility Maintenance Associates.",
      "Custodial Specialists.",
      "Deep-Cleaning Associates.",
    ],
    image: cl,
    alt: "Professional commercial cleaning technician in tidy uniform maintaining high hygiene standards in a bright corporate facility",
    imageOnLeft: true,
    icon: Sparkles,
  },
];


const approachPrinciples = [
  {
    title: "Direct-Hire Commitment",
    desc: "Permanent, direct-employment placements designed for long-term organizational stability and career retention.",
    icon: Briefcase,
  },
  {
    title: "Understanding Requirements",
    desc: "Deep discovery into technical specs, shift demands, and workplace dynamics before any candidate outreach.",
    icon: Target,
  },
  {
    title: "Candidate Qualification Matching",
    desc: "Rigorous verification of technical skills, certifications, and work ethic to ensure candidates contribute from day one.",
    icon: UserCheck,
  },
  {
    title: "Employer Communication",
    desc: "Transparent, responsive partnership with regular updates, clear candidate profiles, and proactive collaboration.",
    icon: MessagesSquare,
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white text-[#344054]">
      {/* 02. Sticky Global Navbar */}
      <Navbar currentPath="/services" />

      {/* 03. SERVICES HERO – HIGH-IMPACT CORPORATE NAVY BANNER */}
      <section className="relative overflow-hidden bg-[#0B1F3A] text-white border-b border-[#142F52]">
        {/* Subtle Ambient Radial Glow & Architectural Grid Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(244,123,32,0.18),transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="container-x relative pt-14 pb-14 md:pt-20 md:pb-18">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center justify-center gap-2 text-[13px] text-white/60 mb-5">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3.5 text-[#F47B20]" />
            <span className="text-[#F47B20] font-medium">Our Services</span>
          </div>

          {/* Centered Hero Editorial */}
          <div className="mx-auto max-w-4xl text-center">
            {/* Monumental Headline */}
            <h1 className="text-4xl font-bold tracking-tight text-white md:text-[54px] md:leading-[1.12]">
              Direct-Hire Talent Built for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F47B20] via-[#ff9b49] to-[#F47B20]">
                Critical Industries.
              </span>
            </h1>

            {/* Authority Subtitle */}
            <p className="mt-4 text-[17px] font-normal leading-relaxed text-white/80 max-w-2xl mx-auto">
              Connecting organizations with thoroughly vetted, direct-hire professionals across
              Data Center Operations, Information Technology, Warehouse Logistics, Healthcare, and
              Commercial Cleaning.
            </p>

            {/* Action Buttons */}
            <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
              <Button
                asChild
                className="h-12 px-7 rounded-[8px] bg-[#F47B20] hover:bg-[#e06d17] text-white text-[15px] font-semibold shadow-[0_4px_20px_rgba(244,123,32,0.35)] transition-all hover:-translate-y-0.5"
              >
                <Link to="/request-staffing" className="flex items-center gap-2">
                  Request Staffing Support <ArrowRight className="size-4" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-12 px-7 rounded-[8px] border-white/30 bg-white/5 text-white hover:bg-white hover:text-[#0B1F3A] text-[15px] font-semibold backdrop-blur-sm transition-all"
              >
                <a href="#services-showcase">Explore All 5 Disciplines</a>
              </Button>
            </div>
          </div>

          {/* CORE RECRUITMENT STANDARDS STRIP */}
          <div className="mt-12 max-w-4xl mx-auto grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-8 border-t border-white/10 text-center">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#F47B20]">
                Placement Model
              </p>
              <p className="mt-1 text-[15px] font-semibold text-white">Direct-Hire Only</p>
              <p className="text-[12px] text-white/60">Long-term workplace loyalty</p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#F47B20]">
                Candidate Screening
              </p>
              <p className="mt-1 text-[15px] font-semibold text-white">Rigorous Vetting</p>
              <p className="text-[12px] text-white/60">Skills & credentials verified</p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#F47B20]">
                Coverage Scope
              </p>
              <p className="mt-1 text-[15px] font-semibold text-white">5 Core Sectors</p>
              <p className="text-[12px] text-white/60">Deep industry knowledge</p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#F47B20]">
                Communication
              </p>
              <p className="mt-1 text-[15px] font-semibold text-white">Direct & Responsive</p>
              <p className="text-[12px] text-white/60">Dedicated recruitment leads</p>
            </div>
          </div>
        </div>
      </section>

      {/* 04. SECTION 02 – SERVICES INTRODUCTION */}
      <section className="bg-white pt-14 pb-10 md:pt-18 md:pb-12 border-b border-[#E8ECF1]">
        <div className="container-x">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow text-[13px] font-semibold uppercase tracking-[0.14em] text-[#F47B20]">
              WHAT WE DO
            </p>
            <h2 className="mt-2.5 text-3xl font-bold tracking-tight text-[#0B1F3A] md:text-[38px] md:leading-[1.18]">
              Recruitment Solutions Designed Around Your Workforce Needs.
            </h2>
            <p className="mt-3.5 text-[16px] leading-relaxed text-[#344054]">
              Every business has unique hiring requirements. Our recruitment approach focuses on
              understanding those requirements and connecting employers with suitable candidates
              across multiple industries.
            </p>
          </div>
        </div>
      </section>

      {/* 05. SECTION 03 – FIVE SERVICES: ALTERNATING ZIG-ZAG EDITORIAL SHOWCASE */}
      <section id="services-showcase" className="scroll-mt-24">
        <div className="space-y-0">
          {serviceRows.map((service, index) => {
            const isEven = index % 2 === 1;
            const bgClass = isEven ? "bg-[#F7F8FA]" : "bg-white";

            return (
              <div
                key={service.id}
                id={service.id}
                className={`${bgClass} py-12 md:py-16 border-b border-[#E8ECF1] last:border-b-0 transition-colors scroll-mt-24`}
              >
                <div className="container-x">
                  <div
                    className={`grid items-center gap-8 md:gap-12 lg:grid-cols-12 ${
                      service.imageOnLeft
                        ? "lg:[&>*:first-child]:order-1 lg:[&>*:last-child]:order-2"
                        : "lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1"
                    }`}
                  >
                    {/* IMAGE COLUMN */}
                    <div className="lg:col-span-6">
                      <div className="group relative overflow-hidden rounded-[16px] border border-[#E8ECF1] bg-white shadow-[0_8px_30px_rgba(11,31,58,0.08)]">
                        <img
                          src={service.image}
                          alt={service.alt}
                          loading="lazy"
                          width={944}
                          height={704}
                          className="aspect-[5/4] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/20 via-transparent to-transparent pointer-events-none" />
                      </div>
                    </div>

                    {/* CONTENT COLUMN */}
                    <div className="lg:col-span-6 flex flex-col justify-center">
                      {/* Number & Eyebrow */}
                      <div className="flex items-center gap-2.5">
                        <span className="text-[19px] font-bold text-[#F47B20] tracking-tight">
                          {service.num}
                        </span>
                        <span className="text-[13px] font-semibold tracking-[0.14em] uppercase text-[#F47B20]">
                          {service.eyebrow}
                        </span>
                      </div>

                      {/* Service Title */}
                      <h3 className="mt-2 text-2xl font-bold tracking-tight text-[#0B1F3A] md:text-[27px] md:leading-[1.25]">
                        {service.heading}
                      </h3>

                      {/* Detailed paragraph */}
                      <p className="mt-3 text-[15.5px] leading-relaxed text-[#344054]">
                        {service.description}
                      </p>

                      {/* Key Highlights Checklist */}
                      <div className="mt-5 border-t border-[#E8ECF1] pt-4.5">
                        <p className="text-[12px] font-semibold uppercase tracking-wider text-[#0B1F3A] mb-2.5">
                          Typical Roles &amp; Capabilities
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {service.highlights.map((item) => (
                            <div key={item} className="flex items-start gap-2">
                              <span className="mt-0.5 grid size-4.5 shrink-0 place-items-center rounded-full bg-[#FFF1E5] text-[#F47B20]">
                                <Check className="size-3 stroke-[2.5]" />
                              </span>
                              <span className="text-[13.5px] font-medium text-[#344054]">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CTA Button -> Direct to /request-staffing with preselected service */}
                      <div className="mt-6">
                        <Button
                          asChild
                          variant="outline"
                          className="h-10.5 px-5 rounded-[8px] border-[#F47B20] text-[#F47B20] hover:bg-[#F47B20] hover:text-white text-[14px] font-semibold transition-all inline-flex items-center gap-2 group/btn"
                        >
                          <Link
                            to="/request-staffing"
                            search={{ service: service.serviceKey }}
                          >
                            Request Staffing for This Service
                            <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-1" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 06. SECTION 04 – OUR RECRUITMENT PROCESS (Animated Timeline) */}
      <RecruitmentProcessTimeline />

      {/* 07. SECTION 05 – OUR APPROACH / WHY DIRECT-HIRE */}
      <section className="bg-white py-14 md:py-20 border-b border-[#E8ECF1]">
        <div className="container-x">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow text-[13px] font-semibold uppercase tracking-[0.14em] text-[#F47B20]">
              OUR PHILOSOPHY
            </p>
            <h2 className="mt-2.5 text-3xl font-bold tracking-tight text-[#0B1F3A] md:text-[38px] md:leading-[1.18]">
              Built on Quality, Transparency, and Long-Term Value.
            </h2>
            <p className="mt-3.5 text-[16px] leading-relaxed text-[#344054]">
              We believe direct-hire recruitment builds stronger organizations and more dedicated teams.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {approachPrinciples.map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-[12px] border border-[#E8ECF1] bg-[#F7F8FA] p-6 transition-all duration-300 hover:border-[#F47B20]/40 hover:bg-white hover:shadow-card"
                >
                  <span className="grid size-11 place-items-center rounded-xl bg-[#FFF1E5] text-[#F47B20]">
                    <IconComp className="size-5.5" />
                  </span>
                  <h3 className="mt-5 text-[17px] font-bold text-[#0B1F3A]">{item.title}</h3>
                  <p className="mt-2.5 text-[13.5px] leading-relaxed text-[#344054]">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 11. SECTION 06 – EMPLOYER CTA */}
      <section className="bg-[#0B1F3A] py-14 md:py-18 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(244,123,32,0.15),transparent_50%)] pointer-events-none" />
        <div className="container-x relative">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow text-[13px] font-semibold uppercase tracking-[0.14em] text-[#F47B20]">
              PARTNER WITH US
            </p>
            <h2 className="mt-2.5 text-3xl font-bold tracking-tight text-white md:text-[38px] md:leading-[1.18]">
              Looking for Qualified Talent for Your Team?
            </h2>
            <p className="mt-3.5 text-[16px] text-white/80 leading-relaxed max-w-2xl mx-auto">
              Tell us about your hiring needs and our recruitment specialists will connect with you
              to discuss how we can support your organization.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
              <Button
                asChild
                className="h-12 px-7 rounded-[8px] bg-[#F47B20] hover:bg-[#e06d17] text-white text-[15px] font-semibold shadow-md transition-all hover:-translate-y-px cursor-pointer"
              >
                <Link to="/request-staffing" className="flex items-center gap-2">
                  Request Staffing Support <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                className="h-12 px-7 rounded-[8px] bg-white hover:bg-white/90 text-[#0B1F3A] text-[15px] font-semibold shadow-md transition-all hover:-translate-y-px cursor-pointer"
              >
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 12. SECTION 07 – CANDIDATE CTA */}
      <section className="py-12 md:py-16">
        <div className="container-x">
          <div className="grid items-center gap-8 rounded-[22px] border border-[#E8ECF1] bg-[#F7F8FA] p-8 md:p-12 shadow-soft lg:grid-cols-[1.5fr_1fr]">
            <div className="border-l-4 border-[#F47B20] pl-6">
              <p className="eyebrow text-[13px] font-semibold uppercase tracking-[0.14em] text-[#F47B20]">
                FOR JOB SEEKERS
              </p>
              <h2 className="mt-2.5 text-3xl font-bold text-[#0B1F3A] md:text-[38px] leading-tight">
                Looking for Your Next Opportunity?
              </h2>
              <p className="mt-3 max-w-xl text-[16px] text-[#344054] leading-relaxed">
                Explore career opportunities across multiple industries and connect with recruitment
                support.
              </p>
            </div>
            <div className="lg:text-right">
              <Button
                asChild
                className="h-12 px-8 rounded-[8px] bg-[#0B1F3A] hover:bg-[#142F52] text-white text-[15px] font-semibold shadow-sm transition-all hover:-translate-y-px inline-flex items-center gap-2 cursor-pointer"
              >
                <Link to="/jobs">
                  Find Jobs <ArrowRight className="size-4 text-[#F47B20]" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 13. Global Navy Footer */}
      <Footer currentPath="/services" />
    </div>
  );
}
