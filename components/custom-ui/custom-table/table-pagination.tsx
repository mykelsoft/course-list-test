// File: ./components/custom-ui/custom-table/table-pagination.tsx
'use client';
// components/custom-ui/custom-table/table-pagination.tsx
import type { Table as TanstackTable } from '@tanstack/react-table';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { APPS } from '#types/ENUMS';
import Themes from '../styling/Themes';
import { cn } from '@/lib/utils';

type TablePaginationProps<TData> = {
  table: TanstackTable<TData>;
  app?: APPS;
};

export function TablePagination<TData>({
  table,
  app = APPS.PORTAL,
}: TablePaginationProps<TData>) {
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();
  const theme = Themes(app);

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
    <div className="flex items-center justify-center space-x-2 py-4 text-sm">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => table.setPageIndex(0)}
        disabled={!table.getCanPreviousPage()}
        aria-label="Go to first page"
        className={theme.button.ghost}
      >
        <ChevronsLeft size={14} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
        aria-label="Go to previous page"
        className={theme.button.ghost}
      >
        <ChevronLeft size={14} className="mr-1" />
        Previous
      </Button>

      <div className="flex items-center gap-1">
        {pageItems.map((pageNumber, idx) => {
          if (pageNumber === '...') {
            return (
              <span key={`ellipsis-${idx}`} className="px-2">
                ...
              </span>
            );
          }
          const pageIndex = Number(pageNumber) - 1;
          const isCurrentPage =
            pageIndex === table.getState().pagination.pageIndex;
          return (
            <Button
              key={`page-${pageNumber}`}
              variant="ghost"
              size="sm"
              className={cn(
                'w-8 h-8 p-0',
                theme.button.ghost,
                isCurrentPage &&
                  `pointer-events-none font-bold ${theme.button.secondary}`
              )}
              onClick={() => table.setPageIndex(pageIndex)}
              aria-label={`Go to page ${pageNumber}`}
              aria-current={isCurrentPage ? 'page' : undefined}
            >
              {pageNumber}
            </Button>
          );
        })}
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
        aria-label="Go to next page"
        className={theme.button.ghost}
      >
        Next
        <ChevronRight size={14} className="ml-1" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        disabled={!table.getCanNextPage()}
        aria-label="Go to last page"
        className={theme.button.ghost}
      >
        <ChevronsRight size={14} />
      </Button>
    </div>
  );
}
