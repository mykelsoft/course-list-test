// components/ui/data-table.tsx
import type {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Define the default value outside the component.
const DEFAULT_FILTER_FIELDS: string[] = [];

export type CustomTablePropsType<TData> = React.PropsWithChildren<{
  row: Row<TData>;
}> & { [x: string]: any };

type DataTableProps<TData> = {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  filterFields?: string[];
  CTableRow?: (props: CustomTablePropsType<TData>) => React.JSX.Element;
};

export function DataTable<TData extends Record<string, unknown>>({
  columns,
  data,
  filterFields = DEFAULT_FILTER_FIELDS,
  CTableRow,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      {/* Wrap in an overflow container to enable horizontal scrolling if needed */}
      <div className="overflow-x-auto">
        <div className="flex flex-nowrap items-center gap-4 py-4">
          {filterFields.map((field) => {
            // Attempt to find the column for the given field.
            const column = table.getColumn(field);
            if (!column) {
              return null;
            }
            return (
              <Input
                key={field}
                placeholder={`Filter by ${field}...`}
                value={(column.getFilterValue() as string) ?? ''}
                onChange={(event) => column.setFilterValue(event.target.value)}
                className="max-w-sm"
              />
            );
          })}
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) =>
                CTableRow ? (
                  <CTableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    row={row}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        width={
                          cell.column.columnDef.meta &&
                          'width' in cell.column.columnDef.meta
                            ? `${cell.column.columnDef.meta.width}`
                            : undefined
                        }
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </CTableRow>
                ) : (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              )
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
