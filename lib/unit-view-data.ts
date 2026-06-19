import type { CourseWithDetails } from '@/types/courses';

export type UnitAdditionalFile = {
  name: string;
  url: string;
};

export type UnitViewData = {
  summaryDescription: string;
  unitDescription: string;
  additionalFiles: UnitAdditionalFile[];
};

export function getUnitViewData(course: CourseWithDetails): UnitViewData {
  return {
    summaryDescription:
      course.description ??
      `Establishes and enforces procedures for ${course.name.toLowerCase()} to ensure compliance, risk prevention, and operational readiness.`,
    unitDescription: `Apply guidelines for ${course.name.toLowerCase()} by identifying risks, ensuring compliance, and responding to operational safety issues.`,
    additionalFiles: [{ name: 'Guidelines.pdf', url: '#' }],
  };
}
