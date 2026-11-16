// ============================================================================
// File Name: page.tsx
// Exact Location: frontend/app/superadmin/settings/page.tsx
// Description: Master System Settings for SuperAdmin with branding, localization,
//              announcements, and Telegram bot alert configuration.
// ============================================================================

"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  Globe,
  Shield,
  Save,
  ArrowLeft,
  CheckCircle2,
  Image as ImageIcon,
  Send,
  Bell,
  Megaphone,
} from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import SuperAdminNav from "@/components/layout/SuperAdminNav";
import CompanyLogoUploader from "@/components/ui/CompanyLogoUploader";

export default function SuperAdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [systemLogoUrl, setSystemLogoUrl] = useState("");
  const [defaultLanguage, setDefaultLanguage] = useState("EN");
  const [heroBannerImages, setHeroBannerImages] = useState<string>("");
  const [telegramNotificationEnabled, setTelegramNotificationEnabled] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/settings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data) {
          setSystemLogoUrl(response.data.systemLogoUrl || "");
          setDefaultLanguage(response.data.defaultLanguage || "EN");
          if (Array.isArray(response.data.heroBannerImages)) {
            setHeroBannerImages(response.data.heroBannerImages.join(", "));
          }
        }
      } catch (err) {
        console.error("Failed to fetch system settings", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const token = localStorage.getItem("token");
      const banners = heroBannerImages
        .split(",")
        .map((b) => b.trim())
        .filter((b) => b.length > 0);

      await api.post(
        "/settings",
        {
          systemLogoUrl: systemLogoUrl.trim() || null,
          defaultLanguage,
          heroBannerImages: banners,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("branding-change", {
            detail: systemLogoUrl.trim(),
          })
        );
      }
      setSuccessMessage("Global platform settings successfully saved and applied.");
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || "Failed to update settings. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] pb-24">
      <SuperAdminNav />

      {/* --- HEADER --- */}
      <div className="bg-gradient-to-br from-[#111111] via-[#333333] to-[#111111] pt-10 pb-20 px-4 text-white">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/superadmin/dashboard"
            className="inline-flex items-center gap-1.5 text-neutral-200 hover:text-white font-medium mb-4 text-xs transition-colors"
          >
            <ArrowLeft size={14} /> Back to command center
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20 shadow-lg shrink-0">
              <Settings size={28} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Global Platform Settings
              </h1>
              <p className="text-neutral-100/80 text-xs md:text-sm mt-0.5">
                Configure platform branding, default localization, and external broadcast channels.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- CONTENT CONTAINER --- */}
      <div className="max-w-4xl mx-auto px-4 -mt-10">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 md:p-10">
          {successMessage && (
            <div className="mb-8 bg-neutral-50 border border-neutral-200 text-neutral-700 px-5 py-4 rounded-2xl text-sm font-medium flex items-center gap-3">
              <CheckCircle2 size={20} className="text-neutral-500 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="mb-8 bg-red-50 border border-red-200 text-red-600 px-5 py-4 rounded-2xl text-sm font-medium">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-8">
            {/* Branding Section */}
            <div>
              <h3 className="text-lg font-bold text-[#111111] mb-4 flex items-center gap-2">
                <ImageIcon size={18} className="text-[#111111]" />
                <span>Platform Branding & Visual Identity</span>
              </h3>
              <div className="space-y-4">
                <div className="bg-[#F8FAFC] border border-slate-200/90 rounded-2xl p-4 shadow-sm">
                  <CompanyLogoUploader
                    value={systemLogoUrl}
                    onChange={(url) => setSystemLogoUrl(url)}
                    companyName="EthioSira Platform"
                    label="Platform Logo & Branding Badge"
                    description="Upload your site logo from your device (PNG, JPG, SVG, WEBP up to 10MB) or paste a web URL link."
                  />
                  <p className="text-[11px] text-slate-400 mt-2">
                    This logo appears in the top global navigation header, site favicon, and email notifications.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Hero Banner Images (Comma separated URLs)
                  </label>
                  <input
                    type="text"
                    value={heroBannerImages}
                    onChange={(e) => setHeroBannerImages(e.target.value)}
                    placeholder="https://example.com/hero1.jpg, https://example.com/hero2.jpg"
                    className="w-full px-4 py-2.5 bg-[#F7F7F7] border border-slate-200 rounded-xl text-slate-900 font-medium text-xs focus:outline-none focus:border-[#111111]"
                  />
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Localization Section */}
            <div>
              <h3 className="text-lg font-bold text-[#111111] mb-4 flex items-center gap-2">
                <Globe size={18} className="text-[#111111]" />
                <span>Localization & Language Defaults</span>
              </h3>
              <div className="max-w-md">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Default Platform Language
                </label>
                <select
                  value={defaultLanguage}
                  onChange={(e) => setDefaultLanguage(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#F7F7F7] border border-slate-200 rounded-xl text-slate-900 font-medium text-xs focus:outline-none focus:border-[#111111] cursor-pointer"
                >
                  <option value="EN">English (EN)</option>
                  <option value="AM">አማርኛ - Amharic (AM)</option>
                </select>
                <p className="text-[11px] text-slate-400 mt-1">
                  Default language loaded for unauthenticated candidates.
                </p>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Telegram Channel Integration */}
            <div>
              <h3 className="text-lg font-bold text-[#111111] mb-4 flex items-center gap-2">
                <Send size={18} className="text-[#111111]" />
                <span>Telegram Bot & Push Broadcast</span>
              </h3>
              <div className="p-4 bg-neutral-50/70 border border-neutral-200/80 rounded-2xl flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-slate-900 text-xs">
                    Broadcast Newly Published Vacancies
                  </p>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Automatically post active opportunities to the EthioSra Telegram Community Channel.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={telegramNotificationEnabled}
                  onChange={(e) => setTelegramNotificationEnabled(e.target.checked)}
                  className="w-4 h-4 accent-[#111111] rounded cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="bg-[#111111] hover:bg-[#111111] text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md shadow-neutral-500/20 flex items-center gap-2 text-xs disabled:opacity-50"
              >
                <Save size={16} />
                <span>{saving ? "Saving settings..." : "Save Platform Configurations"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}