// File: components/custom-ui/custom-picker-badge.tsx
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '#components/ui/command.tsx';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#components/ui/popover.tsx';
import { Label } from '#components/ui/label.tsx';
import { cn } from '#lib/utils.ts';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@radix-ui/react-tooltip'; // Keep direct import if needed
import { Check, ChevronsUpDown, InfoIcon, X } from 'lucide-react';
import { Button } from '#components/ui/button.tsx';
import { useState, useEffect } from 'react';
import { Glowing } from '@/components/custom-ui/styling/glowing';
import { Badge } from '#components/ui/badge.tsx';
import { APPS } from '@/types/ENUMS';

// Define a generic item type for the picker
export type PickerItem = {
  id: string | number; // Unique identifier (e.g., country.id or country.code)
  name: string; // Display name (e.g., country.name)
  flag?: string; // Optional: if you still want to display flags (e.g., from country.code for emoji flags)
  // You can add other properties if needed for rendering or logic
};

type CustomPickerBadgeProps = {
  app?: APPS;
  label: string;
  tooltip: string;
  items: PickerItem[]; // Items to display in the dropdown (e.g., FetchedCountryInfo[] mapped to PickerItem[])
  selectedItems: PickerItem[]; // Array of selected PickerItem objects
  buttonClassName?: string;
  onSelectedItemsChange: (items: PickerItem[]) => void; // Callback with selected PickerItem objects
  placeholder?: string;
  disabled?: boolean;
  validationError?: string;
};

const CustomPickerBadge: React.FC<CustomPickerBadgeProps> = ({
  app = APPS.PORTAL,
  label,
  tooltip,
  items = [], // Default to empty array
  selectedItems = [], // Default to empty array
  buttonClassName,
  onSelectedItemsChange,
  placeholder = 'Select items...',
  disabled = false,
  validationError,
}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Log items on mount and update
    console.warn(
      `[CustomPickerBadge] Rendered for ${label}. Items count: ${items.length}, Disabled: ${disabled}`
    );
  }, [items, disabled, label]);

  const glowingStyles = Glowing(app).dropdown;
  const glowingContentStyles = Glowing(app).jsx;

  const handleItemSelect = (itemToToggle: PickerItem) => {
    const newSelection = [...selectedItems];
    const existingIndex = newSelection.findIndex(
      (selected) => selected.id === itemToToggle.id
    );

    if (existingIndex >= 0) {
      newSelection.splice(existingIndex, 1); // Remove if exists
    } else {
      newSelection.push(itemToToggle); // Add if not exists
    }
    onSelectedItemsChange(newSelection);
    // setOpen(false); // Keep popover open for multi-select
  };

  return (
    <div className="w-full flex flex-row items-start gap-4">
      {' '}
      {/* Changed items-center to items-start */}
      <div className="w-50 flex flex-col items-start pt-2">
        {' '}
        {/* Adjusted for alignment */}
        {label && (
          <Label className="shrink-0 w-50 text-sm self-start text-[#374151]">
            <div className="flex flex-row items-center gap-2">
              {label}
              {tooltip && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="w-4 h-4 text-primary cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent className="rounded-md py-1 px-2 bg-primary text-white text-xs ">
                    {tooltip}
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </Label>
        )}
      </div>
      <div className="w-full h-auto flex flex-col justify-start gap-2">
        <style jsx global>
          {glowingContentStyles}
        </style>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              disabled={disabled}
              data-testid="country-picker" // Added test ID
              className={cn(
                `w-full min-h-[2.5rem] h-auto flex flex-row items-start justify-start p-2  ${glowingStyles}`,
                buttonClassName
              )}
            >
              <div className="flex-grow flex flex-row flex-wrap items-center gap-2 pr-2">
                {selectedItems?.length > 0 ? (
                  selectedItems.map((item) => (
                    <div key={item.name} className="focus:outline-none">
                      <Badge
                        variant="outline"
                        className={`${Glowing(app).badge} cursor-pointer`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!disabled) handleItemSelect(item);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.stopPropagation();
                            if (!disabled) handleItemSelect(item);
                          }
                        }}
                        tabIndex={disabled ? -1 : 0}
                      >
                        <div className="flex flex-row items-center justify-between gap-1">
                          {item.flag && (
                            <span className="mr-1 text-sm">{item.flag}</span>
                          )}
                          <span className="text-sm">{item.name}</span>
                          {!disabled && (
                            <X className="text-sm font-light h-3 w-3 cursor-pointer" />
                          )}
                        </div>
                      </Badge>
                    </div>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">{placeholder}</span>
                )}
              </div>
              <div className="flex items-center self-stretch">
                <ChevronsUpDown className="opacity-50 h-4 w-4 shrink-0" />
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className={`p-0 ${glowingContentStyles}`}
            style={{ width: 'var(--radix-popover-trigger-width)' }}
            align="start"
          >
            <Command>
              <CommandInput
                // Add cmdk-input attribute to match test locator strategy
                // The custom CommandInput component might already spread props to the underlying input,
                // but we explicitly add the data attribute here to be safe if the test relies on specific selectors.
                // However, the test uses getByPlaceholder('Search countries...'), so we ensure the placeholder matches.
                placeholder={`Search ${label.toLowerCase()}...`}
                className="h-9"
              />
              <CommandList>
                <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
                <CommandGroup>
                  {items.map((item) => (
                    <CommandItem
                      key={item.id.toString()}
                      value={item.name}
                      onSelect={() => {
                        if (!disabled) handleItemSelect(item);
                      }}
                      className="data-[selected=true]:bg-secondary data-[selected=true]:text-primary !hover:bg-secondary !hover:text-primary cursor-pointer"
                      // Add cmdk-item attribute to match test locator strategy
                      // The test uses locator('[cmdk-item]').filter({ hasText: 'Australia' })
                      // Radix/cmdk usually adds data-cmdk-item, but explicit props might help if custom component strips them
                    >
                      <div className="flex flex-row items-center gap-2">
                        {item.flag && (
                          <span className="text-lg">{item.flag}</span>
                        )}
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <Check
                        className={cn(
                          `${Glowing(APPS.POLICIES_AND_PROCEDURES).dropdown}`,
                          'ml-auto h-4 w-4',
                          selectedItems?.some((si) => si.id === item.id)
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
        {validationError && (
          <p className="text-xs text-red-500">{validationError}</p>
        )}
      </div>
    </div>
  );
};

export default CustomPickerBadge;
