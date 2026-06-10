// components/custom-ui/custom-combobox.tsx
'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import React, { useState } from 'react'; // Removed unused refs and effects for this solution
import CustomErrorMessage from './custom-error-message';
import { cn } from '@/lib/utils';

import { Label } from '../ui/label';
import { Popover, PopoverContent, PopoverTrigger } from './../ui/popover'; // Ensure PopoverContent is imported
import { Button } from './../ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './../ui/command';
import countriesDataFull from 'world-countries'; // Import the data
import { Glowing } from '@/components/custom-ui/styling/glowing'; // Adjust this path as necessary
import { APPS } from '#types/ENUMS.ts';

const countryArr = countriesDataFull
  .map((country) => ({
    code: country.cca2, // Use cca2 for the value
    name: country.name.common, // Use official name for display, or country.name.common
    flag: country.flag,
  }))
  .filter((country) => country.code && country.name); // Ensure code and name are present

// Sort the array alphabetically by country name
const sortedCountries = countryArr.sort((a, b) => a.name.localeCompare(b.name));

export type CustomCountriesDropdownItem = {
  value: string;
  label: string;
  flag: string;
};

const customCountriesDropdownItems: CustomCountriesDropdownItem[] =
  sortedCountries.map((country) => ({
    value: country.code,
    label: country.name,
    flag: country.flag,
  }));

type CustomCountriesDropdownProps = {
  app?: APPS | null;
  label?: string;
  countries?: any[];
  selectedItemValue: CustomCountriesDropdownItem | null;
  hasValidationError?: boolean;
  validationError?: string;
  onSelect: (value: CustomCountriesDropdownItem | null) => void;
  placeholder?: string;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
};

const CustomCountriesDropdown: React.FC<CustomCountriesDropdownProps> = ({
  app = APPS.PORTAL,
  label = '',
  selectedItemValue,
  hasValidationError = true,
  validationError,
  onSelect,
  disabled = false,
  countries,
  className = '',
}) => {
  const [open, setOpen] = useState(false);

  const countriesToDisplay = () => {
    if (countries && countries.length > 0) {
      // Map the provided countries to match CustomCountriesDropdownItem structure
      return countries.map((country) => ({
        value: country.code,
        label: country.name,
        flag: countryArr.find((c) => c.code === country.code)?.flag || '🏳️', // Fallback flag if not found
      }));
    }
    return customCountriesDropdownItems;
  };

  return (
    <div className="w-full flex flex-col items-start gap-2">
      <div className="w-full flex flex-col items-start gap-2">
        {label && <Label>{label}</Label>}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={`w-full h-10 ${className} justify-between hover:bg-[var(--highlight)] hover:text-[var(--primary)] ${app ? Glowing(app).dropdown : ''} overflow-hidden`}
              disabled={disabled}
            >
              {/* Display the found label or placeholder */}
              {selectedItemValue === null ? (
                `Select ${label || ''}...`
              ) : (
                <div className="flex flex-row items-center gap-2 flex-1 min-w-0 overflow-hidden">
                  <span className="text-2xl shrink-0">
                    {selectedItemValue.flag}
                  </span>
                  <span className="text-sm text-gray-300 shrink-0">|</span>
                  <span className="text-sm block truncate max-w-full">
                    {selectedItemValue.label}
                  </span>
                </div>
              )}

              <ChevronsUpDown className="opacity-50 ml-2 h-4 w-4 shrink-0" />
            </Button>
          </PopoverTrigger>
          {!disabled && (
            <PopoverContent
              className={`p-0 m-0 ${app ? Glowing(app).dropdown : ''}`}
              style={{ width: 'var(--radix-popover-trigger-width)' }}
              align="start"
            >
              <Command className="w-full">
                <CommandInput
                  placeholder={`Search ${label}...`}
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>
                    {label ? `No ${label?.toLowerCase()} ` : `None `} found.
                  </CommandEmpty>
                  <CommandGroup className="!p-0 !m-0">
                    {/* --- MODIFIED: Iterate over items with value/label --- */}
                    {countriesToDisplay().map((item) => (
                      <CommandItem
                        key={item.value.toString()}
                        value={item.label}
                        onSelect={() => {
                          onSelect(
                            item.value === selectedItemValue?.value
                              ? null
                              : item
                          );
                          setOpen(false);
                        }}
                        className="!data-[highlighted=true]:bg-red-500 !data-[highlighted=true]:text-white !hover:bg-red-500 !hover:text-white cursor-pointer"
                      >
                        <div className="flex flex-row items-center gap-2">
                          <span className="text-xl">{item.flag}</span>
                          {item.label}
                        </div>
                        <Check
                          className={cn(
                            'ml-auto h-4 w-4',
                            selectedItemValue?.value === item.value
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                        />
                      </CommandItem>
                    ))}
                    {/* --- END MODIFIED --- */}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          )}
        </Popover>
      </div>
      {hasValidationError && (
        <div className="w-full flex flex-row items-start">
          <div className=" h-4" />
          {validationError && (
            <CustomErrorMessage errorMessage={validationError} />
          )}
        </div>
      )}
    </div>
  );
};

export default CustomCountriesDropdown;
