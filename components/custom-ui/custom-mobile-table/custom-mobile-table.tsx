'use client';
// components/custom-ui/custom-mobile-table/custom-mobile-table.tsx
import * as React from 'react';
import { CustomMobileRow  } from './custom-mobile-row';
import type {CustomMobileRowProps} from './custom-mobile-row';
import { CustomMobileTableRowSortable } from './custom-mobile-table-row-sortable';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

type BaseRowProps = Omit<CustomMobileRowProps, 'className' | 'headerClassName' | 'fieldRowClassName'>;

export interface CustomMobileTableProps {
  /** Array of row data */
  rows: BaseRowProps[];
  /** Loading state */
  isLoading?: boolean;
  /** Number of skeleton rows to show when loading */
  skeletonRows?: number;
  /** Message to display when there are no results */
  noResultsMessage?: string;
  /** Optional className for the container */
  containerClassName?: string;
  /** Optional className for individual rows */
  rowClassName?: string;
  /** Optional className for row headers */
  rowHeaderClassName?: string;
  /** Optional className for row fields */
  rowFieldClassName?: string;
  /** Gap between rows */
  rowGap?: string;
  /** Function to determine if a row should be disabled */
  getRowDisabled?: (row: BaseRowProps, index: number) => boolean;
  /** Whether to enable sortable/draggable rows (default: false) */
  sortable?: boolean;
  /** Array of sortable IDs corresponding to each row (required when sortable is true) */
  sortableIds?: (string | number)[];
  /** Function to determine if a row's drag should be disabled (only used when sortable is true) */
  getRowDragDisabled?: (row: BaseRowProps, index: number) => boolean;
  /** Optional hex color for switch, checkbox, clickable text, and see more button. Defaults to var(--primary) */
  color?: string;
}

export function CustomMobileTable({
  rows,
  isLoading = false,
  skeletonRows = 5,
  noResultsMessage = 'No results.',
  containerClassName,
  rowClassName,
  rowHeaderClassName,
  rowFieldClassName,
  rowGap = '12px',
  getRowDisabled,
  sortable = false,
  sortableIds,
  getRowDragDisabled,
  color,
}: CustomMobileTableProps) {
  const primaryColor = color || 'var(--primary)';
  if (isLoading) {
    return (
      <div
        className={cn(
          'flex flex-col gap-[12px] items-start overflow-x-hidden w-full',
          containerClassName
        )}
      >
        {Array.from({ length: skeletonRows }).map((_, index) => (
          <div
            key={`skeleton-${index}`}
            className="bg-white border border-[#e5e7eb] border-solid rounded-[4px] overflow-clip flex flex-col w-full"
          >
            {/* Skeleton Header */}
            <div className="bg-[#e5e7eb] border-b border-[#e5e7eb] border-l-0 border-r-0 border-t-0 border-solid flex items-center justify-between px-[16px] h-[41px] w-full shrink-0">
              <div className="flex gap-[8px] items-center">
                <Skeleton className="size-[20px] rounded-[4px]" />
                <Skeleton className="h-[14px] w-[30px] rounded" />
              </div>
              <Skeleton className="h-[18px] w-[18px] rounded" />
            </div>

            {/* Skeleton Fields */}
            {Array.from({ length: 3 }).map((_, fieldIndex) => (
              <div
                key={`skeleton-field-${fieldIndex}`}
                className="border-b border-[#e5e7eb] border-l-0 border-r-0 border-t-0 border-solid last:border-b-0 flex items-center justify-between px-[16px] py-[12px] w-full shrink-0"
              >
                <div className="flex-[1_0_0] gap-[8px] grid grid-cols-[minmax(0,_1fr)_minmax(0,_2fr)] grid-rows-[repeat(1,_fit-content(100%))] min-h-px min-w-px relative">
                  <div className="col-[1] flex items-center justify-start self-stretch">
                    <Skeleton className="h-[14px] w-[60px] rounded" />
                  </div>
                  <div className="col-[2] flex items-center justify-self-stretch self-start">
                    <Skeleton className="h-[14px] w-[100px] rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center py-[40px] w-full',
          containerClassName
        )}
      >
        <p className="text-sm text-[#6b7280]">{noResultsMessage}</p>
      </div>
    );
  }

  const renderRows = () => {
    if (sortable) {
      // Validate sortableIds when sortable is enabled
      if (!sortableIds || sortableIds.length !== rows.length) {
        console.warn(
          'CustomMobileTable: sortableIds must be provided and match the length of rows when sortable is true'
        );
        // Fallback to non-sortable if sortableIds is invalid
        return rows.map((row, index) => {
          const isDisabled = getRowDisabled ? getRowDisabled(row, index) : false;
          return (
            <CustomMobileRow
              key={row.id || index}
              {...row}
              disabled={isDisabled}
              className={cn('w-full', rowClassName)}
              headerClassName={rowHeaderClassName}
              fieldRowClassName={rowFieldClassName}
              color={primaryColor}
            />
          );
        });
      }

      return (
        <SortableContext
          items={sortableIds}
          strategy={verticalListSortingStrategy}
        >
          {rows.map((row, index) => {
            const isDisabled = getRowDisabled ? getRowDisabled(row, index) : false;
            const isDragDisabled = getRowDragDisabled ? getRowDragDisabled(row, index) : false;
            return (
              <CustomMobileTableRowSortable
                key={row.id || index}
                sortableId={sortableIds[index]}
                {...row}
                disabled={isDisabled}
                dragDisabled={isDragDisabled}
                className={cn('w-full', rowClassName)}
                headerClassName={rowHeaderClassName}
                fieldRowClassName={rowFieldClassName}
                color={primaryColor}
              />
            );
          })}
        </SortableContext>
      );
    }

    // Non-sortable rows (default)
    return rows.map((row, index) => {
      const isDisabled = getRowDisabled ? getRowDisabled(row, index) : false;
      return (
        <CustomMobileRow
          key={row.id || index}
          {...row}
          disabled={isDisabled}
          className={cn('w-full', rowClassName)}
          headerClassName={rowHeaderClassName}
          fieldRowClassName={rowFieldClassName}
          color={primaryColor}
        />
      );
    });
  };

  return (
    <div
      className={cn(
        'flex flex-col gap-[12px] items-start overflow-x-hidden py-0 w-full',
        containerClassName
      )}
      style={{ gap: rowGap }}
    >
      {renderRows()}
    </div>
  );
}
