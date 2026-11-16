"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Briefcase,
  Building2,
  Calculator,
  Calendar,
  Code,
  HeartPulse,
  MapPin,
  Search,
  Sparkles,
  TrendingUp,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import CompanyAvatar from "@/components/ui/CompanyAvatar";
import type { Category, Company, Job } from "@/types";

const categoryIcons = [
  Code,
  Calculator,
  HeartPulse,
  Briefcase,
  TrendingUp,
  Building2,
];

type HomeCategory = Pick<Category, "id" | "name"> & { type?: string };
type HomeJob = Pick<Job, "id" | "title" | "description"> &
  Partial<Pick<Job, "location" | "workplaceType" | "isSalaryNegotiable">> & {
    company?: Pick<Company, "name" | "logoUrl">;
    categories?: { category?: Pick<Category, "id" | "name"> }[];
    deadlineDate?: string;
  };

export default function Home() {
  const [jobs, setJobs] = useState<HomeJob[]>([]);
  const [categories, setCategories] = useState<HomeCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [jobsResponse, categoriesResponse] = await Promise.all([
          api.get("/jobs"),
          api.get("/categories"),
        ]);
        setJobs(jobsResponse.data || []);
        setCategories(categoriesResponse.data || []);
      } catch (error) {
        console.error("Failed to fetch jobs or categories from API:", error);
        setJobs([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        job.title?.toLowerCase().includes(query) ||
        job.company?.name?.toLowerCase().includes(query) ||
        job.description?.toLowerCase().includes(query);
      const matchesCategory =
        !selectedCategory ||
        job.categories?.some(
          (category) =>
            category.category?.name?.toLowerCase() ===
            selectedCategory.toLowerCase(),
        );
      const matchesLocation =
        !searchLocation ||
        job.location?.toLowerCase() === searchLocation.toLowerCase();

      return matchesSearch && matchesCategory && matchesLocation;
    });
  }, [jobs, searchQuery, searchLocation, selectedCategory]);

  const locations = useMemo(
    () =>
      Array.from(
        new Set(
          jobs
            .map((job) => job.location?.trim())
            .filter((location): location is string => Boolean(location)),
        ),
      ).sort(),
    [jobs],
  );

  const scrollToListings = () => {
    document
      .getElementById("job-listings")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSearchLocation("");
    setSelectedCategory(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-12 pt-6 sm:px-6 md:grid-cols-[1.05fr_0.95fr] md:items-center md:pb-16 md:pt-8 lg:px-8">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-sm font-medium text-neutral-700">
            <span className="h-2 w-2 rounded-full bg-neutral-900" />
            Find your next opportunity
          </div>
          <h1 className="max-w-3xl text-4xl font-medium leading-[1.08] tracking-[-0.045em] text-neutral-950 sm:text-5xl lg:text-6xl">
            Get hired faster
            <br />
            and smarter.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-neutral-500 sm:text-lg">
            Browse, search, and apply for trusted jobs across Ethiopia.
          </p>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              scrollToListings();
            }}
            className="mt-7 grid gap-2 rounded-[1.35rem] border border-neutral-200 bg-white p-2 shadow-[0_18px_55px_-35px_rgba(0,0,0,0.35)] sm:grid-cols-[1fr_0.8fr_auto] sm:items-center"
          >
            <div className="flex min-w-0 items-center gap-3 rounded-xl px-3">
              <Search size={18} className="shrink-0 text-neutral-500" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Job title or keyword"
                aria-label="Search jobs"
                className="h-12 w-full min-w-0 bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="rounded-full p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <label className="flex min-w-0 items-center gap-3 rounded-xl border-t border-neutral-100 px-3 sm:border-l sm:border-t-0">
              <MapPin size={18} className="shrink-0 text-neutral-500" />
              <select
                value={searchLocation}
                onChange={(event) => setSearchLocation(event.target.value)}
                aria-label="Filter by location"
                className="h-12 w-full min-w-0 appearance-none bg-transparent text-sm text-neutral-800 outline-none"
              >
                <option value="">All locations</option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-neutral-950 px-5 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 focus-visible:outline-offset-2"
            >
              Search jobs <Search size={16} />
            </button>
          </form>

          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-neutral-500">
            <span>{jobs.length} opportunities</span>
            <span>{categories.length} career categories</span>
            <span>Made for Ethiopia</span>
          </div>
        </div>

        <div className="relative hidden min-h-[390px] items-center justify-center overflow-hidden rounded-[2rem] bg-neutral-50 p-8 md:flex">
          <div className="absolute right-[12%] top-8 h-[310px] w-[250px] rounded-[48%] bg-neutral-200/80" />
          <div className="absolute right-[18%] top-14 h-[295px] w-[225px] rounded-[2rem] border border-neutral-200 bg-white p-4 shadow-[0_24px_70px_-38px_rgba(0,0,0,0.3)]">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-300" />
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-300" />
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-300" />
              </div>
              <span className="text-[10px] font-semibold text-neutral-400">ETHIOSIRA</span>
            </div>
            <div className="mt-5 rounded-2xl bg-neutral-50 px-4 py-5 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-neutral-200 text-neutral-700">
                <UserRound size={36} strokeWidth={1.5} />
              </div>
              <p className="mt-3 text-sm font-semibold text-neutral-900">Your next role</p>
              <p className="mt-1 text-xs text-neutral-500">is closer than you think</p>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-xl border border-neutral-200 px-3 py-2.5">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-white">
                  <Briefcase size={14} />
                </span>
                <span className="text-xs font-medium text-neutral-700">Explore jobs</span>
              </div>
              <ArrowRight size={15} className="text-neutral-500" />
            </div>
          </div>
          <div className="absolute left-5 top-[28%] w-48 rounded-2xl border border-neutral-200 bg-white p-4 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.35)]">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700">
                <Briefcase size={17} />
              </span>
              <div>
                <p className="text-xs font-semibold text-neutral-900">For your career</p>
                <p className="text-[11px] text-neutral-500">Opportunities that fit</p>
              </div>
            </div>
            <div className="mt-4 h-1.5 rounded-full bg-neutral-100">
              <div className="h-1.5 w-3/4 rounded-full bg-neutral-800" />
            </div>
          </div>
          <div className="absolute bottom-7 left-6 flex items-center gap-3 rounded-full border border-neutral-200 bg-white px-4 py-2.5 shadow-sm">
            <Sparkles size={16} className="text-neutral-700" />
            <span className="text-xs font-semibold text-neutral-700">
              {jobs.length} open roles to explore
            </span>
          </div>
        </div>
      </section>

      <section className="border-y border-[#E5E5E5] bg-white/70">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-800">
                Browse by interest
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#111111] sm:text-3xl">
                Explore career categories
              </h2>
            </div>
            {selectedCategory && (
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className="inline-flex items-center gap-1.5 self-start rounded-full border border-neutral-900/10 px-3 py-1.5 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50 sm:self-auto"
              >
                <X size={14} /> Clear {selectedCategory}
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {loading ? (
              <div className="col-span-full rounded-2xl border border-dashed border-slate-300 py-10 text-center text-sm text-slate-500">
                Loading categories…
              </div>
            ) : categories.length ? (
              categories.slice(0, 8).map((category, index) => {
                const Icon = categoryIcons[index % categoryIcons.length];
                const isSelected =
                  selectedCategory?.toLowerCase() ===
                  category.name?.toLowerCase();

                return (
                  <button
                    key={category.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() =>
                      setSelectedCategory(isSelected ? null : category.name)
                    }
                    className={`group flex min-h-32 flex-col items-start justify-between rounded-2xl border p-4 text-left transition-colors sm:p-5 ${
                      isSelected
                        ? "border-neutral-800 bg-neutral-800 text-white"
                        : "border-[#E5E5E5] bg-white hover:border-neutral-700/40 hover:bg-neutral-50/50"
                    }`}
                  >
                    <span
                      className={`mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl ${
                        isSelected
                          ? "bg-white/15 text-white"
                          : "bg-[#F4F4F4] text-neutral-800"
                      }`}
                    >
                      <Icon size={19} />
                    </span>
                    <span className="font-semibold leading-snug">
                      {category.name}
                    </span>
                    <span
                      className={`mt-1 text-xs ${
                        isSelected ? "text-neutral-50/75" : "text-slate-500"
                      }`}
                    >
                      {category.type === "DEPARTMENT"
                        ? "Department"
                        : "Specialty"}
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="col-span-full rounded-2xl border border-dashed border-slate-300 py-10 text-center text-sm text-slate-500">
                Categories will appear here as they become available.
              </div>
            )}
          </div>
        </div>
      </section>

      <section
        id="job-listings"
        className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8"
      >
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-800">
              The latest opportunities
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#111111] sm:text-3xl">
              {selectedCategory ? `${selectedCategory} jobs` : "Open positions"}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {filteredJobs.length}{" "}
              {filteredJobs.length === 1 ? "role" : "roles"}
              {searchQuery ? ` matching “${searchQuery}”` : " to explore"}
            </p>
          </div>
          {(searchQuery || selectedCategory) && (
            <button
              type="button"
              onClick={resetFilters}
              className="self-start text-sm font-semibold text-neutral-800 hover:text-neutral-950 sm:self-auto"
            >
              Reset filters
            </button>
          )}
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="rounded-2xl border border-[#E5E5E5] bg-white py-14 text-center text-sm text-slate-500">
              Loading job listings…
            </div>
          ) : filteredJobs.length ? (
            filteredJobs.map((job) => {
              const categories = job.categories ?? [];

              return (
                <article
                  key={job.id}
                  className="rounded-2xl border border-[#E5E5E5] bg-white p-5 transition-shadow hover:shadow-[0_12px_36px_-24px_rgba(0,0,0,0.4)] sm:p-6"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                    <div className="flex min-w-0 flex-1 items-start gap-4">
                      <CompanyAvatar
                        name={job.company?.name}
                        logoUrl={job.company?.logoUrl}
                        fallback="Co"
                        className="h-14 w-14 shrink-0 rounded-xl border border-neutral-900/10 bg-neutral-50 text-lg text-neutral-800"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold leading-snug text-[#111111]">
                            {job.title}
                          </h3>
                          {job.workplaceType && (
                            <span className="rounded-full bg-neutral-50 px-2.5 py-1 text-[11px] font-medium text-neutral-800">
                              {job.workplaceType}
                            </span>
                          )}
                        </div>
                        <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-600">
                          <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
                            <Building2 size={15} className="text-neutral-800" />
                            {job.company?.name || "Independent employer"}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <MapPin size={14} />
                            {job.location || "Addis Ababa"}
                          </span>
                        </p>
                        {categories.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {categories.slice(0, 3).map((item, index) => (
                              <span
                                key={item.category?.id || index}
                                className="rounded-md bg-[#F5F5F5] px-2 py-1 text-xs text-slate-600"
                              >
                                {item.category?.name}
                              </span>
                            ))}
                            {categories.length > 3 && (
                              <span className="px-1 py-1 text-xs text-slate-500">
                                +{categories.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                        {job.description && (
                          <p className="mt-3 line-clamp-2 max-w-3xl text-sm leading-6 text-slate-500">
                            {job.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-4 sm:w-48 sm:flex-col sm:items-end sm:justify-center sm:border-0 sm:pt-0">
                      <div className="text-right">
                        {job.deadlineDate && (
                          <p className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                            <Calendar size={13} />
                            Closes{" "}
                            {new Date(job.deadlineDate).toLocaleDateString()}
                          </p>
                        )}
                        {job.isSalaryNegotiable && (
                          <p className="mt-1 text-xs font-medium text-neutral-800">
                            Salary negotiable
                          </p>
                        )}
                      </div>
                      <Link
                        href={`/jobs/${job.id}`}
                        className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#F4F4F4] px-4 py-2.5 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-800 hover:text-white"
                      >
                        View role <ArrowRight size={15} />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-14 text-center">
              <Briefcase size={28} className="mx-auto text-slate-400" />
              <h3 className="mt-4 font-semibold text-[#111111]">
                No matching roles yet
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Try another search or clear your filters to see all available
                opportunities.
              </p>
              {(searchQuery || selectedCategory) && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-5 rounded-lg bg-[#111111] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2D2D2D]"
                >
                  Show all jobs
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
