'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, ArrowUpDown } from 'lucide-react';

export interface ShowItemsOption {
  id: string | number;
  name: string;
  value: number;
}

export interface FilterOption {
  id: string | number;
  label: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export interface SortOption {
  id: string | number;
  label: string;
  onSelect?: () => void;
  /** Whether this sort option is currently active/selected */
  isSelected?: boolean;
}

export interface ToolbarColors {
  /** Color for text and checkbox checked state */
  textColor?: string;
  /** Color for background (sort dropdown selected background) */
  backgroundColor?: string;
  /** @deprecated Use textColor instead */
  primary?: string;
  /** @deprecated Use backgroundColor instead */
  secondary?: string;
}

export interface CustomMobileTableToolbarProps {
  /** Options for the "Show" dropdown */
  showItemsOptions?: ShowItemsOption[];
  /** Currently selected show items option */
  selectedShowItems?: ShowItemsOption;
  /** Callback when show items option changes */
  onShowItemsChange?: (option: ShowItemsOption) => void;
  /** Total number of results to display (e.g., "of 89 results") */
  totalResults?: number;
  /** Filter dropdown options */
  filterOptions?: FilterOption[];
  /** Filter dropdown trigger icon/component */
  filterTrigger?: React.ReactNode;
  /** Sort dropdown options */
  sortOptions?: SortOption[];
  /** Currently selected sort option ID */
  selectedSortId?: string | number | null;
  /** Callback when sort selection changes */
  onSelectedSortChange?: (id: string | number | null) => void;
  /** Sort dropdown trigger icon/component */
  sortTrigger?: React.ReactNode;
  /** Custom React components to add to the toolbar (buttons, etc.) */
  customActions?: React.ReactNode;
  /** Custom React components to add to the left section (beside dropdown) */
  leftCustomActions?: React.ReactNode;
  /** Optional colors for checkbox checked state and sort dropdown styling */
  colors?: ToolbarColors;
  /** Optional className for the toolbar container */
  className?: string;
  /** Optional className for the left section */
  leftSectionClassName?: string;
  /** Optional className for the right section */
  rightSectionClassName?: string;
  /** Whether the "Select All" checkbox is checked (can be boolean or 'indeterminate') */
  selectAllChecked?: boolean | 'indeterminate';
  /** Callback when "Select All" checkbox changes */
  onSelectAllChange?: (checked: boolean) => void;
  /** Label text for the "Select All" checkbox (defaults to "Select All") */
  selectAllLabel?: string;
  /** Optional className for the "Select All" checkbox */
  selectAllCheckboxClassName?: string;
  /** Whether to wrap the toolbar in a header container with background and border styling */
  showHeaderContainer?: boolean;
  /** Optional className for the header container wrapper */
  headerContainerClassName?: string;
  /** Whether to show the "Show" label before the dropdown (default: true) */
  showLabel?: boolean;
  /** Whether to show the "of" label before totalResults (default: true) */
  showOfLabel?: boolean;
  /** Whether to show the "results" label after totalResults (default: true) */
  showResultsLabel?: boolean;
  /** Whether to show the sort icon on the left side (default: false, shows on right) */
  sortOnLeft?: boolean;
  /** Whether to use justify-between to spread items to opposite sides (default: true) */
  justifyBetween?: boolean;
}

export function CustomMobileTableToolbar({
  showItemsOptions,
  selectedShowItems,
  onShowItemsChange,
  totalResults,
  filterOptions,
  filterTrigger,
  sortOptions,
  selectedSortId,
  onSelectedSortChange,
  sortTrigger,
  customActions,
  leftCustomActions,
  colors,
  className,
  leftSectionClassName,
  rightSectionClassName,
  selectAllChecked,
  onSelectAllChange,
  selectAllLabel = 'Select All',
  selectAllCheckboxClassName,
  showHeaderContainer = selectAllChecked !== undefined,
  headerContainerClassName,
  showLabel = true,
  showOfLabel = true,
  showResultsLabel = true,
  sortOnLeft = false,
  justifyBetween = true,
}: CustomMobileTableToolbarProps) {
  // Default colors from CSS variables
  // Support both new (textColor/backgroundColor) and deprecated (primary/secondary) names for backward compatibility
  const textColor = colors?.textColor || colors?.primary || 'var(--primary)';
  const backgroundColor = colors?.backgroundColor || colors?.secondary || 'var(--secondary)';

  // Track dropdown open states
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [isSortOpen, setIsSortOpen] = React.useState(false);

  const toolbarContent = (
    <div
      className={cn(
        'flex flex-row flex-wrap items-center w-full gap-y-2',
        // 'border border-blue-500',
        justifyBetween && 'justify-between',
        showHeaderContainer ? '' : 'py-2',
        className
      )}
    >
      {/* Left Section - Select All, Show items dropdown and results count */}
      <div
        className={cn(
          'flex flex-row flex-nowrap gap-2 items-center text-sm pl-2 pr-2',
          leftSectionClassName
        )}
      >

        {/* Select All checkbox */}
        {selectAllChecked !== undefined && onSelectAllChange && (
          <div className="flex gap-[8px] items-center shrink-0">
            <div className="flex gap-[8px] items-center justify-center rounded-[4px] shrink-0">
              <Checkbox
                checked={selectAllChecked}
                onCheckedChange={onSelectAllChange}
                className={cn(
                  'size-[20px] bg-[#f9fafb] border-[#d1d5db] rounded-[4px]',
                  selectAllCheckboxClassName
                )}
                style={
                  selectAllChecked
                    ? {
                        backgroundColor: textColor,
                        borderColor: textColor,
                      }
                    : undefined
                }
              />
            </div>
            <span className="text-sm font-normal text-[#4b5563] whitespace-nowrap">
              {selectAllLabel}
            </span>
          </div>
        )}

        {/* Sort dropdown on left */}
        {sortOnLeft && sortOptions && sortOptions.length > 0 && (
          <DropdownMenu open={isSortOpen} onOpenChange={setIsSortOpen}>
            <DropdownMenuTrigger asChild>
              {sortTrigger || (
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-[6px] cursor-pointer h-auto w-auto hover:bg-[var(--highlight)] transition-colors"
                  style={{
                    color: isSortOpen ? textColor : '#374151',
                  }}
                  aria-label="Sort options"
                >
                  <div className="size-[24px] flex items-center justify-center">
                    <ArrowUpDown
                      className="size-4 transition-colors"
                      style={{
                        color: isSortOpen ? textColor : '#374151',
                      }}
                    />
                  </div>
                </Button>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {sortOptions.map((option) => {
                const isSelected = selectedSortId === option.id;
                return (
                  <DropdownMenuItem
                    key={option.id}
                    onClick={() => {
                      // Toggle selection: if already selected, deselect; otherwise select
                      if (isSelected) {
                        onSelectedSortChange?.(null);
                      } else {
                        onSelectedSortChange?.(option.id);
                        option.onSelect?.();
                      }
                    }}
                    className="focus:!bg-transparent data-[highlighted]:!bg-transparent"
                    style={
                      isSelected
                        ? {
                            backgroundColor,
                            color: textColor,
                          }
                        : undefined
                    }
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = backgroundColor;
                        e.currentTarget.style.color = textColor;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = '';
                        e.currentTarget.style.color = '';
                      }
                    }}
                    onFocus={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = backgroundColor;
                        e.currentTarget.style.color = textColor;
                      }
                    }}
                    onBlur={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = '';
                        e.currentTarget.style.color = '';
                      }
                    }}
                  >
                    {option.label}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {showItemsOptions && selectedShowItems && onShowItemsChange && (
          <div className="flex flex-row gap-2 items-center">
            {showLabel && <span className="text-[#374151]">Show</span>}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-20 justify-between hover:text-[var(--primary)] hover:bg-[var(--highlight)]"
                >
                  {selectedShowItems.name} <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {showItemsOptions.map((option) => (
                  <DropdownMenuCheckboxItem
                    key={option.id}
                    checked={option.id === selectedShowItems.id}
                    onCheckedChange={() => {
                      onShowItemsChange(option);
                    }}
                  >
                    {option.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {totalResults !== undefined && (showOfLabel || showResultsLabel) && (
              <span className="whitespace-nowrap text-[#374151]">
                {showOfLabel && 'of '}
                {totalResults}
                {showResultsLabel && ' results'}
              </span>
            )}
          </div>
        )}

        {/* Left custom actions (beside dropdown) */}
        {leftCustomActions}
      </div>

      {/* Right Section - Sort, Filter dropdown and custom actions */}
      <div
        className={cn(
          'flex flex-row flex-wrap gap-2 items-center',
          rightSectionClassName
        )}
      >
        {/* Custom actions (buttons, etc.) */}
        {customActions}

        {/* Sort dropdown on right (only if not on left) */}
        {!sortOnLeft && sortOptions && sortOptions.length > 0 && (
          <DropdownMenu open={isSortOpen} onOpenChange={setIsSortOpen}>
            <DropdownMenuTrigger asChild>
              {sortTrigger || (
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-[6px] cursor-pointer h-auto w-auto hover:bg-[var(--highlight)] transition-colors"
                  style={{
                    color: isSortOpen ? textColor : '#374151',
                  }}
                  aria-label="Sort options"
                >
                  <div className="size-[24px] flex items-center justify-center">
                    <ArrowUpDown
                      className="size-4 transition-colors"
                      style={{
                        color: isSortOpen ? textColor : '#374151',
                      }}
                    />
                  </div>
                </Button>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {sortOptions.map((option) => {
                const isSelected = selectedSortId === option.id;
                return (
                  <DropdownMenuItem
                    key={option.id}
                    onClick={() => {
                      // Toggle selection: if already selected, deselect; otherwise select
                      if (isSelected) {
                        onSelectedSortChange?.(null);
                      } else {
                        onSelectedSortChange?.(option.id);
                        option.onSelect?.();
                      }
                    }}
                    className="focus:!bg-transparent data-[highlighted]:!bg-transparent"
                    style={
                      isSelected
                        ? {
                            backgroundColor,
                            color: textColor,
                          }
                        : undefined
                    }
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = backgroundColor;
                        e.currentTarget.style.color = textColor;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = '';
                        e.currentTarget.style.color = '';
                      }
                    }}
                    onFocus={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = backgroundColor;
                        e.currentTarget.style.color = textColor;
                      }
                    }}
                    onBlur={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = '';
                        e.currentTarget.style.color = '';
                      }
                    }}
                  >
                    {option.label}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Filter dropdown */}
        {filterOptions && filterOptions.length > 0 && (
          <DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <DropdownMenuTrigger asChild>
              {filterTrigger || (
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-[6px] cursor-pointer h-auto w-auto hover:bg-[var(--highlight)] transition-colors"
                  style={{
                    color: isFilterOpen ? textColor : '#374151',
                  }}
                  aria-label="Filter options"
                >
                  <div className="size-[24px] flex items-center justify-center">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="transition-colors"
                      style={{
                        color: isFilterOpen ? textColor : '#374151',
                      }}
                    >
                      <path
                        d="M1 3.5H13M3.5 7H10.5M5.25 10.5H8.75"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </Button>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {filterOptions.map((option) => (
                <DropdownMenuCheckboxItem
                  key={option.id}
                  checked={option.checked}
                  onCheckedChange={option.onCheckedChange}
                  style={
                    option.checked
                      ? {
                          backgroundColor,
                          color: textColor,
                        }
                      : undefined
                  }
                >
                  {option.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );

  // Wrap in header container if requested
  if (showHeaderContainer) {
    return (
      <div
        className={cn(
          'bg-[#e5e7eb] border border-[#e5e7eb] rounded-[4px] flex flex-wrap items-center pl-[8px] pr-[10px] py-[8px] gap-y-2',
          justifyBetween && 'justify-between',
          headerContainerClassName
        )}
      >
        {toolbarContent}
      </div>
    );
  }

  return toolbarContent;
}
