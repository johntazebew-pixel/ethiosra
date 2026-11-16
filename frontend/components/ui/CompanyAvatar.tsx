"use client";

import { useState } from "react";
import { getInitials, resolveImageUrl } from "@/lib/utils";

interface CompanyAvatarProps {
  name?: string | null;
  logoUrl?: string | null;
  className?: string;
  fallback?: string;
}

export default function CompanyAvatar({
  name,
  logoUrl,
  className = "",
  fallback = "Co",
}: CompanyAvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const src = resolveImageUrl(logoUrl);

  if (src && failedSrc !== src) {
    return (
      <div className={`overflow-hidden bg-white flex items-center justify-center ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={name || "Company logo"}
          className="w-full h-full object-contain p-1.5"
          onError={() => setFailedSrc(src)}
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center font-extrabold uppercase ${className}`}>
      {name ? getInitials(name) : fallback}
    </div>
  );
}
