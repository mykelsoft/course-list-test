import { format } from 'date-fns';

export function formatArchivedDate(date: Date): string {
  return format(date, 'EEE, yyyy-MM-dd, h:mm a');
}
