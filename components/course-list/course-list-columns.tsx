// components/course-list/course-list-columns.tsx
'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Pencil, Trash2, Eye, Copy, Plus, Briefcase, Archive } from 'lucide-react';
import RowActionMenu from '@/components/custom-ui/custom-table/row-action-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { APPS, type CourseWithDetails } from '@/types/courses';

type Handlers = {
  handleEdit: (course: CourseWithDetails) => void;
  handleDelete: (course: CourseWithDetails) => void;
  handleDuplicate?: (course: CourseWithDetails) => void;
  handleAssign?: (course: CourseWithDetails) => void; 
  handleShowJobRoles?: (course: CourseWithDetails) => void; 
  handleArchive: (course: CourseWithDetails) => void;
  showPrice?: boolean;
};

export const getCourseListColumns = ({
  handleEdit,
  handleDelete,
  handleDuplicate,
  handleAssign,
  handleShowJobRoles,
  handleArchive,
  showPrice = false,
}: Handlers): ColumnDef<CourseWithDetails>[] => {
  
  const columns: ColumnDef<CourseWithDetails>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <div className="flex items-center justify-center w-full">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
            className="border-gray-300"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center w-full">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="border-gray-300"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
      size: 50,
    },
    {
      accessorKey: 'id',
      header: 'Course ID',
      enableSorting: true,
      cell: ({ row }) => <span>{row.original.id}</span>,
    },
    {
      accessorKey: 'name',
      header: 'Course Name',
      enableSorting: true,
      cell: ({ row }) => <span>{row.original.name}</span>,
    },
    {
      accessorKey: 'assignedCompanies',
      header: 'Company',
      enableSorting: true,
      cell: ({ row }) => {
        const names = row.original.assignedCompanies;
        if (!names || names === 'None') {
            return <span className="text-gray-400 italic text-sm">None</span>;
        }

        const companies = names.split(', ');
        const displayLimit = 2;

        if (companies.length <= displayLimit) {
            return <span className="truncate" title={names}>{names}</span>;
        }
        
        const displayed = companies.slice(0, displayLimit).join(', ');
        const remaining = companies.length - displayLimit;

        return (
          <span className="text-sm" title={names}>
            {displayed}, <span className="font-medium">+{remaining} more</span>
          </span>
        );
      },
    },
    {
      accessorKey: 'totalUnits',
      header: 'Total Units',
      enableSorting: true,
      cell: ({ row }) => <span>{row.original.totalUnits}</span>,
    },
  ];

  if (showPrice) {
    columns.push({
      accessorKey: 'price',
      header: 'Yearly Subscription',
      enableSorting: true,
      cell: ({ row }) => {
        const price = row.original.price;
        return (
          <span>
            {price !== null ? `$${price}` : '-'}
          </span>
        );
      },
    });
  }

  columns.push({
    id: 'actions',
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      // Build menu items
      const menuItems = [];

      menuItems.push({
        label: 'View Course',
        icon: <Eye className="size-[18px] md:size-4" />,
        onClick: () => handleEdit(row.original),
      });

      menuItems.push({
        label: 'Edit Course',
        icon: <Pencil className="size-[18px] md:size-4" />,
        onClick: () => handleEdit(row.original),
      });

      if (handleDuplicate) {
        menuItems.push({
          label: 'Duplicate Course',
          icon: <Copy className="size-[18px] md:size-4" />,
          onClick: () => handleDuplicate(row.original),
        });
      }

      // Show for Free courses
      if (!showPrice && handleAssign) {
          menuItems.push({
              label: 'Add to Company or Job Role',
              icon: <Plus className="size-[18px] md:size-4" />, 
              onClick: () => handleAssign(row.original),
              className: 'text-[#FFA600]' // Orange
          });
      }

      // Show for Paid courses - Company Only
      if (showPrice && handleAssign) {
          menuItems.push({
            label: 'Add to Company',
            icon: (
              <Plus
                className='size-[18px] md:size-4 text-[#FFA600]'
              />
            ), // Icon color separately
            onClick: () => handleAssign(row.original),
            className: 'text-[#FFA600]', // Orange text
          });
      }

      // Only show for Free courses
      if (!showPrice && handleShowJobRoles) {
        menuItems.push({
            label: 'Show Job Roles',
            icon: <Briefcase className="size-[18px] md:size-4" />, 
            onClick: () => handleShowJobRoles(row.original),
        });
      }

      // Archive option added
      menuItems.push({
        label: 'Archive Course',
        icon: <Archive className="size-[18px] md:size-4" />,
        onClick: () => handleArchive(row.original),
      });

      menuItems.push({
        label: 'Delete Course',
        icon: <Trash2 className="size-[18px] md:size-4" />,
        onClick: () => handleDelete(row.original),
      });

      return (
        <div className="flex justify-center">
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
