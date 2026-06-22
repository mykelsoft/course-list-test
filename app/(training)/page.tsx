// app/(training)/page.tsx
'use client';

import { ActionType, useCoursesTable } from '@/hooks/useCoursesTable';
import { Archive, InfoIcon, Plus } from 'lucide-react';
import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
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
import PageInfoBanner from '@/components/PageInfoBanner';
import { TablePagination } from '@/components/custom-ui/custom-table/table-pagination';
import { getCustomTableLayoutClass } from '@/components/course-list/custom-table-layouts';
import { getCourseListColumns } from '@/components/course-list/course-list-columns';
import { AddToCompanyDialog } from '@/components/course-list/add-to-company-dialog';
import { LinkedJobRolesDialog } from '@/components/course-list/linked-job-roles-dialog';
import { useTrainingHeader } from '@/components/training/training-layout-context';
import { ACTIVE_UNIT_LIST_BREADCRUMBS, ACTIVE_UNIT_LIST_TABS } from '@/components/training/training-nav-config';

export default function CoursesPage() {
  const router = useRouter();

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
    assignDialogOpen,
    showJobRolesDialogOpen,
    selectedCourse,
    isProcessing,
    dialogError,
    filters,
    allCompanies,
    linkedJobRoles,
    isLoadingJobRoles,
  } = state;

  const unitTypeOptions = useMemo(
    () => [...new Set(courses.map((course) => course.unitType))].sort(),
    [courses],
  );

  const headerConfig = useMemo(
    () => ({
      breadcrumbs: ACTIVE_UNIT_LIST_BREADCRUMBS,
      tabs: ACTIVE_UNIT_LIST_TABS,
      filters,
      unitTypeOptions,
      onFilterApply: handlers.handleFilterChange,
      globalFilter,
      onGlobalFilterChange: setGlobalFilter,
    }),
    [filters, unitTypeOptions, handlers.handleFilterChange, globalFilter, setGlobalFilter],
  );

  useTrainingHeader(headerConfig);

  const columns = useMemo(
    () =>
      getCourseListColumns({
        handleView: (course) => {
          router.push(`/units/${course.id}`);
        },
        handleEdit: (course) => {
          router.push(`/units/add?id=${course.id}`);
        },
        handleDuplicate: (course) => {
          dispatch({ type: ActionType.OPEN_DUPLICATE_DIALOG, payload: course });
        },
        handleAssign: handlers.handleOpenAssignDialog,
        handleShowJobRoles: handlers.handleOpenShowJobRolesDialog,
        handleArchive: handlers.handleOpenArchiveDialog,
      }),
    [dispatch, handlers.handleOpenArchiveDialog, handlers.handleOpenAssignDialog, handlers.handleOpenShowJobRolesDialog, router]
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
      <div className='px-4 py-7 md:pb-10 md:px-10 md:pt-10'>
        <PageInfoBanner
          title='Active Units List'
          subtitle='List of active units available on the platform.'
        />

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
            onClick={() => router.push('/units/add')}
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
          tableHeaderHeight='h-[45px]'
          tableRowHeight='h-[60px]'
          tableClassName={getCustomTableLayoutClass('activeUnits')}
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
        title='Duplicate Unit'
        message='Are you sure you want to duplicate this unit?'
        description='This will create an exact copy of the unit. Do you want to proceed?'
        isLoading={isProcessing}
        onDeleteTitle='Confirm'
        cancelButtonText='Cancel'
        app={APPS.TRAINING}
        confirmButtonVariant='default'
        icon={<InfoIcon className='text-[#FFA600] size-5' />}
      />

      <CustomDeleteDialog
        isOpen={archiveDialogOpen}
        setIsOpen={() => dispatch({ type: ActionType.CLOSE_DIALOGS })}
        onDelete={handleArchiveCourse}
        title='Archive Unit'
        message={`Are you sure you want to archive the selected Job Role?`}
        description='This item will be archived and move to archive list and users will no longer have access to this job role. Do you want to continue?'
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

      <LinkedJobRolesDialog
        isOpen={showJobRolesDialogOpen}
        setIsOpen={(open) => {
          if (!open) {
            dispatch({ type: ActionType.CLOSE_DIALOGS });
          }
        }}
        jobRoles={linkedJobRoles}
        isLoading={isLoadingJobRoles}
        onRemoveJobRole={handlers.handleRemoveJobRole}
        app={APPS.TRAINING}
      />

      <AddToCompanyDialog
        isOpen={assignDialogOpen}
        setIsOpen={(open) => {
          if (!open) {
            dispatch({ type: ActionType.CLOSE_DIALOGS });
          }
        }}
        companies={allCompanies}
        onConfirm={({ companyIds, addToMasterJobRole }) => handlers.handleConfirmAssign(companyIds, addToMasterJobRole)}
        isLoading={isProcessing}
        errorMessage={dialogError ?? undefined}
        app={APPS.TRAINING}
      />
    </>
  );
}
