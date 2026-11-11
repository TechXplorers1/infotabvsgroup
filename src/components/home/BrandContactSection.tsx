import { Link } from "@tanstack/react-router";
import {
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Check,
  Briefcase,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/Navbar";
import { useInView } from "@/hooks/useInView";

export function BrandContactSection() {
  const [sectionRef, inView] = useInView<HTMLElement>({
    threshold: 0.2,
    triggerOnce: true,
  });

  const services = [
    {
      title: "Data Center Operations & Technician.",
      href: "/services#datacenter",
    },
    {
      title: "Information Technology.",
      href: "/services#it",
    },
    {
      title: "Warehouse Associate Placement.",
      href: "/services#warehouse",
    },
    {
      title: "Healthcare Services Placement.",
      href: "/services#healthcare",
    },
    {
      title: "Cleaning Services Placement.",
      href: "/services#cleaning",
    },
  ];

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative bg-[#F7F8FA] py-20 md:py-28 overflow-hidden border-t border-[#E8ECF1]"
      aria-labelledby="contact-heading"
    >
      <div className="container-x">
        {/* Main 2-Column Split Container */}
        <div
          className="mx-auto max-w-[1180px] overflow-hidden rounded-2xl border border-[#E8ECF1] bg-white shadow-[0_20px_60px_-15px_rgba(11,31,58,0.08)] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(35px)",
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* ========================================================
                LEFT COLUMN: COMPANY BRAND INTRODUCTION (NAVY #0B1F3A)
                ======================================================== */}
            <div
              className="relative flex flex-col justify-between bg-[#0B1F3A] p-5 sm:p-8 md:p-10 lg:col-span-6 lg:p-12 overflow-hidden transition-all duration-750 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                clipPath: inView ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
              }}
            >
              {/* Subtle Ambient Decorative Orange Outline / Glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full border border-[#F47B20]/15 bg-[radial-gradient(circle,rgba(244,123,32,0.12),transparent_70%)] animate-slow-float"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-16 -left-16 size-60 rounded-full border border-white/5 bg-[radial-gradient(circle,rgba(255,255,255,0.04),transparent_70%)]"
              />

              {/* Top Block: Logo & Brand Intro */}
              <div className="relative z-10">
                {/* 01. Logo */}
                <div
                  className="transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? "translateY(0)" : "translateY(16px)",
                    transitionDelay: "100ms",
                  }}
                >
                  <Logo light />
                </div>

                {/* Eyebrow */}
                <p
                  className="eyebrow mt-7 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#F47B20] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? "translateY(0)" : "translateY(14px)",
                    transitionDelay: "180ms",
                  }}
                >
                  ABOUT TAB V&amp;S GROUP
                </p>

                {/* Main Heading */}
                <h2
                  className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-[36px] lg:text-[40px] lg:leading-[1.15] transition-all duration-600 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? "translateY(0)" : "translateY(16px)",
                    transitionDelay: "260ms",
                  }}
                >
                  Connecting Talent With Opportunity.
                </h2>

                {/* Thin Orange Decorative Underline */}
                <div
                  aria-hidden="true"
                  className="mt-4 h-[3px] w-16 rounded-full bg-[#F47B20] origin-left transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    transform: inView ? "scaleX(1)" : "scaleX(0)",
                    transitionDelay: "340ms",
                  }}
                />

                {/* Supporting Description */}
                <p
                  className="mt-4 text-[15px] sm:text-[16px] font-normal leading-relaxed text-white/80 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? "translateY(0)" : "translateY(14px)",
                    transitionDelay: "420ms",
                  }}
                >
                  TAB V&amp;S Group Recruitment Agency connects businesses with qualified
                  professionals across multiple industries through focused direct-hire recruitment
                  solutions.
                </p>

                {/* Recruitment Services Subheading */}
                <div
                  className="mt-8 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? "translateY(0)" : "translateY(14px)",
                    transitionDelay: "500ms",
                  }}
                >
                  <h3 className="text-[18px] sm:text-[20px] font-semibold text-white">
                    Recruitment Across Five Key Industries.
                  </h3>

                  {/* 5 Services List */}
                  <ul className="mt-4 space-y-3">
                    {services.map((svc, idx) => (
                      <li
                        key={svc.title}
                        className="group flex items-center gap-3 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                        style={{
                          opacity: inView ? 1 : 0,
                          transform: inView ? "translateY(0)" : "translateY(12px)",
                          transitionDelay: `${580 + idx * 70}ms`,
                        }}
                      >
                        <span
                          className="grid size-5 shrink-0 place-items-center rounded border border-[#F47B20]/60 bg-[#F47B20]/15 text-[#F47B20] transition-transform duration-200 group-hover:translate-x-1"
                          style={{
                            transform: inView ? "scale(1)" : "scale(0.8)",
                            transition: "transform 400ms cubic-bezier(0.22,1,0.36,1)",
                          }}
                        >
                          <Check className="size-3.5 stroke-[2.5]" />
                        </span>
                        <Link
                          to={svc.href}
                          className="text-[14.5px] sm:text-[15px] font-medium text-white/90 transition-colors duration-200 group-hover:text-[#F47B20]"
                        >
                          {svc.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Block: Left Panel CTA Buttons */}
              <div
                className="relative z-10 mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 transition-all duration-600 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? "translateY(0) scale(1)" : "translateY(16px) scale(0.97)",
                  transitionDelay: "980ms",
                }}
              >
                {/* Primary CTA */}
                <Button
                  asChild
                  className="h-11 sm:h-12 w-full sm:w-auto px-6 rounded-[8px] bg-[#F47B20] hover:bg-[#e06d17] text-white text-[15px] font-semibold shadow-[0_4px_16px_rgba(244,123,32,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_22px_rgba(244,123,32,0.45)] group cursor-pointer justify-center"
                >
                  <Link to="/services" className="inline-flex items-center gap-2">
                    <span>Explore Our Services</span>
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </Button>

                {/* Secondary CTA */}
                <Button
                  asChild
                  variant="outline"
                  className="h-11 sm:h-12 w-full sm:w-auto px-6 rounded-[8px] border-white/40 bg-transparent text-white hover:bg-white/10 hover:border-white text-[15px] font-semibold transition-all duration-200 group cursor-pointer justify-center"
                >
                  <Link to="/jobs" className="inline-flex items-center gap-2">
                    <span>Find Jobs</span>
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* ========================================================
                RIGHT COLUMN: CONTACT INFORMATION (WHITE #FFFFFF)
                ======================================================== */}
            <div
              className="flex flex-col justify-between bg-white p-5 sm:p-8 md:p-10 lg:col-span-6 lg:p-12 transition-all duration-650 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateX(0)" : "translateX(35px)",
              }}
            >
              {/* Top: Header & Contact Rows */}
              <div>
                {/* Eyebrow */}
                <p
                  className="eyebrow text-[12px] font-semibold uppercase tracking-[0.14em] text-[#F47B20] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? "translateY(0)" : "translateY(12px)",
                    transitionDelay: "150ms",
                  }}
                >
                  LET'S CONNECT.
                </p>

                {/* Main Heading */}
                <h3
                  id="contact-heading"
                  className="mt-2 text-3xl font-bold tracking-tight text-[#0B1F3A] sm:text-[36px] sm:leading-[1.18] transition-all duration-600 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? "translateY(0)" : "translateY(14px)",
                    transitionDelay: "230ms",
                  }}
                >
                  We're Here to Help.
                </h3>

                {/* Supporting Description */}
                <p
                  className="mt-3 text-[15px] sm:text-[16px] leading-relaxed text-[#344054] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? "translateY(0)" : "translateY(12px)",
                    transitionDelay: "310ms",
                  }}
                >
                  Whether you're looking for qualified talent or exploring career opportunities, our
                  team is ready to connect with you.
                </p>

                {/* Contact Rows Container */}
                <div className="mt-8 space-y-4">
                  {/* CONTACT 01 – PHONE */}
                  <div
                    className="group flex items-start gap-4 rounded-xl border border-[#E8ECF1] bg-[#F7F8FA]/60 p-4 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#F7F8FA] hover:border-[#F47B20]/30"
                    style={{
                      opacity: inView ? 1 : 0,
                      transform: inView ? "translateY(0)" : "translateY(14px)",
                      transitionDelay: "400ms",
                    }}
                  >
                    <div
                      className="grid size-11 shrink-0 place-items-center rounded-lg bg-[#FFF1E5] text-[#F47B20] transition-transform duration-200 group-hover:translate-x-1"
                      style={{
                        transform: inView ? "scale(1)" : "scale(0.8)",
                        transition: "transform 400ms cubic-bezier(0.22,1,0.36,1)",
                      }}
                    >
                      <Phone className="size-5 stroke-[1.8]" />
                    </div>
                    <div>
                      <h4 className="text-[15px] font-semibold text-[#0B1F3A]">Call Our Team.</h4>
                      <p className="mt-0.5 text-[14px] text-[#344054]">
                        <a
                          href="tel:3802064792"
                          className="font-medium text-[#0B1F3A] hover:text-[#F47B20] transition-colors"
                        >
                          380-206-4792
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* CONTACT 02 – EMAIL */}
                  <div
                    className="group flex items-start gap-4 rounded-xl border border-[#E8ECF1] bg-[#F7F8FA]/60 p-4 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#F7F8FA] hover:border-[#F47B20]/30"
                    style={{
                      opacity: inView ? 1 : 0,
                      transform: inView ? "translateY(0)" : "translateY(14px)",
                      transitionDelay: "500ms",
                    }}
                  >
                    <div
                      className="grid size-11 shrink-0 place-items-center rounded-lg bg-[#FFF1E5] text-[#F47B20] transition-transform duration-200 group-hover:scale-110"
                      style={{
                        transform: inView ? "scale(1)" : "scale(0.8)",
                        transition: "transform 400ms cubic-bezier(0.22,1,0.36,1)",
                      }}
                    >
                      <Mail className="size-5 stroke-[1.8]" />
                    </div>
                    <div>
                      <h4 className="text-[15px] font-semibold text-[#0B1F3A]">Email Us.</h4>
                      <p className="mt-0.5 text-[14px] text-[#344054] break-all">
                        <a
                          href="mailto:tabeng14@infotabvsgroup.com"
                          className="font-medium text-[#0B1F3A] hover:text-[#F47B20] transition-colors"
                        >
                          tabeng14@infotabvsgroup.com
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* CONTACT 03 – LOCATION */}
                  <div
                    className="group flex items-start gap-4 rounded-xl border border-[#E8ECF1] bg-[#F7F8FA]/60 p-4 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#F7F8FA] hover:border-[#F47B20]/30"
                    style={{
                      opacity: inView ? 1 : 0,
                      transform: inView ? "translateY(0)" : "translateY(14px)",
                      transitionDelay: "600ms",
                    }}
                  >
                    <div
                      className="grid size-11 shrink-0 place-items-center rounded-lg bg-[#FFF1E5] text-[#F47B20] transition-transform duration-200 group-hover:-translate-y-1"
                      style={{
                        transform: inView ? "scale(1)" : "scale(0.8)",
                        transition: "transform 400ms cubic-bezier(0.22,1,0.36,1)",
                      }}
                    >
                      <MapPin className="size-5 stroke-[1.8]" />
                    </div>
                    <div>
                      <h4 className="text-[15px] font-semibold text-[#0B1F3A]">Our Location.</h4>
                      <p className="mt-0.5 text-[14px] text-[#344054]">
                        5749 Pittsford Dr, Westerville, Ohio, USA.
                      </p>
                      <a
                        href="https://maps.google.com/?q=5749+Pittsford+Dr,+Westerville,+Ohio,+USA"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex items-center gap-1 text-[13px] font-semibold text-[#F47B20] hover:underline"
                      >
                        <span>View on Google Maps</span>
                        <ExternalLink className="size-3" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* 06. DIRECT-HIRE RECRUITMENT INFORMATION PANEL */}
                <div
                  className="mt-6 flex items-start gap-3.5 rounded-xl border border-[#F47B20]/25 bg-[#FFF1E5] p-4 transition-all duration-600 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? "translateY(0)" : "translateY(14px)",
                    transitionDelay: "700ms",
                  }}
                >
                  <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#F47B20] text-white">
                    <Briefcase className="size-4 stroke-[2]" />
                  </div>
                  <div>
                    <h5 className="text-[14px] font-semibold text-[#0B1F3A]">
                      Our Recruitment Approach.
                    </h5>
                    <p className="mt-0.5 text-[13px] leading-relaxed text-[#344054]">
                      We operate on a direct-hire recruitment model, where employers pay for
                      successful candidate placements under agreed terms.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom: Communication Options */}
              <div
                className="mt-8 pt-6 border-t border-[#E8ECF1] transition-all duration-600 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? "translateY(0)" : "translateY(14px)",
                  transitionDelay: "800ms",
                }}
              >
                {/* Primary Contact CTA */}
                <Button
                  asChild
                  className="h-12 w-full sm:w-auto px-8 rounded-[8px] bg-[#F47B20] hover:bg-[#e06d17] text-white text-[15px] font-semibold shadow-[0_4px_16px_rgba(244,123,32,0.25)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(244,123,32,0.4)] group inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Link to="/contact">
                    <span>Get in Touch</span>
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1.5" />
                  </Link>
                </Button>

                {/* WhatsApp Communication Option */}
                <div
                  className="mt-4 flex flex-wrap items-center gap-2 text-[13.5px] text-[#667085] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    opacity: inView ? 1 : 0,
                    transitionDelay: "900ms",
                  }}
                >
                  <span>Prefer a quick conversation?</span>
                  <a
                    href="https://wa.me/13802064792?text=Hello%20TAB%20V%26S%20Group,%20I%20would%20like%20to%20inquire%20about%20recruitment%20services"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-semibold text-[#0B1F3A] hover:text-[#F47B20] transition-all duration-200 hover:scale-[1.02] underline decoration-[#F47B20]/40 hover:decoration-[#F47B20] cursor-pointer"
                  >
                    <MessageCircle className="size-4 text-[#F47B20] shrink-0" />
                    <span>Chat With Us on WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

