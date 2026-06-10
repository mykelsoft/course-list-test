// File: components/custom-ui/custom-countries-dropdown-horizontal.tsx
'use client';

import { Label } from '@radix-ui/react-label';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@radix-ui/react-tooltip';
import { InfoIcon } from 'lucide-react';
import * as React from 'react';
import countriesDataFull from 'world-countries';

import CustomComboBox from '@/components/custom-ui/custom-combobox';
import type { CustomComboBoxItem } from '@/components/custom-ui/custom-combobox';

// --- FIXED IMPORT: Direct import ---
// No import * as Custom from '@/components/custom-ui';
// ---------------------------------

const countryArr = countriesDataFull
  .map((country) => ({
    code: country.cca2,
    name: country.name.common,
  }))
  .filter((country) => country.code && country.name);

const sortedCountries = countryArr.sort((a, b) => a.name.localeCompare(b.name));

const countryItems: CustomComboBoxItem[] = sortedCountries.map((country) => ({
  value: country.code,
  label: country.name,
}));

type CustomCountriesDropdownHorizontalProps = {
  label: string;
  tooltip?: string;
  errorMessage?: string;
  items?: CustomComboBoxItem[];
  value?: string;
  onChange?: (value: string | number | null) => void;
  placeholder?: string;
  width?: string;
  labelWidth?: string;
  disabled?: boolean;
};

export function CustomCountriesDropdownHorizontal({
  label,
  tooltip,
  errorMessage, // Note: This prop was here but unused in original if Custom was removed
  items,
  value,
  onChange,
  placeholder = 'Select a country',
  width = 'w-full',
  labelWidth = 'w-50',
  disabled,
}: CustomCountriesDropdownHorizontalProps) {
  const itemsArr = countryItems.filter((item) =>
    items?.some((i) => i.value === item.value)
  );

  return (
    <div className="w-full flex flex-row items-center gap-4">
      <div className="w-50 flex flex-col items-center">
        {label && (
          <Label className={`shrink-0 text-sm font-medium ${labelWidth}`}>
            <div className="flex flex-row items-center gap-2">
              {label}
              {tooltip && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="w-4 h-4 text-[var(--primary)]" />
                  </TooltipTrigger>
                  <TooltipContent>{tooltip}</TooltipContent>
                </Tooltip>
              )}
            </div>
          </Label>
        )}
      </div>
      <div className={`flex-grow ${width}`}>
        <CustomComboBox
          label=""
          items={itemsArr.length > 0 ? itemsArr : countryItems}
          selectedItemValue={value || null}
          onSelect={(selectedValue) => {
            if (onChange && selectedValue !== null) {
              onChange(selectedValue.toString());
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          validationError={errorMessage}
          containerClassName="m-0"
          orientation="horizontal"
        />
      </div>
    </div>
  );
}
