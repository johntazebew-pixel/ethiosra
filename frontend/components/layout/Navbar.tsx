// ============================================================================
// File Name: Navbar.tsx
// Exact Location: frontend/components/layout/Navbar.tsx
// Description: Global navigation bar with interactive avatar dropdown, role badges,
//              responsive drawer, and real-time auth synchronization.
// ============================================================================

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Briefcase,
  User,
  Menu,
  X,
  LogOut,
  Shield,
  ShieldAlert,
  ChevronDown,
  Settings,
  PlusCircle,
  Sparkles,
  Users,
  Building2,
} from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Synchronize auth state on mount, pathname changes, and auth events
  useEffect(() => {
    const syncUser = () => {
      if (typeof window === "undefined") return;
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");
      if (storedUser && storedToken) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    syncUser();

    window.addEventListener("auth-change", syncUser);
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener("auth-change", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setDropdownOpen(false);
    setIsOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("auth-change"));
    }
    setUser(null);
    setDropdownOpen(false);
    setIsOpen(false);
    router.push("/login");
  };

  // Helper for initials
  const getInitials = (name?: string, email?: string) => {
    if (name && name.trim()) {
      const parts = name.trim().split(" ");
      if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
      return parts[0].substring(0, 2).toUpperCase();
    }
    if (!email) return "U";
    const namePart = email.split("@")[0];
    if (namePart.length <= 2) return namePart.toUpperCase();
    return (namePart[0] + namePart[1]).toUpperCase();
  };

  // Helper for role badge colors & labels
  const getRoleBadge = (role?: string) => {
    switch (role) {
      case "SUPERADMIN":
        return {
          label: "SuperAdmin",
          bg: "bg-purple-100 text-purple-700 border-purple-200",
          gradient: "from-purple-600 to-indigo-600",
        };
      case "ADMIN":
        return {
          label: "Admin",
          bg: "bg-blue-100 text-blue-700 border-blue-200",
          gradient: "from-blue-600 to-indigo-600",
        };
      default:
        return {
          label: "Job Seeker",
          bg: "bg-emerald-100 text-emerald-700 border-emerald-200",
          gradient: "from-emerald-500 to-teal-600",
        };
    }
  };

  const roleMeta = getRoleBadge(user?.role);

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200/80 sticky top-0 z-50 shadow-sm transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="bg-gradient-to-br from-[#185DF1] to-[#0d44b8] p-2.5 rounded-2xl text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
                <Briefcase size={22} />
              </div>
              <span className="text-2xl font-black tracking-tight text-[#031130]">
                Ethio<span className="text-[#185DF1]">Sira</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-7 font-semibold text-slate-600">
            <Link
              href="/"
              className={`transition-colors duration-150 py-1 ${
                pathname === "/"
                  ? "text-[#185DF1] font-bold border-b-2 border-[#185DF1]"
                  : "hover:text-[#185DF1]"
              }`}
            >
              Find Jobs
            </Link>
            <Link
              href="/companies"
              className={`transition-colors duration-150 py-1 ${
                pathname.startsWith("/companies")
                  ? "text-[#185DF1] font-bold border-b-2 border-[#185DF1]"
                  : "hover:text-[#185DF1]"
              }`}
            >
              Companies
            </Link>
            <Link
              href="/support"
              className={`transition-colors duration-150 py-1 ${
                pathname === "/support"
                  ? "text-[#185DF1] font-bold border-b-2 border-[#185DF1]"
                  : "hover:text-[#185DF1]"
              }`}
            >
              Support & Help
            </Link>

            {/* Quick Link to SuperAdmin/Admin Dashboard if user is staff */}
            {user?.role === "SUPERADMIN" && (
              <Link
                href="/superadmin/dashboard"
                className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                <ShieldAlert size={14} /> SuperAdmin Center
              </Link>
            )}
            {user?.role === "ADMIN" && (
              <Link
                href="/admin/dashboard"
                className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Shield size={14} /> Admin Portal
              </Link>
            )}
          </div>

          {/* Desktop Auth / User Profile */}
          <div className="hidden md:flex items-center gap-4">
            <div className="w-px h-8 bg-slate-200"></div>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                {/* User Profile Button with Circle Avatar */}
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 p-1.5 pr-3 rounded-full hover:bg-slate-100/80 border border-transparent hover:border-slate-200 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  aria-expanded={dropdownOpen}
                >
                  {/* Circle Avatar */}
                  <div className="relative">
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-br ${roleMeta.gradient} flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/10 border-2 border-white`}
                    >
                      {getInitials(user.fullName, user.email)}
                    </div>
                    {/* Active Online Indicator */}
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                  </div>

                  {/* Name and Role Label */}
                  <div className="text-left leading-tight hidden lg:block">
                    <p className="text-sm font-bold text-slate-800 truncate max-w-[140px]">
                      {user.fullName || user.email.split("@")[0]}
                    </p>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      {roleMeta.label}
                    </span>
                  </div>

                  {/* Dropdown Chevron */}
                  <ChevronDown
                    size={16}
                    className={`text-slate-400 group-hover:text-slate-700 transition-transform duration-200 ${
                      dropdownOpen ? "rotate-180 text-blue-600" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    {/* User Header */}
                    <div className="px-4 py-3 border-b border-slate-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className={`w-11 h-11 rounded-full bg-gradient-to-br ${roleMeta.gradient} flex items-center justify-center text-white font-bold text-base shadow-sm shrink-0`}
                        >
                          {getInitials(user.fullName, user.email)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">
                            {user.fullName || user.email.split("@")[0]}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${roleMeta.bg}`}
                      >
                        {roleMeta.label}
                      </span>
                    </div>

                    {/* Navigation Links inside Dropdown */}
                    <div className="py-2 text-sm text-slate-700">
                      {user.role === "SUPERADMIN" && (
                        <>
                          <Link
                            href="/superadmin/dashboard"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-purple-50 text-purple-700 font-bold transition-colors"
                          >
                            <ShieldAlert size={16} />
                            <span>Command Center</span>
                          </Link>
                          <Link
                            href="/superadmin/users"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-purple-50 text-slate-700 font-medium transition-colors"
                          >
                            <Users size={16} className="text-purple-600" />
                            <span>Manage Users & Roles</span>
                          </Link>
                          <Link
                            href="/superadmin/jobs"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-purple-50 text-slate-700 font-medium transition-colors"
                          >
                            <Briefcase size={16} className="text-purple-600" />
                            <span>Master Job Vacancies</span>
                          </Link>
                        </>
                      )}

                      {(user.role === "SUPERADMIN" || user.role === "ADMIN") && (
                        <>
                          <Link
                            href="/admin/dashboard"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 text-blue-700 font-semibold transition-colors"
                          >
                            <Shield size={16} />
                            <span>Admin Portal</span>
                          </Link>
                          <Link
                            href="/admin/jobs/create"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 font-medium transition-colors"
                          >
                            <PlusCircle size={16} className="text-blue-500" />
                            <span>Post a New Job</span>
                          </Link>
                          <Link
                            href="/admin/jobs/manage"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 font-medium transition-colors"
                          >
                            <Briefcase size={16} className="text-blue-500" />
                            <span>Manage Job Listings</span>
                          </Link>
                          <Link
                            href="/admin/companies/manage"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 font-medium transition-colors"
                          >
                            <Building2 size={16} className="text-blue-500" />
                            <span>Manage Companies</span>
                          </Link>
                        </>
                      )}

                      <Link
                        href="/profile/settings"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 font-medium transition-colors"
                      >
                        <Settings size={16} className="text-slate-400" />
                        <span>Account & Preferences</span>
                      </Link>
                    </div>

                    {/* Sign Out Action */}
                    <div className="pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* When Logged Out: Sign In & Register Buttons */
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="flex items-center gap-2 text-slate-700 font-bold hover:text-[#185DF1] px-4 py-2.5 rounded-xl transition-colors text-sm"
                >
                  <User size={18} />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-[#185DF1] to-[#0f4ed4] hover:from-[#031130] hover:to-[#031130] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md shadow-blue-500/20"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-700 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200 px-5 pt-4 pb-6 space-y-4 shadow-xl">
          {/* User info if logged in */}
          {user && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/70 mb-3">
              <div
                className={`w-11 h-11 rounded-full bg-gradient-to-br ${roleMeta.gradient} flex items-center justify-center text-white font-bold text-sm shrink-0`}
              >
                {getInitials(user.fullName, user.email)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">
                  {user.fullName || user.email.split("@")[0]}
                </p>
                <span
                  className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border mt-0.5 ${roleMeta.bg}`}
                >
                  {roleMeta.label}
                </span>
              </div>
            </div>
          )}

          {/* Nav Links */}
          <div className="space-y-1 font-semibold text-slate-700">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="block py-2.5 px-3 rounded-xl hover:bg-slate-100"
            >
              Find Jobs
            </Link>
            <Link
              href="/companies"
              onClick={() => setIsOpen(false)}
              className="block py-2.5 px-3 rounded-xl hover:bg-slate-100"
            >
              Companies
            </Link>
            <Link
              href="/support"
              onClick={() => setIsOpen(false)}
              className="block py-2.5 px-3 rounded-xl hover:bg-slate-100"
            >
              Support & Help
            </Link>

            {user?.role === "SUPERADMIN" && (
              <Link
                href="/superadmin/dashboard"
                onClick={() => setIsOpen(false)}
                className="block py-2.5 px-3 rounded-xl text-purple-700 bg-purple-50 font-bold"
              >
                SuperAdmin Dashboard
              </Link>
            )}

            {(user?.role === "ADMIN" || user?.role === "SUPERADMIN") && (
              <>
                <Link
                  href="/admin/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block py-2.5 px-3 rounded-xl text-blue-700 bg-blue-50 font-bold"
                >
                  Admin Portal
                </Link>
                <Link
                  href="/admin/jobs/manage"
                  onClick={() => setIsOpen(false)}
                  className="block py-2.5 px-3 rounded-xl hover:bg-slate-100"
                >
                  Manage Jobs
                </Link>
                <Link
                  href="/admin/companies/manage"
                  onClick={() => setIsOpen(false)}
                  className="block py-2.5 px-3 rounded-xl hover:bg-slate-100"
                >
                  Manage Companies
                </Link>
              </>
            )}

            {user && (
              <Link
                href="/profile/settings"
                onClick={() => setIsOpen(false)}
                className="block py-2.5 px-3 rounded-xl hover:bg-slate-100"
              >
                Account Settings
              </Link>
            )}
          </div>

          {/* Mobile Auth Actions */}
          <div className="pt-3 border-t border-slate-100">
            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 font-bold text-sm transition-colors"
              >
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-center font-bold text-slate-800 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-sm"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="text-center font-bold text-white py-3 bg-[#185DF1] hover:bg-[#031130] rounded-xl transition-colors text-sm shadow-md shadow-blue-500/20"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

        </div>
      )}
    </nav>
  );
}
