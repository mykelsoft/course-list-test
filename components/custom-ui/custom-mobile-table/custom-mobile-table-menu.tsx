// components/custom-ui/custom-mobile-table/custom-mobile-table-menu.tsx
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
import { ChevronDown, ArrowUpDown } from 'lucide-react';

export interface ShowItemsOption {
  id: string | number;
  name: string;
  value: number;
}

export interface MenuActionItem {
  /** Unique identifier for the action */
  id: string | number;
  /** Label text for the action button */
  label: string;
  /** Icon component to display before the label */
  icon?: React.ReactNode;
  /** Click handler for the action */
  onClick?: () => void;
  /** Whether the action is disabled */
  disabled?: boolean;
  /** Optional loading state indicator (e.g., spinner component) */
  loading?: React.ReactNode;
}

export interface SortOption {
  id: string | number;
  label: string;
  onSelect?: () => void;
  /** Whether this sort option is currently active/selected */
  isSelected?: boolean;
}

export interface MenuColors {
  primary?: string;
  secondary?: string;
}

/**
 * Spacing behavior (aligned to Figma mobile table patterns):
 *
 * - The root container uses `my-2`, which gives an 8px top and bottom margin.
 *   This matches the small vertical gap between the menu row (show / actions /
 *   sort) and the elements above and below it in the Figma mobile tables.
 *
 * - When you render `CustomMobileTableToolbar` directly under this menu, keep
 *   them in the same column with no extra margins so the effective space
 *   between menu and toolbar remains ~8px as designed.
 *
 * - For the space between toolbar and the first mobile table card/row, the
 *   recommended pattern is to put the toolbar and the rows inside a parent
 *   container that uses a 12px gap (e.g. `gap-[12px]` / `gap-3`). That 12px
 *   gap matches the Figma spacing between the "Select All" header bar and the
 *   first card and between subsequent cards.
 */
export interface CustomMobileTableMenuProps {
  /** Options for the "Show" dropdown */
  showItemsOptions?: ShowItemsOption[];
  /** Currently selected show items option */
  selectedShowItems?: ShowItemsOption;
  /** Callback when show items option changes */
  onShowItemsChange?: (option: ShowItemsOption) => void;
  /** Total number of results to display (e.g., "of 89 results") */
  totalResults?: number;
  /** Action items to display (e.g., Suspend, Archive, Restore, Delete Permanently) */
  actionItems?: MenuActionItem[];
  /** Sort dropdown options */
  sortOptions?: SortOption[];
  /** Currently selected sort option ID */
  selectedSortId?: string | number | null;
  /** Callback when sort selection changes */
  onSelectedSortChange?: (id: string | number | null) => void;
  /** Sort dropdown trigger icon/component */
  sortTrigger?: React.ReactNode;
  /** Whether to show the "Show" label before the dropdown (default: true) */
  showLabel?: boolean;
  /** Whether to show the "of" label before totalResults (default: true) */
  showOfLabel?: boolean;
  /** Whether to show the "results" label after totalResults (default: true) */
  showResultsLabel?: boolean;
  /** Optional colors for sort styling */
  colors?: MenuColors;
  /** Optional className for the menu container */
  className?: string;
  /** Optional className for the left section (Show dropdown) */
  leftSectionClassName?: string;
  /** Optional className for the middle section (Action buttons) */
  middleSectionClassName?: string;
  /** Optional className for the right section (Sort icon) */
  rightSectionClassName?: string;
  /** Optional className for individual action buttons */
  actionButtonClassName?: string;
  /** Whether to use justify-between to spread items to opposite sides (default: false) */
  justifyBetween?: boolean;
}

export function CustomMobileTableMenu({
  showItemsOptions,
  selectedShowItems,
  onShowItemsChange,
  totalResults,
  actionItems = [],
  sortOptions,
  selectedSortId,
  onSelectedSortChange,
  sortTrigger,
  showLabel = true,
  showOfLabel = true,
  showResultsLabel = true,
  colors,
  className,
  leftSectionClassName,
  middleSectionClassName,
  rightSectionClassName,
  actionButtonClassName,
  justifyBetween = false,
}: CustomMobileTableMenuProps) {
  // Default colors from CSS variables
  const primaryColor = colors?.primary || 'var(--primary)';
  const secondaryColor = colors?.secondary || 'var(--secondary)';

  // Track dropdown open state
  const [isSortOpen, setIsSortOpen] = React.useState(false);

  /**
   * Recommended layout pattern (Figma-aligned spacing):
   *
   * <div className="flex flex-col gap-[12px]">
   *   <CustomMobileTableMenu
   *     showItemsOptions={showItemsOptions}
   *     selectedShowItems={selectedShowItems}
   *     onShowItemsChange={onShowItemsChange}
   *     totalResults={totalResults}
   *     actionItems={actionItems}
   *     sortOptions={sortOptions}
   *     selectedSortId={selectedSortId}
   *     onSelectedSortChange={onSelectedSortChange}
   *   />
   *
   *   <CustomMobileTableToolbar
   *     selectAllChecked={selectAllChecked}
   *     onSelectAllChange={onSelectAllChange}
   *     showItemsOptions={showItemsOptions}
   *     selectedShowItems={selectedShowItems}
   *     onShowItemsChange={onShowItemsChange}
   *     totalResults={totalResults}
   *     sortOptions={sortOptions}
   *     selectedSortId={selectedSortId}
   *     onSelectedSortChange={onSelectedSortChange}
   *   />
   *
   *   <CustomMobileTable rows={mobileRows} ... />
   * </div>
   *
   * - The menu keeps its own `my-2` (8px) margin.
   * - The parent `gap-[12px]` ensures 12px between toolbar and the first card
   *   and between subsequent cards, matching the mobile designs.
   */
  return (
    <div
      className={cn(
        'flex flex-row flex-wrap items-center w-full gap-y-2',
        justifyBetween && 'justify-between',
        'my-2',
        // 'border border-red-500',
        className
      )}
    >
      {/* Left Section - Show items dropdown and results count */}
      {showItemsOptions && selectedShowItems && onShowItemsChange && (
        <div
          className={cn(
            'flex flex-row flex-nowrap gap-2 items-center text-sm',
            leftSectionClassName
          )}
        >
          <div className="flex flex-row gap-2 items-center pr-2">
            {showLabel && <span className="text-[#374151]">Show</span>}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-20 justify-between hover:text-[var(--primary)] hover:bg-[var(--highlight)]"
                >
                  {selectedShowItems.name}<ChevronDown className="size-4" />
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
            {totalResults !== undefined && (
              <span className="whitespace-nowrap text-[#374151]">
                {showOfLabel && 'of '}
                {totalResults}
                {showResultsLabel && ' results'}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Action buttons - rendered directly for individual wrapping */}
      {actionItems.length > 0 &&
        actionItems.map((action) => (
          <Button
            key={action.id}
            variant="ghost"
            size="sm"
            className={cn(
              'flex items-center gap-2 font-normal hover:text-primary hover:bg-secondary cursor-pointer',
              middleSectionClassName,
              actionButtonClassName
            )}
            onClick={action.onClick}
            disabled={action.disabled}
          >
            {action.loading ? action.loading : action.icon}
            {action.label}
          </Button>
        ))}

      {/* Right Section - Sort icon */}
      {sortOptions && sortOptions.length > 0 && (
        <div
          className={cn(
            'flex flex-row flex-nowrap items-center',
            rightSectionClassName
          )}
        >
          <DropdownMenu open={isSortOpen} onOpenChange={setIsSortOpen}>
            <DropdownMenuTrigger asChild>
              {sortTrigger || (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 hover:bg-[var(--highlight)] transition-colors"
                  style={{
                    color: isSortOpen ? primaryColor : '#374151',
                  }}
                  aria-label="Sort options"
                >
                  <ArrowUpDown
                    className="size-4 transition-colors"
                    style={{
                      color: isSortOpen ? primaryColor : '#374151',
                    }}
                  />
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
                            backgroundColor: secondaryColor,
                            color: primaryColor,
                          }
                        : undefined
                    }
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = secondaryColor;
                        e.currentTarget.style.color = primaryColor;
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
                        e.currentTarget.style.backgroundColor = secondaryColor;
                        e.currentTarget.style.color = primaryColor;
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
        </div>
      )}
    </div>
  );
}
