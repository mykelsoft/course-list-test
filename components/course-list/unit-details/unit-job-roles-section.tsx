'use client';

import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type RowSelectionState,
} from '@tanstack/react-table';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import { APPS } from '@/types/courses';
import { BUTTON_VARIANTS } from '@/components/custom-ui/button-variants';
import { Checkbox } from '@/components/ui/checkbox';
import CustomAccordion from '@/components/custom-ui/custom-accordion';
import CustomButton from '@/components/custom-ui/custom-button';
import { CustomTable } from '@/components/custom-ui/custom-table/custom-table';
import RowActionMenu from '@/components/custom-ui/custom-table/row-action-menu';
import UnitFormFieldRow from './unit-form-field-row';
import { cn } from '@/lib/utils';

type JobRoleRow = {
  id: number;
  name: string;
};

const DEFAULT_JOB_ROLES: JobRoleRow[] = [
  { id: 1, name: 'Warehouse Manager' },
  { id: 2, name: 'Logistics Coordinator' },
  { id: 3, name: 'Shipping Clerk' },
  { id: 4, name: 'Inventory Specialist' },
  { id: 5, name: 'Supply Chain Analyst' },
];

const DEFAULT_SELECTED_JOB_ROLE_IDS = [2, 3];

const CHECKBOX_CLASS =
  'size-5 border-[var(--gray-300)] data-[state=checked]:border-[#FFA600] data-[state=checked]:bg-[#FFA600]';

function createInitialRowSelection(roleIds: number[]): RowSelectionState {
  return roleIds.reduce<RowSelectionState>((selection, id) => {
    selection[String(id)] = true;
    return selection;
  }, {});
}

export default function UnitJobRolesSection() {
  const [jobRoles, setJobRoles] = useState<JobRoleRow[]>(DEFAULT_JOB_ROLES);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(() =>
    createInitialRowSelection(DEFAULT_SELECTED_JOB_ROLE_IDS),
  );

  const handleRemoveRole = useCallback((roleId: number) => {
    setJobRoles((current) => current.filter((role) => role.id !== roleId));
    setRowSelection((current) => {
      const next = { ...current };
      delete next[String(roleId)];
      return next;
    });
  }, []);

  const columns = useMemo<ColumnDef<JobRoleRow>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <div className='course-row-checkbox flex items-center justify-center p-2 hover:bg-[var(--third)] rounded'>
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && 'indeterminate')
              }
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
              aria-label='Select all job roles'
              className={CHECKBOX_CLASS}
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className='course-row-checkbox flex items-center justify-center p-2 hover:bg-[var(--third)] rounded'>
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label={`Select ${row.original.name}`}
              className={CHECKBOX_CLASS}
            />
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
        size: 50,
      },
      {
        accessorKey: 'name',
        header: 'Job Role',
        cell: ({ row }) => <span>{row.original.name}</span>,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <RowActionMenu
            app={APPS.TRAINING}
            menuItems={[
              {
                label: 'Remove Job Role',
                icon: <Trash2 className='size-4' />,
                onClick: () => handleRemoveRole(row.original.id),
              },
            ]}
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 100,
      },
    ],
    [handleRemoveRole],
  );

  const table = useReactTable({
    data: jobRoles,
    columns,
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: true,
    getRowId: (row) => String(row.id),
  });

  const hasSelectedRoles = table.getSelectedRowModel().rows.length > 0;

  const handleRemoveSelectedRoles = () => {
    const selectedIds = new Set(
      table.getSelectedRowModel().rows.map((row) => row.original.id),
    );

    setJobRoles((current) => current.filter((role) => !selectedIds.has(role.id)));
    table.resetRowSelection();
  };

  return (
    <CustomAccordion
      title='Job Roles'
      description='List of Job Roles this unit belongs to'
      descriptionColor='text-[var(--gray-500)]'
    >
      <UnitFormFieldRow
        label='Job Roles List'
        align='start'
        tooltip='Select the job roles this unit belongs to'
      >
        <div className='flex min-w-0 flex-1 flex-col gap-4'>
          <div className='flex flex-wrap items-center justify-between gap-3 md:gap-4'>
            <CustomButton
              title='Remove from Job Role'
              leadingIcon={<Trash2 className='size-4 mr-1' />}
              app={APPS.TRAINING}
              variant={BUTTON_VARIANTS.GHOST}
              width='w-auto'
              buttonClass='font-normal rounded'
              disabled={!hasSelectedRoles}
              onClick={handleRemoveSelectedRoles}
            />
            <CustomButton
              title='Add Job Role'
              leadingIcon={<Plus className='size-3.5' />}
              app={APPS.TRAINING}
              onClick={() => {}}
            />
          </div>

          <CustomTable
            table={table}
            isLoading={false}
            noResultsMessage='No job roles found.'
            headerRowClassName='hover:bg-[var(--gray-200)]/80 bg-[var(--gray-200)] border-b-0'
            headerCellClassName='text-[var(--gray-800)] font-semibold text-sm px-4 py-3'
            bodyRowClassName='hover:bg-[var(--gray-50)] transition-colors border-b-0'
            bodyCellClassName='px-4 py-3 text-sm text-[var(--gray-600)]'
            tableClassName={cn(
              'custom-table',
              '[&_thead_tr>th:first-child]:w-[68px]',
              '[&_thead_tr>th:last-child]:w-[100px]',
            )}
            tableHeaderHeight='h-[45px]'
            tableRowHeight='h-[60px]'
          />
        </div>
      </UnitFormFieldRow>
    </CustomAccordion>
  );
}
