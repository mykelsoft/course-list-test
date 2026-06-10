// File: ./components/ui/textarea.tsx
import * as React from 'react';

import { cn } from '@/lib/utils';
import { Glowing } from '#components/custom-ui/styling/glowing.ts';
import { APPS } from '#types/ENUMS.ts';

function TextArea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="input"
      className={cn(
        // Use transparent border so the textarea doesn't show a dark default border,
        // while preserving layout and focus ring behavior for accessibility.
        //  OLD STYLE
        // 'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        // 'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex w-full min-w-0 rounded-md border-transparent bg-transparent px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        Glowing(APPS.PORTAL).textareaUIComponent,
        // Default focus rings remain for accessibility in non-themed contexts
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className
      )}
      {...props}
    />
  );
}

export { TextArea };
