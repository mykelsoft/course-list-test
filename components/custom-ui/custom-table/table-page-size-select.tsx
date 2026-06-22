'use client';

import { useSyncExternalStore } from 'react';
import type { Table as TanstackTable } from '@tanstack/react-table';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const PAGE_SIZE_OPTIONS = [10, 20, 30, 50] as const;

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

type TablePageSizeSelectProps<TData> = {
  table: TanstackTable<TData>;
  triggerClassName?: string;
  contentClassName?: string;
};

export function TablePageSizeSelect<TData>({
  table,
  triggerClassName,
  contentClassName = 'w-20',
}: TablePageSizeSelectProps<TData>) {
  const isClient = useIsClient();
  const pageSize = table.getState().pagination.pageSize;

  if (!isClient) {
    return (
      <div
        className={cn(
          'flex h-[37px] w-[54px] items-center justify-center rounded border border-[var(--gray-300)] bg-white p-2 text-sm font-medium text-[var(--gray-700)]',
          triggerClassName,
        )}
        aria-hidden='true'
      >
        {pageSize}
      </div>
    );
  }

  return (
    <Select
      value={String(pageSize)}
      onValueChange={(val) => table.setPageSize(Number(val))}
    >
      <SelectTrigger
        className={cn(
          'h-[37px]! w-[54px] font-medium text-[var(--gray-700)] bg-white p-2 gap-0 rounded border-[var(--gray-300)]',
          triggerClassName,
        )}
      >
        <SelectValue placeholder={pageSize} />
      </SelectTrigger>
      <SelectContent className={contentClassName}>
        {PAGE_SIZE_OPTIONS.map((size) => (
          <SelectItem
            key={size}
            value={String(size)}
          >
            {size}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
