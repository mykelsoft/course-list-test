'use client';

import CustomButton from '@/components/custom-ui/custom-button';
import CustomContentHeader from '@/components/custom-ui/custom-content-header';
import { BUTTON_VARIANTS } from '@/components/custom-ui/button-variants';
import {
  MainUnitDetailsFields,
  SubUnitDetailsFields,
  UnitDetailsSection,
  UnitJobRolesSection,
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
        title='Add Job Role'
        description='Create a new job role and assign units.'
        onBack={onBack}
        app={APPS.TRAINING}
      />

      <UnitJobRolesSection />

      <div className='flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-2.5 pt-2'>
        <CustomButton
          title='Save'
          app={APPS.TRAINING}
          variant={BUTTON_VARIANTS.OUTLINE}
          width='w-[65px]'
          buttonClass='px-3.5 bg-transparent'
          onClick={() => {}}
        />
        <CustomButton
          title='Save and Close'
          app={APPS.TRAINING}
          width='w-[136px]'
          onClick={() => {}}
        />
      </div>
    </div>
  );
}
