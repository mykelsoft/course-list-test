// components/course-list/course-list-columns.tsx
'use client';

import { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Pencil, Copy, Plus, List, Archive, Search } from 'lucide-react';
import RowActionMenu from '@/components/custom-ui/custom-table/row-action-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { APPS, type CourseWithDetails } from '@/types/courses';

type Handlers = {
  handleView: (course: CourseWithDetails) => void;
  handleEdit: (course: CourseWithDetails) => void;
  handleDuplicate: (course: CourseWithDetails) => void;
  handleAssign: (course: CourseWithDetails) => void;
  handleShowJobRoles: (course: CourseWithDetails) => void;
  handleArchive: (course: CourseWithDetails) => void;
};

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

export const getCourseListColumns = ({
  handleView,
  handleEdit,
  handleDuplicate,
  handleAssign,
  handleShowJobRoles,
  handleArchive,
}: Handlers): ColumnDef<CourseWithDetails>[] => {
  
  const columns: ColumnDef<CourseWithDetails>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <div className='course-row-checkbox flex items-center justify-center p-2 hover:bg-[var(--third)] rounded md:hidden'>
          <Checkbox
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label='Select all'
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className='course-row-checkbox flex items-center justify-center p-2 hover:bg-[var(--third)] rounded'>
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
      cell: ({ row }) => <span>{String(row.original.id).padStart(3, '0')}</span>,
    },
    {
      accessorKey: 'name',
      header: 'Unit Name',
      enableSorting: true,
      cell: ({ row }) => <span>{row.original.name}</span>,
    },
    {
      accessorKey: 'unitType',
      header: 'Unit Type',
      enableSorting: true,
      cell: ({ row }) => <span>{row.original.unitType}</span>,
    },
    {
      accessorKey: 'assignedCompanies',
      header: 'Company',
      enableSorting: true,
      cell: ({ row }) => {
        const names = row.original.assignedCompanies;
        if (!names || names === 'None') {
          return <span className='text-[var(--gray-400)] italic text-sm'>None</span>;
        }

        return <CompanyCell names={names} />;
      },
    },
    {
      accessorKey: 'price',
      header: 'Price',
      enableSorting: true,
      cell: ({ row }) => {
        const { is_paid, price } = row.original;

        if (!is_paid || price === null) {
          return <span className='text-[#FFA600]'>Free</span>;
        }

        return <span>${price.toFixed(2)}</span>;
      },
    },
  ];

  columns.push({
    id: 'actions',
    header: () => <div className='text-center'>Actions</div>,
    cell: ({ row }) => {
      const menuItems = [
        {
          label: 'View Unit',
          icon: <Search className='size-[18px] md:size-3.5' />,
          onClick: () => handleView(row.original),
        },
        {
          label: 'Edit Unit',
          icon: <Pencil className='size-[18px] md:size-3.5' />,
          onClick: () => handleEdit(row.original),
        },
        {
          label: 'Duplicate Unit',
          icon: <Copy className='size-[18px] md:size-3.5' />,
          onClick: () => handleDuplicate(row.original),
        },
        {
          label: 'Add to Company or Job Role',
          icon: <Plus className='size-[18px] md:size-3.5' />,
          onClick: () => handleAssign(row.original),
        },
        {
          label: 'Show Job Roles',
          icon: <List className='size-[18px] md:size-3.5' />,
          onClick: () => handleShowJobRoles(row.original),
        },
        {
          label: 'Archive Unit',
          icon: <Archive className='size-[18px] md:size-3.5' />,
          onClick: () => handleArchive(row.original),
        },
      ];

      return (
          <RowActionMenu
            app={APPS.TRAINING}
            menuItems={menuItems}
          />
      );
    },
  });

  return columns;
};
