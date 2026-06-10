// File: ./components/custom-ui/custom-multiselect-collapsible.tsx
'use client';

import { Checkbox } from '@/components/ui/checkbox';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Separator } from '@/components/ui/separator';
import { APPS } from '@/types/ENUMS';
import { cn } from '@/lib/utils';
import { ChevronsUpDown, SearchIcon } from 'lucide-react';
import React, { useState } from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { Button } from '../ui/button';
import { Glowing } from './styling/glowing';
import * as Collapsible from '@radix-ui/react-collapsible';

export type MultiSelectPopoverItem = {
  value: string | number;
  label: string;
};

type CustomMultiSelectCollapsibleProps = {
  triggerText: React.ReactNode;
  titleForSearch: string;
  items: MultiSelectPopoverItem[];
  selectedItems: (string | number)[];
  onToggleItem: (value: string | number) => void;
  onSelectAll: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  app?: APPS;
  disabled?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  emptyMessage?: string;
};

const CustomMultiSelectCollapsible: React.FC<
  CustomMultiSelectCollapsibleProps
> = ({
  triggerText,
  titleForSearch,
  items,
  selectedItems,
  onToggleItem,
  onSelectAll,
  searchTerm,
  setSearchTerm,
  app = APPS.PORTAL,
  disabled = false,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  emptyMessage,
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

  const checkboxHoverClasses = isPoliciesTheme
    ? 'group-hover:border-[var(--policiesAndProcedures-primary)]'
    : isFormsTheme
      ? 'group-hover:border-[var(--forms-primary)]'
      : 'group-hover:border-primary';

  const checkboxCheckedClasses = isPoliciesTheme
    ? 'data-[state=checked]:bg-[var(--policiesAndProcedures-primary)] data-[state=checked]:border-[var(--policiesAndProcedures-primary)]'
    : isFormsTheme
      ? 'data-[state=checked]:bg-[var(--forms-primary)] data-[state=checked]:border-[var(--forms-primary)]'
      : 'data-[state=checked]:bg-primary data-[state=checked]:border-primary';

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
                <span className="text-gray-500">
                  {emptyMessage || `No ${titleForSearch.toLowerCase()} found.`}
                </span>
              </CommandEmpty>
              <CommandGroup className="px-2">
                {items.length > 0 && (
                  <>
                    <CommandItem
                      key={`select-all-${titleForSearch.toLowerCase()}`}
                      onSelect={() => {
                        /* DO NOTHING HERE. This prevents CMDK's default behavior. */
                      }}
                      onPointerDown={(e) => {
                        e.preventDefault(); // This is the fix. It stops CMDK from processing the event further.
                        onSelectAll();
                      }}
                      className={cn(
                        'flex items-center cursor-pointer text-xs py-1.5 px-2 data-[selected]:bg-transparent group',
                        hoverClasses
                      )}
                    >
                      <Checkbox
                        checked={
                          selectedItems.length === items.length &&
                          items.length > 0
                        }
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
                          selectedItems.length === items.length &&
                            items.length > 0 &&
                            textSelectedClasses
                        )}
                      >
                        Select All
                      </span>
                    </CommandItem>
                    <Separator className="my-0.5" />
                  </>
                )}
                {items.map((item) => (
                  <CommandItem
                    key={item.value.toString()}
                    value={item.label}
                    onSelect={() => {
                      /* DO NOTHING HERE. This prevents CMDK's default behavior. */
                    }}
                    onPointerDown={(e) => {
                      e.preventDefault(); // This is the fix. It stops CMDK from processing the event further.
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
                        selectedItems.includes(item.value) &&
                          textSelectedClasses
                      )}
                    >
                      {item.label}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export default CustomMultiSelectCollapsible;
