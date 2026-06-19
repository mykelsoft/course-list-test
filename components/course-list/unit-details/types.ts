export type SubUnitType =
  | 'Assignment'
  | 'License'
  | 'Face to Face'
  | 'Read & Acknowledge'
  | 'Scorm';

export type MainUnitDetailsValues = {
  unitPrice: string | number;
  unitType: string | number | null;
  unitName: string;
  unitSummary: string;
  enrollmentValidityDays: string;
  completionValidityDays: string;
};

export type SubUnitDetailsValues = {
  unitName: string;
  description: string;
  selectedArticle: string | number | null;
  licenseHasExpiry: 'yes' | 'no' | null;
  uploadedFileName: string | null;
};

export const SUB_UNIT_TYPE_LABELS: Record<SubUnitType, string> = {
  Assignment: 'Assignment',
  License: 'License',
  'Face to Face': 'Face to Face',
  'Read & Acknowledge': 'Read and Acknowledge',
  Scorm: 'Scorm Package',
};

export type SubUnitConfig = {
  id: number;
  type: SubUnitType;
};

export type SubUnitState = SubUnitConfig & {
  enabled: boolean;
  values: SubUnitDetailsValues;
};

export const DEFAULT_SUB_UNITS: SubUnitConfig[] = [
  { id: 1, type: 'Assignment' },
  { id: 2, type: 'License' },
  { id: 3, type: 'Face to Face' },
  { id: 4, type: 'Read & Acknowledge' },
  { id: 5, type: 'Scorm' },
];

export function getSubUnitSectionTitle(unitNumber: number, unitType: SubUnitType): string {
  if (unitNumber === 1 && unitType === 'Assignment') {
    return 'Unit Details (Assignment)';
  }

  return `Unit ${unitNumber} Details (${SUB_UNIT_TYPE_LABELS[unitType]})`;
}

export function getSubUnitNamePlaceholder(unitNumber: number): string {
  if (unitNumber === 1) {
    return 'Unit Name';
  }

  return `Unit ${unitNumber} - Name`;
}

export function createEmptySubUnitValues(): SubUnitDetailsValues {
  return {
    unitName: '',
    description: '',
    selectedArticle: null,
    licenseHasExpiry: null,
    uploadedFileName: null,
  };
}

export function createDefaultSubUnits(): SubUnitState[] {
  return DEFAULT_SUB_UNITS.map(({ id, type }) => ({
    id,
    type,
    enabled: true,
    values: createEmptySubUnitValues(),
  }));
}
