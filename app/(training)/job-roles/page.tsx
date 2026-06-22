'use client';

import { Archive, Plus } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import type { PaginationState, RowSelectionState, SortingState } from '@tanstack/react-table';

import { APPS } from '@/types/courses';
import CustomButton from '@/components/custom-ui/custom-button';
import CustomDeleteDialog from '@/components/custom-ui/custom-delete-dialog';
import { CustomTable } from '@/components/custom-ui/custom-table/custom-table';
import PageInfoBanner from '@/components/PageInfoBanner';
import { TablePageSizeSelect } from '@/components/custom-ui/custom-table/table-page-size-select';
import { TablePagination } from '@/components/custom-ui/custom-table/table-pagination';
import { getCustomTableLayoutClass } from '@/components/course-list/custom-table-layouts';
import { getMasterJobRolesColumns } from '@/components/course-list/master-job-roles-columns';
import { useTrainingHeader } from '@/components/training/training-layout-context';
import {
  MASTER_JOB_ROLES_BREADCRUMBS,
  MASTER_JOB_ROLES_TABS,
  withTrainingSearchFilter,
} from '@/components/training/training-nav-config';
import { MOCK_MASTER_JOB_ROLES, type MasterJobRoleRow } from '@/lib/mock-screenshot-list-data';
import { useRouter } from 'next/navigation';

export default function MasterJobRolesPage() {
  const [data, setData] = useState<MasterJobRoleRow[]>(MOCK_MASTER_JOB_ROLES);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const router = useRouter();

  const headerConfig = useMemo(
    () =>
      withTrainingSearchFilter({
        breadcrumbs: MASTER_JOB_ROLES_BREADCRUMBS,
        tabs: MASTER_JOB_ROLES_TABS,
        globalFilter,
        onGlobalFilterChange: setGlobalFilter,
      }),
    [globalFilter],
  );

  useTrainingHeader(headerConfig);

  const columns = useMemo(
    () =>
      getMasterJobRolesColumns({
        onStatusChange: (row, status) => {
          setData((prev) =>
            prev.map((item) => (item.id === row.id ? { ...item, status } : item)),
          );
        },
      }),
    [],
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
      const { name, companies } = row.original;
      return (
        name.toLowerCase().includes(search) || companies.toLowerCase().includes(search)
      );
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: true,
  });

  const hasSelectedRows = table.getSelectedRowModel().rows.length > 0;
  const selectedCount = table.getSelectedRowModel().rows.length;

  const handleBulkArchive = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setIsProcessing(false);
    setArchiveDialogOpen(false);
    setRowSelection({});
  };

  return (
    <>
      <div className='px-4 py-7 md:pb-10 md:px-10 md:pt-10 min-h-full'>
        <PageInfoBanner
          title='Master Job Roles'
          subtitle='List of active job roles made up of curated courses for structured learning.'
        />

        <div className='flex flex-col md:flex-row md:justify-between md:items-center mb-2 md:mb-4 gap-4'>
          <div className='flex items-center text-sm text-[var(--gray-400)] order-2 md:order-1 py-0.5'>
            <div className='flex items-center gap-2.5'>
              <span className='md:inline-block hidden text-[var(--gray-400)] text-sm leading-normal'>Show</span>
              <TablePageSizeSelect table={table} />
              <span className='md:inline-block hidden text-[var(--gray-400)] text-sm leading-normal'>
                of {table.getFilteredRowModel().rows.length} result{table.getFilteredRowModel().rows.length > 1 ? 's' : ''}
              </span>
            </div>

            <div className='h-[37px] w-px bg-[var(--gray-300)] md:ml-6 mr-2 ml-3' />

            <CustomButton
              title='Archive'
              onClick={() => setArchiveDialogOpen(true)}
              disabled={!hasSelectedRows}
              leadingIcon={<Archive className='mr-1 size-[18px]' />}
              app={APPS.TRAINING}
              variant='ghost'
              buttonClass='px-3 text-sm rounded text-[var(--gray-700)] font-normal'
            />
          </div>

          <CustomButton
            title='Add Job Role'
            onClick={() => router.push('/job-roles/add')}
            leadingIcon={<Plus className='size-3.5 -mt-0.5' />}
            app={APPS.TRAINING}
            buttonClass='order-1 md:order-2'
          />
        </div>

        <CustomTable
          table={table}
          isLoading={false}
          noResultsMessage='No job roles found.'
          skeletonRows={pagination.pageSize}
          headerRowClassName='hover:bg-[var(--gray-200)]/80 bg-[var(--gray-200)] border-b-0'
          headerCellClassName='text-[var(--gray-800)] font-semibold text-sm px-4 py-3'
          bodyRowClassName='hover:bg-[var(--gray-50)] transition-colors border-b-0'
          bodyCellClassName='px-4 py-3 text-sm text-[var(--gray-600)]'
          tableHeaderHeight='h-[45px]'
          tableRowHeight='h-[60px]'
          tableClassName={getCustomTableLayoutClass('masterJobRoles')}
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
        isOpen={archiveDialogOpen}
        setIsOpen={setArchiveDialogOpen}
        onDelete={handleBulkArchive}
        title='Archive Selected Job Roles?'
        message={`Are you sure you want to archive ${selectedCount} job role(s)?`}
        description='These job roles will be moved to the archive.'
        isLoading={isProcessing}
        onDeleteTitle='Archive All'
        app={APPS.TRAINING}
        confirmButtonVariant='default'
      />
    </>
  );
}
