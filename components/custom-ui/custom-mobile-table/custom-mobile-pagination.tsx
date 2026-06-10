'use client';

import * as React from 'react';
import CustomButton from '../custom-button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface CustomMobilePaginationProps {
  /** Current page index (0-based) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Optional className for the container */
  className?: string;
}

export function CustomMobilePagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: CustomMobilePaginationProps) {
  if (totalPages <= 1) return null;

  const handlePrevious = () => {
    onPageChange(Math.max(0, currentPage - 1));
  };

  const handleNext = () => {
    onPageChange(Math.min(totalPages - 1, currentPage + 1));
  };

  const getPageNumbers = (): number[] => {
    const pageNumbers: number[] = [];
    if (totalPages <= 5) {
      // Show all pages if 5 or less
      for (let i = 0; i < totalPages; i++) {
        pageNumbers.push(i);
      }
    } else if (currentPage < 3) {
      // Near the start
      for (let i = 0; i < 5; i++) {
        pageNumbers.push(i);
      }
    } else if (currentPage > totalPages - 4) {
      // Near the end
      for (let i = totalPages - 5; i < totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // In the middle
      for (let i = currentPage - 2; i <= currentPage + 2; i++) {
        pageNumbers.push(i);
      }
    }
    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={`flex items-center justify-center gap-2 mt-4 pb-4 ${className || ''}`}>
      <CustomButton
        variant="ghost"
        title="Previous"
        onClick={handlePrevious}
        disabled={currentPage === 0}
        className="h-8 text-sm font-normal hover:bg-[var(--highlight)] hover:text-[var(--primary)] disabled:opacity-50"
        leadingIcon={<ChevronLeft size={16} />}
      />
      <div className="flex items-center gap-1">
        {pageNumbers.map((pageNum) => (
          <CustomButton
            key={`page-${pageNum}`}
            variant="ghost"
            title={(pageNum + 1).toString()}
            onClick={() => onPageChange(pageNum)}
            className={`!p-0 w-8 h-8 text-sm font-normal ${
              currentPage === pageNum
                ? 'text-[var(--primary)] bg-[var(--highlight)]'
                : 'text-[#374151] hover:bg-[var(--highlight)] hover:text-[var(--primary)]'
            }`}
          />
        ))}
      </div>
      <CustomButton
        variant="ghost"
        title="Next"
        onClick={handleNext}
        disabled={currentPage >= totalPages - 1}
        className="h-8 text-sm font-normal hover:bg-[var(--highlight)] hover:text-[var(--primary)] disabled:opacity-50"
        trailingIcon={<ChevronRight size={16} />}
      />
    </div>
  );
}
