import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        // UPDATED FOCUS SHADOW AND PLACEHOLDER STYLES:
        // border-primary on focus
        // subtle box-shadow with the primary color (hex #6D28D9 with 30% opacity via #6D28D94D)
        // placeholder animation
        'focus-visible:border-primary focus-visible:shadow-[0_0_8px_#6D28D94D] placeholder:opacity-100 focus:placeholder:opacity-0 placeholder:transition-opacity placeholder:duration-300',
        'aria-invalid:border-destructive focus-visible:aria-invalid:shadow-[0_0_8px_theme(colors.destructive/40)]', // Keep destructive state distinct
        className
      )}
      {...props}
    />
  );
}

export { Input };
