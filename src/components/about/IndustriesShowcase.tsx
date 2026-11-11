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
  const outerContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      if (!outerContainerRef.current) return;
      const rect = outerContainerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const stickyTop = 88;
      const scrollableDistance = rect.height - (windowHeight - stickyTop);

      if (scrollableDistance <= 0) return;

      const scrolled = stickyTop - rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollableDistance));
      const nextIndex = Math.min(SHOWCASE_SERVICES.length - 1, Math.floor(progress * SHOWCASE_SERVICES.length));

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

  return (
    <section id="industries" className="bg-white py-16 md:py-24 border-b border-[#E8ECF1]">
      <div className="container-x">
        {/* SECTION 02 – SECTION INTRODUCTION */}
        <div className="mx-auto max-w-3xl text-center px-4 mb-8 md:mb-12">
          <p className="eyebrow text-[13px] font-semibold uppercase tracking-[0.14em] text-[#F47B20]">
            OUR RECRUITMENT EXPERTISE.
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0B1F3A] sm:text-4xl md:text-[40px] md:leading-[1.15]">
            Industries We Connect Through Talent.
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-[#344054] max-w-2xl mx-auto">
            From technology infrastructure to healthcare and logistics, we connect businesses with
            professionals across five essential industries.
          </p>
        </div>

        {/* ======================================================== */}
        {/* DESKTOP STICKY SCROLL SHOWCASE (hidden on mobile/tablet) */}
        {/* ======================================================== */}
        <div
          ref={outerContainerRef}
          className="relative hidden lg:block"
          style={{ height: "400vh" }}
        >
          <div className="sticky top-24 flex min-h-[calc(100vh-6.5rem)] items-center justify-center">
            {/* Presentation Showcase Card Viewport */}
            <div className="w-full max-w-7xl mx-auto px-4">
              <div className="relative h-[560px] xl:h-[620px] w-full rounded-2xl overflow-hidden shadow-2xl transition-colors duration-500">
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
                          : "bg-[#FFFFFF] text-[#0B1F3A] border border-[#E8ECF1]"
                      } ${
                        isActive
                          ? "opacity-100 translate-y-0 scale-100 pointer-events-auto z-10"
                          : isPast
                          ? "opacity-0 -translate-y-8 scale-[0.96] pointer-events-none z-0"
                          : "opacity-0 translate-y-8 scale-[0.96] pointer-events-none z-0"
                      }`}
                    >
                      {/* Subtle ambient gradient for dark navy panels */}
                      {isDark && (
                        <div
                          className="absolute inset-0 pointer-events-none opacity-30"
                          style={{
                            backgroundImage:
                              "radial-gradient(circle at 15% 20%, rgba(244, 123, 32, 0.15) 0%, transparent 45%), radial-gradient(circle at 85% 80%, rgba(20, 47, 82, 0.8) 0%, transparent 50%)",
                          }}
                        />
                      )}

                      {/* Split Presentation Grid */}
                      <div className="relative z-10 grid grid-cols-12 gap-8 xl:gap-12 items-center h-full p-8 xl:p-12">
                        {/* TEXT COLUMN */}
                        <div
                          className={`col-span-6 flex flex-col justify-center ${
                            isTextLeft ? "order-1" : "order-2"
                          }`}
                        >
                          {/* Eyebrow & Service Number */}
                          <div className="flex items-center gap-3">
                            <span className="text-4xl xl:text-5xl font-bold tracking-tight text-[#F47B20] font-sans">
                              {service.number}
                            </span>
                            <span
                              className={`text-[12px] font-semibold uppercase tracking-[0.14em] px-2.5 py-1 rounded-md ${
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
                            className={`mt-4 text-3xl xl:text-[40px] font-bold tracking-tight leading-[1.15] ${
                              isDark ? "text-white" : "text-[#0B1F3A]"
                            }`}
                          >
                            {service.title}
                          </h3>

                          {/* Short Description */}
                          <p
                            className={`mt-4 text-[16px] leading-relaxed max-w-xl ${
                              isDark ? "text-white/80" : "text-[#344054]"
                            }`}
                          >
                            {service.description}
                          </p>

                          {/* Example Job Roles */}
                          <div className="mt-6">
                            <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#F47B20] mb-2.5">
                              Key Placement Roles
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {service.roles.map((role) => (
                                <span
                                  key={role}
                                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13.5px] font-medium transition-colors ${
                                    isDark
                                      ? "bg-white/10 text-white border border-white/15"
                                      : "bg-[#F7F8FA] text-[#0B1F3A] border border-[#E8ECF1]"
                                  }`}
                                >
                                  <CheckCircle2 className="size-3.5 text-[#F47B20]" />
                                  <span>{role}</span>
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* CTA Button */}
                          <div className="mt-8">
                            <Link
                              to="/jobs"
                              search={{ industry: service.industryKey }}
                              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-[8px] bg-[#F47B20] hover:bg-[#e06d17] text-white font-semibold text-[15px] shadow-sm hover:shadow-md transition-all duration-200 group hover:-translate-y-0.5 cursor-pointer"
                            >
                              <span>Explore Available Jobs</span>
                              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                            </Link>
                          </div>
                        </div>

                        {/* IMAGE COLUMN */}
                        <div
                          className={`col-span-6 h-full flex items-center justify-center ${
                            isTextLeft ? "order-2" : "order-1"
                          }`}
                        >
                          <div
                            className={`relative w-full h-[400px] xl:h-[460px] rounded-xl lg:rounded-2xl overflow-hidden shadow-xl group ${
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
                            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/20 text-white text-[13px] font-medium shadow-sm">
                                <IconComp className="size-4 text-[#F47B20]" />
                                <span>{service.shortTitle}</span>
                              </div>
                              <span className="text-[12px] font-bold text-white bg-[#F47B20] px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
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
        </div>

        {/* ======================================================== */}
        {/* MOBILE & TABLET SEQUENTIAL STACK (lg:hidden) */}
        {/* ======================================================== */}
        <div className="block lg:hidden space-y-8 sm:space-y-10">
          {SHOWCASE_SERVICES.map((service) => {
            const isDark = service.theme === "dark";
            const IconComp = service.icon;

            return (
              <article
                key={service.id}
                className={`rounded-2xl p-6 sm:p-8 flex flex-col gap-5 border transition-all duration-300 shadow-sm ${
                  isDark
                    ? "bg-[#0B1F3A] text-white border-white/10"
                    : "bg-white text-[#0B1F3A] border-[#E8ECF1]"
                }`}
              >
                {/* Header row with Number & Badge */}
                <div className="flex items-center justify-between gap-4">
                  <span className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F47B20]">
                    {service.number}
                  </span>
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[12px] font-semibold uppercase tracking-wider ${
                      isDark
                        ? "bg-white/10 text-white/90 border border-white/15"
                        : "bg-[#F7F8FA] text-[#667085] border border-[#E8ECF1]"
                    }`}
                  >
                    <IconComp className="size-3.5 text-[#F47B20]" />
                    <span>{service.shortTitle}</span>
                  </div>
                </div>

                {/* Title */}
                <h3
                  className={`text-2xl sm:text-3xl font-bold tracking-tight leading-snug ${
                    isDark ? "text-white" : "text-[#0B1F3A]"
                  }`}
                >
                  {service.title}
                </h3>

                {/* Description */}
                <p
                  className={`text-[15px] sm:text-[16px] leading-relaxed ${
                    isDark ? "text-white/80" : "text-[#344054]"
                  }`}
                >
                  {service.description}
                </p>

                {/* Image */}
                <div
                  className={`relative w-full aspect-[16/10] rounded-xl overflow-hidden border ${
                    isDark ? "border-white/15" : "border-[#E8ECF1]"
                  }`}
                >
                  <img
                    src={service.image}
                    alt={service.imageAlt}
                    width={944}
                    height={704}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className="text-[12px] font-medium text-white/90 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded">
                      Direct-Hire Talent
                    </span>
                    <span className="text-[11.5px] font-bold text-white bg-[#F47B20] px-2.5 py-1 rounded uppercase tracking-wider">
                      Verified
                    </span>
                  </div>
                </div>

                {/* Example Job Roles */}
                <div>
                  <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#F47B20] mb-2.5">
                    Key Placement Roles
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {service.roles.map((role) => (
                      <span
                        key={role}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium ${
                          isDark
                            ? "bg-white/10 text-white border border-white/15"
                            : "bg-[#F7F8FA] text-[#0B1F3A] border border-[#E8ECF1]"
                        }`}
                      >
                        <CheckCircle2 className="size-3.5 text-[#F47B20]" />
                        <span>{role}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <div className="pt-2">
                  <Link
                    to="/jobs"
                    search={{ industry: service.industryKey }}
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-3.5 rounded-[8px] bg-[#F47B20] hover:bg-[#e06d17] text-white font-semibold text-[15px] shadow-sm transition-all duration-200 group"
                  >
                    <span>Explore Available Jobs</span>
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

