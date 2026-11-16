import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Seed System Settings
  console.log('⚙️ Seeding System Settings...');
  await prisma.systemSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      systemLogoUrl: null,
      defaultLanguage: 'EN',
      heroBannerImages: [
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop',
      ],
      heroBannerVideos: [],
    },
  });

  // 2. Seed Users (SuperAdmin, Admin, JobSeeker)
  console.log('👥 Seeding Users...');
  const passwordHash = await bcrypt.hash('Password123!', 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@ethiosira.com' },
    update: { role: 'SUPERADMIN', password: passwordHash },
    create: {
      email: 'superadmin@ethiosira.com',
      password: passwordHash,
      role: 'SUPERADMIN',
      preferredLanguage: 'EN',
      preferredTheme: 'LIGHT',
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@ethiosira.com' },
    update: { role: 'ADMIN', password: passwordHash },
    create: {
      email: 'admin@ethiosira.com',
      password: passwordHash,
      role: 'ADMIN',
      preferredLanguage: 'EN',
      preferredTheme: 'LIGHT',
    },
  });

  const jobSeeker = await prisma.user.upsert({
    where: { email: 'jobseeker@ethiosira.com' },
    update: { role: 'JOB_SEEKER', password: passwordHash },
    create: {
      email: 'jobseeker@ethiosira.com',
      password: passwordHash,
      role: 'JOB_SEEKER',
      preferredLanguage: 'EN',
      preferredTheme: 'LIGHT',
    },
  });

  // 3. Seed Companies
  console.log('🏢 Seeding Companies...');
  const companiesData = [
    {
      name: 'Commercial Bank of Ethiopia (CBE)',
      logoUrl: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?q=80&w=300&auto=format&fit=crop',
      description: 'The largest commercial bank in Ethiopia offering financial solutions across the nation.',
      website: 'https://www.combanketh.et',
    },
    {
      name: 'Ethio Telecom',
      logoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=300&auto=format&fit=crop',
      description: 'Leading telecommunication and digital services provider in Ethiopia.',
      website: 'https://www.ethiotelecom.et',
    },
    {
      name: 'Safaricom Ethiopia',
      logoUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=300&auto=format&fit=crop',
      description: 'A purpose-led technology company providing world-class connectivity and digital solutions.',
      website: 'https://www.safaricom.et',
    },
    {
      name: 'Chapa Financial Technologies',
      logoUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=300&auto=format&fit=crop',
      description: 'Payment gateway and fintech platform powering digital commerce in Ethiopia and Africa.',
      website: 'https://chapa.co',
    },
    {
      name: 'RIDE (Hybrid Designs)',
      logoUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=300&auto=format&fit=crop',
      description: 'Pioneering transport hailing and urban mobility platform in Addis Ababa.',
      website: 'https://ride8294.com',
    },
    {
      name: 'Ethiopian Airlines',
      logoUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=300&auto=format&fit=crop',
      description: 'Africa’s largest and award-winning airline group connecting Ethiopia to the world.',
      website: 'https://www.ethiopianairlines.com',
    },
  ];

  const companies = [];
  for (const c of companiesData) {
    const company = await prisma.company.upsert({
      where: { name: c.name },
      update: c,
      create: c,
    });
    companies.push(company);
  }

  // 4. Seed Categories
  console.log('🏷️ Seeding Categories...');
  const categoriesData = [
    { name: 'Software & Technology', type: 'DEPARTMENT' },
    { name: 'Banking & Financial Services', type: 'DEPARTMENT' },
    { name: 'Telecommunications & Networks', type: 'DEPARTMENT' },
    { name: 'Marketing & Public Relations', type: 'DEPARTMENT' },
    { name: 'Human Resources', type: 'DEPARTMENT' },
    { name: 'Aviation & Logistics', type: 'DEPARTMENT' },

    { name: 'Entry Level (0-2 years)', type: 'EXPERIENCE' },
    { name: 'Mid Level (2-5 years)', type: 'EXPERIENCE' },
    { name: 'Senior Level (5+ years)', type: 'EXPERIENCE' },
    { name: 'Lead / Executive', type: 'EXPERIENCE' },

    { name: 'Full-Time', type: 'EMPLOYMENT_TYPE' },
    { name: 'Part-Time', type: 'EMPLOYMENT_TYPE' },
    { name: 'Remote', type: 'EMPLOYMENT_TYPE' },
    { name: 'Contract / Project', type: 'EMPLOYMENT_TYPE' },
  ];

  const categories = [];
  for (const cat of categoriesData) {
    const category = await prisma.category.upsert({
      where: { name: cat.name },
      update: cat,
      create: cat,
    });
    categories.push(category);
  }

  // 5. Seed Jobs
  console.log('💼 Seeding Sample Jobs...');
  const findCompany = (name) => companies.find((c) => c.name.includes(name));
  const findCategory = (name) => categories.find((c) => c.name.includes(name));

  const jobsData = [
    {
      title: 'Senior Full-Stack TypeScript Engineer',
      description: 'We are seeking an experienced Full-Stack Engineer with strong expertise in Next.js, NestJS, and PostgreSQL to build cutting-edge fintech applications. You will collaborate with cross-functional teams to architect reliable, high-performance payment systems.',
      deadlineDate: new Date('2026-12-31'),
      applicationMethod: 'WEBSITE',
      applicationUrl: 'https://chapa.co/careers',
      companyId: findCompany('Chapa').id,
      postedById: admin.id,
      status: 'PUBLISHED',
      categoryNames: ['Software & Technology', 'Senior Level', 'Full-Time', 'Remote'],
    },
    {
      title: 'Core Network & Infrastructure Specialist',
      description: 'Responsible for monitoring, maintaining, and scaling high-availability core telecom network systems, 4G/5G base stations, and datacenter reliability across regional operational hubs.',
      deadlineDate: new Date('2026-11-30'),
      applicationMethod: 'EMAIL',
      applicationUrl: 'mailto:careers@safaricom.et',
      companyId: findCompany('Safaricom').id,
      postedById: superAdmin.id,
      status: 'PUBLISHED',
      categoryNames: ['Telecommunications & Networks', 'Mid Level', 'Full-Time'],
    },
    {
      title: 'Senior Database Administrator (PostgreSQL & Oracle)',
      description: 'Manage mission-critical banking databases, design automated backup and disaster-recovery protocols, and optimize query latency for high-throughput transactional core banking systems.',
      deadlineDate: new Date('2026-12-15'),
      applicationMethod: 'WEBSITE',
      applicationUrl: 'https://www.combanketh.et/en/careers',
      companyId: findCompany('Commercial Bank').id,
      postedById: admin.id,
      status: 'PUBLISHED',
      categoryNames: ['Banking & Financial Services', 'Senior Level', 'Full-Time'],
    },
    {
      title: 'Mobile App Developer (Flutter / React Native)',
      description: 'Join the mobility revolution! We are hiring talented mobile engineers to enhance our passenger and driver apps with real-time GPS tracking, seamless payment integration, and responsive UX.',
      deadlineDate: new Date('2026-11-20'),
      applicationMethod: 'TELEGRAM',
      applicationUrl: 'https://t.me/EthioSiraJobs',
      companyId: findCompany('RIDE').id,
      postedById: admin.id,
      status: 'PUBLISHED',
      categoryNames: ['Software & Technology', 'Mid Level', 'Full-Time'],
    },
    {
      title: 'Enterprise Cloud Solutions Architect',
      description: 'Lead national cloud infrastructure initiatives, design hybrid enterprise migrations, and deliver cloud hosting capabilities for public and private sector organizations in Ethiopia.',
      deadlineDate: new Date('2026-12-25'),
      applicationMethod: 'WEBSITE',
      applicationUrl: 'https://www.ethiotelecom.et/careers',
      companyId: findCompany('Ethio Telecom').id,
      postedById: superAdmin.id,
      status: 'PUBLISHED',
      categoryNames: ['Telecommunications & Networks', 'Lead / Executive', 'Full-Time'],
    },
    {
      title: 'Flight Operations Quality Coordinator',
      description: 'Monitor flight crew scheduling, verify compliance with international civil aviation regulatory standards, and optimize daily operations across our pan-African and international route network.',
      deadlineDate: new Date('2026-12-10'),
      applicationMethod: 'WEBSITE',
      applicationUrl: 'https://www.ethiopianairlines.com/careers',
      companyId: findCompany('Ethiopian Airlines').id,
      postedById: superAdmin.id,
      status: 'PUBLISHED',
      categoryNames: ['Aviation & Logistics', 'Mid Level', 'Full-Time'],
    },
  ];

  for (const job of jobsData) {
    const { categoryNames, ...jobFields } = job;
    
    // Check if job exists by title and company
    const existingJob = await prisma.job.findFirst({
      where: { title: jobFields.title, companyId: jobFields.companyId },
    });

    let createdJob;
    if (existingJob) {
      createdJob = await prisma.job.update({
        where: { id: existingJob.id },
        data: jobFields,
      });
    } else {
      createdJob = await prisma.job.create({
        data: jobFields,
      });
    }

    // Connect categories
    for (const catName of categoryNames) {
      const cat = findCategory(catName);
      if (cat) {
        await prisma.jobCategory.upsert({
          where: {
            jobId_categoryId: {
              jobId: createdJob.id,
              categoryId: cat.id,
            },
          },
          update: {},
          create: {
            jobId: createdJob.id,
            categoryId: cat.id,
          },
        });
      }
    }
  }

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
