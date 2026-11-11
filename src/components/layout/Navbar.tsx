import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  currentPath?: string;
}

export function Logo({
  light = true,
  showIcon = false,
}: {
  light?: boolean;
  showIcon?: boolean;
}) {
  return (
    <Link
      to="/"
      aria-label="TAB V&S Group – Go to homepage"
      className="inline-flex items-center group cursor-pointer transition-opacity duration-200 hover:opacity-90 shrink-0 text-left"
    >
      {showIcon && (
        <span className="grid size-10 place-items-center rounded-[8px] bg-[#0B1F3A] text-[15px] font-bold text-white ring-2 ring-[#F47B20]/80 ring-offset-2 ring-offset-transparent transition-transform duration-200 group-hover:scale-105 shadow-sm shrink-0 mr-3">
          TAB
        </span>
      )}
      <span className="flex flex-col text-left leading-none">
        <span
          className={`block text-[18px] sm:text-[24px] font-bold tracking-tight transition-colors duration-200 group-hover:text-[#F47B20] ${
            light ? "text-white" : "text-[#0B1F3A]"
          }`}
        >
          TAB V&amp;S Group
        </span>
        <span
          className={`block text-[10px] sm:text-[12px] font-medium tracking-[1.5px] sm:tracking-[2px] uppercase mt-0.5 sm:mt-1 ${
            light ? "text-[#98A2B3]" : "text-[#667085]"
          }`}
        >
          RECRUITMENT AGENCY
        </span>
      </span>
    </Link>
  );
}

export function Navbar({ currentPath = "/" }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll position to switch between transparent and blurred navy background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isAboutPage = currentPath === "/about";
  const isServicesPage = currentPath === "/services";
  const isStaffingPage = currentPath === "/request-staffing";
  const isJobSeekersPage = currentPath === "/job-seekers" || currentPath === "/job-seekers/register";
  const isJobsPage = currentPath === "/jobs";
  const isContactPage = currentPath === "/contact";

  // Pages with full-width dark photographic heroes where navbar sits directly over the background
  const isOverlayHero = currentPath === "/" || currentPath === "/services";

  const navItems = [
    { label: "About Us", href: "/about", isRoute: true },
    { label: "Services", href: "/services", isRoute: true },
    { label: "Employers", href: "/request-staffing", isRoute: true },
    { label: "Job Seekers", href: "/job-seekers", isRoute: true },
    { label: "Find Jobs", href: "/jobs", isRoute: true },
    { label: "Contact", href: "/contact", isRoute: true },
  ];

  // At top of page: transparent on overlay hero pages (with subtle readability gradient vignette)
  // Scrolled state: semi-transparent navy rgba(11, 31, 58, 0.92) with 12px blur & subtle border
  const isTransparent = !scrolled && isOverlayHero;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
          isTransparent
            ? "bg-gradient-to-b from-[#0B1F3A]/60 via-[#0B1F3A]/20 to-transparent border-b border-transparent"
            : "bg-[#0B1F3A]/92 backdrop-blur-[12px] border-b border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.25)]"
        }`}
      >
        <div className="container-x flex h-20 items-center justify-between gap-6 lg:gap-10">
          {/* Left: Text-only Clickable TAB V&S Group logo -> Homepage (/) */}
          <Logo light={true} showIcon={false} />

          {/* Center: Desktop Navigation with Active Orange Underlines & Subtle Hover Transition */}
          <nav className="hidden items-center gap-7 lg:flex">
            {navItems.map((item) => {
              const isActive =
                (item.label === "About Us" && isAboutPage) ||
                (item.label === "Services" && isServicesPage) ||
                (item.label === "Employers" && isStaffingPage) ||
                (item.label === "Job Seekers" && isJobSeekersPage) ||
                (item.label === "Find Jobs" && isJobsPage) ||
                (item.label === "Contact" && isContactPage);

              const underlineClass =
                "relative py-1.5 text-[15px] font-medium transition-colors duration-200 hover:text-[#F47B20] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-[#F47B20] after:transition-all after:duration-300 after:ease-[cubic-bezier(0.22,1,0.36,1)]";

              if (item.isRoute) {
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={`${underlineClass} ${
                      isActive
                        ? "text-[#F47B20] font-semibold after:w-full"
                        : "text-white/90 after:w-0 hover:after:w-full"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              }

              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={`${underlineClass} text-white/90 after:w-0 hover:after:w-full`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Right: Orange Hire Talent CTA button & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <Button
              asChild
              className="group hidden sm:inline-flex h-9.5 px-4.5 rounded-[6px] bg-[#F47B20] hover:bg-[#e06d17] text-white text-[13.5px] font-semibold shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(244,123,32,0.3)] items-center gap-1.5 cursor-pointer"
            >
              <Link to="/request-staffing">
                <span>Hire Talent</span>
                <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </Button>

            <button
              aria-label="Toggle Navigation Menu"
              aria-expanded={open}
              className="text-white lg:hidden min-h-[44px] min-w-[44px] p-2 rounded-md hover:bg-white/10 flex items-center justify-center transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F47B20]"
              onClick={() => setOpen(!open)}
            >
              {open ? <X className="size-6 text-white" /> : <Menu className="size-6 text-white" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer with smooth slide/fade animation & semi-transparent navy background */}
        {open && (
          <nav className="container-x flex flex-col gap-1 border-t border-white/10 pb-6 pt-3 lg:hidden bg-[#0B1F3A]/98 backdrop-blur-xl animate-in fade-in-0 slide-in-from-top-2 duration-300 ease-out shadow-2xl max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain">
            {navItems.map((item) => {
              const isActive =
                (item.label === "About Us" && isAboutPage) ||
                (item.label === "Services" && isServicesPage) ||
                (item.label === "Employers" && isStaffingPage) ||
                (item.label === "Job Seekers" && isJobSeekersPage) ||
                (item.label === "Find Jobs" && isJobsPage) ||
                (item.label === "Contact" && isContactPage);

              if (item.isRoute) {
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={() => setOpen(false)}
                    className={`min-h-[44px] flex items-center rounded-lg px-3.5 py-2.5 text-[15px] font-medium transition-colors ${
                      isActive
                        ? "bg-[#F47B20]/15 text-[#F47B20] font-semibold border-l-2 border-[#F47B20]"
                        : "text-white/90 hover:bg-white/10 hover:text-[#F47B20]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              }

              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="min-h-[44px] flex items-center rounded-lg px-3.5 py-2.5 text-[15px] font-medium text-white/90 hover:bg-white/10 hover:text-[#F47B20] transition-colors"
                >
                  {item.label}
                </a>
              );
            })}

            <Button
              asChild
              className="mt-3 w-full min-h-[44px] h-11 rounded-[6px] bg-[#F47B20] hover:bg-[#e06d17] text-white text-[15px] font-semibold shadow-md"
            >
              <Link to="/request-staffing" onClick={() => setOpen(false)}>
                Hire Talent
              </Link>
            </Button>
          </nav>
        )}
      </header>

      {/* Layout Spacer for non-overlay pages so content is not obscured by fixed header */}
      {!isOverlayHero && <div className="h-20 w-full shrink-0" aria-hidden="true" />}
    </>
  );
}
