// File: ./components/custom-ui/custom-multiselect-popover.tsx
'use client';

import { SearchIcon } from 'lucide-react';
import React from 'react';
import { Command as CommandPrimitive } from 'cmdk';

import { Checkbox } from '@/components/ui/checkbox';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { APPS } from '@/types/ENUMS';
import { Glowing } from './styling/glowing';

export type MultiSelectPopoverItem = {
  value: string | number;
  label: string;
};

type CustomMultiSelectPopoverProps = {
  titleForSearch: string;
  items: MultiSelectPopoverItem[];
  selectedItems: (string | number)[];
  onToggleItem: (value: string | number) => void;
  onSelectAll: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  app?: APPS;
};

const CustomMultiSelectPopover: React.FC<CustomMultiSelectPopoverProps> = ({
  titleForSearch,
  items,
  selectedItems,
  onToggleItem,
  onSelectAll,
  searchTerm,
  setSearchTerm,
  app = APPS.PORTAL,
}) => {
  const isPoliciesTheme = app === APPS.POLICIES_AND_PROCEDURES;
  const isFormsTheme = app === APPS.FORMS;
  const isInspectionsTheme = app === APPS.INSPECTIONS;

  const hoverClasses = isPoliciesTheme
    ? 'hover:bg-[var(--policiesAndProcedures-highlight)] data-[highlighted]:bg-[var(--policiesAndProcedures-highlight)] hover:data-[selected=true]:bg-[var(--policiesAndProcedures-highlight)]'
    : isFormsTheme
    ? 'hover:bg-[var(--forms-highlight)] data-[highlighted]:bg-[var(--forms-highlight)] hover:data-[selected=true]:bg-[var(--forms-highlight)]'
    : isInspectionsTheme
    ? 'hover:bg-[var(--inspections-highlight)] data-[highlighted]:bg-[var(--inspections-highlight)] hover:data-[selected=true]:bg-[var(--inspections-highlight)]'
    : 'hover:bg-accent data-[highlighted]:bg-accent';

  const checkboxHoverClasses = isPoliciesTheme
    ? 'group-hover:border-[var(--policiesAndProcedures-primary)]'
    : isFormsTheme
    ? 'group-hover:border-[var(--forms-primary)]'
    : isInspectionsTheme
    ? 'group-hover:border-[var(--inspections-primary)]'
    : 'group-hover:border-primary';

  const checkboxCheckedClasses = isPoliciesTheme
    ? 'data-[state=checked]:bg-[var(--policiesAndProcedures-primary)] data-[state=checked]:border-[var(--policiesAndProcedures-primary)]'
    : isFormsTheme
    ? 'data-[state=checked]:bg-[var(--forms-primary)] data-[state=checked]:border-[var(--forms-primary)]'
    : isInspectionsTheme
    ? 'data-[state=checked]:bg-[var(--inspections-primary)] data-[state=checked]:border-[var(--inspections-primary)]'
    : 'data-[state=checked]:bg-primary data-[state=checked]:border-primary';

  const textHoverClasses = isPoliciesTheme
    ? 'group-hover:text-[var(--policiesAndProcedures-primary)] data-[highlighted]:text-[var(--policiesAndProcedures-primary)]'
    : isFormsTheme
    ? 'group-hover:text-[var(--forms-primary)] data-[highlighted]:text-[var(--forms-primary)]'
    : isInspectionsTheme
    ? 'group-hover:text-[var(--inspections-primary)] data-[highlighted]:text-[var(--inspections-primary)]'
    : 'group-hover:text-primary data-[highlighted]:text-primary';

  const textSelectedClasses = isPoliciesTheme
    ? 'text-[var(--policiesAndProcedures-primary)]'
    : isFormsTheme
    ? 'text-[var(--forms-primary)]'
    : isInspectionsTheme
    ? 'text-[var(--inspections-primary)]'
    : 'text-primary';

  return (
    <Command className="rounded-md pb-2.5">
      <div
        className={cn(
          'flex items-center gap-2 px-3 h-9 m-2 border border-[var(--table-border)] rounded-md bg-[var(--content-background)] transition-all duration-200 ease-in-out',
          Glowing(app).inputBox
        )}
      >
        <SearchIcon className="h-4 w-4 text-[var(--text-primary)]" />
        <CommandPrimitive.Input
          placeholder={`Search ${titleForSearch}`}
          value={searchTerm}
          onValueChange={setSearchTerm}
          className="w-full h-full bg-transparent border-none text-sm outline-none ring-0 focus:ring-0 placeholder:text-[#9CA3AF]"
        />
      </div>
      <CommandList className="px-2">
        <CommandEmpty>No {titleForSearch.toLowerCase()} found.</CommandEmpty>
        <CommandGroup className="px-2">
          {items.length > 0 && (
            <>
              <CommandItem
                key={`select-all-${titleForSearch.toLowerCase()}`}
                onSelect={() => {
                  // Prevent default select behavior if needed, but usually handled by onPointerDown
                }}
                onPointerDown={(e) => {
                  e.preventDefault(); // Fix for Radix/CMDK focus loop issues
                  onSelectAll();
                }}
                className={cn(
                  'flex items-center cursor-pointer text-xs py-1.5 px-2 data-[selected]:bg-transparent group',
                  hoverClasses
                )}
              >
                <Checkbox
                  checked={
                    selectedItems.length === items.length && items.length > 0
                  }
                  className={cn(
                    'mr-2 h-5 w-5',
                    checkboxHoverClasses,
                    checkboxCheckedClasses
                  )}
                />
                {/* --- THIS IS THE FIX --- */}
                <span
                  className={cn(
                    'font-light flex-grow select-none text-[14px]',
                    textHoverClasses,
                    selectedItems.length === items.length &&
                      items.length > 0 &&
                      textSelectedClasses
                  )}
                >
                  Select All
                </span>
                {/* --- END FIX --- */}
              </CommandItem>
              <Separator className="my-0.5" />
            </>
          )}
          {items.map((item) => (
            <CommandItem
              key={item.value.toString()}
              value={item.label}
              onSelect={() => {
                // Prevent default select behavior if needed
              }}
              onPointerDown={(e) => {
                e.preventDefault(); // Fix for Radix/CMDK focus loop issues
                onToggleItem(item.value);
              }}
              className={cn(
                'flex items-center cursor-pointer text-xs py-1.5 px-2 data-[selected]:bg-transparent group mb-1.5 last:mb-0',
                hoverClasses
              )}
            >
              <Checkbox
                checked={selectedItems.includes(item.value)}
                className={cn(
                  'mr-2 h-5 w-5',
                  checkboxHoverClasses,
                  checkboxCheckedClasses
                )}
              />
              <span
                className={cn(
                  'font-light flex-grow select-none text-[14px]',
                  textHoverClasses,
                  selectedItems.includes(item.value) && textSelectedClasses
                )}
              >
                {item.label}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

export default CustomMultiSelectPopover;
