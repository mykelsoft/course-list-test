// types/courses.ts

export enum APPS {
  PORTAL = 'Portal',
  TRAINING = 'Training',
  POLICIES_AND_PROCEDURES = 'Policies and Procedures',
  INSPECTIONS = 'Inspections',
  CONTRACTORS = 'Contractors',
  HAZARDS = 'Hazards',
  FORMS = 'Forms',
}

export type CourseWithDetails = {
  id: number;
  name: string;
  is_paid: boolean;
  price: number | null;
  totalUnits: number;
  companyCount: number;
  assignedCompanies: string;
  updatedAt: Date | null;
  deletedAt?: Date | null;
  description: string | null;
  enrollmentValidityDays: number | null;
  completionValidityDays: number | null;
};
