'use client';

import { ChevronDown, Filter } from 'lucide-react';
import React, { useState } from 'react';
import { createPortal } from 'react-dom';

import CustomButton from '@/components/custom-ui/custom-button';
import { BUTTON_VARIANTS } from '@/components/custom-ui/button-variants';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  EMPTY_COURSE_FILTERS,
  type CourseFilters,
} from '@/hooks/useCoursesTable';
import { cn } from '@/lib/utils';
import { APPS } from '@/types/ENUMS';
import { Separator } from '@/components/ui/separator';

const filterCheckboxClassName =
  'size-[20px] bg-[var(--gray-50)] border-[var(--gray-300)] data-[state=checked]:bg-[var(--training-primary)] data-[state=checked]:border-[var(--training-primary-shadow)]';

type CourseFiltersPopoverProps = {
  app?: APPS;
  filters: CourseFilters;
  unitTypeOptions: string[];
  onApply: (filters: CourseFilters) => void;
};

function FilterFieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <Label className='text-sm font-medium leading-normal text-[var(--gray-700)]'>
      {children}
    </Label>
  );
}

function FilterMultiSelect({
  placeholder,
  options,
  selected,
  onChange,
  triggerClassName,
}: {
  placeholder: string;
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (values: string[]) => void;
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(false);

  const toggleValue = (value: string) => {
    onChange(
      selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value],
    );
  };

  const allValues = options.map((option) => option.value);
  const allSelected = options.length > 0 && selected.length === options.length;
  const someSelected = selected.length > 0 && selected.length < options.length;

  const toggleSelectAll = () => {
    onChange(allSelected ? [] : allValues);
  };

  const displayText =
    selected.length === 0
      ? placeholder
      : `${selected.length} selected`;

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      modal={false}
    >
      <PopoverTrigger asChild>
        <button
          type='button'
          className={cn(
            'flex h-[37px] w-full items-center justify-between rounded-md border border-[var(--gray-300)] bg-white px-3 py-2 text-sm text-[var(--gray-800)] outline-none transition-[color,box-shadow] focus-visible:ring-1 focus-visible:ring-primary',
            triggerClassName,
          )}
        >
          <span className={cn('truncate', selected.length === 0 && 'text-[var(--gray-400)]')}>{displayText}</span>
          <ChevronDown className='size-4 shrink-0 text-muted-foreground' />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align='start'
        className='w-[var(--radix-popover-trigger-width)] p-2 rounded-lg border-[var(--gray-300)] shadow-[0px_4px_8px_rgba(0,0,0,0.1)]'
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <div className='flex flex-col gap-1 overflow-y-auto'>
          {options.length > 0 ? (
            <label className='h-[37px] group flex cursor-pointer items-center gap-2 border border-none rounded px-2 py-1.5 hover:bg-[var(--primary)]/10 hover:border-[var(--primary)] hover:text-[var(--primary)]'>
              <Checkbox
                checked={allSelected ? true : someSelected ? 'indeterminate' : false}
                onCheckedChange={toggleSelectAll}
                className={filterCheckboxClassName}
              />
              <span
                className={cn(
                  'text-sm leading-normal',
                  allSelected ? 'text-primary' : 'text-[var(--gray-700)] group-hover:text-primary',
                )}
              >
                Select All
              </span>
            </label>
          ) : null}

          <Separator />

          {options.map((option) => {
            const isChecked = selected.includes(option.value);
            return (
              <label
                key={option.value}
                className='h-[37px] group flex cursor-pointer items-center gap-2 border border-none rounded px-2 py-1.5 hover:bg-[var(--primary)]/10 hover:border-[var(--primary)] hover:text-[var(--primary)]'
              >
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={() => toggleValue(option.value)}
                  className={filterCheckboxClassName}
                />
                <span
                  className={cn(
                    'text-sm leading-normal',
                    isChecked ? 'text-primary' : 'text-[var(--gray-700)] group-hover:text-primary',
                  )}
                >
                  {option.label}
                </span>
              </label>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function CourseFiltersPanel({
  draft,
  onDraftChange,
  onResetAll,
  onCancel,
  onApply,
  app,
  unitTypeOptions,
}: {
  draft: CourseFilters;
  onDraftChange: (filters: CourseFilters) => void;
  onResetAll: () => void;
  onCancel: () => void;
  onApply: () => void;
  app: APPS;
  unitTypeOptions: string[];
}) {
  const unitTypeSelectOptions = unitTypeOptions.map((unitType) => ({
    value: unitType,
    label: unitType,
  }));

  const parsePriceValue = (value: string): number | '' => {
    if (value.trim() === '') {
      return '';
    }
    const parsed = Number(value);
    return Number.isNaN(parsed) ? '' : parsed;
  };

  const priceInputClassName =
    'h-[37px] rounded-md border-[var(--gray-300)] bg-[var(--gray-50)] placeholder:text-[var(--gray-400)] px-3 py-2';

  return (
    <div className='flex flex-col p-4 gap-6'>
      <div>
        <div className='flex items-center justify-between gap-3 pb-4'>
          <CustomButton
            title='Reset All'
            variant={BUTTON_VARIANTS.OUTLINE}
            app={app}
            onClick={onResetAll}
            width='w-auto'
            buttonClass='px-2 w-[92px] font-semibold'
          />
          <div className='flex items-center gap-2'>
            <CustomButton
              title='Cancel'
              variant={BUTTON_VARIANTS.OUTLINE}
              app={app}
              onClick={onCancel}
              width='w-auto'
              buttonClass='w-[80px] px-2 font-semibold'
            />
            <CustomButton
              title='Apply'
              variant={BUTTON_VARIANTS.PRIMARY}
              app={app}
              onClick={onApply}
              width='w-auto'
              buttonClass='w-[100px] px-2 font-semibold'
            />
          </div>
        </div>

        <Separator className='bg-[var(--gray-200)]' />
      </div>
      
      <div className='flex flex-col gap-6'>
        <div className='flex flex-col gap-1'>
          <FilterFieldLabel>Unit Type</FilterFieldLabel>
          <FilterMultiSelect
            placeholder='Select unit type'
            options={unitTypeSelectOptions}
            selected={draft.unitTypes}
            onChange={(unitTypes) => onDraftChange({ ...draft, unitTypes })}
          />
        </div>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <div className='flex flex-col gap-1'>
            <FilterFieldLabel>Minimum Unit Price</FilterFieldLabel>
            <Input
              type='number'
              min={0}
              step='0.01'
              placeholder='Enter Unit Price'
              value={draft.minUnitPrice === '' ? '' : String(draft.minUnitPrice)}
              onChange={(event) =>
                onDraftChange({
                  ...draft,
                  minUnitPrice: parsePriceValue(event.target.value),
                })
              }
              className={priceInputClassName}
            />
          </div>

          <div className='flex flex-col gap-1'>
            <FilterFieldLabel>Max Unit Price</FilterFieldLabel>
            <Input
              type='number'
              min={0}
              step='0.01'
              placeholder='Enter Unit Price'
              value={draft.maxUnitPrice === '' ? '' : String(draft.maxUnitPrice)}
              onChange={(event) =>
                onDraftChange({
                  ...draft,
                  maxUnitPrice: parsePriceValue(event.target.value),
                })
              }
              className={priceInputClassName}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CourseFiltersPopover({
  app = APPS.TRAINING,
  filters,
  unitTypeOptions,
  onApply,
}: CourseFiltersPopoverProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<CourseFilters>(filters);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setDraft(filters);
    }
    setOpen(nextOpen);
  };

  const handleCancel = () => {
    setDraft(filters);
    setOpen(false);
  };

  const handleResetAll = () => {
    setDraft(EMPTY_COURSE_FILTERS);
  };

  const handleApply = () => {
    onApply(draft);
    setOpen(false);
  };

  return (
    <>
      {open &&
        createPortal(
          <button
            type='button'
            aria-label='Close filters'
            className='fixed inset-0 z-40 bg-black/15 animate-in fade-in-0 duration-200'
            onClick={() => handleOpenChange(false)}
          />,
          document.body,
        )}
      <Popover
        open={open}
        onOpenChange={handleOpenChange}
        modal
      >
        <PopoverTrigger asChild>
          <CustomButton
            title='Filters'
            leadingIcon={<Filter size={18} />}
            app={app}
            variant={BUTTON_VARIANTS.OUTLINE}
            buttonClass='font-semibold'
            type='button'
          />
        </PopoverTrigger>
        <PopoverContent
          align='start'
          sideOffset={4}
          className='w-[min(100vw-2rem,408px)] p-0 rounded-lg border-[var(--gray-300)] shadow-[0px_4px_8px_rgba(0,0,0,0.1)]'
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          <CourseFiltersPanel
            draft={draft}
            onDraftChange={setDraft}
            onResetAll={handleResetAll}
            onCancel={handleCancel}
            onApply={handleApply}
            app={app}
            unitTypeOptions={unitTypeOptions}
          />
        </PopoverContent>
      </Popover>
    </>
  );
}
