// File: ./components/custom-ui/custom-input-color-horizontal.tsx
'use client';

import { CopyIcon, InfoIcon } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';

// --- FIXED IMPORT ---
// Removed: import * as Custom from '@/components/custom-ui';
import CustomErrorMessage from './custom-error-message';
// --------------------

import { Label } from '@/components/ui/label';
import { Input } from '../ui/input';
import CustomDialogImageDisplay from './custom-dialog-image-display';

type CustomInputProps = {
  label?: string;
  name: string;
  value?: string;
  placeholder?: string;
  tooltipImageUrl?: string;
  validationError?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorMessageClassName?: string;
  onValueChange?: (value: string) => void;
} & Omit<React.ComponentProps<'input'>, 'value' | 'onChange'>;

const CustomInputColorHorizontal: React.FC<CustomInputProps> = ({
  label,
  name,
  placeholder,
  value = '#000000',
  tooltipImageUrl,
  validationError,
  containerClassName = '',
  labelClassName = '',
  inputClassName = '',
  errorMessageClassName = '',
  onValueChange,
  ...props
}) => {
  const [iconColor, setIconColor] = useState('text-[var(--primary)]');
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setIconColor('text-green-500');
      setTimeout(() => {
        setIconColor('text-[var(--primary)]');
      }, 2000);
    } catch (err) {
      console.error('Failed to copy color:', err);
    }
  };

  return (
    <div
      className={`w-full flex flex-row items-center gap-4 ${containerClassName}`}
    >
      {label && (
        <div className="flex flex-row items-center gap-2 w-60">
          <Label className={`shrink-0 ${labelClassName}`}>{label}</Label>
          {tooltipImageUrl && (
            <CustomDialogImageDisplay
              title={label}
              trigger={
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md p-1 text-sm hover:bg-accent hover:text-accent-foreground"
                  onClick={() => setTooltipOpen(!tooltipOpen)}
                >
                  <InfoIcon size={16} className="text-[var(--primary)]" />
                </button>
              }
              fullScreen={true}
              buttonText="Close"
              isOpen={tooltipOpen}
              setIsOpen={setTooltipOpen}
            >
              <Image
                src={tooltipImageUrl}
                width={500}
                height={500}
                alt={label}
                className="w-full h-full object-contain"
              />
            </CustomDialogImageDisplay>
          )}
        </div>
      )}

      <div className="flex flex-col gap-2 flex-1">
        <div className="relative flex flex-row items-center gap-2 min-w-75">
          <Input
            name={name}
            type="color"
            value={value}
            className={`w-8 h-9 p-1 border-gray-300 rounded-md cursor-pointer shadow-none ${inputClassName}`}
            onChange={(e) => onValueChange?.(e.target.value)}
            {...props}
          />
          <div className="flex flex-row items-center justify-between gap-2 border border-gray-300 rounded-md p-2 flex-1">
            <span className="text-sm text-gray-500">{value.toUpperCase()}</span>
            <CopyIcon
              size={14}
              className={`${iconColor} cursor-pointer`}
              onClick={handleCopyClick}
            />
          </div>
        </div>
        {validationError && (
          // --- UPDATED USAGE ---
          <CustomErrorMessage
            errorMessage={validationError}
            className={errorMessageClassName}
          />
        )}
      </div>
    </div>
  );
};

export default CustomInputColorHorizontal;
