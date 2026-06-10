import { Button } from '#components/ui/button.tsx';
import { Input } from '#components/ui/input.tsx';
import { Glowing } from '@/components/custom-ui/styling/glowing';
import { APPS } from '#types/ENUMS.ts';

type CustomInputNumberRockerProps = {
  app?: APPS;
  onChange: (value: number) => void;
  value: number;
  disabled?: boolean;
  width?: string;
};

const CustomInputNumberRocker: React.FC<CustomInputNumberRockerProps> = ({
  app = APPS.PORTAL,
  onChange,
  value,
  disabled = false,
  width,
}) => {
  const handleIncrement = () => {
    if (!disabled) {
      onChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (!disabled && value > 0) {
      onChange(value - 1);
    }
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      const value = event.target.value;
      // Replace any non-numeric characters with an empty string
      event.target.value = value.replace(/\D/g, '');
      const numericValue = Number(event.target.value);
      if (numericValue >= 0) {
        onChange(numericValue);
      }
    }
  };

  return (
    <div
      className={`relative inline-block ${width !== null && width !== undefined ? width : 'w-fit'}`}
    >
      <Input
        placeholder="No. of Seats"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        onInput={handleInput}
        className={`
          pr-16 appearance-none rounded-sm shadow-none
          ${Glowing(app).inputBox}
        `}
        type="text"
        disabled={disabled}
      />
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
        <Button
          type="button"
          variant="ghost"
          onClick={handleDecrement}
          className="px-2 h-6 text-base"
          disabled={disabled}
        >
          -
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={handleIncrement}
          className="px-2 h-6 text-base"
          disabled={disabled}
        >
          +
        </Button>
      </div>
    </div>
  );
};

export default CustomInputNumberRocker;
