// ============================================================================
// File Name: layout.tsx
// Exact Location: frontend/app/layout.tsx
// Description: The global wrapper for the entire application. Connects Navbar & Footer!
// ============================================================================

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Suspense } from "react";

// Importing our newly created global components!
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EthioSira | Ethiopia's Premier Job Board",
  description: "Find your dream job or hire top talent in Ethiopia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#F3F7FE] text-slate-900 antialiased flex flex-col min-h-screen`}>
        
        {/* The Navbar wrapped in Suspense for dynamic route streaming */}
        <Suspense fallback={<div className="h-20 bg-white/80 border-b border-slate-200" />}>
          <Navbar />
        </Suspense>

        {/* This is where the specific page content gets injected */}
        <main className="flex-grow">
          {children}
        </main>
        
        {/* The Footer will now appear at the bottom of EVERY page */}
        <Footer />

      </body>
    </html>
  );
}