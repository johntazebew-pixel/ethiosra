// ============================================================================
// File Name: page.tsx
// Exact Location: frontend/app/support/page.tsx
// Description: The Contact and Support Help Center page.
// ============================================================================

"use client";

import { useState } from "react";
import { HelpCircle, Mail, Send, MessageSquare, CheckCircle2, Phone, MapPin } from "lucide-react";

export default function SupportPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F3F7FE] pb-24">
      
      {/* --- HEADER --- */}
      <div className="bg-gradient-to-br from-[#031130] to-[#185DF1] pt-16 pb-24 px-4 text-center text-white">
        <div className="max-w-3xl mx-auto">
          <div className="w-16 h-16 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/20 shadow-lg">
            <HelpCircle size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Support & Contact Center</h1>
          <p className="text-blue-100/80 text-lg">We are here to help you navigate your career and platform inquiries.</p>
        </div>
      </div>

      {/* --- CONTENT CONTAINER --- */}
      <div className="max-w-6xl mx-auto px-4 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Info Cards */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
              <div className="w-12 h-12 bg-[#F3F7FE] text-[#185DF1] rounded-2xl flex items-center justify-center mb-4">
                <Mail size={22} />
              </div>
              <h3 className="font-bold text-[#031130] text-lg mb-1">Email Support</h3>
              <p className="text-slate-500 text-sm mb-3">Our team replies within 24 hours.</p>
              <span className="font-bold text-[#185DF1]">support@ethiosira.com</span>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
              <div className="w-12 h-12 bg-[#F3F7FE] text-[#185DF1] rounded-2xl flex items-center justify-center mb-4">
                <Send size={22} />
              </div>
              <h3 className="font-bold text-[#031130] text-lg mb-1">Telegram Bot</h3>
              <p className="text-slate-500 text-sm mb-3">Get automated instant alerts.</p>
              <a href="https://t.me/EthioSiraJobs" target="_blank" rel="noopener noreferrer" className="font-bold text-[#185DF1] hover:underline">
                @EthioSiraJobs
              </a>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
              <div className="w-12 h-12 bg-[#F3F7FE] text-[#185DF1] rounded-2xl flex items-center justify-center mb-4">
                <MapPin size={22} />
              </div>
              <h3 className="font-bold text-[#031130] text-lg mb-1">Office Location</h3>
              <p className="text-slate-500 text-sm">Bole Road, Around Edna Mall<br />Addis Ababa, Ethiopia</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-slate-200 p-8 md:p-12">
            <h2 className="text-2xl font-bold text-[#031130] mb-2">Send Us a Message</h2>
            <p className="text-slate-500 text-sm mb-8">Fill out the form below and our support team will reach out promptly.</p>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-8 rounded-2xl text-center space-y-3">
                <CheckCircle2 size={40} className="text-emerald-500 mx-auto" />
                <h3 className="text-xl font-bold">Message Received!</h3>
                <p className="text-sm">Thank you for reaching out. We will get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-[#031130] mb-2">Your Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Abebe Kebede"
                    className="w-full px-4 py-3 bg-[#F3F7FE] border border-slate-200 rounded-xl text-[#031130] font-medium focus:outline-none focus:border-[#185DF1]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#031130] mb-2">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="abebe@example.com"
                    className="w-full px-4 py-3 bg-[#F3F7FE] border border-slate-200 rounded-xl text-[#031130] font-medium focus:outline-none focus:border-[#185DF1]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#031130] mb-2">How can we help you?</label>
                  <textarea 
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Type your inquiry or issue here..."
                    className="w-full px-4 py-3 bg-[#F3F7FE] border border-slate-200 rounded-xl text-[#031130] font-medium focus:outline-none focus:border-[#185DF1]"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-[#185DF1] hover:bg-[#031130] text-white font-bold py-4 px-10 rounded-xl transition-all shadow-lg w-full md:w-auto"
                >
                  Send Inquiry
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}