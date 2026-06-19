'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Trash2, XIcon } from 'lucide-react';

import { APPS } from '@/types/ENUMS';
import { Button } from '@/components/ui/button';
import type { JobRoleBasic } from '@/hooks/useCoursesTable';
import { Skeleton } from '@/components/ui/skeleton';
import Themes from '@/components/custom-ui/styling/Themes';

type LinkedJobRolesDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  jobRoles: JobRoleBasic[];
  isLoading?: boolean;
  onRemoveJobRole: (jobRoleId: number) => void;
  app?: APPS;
};

export function LinkedJobRolesDialog({
  isOpen,
  setIsOpen,
  jobRoles,
  isLoading = false,
  onRemoveJobRole,
  app = APPS.TRAINING,
}: LinkedJobRolesDialogProps) {
  const theme = Themes(app);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogContent className='bg-[var(--gray-50)] p-0 m-0 sm:max-w-[408px] gap-0 border-[var(--gray-300)] shadow-[0px_4px_8px_rgba(0,0,0,0.1)]'>
        <DialogHeader className='border-b border-[var(--gray-200)] px-6 py-4 min-h-[78px] flex flex-row items-center justify-between gap-2'>
          <DialogTitle className='text-base font-semibold leading-normal text-[var(--gray-800)]'>Linked Job Roles</DialogTitle>
          <DialogClose asChild>
            <Button
              variant='ghost'
              size='icon'
              className={`size-[30px] p-1.5 text-[var(--gray-700)] rounded ${theme.button.ghost} cursor-pointer`}
              aria-label='Close dialog'
              onClick={() => setIsOpen(false)}
            >
              <XIcon className='size-[18px]' />
            </Button>
          </DialogClose>
        </DialogHeader>

        <div className='p-6'>
          <p className='text-sm leading-normal text-[var(--gray-500)] mb-4'>List of job roles this unit belongs to.</p>

          <div className='space-y-1'>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between rounded border border-[var(--gray-200)] px-3 py-0.5 h-[37px]'
                >
                  <Skeleton className='h-4 w-40 max-w-[70%] rounded' />
                  <Skeleton className='size-[30px] shrink-0 rounded' />
                </div>
              ))
            ) : jobRoles.length === 0 ? (
              <p className='text-sm text-[var(--gray-500)]'>No linked job roles.</p>
            ) : (
              jobRoles.map((role) => (
                <div
                  key={role.id}
                  className='flex items-center justify-between rounded border border-[var(--gray-200)] px-3 py-0.5 h-[37px]'
                >
                  <span className='text-sm leading-normal text-[var(--gray-700)]'>{role.name}</span>
                  <Button
                    variant='ghost'
                    size='icon'
                    className={`size-[30px] p-1.5 rounded ${theme.button.ghost} cursor-pointer`}
                    aria-label={`Remove ${role.name}`}
                    onClick={() => onRemoveJobRole(role.id)}
                  >
                    <Trash2 className='size-[18px] text-[var(--gray-700)]' />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
