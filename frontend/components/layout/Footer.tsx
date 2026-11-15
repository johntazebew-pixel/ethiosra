// ============================================================================
// File Name: Footer.tsx
// Exact Location: frontend/components/layout/Footer.tsx
// Description: Global footer component with platform branding, navigation, and contact.
// ============================================================================

import Link from "next/link";
import { Briefcase, Send } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#031130] text-white pt-10 pb-6 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-[#185DF1] p-2.5 rounded-2xl text-white shadow-md">
                <Briefcase size={22} />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                Ethio<span className="text-[#185DF1]">Sira</span>
              </span>
            </div>
            <p className="text-blue-100/70 text-sm leading-relaxed mb-6">
              Connecting professional talent across Ethiopia with trusted employers and career opportunities.
            </p>
            <a 
              href="https://t.me/EthioSiraJobs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#185DF1]/20 hover:bg-[#185DF1] text-blue-200 hover:text-white px-4 py-2.5 rounded-xl border border-[#185DF1]/30 transition-all text-sm font-bold"
            >
              <Send size={16} /> Join Telegram Bot
            </a>
          </div>

          <div>
            <h4 className="font-bold text-white text-base mb-3 uppercase tracking-wider text-xs text-blue-400">Platform</h4>
            <ul className="space-y-2 text-sm text-blue-100/70">
              <li><Link href="/" className="hover:text-white transition-colors">Browse Jobs</Link></li>
              <li><Link href="/companies" className="hover:text-white transition-colors">Hiring Companies</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">Create Account</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-base mb-3 uppercase tracking-wider text-xs text-blue-400">Support</h4>
            <ul className="space-y-2 text-sm text-blue-100/70">
              <li><Link href="/support" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/support" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/support" className="hover:text-white transition-colors">Telegram Alerts Guide</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-base mb-3 uppercase tracking-wider text-xs text-blue-400">Headquarters</h4>
            <p className="text-sm text-blue-100/70 leading-relaxed">
              Bole Road, Around Edna Mall<br />
              Addis Ababa, Ethiopia<br />
              support@ethiosira.com
            </p>
          </div>

        </div>

        <hr className="border-slate-800 my-6" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-blue-100/50">
          <p suppressHydrationWarning>© 2026 EthioSira. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/support" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/support" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
