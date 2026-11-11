import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import dc from "@/assets/svc-datacenter.jpg";
import it from "@/assets/svc-it.jpg";
import wh from "@/assets/svc-warehouse.jpg";
import hc from "@/assets/svc-healthcare.jpg";
import cl from "@/assets/svc-cleaning.jpg";

interface ServiceItem {
  id: string;
  num: string;
  collapsedName: string;
  title: string;
  desc: string;
  img: string;
  serviceParam: string;
  jobsParam: "data-center" | "it" | "warehouse" | "healthcare" | "cleaning";
}

const servicesList: ServiceItem[] = [
  {
    id: "01",
    num: "01",
    collapsedName: "DATA CENTER OPERATIONS & TECHNICIAN",
    title: "Data Center Operations & Technician",
    desc: "Connecting businesses with skilled technicians and operations professionals to support critical data center infrastructure.",
    img: dc,
    serviceParam: "data-center",
    jobsParam: "data-center",
  },
  {
    id: "02",
    num: "02",
    collapsedName: "INFORMATION TECHNOLOGY",
    title: "Information Technology",
    desc: "Connecting businesses with capable IT professionals across technical support, networking and technology operations.",
    img: it,
    serviceParam: "information-technology",
    jobsParam: "it",
  },
  {
    id: "03",
    num: "03",
    collapsedName: "WAREHOUSE ASSOCIATE PLACEMENT",
    title: "Warehouse Associate Placement",
    desc: "Helping businesses find dependable warehouse professionals for inventory, picking, packing and logistics operations.",
    img: wh,
    serviceParam: "warehouse",
    jobsParam: "warehouse",
  },
  {
    id: "04",
    num: "04",
    collapsedName: "HEALTHCARE SERVICES PLACEMENT",
    title: "Healthcare Services Placement",
    desc: "Connecting healthcare organizations with qualified professionals for appropriate healthcare staffing requirements.",
    img: hc,
    serviceParam: "healthcare",
    jobsParam: "healthcare",
  },
  {
    id: "05",
    num: "05",
    collapsedName: "CLEANING SERVICES PLACEMENT",
    title: "Cleaning Services Placement",
    desc: "Connecting businesses with dependable cleaning professionals for commercial, office and facility environments.",
    img: cl,
    serviceParam: "cleaning",
    jobsParam: "cleaning",
  },
];

export interface ServicesAccordionProps {
  mode?: "services" | "job-seekers";
  ctaLabel?: string;
  defaultExpandedIndex?: number | null;
  eyebrowText?: string;
}

export function ServicesAccordion({
  mode = "services",
  ctaLabel,
  defaultExpandedIndex = null,
  eyebrowText = "Specialized Placement",
}: ServicesAccordionProps = {}) {
  // Track hovered and pinned indices on desktop/tablet
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [pinnedIndex, setPinnedIndex] = useState<number | null>(defaultExpandedIndex);

  // Track expanded index on mobile (default first item open or closed)
  const [mobileActiveIndex, setMobileActiveIndex] = useState<number | null>(
    defaultExpandedIndex !== null ? defaultExpandedIndex : 0,
  );

  const effectiveCtaLabel = ctaLabel ?? "Explore Service";

  // Current active desktop panel
  const activeDesktopIndex = hoveredIndex !== null ? hoveredIndex : pinnedIndex;

  const handlePanelClick = (index: number) => {
    setPinnedIndex((prev) => (prev === index ? null : index));
  };

  const handleMobileToggle = (index: number) => {
    setMobileActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="w-full select-none">
      {/* ============================================================== */}
      {/* DESKTOP (1024px+): Interactive Horizontal Expanding Accordion */}
      {/* ============================================================== */}
      <div
        onMouseLeave={() => setHoveredIndex(null)}
        className="hidden lg:flex h-[560px] xl:h-[580px] w-full rounded-[22px] overflow-hidden bg-[#0B1F3A] border border-[#E8ECF1]/20 shadow-[0_16px_48px_rgba(11,31,58,0.14)]"
        role="region"
        aria-label="Our Services Interactive Accordion"
      >
        {servicesList.map((service, index) => {
          const isExpanded = activeDesktopIndex === index;
          const isAnyExpanded = activeDesktopIndex !== null;

          return (
            <div
              key={service.id}
              onMouseEnter={() => setHoveredIndex(index)}
              onClick={() => handlePanelClick(index)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handlePanelClick(index);
                }
              }}
              tabIndex={0}
              role="button"
              aria-expanded={isExpanded}
              aria-label={`${service.title} - ${isExpanded ? "Expanded" : "Collapsed"}`}
              className={`relative h-full border-r border-white/10 last:border-r-0 cursor-pointer overflow-hidden transition-all duration-[600ms] motion-reduce:transition-none ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isExpanded
                  ? "flex-[4] lg:flex-[4.2] bg-[#0B1F3A]"
                  : isAnyExpanded
                    ? "flex-[0.65] lg:flex-[0.7] bg-[#0B1F3A] hover:bg-[#142F52]/80"
                    : "flex-1 bg-[#0B1F3A] hover:bg-[#142F52]/80"
              }`}
            >
              {/* Subtle background glow when expanded */}
              {isExpanded && (
                <div className="absolute inset-0 bg-gradient-to-br from-[#0B1F3A] via-[#142F52]/40 to-[#0B1F3A] pointer-events-none" />
              )}

              {/* ======================================================= */}
              {/* COLLAPSED VIEW (Displayed when panel is not expanded)   */}
              {/* ======================================================= */}
              <div
                className={`absolute inset-0 flex flex-col items-center justify-between py-8 px-2 transition-opacity duration-300 ${
                  isExpanded
                    ? "opacity-0 pointer-events-none"
                    : "opacity-100 pointer-events-auto"
                }`}
              >
                {/* TOP: Large orange service number (44px / 700) */}
                <div className="shrink-0 text-center">
                  <span className="text-[44px] font-bold text-[#F47B20] leading-none tracking-tight font-sans block">
                    {service.num}
                  </span>
                </div>

                {/* MIDDLE: White service name displayed vertically using 90-degree text rotation (17px / 600) */}
                <div className="flex-1 flex items-center justify-center my-6 overflow-hidden w-full">
                  <span
                    className="text-[17px] font-semibold text-white tracking-[0.08em] uppercase whitespace-nowrap [writing-mode:vertical-rl] rotate-180 select-none block transition-colors duration-200 hover:text-[#FFF1E5]"
                    style={{ textOrientation: "mixed" }}
                  >
                    {service.collapsedName}
                  </span>
                </div>

                {/* BOTTOM: Orange circular button containing white diagonal arrow pointing towards upper right */}
                <div className="shrink-0">
                  {mode === "job-seekers" ? (
                    <Link
                      to="/jobs"
                      search={{ industry: service.jobsParam }}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`${effectiveCtaLabel} - ${service.title}`}
                      className="size-11 rounded-full bg-[#F47B20] text-white flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110 hover:bg-[#e06d17] cursor-pointer"
                    >
                      <ArrowUpRight className="size-5 stroke-[2.5] text-white" />
                    </Link>
                  ) : (
                    <Link
                      to="/request-staffing"
                      search={{ service: service.serviceParam }}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Explore ${service.title}`}
                      className="size-11 rounded-full bg-[#F47B20] text-white flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110 hover:bg-[#e06d17] cursor-pointer"
                    >
                      <ArrowUpRight className="size-5 stroke-[2.5] text-white" />
                    </Link>
                  )}
                </div>
              </div>

              {/* ======================================================= */}
              {/* EXPANDED VIEW (Displayed when panel is active)         */}
              {/* ======================================================= */}
              <div
                className={`relative z-10 h-full w-full p-8 lg:p-10 flex items-center transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isExpanded
                    ? "opacity-100 translate-x-0 delay-100 pointer-events-auto"
                    : "opacity-0 -translate-x-6 pointer-events-none"
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-10 h-full w-full">
                  {/* LEFT COLUMN: Number, Horizontal Title, Description, CTA */}
                  <div className="flex flex-col justify-between h-full py-2">
                    <div>
                      {/* Top Service Number (44px / 700 Orange #F47B20) */}
                      <div className="flex items-center gap-4">
                        <span className="text-[44px] font-bold text-[#F47B20] leading-none tracking-tight">
                          {service.num}
                        </span>
                        <span className="h-0.5 w-10 bg-[#F47B20]/60" />
                        <span className="text-[13px] font-semibold tracking-[0.14em] uppercase text-white/60">
                          {eyebrowText}
                        </span>
                      </div>

                      {/* Horizontal Service Title (28px / 700 White #FFFFFF) */}
                      <h3 className="mt-5 text-[28px] font-bold text-white leading-snug tracking-tight">
                        {service.title}
                      </h3>

                      {/* Service Description (15px / 400 White/80) */}
                      <p className="mt-4 text-[15px] font-normal text-white/80 leading-relaxed max-w-md">
                        {service.desc}
                      </p>
                    </div>

                    {/* Orange Explore Service CTA (14px / 600) */}
                    <div className="mt-8 pt-4 border-t border-white/10 flex items-center gap-3">
                      {mode === "job-seekers" ? (
                        <>
                          <Button
                            asChild
                            className="h-11 px-6 rounded-[8px] bg-[#F47B20] hover:bg-[#e06d17] text-white text-[14px] font-semibold shadow-sm transition-all hover:-translate-y-px inline-flex items-center gap-2 group/btn cursor-pointer"
                          >
                            <Link
                              to="/jobs"
                              search={{ industry: service.jobsParam }}
                            >
                              {effectiveCtaLabel}
                              <ArrowRight className="size-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
                            </Link>
                          </Button>
                          <Link
                            to="/jobs"
                            search={{ industry: service.jobsParam }}
                            aria-label={`${effectiveCtaLabel} - ${service.title}`}
                            className="size-11 rounded-full bg-[#F47B20] hover:bg-[#e06d17] text-white flex items-center justify-center shadow-sm transition-all hover:scale-105 cursor-pointer group"
                          >
                            <ArrowUpRight className="size-5 stroke-[2.5] text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </Link>
                        </>
                      ) : (
                        <>
                          <Button
                            asChild
                            className="h-11 px-6 rounded-[8px] bg-[#F47B20] hover:bg-[#e06d17] text-white text-[14px] font-semibold shadow-sm transition-all hover:-translate-y-px inline-flex items-center gap-2 group/btn cursor-pointer"
                          >
                            <Link
                              to="/request-staffing"
                              search={{ service: service.serviceParam }}
                            >
                              {effectiveCtaLabel}
                              <ArrowRight className="size-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
                            </Link>
                          </Button>
                          <Link
                            to="/request-staffing"
                            search={{ service: service.serviceParam }}
                            aria-label={`Explore ${service.title}`}
                            className="size-11 rounded-full bg-[#F47B20] hover:bg-[#e06d17] text-white flex items-center justify-center shadow-sm transition-all hover:scale-105 cursor-pointer group"
                          >
                            <ArrowUpRight className="size-5 stroke-[2.5] text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </Link>
                        </>
                      )}
                    </div>
                  </div>

                  {/* RIGHT COLUMN: Large Professional Industry-Specific Image */}
                  <div className="relative w-full h-[360px] lg:h-[420px] rounded-[16px] overflow-hidden border border-white/15 shadow-xl shrink-0 group/img">
                    <img
                      src={service.img}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/img:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/40 via-transparent to-transparent pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ============================================================== */}
      {/* MOBILE & TABLET (<1024px): Tap-To-Expand Stacked Accordion    */}
      {/* ============================================================== */}
      <div className="flex flex-col gap-3 lg:hidden">
        {servicesList.map((service, index) => {
          const isExpanded = mobileActiveIndex === index;

          if (isExpanded) {
            return (
              <div
                key={service.id}
                className="rounded-[16px] bg-[#0B1F3A] border-2 border-[#F47B20] p-5 sm:p-6 shadow-lg transition-all duration-300"
              >
                {/* Header bar with number & arrow toggle */}
                <div
                  className="flex items-center justify-between pb-4 border-b border-white/10 cursor-pointer"
                  onClick={() => handleMobileToggle(index)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[32px] sm:text-[36px] font-bold text-[#F47B20] leading-none">
                      {service.num}
                    </span>
                    <span className="h-0.5 w-6 bg-[#F47B20]" />
                  </div>
                  {mode === "job-seekers" ? (
                    <Link
                      to="/jobs"
                      search={{ industry: service.jobsParam }}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`${effectiveCtaLabel} - ${service.title}`}
                      className="size-10 rounded-full bg-[#F47B20] hover:bg-[#e06d17] text-white flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <ArrowUpRight className="size-4.5 stroke-[2.5]" />
                    </Link>
                  ) : (
                    <Link
                      to="/request-staffing"
                      search={{ service: service.serviceParam }}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Explore ${service.title}`}
                      className="size-10 rounded-full bg-[#F47B20] hover:bg-[#e06d17] text-white flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <ArrowUpRight className="size-4.5 stroke-[2.5]" />
                    </Link>
                  )}
                </div>

                {/* Horizontal Service Title */}
                <h3 className="mt-4 text-[20px] sm:text-[22px] font-bold text-white leading-snug">
                  {service.title}
                </h3>

                {/* Full-width Industry Photograph */}
                <div className="mt-4 relative overflow-hidden rounded-[12px] aspect-[16/10] max-h-[280px] sm:max-h-[340px] border border-white/15 shadow-md">
                  <img
                    src={service.img}
                    alt={service.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Service Description */}
                <p className="mt-4 text-[14.5px] sm:text-[15px] font-normal text-white/80 leading-relaxed">
                  {service.desc}
                </p>

                {/* Orange Explore Service CTA */}
                <Button
                  asChild
                  className="mt-6 w-full min-h-[44px] h-11 sm:h-12 rounded-[8px] bg-[#F47B20] hover:bg-[#e06d17] text-white text-[14px] sm:text-[15px] font-semibold shadow-sm inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  {mode === "job-seekers" ? (
                    <Link
                      to="/jobs"
                      search={{ industry: service.jobsParam }}
                    >
                      {effectiveCtaLabel} <ArrowRight className="size-4" />
                    </Link>
                  ) : (
                    <Link
                      to="/request-staffing"
                      search={{ service: service.serviceParam }}
                    >
                      {effectiveCtaLabel} <ArrowRight className="size-4" />
                    </Link>
                  )}
                </Button>
              </div>
            );
          }

          // Collapsed Mobile Item
          return (
            <div
              key={service.id}
              onClick={() => handleMobileToggle(index)}
              className="w-full rounded-[16px] bg-[#0B1F3A] hover:bg-[#142F52] border border-white/10 p-4 sm:p-5 flex items-center justify-between text-left transition-all duration-200 shadow-sm cursor-pointer min-h-[64px]"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleMobileToggle(index);
                }
              }}
              aria-expanded={false}
            >
              <div className="flex items-center gap-3 sm:gap-4 min-w-0 pr-2">
                <span className="text-[30px] sm:text-[36px] font-bold text-[#F47B20] leading-none shrink-0">
                  {service.num}
                </span>
                <span className="text-[14px] sm:text-[15px] font-semibold text-white tracking-wide uppercase leading-tight truncate">
                  {service.title}
                </span>
              </div>

              {mode === "job-seekers" ? (
                <Link
                  to="/jobs"
                  search={{ industry: service.jobsParam }}
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`${effectiveCtaLabel} - ${service.title}`}
                  className="size-10 rounded-full bg-[#F47B20] hover:bg-[#e06d17] text-white flex items-center justify-center shrink-0 ml-2 shadow transition-transform hover:scale-105 cursor-pointer"
                >
                  <ArrowUpRight className="size-5 stroke-[2.5]" />
                </Link>
              ) : (
                <Link
                  to="/request-staffing"
                  search={{ service: service.serviceParam }}
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`Explore ${service.title}`}
                  className="size-10 rounded-full bg-[#F47B20] hover:bg-[#e06d17] text-white flex items-center justify-center shrink-0 ml-2 shadow transition-transform hover:scale-105 cursor-pointer"
                >
                  <ArrowUpRight className="size-5 stroke-[2.5]" />
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
