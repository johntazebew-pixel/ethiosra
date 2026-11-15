// ============================================================================
// File Name: constants.ts
// Exact Location: frontend/lib/constants.ts
// Description: Standardized constants, Ethiopian regional locations, career levels,
//              and employment taxonomy used throughout EthioSira.
// ============================================================================

export const ETHIOPIAN_CITIES = [
  "Addis Ababa",
  "Hawassa",
  "Dire Dawa",
  "Bahir Dar",
  "Adama (Nazret)",
  "Mekelle",
  "Jimma",
  "Gondar",
  "Dessie",
  "Bishoftu",
  "Remote / All Ethiopia",
] as const;

export const WORKPLACE_TYPES = [
  { id: "ON_SITE", label: "On-site", desc: "Work from company office" },
  { id: "HYBRID", label: "Hybrid", desc: "Mix of office and remote" },
  { id: "REMOTE", label: "Remote", desc: "Work from anywhere in Ethiopia" },
] as const;

export const EMPLOYMENT_TYPES = [
  { id: "FULL_TIME", label: "Full-Time" },
  { id: "PART_TIME", label: "Part-Time" },
  { id: "CONTRACT", label: "Contractual / Project" },
  { id: "INTERNSHIP", label: "Internship / Graduate Trainee" },
  { id: "FREELANCE", label: "Freelance" },
] as const;

export const EXPERIENCE_LEVELS = [
  { id: "ENTRY_LEVEL", label: "Entry-Level (0 - 1 years)" },
  { id: "JUNIOR", label: "Junior Level (1 - 3 years)" },
  { id: "MID_LEVEL", label: "Mid-Level (3 - 5 years)" },
  { id: "SENIOR", label: "Senior Professional (5 - 8 years)" },
  { id: "EXECUTIVE", label: "Lead / Director / Executive (8+ years)" },
] as const;

export const EDUCATION_LEVELS = [
  "High School Diploma",
  "Technical / TVET Certificate",
  "Diploma (College)",
  "Bachelor's Degree (BA / BSc)",
  "Master's Degree (MA / MSc / MBA)",
  "Doctorate / PhD",
  "Other Professional Certification",
] as const;

export const COMMON_BENEFITS = [
  "Comprehensive Health Insurance",
  "Transportation Allowance / Staff Bus",
  "Mobile & Internet Allowance",
  "Performance & Annual Bonuses",
  "Pension & Provident Fund",
  "Paid Training & Certifications",
  "Flexible Working Hours",
  "Subsidized Cafeteria / Lunch",
] as const;

export const SUGGESTED_SKILLS = [
  "React",
  "TypeScript",
  "Node.js",
  "Python",
  "SQL",
  "PostgreSQL",
  "Accounting",
  "Financial Analysis",
  "Project Management",
  "Customer Support",
  "Digital Marketing",
  "Graphic Design",
  "Sales & Negotiation",
  "Human Resources",
  "Data Analysis",
] as const;
