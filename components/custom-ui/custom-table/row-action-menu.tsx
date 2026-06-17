// components/custom-ui/custom-table/row-action-menu.tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { APPS } from '@/types/ENUMS';
import { Button } from '@/components/ui/button';
import { Ellipsis } from 'lucide-react';
import { Glowing } from '../styling/glowing';
import React from 'react';
import Spinner from '#components/ui/spinner';
import Themes from '../styling/Themes';
import { cn } from '@/lib/utils';

interface RowActionMenuProps {
  app?: APPS;
  isLoading?: boolean;
  menuItems: {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    className?: string; // Added className to interface
  }[];
}

const RowActionMenu: React.FC<RowActionMenuProps> = ({
  menuItems,
  isLoading = false,
  app = APPS.PORTAL,
}) => {
  return (
    <>
      <div className='flex items-center justify-end gap-2 md:hidden'>
        {menuItems.map((item) => (
          <Button
            key={item.label}
            type='button'
            variant='ghost'
            size='icon'
            className={cn(
              'size-[30px]! p-0 text-[var(--gray-700)] hover:text-primary',
              "[&_svg:not([class*='text-'])]:text-current!",
              item.className,
            )}
            onClick={item.onClick}
            disabled={isLoading}
            aria-label={item.label}
          >
            {item.icon}
          </Button>
        ))}
      </div>

      <div className='hidden md:block'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className={`h-8 w-8 p-0 ${Glowing(app).icon}`}
              disabled={isLoading}
            >
              {isLoading ? <Spinner size={16} /> : <Ellipsis className={`size-[18px] ${Glowing(app).icon}`} />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align='end'
            className={`space-y-1 border-[var(--gray-200)] rounded! shadow-[0px_4px_8px_rgba(0,0,0,0.1)] ${Themes(app).dropdownMenu.content}`}
          >
            {menuItems.map((item) => (
              <DropdownMenuItem
                key={item.label}
                className={cn(
                  'text-[var(--gray-700)]',
                  Themes(app).dropdownMenu.item,
                  // Override shadcn's [&_svg]:text-muted-foreground so icons inherit item color on hover/highlight
                  "[&_svg:not([class*='text-'])]:text-current!",
                )}
                onClick={item.onClick}
              >
                {item.icon}
                <span className={cn('text-sm align-left', item.className)}>{item.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};

export default RowActionMenu;
