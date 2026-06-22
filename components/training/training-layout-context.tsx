'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import { usePathname } from 'next/navigation';

import type { CourseFilters } from '@/hooks/useCoursesTable';

export type TrainingBreadcrumb = {
  label: string;
  href?: string;
};

export type TrainingTabDropdownItem = {
  label: string;
  href: string;
  isActive?: boolean;
};

export type TrainingTab = {
  label: string;
  href: string;
  isActive?: boolean;
  dropdownItems?: TrainingTabDropdownItem[];
};

export type TrainingHeaderConfig = {
  breadcrumbs: TrainingBreadcrumb[];
  tabs: TrainingTab[];
  filters?: CourseFilters;
  unitTypeOptions?: string[];
  onFilterApply?: (filters: CourseFilters) => void;
  globalFilter?: string;
  onGlobalFilterChange?: (value: string) => void;
};

type PageHeaderState = {
  pathname: string;
  config: TrainingHeaderConfig;
};

type TrainingLayoutContextValue = {
  pageHeader: PageHeaderState | null;
  setPageHeader: Dispatch<SetStateAction<PageHeaderState | null>>;
};

const TrainingLayoutContext = createContext<TrainingLayoutContextValue | null>(null);

function areHeaderConfigsEqual(
  current: TrainingHeaderConfig | null,
  next: TrainingHeaderConfig,
): boolean {
  if (!current) {
    return false;
  }

  return (
    current.globalFilter === next.globalFilter &&
    JSON.stringify(current.breadcrumbs) === JSON.stringify(next.breadcrumbs) &&
    JSON.stringify(current.tabs) === JSON.stringify(next.tabs) &&
    JSON.stringify(current.filters) === JSON.stringify(next.filters) &&
    JSON.stringify(current.unitTypeOptions) === JSON.stringify(next.unitTypeOptions)
  );
}

export function TrainingLayoutProvider({ children }: { children: ReactNode }) {
  const [pageHeader, setPageHeader] = useState<PageHeaderState | null>(null);

  const value = useMemo(
    () => ({ pageHeader, setPageHeader }),
    [pageHeader],
  );

  return (
    <TrainingLayoutContext.Provider value={value}>
      {children}
    </TrainingLayoutContext.Provider>
  );
}

export function useTrainingLayout() {
  const context = useContext(TrainingLayoutContext);

  if (!context) {
    throw new Error('useTrainingLayout must be used within TrainingLayoutProvider');
  }

  return context;
}

export function useTrainingHeader(config: TrainingHeaderConfig) {
  const { setPageHeader } = useTrainingLayout();
  const pathname = usePathname();
  const configRef = useRef(config);
  configRef.current = config;

  const configSignature = useMemo(
    () =>
      JSON.stringify({
        globalFilter: config.globalFilter,
        breadcrumbs: config.breadcrumbs,
        tabs: config.tabs,
        filters: config.filters,
        unitTypeOptions: config.unitTypeOptions,
      }),
    [config],
  );

  useEffect(() => {
    const nextConfig = configRef.current;

    setPageHeader((current) => {
      if (current?.pathname === pathname && areHeaderConfigsEqual(current.config, nextConfig)) {
        return current;
      }

      return { pathname, config: nextConfig };
    });
  }, [configSignature, pathname, setPageHeader]);
}
