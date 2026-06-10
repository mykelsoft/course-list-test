// components/custom-ui/custom-dialog-two-buttons.tsx
import { Separator } from '@radix-ui/react-separator';
import { XIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { APPS } from '@/types/ENUMS';
import Themes from './styling/Themes';
import CustomButton from '@/components/custom-ui/custom-button';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';

type CustomDialogTwoButtonsProps = {
  isActive?: boolean;
  app?: APPS;
  title: React.ReactNode;
  trigger?: React.ReactNode;
  isOpen: boolean;
  isLoading?: boolean;
  errorMessage?: string;
  setIsOpen: (isOpen: boolean) => void;
  children: React.ReactNode;
  leftButtonText?: string;
  rightButtonText?: string;
  buttonsHeight?: string;
  onSubmitLeftButton?: () => void;
  onSubmitRightButton?: (e: React.FormEvent<HTMLFormElement>) => void;
  renderDefaultTrigger?: boolean;
  size?: {
    width?: number;
    height?: number;
  };
  rightButtonVariant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  buttonDisabled?: boolean; // Added this prop
  noFooter?: boolean;
  closeButtonClassName?: string;
};

const DEFAULT_SIZE = { width: 600, height: undefined as number | undefined };

const CustomDialogTwoButtons: React.FC<CustomDialogTwoButtonsProps> = ({
  title,
  app = APPS.PORTAL,
  trigger,
  isOpen,
  errorMessage,
  setIsOpen,
  children,
  onSubmitLeftButton,
  onSubmitRightButton,
  leftButtonText = 'Remove App',
  rightButtonText = 'Save Changes',
  buttonsHeight = 'h-[41px]',
  isLoading = false,
  isActive = true,
  renderDefaultTrigger = true,
  size = DEFAULT_SIZE,
  rightButtonVariant = 'default',
  buttonDisabled = false, // Destructure with default
  noFooter = false,
}) => {
  const [clickedButton, setClickedButton] = useState<'left' | 'right' | null>(
    null
  );
  const handleLeftButtonClick = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    e?.stopPropagation();
    setClickedButton('left');
    onSubmitLeftButton?.();
    if (!isLoading) {
      setTimeout(() => setClickedButton(null), 0);
    }
  };
  const handleRightButtonSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setClickedButton('right');
    onSubmitRightButton?.(e);
    if (!isLoading) {
      setTimeout(() => setClickedButton(null), 0);
    }
  };
  useEffect(() => {
    if (!isLoading && clickedButton !== null) {
      setClickedButton(null);
    }
  }, [isLoading, clickedButton]);
  const theme = Themes(app);
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : renderDefaultTrigger && isActive ? (
        <DialogTrigger asChild>
          <Button variant="default">{title}</Button>
        </DialogTrigger>
      ) : renderDefaultTrigger && !isActive ? (
        <Button variant="default" disabled className="opacity-70">
          {title}
        </Button>
      ) : null}{' '}
      <DialogContent
        className="p-0 m-0"
        style={{ width: size?.width, height: size?.height }}
      >
        <DialogTitle className="sr-only">
          {typeof title === 'string' ? title : 'Dialog'}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {typeof title === 'string' ? title : 'Dialog Action'}
        </DialogDescription>

        <div className="flex flex-row justify-between items-center">
          <div className="px-[16px] pt-[16px] lg:px-6 lg:pt-6 lg:pb-1 text-base font-semibold text-gray-800">
            {title}
          </div>
          <div className="px-[16px] pt-[16px] lg:pr-4 lg:pt-4 text-base font-semibold text-gray-800">
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`h-7 w-7 text-muted-foreground rounded-sm ${theme.button.ghost} cursor-pointer flex items-center justify-center`}
                aria-label="Close dialog"
                onClick={() => setIsOpen(false)}
              >
                <XIcon className="w-4 h-4" />
              </Button>
            </DialogClose>
          </div>
        </div>
        <form
          onSubmit={handleRightButtonSubmit}
          className="min-w-0 overflow-hidden w-full"
        >
          <div className="max-w-full overflow-hidden">
            <Separator className="w-full h-[1px] bg-border" />
            <div className="bg-[#f9fafb] px-[16px] py-[16px] lg:p-2 w-full min-w-0 overflow-hidden">
              {children}
            </div>
            <Separator className="w-full h-[1px] bg-border" />
            
            {!noFooter && (
              <DialogFooter
                className={`px-6 pb-6 flex flex-col gap-2 ${errorMessage ? 'pt-2' : 'pt-6'}`}
              >
                <div className="flex flex-col gap-2 w-full">
                  {errorMessage && (
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-medium text-red-500">
                        {errorMessage}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-row gap-4 justify-between">
                    <CustomButton
                      variant="outline"
                      app={app}
                      title={leftButtonText}
                      type="button"
                      onClick={handleLeftButtonClick}
                      isLoading={isLoading && clickedButton === 'left'}
                      width="flex-1"
                      className={`cursor-pointer ${buttonsHeight} font-semibold`}
                    />
                    <CustomButton
                      variant={rightButtonVariant}
                      app={app}
                      type="submit"
                      title={rightButtonText}
                      isLoading={isLoading && clickedButton === 'right'}
                      disabled={!!errorMessage || buttonDisabled} // Fixed logic
                      width="flex-1"
                      className={`cursor-pointer ${buttonsHeight} font-semibold`}
                    />
                  </div>
                </div>
              </DialogFooter>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default CustomDialogTwoButtons;
