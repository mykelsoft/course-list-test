'use client';
// components/custom-ui/custom-mobile-table/custom-mobile-table-row-sortable.tsx
import * as React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export interface MobileRowField {
  /** Label for the field (e.g., "Full Name", "Site") */
  label: string;
  /** Value can be a string, number, or React component */
  value: React.ReactNode;
  /** Maximum number of lines before showing "see more" button (default: 1) */
  maxLines?: number;
}

export interface MobileRowAction {
  /** Icon component for the action */
  icon: React.ReactNode;
  /** Label for accessibility */
  label: string;
  /** Click handler */
  onClick: () => void;
}

export interface CustomMobileTableRowSortableProps {
  /** Unique identifier for the sortable item (must match the id used in SortableContext) */
  sortableId: string | number;
  /** Unique identifier displayed in the header (e.g., "001", "002") */
  id: string;
  /** Array of field objects with label and value */
  fields: MobileRowField[];
  /** Optional drag handle icon and props */
  dragHandle?: {
    icon: React.ReactNode;
    listeners?: React.HTMLAttributes<HTMLDivElement>;
  };
  /** Optional checkbox props */
  checkbox?: {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    disabled?: boolean;
  };
  /** Optional switch props */
  switch?: {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    disabled?: boolean;
  };
  /** Optional action menu items */
  actions?: MobileRowAction[];
  /** Optional custom action menu trigger (replaces default 3-dot menu) */
  customActionMenu?: React.ReactNode;
  /** Optional className for the row container */
  className?: string;
  /** Optional className for the header section */
  headerClassName?: string;
  /** Optional className for field rows */
  fieldRowClassName?: string;
  /** Whether the row is disabled (grayed out, non-interactive) */
  disabled?: boolean;
  /** Whether drag and drop is disabled for this row */
  dragDisabled?: boolean;
  /** Optional hex color for switch, checkbox, clickable text, and see more button. Defaults to var(--primary) */
  color?: string;
}

/**
 * Component to render expandable text content with "see more" / "see less" button
 */
function ExpandableTextValue({
  value,
  maxLines = 1,
  disabled = false,
  color,
}: {
  value: string | number;
  maxLines: number;
  disabled: boolean;
  color?: string;
}) {
  const textRef = React.useRef<HTMLParagraphElement>(null);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isTruncated, setIsTruncated] = React.useState(false);

  // Check if text is truncated on mount and window resize
  React.useEffect(() => {
    const checkTruncation = () => {
      if (textRef.current) {
        const element = textRef.current;
        // Compare scrollHeight with clientHeight to detect truncation
        setIsTruncated(element.scrollHeight > element.clientHeight);
      }
    };

    checkTruncation();

    // Recheck on resize
    window.addEventListener('resize', checkTruncation);
    return () => window.removeEventListener('resize', checkTruncation);
  }, [value, maxLines]);

  const lineClampClass = !isExpanded
    ? maxLines === 1
      ? 'line-clamp-1'
      : maxLines === 2
        ? 'line-clamp-2'
        : maxLines === 3
          ? 'line-clamp-3'
          : 'line-clamp-1'
    : '';

  return (
    <div className="flex flex-col items-start w-full">
      <div className="flex flex-wrap items-start gap-0 w-full">
        <p
          ref={textRef}
          className={cn(
            'font-normal leading-[1.5] text-sm break-words',
            disabled ? 'text-[#959BA4]' : 'text-[#4b5563]',
            lineClampClass
          )}
        >
          {value}
        </p>
        {(isTruncated || isExpanded) && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="font-normal leading-[1.5] text-sm hover:underline cursor-pointer bg-transparent border-none p-0 whitespace-nowrap"
            style={{ color: color || 'var(--primary)' }}
          >
            {isExpanded ? 'see less' : 'see more'}
          </button>
        )}
      </div>
    </div>
  );
}

export function CustomMobileTableRowSortable({
  sortableId,
  id,
  fields,
  dragHandle,
  checkbox,
  switch: switchProps,
  actions,
  customActionMenu,
  className,
  headerClassName,
  fieldRowClassName,
  disabled = false,
  dragDisabled = false,
  color,
}: CustomMobileTableRowSortableProps) {
  const primaryColor = color || 'var(--primary)';
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: sortableId,
    disabled: dragDisabled || disabled,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  // Merge drag handle listeners with sortable listeners
  const dragHandleListeners = dragHandle?.listeners
    ? { ...listeners, ...dragHandle.listeners }
    : listeners;

  const _hasHeaderControls = checkbox || switchProps || actions || customActionMenu || dragHandle;
  const headerRef = React.useRef<HTMLDivElement>(null);
  const actionButtonsRef = React.useRef<HTMLDivElement>(null);
  const [hasWrapped, setHasWrapped] = React.useState(false);
  const isCheckingRef = React.useRef(false);

  // Detect if action buttons should wrap to the next line
  // Uses stable calculation based on available space to prevent infinite loops
  React.useEffect(() => {
    const checkWrap = () => {
      // Prevent re-entrant calls that cause oscillation
      if (isCheckingRef.current) return;
      isCheckingRef.current = true;

      try {
        if (!headerRef.current || !actionButtonsRef.current) {
          isCheckingRef.current = false;
          return;
        }

        const header = headerRef.current;
        const actionContainer = actionButtonsRef.current;
        const buttons = actionContainer.querySelectorAll('button');

        if (buttons.length === 0) {
          setHasWrapped(false);
          isCheckingRef.current = false;
          return;
        }

        // Calculate total width needed for all action buttons
        // Each button is ~32px (24px icon + 8px padding) + 8px gap
        const buttonWidth = 32;
        const gap = 8;
        const totalButtonsWidth = buttons.length * buttonWidth + (buttons.length - 1) * gap;

        // Get the header's total width and the left section's width
        const headerWidth = header.offsetWidth;
        const leftSection = header.querySelector(':scope > div:first-child') as HTMLElement;
        const leftSectionWidth = leftSection ? leftSection.offsetWidth : 0;

        // Calculate available space for action buttons (with some padding)
        const headerPadding = 32; // px-4 on both sides = 32px
        const availableWidth = headerWidth - leftSectionWidth - headerPadding;

        // Determine if we need to wrap based on available space
        // Add a small buffer (20px) to prevent edge-case oscillation
        const shouldWrap = totalButtonsWidth > availableWidth - 20;

        setHasWrapped(shouldWrap);
      } finally {
        // Use setTimeout to release the lock after a frame
        // This prevents rapid oscillation while still allowing legitimate updates
        setTimeout(() => {
          isCheckingRef.current = false;
        }, 100);
      }
    };

    // Check after initial render
    const timeoutId = setTimeout(checkWrap, 50);

    // Debounced resize handler to prevent rapid recalculations
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(checkWrap, 150);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
    };
  }, [actions, customActionMenu]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn(
        'bg-white border border-[#e5e7eb] border-solid rounded-sm overflow-clip flex flex-col w-full',
        disabled && '!bg-[#f9fafb] opacity-60 cursor-not-allowed',
        isDragging && 'shadow-lg',
        className
      )}
    >
      {/* Header Section */}
      <div
        ref={headerRef}
        className={cn(
          'bg-[#e5e7eb] border-b border-[#e5e7eb] border-l-0 border-r-0 border-t-0 border-solid flex flex-wrap items-center justify-between pl-[8px] pr-4 py-[8px] min-h-[41px] w-full',
          hasWrapped && 'items-start', // Align items to start when wrapped for better layout
          disabled && 'bg-[#f3f4f6]',
          headerClassName
        )}
      >
        <div className="flex rounded-sm items-center shrink-0">
          {/* Drag Handle */}
          {dragHandle && (
            <div
              className={cn(
                'flex items-center p-[6px] touch-none',
                !dragDisabled && !disabled && 'cursor-grab active:cursor-grabbing'
              )}
              {...dragHandleListeners}
            >
              <div className="size-[24px] flex items-center justify-center">
                {dragHandle.icon}
              </div>
            </div>
          )}

          {/* Checkbox */}
          {checkbox && (
            <div className="flex items-center">
              <Checkbox
                checked={checkbox.checked}
                onCheckedChange={checkbox.onCheckedChange}
                disabled={checkbox.disabled || disabled}
                className="size-[20px] bg-[#f9fafb] border-[#d1d5db]"
                style={{
                  ...(checkbox.checked && {
                    backgroundColor: primaryColor,
                    borderColor: primaryColor,
                  }),
                }}
              />
            </div>
          )}

          {/* ID */}
          <p
            className={cn(
              'font-semibold leading-[1.5] text-sm p-2',

              disabled ? 'text-[#959BA4]' : 'text-[#374151]'
            )}
          >
            {id}
          </p>

          {/* Switch */}
          {switchProps && (
            <div className="flex items-center pl-[16px] pr-0 py-0">
              <Switch
                checked={switchProps.checked}
                onCheckedChange={switchProps.onCheckedChange}
                disabled={switchProps.disabled || disabled}
                className="h-5 w-9 [&>span]:size-4 [&>span]:data-[state=checked]:translate-x-4"
                style={{
                  ...(switchProps.checked && {
                    backgroundColor: primaryColor,
                  }),
                }}
              />
            </div>
          )}
        </div>

        {/* Action Menu */}
        {(actions || customActionMenu) && (
          <div 
            ref={actionButtonsRef}
            className={cn(
              "flex flex-wrap gap-2 items-center justify-start shrink-0",
              hasWrapped && "w-full pt-2", // Full width when wrapped to ensure proper alignment
              actions && actions.length >= 8 && "gap-0 justify-between"
            )}
          >
            {customActionMenu || (actions ? (
              <>
                {actions.map((action, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="icon"
                    className="p-[4px] cursor-pointer h-auto w-auto shrink-0"
                    onClick={disabled ? undefined : action.onClick}
                    disabled={disabled}
                    aria-label={action.label}
                  >
                    <div className="size-[24px] flex items-center justify-center">
                      {action.icon}
                    </div>
                  </Button>
                ))}
              </>
            ) : null)}
          </div>
        )}
      </div>

      {/* Field Rows */}
      {fields.map((field, index) => (
        <div
          key={index}
          className={cn(
            'border-b border-[#e5e7eb] border-l-0 border-r-0 border-t-0 border-solid last:border-b-0 flex items-start justify-between px-[16px] py-[12px] w-full shrink-0',
            fieldRowClassName
          )}
        >
          <div className="flex-[1_0_0] gap-[8px] grid grid-cols-[minmax(0,_1fr)_minmax(0,_2fr)] grid-rows-[repeat(1,_fit-content(100%))] min-h-px min-w-px relative">
            {/* Field Label */}
            <div className="col-[1] flex items-start justify-start self-stretch">
              <p
                className={cn(
                  'font-normal leading-[1.5] text-sm',
                  disabled ? 'text-[#959BA4]' : 'text-[#6b7280]'
                )}
              >
                {field.label}
              </p>
            </div>

            {/* Field Value */}
            <div className="col-[2] flex items-start justify-self-stretch self-start">
              {typeof field.value === 'string' ||
              typeof field.value === 'number' ? (
                <ExpandableTextValue
                  value={field.value}
                  maxLines={field.maxLines ?? 1}
                  disabled={disabled}
                  color={primaryColor}
                />
              ) : (
                <div className={cn('w-full', disabled && 'opacity-60')}>
                  {field.value}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
