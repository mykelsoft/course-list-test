'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { InfoIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type UnitFormFieldRowProps = {
  label: string;
  labelSuffix?: string;
  tooltip?: string;
  labelWidth?: string;
  align?: 'center' | 'start';
  children: ReactNode;
};

export default function UnitFormFieldRow({
  label,
  labelSuffix = '',
  tooltip,
  labelWidth = 'w-[240px]',
  align = 'center',
  children,
}: UnitFormFieldRowProps) {
  const labelSuffixText = labelSuffix.trim().length > 0 ? ` (${labelSuffix})` : '';
  const alignmentClass = align === 'start' ? 'items-start' : 'items-center';

  return (
    <div className={cn('form-field-row', alignmentClass)}>
      <Label
        className={`${labelWidth} w-full shrink-0 text-sm font-medium text-[var(--gray-700)] ${align === 'start' ? 'pt-2' : ''}`}
      >
        <div className='flex flex-row items-center gap-3'>
          <span>
            {label} {labelSuffixText ? <span className='text-sm text-[var(--gray-400)]'> {labelSuffixText}</span> : null}
          </span>
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className='size-5 text-[var(--primary)]' />
                </TooltipTrigger>
                <TooltipContent>{tooltip}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </Label>
      <div className='min-w-0 flex-1'>{children}</div>
    </div>
  );
}
