export enum DataStateTypes {
  data = 'data',
  formData = 'formData',
  isLoading = 'isLoading',
  onSubmit = 'onSubmit',
  isSubmitted = 'isSubmitted',
  errorMessage = 'errorMessage',
  serverError = 'serverError',
  isOpen = 'isOpen',
}

export type DataState<T = any> = {
  data: T;
  formData: React.FormEvent<HTMLFormElement> | null;
  isLoading: boolean;
  onSubmit: boolean;
  isSubmitted: boolean;
  errorMessage: string | null;
  serverError: string | null;
  isOpen: boolean;
};

export type Filter = {
  id: number;
  name: string;
  visible: boolean;
  icon?: React.ReactNode;
  value?: string; // Column identifier to filter by
};
