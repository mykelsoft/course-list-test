type Result = {
  success: boolean;
  message?: string;
  data?: any;
};

type ResultWithError = {
  success: boolean;
  message?: string;
  error?: any;
};

export type { Result, ResultWithError };
