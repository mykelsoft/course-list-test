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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  EMPTY_COURSE_FILTERS,
  type CourseFilters,
} from '@/hooks/useCoursesTable';
import { cn } from '@/lib/utils';
import { APPS } from '@/types/ENUMS';

const LAST_MODIFIED_OPTIONS = [
  'All',
  'Today',
  'Yesterday',
  'Last 7 Days',
  'Last 30 Days',
] as const;

const filterCheckboxClassName =
  'size-[20px] bg-[var(--gray-50)] border-[#8B5CF6] data-[state=checked]:bg-[#6D28D9] data-[state=checked]:border-[#4C1D95]';

type CourseFiltersPopoverProps = {
  app?: APPS;
  filters: CourseFilters;
  companyOptions: { id: number; name: string }[];
  onApply: (filters: CourseFilters) => void;
};

function FilterFieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <Label className='text-sm font-medium text-[var(--gray-700)]'>
      {children}
    </Label>
  );
}

function FilterMultiSelect({
  placeholder,
  options,
  selected,
  onChange,
}: {
  placeholder: string;
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (values: string[]) => void;
}) {
  const [open, setOpen] = useState(false);

  const toggleValue = (value: string) => {
    onChange(
      selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value],
    );
  };

  const displayText =
    selected.length === 0
      ? placeholder
      : `${selected.length} selected`;

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger asChild>
        <button
          type='button'
          className='flex h-[37px] w-full items-center justify-between rounded-md border border-[var(--gray-300)] bg-transparent px-3 py-2 text-sm text-[var(--gray-800)] outline-none transition-[color,box-shadow] focus-visible:ring-1 focus-visible:ring-primary'
        >
          <span
            className={cn(
              'truncate',
              selected.length === 0 && 'text-[var(--gray-400)]',
            )}
          >
            {displayText}
          </span>
          <ChevronDown className='size-4 shrink-0 text-muted-foreground' />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align='start'
        className='w-[var(--radix-popover-trigger-width)] p-2'
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <div className='flex max-h-48 flex-col gap-1 overflow-y-auto'>
          {options.map((option) => {
            const isChecked = selected.includes(option.value);
            return (
              <label
                key={option.value}
                className='flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 hover:bg-accent'
              >
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={() => toggleValue(option.value)}
                  className={filterCheckboxClassName}
                />
                <span
                  className={cn(
                    'text-sm',
                    isChecked
                      ? 'font-medium text-primary'
                      : 'text-[var(--gray-700)]',
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
  companyOptions,
}: {
  draft: CourseFilters;
  onDraftChange: (filters: CourseFilters) => void;
  onResetAll: () => void;
  onCancel: () => void;
  onApply: () => void;
  app: APPS;
  companyOptions: { id: number; name: string }[];
}) {
  const companySelectOptions = companyOptions.map((company) => ({
    value: company.name,
    label: company.name,
  }));

  const parseUnitsValue = (value: string): number | '' => {
    if (value.trim() === '') {
      return '';
    }
    const parsed = Number(value);
    return Number.isNaN(parsed) ? '' : parsed;
  };

  return (
    <div className='flex flex-col p-4 gap-6'>
      <div className='flex items-center justify-between gap-3 pb-4 border-b border-[var(--gray-200)]'>
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

      <div className='flex flex-col gap-6'>
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
          <div className='flex flex-col gap-1.5'>
            <FilterFieldLabel>Company</FilterFieldLabel>
            <FilterMultiSelect
              placeholder='Select company'
              options={companySelectOptions}
              selected={draft.companies}
              onChange={(companies) => onDraftChange({ ...draft, companies })}
            />
          </div>

          <div className='flex flex-col gap-1.5'>
            <FilterFieldLabel>Assigned to Company</FilterFieldLabel>
            <div className='flex items-center gap-6 pt-1'>
              <label className='flex cursor-pointer items-center gap-2'>
                <Checkbox
                  checked={draft.hasCompany}
                  onCheckedChange={(checked) =>
                    onDraftChange({
                      ...draft,
                      hasCompany: checked === true,
                    })
                  }
                  className={filterCheckboxClassName}
                />
                <span className='text-sm leading-normal text-[var(--gray-700)]'>Yes</span>
              </label>
              <label className='flex cursor-pointer items-center gap-2'>
                <Checkbox
                  checked={draft.noCompany}
                  onCheckedChange={(checked) =>
                    onDraftChange({
                      ...draft,
                      noCompany: checked === true,
                    })
                  }
                  className={filterCheckboxClassName}
                />
                <span className='text-sm leading-normal text-[var(--gray-700)]'>No</span>
              </label>
            </div>
          </div>

          <div className='flex flex-col gap-1.5'>
            <FilterFieldLabel>Min Total Units</FilterFieldLabel>
            <Input
              type='number'
              min={0}
              placeholder='Any'
              value={draft.minUnits === '' ? '' : String(draft.minUnits)}
              onChange={(event) =>
                onDraftChange({
                  ...draft,
                  minUnits: parseUnitsValue(event.target.value),
                })
              }
              className='h-[37px] border-[var(--gray-300)] rounded-md'
            />
          </div>

          <div className='flex flex-col gap-1.5'>
            <FilterFieldLabel>Max Total Units</FilterFieldLabel>
            <Input
              type='number'
              min={0}
              placeholder='Any'
              value={draft.maxUnits === '' ? '' : String(draft.maxUnits)}
              onChange={(event) =>
                onDraftChange({
                  ...draft,
                  maxUnits: parseUnitsValue(event.target.value),
                })
              }
              className='h-[37px] border-[var(--gray-300)] rounded-md'
            />
          </div>
        </div>

        <div className='flex flex-col gap-1.5'>
          <FilterFieldLabel>Last Modified</FilterFieldLabel>
          <Select
            value={draft.lastModified}
            onValueChange={(lastModified) => onDraftChange({ ...draft, lastModified })}
          >
            <SelectTrigger className='h-[37px] border-[var(--gray-300)] rounded-md w-full'>
              <SelectValue
                placeholder='All'
                className='text-sm leading-normal text-[var(--gray-400)]'
              />
            </SelectTrigger>
            <SelectContent>
              {LAST_MODIFIED_OPTIONS.map((option) => (
                <SelectItem
                  key={option}
                  value={option}
                >
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

export function CourseFiltersPopover({
  app = APPS.TRAINING,
  filters,
  companyOptions,
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
        className='w-[min(100vw-2rem,408px)] p-0 shadow-[0px_4px_8px_rgba(0,0,0,0.1)]'
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <CourseFiltersPanel
          draft={draft}
          onDraftChange={setDraft}
          onResetAll={handleResetAll}
          onCancel={handleCancel}
          onApply={handleApply}
          app={app}
          companyOptions={companyOptions}
        />
      </PopoverContent>
    </Popover>
    </>
  );
}
