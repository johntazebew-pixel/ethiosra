// ============================================================================
// File Name: index.ts
// Exact Location: frontend/types/index.ts
// Description: Core TypeScript models and interfaces for EthioSira.
//              Used across all frontend pages, components, and API requests.
// ============================================================================

export type Role = "USER" | "ADMIN" | "SUPERADMIN";

export type WorkplaceType = "ON_SITE" | "HYBRID" | "REMOTE";

export type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "INTERNSHIP"
  | "FREELANCE";

export type ExperienceLevel =
  | "ENTRY_LEVEL"
  | "JUNIOR"
  | "MID_LEVEL"
  | "SENIOR"
  | "EXECUTIVE";

export type JobStatus = "DRAFT" | "PENDING" | "PUBLISHED" | "CLOSED";

export type ApplicationStatus =
  | "APPLIED"
  | "REVIEWING"
  | "SHORTLISTED"
  | "REJECTED"
  | "OFFERED"
  | "HIRED";

export interface User {
  id: string;
  email: string;
  fullName?: string;
  name?: string;
  role: Role;
  phoneNumber?: string;
  headline?: string;
  bio?: string;
  avatarUrl?: string;
  resumeUrl?: string;
  skills?: string[];
  currentCity?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Company {
  id: string;
  name: string;
  slug?: string;
  logoUrl?: string;
  website?: string;
  location?: string;
  description?: string;
  industry?: string;
  companySize?: string;
  isVerified?: boolean;
  employerId?: string;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    jobs?: number;
  };
}

export interface Category {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  iconName?: string;
  _count?: {
    jobs?: number;
  };
}

export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  workplaceType: WorkplaceType | string;
  employmentType: EmploymentType | string;
  experienceLevel: ExperienceLevel | string;
  education?: string;
  salaryMin?: number;
  salaryMax?: number;
  isSalaryNegotiable?: boolean;
  skills?: string[];
  benefits?: string[];
  status: JobStatus | string;
  isFeatured?: boolean;
  isUrgent?: boolean;
  applicationDeadline?: string;
  viewsCount?: number;
  companyId: string;
  company?: Company;
  categoryId?: string;
  category?: Category;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    applications?: number;
  };
}

export interface JobApplication {
  id: string;
  jobId: string;
  job?: Job;
  applicantId: string;
  applicant?: User;
  status: ApplicationStatus | string;
  coverLetter?: string;
  resumeUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}
