import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { BookOpen, ChevronRight, CircleHelp, Lightbulb } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

import { Fragment } from 'react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

type BreadcrumbItemConfig = {
  label: string;
  href?: string;
};

type TabItemConfig = {
  label: string;
  href: string;
  isActive?: boolean;
};

type TrainingSectionHeaderProps = {
  breadcrumbs: BreadcrumbItemConfig[];
  tabs: TabItemConfig[];
  userInitials?: string;
  onBookClick?: () => void;
  onHelpClick?: () => void;
};

export function TrainingSectionHeader({
  breadcrumbs,
  tabs,
  userInitials = 'JT',
  onBookClick,
  onHelpClick,
}: TrainingSectionHeaderProps) {
  const lastBreadcrumbIndex = breadcrumbs.length - 1;

  return (
    <header className='bg-white shadow-[inset_0_-1px_0_0_var(--gray-200)]'>
      <div className='flex items-center justify-between p-4 md:py-4 md:px-6 shadow-[inset_0_-1px_0_0_var(--gray-200)]'>
        <div className='flex items-center gap-2 min-w-0'>
          <div
            className='flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--highlight)]'
            aria-hidden='true'
          >
            <Lightbulb
              className='size-5 text-[var(--training-primary)]'
              strokeWidth={2}
            />
          </div>

          <Breadcrumb>
            <BreadcrumbList className='flex-nowrap text-sm leading-normal text-[var(--gray-500)]'>
              {breadcrumbs.map((crumb, index) => {
                const isFirst = index === 0;
                const isLast = index === lastBreadcrumbIndex;

                return (
                  <Fragment key={crumb.label}>
                    {index > 0 && (
                      <BreadcrumbSeparator className='hidden md:flex text-black'>
                        <ChevronRight className='size-3.5' />
                      </BreadcrumbSeparator>
                    )}
                    <BreadcrumbItem className={cn(!isFirst && 'hidden md:inline-flex')}>
                      {isLast || !crumb.href ? (
                        <BreadcrumbPage
                          className={cn(
                            'text-sm leading-normal',
                            isFirst ? 'font-semibold text-[var(--gray-700)]' : 'font-normal text-[var(--gray-500)]',
                          )}
                        >
                          {crumb.label}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link
                            href={crumb.href}
                            className={cn(
                              'text-sm leading-normal transition-colors hover:text-[var(--gray-800)]',
                              isFirst ? 'font-semibold text-[var(--gray-700)]' : 'font-normal text-[var(--gray-500)]',
                            )}
                          >
                            {crumb.label}
                          </Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className='flex items-center gap-2 shrink-0'>
          <button
            type='button'
            onClick={onBookClick}
            aria-label='Open documentation'
            className='flex items-center justify-center text-[#6D28D9] hover:bg-[#6d28d91a]  transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] focus-visible:ring-offset-2 rounded p-1.5'
          >
            <BookOpen
              className='size-[18px]'
              strokeWidth={2}
            />
          </button>
          <button
            type='button'
            onClick={onHelpClick}
            aria-label='Open help'
            className='flex items-center justify-center text-[#6D28D9] hover:bg-[#6d28d91a]  transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] focus-visible:ring-offset-2 rounded p-1.5'
          >
            <CircleHelp
              className='size-5'
              strokeWidth={2}
            />
          </button>

          <Separator
            orientation='vertical'
            className='h-[30px]! bg-[var(--gray-200)] mx-2'
          />
          <Avatar className='size-8'>
            <AvatarFallback className='bg-[var(--gray-200)] text-xs font-medium text-[var(--gray-700)]'>
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <nav
        aria-label='Section navigation'
        className='grid grid-cols-2 md:flex items-center px-4 py-3 md:px-6 gap-2'
      >
        {tabs.map((tab) =>
          tab.isActive ? (
            <Link
              key={tab.label}
              href={tab.href}
              aria-current='page'
              className='py-2 px-3 text-sm text-center font-normal leading-normal rounded bg-[var(--highlight)] text-[var(--training-primary)] active:bg-[var(--third)] active:text-white transition-colors'
            >
              {tab.label}
            </Link>
          ) : (
            <Link
              key={tab.label}
              href={tab.href}
              className='py-2 px-3 text-sm text-center font-normal leading-normal rounded text-[var(--gray-700)] hover:bg-[var(--highlight)] hover:text-[var(--training-primary)] transition-colors'
            >
              {tab.label}
            </Link>
          ),
        )}
      </nav>
    </header>
  );
}
