import { useState, useEffect, useRef } from "react";
import {
  ClipboardList,
  Search,
  Handshake,
  BadgeCheck,
  Check,
} from "lucide-react";

interface ProcessStep {
  number: string;
  phaseLabel: string;
  title: string;
  description: string;
  icon: typeof ClipboardList;
  details: string[];
}

const PROCESS_STEPS: ProcessStep[] = [
  {
    number: "01",
    phaseLabel: "PHASE 01",
    title: "Understand Requirements.",
    description: "We learn about your business, hiring needs and required qualifications.",
    icon: ClipboardList,
    details: [
      "Consultative technical intake",
      "Certifications & skills criteria",
      "Team culture alignment",
    ],
  },
  {
    number: "02",
    phaseLabel: "PHASE 02",
    title: "Identify Qualified Candidates.",
    description: "We screen and assess candidates based on skills, experience and role requirements.",
    icon: Search,
    details: [
      "Rigorous experience verification",
      "Technical competency review",
      "Direct-hire interest confirmation",
    ],
  },
  {
    number: "03",
    phaseLabel: "PHASE 03",
    title: "Connect Employers with Talent.",
    description: "We coordinate candidate introductions and interview scheduling.",
    icon: Handshake,
    details: [
      "Targeted profile presentation",
      "Seamless interview coordination",
      "Two-way feedback facilitation",
    ],
  },
  {
    number: "04",
    phaseLabel: "PHASE 04",
    title: "Complete Direct-Hire Placement.",
    description: "We support offer coordination, onboarding alignment and placement follow-up.",
    icon: BadgeCheck,
    details: [
      "Offer negotiation support",
      "First-day onboarding readiness",
      "Post-placement retention follow-up",
    ],
  },
];

export function RecruitmentProcessTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [manualActiveIndex, setManualActiveIndex] = useState<number | null>(null);

  // Scroll listener to calculate progressive scroll progress through section
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start activating as the section enters the middle of the viewport
      // Complete activation as user scrolls through it
      const startTrigger = windowHeight * 0.8;
      const endTrigger = windowHeight * 0.2;
      const totalScrollableDistance = rect.height + (startTrigger - endTrigger);
      const scrolledPast = startTrigger - rect.top;

      const progress = Math.max(0, Math.min(1, scrolledPast / totalScrollableDistance));
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine active stages from scroll progress
  // Phase 1: progress >= 0.12 (Step 01 active)
  // Phase 2: progress >= 0.38 (Step 01, 02 active)
  // Phase 3: progress >= 0.64 (Step 01, 02, 03 active)
  // Phase 4: progress >= 0.86 (All 4 steps active)
  const isStep1Active = scrollProgress >= 0.12 || (manualActiveIndex !== null && manualActiveIndex >= 0);
  const isStep2Active = scrollProgress >= 0.38 || (manualActiveIndex !== null && manualActiveIndex >= 1);
  const isStep3Active = scrollProgress >= 0.64 || (manualActiveIndex !== null && manualActiveIndex >= 2);
  const isStep4Active = scrollProgress >= 0.86 || (manualActiveIndex !== null && manualActiveIndex >= 3);

  const activeStates = [isStep1Active, isStep2Active, isStep3Active, isStep4Active];

  // Calculate animated connecting line width (0% to 100%)
  let lineWidthPercent = 0;
  if (scrollProgress >= 0.86) {
    lineWidthPercent = 100;
  } else if (scrollProgress >= 0.64) {
    lineWidthPercent = 66 + ((scrollProgress - 0.64) / (0.86 - 0.64)) * 34;
  } else if (scrollProgress >= 0.38) {
    lineWidthPercent = 33 + ((scrollProgress - 0.38) / (0.64 - 0.38)) * 33;
  } else if (scrollProgress >= 0.12) {
    lineWidthPercent = ((scrollProgress - 0.12) / (0.38 - 0.12)) * 33;
  }

  // Active step counter for screen readers and badges
  const totalActiveCount = activeStates.filter(Boolean).length;

  return (
    <section
      id="recruitment-process"
      ref={sectionRef}
      className="relative bg-[#0B1F3A] py-20 md:py-24 overflow-hidden border-b border-white/10"
      aria-label="Our Recruitment Process Timeline"
    >
      {/* Background Decorative Ambient Geometry */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-28 -top-28 size-96 rounded-full border border-white/5 bg-[radial-gradient(circle,rgba(244,123,32,0.08),transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 -bottom-28 size-96 rounded-full border border-white/5 bg-[radial-gradient(circle,rgba(20,47,82,0.6),transparent_70%)]"
      />

      <div className="container-x relative z-10">
        {/* Section Header: Centered & Minimal */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow text-[13px] font-semibold uppercase tracking-[0.14em] text-[#F47B20]">
            HOW WE WORK.
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-[40px] md:leading-[1.15]">
            Our Recruitment Process.
          </h2>
          <p className="mt-4 text-[15px] sm:text-[16px] leading-relaxed text-white/75 max-w-xl mx-auto">
            Four structured steps. One goal: connecting businesses with qualified talent.
          </p>

          {/* Quick interactive phase indicators */}
          <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#142F52]/60 px-4 py-1.5 backdrop-blur-sm">
            <span className="size-2 rounded-full bg-[#F47B20] animate-pulse" />
            <span className="text-[12px] font-medium text-white/80">
              {totalActiveCount === 0
                ? "Scroll to begin journey"
                : totalActiveCount === 4
                  ? "Recruitment journey complete (4/4 stages active)"
                  : `Stage 0${totalActiveCount} of 04 active`}
            </span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* DESKTOP & TABLET TIMELINE: Horizontal Connected Flow           */}
        {/* ============================================================== */}
        <div className="mt-16 hidden lg:block">
          <div className="relative">
            {/* The Horizontal Continuous Connecting Line */}
            {/* Sits precisely through the center of the 64px circular node (top: 96px) */}
            <div
              aria-hidden="true"
              className="absolute top-[96px] left-[8%] right-[8%] h-[3px] -translate-y-1/2 rounded-full bg-white/15 z-0"
            >
              {/* Animated Orange Fill Progress Line */}
              <div
                className="h-full rounded-full bg-[#F47B20] transition-all duration-500 ease-out shadow-[0_0_16px_rgba(244,123,32,0.7)]"
                style={{ width: `${lineWidthPercent}%` }}
              />
            </div>

            {/* 4 Process Stage Columns */}
            <div className="grid grid-cols-4 gap-8 relative z-10">
              {PROCESS_STEPS.map((step, idx) => {
                const IconComp = step.icon;
                const isActive = activeStates[idx] ?? false;
                const isCompleted = (activeStates[idx + 1] ?? false) || (idx === 3 && isStep4Active);

                return (
                  <div
                    key={step.number}
                    onMouseEnter={() => setManualActiveIndex(idx)}
                    onMouseLeave={() => setManualActiveIndex(null)}
                    onClick={() => setManualActiveIndex(idx)}
                    tabIndex={0}
                    role="button"
                    aria-label={`Step ${step.number}: ${step.title} - ${isActive ? "Active" : "Inactive"}`}
                    className="group relative flex flex-col items-center text-center cursor-pointer focus:outline-none"
                  >
                    {/* Stage Number (36px / 700) */}
                    <div className="h-10 flex items-center justify-center">
                      <span
                        className={`text-[36px] font-bold tracking-tight transition-all duration-500 ${
                          isActive
                            ? "text-[#F47B20] scale-100"
                            : "text-[#98A2B3]/50 scale-90"
                        }`}
                      >
                        {step.number}
                      </span>
                    </div>

                    {/* Circular Step Node with Icon */}
                    <div className="relative mt-4">
                      {/* Active Outer Glow Ring */}
                      <div
                        className={`absolute inset-0 rounded-full transition-all duration-500 pointer-events-none ${
                          isActive
                            ? "ring-4 ring-[#F47B20]/30 scale-125 bg-[#F47B20]/15"
                            : "scale-100 ring-0"
                        }`}
                      />

                      {/* Main Node Circle */}
                      <div
                        className={`relative size-16 rounded-full flex items-center justify-center transition-all duration-500 shadow-md ${
                          isActive
                            ? "bg-[#F47B20] text-white shadow-[0_0_24px_rgba(244,123,32,0.5)] scale-105"
                            : "bg-[#142F52] border border-white/20 text-[#98A2B3] hover:border-white/40"
                        }`}
                      >
                        {isCompleted && idx < 3 ? (
                          <Check className="size-7 stroke-[2.5] text-white transition-transform duration-300 group-hover:scale-110" />
                        ) : (
                          <IconComp className="size-7 stroke-[2] transition-transform duration-300 group-hover:scale-110" />
                        )}
                      </div>

                      {/* Completed Mini Badge */}
                      {isCompleted && (
                        <span
                          aria-label="Completed"
                          className="absolute -right-1 -bottom-1 grid size-5 place-items-center rounded-full bg-[#142F52] border border-[#F47B20] text-[#F47B20] text-[10px]"
                        >
                          ✓
                        </span>
                      )}
                    </div>

                    {/* Stage Content Card Container */}
                    <div
                      className={`mt-6 w-full rounded-[14px] p-5 transition-all duration-500 ${
                        isActive
                          ? "bg-white/[0.06] border border-white/15 translate-y-0 opacity-100 shadow-lg"
                          : "bg-transparent border border-transparent translate-y-2 opacity-60"
                      }`}
                    >
                      {/* Phase Label Pill */}
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider transition-colors duration-300 ${
                          isActive
                            ? "bg-[#F47B20]/20 text-[#F47B20] border border-[#F47B20]/30"
                            : "bg-white/5 text-[#98A2B3] border border-white/10"
                        }`}
                      >
                        {step.phaseLabel}
                      </span>

                      {/* Stage Title (20px / 600) */}
                      <h3
                        className={`mt-3 text-[19px] font-semibold leading-snug transition-colors duration-300 ${
                          isActive ? "text-white" : "text-[#98A2B3]"
                        }`}
                      >
                        {step.title}
                      </h3>

                      {/* Stage Description (14px / 400) */}
                      <p
                        className={`mt-2.5 text-[13.5px] leading-relaxed transition-all duration-300 ${
                          isActive ? "text-white/85" : "text-[#98A2B3]/70"
                        }`}
                      >
                        {step.description}
                      </p>

                      {/* Sub-details (Visible with subtle expansion when active) */}
                      <div
                        className={`mt-4 pt-3 border-t border-white/10 text-left space-y-1.5 transition-all duration-500 ${
                          isActive ? "opacity-100 max-h-40" : "opacity-0 max-h-0 overflow-hidden"
                        }`}
                      >
                        {step.details.map((item) => (
                          <div
                            key={item}
                            className="flex items-center gap-2 text-[12px] text-white/70"
                          >
                            <span className="size-1 rounded-full bg-[#F47B20] shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* MOBILE & TABLET TIMELINE: Vertical Connected Flow              */}
        {/* ============================================================== */}
        <div className="mt-14 relative lg:hidden max-w-xl mx-auto">
          {/* Vertical Progress Line */}
          <div
            aria-hidden="true"
            className="absolute left-[27px] top-6 bottom-6 w-[3px] bg-white/15 rounded-full z-0"
          >
            <div
              className="w-full bg-[#F47B20] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(244,123,32,0.7)]"
              style={{ height: `${lineWidthPercent}%` }}
            />
          </div>

          {/* Vertical Step Items */}
          <div className="space-y-8 relative z-10">
            {PROCESS_STEPS.map((step, idx) => {
              const IconComp = step.icon;
              const isActive = activeStates[idx] ?? false;
              const isCompleted = (activeStates[idx + 1] ?? false) || (idx === 3 && isStep4Active);

              return (
                <div
                  key={step.number}
                  onClick={() => setManualActiveIndex(idx)}
                  className={`flex items-start gap-4 sm:gap-5 rounded-[16px] p-4 sm:p-5 transition-all duration-500 cursor-pointer ${
                    isActive
                      ? "bg-white/[0.08] border border-white/20 shadow-lg"
                      : "bg-transparent border border-transparent opacity-65"
                  }`}
                >
                  {/* Step Node */}
                  <div className="relative shrink-0">
                    <div
                      className={`size-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? "bg-[#F47B20] text-white shadow-[0_0_20px_rgba(244,123,32,0.5)] scale-105"
                          : "bg-[#142F52] border border-white/20 text-[#98A2B3]"
                      }`}
                    >
                      {isCompleted && idx < 3 ? (
                        <Check className="size-6 stroke-[2.5]" />
                      ) : (
                        <IconComp className="size-6 stroke-[2]" />
                      )}
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[11px] font-bold uppercase tracking-wider ${
                          isActive ? "text-[#F47B20]" : "text-[#98A2B3]"
                        }`}
                      >
                        {step.phaseLabel}
                      </span>
                      <span
                        className={`text-[20px] font-bold leading-none ${
                          isActive ? "text-[#F47B20]" : "text-[#98A2B3]/50"
                        }`}
                      >
                        {step.number}
                      </span>
                    </div>

                    <h3
                      className={`mt-1.5 text-[18px] font-bold leading-snug ${
                        isActive ? "text-white" : "text-[#98A2B3]"
                      }`}
                    >
                      {step.title}
                    </h3>

                    <p
                      className={`mt-2 text-[14px] leading-relaxed ${
                        isActive ? "text-white/85" : "text-[#98A2B3]/75"
                      }`}
                    >
                      {step.description}
                    </p>

                    {/* Step Details */}
                    {isActive && (
                      <div className="mt-3.5 pt-3 border-t border-white/10 space-y-1.5 animate-in fade-in-0 duration-300">
                        {step.details.map((detail) => (
                          <div
                            key={detail}
                            className="flex items-center gap-2 text-[12.5px] text-white/75"
                          >
                            <span className="size-1 rounded-full bg-[#F47B20] shrink-0" />
                            <span>{detail}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

