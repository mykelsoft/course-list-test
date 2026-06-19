'use client';

import { ChevronDown, XIcon } from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useEffect, useMemo, useState } from 'react';

import { APPS } from '@/types/ENUMS';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import CustomButton from '@/components/custom-ui/custom-button';
import { Label } from '@/components/ui/label';
import Themes from '@/components/custom-ui/styling/Themes';
import { cn } from '@/lib/utils';

const filterCheckboxClassName =
  'size-[20px] bg-[var(--gray-50)] border-[var(--gray-300)] data-[state=checked]:bg-[#6D28D9] data-[state=checked]:border-[#4C1D95]';

type CompanyOption = { id: number; name: string };

type AddToCompanyDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  companies: CompanyOption[];
  onConfirm: (data: {
    companyIds: number[];
    addToMasterJobRole: boolean;
  }) => void;
  isLoading?: boolean;
  errorMessage?: string;
  app?: APPS;
};

function CompanyMultiSelect({
  options,
  selectedIds,
  onChange,
}: {
  options: CompanyOption[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
}) {
  const [open, setOpen] = useState(false);

  const toggleCompany = (id: number) => {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((value) => value !== id)
        : [...selectedIds, id],
    );
  };

  const displayText =
    selectedIds.length === 0
      ? 'Select company'
      : `${selectedIds.length} selected`;

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
          )}
        >
          <span className={cn('truncate', selectedIds.length === 0 && 'text-[var(--gray-400)]')}>{displayText}</span>
          <ChevronDown className='size-4 shrink-0 text-muted-foreground' />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align='start'
        className='w-[var(--radix-popover-trigger-width)] p-2 rounded-lg border-[var(--gray-300)] shadow-[0px_4px_8px_rgba(0,0,0,0.1)]'
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <div className='flex max-h-48 flex-col gap-1 overflow-y-auto'>
          {options.map((option) => {
            const isChecked = selectedIds.includes(option.id);
            return (
              <label
                key={option.id}
                className='h-[37px] group flex cursor-pointer items-center gap-2 border border-none rounded px-2 py-1.5 hover:bg-[var(--primary)]/10 hover:border-[var(--primary)] hover:text-[var(--primary)]'
              >
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={() => toggleCompany(option.id)}
                  className={filterCheckboxClassName}
                />
                <span
                  className={cn(
                    'text-sm leading-normal',
                    isChecked ? 'text-primary' : 'text-[var(--gray-700)] group-hover:text-primary',
                  )}
                >
                  {option.name}
                </span>
              </label>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function AddToCompanyDialog({
  isOpen,
  setIsOpen,
  companies,
  onConfirm,
  isLoading = false,
  errorMessage,
  app = APPS.TRAINING,
}: AddToCompanyDialogProps) {
  const [selectedCompanyIds, setSelectedCompanyIds] = useState<number[]>([]);
  const [addToMasterJobRole, setAddToMasterJobRole] = useState(false);

  const theme = Themes(app);

  const companyOptions = useMemo(
    () => companies.map((company) => ({ id: company.id, name: company.name })),
    [companies],
  );

  useEffect(() => {
    if (!isOpen) {
      setSelectedCompanyIds([]);
      setAddToMasterJobRole(false);
    }
  }, [isOpen]);

  const handleConfirm = () => {
    onConfirm({
      companyIds: selectedCompanyIds,
      addToMasterJobRole,
    });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogContent className='p-0 m-0 max-w-[408px] sm:max-w-[560px] gap-0 border-[var(--gray-200)] shadow-[0px_4px_8px_rgba(0,0,0,0.1)]'>
        <DialogHeader className='px-4 py-3 md:px-6 md:py-4 min-h-[62px] md:min-h-[78px] flex flex-row items-center justify-between gap-2 shadow-[inset_0_-1px_0_0_var(--gray-200)]'>
          <DialogTitle className='text-base font-semibold leading-normal text-[var(--gray-800)]'>Add to Company</DialogTitle>
          <DialogClose asChild>
            <Button
              variant='ghost'
              size='icon'
              className={`size-[30px] p-1.5 text-[var(--gray-700)] rounded ${theme.button.ghost} cursor-pointer`}
              aria-label='Close dialog'
              onClick={() => setIsOpen(false)}
            >
              <XIcon className='size-[18px]' />
            </Button>
          </DialogClose>
        </DialogHeader>

        <div className='bg-[var(--gray-50)] md:pt-6 pb-6 md:pb-8 md:px-6 px-4 pt-4'>
          <div className='flex flex-col gap-8'>
            <div className='flex flex-col gap-1'>
              <Label className='text-sm font-medium leading-normal text-[var(--gray-700)]'>Select Company</Label>
              <CompanyMultiSelect
                options={companyOptions}
                selectedIds={selectedCompanyIds}
                onChange={setSelectedCompanyIds}
              />
            </div>

            <div className='flex items-center gap-7'>
              <Label className='text-sm font-medium leading-normal text-[var(--gray-700)]'>Add to Master Job Role?</Label>
              <label className='flex cursor-pointer items-center gap-2'>
                <Checkbox
                  checked={addToMasterJobRole}
                  onCheckedChange={(checked) => setAddToMasterJobRole(checked === true)}
                  className='size-5 border-[var(--gray-300)]'
                />
                <span className='text-sm leading-normal text-[var(--gray-700)]'>Check for Yes</span>
              </label>
            </div>
          </div>
        </div>

        <DialogFooter className='grid grid-cols-2 gap-4 md:gap-6 p-4 md:p-6 shadow-[inset_0_1px_0_0_var(--gray-200)]'>
          <CustomButton
            variant='outline'
            app={app}
            title='Cancel'
            onClick={() => setIsOpen(false)}
            buttonClass='cursor-pointer text-sm rounded-md leading-normal font-semibold'
          />
          <CustomButton
            app={app}
            type='button'
            title='Confirm'
            isLoading={isLoading}
            onClick={handleConfirm}
            buttonClass='cursor-pointer text-sm rounded-md leading-normal font-semibold'
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
