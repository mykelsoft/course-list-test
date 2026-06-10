export type AuthUser = {
  // phoneNumber: null; // Old definition
  phoneNumber: string | null; // New definition: Allow string or null
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  role?: string;
  company?: string;
};
