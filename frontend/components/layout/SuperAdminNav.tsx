// ============================================================================
// File Name: SuperAdminNav.tsx
// Exact Location: frontend/components/layout/SuperAdminNav.tsx
// Description: Unified enterprise sub-navigation bar across all SuperAdmin modules
//              with real-time pending approvals badge and active tab highlighting.
// ============================================================================

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Building2,
  Layers,
  ShieldAlert,
  Settings,
  Database,
  ExternalLink,
} from "lucide-react";
import { api } from "@/lib/api";

export default function SuperAdminNav() {
  const pathname = usePathname();
  const [pendingCount, setPendingCount] = useState<number>(0);

  useEffect(() => {
    async function fetchPendingCount() {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) return;
        const res = await api.get("/approvals/pending");
        setPendingCount(res.data?.length || 0);
      } catch {
        // silent fallback
      }
    }
    fetchPendingCount();
  }, [pathname]);

  const navItems = [
    { href: "/superadmin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/superadmin/users", label: "Users & Roles", icon: Users },
    { href: "/superadmin/jobs", label: "Master Jobs", icon: Briefcase },
    { href: "/superadmin/companies", label: "Companies", icon: Building2 },
    { href: "/superadmin/categories", label: "Categories", icon: Layers },
    {
      href: "/superadmin/approvals",
      label: "Approvals",
      icon: ShieldAlert,
      badge: pendingCount > 0 ? pendingCount : null,
    },
    { href: "/superadmin/settings", label: "Settings", icon: Settings },
    { href: "/superadmin/database", label: "Database", icon: Database },
  ];

  return (
    <div className="bg-[#031130] border-b border-white/10 sticky top-20 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between overflow-x-auto scrollbar-none py-2 gap-2">
          <div className="flex items-center gap-1.5 md:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/superadmin/dashboard"
                  ? pathname === "/superadmin/dashboard"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 whitespace-nowrap ${
                    isActive
                      ? "bg-[#185DF1] text-white shadow-md shadow-blue-500/25"
                      : "text-blue-100/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon size={15} />
                  <span>{item.label}</span>
                  {item.badge !== null && item.badge !== undefined && (
                    <span className="bg-amber-400 text-slate-900 font-black text-[10px] px-1.5 py-0.2 rounded-full ml-0.5">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-3 pl-4 border-l border-white/10 text-xs">
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              SuperAdmin Live
            </span>
            <Link
              href="/"
              target="_blank"
              className="text-blue-200 hover:text-white inline-flex items-center gap-1 font-medium transition-colors"
            >
              <span>Public Portal</span>
              <ExternalLink size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
