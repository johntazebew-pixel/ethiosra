// ============================================================================
// File Name: page.tsx
// Exact Location: frontend/app/profile/page.tsx
// Description: Redirects from /profile to /profile/settings
// ============================================================================

import { redirect } from "next/navigation";

export default function ProfileRootPage() {
  redirect("/profile/settings");
}
