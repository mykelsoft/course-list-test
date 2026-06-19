'use client';

import CustomAccordion from '@/components/custom-ui/custom-accordion';
import CustomButton from '@/components/custom-ui/custom-button';
import CustomContentHeader from '@/components/custom-ui/custom-content-header';
import CustomInputHorizontal from '@/components/custom-ui/custom-input-horizontal';
import CustomPickerBadge, { type PickerItem } from '@/components/custom-ui/custom-picker-badge';
import RowActionMenu from '@/components/custom-ui/custom-table/row-action-menu';
import { BUTTON_VARIANTS } from '@/components/custom-ui/button-variants';
import { APPS } from '@/types/courses';
import { ArrowUpDown, ImageIcon, Pencil, Plus, Trash2, Upload } from 'lucide-react';
import React, { useState } from 'react';

type CompanyAdmin = {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
};

const COUNTRY_OPTIONS: PickerItem[] = [
  { id: 'AU', name: 'Australia' },
  { id: 'PH', name: 'Philippines' },
  { id: 'NZ', name: 'New Zealand' },
  { id: 'US', name: 'United States' },
  { id: 'GB', name: 'United Kingdom' },
];

const DEFAULT_ADMINS: CompanyAdmin[] = [
  {
    id: 1,
    fullName: 'Jarrod Morgan',
    email: 'jarrodmorgan@gmail.com',
    phoneNumber: '123 123 123',
  },
  {
    id: 2,
    fullName: 'John Tregambe',
    email: 'johntregambe@yoursafetypartners.com.au',
    phoneNumber: '123 123 123',
  },
];

type AddCompanyFormProps = {
  onBack: () => void;
};

export default function AddCompanyForm({ onBack }: AddCompanyFormProps) {
  const [companyName, setCompanyName] = useState('Socia Tech');
  const [companySlug, setCompanySlug] = useState('');
  const [selectedCountries, setSelectedCountries] = useState<PickerItem[]>([
    COUNTRY_OPTIONS[0],
    COUNTRY_OPTIONS[1],
    COUNTRY_OPTIONS[2],
  ]);
  const [admins] = useState<CompanyAdmin[]>(DEFAULT_ADMINS);

  return (
    <div className='space-y-8 md:space-y-10'>
      <CustomContentHeader
        title='Add Company'
        description='Create a company profile to manage business details, team, and services.'
        onBack={onBack}
        app={APPS.TRAINING}
      />

      <CustomAccordion title='Company Details'>
        <div className='space-y-12'>
          <CustomInputHorizontal
            app={APPS.TRAINING}
            label='Company Name'
            name='companyName'
            value={companyName}
            onValueChange={setCompanyName}
            placeholder='Company Name'
            tooltip='Enter the official company name'
            labelWidth='w-[240px]'
          />

          <CustomInputHorizontal
            app={APPS.TRAINING}
            label='Company Slug'
            name='companySlug'
            value={companySlug}
            onValueChange={setCompanySlug}
            placeholder='Company Slug'
            tooltip='A unique URL-friendly identifier for the company'
            labelWidth='w-[240px]'
          />

          <CustomPickerBadge
            app={APPS.TRAINING}
            label='Company Country'
            tooltip='Select the countries where the company operates'
            items={COUNTRY_OPTIONS}
            selectedItems={selectedCountries}
            onSelectedItemsChange={setSelectedCountries}
            placeholder='Select countries'
          />

          <div className='flex items-center'>
            <div className='form-field-row'>
              <p className='text-sm text-[var(--gray-700)] font-medium pt-2'>Company Admin/s</p>
              <div className='flex flex-col gap-2.5 flex-1 min-w-0'>
                <div className='flex items-center gap-4'>
                  <CustomButton
                    title='Bulk Add'
                    app={APPS.TRAINING}
                    variant={BUTTON_VARIANTS.OUTLINE}
                    width='w-auto'
                    buttonClass='px-4'
                    onClick={() => {}}
                  />
                  <CustomButton
                    title='Add Company Admin'
                    leadingIcon={<Plus className='size-3.5' />}
                    app={APPS.TRAINING}
                    width='w-auto'
                    buttonClass='px-4'
                    onClick={() => {}}
                  />
                </div>

                <div className='overflow-hidden rounded border border-[var(--gray-300)]'>
                  <table className='w-full'>
                    <thead>
                      <tr className='border-b border-[var(--gray-300)] bg-[var(--gray-200)]'>
                        {['Full Name', 'Email', 'Phone Number', 'Actions'].map((header) => (
                          <th
                            key={header}
                            className='px-4 py-3 text-left text-sm font-semibold text-[var(--gray-800)]'
                          >
                            <div className='flex items-center gap-1'>
                              {header}
                              {header !== 'Actions' && <ArrowUpDown className='size-3.5 text-[var(--gray-500)]' />}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {admins.map((admin) => (
                        <tr
                          key={admin.id}
                          className='border-b border-[var(--gray-200)] last:border-b-0 hover:bg-gray-50'
                        >
                          <td className='px-4 py-3 text-sm text-gray-600'>{admin.fullName}</td>
                          <td className='px-4 py-3 text-sm text-gray-600'>{admin.email}</td>
                          <td className='px-4 py-3 text-sm text-gray-600'>{admin.phoneNumber}</td>
                          <td className='px-4 py-3 text-right'>
                            <RowActionMenu
                              app={APPS.TRAINING}
                              menuItems={[
                                {
                                  label: 'Edit',
                                  icon: <Pencil className='size-4' />,
                                  onClick: () => {},
                                },
                                {
                                  label: 'Delete',
                                  icon: <Trash2 className='size-4' />,
                                  onClick: () => {},
                                },
                              ]}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CustomAccordion>
    </div>
  );
}
