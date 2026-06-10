// components/custom-ui/custom-form-label.tsx
import { Info } from 'lucide-react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { APPS } from '#types/ENUMS.ts'; // Import APPS enum
import { cn } from '@/lib/utils'; // Import cn utility

type LabelProps = {
  for: string;
  tag: string;
  tooltip?: string;
  className?: string;
  app?: APPS; // Add app prop to the type definition
};

const FormLabel = ({
  label,
  isCentered = true,
  className,
}: {
  label: LabelProps;
  isCentered?: boolean;
  className?: string;
}) => {
  const { app = APPS.PORTAL } = label; // Destructure app prop with a default

  const labelClass = `text-sm font-medium text-[#4B5563] whitespace-nowrap ${className || ''}`;
  // --- THIS IS THE FIX: Removed pt-[8px] to fix alignment in grids ---
  const labelIconContainerClass = `md:col-span-1 flex ${isCentered ? 'items-center' : 'items-start'} space-x-2`;
  // --- END FIX ---

  const infoIconColorClass =
    app === APPS.POLICIES_AND_PROCEDURES
      ? 'text-[var(--policiesAndProcedures-primary)]'
      : 'text-primary';

  const infoIconClass = cn(
    'h-4 w-4 ml-1.5 cursor-pointer flex-shrink-0',
    infoIconColorClass,
    !isCentered && 'mt-[2px]'
  );

  return (
    <div className={labelIconContainerClass}>
      <label htmlFor={label.for} className={labelClass}>
        {label.tag}
      </label>

      {label.tooltip && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger type="button">
              <Info className={infoIconClass} />
            </TooltipTrigger>
            <TooltipContent>
              <p>{label.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default FormLabel;
