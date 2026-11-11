import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ClipboardList,
  Search,
  Handshake,
  BadgeCheck,
  Target,
  UserCheck,
  Users,
  Briefcase,
  Check,
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
import { BrandContactSection } from "@/components/home/BrandContactSection";
import { HeroShowcase } from "@/components/home/HeroShowcase";
import { useInView } from "@/hooks/useInView";
import intro from "@/assets/intro.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TAB V&S Group — Recruitment & Staffing Solutions" },
      {
        name: "description",
        content:
          "Connecting the right people with the right opportunities across data center, IT, warehouse, healthcare and cleaning services.",
      },
      { property: "og:title", content: "TAB V&S Group — Recruitment & Staffing Solutions" },
      {
        property: "og:description",
        content:
          "Recruitment solutions connecting businesses with qualified talent across multiple industries.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const steps = [
  {
    icon: ClipboardList,
    title: "Understand Requirements",
    desc: "We learn about your business, the role and the skills that matter most.",
  },
  {
    icon: Search,
    title: "Identify Qualified Talent",
    desc: "We source and screen candidates who fit the role and your culture.",
  },
  {
    icon: Handshake,
    title: "Connect Employers and Candidates",
    desc: "We coordinate introductions and interviews with clear communication.",
  },
  {
    icon: BadgeCheck,
    title: "Successful Candidate Placement",
    desc: "We support both sides through offer, onboarding and beyond.",
  },
];

const why = [
  {
    icon: Target,
    title: "Industry-Focused Recruitment",
    desc: "Dedicated focus on the industries we serve, so we understand each role.",
  },
  {
    icon: UserCheck,
    title: "Quality Candidate Matching",
    desc: "Careful screening to match skills, experience and expectations.",
  },
  {
    icon: Users,
    title: "Personalized Support",
    desc: "A responsive point of contact for employers and job seekers alike.",
  },
  {
    icon: Briefcase,
    title: "Direct-Hire Recruitment Approach",
    desc: "We help you build long-term teams with candidates who join you directly.",
  },
];

const faqs = [
  {
    q: "What industries does TAB V&S Group recruit for?",
    a: "We recruit for data center operations, information technology, warehouse, healthcare and cleaning services roles.",
  },
  {
    q: "How do I request staffing support for my business?",
    a: "Use the Request Staffing Support button or contact us directly. We'll schedule a conversation to understand your requirements.",
  },
  {
    q: "Is there a fee for job seekers?",
    a: "No. Our services are free for job seekers. Employers engage us to find qualified talent.",
  },
  {
    q: "How do you screen candidates?",
    a: "We review experience and qualifications, conduct interviews and confirm fit with the role's requirements before introducing candidates.",
  },
  {
    q: "What is a direct-hire placement?",
    a: "A direct-hire placement means the candidate is employed directly by the employer from day one, building a long-term working relationship.",
  },
  {
    q: "How can I apply for open positions?",
    a: "Visit Find Opportunities to browse openings or share your resume with our team so we can match you with suitable roles.",
  },
];

function SectionHead({
  eyebrow,
  title,
  desc,
  light,
  center = true,
  inView = true,
}: {
  eyebrow: string;
  title: string;
  desc?: string;
  light?: boolean;
  center?: boolean;
  inView?: boolean;
}) {
  return (
    <div
      className={`max-w-2xl transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        center ? "mx-auto text-center" : ""
      } ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
    >
      <p className="eyebrow">{eyebrow}</p>
      <h2
        className={`mt-3 text-3xl font-bold md:text-[40px] md:leading-[1.15] ${
          light ? "!text-navy-foreground" : ""
        }`}
      >
        {title}
      </h2>
      {desc && (
        <p
          className={`mt-4 text-[16px] leading-relaxed transition-opacity duration-700 delay-150 ${
            light ? "text-navy-foreground/75" : "text-[#344054]"
          } ${inView ? "opacity-100" : "opacity-0"}`}
        >
          {desc}
        </p>
      )}
    </div>
  );
}

function Index() {
  const [aboutRef, aboutInView] = useInView<HTMLElement>({ threshold: 0.15 });
  const [servicesRef, servicesInView] = useInView<HTMLElement>({ threshold: 0.15 });
  const [howItWorksRef, howItWorksInView] = useInView<HTMLElement>({ threshold: 0.15 });
  const [whyRef, whyInView] = useInView<HTMLElement>({ threshold: 0.15 });
  const [employerRef, employerInView] = useInView<HTMLElement>({ threshold: 0.15 });
  const [jobSeekerRef, jobSeekerInView] = useInView<HTMLElement>({ threshold: 0.15 });
  const [faqRef, faqInView] = useInView<HTMLElement>({ threshold: 0.15 });

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky White Navbar */}
      <Navbar currentPath="/" />

      {/* Hero Showcase (Redesigned matching reference design & TAB V&S Group Identity) */}
      <HeroShowcase />

      {/* Intro / About Us */}
      <section id="about" ref={aboutRef} className="bg-muted py-20 md:py-28 overflow-hidden">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div
            className="overflow-hidden rounded-2xl shadow-soft"
            style={{
              clipPath: aboutInView ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
              opacity: aboutInView ? 1 : 0.3,
              transition:
                "clip-path 0.7s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.7s ease",
            }}
          >
            <img
              src={intro}
              alt="Recruiter welcoming a candidate"
              loading="lazy"
              width={1200}
              height={912}
              className="aspect-[4/3] w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.04]"
            />
          </div>
          <div>
            <SectionHead
              eyebrow="About TAB V&S Group"
              title="Building Connections. Creating Opportunities."
              center={false}
              inView={aboutInView}
            />
            <p
              className="mt-6 text-lg leading-relaxed text-[#344054] transition-all duration-700 ease-[cubic-bezier(0.22, 1, 0.36, 1)] delay-200"
              style={{
                opacity: aboutInView ? 1 : 0,
                transform: aboutInView ? "translateY(0)" : "translateY(16px)",
              }}
            >
              TAB V&amp;S Group is a recruitment agency dedicated to bringing employers and
              professionals together. We take time to understand each organization's needs and each
              candidate's goals, so every connection is built on a genuine fit.
            </p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                "Multi-industry expertise",
                "Thorough candidate screening",
                "Clear, honest communication",
                "Long-term placement focus",
              ].map((t, idx) => (
                <li
                  key={t}
                  className="flex items-center gap-3 font-medium text-navy transition-all duration-500 ease-[cubic-bezier(0.22, 1, 0.36, 1)]"
                  style={{
                    opacity: aboutInView ? 1 : 0,
                    transform: aboutInView ? "translateY(0)" : "translateY(16px)",
                    transitionDelay: `${0.35 + idx * 0.1}s`,
                  }}
                >
                  <span className="grid size-6 place-items-center rounded-full bg-accent text-primary transition-transform duration-300 hover:scale-110">
                    <Check className="size-3.5" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            <div
              className="mt-8 flex items-center gap-4 transition-all duration-500 ease-[cubic-bezier(0.22, 1, 0.36, 1)]"
              style={{
                opacity: aboutInView ? 1 : 0,
                transform: aboutInView ? "translateY(0)" : "translateY(16px)",
                transitionDelay: "0.75s",
              }}
            >
              <Button
                variant="brand"
                size="xl"
                asChild
                className="group transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(244,123,32,0.38)]"
              >
                <Link to="/about" className="flex items-center gap-2">
                  <span>Explore About Us</span>
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services with Interactive Horizontal Expanding Accordion */}
      <section id="services" ref={servicesRef} className="py-20 md:py-28">
        <div className="container-x">
          <SectionHead
            eyebrow="OUR SERVICES"
            title="Recruitment Solutions Across Multiple Industries."
            desc="Connecting businesses with qualified professionals through focused recruitment solutions across multiple industries."
            inView={servicesInView}
          />
          <div
            className="mt-14 transition-all duration-700 ease-[cubic-bezier(0.22, 1, 0.36, 1)] delay-200"
            style={{
              opacity: servicesInView ? 1 : 0,
              transform: servicesInView ? "translateY(0)" : "translateY(24px)",
            }}
          >
            <ServicesAccordion />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section ref={howItWorksRef} className="bg-navy py-20 md:py-28 overflow-hidden">
        <div className="container-x">
          <SectionHead
            eyebrow="How It Works"
            title="A Simple Approach to Successful Recruitment."
            light
            inView={howItWorksInView}
          />
          <div className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {steps.map((s, i) => (
              <div
                key={s.title}
                className="relative transition-all duration-600 ease-[cubic-bezier(0.22, 1, 0.36, 1)]"
                style={{
                  opacity: howItWorksInView ? 1 : 0,
                  transform: howItWorksInView ? "translateY(0)" : "translateY(24px)",
                  transitionDelay: `${0.15 + i * 0.12}s`,
                }}
              >
                {i < 3 && (
                  <div
                    className="absolute left-14 right-0 top-6 hidden h-px bg-navy-foreground/20 lg:block origin-left transition-transform duration-700 ease-[cubic-bezier(0.22, 1, 0.36, 1)]"
                    style={{
                      transform: howItWorksInView ? "scaleX(1)" : "scaleX(0)",
                      transitionDelay: `${0.3 + i * 0.15}s`,
                    }}
                  />
                )}
                <span
                  className="relative grid size-12 place-items-center rounded-full bg-primary text-[15px] font-bold text-primary-foreground shadow-sm transition-transform duration-500 ease-[cubic-bezier(0.22, 1, 0.36, 1)] hover:scale-110"
                  style={{
                    transform: howItWorksInView ? "scale(1)" : "scale(0.75)",
                    transitionDelay: `${0.18 + i * 0.12}s`,
                  }}
                >
                  0{i + 1}
                </span>
                <s.icon
                  className="mt-6 size-6 text-primary transition-transform duration-300 hover:scale-110"
                  strokeWidth={1.5}
                />
                <h3
                  className="mt-3 text-[22px] font-semibold !text-navy-foreground transition-all duration-500"
                  style={{
                    opacity: howItWorksInView ? 1 : 0,
                    transform: howItWorksInView ? "translateY(0)" : "translateY(8px)",
                    transitionDelay: `${0.25 + i * 0.12}s`,
                  }}
                >
                  {s.title}
                </h3>
                <p
                  className="mt-2 text-navy-foreground/70 transition-opacity duration-500"
                  style={{
                    opacity: howItWorksInView ? 1 : 0,
                    transitionDelay: `${0.35 + i * 0.12}s`,
                  }}
                >
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section ref={whyRef} className="py-20 md:py-28">
        <div className="container-x">
          <SectionHead
            eyebrow="Why Choose Us"
            title="A Recruitment Partner Focused on Fit."
            inView={whyInView}
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {why.map((w, idx) => (
              <div
                key={w.title}
                className="group rounded-xl border border-border bg-card p-7 shadow-soft transition-all duration-300 ease-[cubic-bezier(0.22, 1, 0.36, 1)] hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-[0_12px_32px_rgba(11,31,58,0.08)] cursor-pointer"
                style={{
                  opacity: whyInView ? 1 : 0,
                  transform: whyInView ? "translateY(0)" : "translateY(24px)",
                  transitionDelay: `${0.1 + idx * 0.1}s`,
                }}
              >
                <span
                  className="grid size-12 place-items-center rounded-xl bg-accent text-primary transition-all duration-300 ease-out group-hover:scale-110 group-hover:bg-primary group-hover:text-white shadow-sm"
                  style={{
                    transform: whyInView ? "scale(1)" : "scale(0.8)",
                    transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                >
                  <w.icon className="size-5" strokeWidth={1.75} />
                </span>
                <h3 className="mt-6 text-[20px] font-semibold leading-snug text-navy group-hover:text-primary transition-colors duration-200">
                  {w.title}
                </h3>
                <p className="mt-3 text-body">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Employer CTA */}
      <section id="employers" ref={employerRef} className="container-x">
        <div
          className="relative overflow-hidden rounded-2xl bg-navy px-8 py-14 md:px-16 md:py-20 transition-all duration-700 ease-[cubic-bezier(0.22, 1, 0.36, 1)]"
          style={{
            opacity: employerInView ? 1 : 0,
            transform: employerInView ? "translateY(0)" : "translateY(24px)",
          }}
        >
          <div
            className="absolute -right-16 -top-16 size-64 rounded-full border-[24px] border-primary/20 pointer-events-none transition-all duration-1000 ease-[cubic-bezier(0.22, 1, 0.36, 1)]"
            style={{
              transform: employerInView ? "scale(1)" : "scale(0.6)",
              opacity: employerInView ? 1 : 0,
            }}
          />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.5fr_1fr]">
            <div
              className="transition-all duration-600 ease-[cubic-bezier(0.22, 1, 0.36, 1)]"
              style={{
                opacity: employerInView ? 1 : 0,
                transform: employerInView ? "translateY(0)" : "translateY(16px)",
              }}
            >
              <p className="eyebrow">For Employers</p>
              <h2 className="mt-3 text-3xl font-bold !text-navy-foreground md:text-[40px]">
                Find the Talent Your Business Needs.
              </h2>
              <p className="mt-4 max-w-xl text-lg text-navy-foreground/75">
                Tell us about the roles you're hiring for and we'll connect you with qualified,
                screened candidates ready to contribute.
              </p>
            </div>
            <div
              className="lg:text-right transition-all duration-600 ease-[cubic-bezier(0.22, 1, 0.36, 1)] delay-200"
              style={{
                opacity: employerInView ? 1 : 0,
                transform: employerInView ? "translateX(0)" : "translateX(24px)",
              }}
            >
              <Button
                variant="brand"
                size="xl"
                asChild
                className="group transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(244,123,32,0.4)]"
              >
                <Link to="/request-staffing" className="inline-flex items-center gap-2">
                  <span>Request Staffing Support</span>
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Job seeker CTA */}
      <section id="job-seekers" ref={jobSeekerRef} className="py-20 md:py-28">
        <div className="container-x">
          <div
            className="grid items-center gap-8 rounded-2xl border border-border bg-background p-8 shadow-soft md:p-14 lg:grid-cols-[1.5fr_1fr] transition-all duration-700 ease-[cubic-bezier(0.22, 1, 0.36, 1)]"
            style={{
              opacity: jobSeekerInView ? 1 : 0,
              transform: jobSeekerInView ? "translateY(0)" : "translateY(24px)",
            }}
          >
            <div
              className="relative pl-6 transition-all duration-600 ease-[cubic-bezier(0.22, 1, 0.36, 1)]"
              style={{
                opacity: jobSeekerInView ? 1 : 0,
                transform: jobSeekerInView ? "translateX(0)" : "translateX(-16px)",
              }}
            >
              {/* Orange vertical accent line drawing animation */}
              <div
                className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-full origin-top transition-transform duration-700 ease-[cubic-bezier(0.22, 1, 0.36, 1)]"
                style={{
                  transform: jobSeekerInView ? "scaleY(1)" : "scaleY(0)",
                }}
              />
              <p className="eyebrow">For Job Seekers</p>
              <h2 className="mt-3 text-3xl font-bold md:text-[40px]">
                Your Next Career Opportunity Starts Here.
              </h2>
              <p className="mt-4 max-w-xl text-lg text-body">
                Explore roles across growing industries and let our team help you find a position
                that matches your skills and goals.
              </p>
            </div>
            <div
              className="lg:text-right transition-all duration-600 ease-[cubic-bezier(0.22, 1, 0.36, 1)] delay-200"
              style={{
                opacity: jobSeekerInView ? 1 : 0,
                transform: jobSeekerInView ? "scale(1)" : "scale(0.9)",
              }}
            >
              <Button
                variant="navy"
                size="xl"
                asChild
                className="group transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(11,31,58,0.3)] cursor-pointer"
              >
                <Link to="/jobs" className="inline-flex items-center gap-2">
                  <span>Find Opportunities</span>
                  <ArrowRight className="size-4 text-primary transition-transform duration-200 group-hover:translate-x-1.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section ref={faqRef} className="bg-muted py-20 md:py-28 overflow-hidden">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.5fr]">
          <div
            className="transition-all duration-600 ease-[cubic-bezier(0.22, 1, 0.36, 1)]"
            style={{
              opacity: faqInView ? 1 : 0,
              transform: faqInView ? "translateX(0)" : "translateX(-24px)",
            }}
          >
            <SectionHead
              eyebrow="FAQ"
              title="Frequently Asked Questions."
              center={false}
              inView={faqInView}
            />
          </div>
          <Accordion
            type="single"
            collapsible
            defaultValue="0"
            className="rounded-xl border border-border bg-card px-6 shadow-soft transition-all duration-700 ease-[cubic-bezier(0.22, 1, 0.36, 1)]"
            style={{
              opacity: faqInView ? 1 : 0,
              transform: faqInView ? "translateY(0)" : "translateY(24px)",
              transitionDelay: "0.15s",
            }}
          >
            {faqs.map((f, i) => (
              <AccordionItem
                key={i}
                value={String(i)}
                className="border-border last:border-0 transition-all duration-500"
                style={{
                  opacity: faqInView ? 1 : 0,
                  transform: faqInView ? "translateY(0)" : "translateY(12px)",
                  transitionDelay: `${0.1 + i * 0.07}s`,
                }}
              >
                <AccordionTrigger className="py-5 text-left text-[17px] font-semibold text-navy hover:no-underline hover:text-primary transition-colors duration-200 [&[data-state=open]]:text-primary">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-base text-body">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Premium Brand Introduction & Contact Information Section */}
      <BrandContactSection />

      {/* Sticky/Global Footer */}
      <Footer currentPath="/" />
    </div>
  );
}
