import { Mail, Phone, MapPin } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Logo } from "./Navbar";

interface FooterProps {
  currentPath?: string;
}

export function Footer({ currentPath = "/" }: FooterProps) {
  const isAboutPage = currentPath === "/about";
  const isServicesPage = currentPath === "/services";
  const isStaffingPage = currentPath === "/request-staffing";
  const isJobSeekersPage = currentPath === "/job-seekers" || currentPath === "/job-seekers/register";
  const isJobsPage = currentPath === "/jobs";
  const isContactPage = currentPath === "/contact";
  const isSubPage =
    isAboutPage ||
    isServicesPage ||
    isStaffingPage ||
    isJobSeekersPage ||
    isJobsPage ||
    isContactPage;

  const companyLinks = [
    { label: "Home", href: isSubPage ? "/#home" : "#home", isRoute: false },
    { label: "About Us", href: "/about", isRoute: true },
    { label: "Services", href: "/services", isRoute: true },
    { label: "Employers", href: "/request-staffing", isRoute: true },
    { label: "Job Seekers", href: "/job-seekers", isRoute: true },
    { label: "Find Jobs", href: "/jobs", isRoute: true },
    { label: "Contact", href: "/contact", isRoute: true },
  ];

  const serviceLinks = [
    { label: "Data Center Operations & Technician", href: "/services#datacenter" },
    { label: "Information Technology", href: "/services#it" },
    { label: "Warehouse Associate Placement", href: "/services#warehouse" },
    { label: "Healthcare Services Placement", href: "/services#healthcare" },
    { label: "Cleaning Services Placement", href: "/services#cleaning" },
  ];

  return (
    <footer id="contact" className="bg-[#0B1F3A] pt-16 text-white/75">
      <div className="container-x grid gap-10 pb-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.3fr_1.3fr]">
        {/* Brand column */}
        <div>
          <Logo light showIcon={false} />
          <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-white/70">
            Recruitment and staffing solutions connecting businesses with qualified talent across multiple industries.
          </p>
        </div>

        {/* Company navigation */}
        <div>
          <h4 className="text-[15px] font-semibold text-white">Company</h4>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            {companyLinks.map((link) => (
              <li key={link.label}>
                {link.isRoute ? (
                  <Link
                    to={link.href}
                    className="transition-colors hover:text-[#F47B20]"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    href={link.href}
                    className="transition-colors hover:text-[#F47B20]"
                  >
                    {link.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Services column */}
        <div>
          <h4 className="text-[15px] font-semibold text-white">Services</h4>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            {serviceLinks.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  className="transition-colors hover:text-[#F47B20]"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact column */}
        <div>
          <h4 className="text-[20px] font-semibold text-white">Contact</h4>
          <ul className="mt-5 space-y-[18px] text-[16px] font-normal">
            <li className="flex items-start gap-3 text-white/85">
              <Mail className="size-5 shrink-0 text-[#F47B20] mt-0.5" strokeWidth={1.5} />
              <a
                href="mailto:tabeng14@infotabvsgroup.com"
                className="hover:text-white transition-colors break-all"
              >
                tabeng14@infotabvsgroup.com
              </a>
            </li>
            <li className="flex items-start gap-3 text-white/85">
              <Phone className="size-5 shrink-0 text-[#F47B20] mt-0.5" strokeWidth={1.5} />
              <a
                href="tel:3802064792"
                className="hover:text-white transition-colors"
              >
                380-206-4792
              </a>
            </li>
            <li className="flex items-start gap-3 text-white/85">
              <MapPin className="size-5 shrink-0 text-[#F47B20] mt-0.5" strokeWidth={1.5} />
              <a
                href="https://maps.google.com/?q=5749+Pittsford+Dr,+Westerville,+OH,+USA"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors leading-relaxed"
                title="View 5749 Pittsford Dr on Google Maps"
              >
                <span>5749 Pittsford Dr,</span>
                <span className="block">Westerville, OH, USA.</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Subfooter */}
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center gap-3 py-6 text-[13px] text-center md:flex-row md:items-center md:justify-between md:text-left text-white/60">
          <p>© {new Date().getFullYear()} TAB V&amp;S Group. All rights reserved.</p>

          <p className="text-white/75">
            Design &amp; Develop by{" "}
            <a
              href="https://techxplorers.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#F47B20] font-medium transition-colors underline decoration-white/30 hover:decoration-[#F47B20] underline-offset-2"
            >
              Techxplorers Pvt Ltd
            </a>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((policy) => (
              <a key={policy} href="#" className="hover:text-[#F47B20] transition-colors whitespace-nowrap">
                {policy}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
