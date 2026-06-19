'use client';

import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';

import { cn } from '@/lib/utils';

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot='switch'
      className={cn(
        'peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 inline-flex h-6 w-12 md:h-8 md:w-16 shrink-0 items-center rounded-full border-1 border-[var(--gray-300)] shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 bg-red-400',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot='switch-thumb'
        className={cn(
          'border border-[var(--gray-300)] bg-background pointer-events-none block size-4 md:size-6 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[26px] md:data-[state=checked]:translate-x-[34px] data-[state=unchecked]:translate-x-1',
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
