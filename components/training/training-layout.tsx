'use client';

import { TrainingLayoutProvider, useTrainingLayout } from '@/components/training/training-layout-context';

import { APPS } from '@/types/courses';
import { PortalSidebar } from '@/components/portal/portal-sidebar';
import { TrainingSectionHeader } from '@/components/course-list/training-section-header';
import {
  getDefaultHeaderConfig,
  shouldShowTrainingSearchFilters,
  shouldShowTrainingSectionNav,
} from '@/components/training/training-nav-config';
import { usePathname } from 'next/navigation';

function TrainingLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { pageHeader } = useTrainingLayout();
  const resolvedHeaderConfig =
    pageHeader?.pathname === pathname
      ? pageHeader.config
      : getDefaultHeaderConfig(pathname);

  return (
    <div className='min-h-screen'>
      <div className='flex min-h-screen w-full'>
        <PortalSidebar activeApp={APPS.TRAINING} />
        <main className='flex-1 min-w-0 md:ml-[var(--portal-sidebar-width)]'>
          <TrainingSectionHeader
            breadcrumbs={resolvedHeaderConfig.breadcrumbs}
            tabs={resolvedHeaderConfig.tabs}
            showSectionNav={shouldShowTrainingSectionNav(pathname)}
            showSearchFilters={shouldShowTrainingSearchFilters(pathname)}
            filters={resolvedHeaderConfig.filters}
            unitTypeOptions={resolvedHeaderConfig.unitTypeOptions}
            onFilterApply={resolvedHeaderConfig.onFilterApply}
            globalFilter={resolvedHeaderConfig.globalFilter}
            onGlobalFilterChange={resolvedHeaderConfig.onGlobalFilterChange}
          />
          {children}
        </main>
      </div>
    </div>
  );
}

export function TrainingLayout({ children }: { children: React.ReactNode }) {
  return (
    <TrainingLayoutProvider>
      <TrainingLayoutShell>{children}</TrainingLayoutShell>
    </TrainingLayoutProvider>
  );
}
