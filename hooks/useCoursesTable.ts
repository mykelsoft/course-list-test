// hooks/useCoursesTable.ts
'use client';

import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import type {
  ColumnFiltersState,
  PaginationState,
  RowSelectionState,
  SortingState,
  Updater,
} from '@tanstack/react-table';
import { toast } from 'sonner';
import { isSameDay, subDays, isAfter } from 'date-fns';

// Mock Service
import { courseService } from '@/services/course-service';

// Types
import type { CourseWithDetails } from '@/types/courses';
// Assuming you migrated the UI components, this path might change to '@/components/ui/sonner' based on your alias setup
// Using the standard shadcn path for the new project structure
import { DateToaster } from '@/components/ui/sonner';

// --- Types ---

export type CourseFilters = {
  type: string[];
  minUnits: number | '';
  maxUnits: number | '';
  lastModified: string;
};

export type JobRoleBasic = { id: number; name: string };

type CoursesTableState = {
  courses: CourseWithDetails[];
  isLoading: boolean;
  isProcessing: boolean;
  error: string | null;
  
  // Data for Dialogs
  allCompanies: { id: number; name: string }[];
  allJobRoles: { id: number; name: string }[];

  // Table State
  sorting: SortingState;
  pagination: PaginationState;
  rowSelection: RowSelectionState;
  columnFilters: ColumnFiltersState;
  
  // Filter & Search State
  searchQuery: string;
  globalFilter: string;
  filters: CourseFilters;
  isFilterOpen: boolean;

  // Dialog States
  addDialogOpen: boolean;
  editDialogOpen: boolean;
  deleteDialogOpen: boolean;
  duplicateDialogOpen: boolean;
  archiveDialogOpen: boolean; 
  bulkArchiveDialogOpen: boolean;
  assignDialogOpen: boolean; 
  showJobRolesDialogOpen: boolean;

  selectedCourse: CourseWithDetails | null;
  dialogError: string | null;

  // Job Role Dialog Data
  linkedJobRoles: JobRoleBasic[];
  isLoadingJobRoles: boolean;
};

export enum ActionType {
  FETCH_START,
  FETCH_SUCCESS,
  FETCH_ERROR,
  SET_AUX_DATA, 
  SET_SORTING,
  SET_PAGINATION,
  SET_ROW_SELECTION,
  SET_COLUMN_FILTERS,
  SET_SEARCH_QUERY,
  SET_GLOBAL_FILTER,
  SET_FILTERS,
  SET_FILTER_OPEN,
  ACTION_START,
  ACTION_SUCCESS,
  ACTION_ERROR,
  OPEN_ADD_DIALOG,
  CLOSE_ADD_DIALOG,
  OPEN_EDIT_DIALOG,
  CLOSE_EDIT_DIALOG,
  OPEN_DELETE_DIALOG,
  CLOSE_DELETE_DIALOG,
  OPEN_DUPLICATE_DIALOG,
  CLOSE_DUPLICATE_DIALOG,
  OPEN_ARCHIVE_DIALOG, 
  CLOSE_ARCHIVE_DIALOG, 
  OPEN_BULK_ARCHIVE_DIALOG,
  CLOSE_DIALOGS,
  OPEN_ASSIGN_DIALOG, 
  OPEN_SHOW_JOB_ROLES_DIALOG,
  SET_LINKED_JOB_ROLES,
  SET_LOADING_JOB_ROLES,
}

type Action =
  | { type: ActionType.FETCH_START }
  | { type: ActionType.FETCH_SUCCESS; payload: CourseWithDetails[] }
  | { type: ActionType.FETCH_ERROR; payload: string }
  | { type: ActionType.SET_AUX_DATA; payload: { companies: any[]; jobRoles: any[] } } 
  | { type: ActionType.SET_SORTING; payload: SortingState }
  | { type: ActionType.SET_PAGINATION; payload: PaginationState }
  | { type: ActionType.SET_ROW_SELECTION; payload: RowSelectionState }
  | { type: ActionType.SET_COLUMN_FILTERS; payload: ColumnFiltersState }
  | { type: ActionType.SET_SEARCH_QUERY; payload: string }
  | { type: ActionType.SET_GLOBAL_FILTER; payload: string }
  | { type: ActionType.SET_FILTERS; payload: CourseFilters }
  | { type: ActionType.SET_FILTER_OPEN; payload: boolean }
  | { type: ActionType.ACTION_START }
  | { type: ActionType.ACTION_SUCCESS }
  | { type: ActionType.ACTION_ERROR; payload: string }
  | { type: ActionType.OPEN_ADD_DIALOG }
  | { type: ActionType.CLOSE_ADD_DIALOG }
  | { type: ActionType.OPEN_EDIT_DIALOG; payload: CourseWithDetails }
  | { type: ActionType.CLOSE_EDIT_DIALOG }
  | { type: ActionType.OPEN_DELETE_DIALOG; payload: CourseWithDetails }
  | { type: ActionType.CLOSE_DELETE_DIALOG }
  | { type: ActionType.OPEN_DUPLICATE_DIALOG; payload: CourseWithDetails }
  | { type: ActionType.CLOSE_DUPLICATE_DIALOG }
  | { type: ActionType.OPEN_ARCHIVE_DIALOG; payload: CourseWithDetails } 
  | { type: ActionType.CLOSE_ARCHIVE_DIALOG } 
  | { type: ActionType.OPEN_BULK_ARCHIVE_DIALOG }
  | { type: ActionType.CLOSE_DIALOGS }
  | { type: ActionType.OPEN_ASSIGN_DIALOG; payload: CourseWithDetails }
  | { type: ActionType.OPEN_SHOW_JOB_ROLES_DIALOG; payload: CourseWithDetails }
  | { type: ActionType.SET_LINKED_JOB_ROLES; payload: JobRoleBasic[] }
  | { type: ActionType.SET_LOADING_JOB_ROLES; payload: boolean };

const initialState: CoursesTableState = {
  courses: [],
  allCompanies: [],
  allJobRoles: [],
  isLoading: true,
  isProcessing: false,
  error: null,
  sorting: [{ id: 'name', desc: false }],
  pagination: { pageIndex: 0, pageSize: 10 },
  rowSelection: {},
  columnFilters: [],
  searchQuery: '',
  globalFilter: '',
  filters: {
    type: [],
    minUnits: '',
    maxUnits: '',
    lastModified: 'All',
  },
  isFilterOpen: false,
  addDialogOpen: false,
  editDialogOpen: false,
  deleteDialogOpen: false,
  duplicateDialogOpen: false,
  archiveDialogOpen: false, 
  bulkArchiveDialogOpen: false,
  assignDialogOpen: false,
  showJobRolesDialogOpen: false,
  selectedCourse: null,
  dialogError: null,
  linkedJobRoles: [],
  isLoadingJobRoles: false,
};

function reducer(state: CoursesTableState, action: Action): CoursesTableState {
  switch (action.type) {
    case ActionType.FETCH_START:
      return { ...state, isLoading: true, error: null };
    case ActionType.FETCH_SUCCESS:
      return { ...state, isLoading: false, courses: action.payload };
    case ActionType.FETCH_ERROR:
      return { ...state, isLoading: false, error: action.payload };
    case ActionType.SET_AUX_DATA:
      return { ...state, allCompanies: action.payload.companies, allJobRoles: action.payload.jobRoles };
    case ActionType.SET_SORTING:
      return { ...state, sorting: action.payload };
    case ActionType.SET_PAGINATION:
      return { ...state, pagination: action.payload };
    case ActionType.SET_ROW_SELECTION:
      return { ...state, rowSelection: action.payload };
    case ActionType.SET_COLUMN_FILTERS:
      return { ...state, columnFilters: action.payload };
    case ActionType.SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload };
    case ActionType.SET_GLOBAL_FILTER:
      return { ...state, globalFilter: action.payload };
    case ActionType.SET_FILTERS:
      return { ...state, filters: action.payload };
    case ActionType.SET_FILTER_OPEN:
      return { ...state, isFilterOpen: action.payload };
    case ActionType.ACTION_START:
      return { ...state, isProcessing: true, dialogError: null };
    case ActionType.ACTION_SUCCESS:
      return {
        ...state,
        isProcessing: false,
        addDialogOpen: false,
        editDialogOpen: false,
        deleteDialogOpen: false,
        duplicateDialogOpen: false,
        archiveDialogOpen: false, 
        bulkArchiveDialogOpen: false,
        assignDialogOpen: false,
        showJobRolesDialogOpen: false,
        selectedCourse: null,
        rowSelection: {}, 
      };
    case ActionType.ACTION_ERROR:
      return { ...state, isProcessing: false, error: action.payload, dialogError: action.payload };
    case ActionType.OPEN_ADD_DIALOG:
      return { ...state, addDialogOpen: true, selectedCourse: null, dialogError: null };
    case ActionType.CLOSE_ADD_DIALOG:
      return { ...state, addDialogOpen: false, selectedCourse: null };
    case ActionType.OPEN_EDIT_DIALOG:
      return { ...state, editDialogOpen: true, selectedCourse: action.payload, dialogError: null };
    case ActionType.CLOSE_EDIT_DIALOG:
      return { ...state, editDialogOpen: false, selectedCourse: null };
    case ActionType.OPEN_DELETE_DIALOG:
      return { ...state, deleteDialogOpen: true, selectedCourse: action.payload, dialogError: null };
    case ActionType.CLOSE_DELETE_DIALOG:
      return { ...state, deleteDialogOpen: false, selectedCourse: null };
    case ActionType.OPEN_DUPLICATE_DIALOG:
      return { ...state, duplicateDialogOpen: true, selectedCourse: action.payload, dialogError: null };
    case ActionType.CLOSE_DUPLICATE_DIALOG:
      return { ...state, duplicateDialogOpen: false, selectedCourse: null };
    case ActionType.OPEN_ARCHIVE_DIALOG: 
      return { ...state, archiveDialogOpen: true, selectedCourse: action.payload, dialogError: null };
    case ActionType.CLOSE_ARCHIVE_DIALOG: 
      return { ...state, archiveDialogOpen: false, selectedCourse: null };
    case ActionType.OPEN_BULK_ARCHIVE_DIALOG:
      return { ...state, bulkArchiveDialogOpen: true, dialogError: null };
    case ActionType.OPEN_ASSIGN_DIALOG:
      return { ...state, assignDialogOpen: true, selectedCourse: action.payload, dialogError: null };
    case ActionType.OPEN_SHOW_JOB_ROLES_DIALOG:
      return { ...state, showJobRolesDialogOpen: true, selectedCourse: action.payload, dialogError: null, linkedJobRoles: [], isLoadingJobRoles: true };
    case ActionType.SET_LINKED_JOB_ROLES:
      return { ...state, linkedJobRoles: action.payload, isLoadingJobRoles: false };
    case ActionType.SET_LOADING_JOB_ROLES:
      return { ...state, isLoadingJobRoles: action.payload };
    case ActionType.CLOSE_DIALOGS:
       return {
        ...state,
        addDialogOpen: false,
        editDialogOpen: false,
        deleteDialogOpen: false,
        duplicateDialogOpen: false,
        archiveDialogOpen: false, 
        bulkArchiveDialogOpen: false,
        assignDialogOpen: false,
        showJobRolesDialogOpen: false,
        selectedCourse: null,
        isProcessing: false,
        dialogError: null,
       };
    default:
      return state;
  }
}

export function useCoursesTable(initialCourses: CourseWithDetails[] = [], isPaid?: boolean) {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    courses: initialCourses,
    isLoading: true, // Start loading to fetch mock data on mount
  });

  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Initial Data Fetch & Aux Data
  useEffect(() => {
    const init = async () => {
        dispatch({ type: ActionType.FETCH_START });
        try {
            const [courses, companies, jobRoles] = await Promise.all([
                courseService.fetchCourses({ isPaid }),
                courseService.fetchCompanies(),
                courseService.fetchJobRoles()
            ]);
            
            dispatch({ type: ActionType.FETCH_SUCCESS, payload: courses });
            dispatch({
                type: ActionType.SET_AUX_DATA,
                payload: {
                    companies: companies || [],
                    jobRoles: jobRoles || []
                }
            });
        } catch (error) {
             console.error(error);
             dispatch({ type: ActionType.FETCH_ERROR, payload: "Failed to load data" });
        }
    };
    init();
  }, [isPaid]);

  // Refresh helper
  const fetchCourses = useCallback(async () => {
    // dispatch({ type: ActionType.FETCH_START }); // Optional: show loading spinner on refresh
    try {
      const courses = await courseService.fetchCourses({ isPaid });
      dispatch({ type: ActionType.FETCH_SUCCESS, payload: courses });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to fetch courses.';
      dispatch({ type: ActionType.FETCH_ERROR, payload: errorMsg });
      toast.error(errorMsg, DateToaster());
    }
  }, [isPaid]);

  const filteredCourses = useMemo(() => {
    return state.courses.filter((course) => {
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        if (!course.name.toLowerCase().includes(query)) {
          return false;
        }
      }
      if (state.filters.minUnits !== '' && course.totalUnits < state.filters.minUnits) {
        return false;
      }
      if (state.filters.maxUnits !== '' && course.totalUnits > state.filters.maxUnits) {
        return false;
      }
      if (state.filters.lastModified !== 'All' && course.updatedAt) {
        const today = new Date();
        const updated = new Date(course.updatedAt);
        switch (state.filters.lastModified) {
          case 'Today':
            if (!isSameDay(today, updated)) return false;
            break;
          case 'Yesterday': {
            const yesterday = subDays(today, 1);
            if (!isSameDay(yesterday, updated)) return false;
            break;
          }
          case 'Last 7 Days': {
            const last7Days = subDays(today, 7);
            if (!isAfter(updated, last7Days)) return false;
            break;
          }
          case 'Last 30 Days': {
            const last30Days = subDays(today, 30);
            if (!isAfter(updated, last30Days)) return false;
            break;
          }
        }
      }
      return true;
    });
  }, [state.courses, state.searchQuery, state.filters]);

  const handleSearch = (query: string) => {
    dispatch({ type: ActionType.SET_SEARCH_QUERY, payload: query });
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      dispatch({ type: ActionType.SET_GLOBAL_FILTER, payload: query });
    }, 300);
  };

  const handleFilterChange = (newFilters: CourseFilters) => {
    dispatch({ type: ActionType.SET_FILTERS, payload: newFilters });
  };

  const setIsFilterOpen = (isOpen: boolean) => {
    dispatch({ type: ActionType.SET_FILTER_OPEN, payload: isOpen });
  };

  const setSorting = (updater: Updater<SortingState>) =>
    dispatch({ type: ActionType.SET_SORTING, payload: typeof updater === 'function' ? updater(state.sorting) : updater });
  const setPagination = (updater: Updater<PaginationState>) =>
    dispatch({ type: ActionType.SET_PAGINATION, payload: typeof updater === 'function' ? updater(state.pagination) : updater });
  const setRowSelection = (updater: Updater<RowSelectionState>) =>
    dispatch({ type: ActionType.SET_ROW_SELECTION, payload: typeof updater === 'function' ? updater(state.rowSelection) : updater });
  const setColumnFilters = (updater: Updater<ColumnFiltersState>) =>
    dispatch({ type: ActionType.SET_COLUMN_FILTERS, payload: typeof updater === 'function' ? updater(state.columnFilters) : updater });
  const setGlobalFilter = (value: string) => 
    dispatch({ type: ActionType.SET_GLOBAL_FILTER, payload: value });


  const handleOpenAddDialog = () => dispatch({ type: ActionType.OPEN_ADD_DIALOG });
  const handleOpenEditDialog = (course: CourseWithDetails) => dispatch({ type: ActionType.OPEN_EDIT_DIALOG, payload: course });
  const handleOpenDeleteDialog = (course: CourseWithDetails) => dispatch({ type: ActionType.OPEN_DELETE_DIALOG, payload: course });
  const handleOpenDuplicateDialog = (course: CourseWithDetails) => dispatch({ type: ActionType.OPEN_DUPLICATE_DIALOG, payload: course });
  const handleOpenAssignDialog = (course: CourseWithDetails) => dispatch({ type: ActionType.OPEN_ASSIGN_DIALOG, payload: course }); 
  const handleOpenArchiveDialog = (course: CourseWithDetails) => dispatch({ type: ActionType.OPEN_ARCHIVE_DIALOG, payload: course }); 
  
  const handleOpenShowJobRolesDialog = useCallback((course: CourseWithDetails) => {
    dispatch({ type: ActionType.OPEN_SHOW_JOB_ROLES_DIALOG, payload: course });
    // Mock Fetch Linked Job Roles
    courseService.fetchLinkedJobRoles(course.id)
      .then(roles => {
        dispatch({ type: ActionType.SET_LINKED_JOB_ROLES, payload: roles });
      })
      .catch(err => {
         console.error(err);
         toast.error('Failed to load job roles', DateToaster());
         dispatch({ type: ActionType.SET_LINKED_JOB_ROLES, payload: [] });
      });
  }, []);

  const handleRemoveJobRole = useCallback(async (jobRoleId: number) => {
    if (!state.selectedCourse) return;
    const courseId = state.selectedCourse.id;

    try {
      const newRoles = state.linkedJobRoles.filter(r => r.id !== jobRoleId);
      dispatch({ type: ActionType.SET_LINKED_JOB_ROLES, payload: newRoles });

      // Mock Remove
      await courseService.removeCourseFromJobRole(courseId, jobRoleId);
      
      toast.success('Job role link removed.', DateToaster());
      fetchCourses();
    } catch (err) {
       console.error(err);
       toast.error('An error occurred.', DateToaster());
    }
  }, [state.selectedCourse, state.linkedJobRoles, fetchCourses]);

  const handleDelete = useCallback(async () => {
    if (!state.selectedCourse) return;
    dispatch({ type: ActionType.ACTION_START });
    try {
      // Mock Delete
      await courseService.deleteCourse(state.selectedCourse.id);
      
      toast.success('Course deleted successfully.', DateToaster());
      dispatch({ type: ActionType.ACTION_SUCCESS });
      fetchCourses();
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Delete failed';
      dispatch({ type: ActionType.ACTION_ERROR, payload: msg });
      toast.error(msg, DateToaster());
    }
  }, [state.selectedCourse, fetchCourses]);

  const handleDuplicateCourse = useCallback(async () => {
    if (!state.selectedCourse) return;
    dispatch({ type: ActionType.ACTION_START });
    try {
      // Mock Duplicate
      await courseService.duplicateCourse(state.selectedCourse.id);

      toast.success('Course duplicated successfully.', DateToaster());
      dispatch({ type: ActionType.ACTION_SUCCESS });
      fetchCourses();
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Duplicate failed';
      dispatch({ type: ActionType.ACTION_ERROR, payload: msg });
      toast.error(msg, DateToaster());
    }
  }, [state.selectedCourse, fetchCourses]);

  const handleArchiveCourse = useCallback(async () => {
    if (!state.selectedCourse) return;
    dispatch({ type: ActionType.ACTION_START });
    try {
      // Mock Archive
      await courseService.archiveCourses([state.selectedCourse.id]);

      toast.success('Course archived successfully.', DateToaster());
      dispatch({ type: ActionType.ACTION_SUCCESS });
      fetchCourses();
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Archive failed';
      dispatch({ type: ActionType.ACTION_ERROR, payload: msg });
      toast.error(msg, DateToaster());
    }
  }, [state.selectedCourse, fetchCourses]);

  const handleBulkArchive = () => {
    dispatch({ type: ActionType.OPEN_BULK_ARCHIVE_DIALOG });
  };

  const onBulkArchiveConfirm = async () => {
    const selectedIds = Object.keys(state.rowSelection).map((idx) => state.courses[Number(idx)].id);
    if (selectedIds.length === 0) return;

    dispatch({ type: ActionType.ACTION_START });
    try {
      // Mock Bulk Archive
      await courseService.archiveCourses(selectedIds);

      toast.success('Courses archived successfully.', DateToaster());
      dispatch({ type: ActionType.ACTION_SUCCESS });
      await fetchCourses();
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Bulk archive failed.';
      dispatch({ type: ActionType.ACTION_ERROR, payload: msg });
      toast.error(msg, DateToaster());
    }
  };
  
  const handleAssignToCompanies = async (courseId: number, companySeatMap: Record<string, number>) => {
      dispatch({ type: ActionType.ACTION_START });
      try {
          // Mock Assign
          await courseService.assignToCompanies(courseId, companySeatMap);
          
          toast.success('Assigned to companies.', DateToaster());
          dispatch({ type: ActionType.ACTION_SUCCESS });
          fetchCourses(); 
      } catch (error) {
          const msg = error instanceof Error ? error.message : 'Assignment failed';
          dispatch({ type: ActionType.ACTION_ERROR, payload: msg });
          toast.error(msg, DateToaster());
      }
  };
  
  const handleAssignToJobRoles = async (courseId: number, jobRoleIds: number[]) => {
      dispatch({ type: ActionType.ACTION_START });
      try {
          // Mock Assign
          await courseService.assignToJobRoles(courseId, jobRoleIds);

          toast.success('Assigned to job roles.', DateToaster());
          dispatch({ type: ActionType.ACTION_SUCCESS });
          fetchCourses(); 
      } catch (error) {
          const msg = error instanceof Error ? error.message : 'Assignment failed';
          dispatch({ type: ActionType.ACTION_ERROR, payload: msg });
          toast.error(msg, DateToaster());
      }
  };

  const refreshData = fetchCourses;

  return {
    state: { ...state, courses: filteredCourses },
    dispatch,
    handlers: {
      handleSearch,
      handleFilterChange,
      setIsFilterOpen,
      handleOpenAddDialog,
      handleOpenEditDialog,
      handleOpenDeleteDialog,
      handleOpenDuplicateDialog,
      handleOpenAssignDialog,
      handleOpenShowJobRolesDialog,
      handleOpenArchiveDialog, 
      handleDelete,
      handleDuplicateCourse,
      handleArchiveCourse, 
      handleAssignToCompanies,
      handleAssignToJobRoles,
      handleRemoveJobRole,
      setSorting,
      setPagination,
      setRowSelection,
      setColumnFilters,
      refreshData,
    },
    handleDeleteCourse: handleDelete,
    handleDuplicateCourse,
    handleArchiveCourse, 
    handleBulkArchive,
    onBulkArchiveConfirm,
    setSorting,
    setPagination,
    setGlobalFilter,
    setRowSelection,
    setColumnFilters,
    refreshData,
    selectedCount: Object.keys(state.rowSelection).length,
  };
}
