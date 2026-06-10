// File: ./components/custom-ui/custom-textarea.tsx
import React from 'react';

import CustomErrorMessage from './custom-error-message';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { APPS } from '@/types/ENUMS';
import { Glowing } from './styling/glowing';

import { TextArea } from '../ui/textarea';

type CustomTextAreaProps = {
  label?: React.ReactNode;
  name: string;
  value?: string;
  validationError?: string;
  rows?: number;
  cols?: number;
  width?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorMessageClassName?: string;
  onValueChange?: (value: string) => void;
  app?: APPS;
} & React.ComponentProps<'textarea'>;

const CustomTextArea: React.FC<CustomTextAreaProps> = ({
  label,
  name,
  value,
  validationError,
  rows = 5,
  cols = undefined,
  width = 'w-full',
  containerClassName = '',
  labelClassName = '',
  inputClassName = '',
  errorMessageClassName = '',
  onValueChange,
  app = APPS.PORTAL,
  ...props
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onValueChange) {
      onValueChange(event.target.value);
    }
  };

  return (
    <div className={`flex flex-col gap-1 ${containerClassName}`}>
      {label && <Label className={labelClassName}>{label}</Label>}
      {/* --- THIS IS THE FIX --- */}
      <TextArea
        rows={rows}
        cols={cols}
        name={name}
        value={value}
        className={cn(
          'min-h-[80px] resize-y',
          // 1. Add the default border color for the normal state.
          'border-[var(--table-border)]',
          // 2. Remove default focus rings so our theme can take over.
          'focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0',
          // 3. Apply width and other custom classes.
          inputClassName.includes('w-') ? '' : width,
          inputClassName,
          // 4. Apply the glowing effect, which will now correctly override the border color on focus.
          Glowing(app).inputBox
        )}
        onChange={handleChange}
        {...props}
      />
      {/* --- END FIX --- */}
      {validationError && (
        <CustomErrorMessage
          errorMessage={validationError}
          className={errorMessageClassName}
        />
      )}
    </div>
  );
};

export default CustomTextArea;
