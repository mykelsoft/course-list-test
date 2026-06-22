export type ArchivedUnitRow = {
  id: number;
  name: string;
  dateArchived: Date;
};

export type ArchivedJobRoleRow = {
  id: number;
  name: string;
  dateArchived: Date;
};

export type MasterJobRoleRow = {
  id: number;
  name: string;
  companies: string;
  status: boolean;
};

const COMPANY_NAMES = [
  'Lean Logistics',
  'OSHA Compliance',
  'ISO Safety',
  'ASHR Construction',
  'Mond Corp.',
  'Safety Culture',
  'Acme Brick',
  'BuildRight Partners',
  'Coastal Mining Group',
  'Delta Engineering',
];

const LONG_COMPANY_STRING = COMPANY_NAMES.join(', ');

const ARCHIVED_DATE = new Date('2024-08-06T09:15:00');
const ARCHIVED_JOB_ROLE_DATE = new Date('2024-08-08T11:30:00');

const SCREENSHOT_ARCHIVED_UNITS: Omit<ArchivedUnitRow, 'id'>[] = [
  { name: 'Project Management Workshop', dateArchived: ARCHIVED_DATE },
  { name: 'Leadership Development Program', dateArchived: ARCHIVED_DATE },
  { name: 'Data Analytics Bootcamp', dateArchived: ARCHIVED_DATE },
  { name: 'Project Management Essentials', dateArchived: ARCHIVED_DATE },
  { name: 'Effective Communication Skills', dateArchived: ARCHIVED_DATE },
  { name: 'Digital Marketing Strategies', dateArchived: ARCHIVED_DATE },
  { name: 'Financial Literacy Course', dateArchived: ARCHIVED_DATE },
  { name: 'Creative Writing Workshop', dateArchived: ARCHIVED_DATE },
  { name: 'Public Speaking Mastery', dateArchived: ARCHIVED_DATE },
  { name: 'Time Management Techniques', dateArchived: ARCHIVED_DATE },
];

const SCREENSHOT_ARCHIVED_JOB_ROLES: Omit<ArchivedJobRoleRow, 'id'>[] = [
  { name: 'Innovative Waste Management Techniques', dateArchived: ARCHIVED_JOB_ROLE_DATE },
  { name: 'Renewable Energy Initiatives', dateArchived: ARCHIVED_JOB_ROLE_DATE },
  { name: 'Smart Agriculture Technologies', dateArchived: ARCHIVED_JOB_ROLE_DATE },
  { name: 'Urban Planning and Development', dateArchived: ARCHIVED_JOB_ROLE_DATE },
  { name: 'Sustainable Transportation Solutions', dateArchived: ARCHIVED_JOB_ROLE_DATE },
  { name: 'Green Building Practices', dateArchived: ARCHIVED_JOB_ROLE_DATE },
  { name: 'Water Conservation Strategies', dateArchived: ARCHIVED_JOB_ROLE_DATE },
  { name: 'Climate Change Adaptation', dateArchived: ARCHIVED_JOB_ROLE_DATE },
  { name: 'Eco-Friendly Product Design', dateArchived: ARCHIVED_JOB_ROLE_DATE },
  { name: 'Community Engagement Programs', dateArchived: ARCHIVED_JOB_ROLE_DATE },
];

const SCREENSHOT_MASTER_JOB_ROLES: Omit<MasterJobRoleRow, 'id'>[] = [
  { name: 'Warehouse Manager', companies: LONG_COMPANY_STRING, status: true },
  { name: 'Quality Control Inspector', companies: LONG_COMPANY_STRING, status: true },
  { name: 'Safety Officer', companies: LONG_COMPANY_STRING, status: true },
  { name: 'Site Supervisor', companies: LONG_COMPANY_STRING, status: true },
  { name: 'Forklift Operator', companies: LONG_COMPANY_STRING, status: true },
  { name: 'Logistics Coordinator', companies: LONG_COMPANY_STRING, status: true },
  { name: 'Inventory Specialist', companies: LONG_COMPANY_STRING, status: true },
  { name: 'Maintenance Technician', companies: LONG_COMPANY_STRING, status: true },
  { name: 'Production Line Lead', companies: LONG_COMPANY_STRING, status: true },
  { name: 'Shipping and Receiving Clerk', companies: LONG_COMPANY_STRING, status: true },
];

const ADDITIONAL_UNIT_NAMES = [
  'Agile Methodology Training',
  'Conflict Resolution Skills',
  'Customer Service Excellence',
  'Data Privacy Awareness',
  'Diversity and Inclusion Workshop',
  'Emotional Intelligence Training',
  'Environmental Compliance Basics',
  'Equipment Safety Procedures',
  'Ergonomics in the Workplace',
  'Ethics and Compliance Training',
];

const ADDITIONAL_JOB_ROLE_NAMES = [
  'Environmental Health Specialist',
  'Hazardous Materials Handler',
  'Industrial Hygiene Technician',
  'Occupational Health Nurse',
  'Risk Assessment Analyst',
  'Safety Training Coordinator',
  'Emergency Response Leader',
  'Incident Investigation Officer',
  'Permit to Work Administrator',
  'Contractor Safety Manager',
];

const ADDITIONAL_MASTER_JOB_ROLE_NAMES = [
  'Assembly Line Worker',
  'Batch Processing Operator',
  'Cold Storage Manager',
  'Distribution Center Lead',
  'Fleet Maintenance Supervisor',
  'Heavy Equipment Operator',
  'Loading Dock Supervisor',
  'Materials Handler',
  'Packaging Specialist',
  'Route Planning Coordinator',
];

function padToCount<T extends { id: number }>(
  seeds: Omit<T, 'id'>[],
  startId: number,
  additionalNames: string[],
  buildExtra: (id: number, name: string, index: number) => Omit<T, 'id'>,
  total = 89,
): T[] {
  const rows: T[] = seeds.map((seed, index) => ({
    id: startId + index,
    ...seed,
  })) as T[];

  let id = startId + seeds.length;
  let nameIndex = 0;

  while (rows.length < total) {
    const name = additionalNames[nameIndex % additionalNames.length];
    const suffix = Math.floor(nameIndex / additionalNames.length);
    const displayName = suffix > 0 ? `${name} ${suffix + 1}` : name;
    rows.push({
      id,
      ...buildExtra(id, displayName, rows.length),
    } as T);
    id += 1;
    nameIndex += 1;
  }

  return rows;
}

export const MOCK_ARCHIVED_UNITS: ArchivedUnitRow[] = padToCount<ArchivedUnitRow>(
  SCREENSHOT_ARCHIVED_UNITS,
  151,
  ADDITIONAL_UNIT_NAMES,
  (_id, name, index) => ({
    name,
    dateArchived: new Date(
      Date.UTC(2024, 7, 6 + (index % 20), 9 + (index % 8), 15, 0),
    ),
  }),
);

export const MOCK_ARCHIVED_JOB_ROLES: ArchivedJobRoleRow[] = padToCount<ArchivedJobRoleRow>(
  SCREENSHOT_ARCHIVED_JOB_ROLES,
  1,
  ADDITIONAL_JOB_ROLE_NAMES,
  (_id, name, index) => ({
    name,
    dateArchived: new Date(
      Date.UTC(2024, 7, 8 + (index % 20), 11 + (index % 6), 30, 0),
    ),
  }),
);

export const MOCK_MASTER_JOB_ROLES: MasterJobRoleRow[] = padToCount<MasterJobRoleRow>(
  SCREENSHOT_MASTER_JOB_ROLES,
  1,
  ADDITIONAL_MASTER_JOB_ROLE_NAMES,
  (_id, name) => ({
    name,
    companies: LONG_COMPANY_STRING,
    status: true,
  }),
);
