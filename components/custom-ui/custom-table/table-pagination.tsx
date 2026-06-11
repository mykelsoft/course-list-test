// File: ./components/custom-ui/custom-table/table-pagination.tsx
'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import { APPS } from '#types/ENUMS';
import { Button } from '@/components/ui/button';
import CustomButton from '../custom-button';
import React from 'react';
// components/custom-ui/custom-table/table-pagination.tsx
import type { Table as TanstackTable } from '@tanstack/react-table';
import { cn } from '@/lib/utils';

type TablePaginationProps<TData> = {
  table: TanstackTable<TData>;
  app?: APPS;
};

export function TablePagination<TData>({
  table,
}: TablePaginationProps<TData>) {
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();
  const canGoPrevious = table.getCanPreviousPage();
  const canGoNext = table.getCanNextPage();

  const activePageButtonClass = 'pointer-events-none font-semibold text-[var(--primary)] bg-[var(--highlight)]';

  // Function to generate page numbers with ellipsis
  const getPageNumbers = (): (number | string)[] => {
    const pageNumbers: (number | string)[] = [];
    if (totalPages <= 5) {
      // Show all if 5 or less
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1); // Always show first page
      if (currentPage <= 3) {
        // Near the start
        pageNumbers.push(2, 3);
        pageNumbers.push('...');
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pageNumbers.push('...');
        pageNumbers.push(totalPages - 2, totalPages - 1);
      } else {
        // In the middle
        pageNumbers.push('...');
        pageNumbers.push(currentPage - 1, currentPage, currentPage + 1);
        pageNumbers.push('...');
      }
      pageNumbers.push(totalPages); // Always show last page
    }
    // Remove duplicate ellipsis and ensure correct order
    const uniquePages: (number | string)[] = [];
    let lastItem: number | string | null = null;
    for (const item of pageNumbers) {
      if (item === '...' && lastItem === '...') continue;
      uniquePages.push(item);
      lastItem = item;
    }
    return uniquePages;
  };

  const pageItems = getPageNumbers();

  return (
    <nav
      aria-label='Pagination'
      className='flex items-center justify-center text-sm'
    >
      <CustomButton
        variant='ghost'
        size='sm'
        onClick={() => table.previousPage()}
        disabled={!canGoPrevious}
        title='Previous'
        leadingIcon={
          <ChevronLeft
            size={18}
            strokeWidth={1.75}
            className='size-[18px]'
          />}
        aria-label='Go to previous page'
        className='rounded pl-2 pr-3 text-[var(--gray-700)]'
      />

      <div className='mx-2.5 flex items-center gap-2.5'>
        {pageItems.map((pageNumber, idx) => {
          if (pageNumber === '...') {
            return (
              <span
                key={`ellipsis-${idx}`}
                className='flex size-7 items-center justify-center font-medium text-[var(--gray-700)]'
                aria-hidden='true'
              >
                ...
              </span>
            );
          }
          const pageIndex = Number(pageNumber) - 1;
          const isCurrentPage = pageIndex === table.getState().pagination.pageIndex;
          return (
            <CustomButton
              key={`page-${pageNumber}`}
              variant='ghost'
              size='sm'
              className={cn('text-[var(--gray-700)] rounded px-2.5', isCurrentPage && activePageButtonClass)}
              onClick={() => table.setPageIndex(pageIndex)}
              aria-label={`Go to page ${pageNumber}`}
              aria-current={isCurrentPage ? 'page' : undefined}
              title={pageNumber.toString()}
            />
          );
        })}
      </div>

      <CustomButton
        variant='ghost'
        size='sm'
        onClick={() => table.nextPage()}
        disabled={!canGoNext}
        title='Next'
        aria-label='Go to next page'
        trailingIcon={
          <ChevronRight
            size={18}
            strokeWidth={1.75}
            className='size-[18px]'
          />}
        className='rounded pl-3 pr-2 text-[var(--gray-700)]'
      />
    </nav>
  );
}
