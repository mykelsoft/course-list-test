//
// File: ./components/custom-ui/custom-accordion.tsx
//
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { ReactNode } from 'react';
import React, { useState } from 'react';

import { Separator } from '#components/ui/separator.tsx';

type CustomAccordionProps = {
  title: string | ReactNode;
  description?: string | null | undefined;
  descriptionColor?: string | null | undefined;
  children: ReactNode;
  className?: string;
  defaultExpanded?: boolean;
  footerContent?: ReactNode;
  onToggle?: (isExpanded: boolean) => void;
  headerChildren?: React.ReactNode;
};

const CustomAccordion = ({
  title,
  description,
  descriptionColor = 'text-gray-600',
  children,
  className = '',
  defaultExpanded = true,
  footerContent,
  onToggle,
  headerChildren,
}: CustomAccordionProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleToggle = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    if (onToggle) {
      onToggle(newExpandedState);
    }
  };

  const renderTitle = () => {
    if (typeof title === 'string') {
      return (
        <h2 className="text-base font-semibold text-[var(--text-primary)]">
          {title}
        </h2>
      );
    }
    return title;
  };

  const renderDescription = () => {
    if (typeof description === 'string') {
      return (
        <span className={`text-sm ${descriptionColor}`}>{description}</span>
      );
    }
    return description;
  };

  return (
    <div
      className={`bg-white rounded-lg border border-[var(--table-border)] ${className}`}
    >
      <div
        className="flex items-center justify-between p-6 cursor-pointer"
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
          }
        }}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-label={`Toggle ${typeof title === 'string' ? title : 'accordion'}`}
      >
        {/* Left-aligned group for title and header children */}
        <div className="flex items-center gap-6">
          {!description && renderTitle()}
          {description && (
            <div className="flex flex-col gap-2">
              {renderTitle()}
              {renderDescription()}
            </div>
          )}
          {/* Wrapper to stop click propagation from the button */}
          <div
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            role="presentation" // Add role to indicate it's just for grouping
          >
            {headerChildren}
          </div>
        </div>

        {/* Right-aligned chevron icon */}
        <div className="group p-1 rounded-sm ml-4">
          {isExpanded ? (
            <ChevronUp
              size={28}
              className="text-gray-600 group-hover:text-primary"
            />
          ) : (
            <ChevronDown
              size={28}
              className="text-gray-600 group-hover:text-primary"
            />
          )}
        </div>
      </div>

      <Separator />

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-6 space-y-3">{children}</div>
        {footerContent && (
          <>
            <Separator />
            <div className="p-6 flex justify-end">{footerContent}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default CustomAccordion;
