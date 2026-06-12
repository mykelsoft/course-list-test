type Result = {
  success: boolean;
  message?: string;
  data?: unknown;
};

type ResultWithError = {
  success: boolean;
  message?: string;
  error?: unknown;
};

export type { Result, ResultWithError };
