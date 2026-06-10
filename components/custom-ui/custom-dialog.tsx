// File: ./components/custom-ui/custom-dialog.tsx
import { Separator } from '@radix-ui/react-separator';
import { XIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

import CustomButton from './custom-button';
import CustomErrorMessage from './custom-error-message';

type CustomDialogProps = {
  title: React.ReactNode;
  triggerTitle?: string;
  trigger?: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children: React.ReactNode;
  buttonText?: string;
  buttonClass?: string;
  isLoading?: boolean;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  errorMessage?: string;
  renderDefaultTrigger?: boolean;
  triggerWidth?: string;
  size?: {
    width?: number;
    height?: number;
  };
  bottomInfo?: React.ReactNode;
  dialogContentClassName?: string;
  buttonDisabled?: boolean;
  noFooter?: boolean; // Added prop to hide the footer
  closeButtonClassName?: string; // Added prop to customize close button styling
  isMobile?: boolean; // Added prop for mobile detection
};

const CustomDialog: React.FC<CustomDialogProps> = ({
  title,
  trigger,
  isOpen,
  setIsOpen,
  children,
  onSubmit,
  buttonText = 'Save',
  buttonClass = '',
  isLoading = false,
  triggerTitle = 'Open',
  errorMessage = null,
  renderDefaultTrigger = true,
  triggerWidth,
  bottomInfo,
  size,
  dialogContentClassName,
  buttonDisabled = false,
  noFooter = false, // Default to false
  closeButtonClassName = '', // Default to empty
  isMobile = false, // Default to false for desktop
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : renderDefaultTrigger ? (
        <DialogTrigger asChild>
          <CustomButton
            variant="default"
            title={triggerTitle}
            width={triggerWidth}
          />
        </DialogTrigger>
      ) : null}
      <DialogContent
        className={cn('p-0 m-0', dialogContentClassName)}
        style={{
          width:
            typeof size?.width === 'number' ? `${size.width}px` : undefined,
          height:
            typeof size?.height === 'number' ? `${size.height}px` : undefined,
        }}
        onInteractOutside={(e) => {
          // Prevent closing if TinyMCE dialog or color picker is open
          const tinyMCEDialog = document.querySelector('.tox-dialog-wrap');
          const tinyMCEColorPicker = document.querySelector(
            '.tox-swatches, .tox-menu, .tox-collection, .tox-pop'
          );
          const target = e.target as HTMLElement;

          const isTinyMCEElement = target?.closest('[class*="tox-"], .tox');

          if (tinyMCEDialog || tinyMCEColorPicker || isTinyMCEElement) {
            e.preventDefault();
          }
        }}
      >
        <DialogTitle className="sr-only">
          {typeof title === 'string' ? title : 'Dialog'}
        </DialogTitle>
        <div className="flex flex-row justify-between items-center">
          <div className={`${isMobile ? 'px-4 pt-4 pb-1' : 'px-6 pt-6 pb-1'} text-base font-semibold text-gray-800`}>
            {title}
          </div>
          <div className={`${isMobile ? 'pr-4 pt-4' : 'pr-4 pt-4'} text-base font-semibold text-gray-800`}>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'h-7 w-7 p-1 text-muted-foreground hover:text-primary hover:bg-secondary cursor-pointer rounded-sm',
                  closeButtonClassName
                )}
                aria-label="Close dialog"
                onClick={() => setIsOpen(false)}
              >
                <XIcon className="w-4 h-4" />
              </Button>
            </DialogClose>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            if (onSubmit) {
              onSubmit(e);
            } else {
              // Prevent default form submission (refresh) if no handler is provided
              e.preventDefault();
            }
          }}
        >
          <div className="bg-[#f9fafb]">
            <Separator className="w-full h-[1px] bg-gray-200" />
            {children}
            <Separator className="w-full h-[1px] bg-gray-200" />
          </div>

          {!noFooter && (
            <DialogFooter className={`${isMobile ? 'px-4 pb-4 pt-4' : 'px-6 pb-6 pt-6'}`}>
              <div className="flex flex-col gap-2 w-full">
                <CustomButton
                  variant="default"
                  type="submit"
                  title={buttonText}
                  isLoading={isLoading}
                  disabled={buttonDisabled}
                  width="w-full"
                  buttonClass={`transition-all duration-300 text-sm cursor-pointer ${buttonClass}`}
                />
                <CustomErrorMessage
                  errorMessage={errorMessage}
                  detailed={true}
                />
                {bottomInfo && (
                  <div className="mt-2 text-center w-full">{bottomInfo}</div>
                )}
              </div>
            </DialogFooter>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
