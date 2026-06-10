// File: components/custom-ui/custom-input-horizontal.tsx
import { InfoIcon } from 'lucide-react';
import React from 'react';
// --- FIX: Added Path to imports ---
import type { UseFormRegister, FieldValues, Path } from 'react-hook-form';

import CustomErrorMessage from './custom-error-message';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { Input } from '../ui/input';
import Glowing from './styling/glowing';
import { APPS } from '#types/ENUMS.ts';

type CustomInputProps<TFieldValues extends FieldValues> = {
  app?: APPS;
  label?: string;
  // --- FIX: Use Path<TFieldValues> so the generic is used ---
  name: Path<TFieldValues>; 
  value?: string; 
  defaultValue?: string;
  placeholder?: string;
  tooltip?: string;
  validationError?: string;
  type?: string;
  width?: string; 
  labelWidth?: string;
  containerClassName?: string; 
  labelClassName?: string; 
  inputClassName?: string; 
  errorMessageClassName?: string; 
  onValueChange?: (value: string) => void; 
  icon?: React.ReactNode; 
  disableValidation?: boolean;
  // --- FIX: Use TFieldValues in register ---
  register?: UseFormRegister<TFieldValues>; 
} & Omit<React.ComponentProps<'input'>, 'name'>; // Omit name from base props to avoid conflict

const CustomInput = <TFieldValues extends FieldValues = FieldValues>({
  label,
  app = APPS.PORTAL,
  name,
  placeholder,
  tooltip,
  value,
  validationError,
  type = 'text',
  width = 'w-full',
  labelWidth = 'w-50',
  containerClassName = '',
  labelClassName = '',
  inputClassName = '',
  errorMessageClassName = '',
  onValueChange,
  icon,
  register,
  ...props
}: CustomInputProps<TFieldValues>) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onValueChange) {
      onValueChange(event.target.value);
    }
  };

  // Get register props if register is provided
  const registerProps = register ? register(name) : {};

  // Ensure an ID is available for accessibility association
  const inputId = props.id || name;

  return (
    <div
      className={`w-full flex flex-col items-start gap-1 ${containerClassName}`}
    >
      <div
        className={`w-full flex flex-row items-center gap-4 ${containerClassName}`}
      >
        {label && (
          <Label
            htmlFor={inputId}
            className={`text-[#374151] shrink-0 ${labelClassName} ${labelWidth}`}
          >
            <div className="flex flex-row items-center gap-2">
              {label}
              {tooltip && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="w-4 h-4 text-[var(--primary)]" />
                  </TooltipTrigger>
                  <TooltipContent>{tooltip}</TooltipContent>
                </Tooltip>
              )}
            </div>
          </Label>
        )}
        <div className="flex flex-col gap-2 w-full">
          <div className="relative flex-1">
            {icon && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                {icon}
              </div>
            )}
            {/* with glowing effect */}
            <Input
              id={inputId}
              placeholder={placeholder}
              name={name}
              type={type}
              value={value}
              className={`
              w-full 
              bg-white
              font-normal
              shadow-none
              ${inputClassName.includes('w-') ? '' : width} 
              ${icon ? 'pl-10' : ''} 
              ${inputClassName} 
              ${Glowing(app).inputBox}
            `}
              onChange={handleChange}
              {...props}
              {...registerProps}
            />
          </div>
        </div>
      </div>
      <div className="w-full flex flex-row items-start gap-4">
        <div className="w-50 h-4" />
        {validationError && (
          <CustomErrorMessage
            errorMessage={validationError}
            className={errorMessageClassName}
          />
        )}
      </div>
    </div>
  );
};

export default CustomInput;
