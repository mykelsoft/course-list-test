'use client';

import {
  AlertTriangle,
  Building2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  CreditCard,
  FileSearch,
  GraduationCap,
  HardHat,
  LayoutGrid,
  List,
  PieChart,
  SearchIcon,
  UserRoundPlus,
} from 'lucide-react';

import { APPS } from '@/types/courses';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { YourSafetyPartnersLogo } from '@/components/portal/your-safety-partners-logo';
import { cn } from '@/lib/utils';
import { useState } from 'react';

type PortalSidebarProps = {
  activeApp?: APPS;
};

type PortalNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

type SidebarApp = Exclude<APPS, APPS.PORTAL>;

type AppNavItem = {
  label: string;
  href: string;
  app: SidebarApp;
  icon: LucideIcon;
};

const appNavItemStyles: Record<
  SidebarApp,
  {
    linkActive: string;
    linkInactive: string;
    iconBadge: string;
    icon: string;
  }
> = {
  [APPS.POLICIES_AND_PROCEDURES]: {
    linkActive: 'bg-[var(--policiesAndProcedures-highlight)] text-[var(--policiesAndProcedures-primary)]',
    linkInactive:
      'text-[var(--gray-600)] hover:bg-[var(--policiesAndProcedures-highlight)] hover:text-[var(--policiesAndProcedures-primary)]',
    iconBadge: 'bg-[var(--policiesAndProcedures-highlight)]',
    icon: 'text-[var(--policiesAndProcedures-primary)]',
  },
  [APPS.FORMS]: {
    linkActive: 'bg-[var(--forms-highlight)] text-[var(--forms-primary)]',
    linkInactive: 'text-[var(--gray-600)] hover:bg-[var(--forms-highlight)] hover:text-[var(--forms-primary)]',
    iconBadge: 'bg-[var(--forms-highlight)]',
    icon: 'text-[var(--forms-primary)]',
  },
  [APPS.INSPECTIONS]: {
    linkActive: 'bg-[var(--inspections-highlight)] text-[var(--inspections-primary)]',
    linkInactive: 'text-[var(--gray-600)] hover:bg-[var(--inspections-highlight)] hover:text-[var(--inspections-primary)]',
    iconBadge: 'bg-[var(--inspections-highlight)]',
    icon: 'text-[var(--inspections-primary)]',
  },
  [APPS.TRAINING]: {
    linkActive: 'bg-[var(--highlight)] text-[var(--training-primary)]',
    linkInactive: 'text-[var(--gray-600)] hover:bg-[var(--highlight)] hover:text-[var(--training-primary)]',
    iconBadge: 'bg-[var(--highlight)]',
    icon: 'text-[var(--training-primary)]',
  },
  [APPS.HAZARDS]: {
    linkActive: 'bg-[var(--hazards-highlight)] text-[var(--hazards-primary)]',
    linkInactive: 'text-[var(--gray-600)] hover:bg-[var(--hazards-highlight)] hover:text-[var(--hazards-primary)]',
    iconBadge: 'bg-[var(--hazards-highlight)]',
    icon: 'text-[var(--hazards-primary)]',
  },
  [APPS.CONTRACTORS]: {
    linkActive: 'bg-[var(--contractors-highlight)] text-[var(--contractors-primary)]',
    linkInactive: 'text-[var(--gray-600)] hover:bg-[var(--contractors-highlight)] hover:text-[var(--contractors-primary)]',
    iconBadge: 'bg-[var(--contractors-highlight)]',
    icon: 'text-[var(--contractors-primary)]',
  },
};

const portalNavItems: PortalNavItem[] = [
  { label: 'Dashboard', href: '#', icon: LayoutGrid },
  { label: 'Reports', href: '#', icon: PieChart },
  { label: 'Company Management', href: '#', icon: Building2 },
  { label: 'User Management', href: '#', icon: UserRoundPlus },
  { label: 'Billing', href: '#', icon: CreditCard },
];

const appNavItems: AppNavItem[] = [
  {
    label: 'Policies and Procedures',
    href: '#',
    app: APPS.POLICIES_AND_PROCEDURES,
    icon: ClipboardList,
  },
  {
    label: 'Forms',
    href: '#',
    app: APPS.FORMS,
    icon: List,
  },
  {
    label: 'Inspections',
    href: '#',
    app: APPS.INSPECTIONS,
    icon: FileSearch,
  },
  {
    label: 'Training',
    href: '/',
    app: APPS.TRAINING,
    icon: GraduationCap,
  },
  {
    label: 'Hazards',
    href: '#',
    app: APPS.HAZARDS,
    icon: AlertTriangle,
  },
  {
    label: 'Contractors',
    href: '#',
    app: APPS.CONTRACTORS,
    icon: HardHat,
  },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className='text-xs font-extrabold leading-none uppercase tracking-wider text-[var(--gray-400)] px-4'>{children}</p>;
}

export function PortalSidebar({ activeApp = APPS.TRAINING }: PortalSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className='fixed top-0 left-0 bottom-0 shrink-0 md:block hidden'>
      <div
        className={cn(
          'relative flex min-h-screen flex-col border-r border-[var(--gray-200)] bg-[var(--sidebar)] transition-[width] duration-200 ease-linear',
          isCollapsed ? 'w-0 border-r-0' : `w-[var(--portal-sidebar-width)]`,
        )}
      >
        <div className='flex min-h-screen w-[var(--portal-sidebar-width)] flex-col overflow-hidden'>
          <div className='py-3 px-4'>
            <YourSafetyPartnersLogo />
          </div>

          <div className='px-4'>
            <div className='relative'>
              <div className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--gray-600)]'>
                <SearchIcon
                  size={14}
                  strokeWidth={2}
                />
              </div>
              <Input
                type='search'
                placeholder='Find anything'
                className='h-[41px] rounded-lg border-[var(--gray-300)] bg-white pl-[38px] text-sm text-[var(--gray-700)] shadow-none placeholder:text-[var(--gray-400)] focus-visible:border-[var(--gray-300)] focus-visible:ring-0'
              />
            </div>
          </div>

          <nav
            className='py-8'
            aria-label='Portal management'
          >
            <SectionLabel>Portal Management</SectionLabel>
            <ul className='mt-2'>
              {portalNavItems.map((item) => {
                const Icon = item.icon;

                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className='portal-sidebar-nav-link group text-[var(--gray-600)] hover:text-[var(--main-primary)] hover:bg-[var(--main-highlight)]'
                    >
                      <Icon
                        className='portal-sidebar-nav-icon group-hover:text-[var(--main-primary)]'
                        strokeWidth={1.5}
                      />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <Separator />

          <nav
            className='py-8'
            aria-label='Apps'
          >
            <SectionLabel>Apps</SectionLabel>
            <ul className='mt-2'>
              {appNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.app === activeApp;
                const styles = appNavItemStyles[item.app];

                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'portal-sidebar-nav-link',
                        isActive ? styles.linkActive : styles.linkInactive,
                      )}
                    >
                      <span
                        className={cn('flex size-7 shrink-0 items-center justify-center rounded-full', styles.iconBadge)}
                      >
                        <Icon
                          className={cn('size-5', styles.icon)}
                          strokeWidth={2}
                        />
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className='mt-auto px-2'>
            <div className='border-t border-[var(--gray-200)] pt-2 pb-6 px-2 space-y-1'>
              <p className='text-xs font-medium text-[var(--gray-500)]'>Current Version</p>
              <p className='text-xs font-medium text-[var(--gray-400)]'>v1.1.0</p>
            </div>
          </div>
        </div>

        {/* hide for now */}
        {/* {!isCollapsed && (
          <button
            type='button'
            onClick={() => setIsCollapsed(true)}
            aria-label='Collapse sidebar'
            aria-expanded
            className='absolute top-[72%] -right-3 z-10 flex size-6 items-center justify-center rounded-sm bg-[var(--main-primary)] text-white shadow-sm transition-opacity hover:opacity-90'
          >
            <ChevronLeft
              className='size-4'
              strokeWidth={2.5}
            />
          </button>
        )} */}
      </div>

      {isCollapsed && (
        <button
          type='button'
          onClick={() => setIsCollapsed(false)}
          aria-label='Expand sidebar'
          aria-expanded={false}
          className='fixed left-0 top-[72%] z-20 flex size-6 items-center justify-center rounded-sm bg-[var(--main-primary)] text-white shadow-sm transition-opacity hover:opacity-90'
        >
          <ChevronRight
            className='size-4'
            strokeWidth={2.5}
          />
        </button>
      )}
    </div>
  );
}
