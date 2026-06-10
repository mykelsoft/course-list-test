// File: ./components/custom-ui/custom-input-site-box.tsx
import React from 'react';
// Ensure correct import for RHF types
import type {
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
  UseFormRegisterReturn,
} from 'react-hook-form';

import CustomErrorMessage from './custom-error-message';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Input as ShadcnInput } from '../ui/input';
import { Glowing } from './styling/glowing';
import { APPS } from '#types/ENUMS.ts';

type CustomInputSiteBoxProps<TFieldValues extends FieldValues> = {
  label?: string;
  name: Path<TFieldValues> | (string & {});
  placeholder?: string;
  validationError?: string;
  type?: string;
  width?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorMessageClassName?: string;
  icon?: React.ReactNode;
  iconTrailing?: React.ReactNode;
  register?: UseFormRegister<TFieldValues>;
  registerOptions?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
  value?: string;
  subValue?: string;
  subValueClassName?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onEnterKeyPress?: () => void;
} & Omit<
  React.ComponentProps<typeof ShadcnInput>,
  'name' | 'onChange' | 'onBlur' | 'ref' | 'defaultValue' | 'value'
>;

const CustomInputSiteBox = <TFieldValues extends FieldValues = FieldValues>({
  label,
  name,
  placeholder,
  validationError,
  type = 'text',
  width = 'w-full',
  containerClassName = '',
  labelClassName = '',
  inputClassName = '',
  errorMessageClassName = '',
  icon,
  iconTrailing,
  register,
  registerOptions,
  value: controlledValue,
  subValue = '',
  subValueClassName,
  onValueChange,
  defaultValue: uncontrolledDefaultValue,
  onEnterKeyPress,
  ...restOfInputProps
}: CustomInputSiteBoxProps<TFieldValues>) => {
  let rhfRegisteredProps: Partial<UseFormRegisterReturn<Path<TFieldValues>>> =
    {};
  if (register) {
    rhfRegisteredProps = register(name as Path<TFieldValues>, registerOptions);
  }

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (rhfRegisteredProps.onChange) {
      rhfRegisteredProps.onChange(event as any);
    }
    if (onValueChange) {
      onValueChange(event.target.value);
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (event.key === 'Enter' && onEnterKeyPress) {
      event.preventDefault();
      onEnterKeyPress();
    }
    if (
      restOfInputProps.onKeyDown &&
      typeof restOfInputProps.onKeyDown === 'function'
    ) {
      restOfInputProps.onKeyDown(event as any);
    }
  };

  const isDisabled = restOfInputProps.disabled;
  const baseClassName = cn(
    '!h-auto !pl-[12px] !pt-[8px] !pb-[2px] !rounded-md shadow-none text-sm',
    !(inputClassName.includes('w-') || inputClassName.includes('max-w-')) &&
      width,
    icon ? 'pl-10' : '',
    iconTrailing ? 'pr-10' : '',
    isDisabled && 'text-[#374151] font-regular cursor-not-allowed',
    inputClassName,
    Glowing(APPS.PORTAL).inputBox
  );

  // --- MODIFICATION: Conditionally build props to avoid passing `value` when using `register` ---
  const commonProps = {
    id: restOfInputProps.id || (name as string),
    placeholder,
    onChange: handleChange,
    onKeyDown: handleKeyDown,
    name: name as string,
    defaultValue: uncontrolledDefaultValue,
    ...restOfInputProps,
    ...rhfRegisteredProps, // Spread RHF props here
  };

  // Only add the `value` prop if this is a controlled component (not using RHF)
  if (onValueChange) {
    (commonProps as any).value = controlledValue ?? '';
  }

  return (
    <div
      className={`flex flex-col ${containerClassName} border border-gray-300 rounded-md`}
    >
      {label && (
        <Label
          htmlFor={restOfInputProps.id || (name as string)}
          className={cn(labelClassName, 'text-red-400 cursor-not-allowed')}
        >
          {label}
        </Label>
      )}
      <div className="flex flex-row items-center">
        {icon && (
          <div className="left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
            {icon}
          </div>
        )}
        <div className=" flex flex-col flex-1 ">
          <ShadcnInput
            {...(commonProps as React.ComponentProps<typeof ShadcnInput>)}
            type={type}
            className={cn(baseClassName, '')}
          />
          <span
            className={cn(
              'text-xs font-medium ml-[12px] mb-[8px]',
              subValueClassName
            )}
          >
            {subValue}
          </span>
        </div>
        {iconTrailing && <div className="mr-[12px]">{iconTrailing}</div>}
      </div>
      {validationError && (
        <CustomErrorMessage
          errorMessage={validationError}
          className={errorMessageClassName}
        />
      )}
    </div>
  );
};

export default CustomInputSiteBox;
