// lib/mock-data.ts

import type { CourseWithDetails } from '@/types/courses';

const COMPANY_NAMES = [
  'ISO Safety',
  'ASHR Construction',
  'Mond Corp.',
  'Safety Culture',
  'Acme Brick',
  'BuildRight Partners',
  'Coastal Mining Group',
  'Delta Engineering',
  'Evergreen Logistics',
  'Frontier Manufacturing',
];

const LONG_COMPANY_STRING = COMPANY_NAMES.join(', ');

const UNIT_TYPES = ['License', 'Scorm', 'Read & Acknowledge', 'Assignment'] as const;

const createUnit = (
  id: number,
  name: string,
  unitType: string,
  is_paid: boolean,
  price: number | null,
  updatedAt: string,
): CourseWithDetails => ({
  id,
  name,
  unitType,
  is_paid,
  price,
  totalUnits: (id % 8) + 1,
  companyCount: COMPANY_NAMES.length,
  assignedCompanies: LONG_COMPANY_STRING,
  updatedAt: new Date(updatedAt),
  description: `${name} mock unit for table testing.`,
  enrollmentValidityDays: id % 3 === 0 ? 365 : null,
  completionValidityDays: id % 4 === 0 ? 365 : null,
});

const SCREENSHOT_UNITS: CourseWithDetails[] = [
  createUnit(1, 'Forklift Operation Safety', 'License', false, null, '2024-01-05T09:15:00Z'),
  createUnit(2, 'Corporate Cyber Security 2026', 'Scorm', true, 149, '2024-01-10T11:00:00Z'),
  createUnit(3, 'Workplace Harassment Policy', 'Read & Acknowledge', true, 49, '2024-02-01T13:45:00Z'),
  createUnit(4, 'Advanced Structural Engineering', 'Assignment', false, null, '2024-02-15T08:30:00Z'),
  createUnit(5, 'First Aid & CPR Certification', 'License', false, null, '2024-03-01T15:20:00Z'),
  createUnit(6, 'Ethics in the Modern Workplace', 'Scorm', true, 99, '2024-03-10T10:10:00Z'),
  createUnit(7, 'Equipment Maintenance Log', 'Read and Acknowledge', true, 49, '2024-03-20T16:00:00Z'),
  createUnit(8, 'Annual Financial Disclosure', 'Assignment', true, 29, '2024-04-05T09:00:00Z'),
  createUnit(9, "Site Supervisor's Permit", 'Assignment', false, null, '2024-04-12T14:00:00Z'),
  createUnit(10, 'Employee Health and Safety Induction Online', 'Assignment', true, 89, '2024-04-20T10:30:00Z'),
];

const ADDITIONAL_UNIT_NAMES = [
  'Workplace Health and Safety Basics',
  'Manual Handling Awareness',
  'Emergency Response Planning',
  'Fire Warden Training',
  'Hazard Identification Workshop',
  'Incident Reporting Fundamentals',
  'Risk Assessment Essentials',
  'Construction Site Induction',
  'Electrical Safety Awareness',
  'Confined Space Awareness',
  'Working at Heights Basics',
  'PPE Selection and Use',
  'Chemical Handling Awareness',
  'Safety Leadership for Supervisors',
  'Mental Health First Response',
  'Fatigue Management Training',
  'Ergonomics for Office Teams',
  'Noise Exposure Awareness',
  'Traffic Management Basics',
  'Forklift Safety Refresher',
  'Machine Guarding Essentials',
  'Lockout Tagout Awareness',
  'Environmental Compliance Basics',
  'Quality Control Fundamentals',
  'Document Control Essentials',
  'Workplace Bullying Prevention',
  'Diversity and Inclusion Awareness',
  'Privacy and Data Protection',
  'Cybersecurity Awareness',
  'First Aid Refresher',
  'Site Supervisor Essentials',
  'Contractor Safety Management',
  'Toolbox Talk Facilitation',
  'Return to Work Coordination',
  'Drug and Alcohol Awareness',
  'Asbestos Awareness',
  'Silica Dust Awareness',
  'Hot Work Permit Basics',
  'Permit to Work Essentials',
  'Ladder Safety Awareness',
  'Vehicle Pre-start Checks',
  'Warehouse Safety Basics',
  'Food Safety Handling',
  'Customer Complaint Handling',
  'Professional Email Etiquette',
  'Change Management Foundations',
  'Performance Coaching Basics',
  'Recruitment Interview Skills',
  'Financial Literacy for Teams',
  'Business Writing Essentials',
];

const ADDITIONAL_UNITS: CourseWithDetails[] = ADDITIONAL_UNIT_NAMES.map((name, index) => {
  const id = 11 + index;
  const unitType = UNIT_TYPES[index % UNIT_TYPES.length];
  const is_paid = index % 3 !== 0;
  const price = is_paid ? [29, 49, 79, 99, 149][index % 5] : null;

  return createUnit(
    id,
    name,
    unitType,
    is_paid,
    price,
    new Date(Date.UTC(2024, 4 + (index % 6), 1 + (index % 26), 9 + (index % 8), 0, 0)).toISOString(),
  );
});

export const MOCK_COURSES: CourseWithDetails[] = [...SCREENSHOT_UNITS, ...ADDITIONAL_UNITS];
