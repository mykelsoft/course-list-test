// components/custom-ui/custom-checkbox.tsx
import React from 'react';

import CustomErrorMessage from './custom-error-message';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

// --- MODIFICATION START: Update props to accept and forward any extra props ---
type CustomCheckboxProps = Omit<
  React.ComponentPropsWithoutRef<'label'>,
  'onCheckedChange'
> & {
  label?: string;
  name: string;
  checked?: boolean;
  validationError?: string;
  containerClassName?: string;
  labelClassName?: string;
  checkboxClassName?: string;
  errorMessageClassName?: string;
  activeBgColor?: string;
  onCheckedChange?: (checked: boolean) => void;
};

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  label,
  name,
  checked = false,
  validationError,
  containerClassName = '',
  labelClassName = '',
  checkboxClassName = '',
  errorMessageClassName = '',
  activeBgColor,
  onCheckedChange,
  ...rest // <-- Collect any extra props passed down (e.g., from TooltipTrigger)
}) => {
  // --- MODIFICATION END ---
  return (
    <div className="flex flex-col gap-1">
      <Label
        htmlFor={name}
        className={cn(
          'group flex items-center space-x-2 text-sm p-1.5 rounded-sm hover:bg-secondary cursor-pointer transition-colors',
          checked && 'text-primary',
          containerClassName
        )}
        // --- MODIFICATION START: Spread the forwarded props onto the Label ---
        {...rest}
        // --- MODIFICATION END ---
      >
        <div className="flex">
          <Checkbox
            id={name}
            name={name}
            checked={checked}
            onCheckedChange={onCheckedChange}
            style={
              activeBgColor
                ? ({ '--active-bg': activeBgColor } as React.CSSProperties)
                : undefined
            }
            className={cn(
              'custom-checkbox data-[state=checked]:bg-[var(--active-bg)] group-hover:border-primary',
              checkboxClassName
            )}
          />
        </div>
        <div className="flex-1">
          {label && (
            <span className={cn('group-hover:text-primary', labelClassName)}>
              {label}
            </span>
          )}
        </div>
      </Label>
      {validationError && (
        <CustomErrorMessage
          errorMessage={validationError}
          className={errorMessageClassName}
        />
      )}
      <style jsx global>{`
        .custom-checkbox .checkbox-indicator svg,
        .custom-checkbox [data-state='checked'] svg {
          display: none !important;
        }
      `}</style>
    </div>
  );
};

export default CustomCheckbox;
