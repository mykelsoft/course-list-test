import { Checkbox } from '@/components/ui/checkbox';
import CustomErrorMessage from './custom-error-message';
import { Label } from '@/components/ui/label';
// components/custom-ui/custom-checkbox.tsx
import React from 'react';
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
    <div className='flex flex-col gap-1'>
      <Label
        htmlFor={name}
        className={cn(
          'group flex items-center space-x-2 text-sm p-1.5 rounded-sm hover:bg-[#FFA600]/10 cursor-pointer transition-colors',
          checked && 'text-[#FFA600]',
          containerClassName,
        )}
        // --- MODIFICATION START: Spread the forwarded props onto the Label ---
        {...rest}
        // --- MODIFICATION END ---
      >
        <div className='flex'>
          <Checkbox
            id={name}
            name={name}
            checked={checked}
            onCheckedChange={onCheckedChange}
            style={activeBgColor ? ({ '--active-bg': activeBgColor } as React.CSSProperties) : undefined}
            className={cn(
              'size-5 bg-[var(--gray-50)] border-[var(--gray-300)] data-[state=checked]:bg-[#FFA600] data-[state=checked]:border-[#9F6A06] group-hover:bg-white group-hover:border-[#FFA600]',
              checkboxClassName,
            )}
          />
        </div>
        <div className='flex-1'>{label && <span className={cn('font-normal text-[var(--gray-700)] group-hover:text-[#FFA600]', labelClassName)}>{label}</span>}</div>
      </Label>
      {validationError && (
        <CustomErrorMessage
          errorMessage={validationError}
          className={errorMessageClassName}
        />
      )}
      <style
        jsx
        global
      >{`
        .custom-checkbox .checkbox-indicator svg,
        .custom-checkbox [data-state='checked'] svg {
          display: none !important;
        }
      `}</style>
    </div>
  );
};

export default CustomCheckbox;
