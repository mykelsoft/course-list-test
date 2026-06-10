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

export type MultiComboBoxItem = {
  value: string;
  label: string;
};

type MultiComboBoxProps = {
  label: string;
  items: MultiComboBoxItem[];
  selectedValues: string[];
  onSelect: (values: string[]) => void;
};

const MultiComboBox: React.FC<MultiComboBoxProps> = ({
  label,
  items,
  selectedValues,
  onSelect,
}) => {
  const [open, setOpen] = useState(false);

  const toggleSelection = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value) // Remove if already selected
      : [...selectedValues, value]; // Add if not selected
    onSelect(newValues);
  };

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
            {selectedValues.length > 0
              ? items
                  .filter((item) => selectedValues.includes(item.value))
                  .map((item) => item.label)
                  .join(', ')
              : `Select ${label}...`}
            <ChevronsUpDown className="opacity-50 ml-2" />
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
                    onSelect={() => toggleSelection(item.value)}
                  >
                    {item.label}
                    <Check
                      className={cn(
                        'ml-auto',
                        selectedValues.includes(item.value)
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

export default MultiComboBox;
