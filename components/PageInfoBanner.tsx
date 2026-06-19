// File: components/PageInfoBanner.tsx
'use client';

import React from 'react';
import { cn } from '@/lib/utils';
interface PageInfoBannerProps {
  title: string;
  subtitle: string;
  className?: string;
}
export default function PageInfoBanner({
  title,
  subtitle,
  className,
}: PageInfoBannerProps) {
  return (
    <div className={cn('flex items-start gap-1 rounded-l text-sm flex-col mb-6 md:mb-8 space-y-1', className)}>
      <p className='font-semibold text-[var(--gray-800)] text-lg leading-none'>{title}</p>
      <p className='text-[var(--gray-500)] text-sm leading-normal'>{subtitle}</p>
    </div>
  );
}

