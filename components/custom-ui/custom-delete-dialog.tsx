import * as React from 'react';

import { AlertTriangle, XIcon } from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { APPS } from '#types/ENUMS';
import { Button } from '@/components/ui/button';
import CustomButton from './custom-button';
// File: ./components/custom-ui/custom-delete-dialog.tsx
import { Separator } from '@radix-ui/react-separator';
import Themes from './styling/Themes';

type CustomDeleteDialogProps = {
  title: string;
  message: string;
  description: string;
  onDeleteTitle: string;
  onDelete: () => void;
  isOpen: boolean;
  isLoading?: boolean;
  setIsOpen: (isOpen: boolean) => void;
  icon?: React.ReactNode;
  cancelButtonText?: string;
  confirmButtonVariant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  app?: APPS;
};

const CustomDeleteDialog: React.FC<CustomDeleteDialogProps> = ({
  title,
  message,
  description,
  onDeleteTitle,
  onDelete,
  isOpen,
  isLoading,
  setIsOpen,
  icon,
  cancelButtonText = 'Cancel',
  confirmButtonVariant = 'default',
  app = APPS.PORTAL,
}) => {
  const handleLeftButtonClick = () => {
    setIsOpen(false);
  };

  const theme = Themes(app);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogContent className='p-0 m-0 sm:max-w-[560px] gap-0 border-[var(--gray-200)]'>
        <DialogHeader className='px-6 py-4 min-h-[78px] flex flex-row items-center justify-between gap-2'>
          <div className='flex items-center gap-2.5'>
            {icon || <AlertTriangle className='size-[18px] text-[var(--primary)]' />}
            <DialogTitle className='text-base font-semibold leading-normal text-[var(--gray-800)]'>{title}</DialogTitle>
          </div>
          {/* --- MODIFICATION START --- */}
          <DialogClose asChild>
            <Button
              variant='ghost'
              size='icon'
              // Apply theme-aware hover classes directly and size it correctly
              className={`size-[30px] p-1.5 text-[var(--gray-700)] rounded ${theme.button.ghost} cursor-pointer`}
              aria-label='Close dialog'
              onClick={() => setIsOpen(false)}
            >
              <XIcon className='size-[18px]' />
            </Button>
          </DialogClose>
          {/* --- MODIFICATION END --- */}
        </DialogHeader>

        <div className='bg-[var(--gray-50)] border-y border-[var(--gray-200)] p-6'>
          <div className='space-y-4 text-sm'>
            <div className='font-medium leading-normal text-[var(--gray-700)]'>{message}</div>
            <div className='leading-normal text-[var(--gray-500)]'>{description}</div>
          </div>
        </div>

        <DialogFooter className='grid grid-cols-2 p-6 gap-6'>
          <CustomButton
            variant='outline'
            app={app}
            title={cancelButtonText}
            onClick={handleLeftButtonClick}
            buttonClass='cursor-pointer text-sm rounded-md leading-normal font-semibold'
          />
          <CustomButton
            app={app}
            type='button'
            title={onDeleteTitle}
            isLoading={isLoading}
            onClick={onDelete}
            buttonClass='cursor-pointer text-sm rounded-md leading-normal font-semibold'
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomDeleteDialog;
