// File: ./components/custom-ui/custom-input-password.tsx
import { Copy, Eye, EyeOff, Plus } from 'lucide-react'; // MODIFIED: Replaced Lock/LockOpen with Eye/EyeOff
import React, { useState } from 'react';
// Ensure correct import for RHF types
import type {
  FieldValues,
  Path,
  PathValue, // Import PathValue for explicit casting
  RegisterOptions,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';

import CustomErrorMessage from './custom-error-message';
import { Label } from '@/components/ui/label';
import generatePasswordFn from '@/lib/client/generate-password';
import { cn } from '@/lib/utils';
import { Glowing } from './styling/glowing';
// Assuming ShadcnInput is the base input component from your ui library
import { Input as ShadcnInput } from '../ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { APPS } from '#types/ENUMS.ts';

// --- MODIFIED PROPS ---
type CustomInputPasswordProps<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>, // Use TName for the specific path
> = {
  label?: string;
  name: TName; // name is now of type TName
  validationError?: string;
  width?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorMessageClassName?: string;
  icon?: React.ReactNode;
  isRegistration?: boolean;
  register?: UseFormRegister<TFieldValues>;
  registerOptions?: RegisterOptions<TFieldValues, TName>; // Use TName here
  setValue?: UseFormSetValue<TFieldValues>;
  watch?: UseFormWatch<TFieldValues>;
} & Omit<
  React.ComponentProps<typeof ShadcnInput>,
  'name' | 'type' | 'onChange' | 'onBlur' | 'ref' | 'value' | 'defaultValue'
>;

// --- MODIFIED COMPONENT GENERICS ---
const CustomInputPassword = <
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>, // Component is generic over TName
>({
  label,
  name, // name is TName
  validationError,
  width = 'w-full',
  containerClassName = '',
  labelClassName = '',
  inputClassName = '',
  errorMessageClassName = '',
  icon,
  isRegistration = true,
  register,
  registerOptions,
  setValue,
  watch,
  ...restOfInputProps
}: CustomInputPasswordProps<TFieldValues, TName>) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const rhfProps = register ? register(name, registerOptions) : {};

  const currentPasswordValue = watch ? watch(name) : undefined;

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleCopy = () => {
    if (!currentPasswordValue) return;
    navigator.clipboard
      .writeText(String(currentPasswordValue))
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => console.error('Failed to copy password', err));
  };

  const handlePlusClick = () => {
    const newPassword = generatePasswordFn(); // newPassword is string
    if (setValue && name) {
      // `name` is TName.
      // `setValue`'s generic TFieldName will be inferred as TName.
      // The second argument expects PathValue<TFieldValues, TName>.
      // We cast `newPassword` to this type. This is safe if this component
      // is consistently used for fields intended to be strings (like passwords).
      setValue(name, newPassword as PathValue<TFieldValues, TName>, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
    setShowPassword(true);
  };

  const inputType = showPassword ? 'text' : 'password';

  return (
    <div className={`flex flex-col gap-2 ${containerClassName}`}>
      {label && (
        <Label
          htmlFor={restOfInputProps.id || name}
          className={`${labelClassName} cursor-pointer`}
        >
          {label}
        </Label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
            {icon}
          </div>
        )}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
          <div className="flex flex-row gap-1">
            <TooltipProvider>
              {isRegistration && (
                <>
                  {setValue && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={handlePlusClick}
                          className="p-0 border-none bg-transparent cursor-pointer focus:outline-none"
                        >
                          <Plus size={14} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Generate password</TooltipContent>
                    </Tooltip>
                  )}
                  {currentPasswordValue && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={handleCopy}
                          className="p-0 border-none bg-transparent cursor-pointer focus:outline-none"
                        >
                          {' '}
                          <Copy
                            size={14}
                            className={`${copied ? 'text-green-600' : 'text-gray-400'}`}
                          />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Copy password</TooltipContent>
                    </Tooltip>
                  )}
                </>
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="p-0 border-none bg-transparent cursor-pointer focus:outline-none"
                  >
                    {/* --- MODIFIED: Replaced Lock/LockOpen with Eye/EyeOff --- */}
                    {showPassword ? <Eye size={14} /> : <EyeOff size={14} />}
                    {/* --- END MODIFICATION --- */}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  {showPassword ? 'Hide' : 'Show'} password
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <ShadcnInput
          id={restOfInputProps.id || name}
          type={inputType}
          className={cn(
            'h-10 shadow-none',
            !(
              inputClassName.includes('w-') || inputClassName.includes('max-w-')
            ) && width,
            icon ? 'pl-10' : '',
            inputClassName,
            Glowing(APPS.PORTAL).inputBox
          )}
          {...restOfInputProps}
          {...rhfProps}
        />
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

export default CustomInputPassword;
