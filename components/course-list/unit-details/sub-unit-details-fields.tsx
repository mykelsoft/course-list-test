'use client';

import CustomCheckbox from '@/components/custom-ui/custom-checkbox';
import CustomComboBox, { type CustomComboBoxItem } from '@/components/custom-ui/custom-combobox';
import CustomInputHorizontal from '@/components/custom-ui/custom-input-horizontal';
import CustomTextArea from '@/components/custom-ui/custom-textarea';
import { Button } from '@/components/ui/button';
import { APPS } from '@/types/courses';
import { getSubUnitNamePlaceholder, type SubUnitDetailsValues, type SubUnitType } from './types';
import UnitFormFieldRow from './unit-form-field-row';

const ARTICLE_OPTIONS: CustomComboBoxItem[] = [
  { value: 'article-1', label: 'Workplace Safety Guidelines' },
  { value: 'article-2', label: 'Emergency Response Procedures' },
  { value: 'article-3', label: 'Equipment Handling Standards' },
];

type SubUnitDetailsFieldsProps = {
  unitNumber: number;
  unitType: SubUnitType;
  values: SubUnitDetailsValues;
  onChange: (values: Partial<SubUnitDetailsValues>) => void;
  app?: APPS;
};

function UnitFileUploadField({
  label,
  labelSuffix,
  tooltip,
  uploadLabel = 'Upload File',
  emptyText = 'No file uploaded yet',
  onFileSelect,
  fileName,
}: {
  label: string;
  labelSuffix?: string;
  tooltip?: string;
  uploadLabel?: string;
  emptyText?: string;
  onFileSelect?: (fileName: string | null) => void;
  fileName?: string | null;
}) {
  return (
    <UnitFormFieldRow label={label} labelSuffix={labelSuffix} tooltip={tooltip} align='center'>
      <div className='flex flex-row items-center gap-2'>
        <Button
          variant='outline'
          className='relative cursor-pointer overflow-hidden rounded-sm border border-[var(--primary)] px-4 py-2 text-[var(--primary)] hover:bg-[var(--secondary)] hover:text-[var(--primary)]'
          type='button'
        >
          <input
            type='file'
            className='absolute inset-0 z-10 cursor-pointer opacity-0'
            onChange={(event) => {
              const file = event.target.files?.[0] ?? null;
              onFileSelect?.(file?.name ?? null);
            }}
          />
          {uploadLabel}
        </Button>
        <span className='max-w-[300px] truncate text-sm font-normal text-[var(--gray-400)]'>
          {fileName || emptyText}
        </span>
      </div>
    </UnitFormFieldRow>
  );
}

export default function SubUnitDetailsFields({
  unitNumber,
  unitType,
  values,
  onChange,
  app = APPS.TRAINING,
}: SubUnitDetailsFieldsProps) {
  const unitNamePlaceholder = getSubUnitNamePlaceholder(unitNumber);
  const fileUploadLabel =
    unitType === 'Scorm' ? 'Upload SCORM Package' : 'Additional Files';
  const fileUploadButtonLabel = unitType === 'Scorm' ? 'Upload File' : 'Upload File';
  const fileUploadEmptyText =
    unitType === 'Scorm' ? 'No SCORM uploaded yet' : 'No file uploaded yet';

  return (
    <div className='space-y-8 md:space-y-12'>
      <CustomInputHorizontal
        app={app}
        label='Unit Name'
        name='subUnitName'
        value={values.unitName}
        onValueChange={(unitName) => onChange({ unitName })}
        placeholder={unitNamePlaceholder}
        tooltip='Enter the name for this unit'
        labelWidth='w-[240px]'
      />

      {unitType === 'Read & Acknowledge' && (
        <CustomComboBox
          app={app}
          label='Select Article'
          items={ARTICLE_OPTIONS}
          selectedItemValue={values.selectedArticle}
          onSelect={(selectedArticle) => onChange({ selectedArticle })}
          placeholder='Select Article'
          tooltip='Select the article learners must read and acknowledge'
          orientation='horizontal'
          widthLeft='w-[240px]'
        />
      )}

      <UnitFormFieldRow
        label='Description'
        align='start'
        tooltip='Provide a description for this unit'
      >
        <CustomTextArea
          app={app}
          name='subUnitDescription'
          value={values.description}
          onValueChange={(description) => onChange({ description })}
          placeholder='Enter Description'
          rows={4}
          inputClassName='bg-[var(--gray-50)] border-[var(--gray-300)]'
        />
      </UnitFormFieldRow>

      {unitType === 'License' && (
        <UnitFormFieldRow
          label='Does License Have Expiry?'
          tooltip='Indicate whether this license expires after a set period'
        >
          <div className='flex items-center gap-6 md:gap-10'>
            <CustomCheckbox
              name='licenseHasExpiryYes'
              label='Yes'
              checked={values.licenseHasExpiry === 'yes'}
              onCheckedChange={(checked) => onChange({ licenseHasExpiry: checked ? 'yes' : null })}
            />
            <CustomCheckbox
              name='licenseHasExpiryNo'
              label='No'
              checked={values.licenseHasExpiry === 'no'}
              onCheckedChange={(checked) => onChange({ licenseHasExpiry: checked ? 'no' : null })}
            />
          </div>
        </UnitFormFieldRow>
      )}

      <UnitFileUploadField
        label={fileUploadLabel}
        labelSuffix={unitType === 'Scorm' ? undefined : 'optional'}
        tooltip={unitType === 'Scorm' ? 'Upload the SCORM package for this unit' : 'Upload any supporting files for this unit'}
        uploadLabel={fileUploadButtonLabel}
        emptyText={fileUploadEmptyText}
        fileName={values.uploadedFileName}
        onFileSelect={(uploadedFileName) => onChange({ uploadedFileName })}
      />
    </div>
  );
}
