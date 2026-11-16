"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Briefcase } from "lucide-react";
import { api } from "@/lib/api";
import { resolveImageUrl } from "@/lib/utils";

const DEFAULT_LOGO_URL = "/ethiosira-logo.png";
const DEFAULT_FAVICON_URL = "/ethiosira-mark.png";
const BrandingContext = createContext<{ logoUrl: string }>({
  logoUrl: DEFAULT_LOGO_URL,
});

export function BrandingProvider({ children }: { children: React.ReactNode }) {
  const [logoUrl, setLogoUrl] = useState(DEFAULT_LOGO_URL);

  useEffect(() => {
    let active = true;
    api
      .get("/settings")
      .then((response) => {
        const configuredLogo = response.data?.systemLogoUrl?.trim();
        if (active) {
          setLogoUrl(
            configuredLogo && configuredLogo !== "/logo.png"
              ? configuredLogo
              : DEFAULT_LOGO_URL,
          );
        }
      })
      .catch(() => {
        if (active) setLogoUrl(DEFAULT_LOGO_URL);
      });
    const onBrandingChange = (event: Event) => {
      const next = (event as CustomEvent<string>).detail?.trim();
      setLogoUrl(next && next !== "/logo.png" ? next : DEFAULT_LOGO_URL);
    };
    window.addEventListener("branding-change", onBrandingChange);

    return () => {
      active = false;
      window.removeEventListener("branding-change", onBrandingChange);
    };
  }, []);

  useEffect(() => {
    const src =
      logoUrl === DEFAULT_LOGO_URL
        ? DEFAULT_FAVICON_URL
        : resolveImageUrl(logoUrl);
    if (!src || typeof document === "undefined") return;

    let link = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = src;
  }, [logoUrl]);

  return <BrandingContext.Provider value={{ logoUrl }}>{children}</BrandingContext.Provider>;
}

export function useBranding() {
  return useContext(BrandingContext);
}

export function SiteMark({
  variant = "header",
}: {
  variant?: "header" | "footer";
}) {
  const { logoUrl } = useBranding();
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const src =
    logoUrl === DEFAULT_LOGO_URL
      ? DEFAULT_FAVICON_URL
      : resolveImageUrl(logoUrl);

  if (src && failedSrc !== src) {
    return (
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ${
          variant === "footer" ? "p-2.5" : "p-1"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt="EthioSira Jobs & Careers"
          className="h-full w-full object-contain"
          onError={() => setFailedSrc(src)}
        />
      </div>
    );
  }

  return (
    <div
      className={
        variant === "footer"
          ? "rounded-2xl bg-[#111111] p-2.5 text-white shadow-md"
          : "rounded-2xl bg-gradient-to-br from-[#111111] to-[#2D2D2D] p-2.5 text-white shadow-md shadow-neutral-500/20"
      }
    >
      <Briefcase size={22} />
    </div>
  );
}

export function SiteWordmark() {
  const { logoUrl } = useBranding();
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const src =
    logoUrl === DEFAULT_LOGO_URL ? DEFAULT_LOGO_URL : resolveImageUrl(logoUrl);

  if (src && failedSrc !== src) {
    return (
      <div className="flex h-12 w-36 shrink-0 items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt="EthioSira Jobs & Careers"
          className="h-full w-full object-contain object-left"
          onError={() => setFailedSrc(src)}
        />
      </div>
    );
  }

  return (
    <span className="text-xl font-bold tracking-tight text-neutral-950">
      Ethio<span className="text-neutral-500">Sira</span>
    </span>
  );
}
