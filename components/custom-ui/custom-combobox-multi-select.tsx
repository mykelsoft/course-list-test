// components/custom-ui/custom-combobox-multi-select.tsx
'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import React, { useState } from 'react'; // Added React import

import CustomErrorMessage from './custom-error-message';
import { cn } from '@/lib/utils';

import { Label } from '../ui/label';
import { Button } from './../ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './../ui/command';
import { Popover, PopoverContent, PopoverTrigger } from './../ui/popover';

// --- MODIFIED: Item structure ---
export type CustomComboboxMultiSelectItem = {
  value: string | number; // Can be ID or key
  label: string;
};
// --- END MODIFIED ---

export type CustomComboboxMultiSelectProps = {
  label: string;
  // --- MODIFIED: items prop type ---
  items: CustomComboboxMultiSelectItem[];
  selectedItemValues: (string | number)[]; // Array of selected values (IDs/keys)
  onSelect: (values: (string | number)[]) => void; // Passes array of values
  // --- END MODIFIED ---
  placeholder?: string;
  containerClassName?: string;
  labelClassName?: string;
  buttonClassName?: string;
  disabled?: boolean;
  validationError?: string; // Added for consistency
};

const CustomComboboxMultiSelect: React.FC<CustomComboboxMultiSelectProps> = ({
  label,
  items = [],
  selectedItemValues,
  onSelect,
  placeholder,
  containerClassName = '',
  labelClassName = '',
  buttonClassName = '',
  disabled = false,
  validationError,
}) => {
  const [open, setOpen] = useState(false);

  const toggleSelection = (value: string | number) => {
    const newValues = selectedItemValues.includes(value)
      ? selectedItemValues.filter((v) => v !== value)
      : [...selectedItemValues, value];
    onSelect(newValues);
  };

  // --- MODIFIED: Get display labels for selected values ---
  const selectedLabels = items
    .filter((item) => selectedItemValues.includes(item.value))
    .map((item) => item.label)
    .join(', ');
  // --- END MODIFIED ---

  return (
    <div className={`flex flex-col gap-1 ${containerClassName}`}>
      {label && <Label className={labelClassName}>{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              'w-full justify-between  shadow-none',
              buttonClassName
            )}
            disabled={disabled}
          >
            <span className="truncate block max-w-[calc(100%-1.5rem)]">
              {/* Display selected labels or placeholder */}
              {selectedLabels || placeholder || `Select ${label}...`}
            </span>
            <ChevronsUpDown className="opacity-50 ml-2 h-4 w-4 shrink-0" />
          </Button>
        </PopoverTrigger>
        {!disabled && (
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
            <Command>
              <CommandInput
                placeholder={`Search ${label}...`}
                className="h-9"
              />
              <CommandList>
                <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
                <CommandGroup>
                  {/* --- MODIFIED: Iterate over items with value/label --- */}
                  {(items || []).map((item) => (
                    <CommandItem
                      key={item.value.toString()}
                      value={item.label} // Use label for CMDK search
                      onSelect={() => toggleSelection(item.value)} // Toggle based on value
                    >
                      {item.label} {/* Display label */}
                      <Check
                        className={cn(
                          'ml-auto h-4 w-4',
                          selectedItemValues.includes(item.value)
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
      {validationError && <CustomErrorMessage errorMessage={validationError} />}
    </div>
  );
};

export default CustomComboboxMultiSelect;
