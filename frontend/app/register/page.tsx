// ============================================================================
// File Name: page.tsx
// Exact Location: frontend/app/register/page.tsx
// Description: The client-side registration page communicating with the NestJS Auth backend.
// ============================================================================

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, Briefcase, Globe } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("EN");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await api.post("/auth/register", {
        email,
        password,
        preferredLanguage,
      });

      // Save token securely in localStorage upon successful registration
      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        window.dispatchEvent(new Event("auth-change"));
      }

      const role = response.data?.user?.role;
      if (role === "SUPERADMIN") {
        router.push("/superadmin/dashboard");
      } else if (role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || "Registration failed. Please check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F7FE] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-6">
          <div className="bg-[#185DF1] p-2.5 rounded-2xl text-white shadow-md">
            <Briefcase size={28} />
          </div>
          <span className="text-3xl font-extrabold tracking-tight text-[#031130]">
            Ethio<span className="text-[#185DF1]">Sira</span>
          </span>
        </Link>
        <h2 className="text-3xl font-extrabold text-[#031130] tracking-tight">
          Create an account
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Join EthioSira to apply for top jobs and manage your career
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl border border-slate-200 sm:px-10">
          
          {errorMessage && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
              {errorMessage}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleRegister}>
            <div>
              <label className="block text-sm font-bold text-[#031130] mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-[#F3F7FE] border border-slate-200 rounded-xl text-[#031130] font-medium focus:outline-none focus:border-[#185DF1] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#031130] mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-11 pr-4 py-3 bg-[#F3F7FE] border border-slate-200 rounded-xl text-[#031130] font-medium focus:outline-none focus:border-[#185DF1] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#031130] mb-2">
                Preferred Language
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Globe size={18} />
                </div>
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-[#F3F7FE] border border-slate-200 rounded-xl text-[#031130] font-medium focus:outline-none focus:border-[#185DF1] transition-colors cursor-pointer appearance-none"
                >
                  <option value="EN">English</option>
                  <option value="AM">አማርኛ (Amharic)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#185DF1] hover:bg-[#031130] text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Sign Up"} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-[#185DF1] hover:underline">
                Sign in
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}