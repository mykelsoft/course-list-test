// Assuming Shadcn Skeleton
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import React from 'react';
// components/custom-ui/custom-table/generic-table.tsx
import type { Table as TanstackTable } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';

// Assuming Shadcn Table components

// Define ColumnMeta if you use it for widths, otherwise remove
export type ColumnMeta = {
  width?: string;
};

// Props for the generic table component
type GenericTableProps<TData> = {
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
};

// Helper Icon (replace with your actual Lucide or other icon)
function ArrowUpDownIconOrSimilar({
  size,
  className,
}: {
  size: number;
  className: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m3 16 4 4 4-4" />
      <path d="M7 20V4" />
      <path d="m21 8-4-4-4 4" />
      <path d="M17 4v16" />
    </svg>
  );
}

export function FormTable<TData>({
  table,
  isLoading,
  noResultsMessage = 'No results.',
  containerClassName = 'border border-[var(--table-border)] rounded-md overflow-auto',
  tableClassName = '',
  headerRowClassName = 'bg-[#e6e7eb] border-[#D1D5DB]  text-[#1F2937] font-semibold',
  headerCellClassName = 'text-sm bg-[var(--table-background-primary)] text-[var(--text-primary)] border-r border-[#D1D5DB] last:border-r-0 px-[16px] py-[12px]',
  bodyRowClassName = '',
  bodyCellClassName = 'h-[73px] px-[16px] py-[12px] font-normal text-gray-600 border-r border-[var(--table-border)] last:border-r-0 group-hover:border-[var(--primary)] group-hover:text-primary',
  tableHeight = '',
}: GenericTableProps<TData>) {
  return (
    <div className={containerClassName} style={{ height: tableHeight }}>
      <div className="sr-only font-normal text-gray-500">
        {isLoading} {noResultsMessage}
      </div>
      <Table className={tableClassName}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className={headerRowClassName}>
              {headerGroup.headers.map((header) => {
                // Determine alignment based on a convention (e.g., 'actions' column)
                const isActionsColumn = header.column.id === 'actions';
                const alignmentClass = isActionsColumn ? 'text-center' : '';

                return (
                  <TableHead
                    key={header.id}
                    className={`${headerRowClassName} ${headerCellClassName} ${alignmentClass}`}
                    style={{
                      // Access width from meta if defined
                      width: (header.column.columnDef.meta as ColumnMeta)
                        ?.width,
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={`flex items-center gap-1 ${
                          !isActionsColumn ? 'cursor-pointer select-none' : ''
                        }`}
                        onClick={
                          !isActionsColumn
                            ? header.column.getToggleSortingHandler()
                            : undefined
                        }
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
                        aria-label={
                          !isActionsColumn ? 'Toggle sorting' : undefined
                        }
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {/* Render sorting indicator if not actions column */}
                        {!isActionsColumn && header.column.getCanSort() && (
                          <ArrowUpDownIconOrSimilar
                            size={14}
                            className={`
                              ${
                                header.column.getIsSorted()
                                  ? 'text-[var(--primary)]'
                                  : 'text-gray-400'
                              }
                              hover:text-[var(--primary)] ml-1
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
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row, index) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className={`
                  ${
                    index % 2 === 0
                      ? `px-2 m-0 box-border relative z-10 hover:text-[var(--primary)] hover:bg-[var(--highlight)] group` // Even row
                      : `bg-[var(--table-background-secondary)] px-2 m-0 box-border relative z-10 hover:text-[var(--primary)] hover:bg-[var(--highlight)] group` // Odd row
                  }
                  ${
                    index === table.getRowModel().rows.length - 1
                      ? 'border-b border-[var(--table-border)]' // Last row border fix
                      : ''
                  }
                  ${bodyRowClassName}
                `}
              >
                {row.getVisibleCells().map((cell) => {
                  const isActionsColumn = cell.column.id === 'actions';
                  const alignmentClass = isActionsColumn
                    ? 'text-center align-middle'
                    : '';
                  const lastRowClass =
                    index === table.getRowModel().rows.length - 1
                      ? 'border-b border-[var(--table-border)]'
                      : ''; // Fix for cell border on last row

                  return (
                    <TableCell
                      key={cell.id}
                      className={`${bodyCellClassName} ${alignmentClass} ${lastRowClass}`}
                      style={{
                        width: (cell.column.columnDef.meta as ColumnMeta)
                          ?.width,
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getAllColumns().length}
                className="h-24 text-center"
              >
                {noResultsMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
