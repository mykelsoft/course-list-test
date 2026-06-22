import { cn } from '@/lib/utils';

export const CUSTOM_TABLE_LAYOUTS = {
  activeUnits: 'custom-table active-units-table',
  archivedUnits: 'custom-table archived-units-table',
  masterJobRoles: 'custom-table master-job-roles-table',
  archivedJobRoles: 'custom-table archived-job-roles-table',
  unitJobRoles: 'custom-table unit-job-roles-table',
} as const;

export type CustomTableLayoutKey = keyof typeof CUSTOM_TABLE_LAYOUTS;

export function getCustomTableLayoutClass(
  layout: CustomTableLayoutKey,
  ...extraClasses: Array<string | false | null | undefined>
) {
  return cn(CUSTOM_TABLE_LAYOUTS[layout], ...extraClasses);
}
