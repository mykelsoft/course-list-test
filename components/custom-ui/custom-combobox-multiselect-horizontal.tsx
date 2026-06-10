import { Check, ChevronsUpDown } from 'lucide-react';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

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

export type CustomComboboxMultiSelectItem = {
  value: string;
  label: string;
};

export type CustomComboboxMultiSelectHorizontalProps = {
  label: string;
  items: string[];
  selectedItems: string[];
  onSelect: (values: string[]) => void;
  containerClassName?: string; // Class for the wrapper div
  activeBgColor?: string;
};

const CustomComboboxMultiSelectHorizontal: React.FC<
  CustomComboboxMultiSelectHorizontalProps
> = ({
  label,
  items,
  selectedItems,
  onSelect,
  containerClassName = '',
  activeBgColor,
}) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [popoverWidth, setPopoverWidth] = useState<number>(0);

  useLayoutEffect(() => {
    if (open && triggerRef.current) {
      setPopoverWidth(triggerRef.current.getBoundingClientRect().width);
    }
  }, [open]);

  useEffect(() => {
    const handleResize = () => {
      if (triggerRef.current) {
        setPopoverWidth(triggerRef.current.getBoundingClientRect().width);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSelection = (value: string) => {
    const newValues = selectedItems.includes(value)
      ? selectedItems.filter((v) => v !== value) // Remove if already selected
      : [...selectedItems, value]; // Add if not selected
    onSelect(newValues);
  };

  return (
    <div
      className={`w-full flex flex-row items-center gap-4 ${containerClassName}`}
    >
      <Label className="shrink-0 w-50">{label}</Label>
      <div className="flex-1">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div ref={triggerRef} className="w-full">
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between shadow-none"
              >
                <span className="truncate block max-w-[calc(100%-1.5rem)]">
                  {selectedItems.length > 0
                    ? items
                        .filter((item) => selectedItems.includes(item))
                        .map((item) => item)
                        .join(', ')
                    : `Select ${label}...`}
                </span>
                <ChevronsUpDown className="opacity-50 ml-2" />
              </Button>
            </div>
          </PopoverTrigger>
          <PopoverContent style={{ width: popoverWidth, padding: 0 }}>
            <Command>
              <CommandInput
                placeholder={`Search ${label}...`}
                className="h-9"
              />
              <CommandList>
                <CommandEmpty>
                  No
                  {label.toLowerCase()} found.
                </CommandEmpty>
                <CommandGroup>
                  {items.map((item) => (
                    <CommandItem
                      key={item}
                      value={item}
                      onSelect={() => toggleSelection(item)}
                      style={
                        activeBgColor
                          ? ({
                              '--active-bg': activeBgColor,
                            } as React.CSSProperties)
                          : undefined
                      }
                      className={cn(
                        'cursor-pointer',
                        'data-[selected=true]:bg-[var(--active-bg)]',
                        selectedItems.includes(item) && 'bg-[var(--active-bg)]'
                      )}
                    >
                      {item}
                      <Check
                        className={cn(
                          'ml-auto',
                          selectedItems.includes(item)
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
    </div>
  );
};

export default CustomComboboxMultiSelectHorizontal;
