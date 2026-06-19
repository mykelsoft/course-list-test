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
  tooltip?: string;
  optional?: boolean;
  labelWidth?: string;
  align?: 'center' | 'start';
  children: ReactNode;
};

export default function UnitFormFieldRow({
  label,
  tooltip,
  optional = false,
  labelWidth = 'w-[240px]',
  align = 'center',
  children,
}: UnitFormFieldRowProps) {
  const labelText = optional ? `${label} (optional)` : label;
  const alignmentClass = align === 'start' ? 'items-start' : 'items-center';

  return (
    <div className={cn('form-field-row', alignmentClass)}>
      <Label
        className={`${labelWidth} shrink-0 text-sm font-medium text-[var(--gray-700)] ${align === 'start' ? 'pt-2' : ''}`}
      >
        <div className='flex flex-row items-center gap-3'>
          {labelText}
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
