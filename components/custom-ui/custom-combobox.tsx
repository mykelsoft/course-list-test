// components/custom-ui/custom-combobox.tsx
'use client';

import { Check, ChevronDown, InfoIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { APPS } from '@/types/ENUMS';

import CustomErrorMessage from './custom-error-message';
import { cn } from '@/lib/utils';

import { Label } from '../ui/label';
import { Popover, PopoverContent, PopoverTrigger } from './../ui/popover';
import { Button } from './../ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './../ui/command';
import { Tooltip, TooltipContent, TooltipTrigger } from './../ui/tooltip';
import { Glowing } from '@/components/custom-ui/styling/glowing';
import Themes from '@/components/custom-ui/styling/Themes';

export type CustomComboBoxItem = {
  value: string | number;
  label: string;
};

type CustomComboBoxProps = {
  app?: APPS;
  // --- ADDED ID PROP ---
  id?: string;
  label: string;
  items: CustomComboBoxItem[];
  selectedItemValue: string | number | null;
  validationError?: string;
  tooltip?: string;
  onSelect: (value: string | number | null) => void;
  placeholder?: string;
  containerClassName?: string;
  labelClassName?: string;
  buttonClassName?: string;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
  hasErrorMessage?: boolean;
  widthRight?: string;
  widthLeft?: string;
};

const CustomComboBox: React.FC<CustomComboBoxProps> = ({
  app = APPS.PORTAL,
  id, // Destructure id
  label,
  items = [],
  selectedItemValue,
  validationError,
  tooltip,
  onSelect,
  placeholder,
  containerClassName = '',
  labelClassName = '',
  buttonClassName = '',
  disabled = false,
  orientation = 'vertical',
  hasErrorMessage,
  widthRight = 'w-full',
  widthLeft = 'w-full',
}) => {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState('');

  useEffect(() => {
    if (open) {
      setInternalValue(selectedItemValue ? String(selectedItemValue) : '');
    }
  }, [open, selectedItemValue]);

  // --- FIX #1: Custom filter function ---
  // This provides reliable, case-insensitive search logic that correctly handles all characters.
  const customFilter = (value: string, search: string): number => {
    // `value` will be the `item.label` we pass to CommandItem.
    // `search` is the user's input.
    return value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0;
  };

  const glowingJSX = Glowing(app).jsx;
  const glowingDropdownStyles = Glowing(app).dropdown;

  return (
    <div className="w-full flex flex-col items-start gap-1">
      {orientation === 'horizontal' && (
        <div
          className={`w-full flex flex-row items-center gap-1 min-w-0 max-w-full overflow-hidden ${containerClassName}`}
        >
          <style jsx global>
            {glowingJSX}
          </style>
          {label && (
            <Label
              className={`${widthLeft} ${labelClassName} min-w-0 shrink-0`}
              // Associate label with input if id is provided
              htmlFor={id}
            >
              <div className="flex flex-row items-center gap-2">
                {label}
                {tooltip && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="w-4 h-4 text-[var(--primary)] shrink-0" />
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className="bg-[var(--primary)] text-white"
                    >
                      {tooltip}
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </Label>
          )}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                // Pass id to the trigger button
                id={id}
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={cn(
                  // `justify-between shadow-none min-w-0 overflow-hidden  ${widthRight}`,
                  `justify-between shadow-none min-w-0 max-w-full overflow-hidden ${widthRight} ${Themes(app).combobox.trigger} ${glowingDropdownStyles}`,
                  buttonClassName
                )}
                disabled={disabled}
              >
                <span
                  className={cn(
                    'truncate flex-1 text-left min-w-0',
                    Themes(app).combobox.triggerText
                  )}
                >
                  {selectedItemValue !== null
                    ? items.find((item) => item.value === selectedItemValue)
                        ?.label
                    : placeholder || `Select ${label}...`}
                </span>
                <ChevronDown className="opacity-50 ml-2 h-4 w-4 shrink-0" />
              </Button>
            </PopoverTrigger>
            {!disabled && (
              <PopoverContent
                className={cn(
                  `p-0 ${widthRight} ${glowingDropdownStyles}`,
                  Themes(app).dropdownMenu.content
                )}
                style={{ width: 'var(--radix-popover-trigger-width)' }}
                align="start"
              >
                <Command
                  className="w-full"
                  value={internalValue}
                  onValueChange={setInternalValue}
                  // --- FIX #2: Apply the custom filter function ---
                  filter={customFilter}
                >
                  <CommandInput
                    placeholder={`Search ${label}...`}
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
                    <CommandGroup>
                      {(items || []).map((item) => (
                        <CommandItem
                          key={item.value.toString()}
                          value={item.label}
                          onSelect={() => {
                            onSelect(
                              item.value === selectedItemValue
                                ? null
                                : item.value
                            );
                            setOpen(false);
                          }}
                          className={cn(
                            Themes(app).dropdownMenu.item,
                            Glowing(app).dropdownItem,
                            selectedItemValue === item.value &&
                              Themes(app).dropdownMenu.itemSelected,
                            'flex items-center gap-2 min-w-0'
                          )}
                        >
                          <span className="truncate flex-1 min-w-0">
                            {item.label}
                          </span>
                          <Check
                            className={cn(
                              'h-4 w-4 shrink-0',
                              selectedItemValue === item.value
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                            style={
                              selectedItemValue === item.value
                                ? { color: 'inherit' }
                                : undefined
                            }
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            )}
          </Popover>
        </div>
      )}

      {orientation === 'vertical' && (
        <div
          className={`w-full flex flex-col items-start gap-1 ${containerClassName}`}
        >
          <style jsx global>
            {glowingJSX}
          </style>
          {label && (
            <Label 
              className={`${widthLeft} ${labelClassName} text-gray-700`}
              // Associate label with input if id is provided
              htmlFor={id}
            >
              <div className="flex flex-row items-center gap-2">
                {label}
                {tooltip && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="w-4 h-4 text-[var(--primary)]" />
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className="bg-[var(--primary)] text-white"
                    >
                      {tooltip}
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </Label>
          )}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                // Pass id to the trigger button
                id={id}
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={cn(
                  `justify-between shadow-none min-w-0 overflow-hidden ${widthRight} ${Themes(app).combobox.trigger} ${glowingDropdownStyles}`,
                  buttonClassName
                )}
                disabled={disabled}
              >
                <span
                  className={cn(
                    'truncate flex-1 text-left min-w-0',
                    Themes(app).combobox.triggerText
                  )}
                >
                  {selectedItemValue !== null
                    ? items.find((item) => item.value === selectedItemValue)
                        ?.label
                    : placeholder || `Select ${label}...`}
                </span>
                <ChevronDown className="opacity-50 ml-2 h-4 w-4 shrink-0" />
              </Button>
            </PopoverTrigger>
            {!disabled && (
              <PopoverContent
                className={`p-0 ${glowingDropdownStyles}`}
                style={{ width: 'var(--radix-popover-trigger-width)' }}
                align="start"
              >
                <Command
                  className="w-full"
                  value={internalValue}
                  onValueChange={setInternalValue}
                  // --- FIX #2: Apply the custom filter function ---
                  filter={customFilter}
                >
                  <CommandInput
                    placeholder={`Search ${label}...`}
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
                    <CommandGroup>
                      {(items || []).map((item) => (
                        <CommandItem
                          key={item.value.toString()}
                          // --- FIX #3: Tell the filter to use the LABEL, not the value ---
                          value={item.label}
                          onSelect={() => {
                            onSelect(
                              item.value === selectedItemValue
                                ? null
                                : item.value
                            );
                            setOpen(false);
                          }}
                          className={cn(
                            Themes(app).dropdownMenu.item,
                            Glowing(app).dropdownItem,
                            selectedItemValue === item.value &&
                              Themes(app).dropdownMenu.itemSelected,
                            'flex items-center gap-2 min-w-0'
                          )}
                        >
                          <span className="truncate flex-1 min-w-0">
                            {item.label}
                          </span>
                          <Check
                            className={cn(
                              'h-4 w-4 shrink-0',
                              selectedItemValue === item.value
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                            style={
                              selectedItemValue === item.value
                                ? { color: 'inherit' }
                                : undefined
                            }
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            )}
          </Popover>
        </div>
      )}

      {hasErrorMessage === true && (
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

export default CustomComboBox;
