import React from 'react';
import CustomErrorMessage from './custom-error-message';
import { Label } from '@/components/ui/label';
import { Input } from '../ui/input';

type CustomInputProps = {
  items: Array<{
    label: string;
    value: string;
  }>;
  label?: string;
  name: string;
  value?: string; // Added value prop
  defaultValue?: string; // Added value prop
  validationError?: string;
  type?: string;
  width?: string; // Accepts Tailwind width classes, e.g., 'w-full', 'w-64'
  containerClassName?: string; // Class for the wrapper div
  labelClassName?: string; // Class for the Label component
  inputClassName?: string; // Class for the Input component
  errorMessageClassName?: string; // Class for the error message component
  onValueChange?: (value: string) => void; // Callback for when input value changes
};

const CustomOption: React.FC<CustomInputProps> = ({
  items,
  label,
  name,
  value, // Destructure the new value prop
  defaultValue, // Destructure the new value prop
  validationError,
  type = 'radio',
  containerClassName = '',
  labelClassName = '',
  inputClassName = '',
  errorMessageClassName = '',
  onValueChange,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onValueChange) {
      onValueChange(event.target.value);
    }
  };

  return (
    <div className={`flex flex-col gap-1 ${containerClassName}`}>
      {label && <Label className={labelClassName}>{label}</Label>}
      <div className="flex">
        {items.map(({ label, value: select_value }) => (
          <div key={select_value} className="flex ml-2">
            <div>
              <Input
                name={name}
                type={type}
                value={select_value} // Pass the value prop to the Input component
                className={`text-primary ${inputClassName}`}
                onChange={handleChange}
                checked={
                  select_value === defaultValue || select_value === value
                }
              />
            </div>
            <label className="my-auto ml-1">{label}</label>
          </div>
        ))}
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

export default CustomOption;
