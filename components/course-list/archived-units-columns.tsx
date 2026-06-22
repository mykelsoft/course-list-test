'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { RotateCcw, Trash2 } from 'lucide-react';
import RowActionMenu from '@/components/custom-ui/custom-table/row-action-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { APPS } from '@/types/courses';
import { formatArchivedDate } from '@/lib/format-archived-date';
import type { ArchivedUnitRow } from '@/lib/mock-screenshot-list-data';

type Handlers = {
  handleRestore?: (row: ArchivedUnitRow) => void;
  handleDeletePermanently?: (row: ArchivedUnitRow) => void;
};

const menuIconClassName = 'size-[18px] md:size-3.5';

export function getArchivedUnitsColumns({
  handleRestore,
  handleDeletePermanently,
}: Handlers = {}): ColumnDef<ArchivedUnitRow>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <div className='course-row-checkbox flex items-center justify-center p-2 hover:bg-[#F686131A] rounded md:hidden'>
          <Checkbox
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label='Select all'
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className='course-row-checkbox flex items-center justify-center p-2 hover:bg-[#F686131A] rounded'>
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label='Select row'
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
      size: 50,
    },
    {
      accessorKey: 'id',
      header: 'ID',
      enableSorting: true,
      cell: ({ row }) => <span>{row.original.id}</span>,
    },
    {
      accessorKey: 'name',
      header: 'Unit Name',
      enableSorting: true,
      cell: ({ row }) => <span>{row.original.name}</span>,
    },
    {
      accessorKey: 'dateArchived',
      header: 'Date Archived',
      enableSorting: true,
      cell: ({ row }) => <span>{formatArchivedDate(row.original.dateArchived)}</span>,
    },
    {
      id: 'actions',
      header: () => <div className='text-center'>Actions</div>,
      cell: ({ row }) => (
        <RowActionMenu
          app={APPS.TRAINING}
          menuItems={[
            {
              label: 'Restore Unit',
              icon: <RotateCcw className={menuIconClassName} />,
              onClick: () => handleRestore?.(row.original),
            },
            {
              label: 'Delete Permanently',
              icon: <Trash2 className={menuIconClassName} />,
              onClick: () => handleDeletePermanently?.(row.original),
            },
          ]}
        />
      ),
    },
  ];
}
