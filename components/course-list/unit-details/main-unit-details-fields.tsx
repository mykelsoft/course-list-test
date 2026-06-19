'use client';

import CustomComboBox, { type CustomComboBoxItem } from '@/components/custom-ui/custom-combobox';
import CustomInputHorizontal from '@/components/custom-ui/custom-input-horizontal';
import CustomTextArea from '@/components/custom-ui/custom-textarea';
import { APPS } from '@/types/courses';
import type { MainUnitDetailsValues } from './types';
import UnitFormFieldRow from './unit-form-field-row';

const UNIT_PRICE_OPTIONS: CustomComboBoxItem[] = [
  { value: 'free', label: 'Free' },
  { value: 'paid', label: 'Paid' },
];

const UNIT_TYPE_OPTIONS: CustomComboBoxItem[] = [
  { value: 'License', label: 'License' },
  { value: 'Scorm', label: 'Scorm' },
  { value: 'Read & Acknowledge', label: 'Read & Acknowledge' },
  { value: 'Assignment', label: 'Assignment' },
  { value: 'Face to Face', label: 'Face to Face' },
];

type MainUnitDetailsFieldsProps = {
  values: MainUnitDetailsValues;
  onChange: (values: Partial<MainUnitDetailsValues>) => void;
  app?: APPS;
};

export default function MainUnitDetailsFields({
  values,
  onChange,
  app = APPS.TRAINING,
}: MainUnitDetailsFieldsProps) {
  return (
    <div className='space-y-12'>
      <CustomComboBox
        app={app}
        label='Unit Price'
        items={UNIT_PRICE_OPTIONS}
        selectedItemValue={values.unitPrice}
        onSelect={(value) => onChange({ unitPrice: value ?? 'free' })}
        placeholder='Select Unit Price'
        tooltip='Choose whether this unit is free or paid'
        orientation='horizontal'
      />

      <CustomComboBox
        app={app}
        label='Unit Type'
        items={UNIT_TYPE_OPTIONS}
        selectedItemValue={values.unitType}
        onSelect={(value) => onChange({ unitType: value })}
        placeholder='Select Unit Type'
        tooltip='Select the type of training unit'
        orientation='horizontal'
      />

      <CustomInputHorizontal
        app={app}
        label='Unit Name'
        name='unitName'
        value={values.unitName}
        onValueChange={(unitName) => onChange({ unitName })}
        placeholder='Enter Unit Name'
      />

      <UnitFormFieldRow
        label='Unit Summary'
        optional
        align='start'
        tooltip='Provide a brief summary of the unit'
      >
        <CustomTextArea
          app={app}
          name='unitSummary'
          value={values.unitSummary}
          onValueChange={(unitSummary) => onChange({ unitSummary })}
          placeholder='Enter Unit Summary'
          rows={4}
          inputClassName='bg-[var(--gray-50)] border-[var(--gray-300)]'
        />
      </UnitFormFieldRow>

      <CustomInputHorizontal
        app={app}
        label='Enrollment Validity (days)'
        name='enrollmentValidityDays'
        value={values.enrollmentValidityDays}
        onValueChange={(enrollmentValidityDays) => onChange({ enrollmentValidityDays })}
        placeholder='Enter No. of Days'
        tooltip='Number of days the enrollment remains valid'
        type='number'
        min={0}
      />

      <CustomInputHorizontal
        app={app}
        label='Completion Validity (days)'
        name='completionValidityDays'
        value={values.completionValidityDays}
        onValueChange={(completionValidityDays) => onChange({ completionValidityDays })}
        placeholder='Enter No. of Days'
        tooltip='Number of days the completion remains valid'
        type='number'
        min={0}
      />
    </div>
  );
}
