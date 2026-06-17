// components/custom-ui/custom-table/custom-table.tsx
import type { Row, Table as TanstackTable } from '@tanstack/react-table';
// Assuming Shadcn Skeleton
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { ArrowUpDownIcon } from 'lucide-react';
import CustomButton from '../custom-button';
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils'; // Import cn utility
import { flexRender } from '@tanstack/react-table';

// Assuming Shadcn Table components

// Define ColumnMeta if you use it for widths, otherwise remove
export type ColumnMeta = {
  width?: string;
  headerClassName?: string;
  cellClassName?: string;
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto' | 'ellipsis';
  textOverflow?: 'clip' | 'ellipsis';
  whiteSpace?: 'normal' | 'nowrap' | 'pre' | 'pre-wrap' | 'pre-line';
};

// Props for the generic table component
type GenericTableProps<TData> = {
  children?: React.ReactNode; // MODIFIED: Added optional children prop
  table: TanstackTable<TData>; // The table instance from useReactTable
  isLoading: boolean; // To show loading skeletons
  noResultsMessage?: string; // Custom message for no data
  containerClassName?: string; // Optional class for the outer container
  tableClassName?: string; // Optional class for the <Table> element
  headerRowClassName?: string; // Optional class for <TableRow> in <TableHeader>
  headerCellClassName?: string; // Optional class for <TableHead>
  bodyRowClassName?: string; // Optional class for <TableRow> in <TableBody>
  bodyCellClassName?: string; // Optional class for <TableCell>
  tableHeight?: string; // Optional table height
  tableMinWidth?: string; // Optional minimum table width (e.g., '800px', '1200px') for horizontal scrolling
  skeletonRows?: number; // Number of skeleton rows to show when loading
  tableHeaderHeight?: string; // Optional table header height
  tableRowHeight?: string; // Optional table row height
  getRowClassName?: (row: Row<TData>) => string | undefined; // Optional function to get conditional row className
  // Tooltip can be a simple string or structured title/body
  getRowTooltip?: (
    row: Row<TData>
  ) => string | { title: string; body?: string } | undefined; // Optional function to get tooltip content for a row
  // Tooltip customization
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
  tooltipClassName?: string; // Customize background, text, borders, etc.
  tooltipTitleClassName?: string;
  tooltipBodyClassName?: string;
};

const getReadableColumnLabel = <TData,>(row: Row<TData>, columnId: string) => {
  const cell = row
    .getVisibleCells()
    .find((visibleCell) => visibleCell.column.id === columnId);
  const header = cell?.column.columnDef.header;

  if (typeof header === 'string') {
    return header;
  }

  return columnId
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const renderTooltipContent = (
  tooltipContent: string | { title: string; body?: string },
  tooltipTitleClassName: string,
  tooltipBodyClassName: string
) => {
  if (typeof tooltipContent === 'string') {
    return <p className={tooltipBodyClassName}>{tooltipContent}</p>;
  }

  return (
    <div className="flex flex-col gap-0.5">
      <div className={tooltipTitleClassName}>{tooltipContent.title}</div>
      {tooltipContent.body ? (
        <div className={tooltipBodyClassName}>{tooltipContent.body}</div>
      ) : null}
    </div>
  );
};

const getDesktopSkeletonCell = (columnId: string) => {
  switch (columnId) {
    case 'select':
      return <Skeleton className='mx-auto size-4 rounded-[4px]' />;
    case 'actions':
      return <Skeleton className='mx-auto size-7 rounded-md' />;
    case 'id':
      return <Skeleton className='h-4 w-10 rounded' />;
    case 'name':
      return <Skeleton className='h-4 w-48 max-w-full rounded' />;
    case 'assignedCompanies':
      return <Skeleton className='h-4 w-36 max-w-full rounded' />;
    case 'totalUnits':
      return <Skeleton className='h-4 w-8 rounded' />;
    case 'price':
      return <Skeleton className='h-4 w-16 rounded' />;
    default:
      return <Skeleton className='h-4 w-full rounded' />;
  }
};

const MOBILE_DETAIL_LABEL_WIDTHS = ['w-16', 'w-24', 'w-20', 'w-28'] as const;
const MOBILE_DETAIL_VALUE_WIDTHS = ['w-28', 'w-36', 'w-20', 'w-32'] as const;

export function CustomTable<TData>({
  children, // MODIFIED: Destructure children
  table,
  isLoading,
  noResultsMessage = 'No results.',
  containerClassName = 'border border-[var(--table-border)] rounded-lg overflow-auto', // MODIFIED: Changed to overflow-auto for horizontal scrolling
  tableClassName = '',
  headerRowClassName = '',
  headerCellClassName = 'text-sm font-semibold text-[#1F2937] bg-[var(--table-background-primary)] text-[var(--text-primary)] border-r border-[var(--table-border)] last:border-r-0 px-2 py-1.5 [&:has([role=checkbox])]:!p-0 [&:has([role=checkbox])]:!pl-0 [&>[role=checkbox]]:!translate-y-0',
  bodyRowClassName = 'text-sm',
  bodyCellClassName = 'px-2 py-1.5 text-[#4B5563] font-regular border-r border-[var(--table-border)] last:border-r-0 group-hover:border-[var(--primary)] group-hover:text-primary group-data-[inactive=true]:hover:border-[var(--table-border)] group-data-[inactive=true]:hover:text-[#4B5563] group-has-[[data-state=open]]:text-primary [&:has([role=checkbox])]:!p-0 [&:has([role=checkbox])]:!pl-0 [&>[role=checkbox]]:!translate-y-0',
  tableHeight = '',
  tableMinWidth = '800px',
  tableHeaderHeight = 'h-[60px]',
  tableRowHeight = 'h-[73px]',
  skeletonRows = 5,
  getRowClassName,
  getRowTooltip,
  tooltipSide = 'bottom',
  tooltipClassName = 'bg-[var(--popover)] text-[var(--popover-foreground)] border border-[var(--table-border)] shadow-md',
  tooltipTitleClassName = 'text-xs font-semibold',
  tooltipBodyClassName = 'text-xs text-[var(--text-secondary,#6B7280)]',
}: GenericTableProps<TData>) {
  const rows = table.getRowModel().rows;
  const mobileHeaderGroup = table.getHeaderGroups()[0];
  const mobileSelectionHeader = mobileHeaderGroup?.headers.find(
    (header) => header.column.id === 'select'
  );
  const mobileSortableHeader = mobileHeaderGroup?.headers.find(
    (header) =>
      header.column.id !== 'select' &&
      header.column.id !== 'actions' &&
      header.column.getCanSort()
  );
  const mobileSortHeaderLabel =
    typeof mobileSortableHeader?.column.columnDef.header === 'string'
      ? mobileSortableHeader.column.columnDef.header
      : 'column';

  const mobileDataColumnCount =
    mobileHeaderGroup?.headers.filter(
      (header) =>
        header.column.id !== 'select' && header.column.id !== 'actions',
    ).length ?? 0;
  const mobileDetailRowCount = Math.max(mobileDataColumnCount - 1, 0);
  const mobileSkeletonRowCount = Math.min(skeletonRows, 3);

  const mobileLoadingHeader = (
    <div className='mb-3 flex h-[52px] items-center rounded border border-[var(--gray-200)] bg-[var(--gray-200)] px-4'>
      <Skeleton className='mr-4 size-5 shrink-0 rounded-[4px]' />
      <Skeleton className='h-4 w-20 flex-1 rounded' />
      <Skeleton className='size-[26px] shrink-0 rounded' />
    </div>
  );

  const mobileTableHeader = mobileHeaderGroup ? (
    <div className='flex items-center bg-[var(--gray-200)] px-4 py-3 rounded border border-[var(--gray-200)]'>
      {mobileSelectionHeader && !mobileSelectionHeader.isPlaceholder ? (
        <div className='mr-4 flex shrink-0 items-center **:data-[slot=checkbox]:size-5 **:data-[slot=checkbox]:rounded'>
          {flexRender(mobileSelectionHeader.column.columnDef.header, mobileSelectionHeader.getContext())}
        </div>
      ) : null}

      <div className='min-w-0 flex-1 text-sm font-normal leading-normal text-[var(--gray-600)]'>Select All</div>

      {mobileSortableHeader ? (
        <CustomButton
          type='button'
          title={null}
          onClick={mobileSortableHeader.column.getToggleSortingHandler()}
          width='size-[26px] p-0'
          variant='ghost'
          aria-label={`Sort by ${mobileSortHeaderLabel}`}
          contentClassName='w-full h-full gap-0'
          leadingIcon={<ArrowUpDownIcon className={cn('size-3.5', mobileSortableHeader.column.getIsSorted() ? 'text-primary' : undefined)} />}
        />
      ) : null}
    </div>
  ) : null;

  const renderMobileRow = (row: Row<TData>) => {
    const visibleCells = row.getVisibleCells();
    const selectionCell = visibleCells.find((cell) => cell.column.id === 'select');
    const actionsCell = visibleCells.find((cell) => cell.column.id === 'actions');
    const dataCells = visibleCells.filter(
      (cell) => cell.column.id !== 'select' && cell.column.id !== 'actions'
    );
    const primaryCell = dataCells[0];
    const detailCells = dataCells.slice(1);
    const tooltipContent = getRowTooltip ? getRowTooltip(row) : undefined;

    const mobileCard = (
      <div
        key={row.id}
        data-state={row.getIsSelected() ? 'selected' : undefined}
        data-inactive={tooltipContent ? true : undefined}
        className={cn('overflow-hidden rounded border border-[var(--gray-200)] bg-white', getRowClassName?.(row))}
      >
        <div className='flex items-center bg-[var(--gray-200)] px-4 py-2.5 h-[52px]'>
          {selectionCell ? (
            <div className='mr-4 flex shrink-0 items-center **:data-[slot=checkbox]:size-5 **:data-[slot=checkbox]:rounded'>
              {flexRender(selectionCell.column.columnDef.cell, selectionCell.getContext())}
            </div>
          ) : null}

          {primaryCell ? (
            <div className='min-w-0 flex-1 text-sm font-semibold leading-normal text-[var(--gray-700)]'>
              {flexRender(primaryCell.column.columnDef.cell, primaryCell.getContext())}
            </div>
          ) : null}

          {actionsCell ? (
            <div className='ml-4 flex shrink-0 items-center justify-end text-[var(--gray-700)] [&_button]:size-7 [&_svg]:size-4'>
              {flexRender(actionsCell.column.columnDef.cell, actionsCell.getContext())}
            </div>
          ) : null}
        </div>

        <div className='divide-y divide-[var(--gray-200)]'>
          {detailCells.map((cell) => (
            <div
              key={cell.id}
              className='grid grid-cols-[96px_minmax(0,1fr)] sm:grid-cols-[128px_minmax(0,1fr)] items-center bg-white px-4 py-2.5 min-h-[45px] gap-4'
            >
              <div className='text-sm leading-normal text-[var(--gray-500)]'>{getReadableColumnLabel(row, cell.column.id)}</div>
              <div className='min-w-0 text-sm font-normal leading-normal text-[var(--gray-600)] truncate'>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    if (!tooltipContent) {
      return mobileCard;
    }

    return (
      <TooltipProvider key={row.id}>
        <Tooltip>
          <TooltipTrigger asChild>{mobileCard}</TooltipTrigger>
          <TooltipContent
            side={tooltipSide}
            className={cn('p-2 rounded-md', tooltipClassName)}
          >
            {renderTooltipContent(
              tooltipContent,
              tooltipTitleClassName,
              tooltipBodyClassName
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <>
      <div className='sr-only font-normal text-gray-500'>
        {isLoading ? 'Loading table data.' : ''} {rows.length === 0 && !isLoading ? noResultsMessage : ''}
      </div>

      <div className='md:hidden'>
        {isLoading
          ? mobileLoadingHeader
          : mobileTableHeader
            ? <div className='mb-3'>{mobileTableHeader}</div>
            : null}
        {isLoading ? (
          <div className='flex flex-col gap-3'>
            {Array.from({ length: mobileSkeletonRowCount }).map((_, rowIndex) => (
              <div
                key={`mobile-skeleton-row-${rowIndex}`}
                className='overflow-hidden rounded border border-[var(--gray-200)] bg-white'
              >
                <div className='flex h-[52px] items-center bg-[var(--gray-200)] px-4'>
                  <Skeleton className='mr-4 size-5 shrink-0 rounded-[4px]' />
                  <Skeleton className='h-4 w-24 flex-1 rounded' />
                  <Skeleton className='ml-4 size-7 shrink-0 rounded-md' />
                </div>
                <div className='divide-y divide-[var(--gray-200)]'>
                  {Array.from({ length: mobileDetailRowCount }).map((__, cellIndex) => (
                    <div
                      key={`mobile-skeleton-cell-${rowIndex}-${cellIndex}`}
                      className='grid grid-cols-[96px_minmax(0,1fr)] sm:grid-cols-[128px_minmax(0,1fr)] items-center bg-white px-4 py-2.5 min-h-[45px] gap-4'
                    >
                      <Skeleton
                        className={cn(
                          'h-4 rounded',
                          MOBILE_DETAIL_LABEL_WIDTHS[cellIndex % MOBILE_DETAIL_LABEL_WIDTHS.length],
                        )}
                      />
                      <Skeleton
                        className={cn(
                          'h-4 rounded',
                          MOBILE_DETAIL_VALUE_WIDTHS[cellIndex % MOBILE_DETAIL_VALUE_WIDTHS.length],
                        )}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : rows.length > 0 ? (
          <div className='flex flex-col gap-3'>{rows.map(renderMobileRow)}</div>
        ) : (
          <div className='rounded border border-[var(--gray-200)] bg-white p-8 text-center text-sm text-gray-500'>
            {noResultsMessage}
          </div>
        )}
      </div>

      <div
        className={cn(containerClassName, 'hidden md:block')}
        style={
          // Only apply explicit height when the table has more than 4 data rows
          rows.length > 4 ? { height: tableHeight } : undefined
        }
      >
        <Table
          className={tableClassName}
          style={{ minWidth: tableMinWidth }}
        >
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className={headerRowClassName}
              >
                {headerGroup.headers.map((header) => {
                  const isActionsColumn = header.column.id === 'actions';
                  const hasDropdown = header.column.id === 'site';
                  const alignmentClass = isActionsColumn ? 'text-center' : '';

                  return (
                    <TableHead
                      key={header.id}
                      className={`${headerCellClassName} ${alignmentClass} ${tableHeaderHeight} ${(header.column.columnDef.meta as ColumnMeta)?.headerClassName || ''}`}
                      style={{
                        width: (header.column.columnDef.meta as ColumnMeta)?.width,
                        textAlign: isActionsColumn ? 'center' : undefined,
                        paddingLeft: isActionsColumn || hasDropdown ? undefined : '16px',
                        overflow:
                          (header.column.columnDef.meta as ColumnMeta)?.overflow === 'ellipsis'
                            ? 'hidden'
                            : (header.column.columnDef.meta as ColumnMeta)?.overflow,
                        textOverflow:
                          (header.column.columnDef.meta as ColumnMeta)?.overflow === 'ellipsis'
                            ? 'ellipsis'
                            : (header.column.columnDef.meta as ColumnMeta)?.textOverflow,
                        whiteSpace:
                          (header.column.columnDef.meta as ColumnMeta)?.overflow === 'ellipsis'
                            ? 'nowrap'
                            : (header.column.columnDef.meta as ColumnMeta)?.whiteSpace,
                      }}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={`flex items-center ${isActionsColumn ? 'justify-center' : ''} gap-4 ${!isActionsColumn ? 'cursor-pointer select-none' : ''} font-bold`}
                          onClick={!isActionsColumn ? header.column.getToggleSortingHandler() : undefined}
                          onKeyDown={
                            !isActionsColumn
                              ? (e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    header.column.toggleSorting();
                                  }
                                }
                              : undefined
                          }
                          role={!isActionsColumn ? 'button' : undefined}
                          tabIndex={!isActionsColumn ? 0 : undefined}
                          aria-label={!isActionsColumn ? 'Toggle sorting' : undefined}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {!isActionsColumn && header.column.getCanSort() && (
                            <ArrowUpDownIcon
                              size={14}
                              className={`
                                ${header.column.getIsSorted() ? 'text-primary' : 'text-[var(--text-primary)]'}
                                hover:text-primary
                              `}
                            />
                          )}
                        </div>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {children ||
              (isLoading ? (
                Array.from({ length: skeletonRows }).map((_, rowIndex) => (
                  <TableRow
                    key={`skeleton-row-${rowIndex}`}
                    className={cn(
                      'bg-white px-2 m-0 box-border relative z-10',
                      bodyRowClassName,
                      tableRowHeight,
                    )}
                  >
                    {table.getHeaderGroups()[0]?.headers.map((header, cellIndex) => {
                      const isActionsColumn = header.column.id === 'actions';
                      const hasDropdown = header.column.id === 'site';
                      const alignmentClass = isActionsColumn ? 'text-center align-middle' : '';

                      return (
                        <TableCell
                          key={`skeleton-cell-${rowIndex}-${cellIndex}`}
                          className={`${bodyCellClassName} ${alignmentClass} ${(header.column.columnDef.meta as ColumnMeta)?.cellClassName || ''}`}
                          style={{
                            width: (header.column.columnDef.meta as ColumnMeta)?.width,
                            textAlign: isActionsColumn ? 'center' : undefined,
                            paddingLeft: isActionsColumn || hasDropdown ? undefined : '16px',
                            overflow:
                              (header.column.columnDef.meta as ColumnMeta)?.overflow === 'ellipsis'
                                ? 'hidden'
                                : (header.column.columnDef.meta as ColumnMeta)?.overflow,
                            textOverflow:
                              (header.column.columnDef.meta as ColumnMeta)?.overflow === 'ellipsis'
                                ? 'ellipsis'
                                : (header.column.columnDef.meta as ColumnMeta)?.textOverflow,
                            whiteSpace:
                              (header.column.columnDef.meta as ColumnMeta)?.overflow === 'ellipsis'
                                ? 'nowrap'
                                : (header.column.columnDef.meta as ColumnMeta)?.whiteSpace,
                          }}
                        >
                          {getDesktopSkeletonCell(header.column.id)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              ) : rows.length > 0 ? (
                rows.map((row) => {
                  const isSelected = row.getIsSelected();
                  // const isEven = index % 2 === 0;

                  const baseRowClasses = [
                    'px-2 m-0 box-border relative z-10 group data-[inactive=true]:hover:[&_td]:border-[var(--table-border)] data-[inactive=true]:hover:[&_td]:text-[#4B5563]',
                    bodyRowClassName,
                    tableRowHeight,
                  ];

                  // const alternatingBg = !isEven
                  //   ? 'bg-[var(--table-background-secondary)]'
                  //   : 'bg-white';
                  // const hasHoverStyles = bodyRowClassName?.includes('hover:');
                  // const hoverEffects = hasHoverStyles
                  //   ? ''
                  //   : 'hover:text-[var(--primary)] hover:bg-[var(--highlight)]';
                  // const conditionalClasses = `${alternatingBg} ${hoverEffects}`;
                  const customRowClassName = getRowClassName ? getRowClassName(row) : undefined;

                  const finalClassName = [
                    ...baseRowClasses,
                    // conditionalClasses, use css directly instead of conditionalClasses
                    customRowClassName,
                  ]
                    .filter(Boolean)
                    .join(' ');

                  const tooltipContent = getRowTooltip ? getRowTooltip(row) : undefined;

                  const rowElement = (
                    <TableRow
                      key={row.id}
                      data-state={isSelected ? 'selected' : undefined}
                      data-inactive={tooltipContent ? true : undefined}
                      className={finalClassName}
                    >
                      {row.getVisibleCells().map((cell) => {
                        const isActionsColumn = cell.column.id === 'actions';
                        const hasDropdown = cell.column.id === 'site';
                        const alignmentClass = isActionsColumn ? 'text-center align-middle' : '';

                        return (
                          <TableCell
                            key={cell.id}
                            className={`${bodyCellClassName} ${alignmentClass} ${(cell.column.columnDef.meta as ColumnMeta)?.cellClassName || ''}`}
                            style={{
                              width: (cell.column.columnDef.meta as ColumnMeta)?.width,
                              textAlign: isActionsColumn ? 'center' : undefined,
                              paddingLeft: isActionsColumn || hasDropdown ? undefined : '16px',
                              overflow:
                                (cell.column.columnDef.meta as ColumnMeta)?.overflow === 'ellipsis'
                                  ? 'hidden'
                                  : (cell.column.columnDef.meta as ColumnMeta)?.overflow,
                              textOverflow:
                                (cell.column.columnDef.meta as ColumnMeta)?.overflow === 'ellipsis'
                                  ? 'ellipsis'
                                  : (cell.column.columnDef.meta as ColumnMeta)?.textOverflow,
                              whiteSpace:
                                (cell.column.columnDef.meta as ColumnMeta)?.overflow === 'ellipsis'
                                  ? 'nowrap'
                                  : (cell.column.columnDef.meta as ColumnMeta)?.whiteSpace,
                            }}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );

                  if (tooltipContent) {
                    return (
                      <TooltipProvider key={row.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>{rowElement}</TooltipTrigger>
                          <TooltipContent
                            side={tooltipSide}
                            className={cn('p-2 rounded-md', tooltipClassName)}
                          >
                            {renderTooltipContent(tooltipContent, tooltipTitleClassName, tooltipBodyClassName)}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  }

                  return rowElement;
                })
              ) : (
                <TableRow className={`${tableRowHeight}`}>
                  <TableCell
                    colSpan={table.getAllColumns().length}
                    className='text-center text-sm text-gray-500'
                  >
                    {noResultsMessage}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
