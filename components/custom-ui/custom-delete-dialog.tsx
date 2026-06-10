// File: ./components/custom-ui/custom-delete-dialog.tsx
import { Separator } from '@radix-ui/react-separator';
import { AlertTriangle, XIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import CustomButton from './custom-button';
import { APPS } from '#types/ENUMS.ts';
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="p-0 m-0 sm:max-w-[630px]">
        <DialogHeader className="px-6 pt-6 pb-1 flex flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {icon || <AlertTriangle className="w-5 h-5 text-red-500" />}
            <DialogTitle className="text-base font-semibold text-gray-700">
              {title}
            </DialogTitle>
          </div>
          {/* --- MODIFICATION START --- */}
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              // Apply theme-aware hover classes directly and size it correctly
              className={`h-7 w-7 p-1 text-muted-foreground rounded-sm ${theme.button.ghost} cursor-pointer cursor-pointer`}
              aria-label="Close dialog"
              onClick={() => setIsOpen(false)}
            >
              <XIcon className="w-4 h-4" />
            </Button>
          </DialogClose>
          {/* --- MODIFICATION END --- */}
        </DialogHeader>

        <div className="flex flex-col gap-2 bg-[#f9fbfc]">
          <Separator className="w-full h-[1px] bg-gray-200" />
          <div className="bg-[#f9fbfc] py-4 px-5">
            <div className="text-sm font-medium text-gray-700">{message}</div>
            <div className="mt-4 text-sm text-gray-500">{description}</div>
          </div>
          <Separator className="w-full h-[1px] bg-gray-200" />
        </div>

        <DialogFooter className="pb-5 px-5 pt-1 flex flex-row gap-5 justify-between">
          <CustomButton
            variant="outline"
            app={app}
            title={cancelButtonText}
            width="flex-1"
            onClick={handleLeftButtonClick}
            buttonClass="cursor-pointer text-sm rounded-sm font-semibold"
          />
          <CustomButton
            variant={confirmButtonVariant}
            app={app}
            type="button"
            width="flex-1"
            title={onDeleteTitle}
            isLoading={isLoading}
            onClick={onDelete}
            buttonClass="cursor-pointer text-sm rounded-sm font-semibold"
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomDeleteDialog;
