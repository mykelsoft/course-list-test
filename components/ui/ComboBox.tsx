import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export type ComboBoxItem = {
  value: string;
  label: string;
};

type ComboBoxProps = {
  label: string;
  items: ComboBoxItem[];
  selectedValue: string | null;
  onSelect: (value: string) => void;
};

const ComboBox: React.FC<ComboBoxProps> = ({
  label,
  items,
  selectedValue,
  onSelect,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Label>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedValue
              ? items.find((item) => item.value === selectedValue)?.label
              : `Select ${label}...`}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder={`Search ${label}...`} className="h-9" />
            <CommandList>
              <CommandEmpty>
                No
                {label.toLowerCase()} found.
              </CommandEmpty>
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={() => {
                      onSelect(item.value);
                      setOpen(false);
                    }}
                  >
                    {item.label}
                    <Check
                      className={cn(
                        'ml-auto',
                        selectedValue === item.value
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ComboBox;
