import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Search,
  MapPin,
  Briefcase,
  Building2,
  ArrowRight,
  Filter,
  CheckCircle2,
  Server,
  Monitor,
  Package,
  HeartPulse,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  ALL_JOB_LISTINGS,
  getJobById,
  JobListing,
} from "@/services/job-listings";
import { JobDetailApplyView } from "@/components/jobs/JobDetailApplyView";

type JobsSearchParams = {
  industry?: string | undefined;
  q?: string | undefined;
  jobId?: string | undefined;
};

export const Route = createFileRoute("/jobs")({
  validateSearch: (search: Record<string, unknown>): JobsSearchParams => {
    const rawIndustry = search["industry"];
    const rawQ = search["q"];
    const rawJobId = search["jobId"];
    return {
      industry: typeof rawIndustry === "string" ? rawIndustry : undefined,
      q: typeof rawQ === "string" ? rawQ : undefined,
      jobId: typeof rawJobId === "string" ? rawJobId : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Find Jobs — TAB V&S Group Recruitment Agency" },
      {
        name: "description",
        content:
          "Browse open direct-hire opportunities across Data Center Operations, Information Technology, Warehousing, Healthcare, and Commercial Cleaning.",
      },
      { property: "og:title", content: "Find Jobs — TAB V&S Group Recruitment Agency" },
      {
        property: "og:description",
        content:
          "Explore direct-hire openings and connect with hiring employers nationwide. 100% free candidate placement support.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: JobsPage,
});

const JOB_LISTINGS = ALL_JOB_LISTINGS;

const INDUSTRIES = [
  { id: "all", label: "All Disciplines", icon: Briefcase },
  { id: "data-center", label: "Data Center Operations", icon: Server },
  { id: "it", label: "Information Technology", icon: Monitor },
  { id: "warehouse", label: "Warehouse Logistics", icon: Package },
  { id: "healthcare", label: "Healthcare Services", icon: HeartPulse },
  { id: "cleaning", label: "Commercial Cleaning", icon: Sparkles },
];

export default function JobsPage() {
  const search = Route.useSearch();
  const [selectedIndustry, setSelectedIndustry] = useState<string>(search.industry || "all");
  const [searchQuery, setSearchQuery] = useState<string>(search.q || "");

  const activeJobId = search.jobId;
  const activeJob = activeJobId ? getJobById(activeJobId) : undefined;

  // Dedicated Job Detail & Application View
  if (activeJob) {
    return (
      <div className="min-h-screen bg-white text-[#344054]">
        <Navbar currentPath="/jobs" />
        <JobDetailApplyView
          job={activeJob}
          onBackToJobs={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
        <Footer currentPath="/jobs" />
      </div>
    );
  }

  // If a non-existent jobId was requested
  if (activeJobId && !activeJob) {
    return (
      <div className="min-h-screen bg-white text-[#344054]">
        <Navbar currentPath="/jobs" />
        <div className="container-x py-24 text-center max-w-xl mx-auto">
          <div className="grid size-16 place-items-center rounded-full bg-[#FFF1E5] text-[#F47B20] mx-auto mb-4">
            <Briefcase className="size-8" />
          </div>
          <h2 className="text-2xl font-bold text-[#0B1F3A]">Job Position Not Found</h2>
          <p className="mt-2 text-[#667085]">
            The requested job posting may have been filled or the link might be expired. Browse all our
            active direct-hire opportunities below.
          </p>
          <Button asChild className="mt-6 bg-[#F47B20] hover:bg-[#e06d17] text-white font-semibold">
            <Link to="/jobs">View All Open Positions</Link>
          </Button>
        </div>
        <Footer currentPath="/jobs" />
      </div>
    );
  }

  const filteredJobs = JOB_LISTINGS.filter((job) => {
    const matchesIndustry =
      selectedIndustry === "all" || job.industry === selectedIndustry;
    const matchesSearch =
      searchQuery === "" ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesIndustry && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white text-[#344054]">
      <Navbar currentPath="/jobs" />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-[#0B1F3A] py-16 md:py-20 text-white border-b border-[#142F52]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(244,123,32,0.18),transparent_70%)]"
        />

        <div className="container-x relative">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow text-[13px] font-semibold uppercase tracking-[0.14em] text-[#F47B20]">
              FIND OPPORTUNITIES
            </p>
            <h1 className="mt-2.5 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-[52px]">
              Explore Available{" "}
              <span className="text-[#F47B20]">Direct-Hire</span> Roles.
            </h1>
            <p className="mt-4 text-[16px] sm:text-[17px] text-white/80 leading-relaxed max-w-2xl mx-auto">
              Connecting motivated professionals with permanent direct-hire positions across data
              centers, IT, warehousing, healthcare, and cleaning operations.
            </p>

            {/* Quick Search Bar */}
            <div className="mt-8 mx-auto max-w-xl flex items-center gap-2 rounded-xl bg-white p-2 shadow-xl">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-5 text-[#667085]" />
                <Input
                  type="text"
                  placeholder="Search job title, skill, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-11 border-0 bg-transparent pl-11 text-[15px] text-[#0B1F3A] focus-visible:ring-0 placeholder:text-[#667085]"
                />
              </div>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-[13px] text-[#667085] hover:text-[#0B1F3A] px-2 font-medium"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Jobs Section */}
      <section className="bg-[#F7F8FA] py-14 md:py-20 border-b border-[#E8ECF1]">
        <div className="container-x">
          {/* Industry Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-10">
            {INDUSTRIES.map((ind) => {
              const Icon = ind.icon;
              const isSelected = selectedIndustry === ind.id;
              return (
                <button
                  key={ind.id}
                  type="button"
                  onClick={() => setSelectedIndustry(ind.id)}
                  className={`inline-flex items-center gap-2 rounded-full px-4.5 py-2.5 text-[14px] font-semibold transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-[#0B1F3A] text-white shadow-md ring-2 ring-[#F47B20]/40"
                      : "bg-white text-[#344054] border border-[#E8ECF1] hover:border-[#F47B20]/60 hover:text-[#0B1F3A]"
                  }`}
                >
                  <Icon className={`size-4 ${isSelected ? "text-[#F47B20]" : "text-[#667085]"}`} />
                  <span>{ind.label}</span>
                </button>
              );
            })}
          </div>

          {/* Listings Results Count */}
          <div className="flex items-center justify-between border-b border-[#E8ECF1] pb-4 mb-8">
            <p className="text-[14.5px] font-medium text-[#667085]">
              Showing <span className="font-bold text-[#0B1F3A]">{filteredJobs.length}</span>{" "}
              available openings
            </p>
            {selectedIndustry !== "all" && (
              <button
                type="button"
                onClick={() => setSelectedIndustry("all")}
                className="text-[13.5px] font-semibold text-[#F47B20] hover:underline"
              >
                Reset filter
              </button>
            )}
          </div>

          {/* Job Listings Grid */}
          {filteredJobs.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="rounded-xl border border-[#E8ECF1] bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#F47B20]/40 flex flex-col justify-between"
                >
                  <div>
                    {/* Header Tags */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <span className="rounded-md bg-[#FFF1E5] px-2.5 py-1 text-[12px] font-bold text-[#F47B20] uppercase tracking-wider">
                        {job.industryLabel}
                      </span>
                      <span className="text-[12.5px] font-medium text-[#667085]">
                        {job.type}
                      </span>
                    </div>

                    {/* Job Title */}
                    <h3 className="text-[21px] font-bold text-[#0B1F3A] leading-snug">
                      <Link
                        to="/jobs"
                        search={{ jobId: job.id }}
                        className="hover:text-[#F47B20] transition-colors"
                      >
                        {job.title}
                      </Link>
                    </h3>

                    {/* Location & Experience */}
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-[13.5px] text-[#667085]">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="size-4 text-[#F47B20]" />
                        {job.location}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Briefcase className="size-4 text-[#F47B20]" />
                        {job.experience}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="mt-4 text-[14.5px] text-[#344054] leading-relaxed">
                      {job.description}
                    </p>

                    {/* Key Requirements */}
                    <div className="mt-4 pt-4 border-t border-[#E8ECF1] space-y-1.5">
                      {job.requirements.map((req, rIdx) => (
                        <div key={rIdx} className="flex items-start gap-2 text-[13px] text-[#344054]">
                          <CheckCircle2 className="size-3.5 text-[#F47B20] shrink-0 mt-0.5" />
                          <span>{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Apply Action */}
                  <div className="mt-7 pt-4 border-t border-[#E8ECF1] flex flex-wrap items-center justify-between gap-2.5">
                    <span className="text-[12.5px] text-[#667085]">
                      Fee: <strong className="text-[#0B1F3A]">100% Free</strong>
                    </span>
                    <Button
                      asChild
                      className="h-10 px-5 rounded-[8px] bg-[#F47B20] hover:bg-[#e06d17] text-white text-[14px] font-semibold transition-all hover:-translate-y-0.5 group cursor-pointer"
                    >
                      <Link
                        to="/contact"
                        search={{ candidate: true, subject: job.title }}
                        hash="contact-form"
                        className="inline-flex items-center gap-2"
                      >
                        <span>Apply for Position</span>
                        <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-[#E8ECF1] bg-white p-12 text-center max-w-lg mx-auto">
              <p className="text-[17px] font-semibold text-[#0B1F3A]">No positions match your criteria</p>
              <p className="mt-2 text-[14px] text-[#667085]">
                Try adjusting your search keywords or resetting the industry filter to see all openings.
              </p>
              <Button
                type="button"
                onClick={() => {
                  setSelectedIndustry("all");
                  setSearchQuery("");
                }}
                className="mt-5 bg-[#F47B20] hover:bg-[#e06d17] text-white font-semibold"
              >
                Reset All Filters
              </Button>
            </div>
          )}

          {/* General Resume Submission Banner */}
          <div className="mt-14 rounded-2xl bg-[#0B1F3A] p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-wider text-[#F47B20]">
                GENERAL TALENT NETWORK
              </p>
              <h3 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
                Don't see your exact role listed?
              </h3>
              <p className="mt-2 text-[15px] text-white/80 max-w-xl">
                Submit your resume directly to our candidate pool. When partner employers open new
                positions matching your background, our team will reach out directly.
              </p>
            </div>
            <Button
              asChild
              className="h-12 px-7 rounded-[8px] bg-[#F47B20] hover:bg-[#e06d17] text-white text-[15px] font-semibold shrink-0 shadow-lg cursor-pointer"
            >
              <Link
                to="/contact"
                search={{ candidate: true }}
                hash="contact-form"
                data-resume-contact
              >
                Submit Your Resume →
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer currentPath="/jobs" />
    </div>
  );
}
