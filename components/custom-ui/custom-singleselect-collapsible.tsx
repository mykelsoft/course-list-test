// File: ./components/custom-ui/custom-singleselect-collapsible.tsx
'use client';

import { Check, ChevronsUpDown, SearchIcon  } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { APPS } from '@/types/ENUMS';
import { cn } from '@/lib/utils';
import React, { useMemo, useState } from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { Button } from '../ui/button';
import { Glowing } from './styling/glowing';
import * as Collapsible from '@radix-ui/react-collapsible';

export type SingleSelectPopoverItem = {
  value: string | number;
  label: string;
};

type CustomSingleSelectCollapsibleProps = {
  triggerText: React.ReactNode;
  titleForSearch: string;
  items: SingleSelectPopoverItem[];
  selectedValue: string | number | null | undefined;
  onValueChange: (value: string | number) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  app?: APPS;
  disabled?: boolean;
  placeholder?: string; // Reserved for future use
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const CustomSingleSelectCollapsible: React.FC<
  CustomSingleSelectCollapsibleProps
> = ({
  triggerText,
  titleForSearch,
  items,
  selectedValue,
  onValueChange,
  searchTerm,
  setSearchTerm,
  app = APPS.PORTAL,
  disabled = false,
  placeholder: _placeholder, // Reserved for future use
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;
  const setIsOpen = isControlled
    ? controlledOnOpenChange || (() => {})
    : setInternalOpen;

  const isPoliciesTheme = app === APPS.POLICIES_AND_PROCEDURES;
  const isFormsTheme = app === APPS.FORMS;

  const hoverClasses = isPoliciesTheme
    ? 'hover:bg-[var(--policiesAndProcedures-highlight)] data-[highlighted]:bg-[var(--policiesAndProcedures-highlight)] hover:data-[selected=true]:bg-[var(--policiesAndProcedures-highlight)]'
    : isFormsTheme
      ? 'hover:bg-[var(--forms-highlight)] data-[highlighted]:bg-[var(--forms-highlight)] hover:data-[selected=true]:bg-[var(--forms-highlight)]'
      : 'hover:bg-accent data-[highlighted]:bg-accent';

  const textHoverClasses = isPoliciesTheme
    ? 'group-hover:text-[var(--policiesAndProcedures-primary)] data-[highlighted]:text-[var(--policiesAndProcedures-primary)]'
    : isFormsTheme
      ? 'group-hover:text-[var(--forms-primary)] data-[highlighted]:text-[var(--forms-primary)]'
      : 'group-hover:text-primary data-[highlighted]:text-primary';

  const textSelectedClasses = isPoliciesTheme
    ? 'text-[var(--policiesAndProcedures-primary)]'
    : isFormsTheme
      ? 'text-[var(--forms-primary)]'
      : 'text-primary';

  const checkIconHoverClasses = isPoliciesTheme
    ? 'group-hover:text-[var(--policiesAndProcedures-primary)] data-[highlighted]:text-[var(--policiesAndProcedures-primary)]'
    : isFormsTheme
      ? 'group-hover:text-[var(--forms-primary)] data-[highlighted]:text-[var(--forms-primary)]'
      : 'group-hover:text-primary data-[highlighted]:text-primary';

  const filteredItems = useMemo(
    () =>
      items.filter((item) =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [items, searchTerm]
  );

  const handleItemSelect = (value: string | number) => {
    onValueChange(value);
    setIsOpen(false);
  };

  return (
    <Collapsible.Root
      open={isOpen}
      onOpenChange={setIsOpen}
      disabled={disabled}
    >
      <Collapsible.Trigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          disabled={disabled}
          className={cn(
            'w-full justify-between mt-1 h-9 font-normal border-gray-300',
            isPoliciesTheme && 'hover:border-[var(--policiesAndProcedures-primary)]',
            isFormsTheme && 'hover:border-[var(--forms-primary)]',
            !isPoliciesTheme && !isFormsTheme && 'hover:border-primary'
          )}
        >
          {triggerText}
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </Button>
      </Collapsible.Trigger>
      <Collapsible.Content className="mt-1 overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
        <div className="border border-gray-200 rounded-md shadow-sm bg-white max-h-[320px] overflow-hidden flex flex-col">
          <Command className="rounded-md pb-2.5 flex flex-col max-h-full">
            <div
              className={cn(
                'flex items-center gap-2 px-3 h-9 m-2 border border-[var(--table-border)] rounded-md bg-[var(--content-background)] transition-all duration-200 ease-in-out flex-shrink-0',
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
            <CommandList className="px-2 max-h-[240px] overflow-y-auto flex-1">
              <CommandEmpty>
                No {titleForSearch.toLowerCase()} found.
              </CommandEmpty>
              <CommandGroup className="px-2">
                {filteredItems.map((item) => {
                  const isSelected = String(selectedValue) === String(item.value);
                  return (
                    <CommandItem
                      key={item.value.toString()}
                      value={item.label}
                      onSelect={() => {
                        /* DO NOTHING HERE. This prevents CMDK's default behavior. */
                      }}
                      onPointerDown={(e) => {
                        e.preventDefault();
                        handleItemSelect(item.value);
                      }}
                      className={cn(
                        'flex items-center cursor-pointer text-xs py-1.5 px-2 data-[selected]:bg-transparent group mb-1.5 last:mb-0 relative',
                        hoverClasses,
                        isFormsTheme && 'hover:text-[var(--forms-primary)] data-[highlighted]:text-[var(--forms-primary)]',
                        isPoliciesTheme && 'hover:text-[var(--policiesAndProcedures-primary)] data-[highlighted]:text-[var(--policiesAndProcedures-primary)]'
                      )}
                    >
                      <span
                        className={cn(
                          'font-light flex-grow select-none text-[14px]',
                          textHoverClasses,
                          isSelected && textSelectedClasses
                        )}
                      >
                        {item.label}
                      </span>
                      {isSelected && (
                        <Check
                          className={cn(
                            'ml-2 h-4 w-4 flex-shrink-0',
                            textSelectedClasses,
                            checkIconHoverClasses
                          )}
                        />
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export default CustomSingleSelectCollapsible;
