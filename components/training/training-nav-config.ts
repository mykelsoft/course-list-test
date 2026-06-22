import { EMPTY_COURSE_FILTERS } from '@/hooks/useCoursesTable';
import type { TrainingHeaderConfig } from '@/components/training/training-layout-context';

type UnitListTabState = 'active' | 'archived';
type JobRoleListTabState = 'active' | 'archived';

export const ACTIVE_UNIT_LIST_BREADCRUMBS: TrainingHeaderConfig['breadcrumbs'] = [
  { label: 'Training', href: '#' },
  { label: 'Unit List', href: '/' },
  { label: 'Active Units' },
];

export const ARCHIVED_UNIT_LIST_BREADCRUMBS: TrainingHeaderConfig['breadcrumbs'] = [
  { label: 'Training', href: '#' },
  { label: 'Unit List', href: '/' },
  { label: 'Archived Units' },
];

export const ADD_UNIT_BREADCRUMBS: TrainingHeaderConfig['breadcrumbs'] = [
  { label: 'Training', href: '#' },
  { label: 'Unit List', href: '/' },
  { label: 'Add Unit' },
];

export const UNIT_DETAILS_BREADCRUMBS: TrainingHeaderConfig['breadcrumbs'] = [
  { label: 'Training', href: '#' },
  { label: 'Unit List', href: '/' },
  { label: 'Unit Details' },
];

export const MASTER_JOB_ROLES_BREADCRUMBS: TrainingHeaderConfig['breadcrumbs'] = [
  { label: 'Training', href: '#' },
  { label: 'Job Role List', href: '/job-roles' },
  { label: 'Master Job Roles' },
];

export const ARCHIVED_JOB_ROLES_BREADCRUMBS: TrainingHeaderConfig['breadcrumbs'] = [
  { label: 'Training', href: '#' },
  { label: 'Job Role List', href: '/job-roles' },
  { label: 'Archived Job Roles' },
];

export const ADD_JOB_ROLE_BREADCRUMBS: TrainingHeaderConfig['breadcrumbs'] = [
  { label: 'Training', href: '#' },
  { label: 'Job Role List', href: '/job-roles' },
  { label: 'Add Job Role' },
];

const TRAINING_ROUTES_WITHOUT_SECTION_NAV = new Set(['/units/add', '/job-roles']);

export function shouldShowTrainingSectionNav(pathname: string): boolean {
  return !TRAINING_ROUTES_WITHOUT_SECTION_NAV.has(pathname);
}

export function shouldShowTrainingSearchFilters(pathname: string): boolean {
  return shouldShowTrainingSectionNav(pathname);
}

export function getJobRoleListTabs(activeList: JobRoleListTabState = 'active'): TrainingHeaderConfig['tabs'] {
  const isActiveList = activeList === 'active';

  return [
    {
      label: 'Job Role List',
      href: '/job-roles',
      isActive: true,
      dropdownItems: [
        { label: 'Active Job Roles', href: '/job-roles', isActive: isActiveList },
        { label: 'Archived Job Roles', href: '/job-roles/archived', isActive: !isActiveList },
      ],
    },
    {
      label: 'Unit List',
      href: '/',
      dropdownItems: [
        { label: 'Active Units', href: '/' },
        { label: 'Archived Units', href: '/units/archived' },
      ],
    },
  ];
}

export function getUnitListTabs(activeList: UnitListTabState = 'active'): TrainingHeaderConfig['tabs'] {
  const isActiveList = activeList === 'active';

  return [
    {
      label: 'Job Role List',
      href: '/job-roles',
      dropdownItems: [
        { label: 'Active Job Roles', href: '/job-roles' },
        { label: 'Archived Job Roles', href: '/job-roles/archived' },
      ],
    },
    {
      label: 'Unit List',
      href: '/',
      isActive: true,
      dropdownItems: [
        { label: 'Active Units', href: '/', isActive: isActiveList },
        { label: 'Archived Units', href: '/units/archived', isActive: !isActiveList },
      ],
    },
  ];
}

export const ACTIVE_UNIT_LIST_TABS = getUnitListTabs('active');
export const ARCHIVED_UNIT_LIST_TABS = getUnitListTabs('archived');
export const MASTER_JOB_ROLES_TABS = getJobRoleListTabs('active');
export const ARCHIVED_JOB_ROLES_TABS = getJobRoleListTabs('archived');

const noop = () => {};

export const DEFAULT_TRAINING_SEARCH_FILTER_CONFIG: Pick<
  TrainingHeaderConfig,
  'filters' | 'unitTypeOptions' | 'onFilterApply' | 'globalFilter' | 'onGlobalFilterChange'
> = {
  filters: EMPTY_COURSE_FILTERS,
  unitTypeOptions: [],
  onFilterApply: noop,
  globalFilter: '',
  onGlobalFilterChange: noop,
};

export function withTrainingSearchFilter(
  config: TrainingHeaderConfig,
  overrides?: Partial<typeof DEFAULT_TRAINING_SEARCH_FILTER_CONFIG>,
): TrainingHeaderConfig {
  return {
    ...DEFAULT_TRAINING_SEARCH_FILTER_CONFIG,
    ...config,
    ...overrides,
  };
}

function withSearchFilterDefaults(config: TrainingHeaderConfig): TrainingHeaderConfig {
  return withTrainingSearchFilter(config);
}

export function getDefaultHeaderConfig(pathname: string): TrainingHeaderConfig {
  if (pathname === '/units/add') {
    return {
      breadcrumbs: ADD_UNIT_BREADCRUMBS,
      tabs: ACTIVE_UNIT_LIST_TABS,
    };
  }

  if (pathname === '/job-roles/add') {
    return {
      breadcrumbs: ADD_JOB_ROLE_BREADCRUMBS,
      tabs: MASTER_JOB_ROLES_TABS,
    };
  }

  if (pathname === '/') {
    return withSearchFilterDefaults({
      breadcrumbs: ACTIVE_UNIT_LIST_BREADCRUMBS,
      tabs: ACTIVE_UNIT_LIST_TABS,
    });
  }

  if (pathname === '/units/archived') {
    return withSearchFilterDefaults({
      breadcrumbs: ARCHIVED_UNIT_LIST_BREADCRUMBS,
      tabs: ARCHIVED_UNIT_LIST_TABS,
    });
  }

  if (pathname === '/job-roles') {
    return withSearchFilterDefaults({
      breadcrumbs: MASTER_JOB_ROLES_BREADCRUMBS,
      tabs: MASTER_JOB_ROLES_TABS,
    });
  }

  if (pathname === '/job-roles/archived') {
    return withSearchFilterDefaults({
      breadcrumbs: ARCHIVED_JOB_ROLES_BREADCRUMBS,
      tabs: ARCHIVED_JOB_ROLES_TABS,
    });
  }

  if (pathname.startsWith('/units/')) {
    return withSearchFilterDefaults({
      breadcrumbs: UNIT_DETAILS_BREADCRUMBS,
      tabs: ACTIVE_UNIT_LIST_TABS,
    });
  }

  return withSearchFilterDefaults({
    breadcrumbs: [{ label: 'Training', href: '#' }],
    tabs: ACTIVE_UNIT_LIST_TABS,
  });
}
