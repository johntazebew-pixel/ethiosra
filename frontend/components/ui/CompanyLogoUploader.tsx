// ============================================================================
// File Name: CompanyLogoUploader.tsx
// Exact Location: frontend/components/ui/CompanyLogoUploader.tsx
// Description: Multi-mode Company Logo uploader supporting local device file
//              picker, drag & drop, instant preview, and web link URL fallback.
// ============================================================================

"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import {
  UploadCloud,
  Image as ImageIcon,
  Link as LinkIcon,
  X,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { api } from "@/lib/api";
import { resolveImageUrl } from "@/lib/utils";

interface CompanyLogoUploaderProps {
  value: string;
  onChange: (url: string) => void;
  companyName?: string;
  label?: string;
  description?: string;
}

export default function CompanyLogoUploader({
  value,
  onChange,
  companyName = "Platform",
  label = "Company Logo & Branding",
  description = "Supports PNG, JPG, JPEG, WEBP, SVG (Max 10MB)",
}: CompanyLogoUploaderProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [fileName, setFileName] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [failedPreviewSrc, setFailedPreviewSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const displayUrl = previewUrl || value;
  const displaySrc = resolveImageUrl(displayUrl);
  const previewFailed = failedPreviewSrc === displaySrc;

  const handleFileProcess = async (file: File) => {
    if (!file) return;

    if (!file.type.match(/^image\/(png|jpeg|jpg|webp|svg\+xml)$/)) {
      setUploadError("Please select a valid image file (PNG, JPG, WEBP, or SVG).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File size exceeds 10MB limit.");
      return;
    }

    setUploading(true);
    setUploadError("");
    setFileName(file.name);

    const localPreview = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(typeof e.target?.result === "string" ? e.target.result : "");
      };
      reader.onerror = () => resolve("");
      reader.readAsDataURL(file);
    });
    if (localPreview) setPreviewUrl(localPreview);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/uploads", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data && response.data.url) {
        setPreviewUrl("");
        onChange(response.data.url);
      } else if (localPreview) {
        onChange(localPreview);
      }
    } catch (error) {
      console.warn("Backend upload failed, kept local data URL as fallback:", error);
      if (localPreview) onChange(localPreview);
      else setUploadError("Upload failed. Try again or paste an image URL.");
    } finally {
      setUploading(false);
    }
  };

  const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const onDragOverHandler = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const onDragLeaveHandler = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleClearLogo = () => {
    onChange("");
    setPreviewUrl("");
    setFileName("");
    setUploadError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      {/* Tab Switcher */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <ImageIcon size={14} className="text-[#111111]" />
          {label}
        </label>

        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("upload")}
            className={`px-2.5 py-1 rounded-md transition-all ${
              activeTab === "upload"
                ? "bg-white text-[#111111] shadow-sm font-bold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Upload Device File
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("url")}
            className={`px-2.5 py-1 rounded-md transition-all ${
              activeTab === "url"
                ? "bg-white text-[#111111] shadow-sm font-bold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Paste URL Link
          </button>
        </div>
      </div>

      {uploadError && (
        <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2 font-medium">
          <AlertCircle size={14} className="shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Tab 1: Upload from local device */}
      {activeTab === "upload" && (
        <div>
          {displayUrl ? (
            /* Current Logo Preview Card */
            <div className="flex items-center gap-4 p-4 bg-[#F8FAFC] border border-neutral-200 rounded-2xl relative group">
              <div className="relative w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
                {previewFailed ? (
                  <ImageIcon className="text-slate-300" size={24} aria-hidden="true" />
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={displaySrc}
                    alt={companyName}
                    className="w-full h-full object-contain"
                    onError={() => setFailedPreviewSrc(displaySrc)}
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800 truncate">
                    {fileName || `${label} Selected`}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-700 bg-neutral-50 px-2 py-0.5 rounded-md border border-neutral-200">
                    Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  {displayUrl.startsWith("data:") ? "Local Image Asset (Ready to Save)" : displayUrl}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-bold text-[#111111] hover:underline flex items-center gap-1"
                  >
                    <RefreshCw size={12} /> Replace Image
                  </button>
                  <button
                    type="button"
                    onClick={handleClearLogo}
                    className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1"
                  >
                    <X size={12} /> Remove
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Dropzone / File Picker */
            <div
              onDrop={onDrop}
              onDragOver={onDragOverHandler}
              onDragLeave={onDragLeaveHandler}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
                dragOver
                  ? "border-[#111111] bg-neutral-50/50 scale-[0.99]"
                  : "border-slate-300 hover:border-[#111111] bg-[#F8FAFC] hover:bg-white"
              }`}
            >
              <div className="w-12 h-12 bg-neutral-50 rounded-2xl text-[#111111] flex items-center justify-center mx-auto mb-3 shadow-inner">
                {uploading ? (
                  <div className="w-5 h-5 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <UploadCloud size={24} />
                )}
              </div>
              <p className="text-xs font-bold text-slate-800">
                {uploading ? "Uploading image..." : `Click or drag & drop image file here`}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                {description}
              </p>
            </div>
          )}

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
            onChange={onFileInputChange}
            className="hidden"
          />
        </div>
      )}

      {/* Tab 2: Direct URL link input */}
      {activeTab === "url" && (
        <div className="space-y-3">
          <div className="relative">
            <LinkIcon size={14} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="url"
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
                setFileName("");
              }}
              placeholder="https://example.com/company-logo.png"
              className="w-full bg-[#F7F7F7] border border-slate-200 rounded-xl pl-9 pr-8 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#111111]"
            />
            {value && (
              <button
                type="button"
                onClick={handleClearLogo}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700 p-0.5"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {value && (
            <div className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-xl border border-slate-200">
              <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                {previewFailed ? (
                  <ImageIcon className="text-slate-300" size={18} aria-hidden="true" />
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={resolveImageUrl(value)}
                    alt="Preview"
                    className="w-full h-full object-contain"
                    onError={() => setFailedPreviewSrc(resolveImageUrl(value))}
                  />
                )}
              </div>
              <div className="text-xs text-slate-600 truncate">
                <span className="font-bold text-slate-800 block">Logo URL Link Active</span>
                <span className="text-[11px] text-slate-400 truncate block">{value}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
