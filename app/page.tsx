// app/page.tsx
'use client';

import { ActionType, useCoursesTable } from '@/hooks/useCoursesTable';
import { Archive, InfoIcon, Plus, SearchIcon } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import type { FilterFn } from '@tanstack/react-table';

import { APPS, type CourseWithDetails } from '@/types/courses';
import CustomButton from '@/components/custom-ui/custom-button';
import CustomDeleteDialog from '@/components/custom-ui/custom-delete-dialog';
import { CustomTable } from '@/components/custom-ui/custom-table/custom-table';
import { Glowing } from '@/components/custom-ui/styling/glowing';
import { Input } from '@/components/ui/input';
import PageInfoBanner from '@/components/PageInfoBanner';
import { TablePagination } from '@/components/custom-ui/custom-table/table-pagination';
import { cn } from '@/lib/utils';
// Assuming you migrate columns to a local component folder
import { CourseFiltersPopover } from '@/components/course-list/course-filters-popover';
import AddCompanyForm from '@/components/course-list/add-company-form';
import { getCourseListColumns } from '@/components/course-list/course-list-columns';

export default function CoursesPage() {
  const [showAddForm, setShowAddForm] = useState(false);

  // We pass an empty array initially; the hook will fetch mock data on mount
  const {
    state,
    dispatch,
    handleDeleteCourse,
    handleDuplicateCourse,
    handleArchiveCourse,
    handleBulkArchive,
    onBulkArchiveConfirm,
    setSorting,
    setPagination,
    setGlobalFilter,
    setRowSelection,
    setColumnFilters,
    selectedCount,
    handlers,
  } = useCoursesTable([]); 

  const {
    courses,
    isLoading,
    sorting,
    pagination,
    rowSelection,
    globalFilter,
    columnFilters,
    deleteDialogOpen,
    duplicateDialogOpen,
    archiveDialogOpen,
    bulkArchiveDialogOpen,
    selectedCourse,
    isProcessing,
    filters,
    allCompanies,
  } = state;

  const columns = useMemo(
    () =>
      getCourseListColumns({
        handleView: (course) => {
          console.log('View unit clicked:', course.id);
        },
        handleEdit: (course) => {
          console.log('Edit unit clicked:', course.id);
        },
        handleDuplicate: (course) => {
          dispatch({ type: ActionType.OPEN_DUPLICATE_DIALOG, payload: course });
        },
        handleAssign: (course) => {
          console.log('Add to company or job role clicked:', course.id);
        },
        handleShowJobRoles: (course) => {
          console.log('Show job roles clicked:', course.id);
        },
        handleArchive: handlers.handleOpenArchiveDialog,
      }),
    [dispatch, handlers.handleOpenArchiveDialog]
  );

  const getSearchableValue: FilterFn<CourseWithDetails> = (
    row,
    _columnId,
    filterValue
  ) => {
      const searchValue = String(filterValue ?? '')
        .trim()
        .toLowerCase();

      if (!searchValue) {
        return true;
      }

      const { id, name, unitType, assignedCompanies, price, is_paid } = row.original;
      const searchableValue = [id, name, unitType, assignedCompanies, is_paid ? price : 'Free']
        .filter((value) => value !== null && value !== undefined)
        .join(' ')
        .toLowerCase();

      return searchableValue.includes(searchValue);
  };

  const table = useReactTable({
    data: courses,
    columns,
    state: { sorting, pagination, globalFilter, rowSelection, columnFilters },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    globalFilterFn: getSearchableValue,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: true,
  });

  const hasSelectedRows = table.getSelectedRowModel().rows.length > 0;

  return (
    <>
      {showAddForm ? (
        <div className='px-4 py-7 md:px-10 md:py-6'>
          <AddCompanyForm onBack={() => setShowAddForm(false)} />
        </div>
      ) : (
        <>
          {/* Top Controls: Search & Add */}
          <div className='bg-white py-4 md:px-6 px-4 border-b border-[var(--gray-200)]'>
            <div className='flex items-center md:gap-4 gap-2'>
              <CourseFiltersPopover
                app={APPS.TRAINING}
                filters={filters}
                companyOptions={allCompanies}
                onApply={handlers.handleFilterChange}
              />

              <div className='flex-1 min-w-0'>
                <div
                  className={cn(
                    'relative flex-1 rounded-md bg-[var(--gray-50)] transition-shadow focus-within:ring-1 focus-within:ring-primary focus-within:shadow-[0_0_6px_var(--primary-shadow)]',
                    Glowing(APPS.TRAINING).inputBox,
                  )}
                >
                  <div className='absolute left-3 top-1/2 -translate-y-1/2 text-[var(--gray-700)]'>
                    <SearchIcon size={16} />
                  </div>
                  <Input
                    type='search'
                    placeholder='Search Unit'
                    value={globalFilter}
                    onChange={(event) => setGlobalFilter(event.target.value)}
                    className='placeholder:text-[var(--gray-400)] focus:placeholder:text-transparent transition-colors duration-200 text-sm border-none h-[37px] pl-9 shadow-none ring-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0'
                  />
                </div>
              </div>
            </div>
          </div>

          <div className='px-4 py-7 md:p-10'>
            <PageInfoBanner
              title='Active Units List'
              subtitle='List of active units available on the platform.'
            />

            {/* Middle Controls: Results Count & Bulk Actions */}
            <div className='flex flex-col md:flex-row md:justify-between md:items-center mb-2 md:mb-4 gap-4'>
              <div className='flex items-center text-sm text-[var(--gray-700)] order-2 md:order-1 py-0.5'>
                <div className='flex items-center gap-2.5'>
                  <span className='md:inline-block hidden text-[var(--gray-700)] text-sm leading-normal'>Show</span>
                  <Select
                    value={String(pagination.pageSize)}
                    onValueChange={(val) => table.setPageSize(Number(val))}
                  >
                    <SelectTrigger className='h-[37px]! w-[54px] font-medium text-[var(--gray-700)] bg-white p-2 gap-0 rounded border-[var(--gray-300)]'>
                      <SelectValue placeholder={pagination.pageSize} />
                    </SelectTrigger>
                    <SelectContent className='w-20'>
                      {[10, 20, 30, 50].map((size) => (
                        <SelectItem
                          key={size}
                          value={String(size)}
                        >
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className='md:inline-block hidden text-[var(--gray-700)] text-sm leading-normal'>
                    of {table.getFilteredRowModel().rows.length} result{table.getFilteredRowModel().rows.length > 1 ? 's' : ''}
                  </span>
                </div>

                <div className='h-[37px] w-px bg-[var(--gray-300)] md:ml-6 mr-2 ml-3' />

                <CustomButton
                  title='Archive'
                  onClick={handleBulkArchive}
                  disabled={!hasSelectedRows}
                  leadingIcon={<Archive className='mr-1 size-[18px]' />}
                  app={APPS.TRAINING}
                  variant='ghost'
                  buttonClass='px-3 text-sm rounded text-[var(--gray-700)] font-normal'
                />
              </div>

              <CustomButton
                title='Add Unit'
                onClick={() => setShowAddForm(true)}
                leadingIcon={<Plus className='size-3.5 -mt-0.5' />}
                app={APPS.TRAINING}
                buttonClass='order-1 md:order-2'
              />
            </div>

            <CustomTable
              table={table}
              isLoading={isLoading}
              noResultsMessage='No units found.'
              skeletonRows={pagination.pageSize}
              headerRowClassName='hover:bg-[var(--gray-200)]/80 bg-[var(--gray-200)] border-b-0'
              headerCellClassName='text-[var(--gray-800)] font-semibold text-sm px-4 py-3'
              bodyRowClassName='hover:bg-[var(--gray-50)] transition-colors border-b-0'
              bodyCellClassName='px-4 py-3 text-sm text-[var(--gray-600)]'
              tableClassName='custom-table'
              tableHeaderHeight='h-[45px]'
              tableRowHeight='h-[60px]'
            />

            {table.getPageCount() > 1 && (
              <div className='pt-4 sm:py-[22px]'>
                <TablePagination
                  table={table}
                  app={APPS.TRAINING}
                />
              </div>
            )}
          </div>
        </>
      )}

      {/* Dialogs */}
      <CustomDeleteDialog
        isOpen={deleteDialogOpen}
        setIsOpen={() => dispatch({ type: ActionType.CLOSE_DELETE_DIALOG })}
        onDelete={handleDeleteCourse}
        title='Delete Course'
        message={`Are you sure you want to delete "${selectedCourse?.name}"?`}
        description='This action cannot be undone.'
        isLoading={isProcessing}
        onDeleteTitle='Delete'
        app={APPS.TRAINING}
        confirmButtonVariant='destructive'
      />

      <CustomDeleteDialog
        isOpen={duplicateDialogOpen}
        setIsOpen={() => dispatch({ type: ActionType.CLOSE_DIALOGS })}
        onDelete={handleDuplicateCourse}
        title='Duplicate Course'
        message='Are you sure you want to duplicate this course?'
        description='This will create an exact copy of the course.'
        isLoading={isProcessing}
        onDeleteTitle='Confirm'
        cancelButtonText='Cancel'
        app={APPS.TRAINING}
        confirmButtonVariant='default'
        icon={<InfoIcon className='text-[#FFA600] h-5 w-5' />}
      />

      <CustomDeleteDialog
        isOpen={archiveDialogOpen}
        setIsOpen={() => dispatch({ type: ActionType.CLOSE_DIALOGS })}
        onDelete={handleArchiveCourse}
        title='Archive Unit'
        message={`Are you sure you want to archive "${selectedCourse?.name}"?`}
        description='This course will be moved to the archive.'
        isLoading={isProcessing}
        onDeleteTitle='Archive'
        app={APPS.TRAINING}
        confirmButtonVariant='default'
      />

      <CustomDeleteDialog
        isOpen={bulkArchiveDialogOpen}
        setIsOpen={() => dispatch({ type: ActionType.CLOSE_DIALOGS })}
        onDelete={onBulkArchiveConfirm}
        title='Archive Selected Courses?'
        message={`Are you sure you want to archive ${selectedCount} course(s)?`}
        description='These courses will be moved to the archive.'
        isLoading={isProcessing}
        onDeleteTitle='Archive All'
        app={APPS.TRAINING}
        confirmButtonVariant='default'
      />
    </>
  );
}
