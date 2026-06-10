// File: ./components/custom-ui/custom-input.tsx
import React, { useState } from 'react';
// Ensure correct import for RHF types
import type {
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
  UseFormRegisterReturn,
} from 'react-hook-form';
import { Eye, EyeOff, InfoIcon } from 'lucide-react';

import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Input as ShadcnInput } from '../ui/input';
import { TextArea } from '../ui/textarea';
import { Glowing } from './styling/glowing';
import { APPS } from '#types/ENUMS.ts';
import CustomErrorMessage from './custom-error-message';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

type CustomInputProps<TFieldValues extends FieldValues> = {
  label?: string;
  name: Path<TFieldValues> | (string & {});
  placeholder?: string;
  validationError?: string;
  type?: string;
  width?: string;
  multiline?: boolean;
  rows?: number;
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
  app?: APPS; 
  tooltip?: string;
} & Omit<
  React.ComponentProps<typeof ShadcnInput>,
  'name' | 'onChange' | 'onBlur' | 'ref' | 'defaultValue' | 'value'
>;

const CustomInput = <TFieldValues extends FieldValues = FieldValues>({
  label,
  name,
  placeholder,
  validationError,
  type = 'text',
  width = 'w-full',
  multiline = false,
  rows = 3,
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
  app = APPS.PORTAL, 
  tooltip,
  ...restOfInputProps
}: CustomInputProps<TFieldValues>) => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const inputType = type === 'password' && showPassword ? 'text' : type;

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
  const hasTrailingContent = iconTrailing || type === 'password';

  const baseClassName = cn(
    'bg-white shadow-none',
    !(inputClassName.includes('w-') || inputClassName.includes('max-w-')) &&
      width,
    icon ? 'pl-10' : '',
    hasTrailingContent ? 'pr-10' : '',
    isDisabled && 'bg-gray-100 text-[#374151] font-semibold cursor-not-allowed',
    inputClassName
    // Glowing(app).inputBox
  );

  const commonProps = {
    id: restOfInputProps.id || (name as string),
    placeholder,
    onChange: handleChange,
    onKeyDown: handleKeyDown,
    name: name as string,
    defaultValue: uncontrolledDefaultValue,
    ...restOfInputProps,
    ...rhfRegisteredProps,
  };

  if (onValueChange) {
    (commonProps as any).value = controlledValue ?? '';
  }

  const renderInput = () => (
    <ShadcnInput
      {...(commonProps as React.ComponentProps<typeof ShadcnInput>)}
      type={inputType}
      className={cn(baseClassName, 'h-10', Glowing(app).inputBox)}
    />
  );

  const renderTextArea = () => (
    <div
      className={cn(
        baseClassName,
        'min-h-[80px] resize-y',
        Glowing(app).inputBox
      )}
    >
      <TextArea
        {...(commonProps as unknown as React.ComponentProps<typeof TextArea>)}
        rows={rows}
        className={cn(Glowing(app).textarea)}
      />
    </div>
  );

  return (
    <div className={`flex flex-col gap-2 ${containerClassName}`}>
      {label && (
        <Label
          htmlFor={restOfInputProps.id || (name as string)}
          className={cn(labelClassName)}
        >
          <div className="flex flex-row items-center gap-2">
            {label}
            {tooltip && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="cursor-pointer">
                      <InfoIcon className="w-4 h-4 text-[var(--primary)]" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </Label>
      )}
      {!subValue && (
        <div className="relative">
          {icon && (
            <div
              className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none',
                isDisabled && 'text-gray-400 opacity-60'
              )}
            >
              {icon}
            </div>
          )}
          <div className="relative flex flex-col">
            {multiline ? renderTextArea() : renderInput()}
          </div>
          {hasTrailingContent && (
            <div
              className={cn(
                'absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center gap-2',
                isDisabled && 'text-gray-400 opacity-60'
              )}
            >
              {iconTrailing}
              {type === 'password' && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="p-0 border-none bg-transparent cursor-pointer text-muted-foreground focus:outline-none"
                        aria-label={
                          showPassword ? 'Hide password' : 'Show password'
                        }
                      >
                        {showPassword ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{showPassword ? 'Hide' : 'Show'} password</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          )}
        </div>
      )}
      {subValue && (
        <div className="flex flex-row gap-2 items-center">
          {icon && (
            <div className=" left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
              {icon}
            </div>
          )}
          <div className="relative flex flex-col flex-1">
            {multiline ? renderTextArea() : renderInput()}
            {hasTrailingContent && (
              <div className="absolute right-3 top-5 -translate-y-1/2 z-10 flex items-center gap-2 text-muted-foreground">
                {iconTrailing}
                {type === 'password' && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="p-0 border-none bg-transparent cursor-pointer focus:outline-none"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{showPassword ? 'Hide' : 'Show'} password</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            )}
            {subValue && (
              <span className={cn('text-xs px-3', subValueClassName)}>
                {subValue}
              </span>
            )}
          </div>
        </div>
      )}
      {validationError && (
        <CustomErrorMessage
          errorMessage={validationError}
          className={errorMessageClassName}
        />
      )}
    </div>
  );
};

export default CustomInput;
