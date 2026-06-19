'use client';

import React from 'react';

import { cn } from '@/lib/utils';

type ExpandableTextValueProps = {
  value: string | number;
  maxLines?: number;
  disabled?: boolean;
  color?: string;
};

export function ExpandableTextValue({
  value,
  maxLines = 1,
  disabled = false,
  color,
}: ExpandableTextValueProps) {
  const textRef = React.useRef<HTMLParagraphElement>(null);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isTruncated, setIsTruncated] = React.useState(false);

  React.useEffect(() => {
    const checkTruncation = () => {
      if (textRef.current) {
        const element = textRef.current;
        setIsTruncated(element.scrollHeight > element.clientHeight);
      }
    };

    checkTruncation();
    window.addEventListener('resize', checkTruncation);
    return () => window.removeEventListener('resize', checkTruncation);
  }, [value, maxLines]);

  const lineClampClass = !isExpanded
    ? maxLines === 1
      ? 'line-clamp-1'
      : maxLines === 2
        ? 'line-clamp-2'
        : maxLines === 3
          ? 'line-clamp-3'
          : 'line-clamp-1'
    : '';

  return (
    <div className='flex w-full flex-col items-start'>
      <div className='flex w-full flex-wrap items-start gap-0'>
        <p
          ref={textRef}
          className={cn(
            'break-words text-sm font-normal leading-[1.5]',
            disabled ? 'text-[#959BA4]' : 'text-[#4b5563]',
            lineClampClass,
          )}
        >
          {value}
        </p>
        {(isTruncated || isExpanded) && (
          <button
            type='button'
            onClick={() => setIsExpanded(!isExpanded)}
            className='cursor-pointer border-none bg-transparent p-0 text-sm font-normal leading-[1.5] whitespace-nowrap hover:underline'
            style={{ color: color || 'var(--primary)' }}
          >
            {isExpanded ? 'see less' : 'see more'}
          </button>
        )}
      </div>
    </div>
  );
}
