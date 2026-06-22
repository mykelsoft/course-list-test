'use client';

import {
  ARCHIVED_UNIT_LIST_BREADCRUMBS,
  ARCHIVED_UNIT_LIST_TABS,
  withTrainingSearchFilter,
} from '@/components/training/training-nav-config';
import type { PaginationState, RowSelectionState, SortingState } from '@tanstack/react-table';
import React, { useCallback, useMemo, useState } from 'react';
import { AlertTriangle, RotateCcw, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { APPS } from '@/types/courses';
import CustomButton from '@/components/custom-ui/custom-button';
import CustomDeleteDialog from '@/components/custom-ui/custom-delete-dialog';
import { CustomTable } from '@/components/custom-ui/custom-table/custom-table';
import { MOCK_ARCHIVED_UNITS, type ArchivedUnitRow } from '@/lib/mock-screenshot-list-data';
import PageInfoBanner from '@/components/PageInfoBanner';
import { TablePagination } from '@/components/custom-ui/custom-table/table-pagination';
import { getArchivedUnitsColumns } from '@/components/course-list/archived-units-columns';
import { getCustomTableLayoutClass } from '@/components/course-list/custom-table-layouts';
import { useTrainingHeader } from '@/components/training/training-layout-context';

export default function ArchivedUnitsPage() {
  const [data, setData] = useState<ArchivedUnitRow[]>(MOCK_ARCHIVED_UNITS);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [restoreTargetIds, setRestoreTargetIds] = useState<number[]>([]);
  const [deleteTargetIds, setDeleteTargetIds] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const headerConfig = useMemo(
    () =>
      withTrainingSearchFilter({
        breadcrumbs: ARCHIVED_UNIT_LIST_BREADCRUMBS,
        tabs: ARCHIVED_UNIT_LIST_TABS,
        globalFilter,
        onGlobalFilterChange: setGlobalFilter,
      }),
    [globalFilter],
  );

  useTrainingHeader(headerConfig);

  const openRestoreDialog = useCallback((ids: number[]) => {
    setRestoreTargetIds(ids);
    setRestoreDialogOpen(true);
  }, []);

  const openDeleteDialog = useCallback((ids: number[]) => {
    setDeleteTargetIds(ids);
    setDeleteDialogOpen(true);
  }, []);

  const columns = useMemo(
    () =>
      getArchivedUnitsColumns({
        handleRestore: (row) => openRestoreDialog([row.id]),
        handleDeletePermanently: (row) => openDeleteDialog([row.id]),
      }),
    [openDeleteDialog, openRestoreDialog],
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, pagination, rowSelection, globalFilter },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _columnId, filterValue) => {
      const search = String(filterValue ?? '').trim().toLowerCase();
      if (!search) return true;
      const { id, name } = row.original;
      return String(id).includes(search) || name.toLowerCase().includes(search);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: true,
    getRowId: (row) => String(row.id),
  });

  const hasSelectedRows = table.getSelectedRowModel().rows.length > 0;

  const handleBulkRestore = () => {
    openRestoreDialog(table.getSelectedRowModel().rows.map((row) => row.original.id));
  };

  const handleBulkDeletePermanently = () => {
    openDeleteDialog(table.getSelectedRowModel().rows.map((row) => row.original.id));
  };

  const handleRestore = async () => {
    if (restoreTargetIds.length === 0) return;

    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setData((current) => current.filter((item) => !restoreTargetIds.includes(item.id)));
    setIsProcessing(false);
    setRestoreDialogOpen(false);
    setRestoreTargetIds([]);
    setRowSelection({});
  };

  const handleDeletePermanently = async () => {
    if (deleteTargetIds.length === 0) return;

    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setData((current) => current.filter((item) => !deleteTargetIds.includes(item.id)));
    setIsProcessing(false);
    setDeleteDialogOpen(false);
    setDeleteTargetIds([]);
    setRowSelection({});
  };

  const deleteMessage =
    deleteTargetIds.length === 1
      ? 'Permanently Delete the selected Unit?'
      : `Permanently Delete ${deleteTargetIds.length} selected units?`;

  const deleteDescription =
    deleteTargetIds.length === 1
      ? 'This will permanently delete the selected unit in Archived Units. Do you want to proceed?'
      : `This will permanently delete ${deleteTargetIds.length} units in Archived Units. Do you want to proceed?`;

  return (
    <>
      <div className='px-4 py-7 md:pb-10 md:px-10 md:pt-10 min-h-full'>
        <PageInfoBanner
          title='Archived Units List'
          subtitle='List of archived units hidden from the active list.'
        />

        <div className='flex flex-col md:flex-row md:justify-between md:items-center mb-2 md:mb-4 gap-4'>
          <div className='flex items-center text-sm text-[var(--gray-400)] order-2 md:order-1 py-0.5'>
            <div className='flex items-center gap-2.5'>
              <span className='md:inline-block hidden text-[var(--gray-400)] text-sm leading-normal'>Show</span>
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
              <span className='md:inline-block hidden text-[var(--gray-400)] text-sm leading-normal'>
                of {table.getFilteredRowModel().rows.length} result{table.getFilteredRowModel().rows.length > 1 ? 's' : ''}
              </span>
            </div>

            <div className='h-[37px] w-px bg-[var(--gray-300)] md:ml-6 mr-2 ml-3' />

            <CustomButton
              title='Restore'
              onClick={handleBulkRestore}
              disabled={!hasSelectedRows}
              leadingIcon={<RotateCcw className='mr-1 size-[18px]' />}
              app={APPS.TRAINING}
              variant='ghost'
              buttonClass='px-3 text-sm rounded text-[var(--gray-700)] font-normal'
            />

            <CustomButton
              title='Delete Permanently'
              onClick={handleBulkDeletePermanently}
              disabled={!hasSelectedRows}
              leadingIcon={<Trash2 className='mr-1 size-[18px]' />}
              app={APPS.TRAINING}
              variant='ghost'
              buttonClass='px-3 text-sm rounded text-[var(--gray-700)] font-normal'
            />
          </div>
        </div>

        <CustomTable
          table={table}
          isLoading={false}
          noResultsMessage='No archived units found.'
          skeletonRows={pagination.pageSize}
          headerRowClassName='hover:bg-[var(--gray-200)]/80 bg-[var(--gray-200)] border-b-0'
          headerCellClassName='text-[var(--gray-800)] font-semibold text-sm px-4 py-3'
          bodyRowClassName='hover:bg-[var(--gray-50)] transition-colors border-b-0'
          bodyCellClassName='px-4 py-3 text-sm text-[var(--gray-600)]'
          tableHeaderHeight='h-[45px]'
          tableRowHeight='h-[60px]'
          tableClassName={getCustomTableLayoutClass('archivedUnits')}
          isInlineAction={true}
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
        isOpen={restoreDialogOpen}
        setIsOpen={(open) => {
          setRestoreDialogOpen(open);
          if (!open) setRestoreTargetIds([]);
        }}
        onDelete={handleRestore}
        title='Restore Selected Units?'
        message={
          restoreTargetIds.length === 1
            ? 'Restore the selected unit?'
            : `Are you sure you want to restore ${restoreTargetIds.length} unit(s)?`
        }
        description='These units will be moved back to the active list.'
        isLoading={isProcessing}
        onDeleteTitle='Restore'
        app={APPS.TRAINING}
        confirmButtonVariant='default'
      />

      <CustomDeleteDialog
        isOpen={deleteDialogOpen}
        setIsOpen={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setDeleteTargetIds([]);
        }}
        onDelete={handleDeletePermanently}
        title='Permanently Delete'
        message={deleteMessage}
        description={deleteDescription}
        isLoading={isProcessing}
        onDeleteTitle='Delete'
        app={APPS.TRAINING}
        confirmButtonVariant='default'
        icon={<AlertTriangle className='size-[18px] text-destructive' />}
      />
    </>
  );
}
