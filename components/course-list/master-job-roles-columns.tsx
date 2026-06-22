'use client';

import { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Archive, Ban, Pencil, Plus } from 'lucide-react';
import RowActionMenu from '@/components/custom-ui/custom-table/row-action-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { APPS } from '@/types/courses';
import type { MasterJobRoleRow } from '@/lib/mock-screenshot-list-data';

const COMPANY_DISPLAY_LIMIT = 7;

function CompanyCell({ names }: { names: string }) {
  const [expanded, setExpanded] = useState(false);
  const companies = names.split(', ').filter(Boolean);
  const hasMore = companies.length > COMPANY_DISPLAY_LIMIT;
  const displayed = expanded
    ? companies.join(', ')
    : companies.slice(0, COMPANY_DISPLAY_LIMIT).join(', ');

  return (
    <span
      className='text-sm leading-normal flex flex-wrap'
      title={names}
    >
      <span className={expanded ? undefined : 'md:line-clamp-1 line-clamp-2'}>{displayed}</span>
      {hasMore && !expanded ? (
        <>
          ,{' '}
          <button
            type='button'
            className='font-medium text-[#FFA600] hover:underline'
            onClick={() => setExpanded(true)}
          >
            see more
          </button>
        </>
      ) : null}
      {hasMore && expanded ? (
        <>
          {' '}
          <button
            type='button'
            className='font-medium text-[#FFA600] hover:underline'
            onClick={() => setExpanded(false)}
          >
            see less
          </button>
        </>
      ) : null}
    </span>
  );
}

type Handlers = {
  onStatusChange?: (row: MasterJobRoleRow, status: boolean) => void;
  handleEdit?: (row: MasterJobRoleRow) => void;
  handleAddToCompany?: (row: MasterJobRoleRow) => void;
  handleSuspend?: (row: MasterJobRoleRow) => void;
  handleArchive?: (row: MasterJobRoleRow) => void;
};

const menuIconClassName = 'size-[18px] md:size-3.5';

export function getMasterJobRolesColumns({
  onStatusChange,
  handleEdit,
  handleAddToCompany,
  handleSuspend,
  handleArchive,
}: Handlers = {}): ColumnDef<MasterJobRoleRow>[] {
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
      accessorKey: 'name',
      header: 'Job Role Name',
      enableSorting: true,
      cell: ({ row }) => <span>{row.original.name}</span>,
    },
    {
      accessorKey: 'companies',
      header: 'Company',
      enableSorting: true,
      cell: ({ row }) => <CompanyCell names={row.original.companies} />,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      enableSorting: true,
      cell: ({ row }) => (
        <Switch
          checked={row.original.status}
          onCheckedChange={(checked) => onStatusChange?.(row.original, checked)}
          className='data-[state=checked]:bg-[#FFA600]'
        />
      ),
    },
    {
      id: 'actions',
      header: () => <div className='text-center'>Actions</div>,
      cell: ({ row }) => (
        <RowActionMenu
          app={APPS.TRAINING}
          menuItems={[
            {
              label: 'Edit Job Role',
              icon: <Pencil className={menuIconClassName} />,
              onClick: () => handleEdit?.(row.original),
            },
            {
              label: 'Add to Company',
              icon: <Plus className={menuIconClassName} />,
              onClick: () => handleAddToCompany?.(row.original),
            },
            {
              label: 'Suspend Job Role',
              icon: <Ban className={menuIconClassName} />,
              onClick: () => handleSuspend?.(row.original),
            },
            {
              label: 'Archive Job Role',
              icon: <Archive className={menuIconClassName} />,
              onClick: () => handleArchive?.(row.original),
            },
          ]}
        />
      ),
    },
  ];
}
