import type { Table } from '@tanstack/react-table';
import CustomButton from './custom-button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
// ... existing code ...

const CustomPageCounter = ({ table }: { table: Table<any> }) => {
  const totalPages = table.getPageCount();

  if (totalPages <= 1) return null; // No pagination needed if there's only one page

  return (
    <div className="flex justify-center items-center mt-6 pt-2">
      <div className="flex items-center space-x-1">
        <CustomButton
          variant="ghost"
          title="Previous"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="h-8 rounded-xs text-sm font-regular cursor-pointer bg-transparent hover:bg-[var(--highlight)] hover:text-[var(--primary)]"
          leadingIcon={<ChevronLeft className="h-4 w-4" />}
        />

        {Array.from({ length: Math.min(table.getPageCount(), 3) }).map(
          (_, index) => (
            <CustomButton
              title={(index + 1).toString()}
              key={`page-${table.getState().pagination.pageIndex + index + 1}`}
              variant="ghost"
              onClick={() => table.setPageIndex(index)}
              className={`!p-0 w-4 h-8 rounded-xs text-sm font-regular ${
                table.getState().pagination.pageIndex !== index
                  ? 'text-gray-700 hover:text-[var(--primary)] hover:bg-[var(--highlight)] bg-transparent border-none shadow-none cursor-pointer'
                  : 'text-[var(--primary)] bg-[var(--highlight)] border-none shadow-none font-light'
              }`}
            />
          )
        )}

        {table.getPageCount() > 3 && <span className="px-2">...</span>}

        <CustomButton
          variant="ghost"
          title="Next"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="h-8 rounded-xs cursor-pointer text-sm font-regular bg-transparent hover:bg-[var(--highlight)] hover:text-[var(--primary)]"
          trailingIcon={<ChevronRight className="h-4 w-4" />}
        />
      </div>
    </div>
  );
};

export default CustomPageCounter;
