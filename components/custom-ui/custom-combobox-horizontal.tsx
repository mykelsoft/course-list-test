import { Check, ChevronsUpDown, InfoIcon } from 'lucide-react';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

import CustomErrorMessage from './custom-error-message';
import { cn } from '@/lib/utils';

import { Label } from '../ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { Button } from './../ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './../ui/command';
import { Popover, PopoverContent, PopoverTrigger } from './../ui/popover';

type CustomComboBoxHorizontalProps = {
  label: string;
  items: string[];
  dropdownStatus: boolean;
  selectedItem: string;
  validationError?: string;
  tooltip?: string;
  activeBgColor?: string;
  onSelect: (company: string) => void;
};

const CustomComboBoxHorizontal: React.FC<CustomComboBoxHorizontalProps> = ({
  label,
  items,
  dropdownStatus,
  selectedItem,
  validationError,
  tooltip,
  activeBgColor,
  onSelect,
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

  return (
    <div className="w-full flex flex-row items-center gap-4">
      {label && (
        <Label className="shrink-0 w-50">
          <div className="flex flex-row items-center gap-2">
            {label}
            {tooltip && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="w-4 h-4 text-[var(--primary)]" />
                </TooltipTrigger>
                <TooltipContent>{tooltip}</TooltipContent>
              </Tooltip>
            )}
          </div>
        </Label>
      )}
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex-1">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <div ref={triggerRef} className="w-full">
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={dropdownStatus}
                  className="w-full shadow-none justify-between text-gray-500"
                >
                  {selectedItem || `Select ${label}...`}
                  <ChevronsUpDown className="opacity-50 ml-2" />
                </Button>
              </div>
            </PopoverTrigger>
            <PopoverContent
              style={{ width: popoverWidth, padding: 0 }}
              className="text-gray-500"
              align="start"
              sideOffset={0}
            >
              <Command>
                <CommandInput placeholder="Search" className="h-9" />
                <CommandList>
                  <CommandEmpty>None found.</CommandEmpty>
                  <CommandGroup>
                    {items?.map((item) => (
                      <CommandItem
                        key={item}
                        value={item}
                        onSelect={(e) => onSelect(e)}
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
                          selectedItem.includes(item) && 'bg-[var(--active-bg)]'
                        )}
                      >
                        {item}
                        <Check
                          className={cn(
                            'ml-auto',
                            selectedItem.includes(item)
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
        {validationError && (
          <CustomErrorMessage errorMessage={validationError} />
        )}
      </div>
    </div>
  );
};

export default CustomComboBoxHorizontal;
