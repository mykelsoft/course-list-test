import { Separator } from '@radix-ui/react-separator';
import { XIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';

type CustomDialogImageDisplayProps = {
  title: React.ReactNode;
  triggerTitle?: string;
  trigger?: React.ReactNode;
  noTrigger?: boolean;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children: React.ReactNode;
  buttonText?: string;
  width?: string;
  height?: string;
  fullScreen?: boolean;
};

const CustomDialogImageDisplay: React.FC<CustomDialogImageDisplayProps> = ({
  title,
  trigger,
  isOpen,
  setIsOpen,
  children,
  triggerTitle = 'Open',
  noTrigger = false,
  width,
  height,
  fullScreen = false,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger
        ? noTrigger === false && (
            <DialogTrigger asChild>{trigger}</DialogTrigger>
          )
        : noTrigger === false && (
            <DialogTrigger asChild>
              <Button variant="default">{triggerTitle}</Button>
            </DialogTrigger>
          )}

      <DialogContent
        className={`p-0 m-0 overflow-hidden rounded-sm ${fullScreen ? 'w-[42vw] h-[51vh] max-w-none sm:max-w-none' : ''}`}
        style={{
          width: fullScreen ? '42vw' : width,
          height: fullScreen ? '51vh' : height,
          maxWidth: fullScreen ? 'none !important' : undefined,
        }}
      >
        <div className="pl-[24px] pt-[20px] pr-[10px] flex flex-row justify-between items-center">
          <div className="text-base font-semibold text-gray-800">{title}</div>
          <div className="text-base font-semibold text-gray-800">
            <DialogClose asChild>
              <Button variant="ghost">
                <XIcon />
              </Button>
            </DialogClose>
          </div>
        </div>
        <div className="bg-[#f9fbfc]">
          <Separator className="h-[1px] bg-gray-300 my-0" />
          <div
            className="px-4 py-0 overflow-auto rounded-b-md"
            style={{
              height: fullScreen ? 'calc(51vh - 70px)' : 'auto',
              width: fullScreen ? '100%' : 'auto',
              padding: '16px 16px',
            }}
          >
            {children}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialogImageDisplay;
