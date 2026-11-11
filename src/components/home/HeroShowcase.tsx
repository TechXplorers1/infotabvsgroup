import { Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero.jpg";

export function HeroShowcase() {
  return (
    <section
      id="home"
      className="relative w-full overflow-hidden bg-[#0B1F3A]"
    >
      {/* Full-width, full-bleed hero without rounded corners */}
      <div className="relative min-h-[540px] sm:min-h-[640px] lg:min-h-[calc(100dvh-5rem)] w-full flex items-center">
        {/* Full Bleed Photographic Background */}
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="TAB V&S Group professional recruitment consultants collaborating in a modern office"
            width={1920}
            height={1080}
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
        </div>

        {/* Ambient Dark Navy Gradient Overlay for Text Readability (left-heavy) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A]/95 via-[#0B1F3A]/75 to-[#0B1F3A]/25 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/85 via-transparent to-transparent pointer-events-none" />

        {/* Content Container aligned with site width (padded for fixed transparent navbar) */}
        <div className="container-x relative z-10 w-full pt-28 pb-16 sm:pt-32 sm:pb-20 md:pt-36 md:pb-24 lg:pt-40 lg:pb-28">
          <div className="max-w-2xl lg:max-w-3xl">
            {/* Headline with horizontal accent line matching reference design */}
            <h1 className="text-3xl sm:text-5xl lg:text-[60px] xl:text-[66px] font-bold text-white leading-[1.14] sm:leading-[1.12] tracking-tight">
              <span className="flex items-center gap-3 sm:gap-4 flex-wrap">
                <span>Connecting Talent</span>
                <span className="hidden sm:inline-block h-[2px] w-12 sm:w-20 lg:w-24 bg-[#F47B20] rounded-full" />
              </span>
              <span className="block mt-2 sm:mt-3 text-white">
                With <span className="text-[#F47B20]">Opportunity.</span>
              </span>
            </h1>

            {/* Concise Supporting Narrative */}
            <p className="mt-4 sm:mt-6 text-[15px] sm:text-[18px] text-white/85 max-w-xl leading-relaxed">
              We connect businesses with qualified professionals through reliable,
              direct-hire recruitment solutions across five essential industries.
            </p>

            {/* Exactly Two CTA Buttons: Explore Services and Explore Jobs */}
            <div className="mt-8 sm:mt-9 flex flex-col xs:flex-row items-stretch xs:items-center gap-3.5 sm:gap-4">
              <Link
                to="/services"
                className="inline-flex items-center justify-center h-12 sm:h-13 px-7 sm:px-8 rounded-full bg-[#F47B20] hover:bg-[#e06d17] text-white text-[15px] font-semibold shadow-[0_8px_24px_rgba(244,123,32,0.35)] transition-all duration-200 hover:-translate-y-0.5 cursor-pointer text-center"
              >
                Explore Services
              </Link>

              <Link
                to="/jobs"
                className="inline-flex items-center justify-center h-12 sm:h-13 px-7 sm:px-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white text-[15px] font-semibold transition-all duration-200 hover:-translate-y-0.5 cursor-pointer text-center"
              >
                Explore Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
