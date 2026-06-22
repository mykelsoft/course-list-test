'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { BookOpen, ChevronRight, CircleHelp, Lightbulb, SearchIcon } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Fragment, useEffect, useRef, useState } from 'react';

import { APPS } from '@/types/ENUMS';
import type { CourseFilters } from '@/hooks/useCoursesTable';
import { CourseFiltersPopover } from '@/components/course-list/course-filters-popover';
import { DEFAULT_TRAINING_SEARCH_FILTER_CONFIG } from '@/components/training/training-nav-config';
import { EMPTY_COURSE_FILTERS } from '@/hooks/useCoursesTable';
import { Glowing } from '@/components/custom-ui/styling/glowing';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import Themes from '@/components/custom-ui/styling/Themes';
import { cn } from '@/lib/utils';

type BreadcrumbItemConfig = {
  label: string;
  href?: string;
};

type TabDropdownItem = {
  label: string;
  href: string;
  isActive?: boolean;
};

type TabItemConfig = {
  label: string;
  href: string;
  isActive?: boolean;
  dropdownItems?: TabDropdownItem[];
};

const trainingTheme = Themes(APPS.TRAINING);

const tabBaseClassName =
  'py-2 px-3 text-sm text-center font-normal leading-normal rounded transition-colors';
const tabActiveClassName =
  'bg-[var(--highlight)] text-[var(--training-primary)] active:bg-[var(--third)] active:text-white';
const tabInactiveClassName =
  'text-[var(--gray-700)] hover:bg-[var(--highlight)] hover:text-[var(--training-primary)]';

function SectionTab({ tab }: { tab: TabItemConfig }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current?.contains(event.target as Node)) {
        return;
      }

      setOpen(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  if (tab.dropdownItems?.length) {
    return (
      <div
        ref={containerRef}
        className='relative'
      >
        <button
          type='button'
          aria-expanded={open}
          aria-haspopup='menu'
          aria-current={tab.isActive ? 'page' : undefined}
          onClick={() => setOpen((current) => !current)}
          className={cn(
            tabBaseClassName,
            'inline-flex items-center justify-center',
            open && 'bg-[var(--highlight)] text-[var(--training-primary)]',
            tab.isActive ? tabActiveClassName : tabInactiveClassName,
          )}
        >
          {tab.label}
        </button>
        {open ? (
          <div
            role='menu'
            className={cn(
              'absolute left-0 top-11 z-50 min-w-[12rem] space-y-1 rounded border border-[var(--gray-200)] bg-white p-1 shadow-[0px_4px_8px_rgba(0,0,0,0.1)] border-0',
              trainingTheme.dropdownMenu.content,
            )}
          >
            {tab.dropdownItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                role='menuitem'
                aria-current={item.isActive ? 'page' : undefined}
                onClick={() => setOpen(false)}
                className={cn(
                  'block rounded px-3 py-2.5 text-sm leading-normal text-[var(--gray-700)]',
                  trainingTheme.dropdownMenu.item,
                  item.isActive && trainingTheme.dropdownMenu.itemSelected,
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  if (tab.isActive) {
    return (
      <Link
        href={tab.href}
        aria-current='page'
        className={cn(tabBaseClassName, tabActiveClassName)}
      >
        {tab.label}
      </Link>
    );
  }

  return (
    <Link href={tab.href} className={cn(tabBaseClassName, tabInactiveClassName)}>
      {tab.label}
    </Link>
  );
}

type TrainingSectionHeaderProps = {
  breadcrumbs: BreadcrumbItemConfig[];
  tabs: TabItemConfig[];
  showSectionNav?: boolean;
  showSearchFilters?: boolean;
  filters?: CourseFilters;
  unitTypeOptions?: string[];
  onFilterApply?: (filters: CourseFilters) => void;
  globalFilter?: string;
  onGlobalFilterChange?: (value: string) => void;
  userInitials?: string;
  onBookClick?: () => void;
  onHelpClick?: () => void;
};

export function TrainingSectionHeader({
  breadcrumbs,
  tabs,
  showSectionNav = true,
  showSearchFilters = true,
  filters,
  unitTypeOptions,
  onFilterApply,
  globalFilter,
  onGlobalFilterChange,
  userInitials = 'JT',
  onBookClick,
  onHelpClick,
}: TrainingSectionHeaderProps) {
  const lastBreadcrumbIndex = breadcrumbs.length - 1;
  const resolvedFilters = filters ?? DEFAULT_TRAINING_SEARCH_FILTER_CONFIG.filters ?? EMPTY_COURSE_FILTERS;
  const resolvedUnitTypeOptions =
    unitTypeOptions ?? DEFAULT_TRAINING_SEARCH_FILTER_CONFIG.unitTypeOptions ?? [];
  const resolvedOnFilterApply =
    onFilterApply ?? DEFAULT_TRAINING_SEARCH_FILTER_CONFIG.onFilterApply ?? (() => {});
  const resolvedOnGlobalFilterChange =
    onGlobalFilterChange ?? DEFAULT_TRAINING_SEARCH_FILTER_CONFIG.onGlobalFilterChange ?? (() => {});

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
            className='flex items-center justify-center text-[var(--main-primary)] hover:bg-[var(--main-secondary)]  transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--main-primary)] focus-visible:ring-offset-2 rounded p-1.5'
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
            className='flex items-center justify-center text-[var(--main-primary)] hover:bg-[var(--main-secondary)]  transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--main-primary)] focus-visible:ring-offset-2 rounded p-1.5'
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

      {showSectionNav ? (
        <nav
          aria-label='Section navigation'
          className='grid grid-cols-2 md:flex items-center px-4 py-3 md:px-6 gap-2 shadow-[inset_0_-1px_0_0_var(--gray-200)]'
        >
          {tabs.map((tab) => (
            <SectionTab
              key={tab.label}
              tab={tab}
            />
          ))}
        </nav>
      ) : null}

      <div
        className={cn(
          'py-4 md:px-6 px-4',
          !showSearchFilters && 'hidden',
        )}
        aria-hidden={!showSearchFilters}
      >
          <div className='flex items-center md:gap-4 gap-2'>
            <CourseFiltersPopover
              app={APPS.TRAINING}
              filters={resolvedFilters}
              unitTypeOptions={resolvedUnitTypeOptions}
              onApply={resolvedOnFilterApply}
            />

            <div className='flex-1 min-w-0'>
              <div
                className={cn(
                  'relative flex-1 rounded-md bg-[var(--gray-50)] transition-shadow focus-within:ring-1 focus-within:ring-primary focus-within:shadow-[0_0_6px_var(--primary-shadow)]',
                  Glowing(APPS.TRAINING).inputBox,
                )}
              >
                <div className='absolute left-3 top-1/2 -translate-y-1/2 text-[var(--gray-700)]'>
                  <SearchIcon size={16} />
                </div>
                <Input
                  type='search'
                  placeholder='Search Unit'
                  value={globalFilter ?? ''}
                  onChange={(event) => resolvedOnGlobalFilterChange(event.target.value)}
                  className='placeholder:text-[var(--gray-400)] focus:placeholder:text-transparent transition-colors duration-200 text-sm border-none h-[37px] pl-9 shadow-none ring-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0'
                />
              </div>
            </div>
          </div>
        </div>
    </header>
  );
}
