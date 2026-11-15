# EthioSira Frontend Architecture & File Structure

This document outlines the organized, modular folder structure of the **EthioSira Frontend**. It follows modern **Next.js App Router** industry standards, separating application routing, reusable UI components, centralized business logic/utilities, and type definitions.

---

## 📁 High-Level Directory Overview

```
frontend/
├── app/                  # 🌐 Next.js App Router (Routes & Pages ONLY)
├── components/           # 🧩 Reusable UI Components (Design System & Layout)
├── lib/                  # ⚙️ Shared Utilities, API Client & Constants
├── types/                # 🏷️ TypeScript Interfaces & Data Models
├── public/               # 🖼️ Static Public Assets (Images, Icons, Logos)
├── components.json       # 🎨 UI component registry configuration
├── package.json          # 📦 Dependencies and scripts
└── tsconfig.json         # ⚡ TypeScript path alias configuration (@/*)
```

---

## 🗂️ Detailed Directory Breakdown

### 1. `app/` — Application Pages & Routing
> **Rule:** Every directory inside `app/` corresponds strictly to a URL route. Reusable components belong in `components/`, not here.

| Folder / File | Route | Description & Purpose |
| :--- | :--- | :--- |
| `app/page.tsx` | `/` | **Landing Page** with hero search, categories, featured jobs, and stats. |
| `app/layout.tsx` | Global | **Root Layout** wrapping all pages with global `Navbar` and `Footer`. |
| `app/globals.css` | Global | Core TailwindCSS styles, Ethiopian color palette variables, animations. |
| `app/error.tsx` | Global | Global Next.js error boundary fallback. |
| `app/not-found.tsx` | Global | Friendly 404 page with navigation shortcuts. |
| `app/login/` | `/login` | Candidate and employer sign-in screen. |
| `app/register/` | `/register` | New candidate or employer registration. |
| `app/profile/` | `/profile` | Candidate profile management (resume, headline, skills, bio). |
| `app/jobs/` | `/jobs` & `/jobs/[id]` | Public jobs explorer, multi-filters, and job detail/application view. |
| `app/companies/` | `/companies` & `/[id]` | Public company directory, profiles, and open positions. |
| `app/support/` | `/support` | Help center, FAQs, and contact support. |
| `app/admin/` | `/admin/*` | **Employer / Recruiter Portal** for posting jobs and managing company profile. |
| `app/superadmin/` | `/superadmin/*` | **Platform Administration Suite** with dedicated sub-navigation. |
| ↳ `approvals/` | `/superadmin/approvals` | 1-click review and approval queue for submitted jobs. |
| ↳ `categories/` | `/superadmin/categories` | Create, edit, and organize job categories and taxonomies. |
| ↳ `companies/` | `/superadmin/companies` | Manage registered employer companies, verification badges & logos. |
| ↳ `dashboard/` | `/superadmin/dashboard` | High-level platform metrics, user counts, and system status. |
| ↳ `database/` | `/superadmin/database` | Direct table inspection, raw record counts, and database health. |
| ↳ `jobs/` | `/superadmin/jobs` | Full job audit, toggle published/draft/closed status, direct editing. |
| ↳ `settings/` | `/superadmin/settings` | Site-wide toggles, maintenance mode, and announcements. |
| ↳ `users/` | `/superadmin/users` | User management, role promotion (USER -> ADMIN -> SUPERADMIN), ban/unban. |

---

### 2. `components/` — Reusable UI Components
> **Rule:** Components here are pure or presentational, isolated from routing, and reusable anywhere via the `@/components/*` alias.

- **`components/layout/`** — High-level layout components
  - `Navbar.tsx`: Global navigation header with user avatar dropdown, responsive mobile drawer, and dynamic auth state.
  - `Footer.tsx`: Universal footer with platform links, copyright, and social links.
  - `SuperAdminNav.tsx`: Tabbed sub-navigation bar mounted on all SuperAdmin pages.
- **`components/ui/`** — Reusable primitives & custom interactive widgets
  - `CompanyLogoUploader.tsx`: Multi-mode logo uploader supporting device file drag-and-drop, instant image preview, and external URL fallback.
  - `button.tsx`: Variant-driven button component.

---

### 3. `lib/` — Business Logic, Constants & API
> **Rule:** Non-UI TypeScript modules, API communication, and static lookup tables. Accessible via `@/lib/*`.

- `api.ts`: Pre-configured Axios instance with automatic JWT Authorization header injection, `401 Unauthorized` token expiry handler, and custom API base URL configuration.
- `constants.ts`: Standardized constants for Ethiopian cities (`ETHIOPIAN_CITIES`), workplace options (`WORKPLACE_TYPES`), employment types (`EMPLOYMENT_TYPES`), experience levels (`EXPERIENCE_LEVELS`), and suggested skill tags.
- `utils.ts`: General-purpose helper functions:
  - `cn(...)`: Tailwind class name merging.
  - `formatSalary(...)`: Formats ETB currency ranges or returns "Negotiable".
  - `formatDate(...)`: Standard Ethiopian/Western date formatting.
  - `getInitials(...)`: Generates clean two-letter monogram for avatars.
  - `resolveImageUrl(...)`: Handles local upload URLs (`/uploads/...`) vs. external links.

---

### 4. `types/` — TypeScript Data Contracts
> **Rule:** Clean type definitions shared between backend responses and frontend pages. Accessible via `@/types`.

- `index.ts`: Strongly typed interfaces:
  - `User`, `Role` (`USER`, `ADMIN`, `SUPERADMIN`)
  - `Company`
  - `Job`, `JobStatus`, `WorkplaceType`, `EmploymentType`, `ExperienceLevel`
  - `Category`
  - `JobApplication`, `ApplicationStatus`

---

## 🧭 Import Conventions (Path Aliases)

Always use the configured `@/` path alias rather than relative dot-dot paths:

```typescript
// ✅ Good (Standardized & Easy to refactor):
import Navbar from "@/components/layout/Navbar";
import { CompanyLogoUploader } from "@/components/ui/CompanyLogoUploader";
import { api } from "@/lib/api";
import { ETHIOPIAN_CITIES } from "@/lib/constants";
import { formatSalary } from "@/lib/utils";
import type { User, Job } from "@/types";

// ❌ Avoid (Brittle & Hard to read):
import Navbar from "../../components/Navbar";
import { api } from "../../../lib/api";
```
