// components/course-list/course-list-columns.tsx
'use client';

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
      // header: ({ table }) => (
      //   <div className="flex items-center justify-center w-full">
      //     <Checkbox
      //       checked={
      //         table.getIsAllPageRowsSelected() ||
      //         (table.getIsSomePageRowsSelected() && 'indeterminate')
      //       }
      //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      //       aria-label="Select all"
      //       className="bg-[var(--gray-50)] border-[var(--gray-300)] rounded"
      //     />
      //   </div>
      // ),
      header: () => null,
      cell: ({ row }) => (
        <div className='course-row-checkbox flex items-center justify-center w-[36px] h-[36px] hover:bg-[var(--third)] rounded'>
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
          return <span className='text-gray-400 italic text-sm'>None</span>;
        }

        const companies = names.split(', ');
        const displayLimit = 3;

        if (companies.length <= displayLimit) {
          return (
            <span
              className='truncate'
              title={names}
            >
              {names}
            </span>
          );
        }

        const displayed = companies.slice(0, displayLimit).join(', ');

        return (
          <span
            className='text-sm'
            title={names}
          >
            {displayed},{' '}
            <button
              type='button'
              className='font-medium text-[#FFA600] hover:underline'
            >
              see more
            </button>
          </span>
        );
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
          icon: <Search className='text-[var(--gray-700)] size-[18px] md:size-3.5' />,
          onClick: () => handleView(row.original),
        },
        {
          label: 'Edit Unit',
          icon: <Pencil className='text-[var(--gray-700)] size-[18px] md:size-3.5' />,
          onClick: () => handleEdit(row.original),
        },
        {
          label: 'Duplicate Unit',
          icon: <Copy className='text-[var(--gray-700)] size-[18px] md:size-3.5' />,
          onClick: () => handleDuplicate(row.original),
        },
        {
          label: 'Add to Company or Job Role',
          icon: <Plus className='text-[var(--gray-700)] size-[18px] md:size-3.5' />,
          onClick: () => handleAssign(row.original),
        },
        {
          label: 'Show Job Roles',
          icon: <List className='text-[var(--gray-700)] size-[18px] md:size-3.5' />,
          onClick: () => handleShowJobRoles(row.original),
        },
        {
          label: 'Archive Unit',
          icon: <Archive className='text-[var(--gray-700)] size-[18px] md:size-3.5' />,
          onClick: () => handleArchive(row.original),
        },
      ];

      return (
        <div className='flex justify-center'>
          <RowActionMenu
            app={APPS.TRAINING}
            menuItems={menuItems}
          />
        </div>
      );
    },
  });

  return columns;
};
