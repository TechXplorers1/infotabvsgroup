import { useState, useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import {
  Server,
  Monitor,
  Package,
  HeartPulse,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import dc from "@/assets/svc-datacenter.jpg";
import it from "@/assets/svc-it.jpg";
import wh from "@/assets/svc-warehouse.jpg";
import hc from "@/assets/svc-healthcare.jpg";
import cl from "@/assets/svc-cleaning.jpg";

export interface ShowcaseService {
  id: string;
  number: string;
  shortNumber: string;
  title: string;
  shortTitle: string;
  description: string;
  roles: string[];
  image: string;
  imageAlt: string;
  industryKey: "data-center" | "it" | "warehouse" | "healthcare" | "cleaning";
  layout: "text-left" | "image-left";
  theme: "dark" | "light";
  icon: typeof Server;
}

export const SHOWCASE_SERVICES: ShowcaseService[] = [
  {
    id: "data-center",
    number: "01 / 05",
    shortNumber: "01",
    title: "Data Center Operations & Technician",
    shortTitle: "Data Center Operations",
    description:
      "Connect with opportunities supporting critical data center infrastructure, server environments, equipment monitoring and technical operations.",
    roles: [
      "Data Center Technician",
      "Data Center Operations Associate",
      "Hardware Support Technician",
    ],
    image: dc,
    imageAlt: "Professional technician working with server racks inside a modern data center",
    industryKey: "data-center",
    layout: "text-left",
    theme: "dark",
    icon: Server,
  },
  {
    id: "it",
    number: "02 / 05",
    shortNumber: "02",
    title: "Information Technology",
    shortTitle: "Information Technology",
    description:
      "Explore technology career opportunities across IT support, technical assistance, network infrastructure and software-related roles.",
    roles: [
      "IT Support Specialist",
      "Technical Support Associate",
      "Network Technician",
    ],
    image: it,
    imageAlt: "Professional IT specialists working in a modern technology office",
    industryKey: "it",
    layout: "image-left",
    theme: "light",
    icon: Monitor,
  },
  {
    id: "warehouse",
    number: "03 / 05",
    shortNumber: "03",
    title: "Warehouse & Logistics",
    shortTitle: "Warehouse & Logistics",
    description:
      "Discover opportunities in warehouse operations, inventory management, order fulfillment, packaging and distribution.",
    roles: [
      "Warehouse Associate",
      "Inventory Associate",
      "Picker and Packer",
    ],
    image: wh,
    imageAlt: "Professional warehouse associates working inside a modern logistics and distribution center",
    industryKey: "warehouse",
    layout: "text-left",
    theme: "dark",
    icon: Package,
  },
  {
    id: "healthcare",
    number: "04 / 05",
    shortNumber: "04",
    title: "Healthcare Services",
    shortTitle: "Healthcare Services",
    description:
      "Explore healthcare support and administrative opportunities connecting qualified professionals with healthcare organizations.",
    roles: [
      "Healthcare Support Associate",
      "Patient Care Support",
      "Healthcare Administrative Assistant",
    ],
    image: hc,
    imageAlt: "Professional healthcare team in a modern hospital or clinical environment",
    industryKey: "healthcare",
    layout: "image-left",
    theme: "light",
    icon: HeartPulse,
  },
  {
    id: "cleaning",
    number: "05 / 05",
    shortNumber: "05",
    title: "Cleaning & Facility Services",
    shortTitle: "Cleaning & Facility Services",
    description:
      "Discover opportunities in commercial cleaning, janitorial operations and facility maintenance support across professional environments.",
    roles: [
      "Commercial Cleaner",
      "Janitorial Associate",
      "Facility Support Worker",
    ],
    image: cl,
    imageAlt: "Professional cleaning staff working in a modern commercial office environment",
    industryKey: "cleaning",
    layout: "text-left",
    theme: "dark",
    icon: Sparkles,
  },
];

export function IndustriesShowcase() {
  const outerSectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Jump to specific card when clicking an indicator dot
  const scrollToCard = (index: number) => {
    if (!outerSectionRef.current) return;
    const rect = outerSectionRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const navbarHeight = 80;
    const scrollableDistance = rect.height - (windowHeight - navbarHeight);
    if (scrollableDistance <= 0) return;

    const targetPoints = [0.08, 0.28, 0.48, 0.68, 0.88];
    const targetProgress = targetPoints[index] ?? 0;
    const targetScrollY =
      window.scrollY + rect.top - navbarHeight + targetProgress * scrollableDistance;

    window.scrollTo({
      top: Math.max(0, targetScrollY + 2),
      behavior: "smooth",
    });
  };

  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      if (!outerSectionRef.current) return;
      const rect = outerSectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const navbarHeight = 80;
      const scrollableDistance = rect.height - (windowHeight - navbarHeight);

      if (scrollableDistance <= 0) return;

      const scrolled = navbarHeight - rect.top;
      const rawProgress = Math.max(0, Math.min(1, scrolled / scrollableDistance));

      // 5 services with dedicated holding zone on the final 5th service (0.78 to 1.0)
      let nextIndex = 0;
      if (rawProgress >= 0.78) {
        nextIndex = 4;
      } else if (rawProgress >= 0.58) {
        nextIndex = 3;
      } else if (rawProgress >= 0.38) {
        nextIndex = 2;
      } else if (rawProgress >= 0.18) {
        nextIndex = 1;
      } else {
        nextIndex = 0;
      }

      setActiveIndex(nextIndex);
    };

    const onScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    handleScroll();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const currentService = SHOWCASE_SERVICES[activeIndex] ?? SHOWCASE_SERVICES[0]!;

  return (
    <section
      ref={outerSectionRef}
      id="industries"
      className="relative bg-white border-b border-[#E8ECF1] scroll-mt-20"
      style={{ height: "450vh" }}
    >
      {/* 100% STATIC PINNED PRESENTATION STAGE IN THE VIEWPORT (PERFECTLY CENTERED IN THE MIDDLE) */}
      <div className="sticky top-20 h-[calc(100dvh-5rem)] w-full flex flex-col justify-center items-center py-2 sm:py-3 px-3 sm:px-6 overflow-hidden select-none">
        <div className="w-full max-w-4xl xl:max-w-[940px] mx-auto flex flex-col justify-center items-center my-auto">
          {/* STATIC SECTION HEADER & ACTIVE COUNTER */}
          <div className="text-center px-4 mb-2 sm:mb-2.5 shrink-0">
            <p className="eyebrow text-[10.5px] sm:text-[11.5px] font-semibold uppercase tracking-[0.14em] text-[#F47B20]">
              OUR RECRUITMENT EXPERTISE.
            </p>
            <h2 className="mt-0.5 sm:mt-1 text-lg sm:text-2xl md:text-[26px] lg:text-[28px] font-bold tracking-tight text-[#0B1F3A] leading-tight">
              Industries We Connect Through Talent.
            </h2>
            <p className="mt-0.5 sm:mt-1 text-[12px] sm:text-[13.5px] leading-relaxed text-[#344054] max-w-xl mx-auto hidden sm:block">
              From technology infrastructure to healthcare and logistics, we connect businesses with
              professionals across five essential industries.
            </p>

            {/* DYNAMIC DISCIPLINE STEP PILLS */}
            <div className="mt-1 sm:mt-1.5 inline-flex items-center gap-2 sm:gap-2.5 px-3 py-0.5 rounded-full bg-[#0B1F3A]/5 border border-[#0B1F3A]/10 shadow-xs">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#667085]">
                Discipline:
              </span>
              <span className="text-[11px] sm:text-[12px] font-bold font-mono text-[#F47B20]">
                {currentService.number}
              </span>
              <span className="text-[#CBD5E1] hidden sm:inline">•</span>
              <span className="text-[11px] sm:text-[12px] font-semibold text-[#0B1F3A] hidden sm:inline">
                {currentService.shortTitle}
              </span>

              {/* 5 Interactive Dots */}
              <div className="flex items-center gap-1.5 ml-1">
                {SHOWCASE_SERVICES.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => scrollToCard(idx)}
                    aria-label={`Go to ${s.title}`}
                    title={`${s.number} - ${s.title}`}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === activeIndex
                        ? "w-4 bg-[#F47B20]"
                        : idx < activeIndex
                        ? "w-1.5 bg-[#0B1F3A]/50 hover:bg-[#0B1F3A]/80"
                        : "w-1.5 bg-[#0B1F3A]/20 hover:bg-[#0B1F3A]/40"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* STATIC CARD VIEWPORT (Cards slide smoothly UP inside this frame, centered in the middle of the screen) */}
          <div className="relative w-full max-w-4xl xl:max-w-[920px] mx-auto h-[min(370px,calc(100dvh-14.5rem))] sm:h-[min(380px,calc(100dvh-14.5rem))] md:h-[min(370px,calc(100dvh-14rem))] lg:h-[min(380px,calc(100dvh-13.5rem))] xl:h-[min(390px,calc(100dvh-13.5rem))] rounded-2xl overflow-hidden shadow-xl shrink-0">
            {SHOWCASE_SERVICES.map((service, index) => {
              const isActive = index === activeIndex;
              const isPast = index < activeIndex;
              const isDark = service.theme === "dark";
              const IconComp = service.icon;
              const isTextLeft = service.layout === "text-left";

              return (
                <article
                  key={service.id}
                  aria-hidden={!isActive}
                  className={`absolute inset-0 transition-all duration-500 ease-out ${
                    isDark
                      ? "bg-[#0B1F3A] text-white border border-white/10"
                      : "bg-white text-[#0B1F3A] border border-[#E8ECF1]"
                  } ${
                    isActive
                      ? "opacity-100 translate-y-0 scale-100 pointer-events-auto z-10"
                      : isPast
                      ? "opacity-0 -translate-y-8 scale-[0.96] pointer-events-none z-0"
                      : "opacity-0 translate-y-8 scale-[0.96] pointer-events-none z-0"
                  }`}
                >
                  {/* Ambient radial glow for dark navy cards */}
                  {isDark && (
                    <div
                      className="absolute inset-0 pointer-events-none opacity-30"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle at 15% 20%, rgba(244, 123, 32, 0.15) 0%, transparent 45%), radial-gradient(circle at 85% 80%, rgba(20, 47, 82, 0.8) 0%, transparent 50%)",
                      }}
                    />
                  )}

                  {/* Presentation Grid: Responsive 2-Column on Desktop/Tablet, Clean Column on Mobile */}
                  <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 md:gap-5 lg:gap-6 items-center h-full p-3.5 sm:p-5 md:p-5 lg:p-6 overflow-y-auto md:overflow-y-visible">
                    {/* TEXT COLUMN */}
                    <div
                      className={`md:col-span-6 flex flex-col justify-center ${
                        isTextLeft ? "md:order-1 order-1" : "md:order-2 order-1"
                      }`}
                    >
                      {/* Eyebrow & Service Number */}
                      <div className="flex items-center gap-2">
                        <span className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-[#F47B20] font-sans">
                          {service.number}
                        </span>
                        <span
                          className={`text-[9.5px] sm:text-[10px] lg:text-[10.5px] font-semibold uppercase tracking-[0.12em] px-2 py-0.5 rounded-md ${
                            isDark
                              ? "bg-white/10 text-white/90 border border-white/15"
                              : "bg-[#F7F8FA] text-[#667085] border border-[#E8ECF1]"
                          }`}
                        >
                          Direct-Hire Recruitment
                        </span>
                      </div>

                      {/* Industry Title */}
                      <h3
                        className={`mt-1 sm:mt-1.5 text-base sm:text-lg lg:text-xl xl:text-[22px] font-bold tracking-tight leading-snug ${
                          isDark ? "text-white" : "text-[#0B1F3A]"
                        }`}
                      >
                        {service.title}
                      </h3>

                      {/* Short Description */}
                      <p
                        className={`mt-1 text-[11.5px] sm:text-[12.5px] lg:text-[13px] leading-relaxed max-w-md line-clamp-2 ${
                          isDark ? "text-white/80" : "text-[#344054]"
                        }`}
                      >
                        {service.description}
                      </p>

                      {/* Key Placement Roles */}
                      <div className="mt-1.5 sm:mt-2">
                        <p className="text-[9.5px] sm:text-[10px] font-bold uppercase tracking-[0.12em] text-[#F47B20] mb-1">
                          Key Placement Roles
                        </p>
                        <div className="flex flex-wrap gap-1 sm:gap-1.5">
                          {service.roles.map((role) => (
                            <span
                              key={role}
                              className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-medium transition-colors ${
                                isDark
                                  ? "bg-white/10 text-white border border-white/15"
                                  : "bg-[#F7F8FA] text-[#0B1F3A] border border-[#E8ECF1]"
                              }`}
                            >
                              <CheckCircle2 className="size-3 sm:size-3.5 text-[#F47B20]" />
                              <span>{role}</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* CTA Button */}
                      <div className="mt-2 sm:mt-2.5">
                        <Link
                          to="/jobs"
                          search={{ industry: service.industryKey }}
                          className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-[7px] bg-[#F47B20] hover:bg-[#e06d17] text-white font-semibold text-[12px] sm:text-[12.5px] shadow-sm hover:shadow-md transition-all duration-200 group hover:-translate-y-0.5 cursor-pointer"
                        >
                          <span>Explore Available Jobs</span>
                          <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </div>

                    {/* IMAGE COLUMN */}
                    <div
                      className={`md:col-span-6 h-full flex items-center justify-center ${
                        isTextLeft ? "md:order-2 order-2" : "md:order-1 order-2"
                      }`}
                    >
                      <div
                        className={`relative w-full h-[120px] sm:h-[150px] md:h-[190px] lg:h-[220px] xl:h-[240px] rounded-xl overflow-hidden shadow-lg group ${
                          isDark ? "border border-white/15" : "border border-[#E8ECF1]"
                        }`}
                      >
                        <img
                          src={service.image}
                          alt={service.imageAlt}
                          width={944}
                          height={704}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          loading="lazy"
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                        {/* Docked Discipline Card on Image */}
                        <div className="absolute bottom-2 sm:bottom-2.5 left-2 sm:left-2.5 right-2 sm:right-2.5 flex items-center justify-between pointer-events-none">
                          <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/20 text-white text-[10.5px] sm:text-[11.5px] font-medium shadow-sm">
                            <IconComp className="size-3 text-[#F47B20]" />
                            <span>{service.shortTitle}</span>
                          </div>
                          <span className="text-[9.5px] sm:text-[10.5px] font-bold text-white bg-[#F47B20] px-1.5 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
                            Direct-Hire
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
