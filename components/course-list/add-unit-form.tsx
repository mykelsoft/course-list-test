'use client';

import CustomContentHeader from '@/components/custom-ui/custom-content-header';
import {
  MainUnitDetailsFields,
  SubUnitDetailsFields,
  UnitDetailsSection,
  createDefaultSubUnits,
  getSubUnitSectionTitle,
  type MainUnitDetailsValues,
  type SubUnitState,
} from '@/components/course-list/unit-details';
import { APPS } from '@/types/courses';
import { useState } from 'react';

type AddUnitFormProps = {
  onBack: () => void;
};

const DEFAULT_MAIN_VALUES: MainUnitDetailsValues = {
  unitPrice: 'free',
  unitType: null,
  unitName: 'Safety Operations Guideline',
  unitSummary: '',
  enrollmentValidityDays: '',
  completionValidityDays: '',
};

export default function AddUnitForm({ onBack }: AddUnitFormProps) {
  const [mainValues, setMainValues] = useState<MainUnitDetailsValues>(DEFAULT_MAIN_VALUES);
  const [subUnits, setSubUnits] = useState<SubUnitState[]>(createDefaultSubUnits);

  const handleMainChange = (patch: Partial<MainUnitDetailsValues>) => {
    setMainValues((current) => ({ ...current, ...patch }));
  };

  const handleSubUnitChange = (id: number, patch: Partial<SubUnitState['values']>) => {
    setSubUnits((current) =>
      current.map((subUnit) =>
        subUnit.id === id ? { ...subUnit, values: { ...subUnit.values, ...patch } } : subUnit,
      ),
    );
  };

  const handleSubUnitEnabledChange = (id: number, enabled: boolean) => {
    setSubUnits((current) =>
      current.map((subUnit) => (subUnit.id === id ? { ...subUnit, enabled } : subUnit)),
    );
  };

  const handleSubUnitDelete = (id: number) => {
    setSubUnits((current) => current.filter((subUnit) => subUnit.id !== id));
  };

  return (
    <div className='space-y-8 md:space-y-10'>
      <CustomContentHeader
        title='Add Unit'
        description='Create a new training unit with details, pricing, and validity settings.'
        onBack={onBack}
        app={APPS.TRAINING}
      />

      <UnitDetailsSection title='Unit Details' showToggle={false}>
        <MainUnitDetailsFields values={mainValues} onChange={handleMainChange} />
      </UnitDetailsSection>

      {subUnits.map((subUnit) => (
        <UnitDetailsSection
          key={subUnit.id}
          title={getSubUnitSectionTitle(subUnit.id, subUnit.type)}
          showToggle
          enabled={subUnit.enabled}
          onEnabledChange={(enabled) => handleSubUnitEnabledChange(subUnit.id, enabled)}
          onDelete={() => handleSubUnitDelete(subUnit.id)}
        >
          <SubUnitDetailsFields
            unitNumber={subUnit.id}
            unitType={subUnit.type}
            values={subUnit.values}
            onChange={(patch) => handleSubUnitChange(subUnit.id, patch)}
          />
        </UnitDetailsSection>
      ))}
    </div>
  );
}
