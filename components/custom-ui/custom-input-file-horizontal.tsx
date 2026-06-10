// File: ./components/custom-ui/custom-input-file-horizontal.tsx
import React, { useState } from 'react';
import type { UseFormRegister } from 'react-hook-form';

import CustomErrorMessage from './custom-error-message';
import { Label } from '@/components/ui/label';
import { Button } from '#components/ui/button.tsx';

type CustomInputFileHorizontalProps = {
  label?: string;
  name?: string;
  value?: string; // This should be the URL of the existing file
  defaultValue?: string;
  placeholder?: string;
  validationError?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorMessageClassName?: string;
  onValueChange?: (value: string) => void;
  icon?: React.ReactNode;
  disableValidation?: boolean;
  register?: UseFormRegister<any>;
} & React.ComponentProps<'input'>; // This includes onChange

const CustomInputFileHorizontal: React.FC<CustomInputFileHorizontalProps> = ({
  label,
  name,
  value,
  defaultValue,
  // placeholder,
  validationError,
  containerClassName,
  labelClassName,
  // inputClassName,
  errorMessageClassName,
  onValueChange,
  icon,
  onChange, // Destructure onChange so we can call it manually
  // register,
  ...props
}) => {
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // 1. Update local state so UI reflects the newly selected file immediately
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);

    // 2. Call custom value change handler if provided (often used for custom logic)
    if (onValueChange) {
      onValueChange(event.target.value);
    }

    // 3. Call the standard onChange handler (critical for RHF register to work)
    if (onChange) {
      onChange(event);
    }
  };

  // Helper to display a user-friendly name for existing files
  const getDisplayFileName = () => {
    // Priority 1: Newly selected file
    if (file) return file.name;

    // Priority 2: Persisted value (URL)
    // Check both value (controlled) and defaultValue (uncontrolled/RHF initial load)
    const urlToDisplay = value || defaultValue;

    if (
      urlToDisplay &&
      typeof urlToDisplay === 'string' &&
      urlToDisplay.trim() !== ''
    ) {
      try {
        // Decode URI component to handle spaces etc.
        const decoded = decodeURIComponent(urlToDisplay);
        const parts = decoded.split('/');
        const lastPart = parts[parts.length - 1];

        // Basic cleanup to remove potential timestamps added by uploaders (optional, keeps display clean)
        // Checks if filename starts with 13 digits and a dash (e.g. 1764467885768-filename.pdf)
        if (/^\d{13}-/.test(lastPart)) {
          return lastPart.substring(14);
        }

        return lastPart;
      } catch {
        return 'Existing File';
      }
    }
    return 'No file selected';
  };

  return (
    <div
      className={`w-full flex flex-row items-center gap-4 ${containerClassName}`}
    >
      {label && (
        <Label className={`shrink-0 ${labelClassName} w-50`}>{label}</Label>
      )}
      <div className="relative flex-1">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</div>
        )}

        <div className="flex flex-row items-center gap-2">
          <Button
            variant="outline"
            className="px-4 py-2 rounded-sm border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--secondary)] hover:text-[var(--primary)] active:bg-[var(--third)] active:text-[var(--primary)] cursor-pointer relative overflow-hidden"
            type="button" // Ensure it doesn't submit forms
          >
            <input
              type="file"
              id={name ? `file-upload-${name}` : undefined}
              className="absolute inset-0 opacity-0 z-10 cursor-pointer shadow-none"
              {...props}
              onChange={handleChange}
            />
            Upload File
          </Button>

          <div
            className="text-gray-400 text-sm font-normal truncate max-w-[300px]"
            title={getDisplayFileName()}
          >
            {getDisplayFileName()}
          </div>
        </div>
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

export default CustomInputFileHorizontal;
