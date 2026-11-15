// ============================================================================
// File Name: page.tsx
// Exact Location: frontend/app/profile/settings/page.tsx
// Description: Comprehensive candidate profile & career settings (EthioJobs style)
//              with personal details, education, skills, CV links, and preferences.
// ============================================================================

"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  FileText,
  Globe,
  Send,
  Save,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Link as LinkIcon,
  Shield,
  Layers,
  Award,
} from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

const ETHIOPIAN_CITIES = [
  "Addis Ababa",
  "Hawassa",
  "Dire Dawa",
  "Bahir Dar",
  "Adama (Nazret)",
  "Mekelle",
  "Jimma",
  "Gondar",
  "Dessie",
  "Bishoftu",
  "Remote / Telecommute",
];

const EDUCATION_LEVELS = [
  "High School Diploma",
  "Technical / TVET Certificate",
  "Diploma (College)",
  "Bachelor's Degree (BA / BSc)",
  "Master's Degree (MA / MSc / MBA)",
  "Doctorate / PhD",
  "Other Professional Certification",
];

export default function ProfileSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [activeTab, setActiveTab] = useState<"personal" | "career" | "resume" | "preferences">("personal");

  // Form state
  const [userId, setUserId] = useState<string>("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("JOB_SEEKER");

  // Personal Info
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Addis Ababa");
  const [bio, setBio] = useState("");

  // Career & Professional Details
  const [currentTitle, setCurrentTitle] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState<number>(0);
  const [educationLevel, setEducationLevel] = useState("Bachelor's Degree (BA / BSc)");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [isAvailableForHire, setIsAvailableForHire] = useState(true);

  // Resume & Links
  const [resumeUrl, setResumeUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");

  // Preferences & Alerts
  const [preferredLanguage, setPreferredLanguage] = useState("EN");
  const [preferredTheme, setPreferredTheme] = useState("LIGHT");
  const [telegramChatId, setTelegramChatId] = useState("");
  const [emailNotificationEnabled, setEmailNotificationEnabled] = useState(true);
  const [telegramNotificationEnabled, setTelegramNotificationEnabled] = useState(false);

  // Calculate profile completion percentage
  const completionPercentage = useMemo(() => {
    let score = 0;
    if (fullName) score += 15;
    if (phone) score += 10;
    if (city) score += 10;
    if (currentTitle) score += 15;
    if (bio) score += 10;
    if (educationLevel) score += 10;
    if (fieldOfStudy) score += 10;
    if (skillsInput.trim().length > 0) score += 10;
    if (resumeUrl || linkedinUrl) score += 10;
    return Math.min(score, 100);
  }, [fullName, phone, city, currentTitle, bio, educationLevel, fieldOfStudy, skillsInput, resumeUrl, linkedinUrl]);

  // Load user data on mount
  useEffect(() => {
    async function loadUserData() {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (!storedUser || !token) {
        router.push("/login");
        return;
      }

      try {
        const parsed = JSON.parse(storedUser);
        setUserId(parsed.id);
        setEmail(parsed.email || "");
        setRole(parsed.role || "JOB_SEEKER");

        // Fetch fresh profile from backend
        const response = await api.get(`/users/${parsed.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data) {
          const u = response.data;
          setFullName(u.fullName || "");
          setPhone(u.phone || "");
          setCity(u.city || "Addis Ababa");
          setBio(u.bio || "");
          setCurrentTitle(u.currentTitle || "");
          setYearsOfExperience(u.yearsOfExperience ?? 0);
          setEducationLevel(u.educationLevel || "Bachelor's Degree (BA / BSc)");
          setFieldOfStudy(u.fieldOfStudy || "");
          setSkillsInput(Array.isArray(u.skills) ? u.skills.join(", ") : "");
          setIsAvailableForHire(u.isAvailableForHire ?? true);
          setResumeUrl(u.resumeUrl || "");
          setPortfolioUrl(u.portfolioUrl || "");
          setLinkedinUrl(u.linkedinUrl || "");
          setGithubUrl(u.githubUrl || "");
          setPreferredLanguage(u.preferredLanguage || "EN");
          setPreferredTheme(u.preferredTheme || "LIGHT");
          setTelegramChatId(u.telegramChatId || "");
          setEmailNotificationEnabled(u.emailNotificationEnabled ?? true);
          setTelegramNotificationEnabled(u.telegramNotificationEnabled ?? false);
        }
      } catch (err) {
        console.error("Could not fetch user profile details", err);
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, [router]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      setErrorMessage("You must be signed in to update your profile.");
      return;
    }

    setSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const token = localStorage.getItem("token");

      // Parse comma-separated skills
      const parsedSkills = skillsInput
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const payload = {
        fullName: fullName.trim() || null,
        phone: phone.trim() || null,
        city: city.trim() || null,
        bio: bio.trim() || null,
        currentTitle: currentTitle.trim() || null,
        yearsOfExperience: Number(yearsOfExperience) || 0,
        educationLevel,
        fieldOfStudy: fieldOfStudy.trim() || null,
        skills: parsedSkills,
        isAvailableForHire,
        resumeUrl: resumeUrl.trim() || null,
        portfolioUrl: portfolioUrl.trim() || null,
        linkedinUrl: linkedinUrl.trim() || null,
        githubUrl: githubUrl.trim() || null,
        preferredLanguage,
        preferredTheme,
        telegramChatId: telegramChatId.trim() || null,
        emailNotificationEnabled,
        telegramNotificationEnabled,
      };

      const response = await api.patch(`/users/${userId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
        window.dispatchEvent(new Event("auth-change"));
      }

      setSuccessMessage("Your profile and career details have been successfully updated!");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || "Failed to save profile. Please verify your details."
      );
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name?: string, em?: string) => {
    if (name && name.trim()) {
      const parts = name.trim().split(" ");
      if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
      return parts[0].substring(0, 2).toUpperCase();
    }
    if (em) return em.substring(0, 2).toUpperCase();
    return "US";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F7FE] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#185DF1] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Loading your profile & career details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F7FE] pb-24">
      {/* --- HERO HEADER --- */}
      <div className="bg-gradient-to-br from-[#031130] via-[#081d4a] to-[#185DF1] pt-12 pb-24 px-4 text-white">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-blue-200 hover:text-white font-medium mb-6 text-sm transition-colors"
          >
            <ArrowLeft size={16} /> Back to homepage
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              {/* Profile Avatar Circle */}
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-xl border-4 border-white/20">
                  {getInitials(fullName, email)}
                </div>
                {isAvailableForHire && (
                  <span
                    title="Available for immediate hiring"
                    className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-400 border-2 border-white rounded-full"
                  ></span>
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                    {fullName || email.split("@")[0]}
                  </h1>
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-white/20 border border-white/30 text-white">
                    {role}
                  </span>
                </div>
                <p className="text-blue-100/90 text-sm flex flex-wrap items-center gap-2">
                  <span>{currentTitle || "Career Candidate"}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin size={14} /> {city}
                  </span>
                </p>
              </div>
            </div>

            {/* Profile Completion Meter */}
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 min-w-[240px]">
              <div className="flex justify-between items-center text-xs font-bold mb-2">
                <span className="text-blue-100 flex items-center gap-1">
                  <Sparkles size={14} className="text-amber-300" /> Profile Strength
                </span>
                <span className="text-white">{completionPercentage}%</span>
              </div>
              <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-blue-200/70 mt-1.5">
                {completionPercentage === 100
                  ? "Your profile is 100% complete!"
                  : "Add more details to boost recruiter visibility."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT CONTAINER --- */}
      <div className="max-w-5xl mx-auto px-4 -mt-10">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200/80 bg-slate-50/70 px-4 md:px-8 overflow-x-auto gap-2 md:gap-4 pt-3">
            {[
              { id: "personal", label: "Personal Info", icon: User },
              { id: "career", label: "Career & Experience", icon: Briefcase },
              { id: "resume", label: "Resume & Links", icon: FileText },
              { id: "preferences", label: "Preferences & Alerts", icon: Globe },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-3 px-4 font-bold text-sm rounded-t-2xl border-b-2 transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? "bg-white text-[#185DF1] border-[#185DF1] shadow-sm -mb-[2px]"
                      : "text-slate-500 hover:text-slate-800 border-transparent"
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form Body */}
          <form onSubmit={handleSaveProfile} className="p-6 md:p-10 space-y-8">
            {successMessage && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-4 rounded-2xl text-sm font-medium flex items-center gap-3">
                <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-5 py-4 rounded-2xl text-sm font-medium">
                {errorMessage}
              </div>
            )}

            {/* TAB 1: PERSONAL INFORMATION */}
            {activeTab === "personal" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-[#031130] flex items-center gap-2 mb-1">
                    <User size={20} className="text-[#185DF1]" /> Personal Information
                  </h3>
                  <p className="text-slate-500 text-sm">
                    Basic contact information so employers can reach you.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User size={18} className="absolute left-4 top-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Abebe Bikila"
                        className="w-full bg-[#F3F7FE] border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#185DF1] focus:bg-white transition-all text-sm"
                      />
                    </div>
                  </div>

                  {/* Registered Email (Disabled) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Registered Email Address
                    </label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-3.5 text-slate-400" />
                      <input
                        type="email"
                        disabled
                        value={email}
                        className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-500 font-medium cursor-not-allowed text-sm"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-4 top-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +251 91 123 4567"
                        className="w-full bg-[#F3F7FE] border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#185DF1] focus:bg-white transition-all text-sm"
                      />
                    </div>
                  </div>

                  {/* City / Location */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Current City / Location
                    </label>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-4 top-3.5 text-slate-400" />
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-[#F3F7FE] border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#185DF1] focus:bg-white transition-all text-sm cursor-pointer"
                      >
                        {ETHIOPIAN_CITIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Professional Bio */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Professional Summary / Bio
                  </label>
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Briefly introduce yourself, your primary expertise, and the kind of roles you are seeking..."
                    className="w-full bg-[#F3F7FE] border border-slate-200 rounded-2xl p-4 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#185DF1] focus:bg-white transition-all text-sm leading-relaxed"
                  ></textarea>
                </div>
              </div>
            )}

            {/* TAB 2: CAREER & EXPERIENCE */}
            {activeTab === "career" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-[#031130] flex items-center gap-2 mb-1">
                    <Briefcase size={20} className="text-[#185DF1]" /> Career & Professional Experience
                  </h3>
                  <p className="text-slate-500 text-sm">
                    Highlight your experience, education, and skills.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Current Title */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Professional Headline / Current Title
                    </label>
                    <input
                      type="text"
                      value={currentTitle}
                      onChange={(e) => setCurrentTitle(e.target.value)}
                      placeholder="e.g. Senior Software Engineer or Financial Analyst"
                      className="w-full bg-[#F3F7FE] border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#185DF1] focus:bg-white transition-all text-sm"
                    />
                  </div>

                  {/* Years of Experience */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Years of Professional Experience
                    </label>
                    <select
                      value={yearsOfExperience}
                      onChange={(e) => setYearsOfExperience(Number(e.target.value))}
                      className="w-full bg-[#F3F7FE] border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#185DF1] focus:bg-white transition-all text-sm cursor-pointer"
                    >
                      <option value={0}>0 - Fresh Graduate / Entry Level</option>
                      <option value={1}>1 Year</option>
                      <option value={2}>2 Years</option>
                      <option value={3}>3 Years</option>
                      <option value={5}>5 Years</option>
                      <option value={8}>8+ Years</option>
                      <option value={12}>10+ Years (Senior / Executive)</option>
                    </select>
                  </div>

                  {/* Education Level */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Highest Level of Education
                    </label>
                    <select
                      value={educationLevel}
                      onChange={(e) => setEducationLevel(e.target.value)}
                      className="w-full bg-[#F3F7FE] border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#185DF1] focus:bg-white transition-all text-sm cursor-pointer"
                    >
                      {EDUCATION_LEVELS.map((ed) => (
                        <option key={ed} value={ed}>
                          {ed}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Field of Study */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Field of Study / Major
                    </label>
                    <input
                      type="text"
                      value={fieldOfStudy}
                      onChange={(e) => setFieldOfStudy(e.target.value)}
                      placeholder="e.g. Computer Science, Accounting, Economics"
                      className="w-full bg-[#F3F7FE] border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#185DF1] focus:bg-white transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Key Skills */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Key Skills (Separate by commas)
                  </label>
                  <input
                    type="text"
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                    placeholder="e.g. React, TypeScript, Financial Analysis, Project Management, Python, SQL"
                    className="w-full bg-[#F3F7FE] border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#185DF1] focus:bg-white transition-all text-sm"
                  />
                  {skillsInput.trim() && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {skillsInput
                        .split(",")
                        .map((s) => s.trim())
                        .filter((s) => s.length > 0)
                        .map((skill, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 bg-blue-50 text-[#185DF1] border border-blue-200 px-3 py-1 rounded-lg text-xs font-bold"
                          >
                            <Award size={12} />
                            {skill}
                          </span>
                        ))}
                    </div>
                  )}
                </div>

                {/* Job Search Status Toggle */}
                <div className="p-5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-emerald-950 text-sm">Available for Immediate Hire</p>
                    <p className="text-emerald-800/80 text-xs mt-0.5">
                      Show employers that you are actively exploring and open to interview offers.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={isAvailableForHire}
                    onChange={(e) => setIsAvailableForHire(e.target.checked)}
                    className="w-5 h-5 accent-[#185DF1] rounded cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: RESUME & EXTERNAL LINKS */}
            {activeTab === "resume" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-[#031130] flex items-center gap-2 mb-1">
                    <FileText size={20} className="text-[#185DF1]" /> Resume & Portfolio Links
                  </h3>
                  <p className="text-slate-500 text-sm">
                    Provide links to your CV, GitHub, or LinkedIn so employers can evaluate your work.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Resume / CV Link */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      CV / Resume Document URL (Google Drive, Dropbox, or Portfolio)
                    </label>
                    <div className="relative">
                      <LinkIcon size={18} className="absolute left-4 top-3.5 text-slate-400" />
                      <input
                        type="url"
                        value={resumeUrl}
                        onChange={(e) => setResumeUrl(e.target.value)}
                        placeholder="https://drive.google.com/file/d/.../view"
                        className="w-full bg-[#F3F7FE] border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#185DF1] focus:bg-white transition-all text-sm"
                      />
                    </div>
                  </div>

                  {/* LinkedIn Profile */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      LinkedIn Profile URL
                    </label>
                    <div className="relative">
                      <svg className="absolute left-4 top-3.5 text-slate-400 w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                      <input
                        type="url"
                        value={linkedinUrl}
                        onChange={(e) => setLinkedinUrl(e.target.value)}
                        placeholder="https://linkedin.com/in/yourusername"
                        className="w-full bg-[#F3F7FE] border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#185DF1] focus:bg-white transition-all text-sm"
                      />
                    </div>
                  </div>

                  {/* Portfolio / Personal Website */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Personal Portfolio / Website
                    </label>
                    <div className="relative">
                      <Globe size={18} className="absolute left-4 top-3.5 text-slate-400" />
                      <input
                        type="url"
                        value={portfolioUrl}
                        onChange={(e) => setPortfolioUrl(e.target.value)}
                        placeholder="https://yourportfolio.com"
                        className="w-full bg-[#F3F7FE] border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#185DF1] focus:bg-white transition-all text-sm"
                      />
                    </div>
                  </div>

                  {/* GitHub Profile */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      GitHub Profile URL (For Technical Roles)
                    </label>
                    <div className="relative">
                      <svg className="absolute left-4 top-3.5 text-slate-400 w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                      </svg>
                      <input
                        type="url"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        placeholder="https://github.com/yourusername"
                        className="w-full bg-[#F3F7FE] border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#185DF1] focus:bg-white transition-all text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: PREFERENCES & ALERTS */}
            {activeTab === "preferences" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-[#031130] flex items-center gap-2 mb-1">
                    <Globe size={20} className="text-[#185DF1]" /> Preferences & Alerts
                  </h3>
                  <p className="text-slate-500 text-sm">
                    Customize your language, notifications, and Telegram job alerts.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Language */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Preferred Language (ቋንቋ)
                    </label>
                    <select
                      value={preferredLanguage}
                      onChange={(e) => setPreferredLanguage(e.target.value)}
                      className="w-full bg-[#F3F7FE] border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#185DF1] focus:bg-white transition-all text-sm cursor-pointer"
                    >
                      <option value="EN">English (EN)</option>
                      <option value="AM">አማርኛ - Amharic (AM)</option>
                    </select>
                  </div>

                  {/* Theme */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Website Theme Mode
                    </label>
                    <select
                      value={preferredTheme}
                      onChange={(e) => setPreferredTheme(e.target.value)}
                      className="w-full bg-[#F3F7FE] border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#185DF1] focus:bg-white transition-all text-sm cursor-pointer"
                    >
                      <option value="LIGHT">Light Theme</option>
                      <option value="DARK">Dark Theme</option>
                    </select>
                  </div>
                </div>

                {/* Telegram Alerts */}
                <div className="p-6 bg-blue-50/60 border border-blue-200/80 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-[#185DF1] font-bold text-sm">
                    <Send size={18} />
                    <span>Telegram Job Alerts Integration</span>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Enter your Telegram Chat ID to receive instant alerts when new opportunities in your specialty are published.
                  </p>
                  <input
                    type="text"
                    value={telegramChatId}
                    onChange={(e) => setTelegramChatId(e.target.value)}
                    placeholder="e.g. 123456789 (From @userinfobot)"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#185DF1]"
                  />
                </div>

                {/* Notification Toggles */}
                <div className="space-y-3 pt-2">
                  <label className="flex items-center gap-3 p-3 bg-[#F3F7FE] rounded-xl border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailNotificationEnabled}
                      onChange={(e) => setEmailNotificationEnabled(e.target.checked)}
                      className="w-4 h-4 accent-[#185DF1] rounded cursor-pointer"
                    />
                    <span className="text-sm font-semibold text-slate-700">
                      Receive weekly email digest of recommended jobs
                    </span>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-[#F3F7FE] rounded-xl border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={telegramNotificationEnabled}
                      onChange={(e) => setTelegramNotificationEnabled(e.target.checked)}
                      className="w-4 h-4 accent-[#185DF1] rounded cursor-pointer"
                    />
                    <span className="text-sm font-semibold text-slate-700">
                      Enable real-time push alerts to my Telegram account
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Bottom Form Actions */}
            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-400">
                All changes are saved directly to your live candidate profile.
              </p>

              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto bg-[#185DF1] hover:bg-[#031130] text-white font-bold py-3.5 px-8 rounded-xl transition-all duration-200 shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                <Save size={18} />
                <span>{saving ? "Saving Profile..." : "Save Profile Changes"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}