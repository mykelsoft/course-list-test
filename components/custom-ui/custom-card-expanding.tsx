// File: ./components/custom-ui/custom-card-expanding.tsx
import { ChevronDown, ChevronUp } from 'lucide-react';
import React from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '#components/ui/card.tsx';
import { Separator } from '#components/ui/separator.tsx';
import { cn } from '@/lib/utils';
import { APPS } from '#types/ENUMS.ts';

type CustomCardExpandingProps = {
  children: React.ReactNode;
  header?: React.ReactNode;
  headerChildren?: React.ReactNode | null;
  isExpanding?: boolean;
  isCollapsible?: boolean; // New prop to control collapsibility
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  hasSeparator?: boolean;
  app?: APPS;
  contentClassName?: string;
};

const CustomCardExpanding: React.FC<CustomCardExpandingProps> = ({
  children,
  header,
  headerChildren = null,
  isExpanding = true,
  isCollapsible = true, // Default to true to maintain existing behavior
  expanded: controlledExpanded,
  defaultExpanded = true,
  onExpandedChange,
  hasSeparator = true,
  app = APPS.PORTAL,
  contentClassName,
}) => {
  const [internalExpanded, setInternalExpanded] =
    React.useState(defaultExpanded);
  const isControlled = controlledExpanded !== undefined;
  const isExpanded = isControlled ? controlledExpanded : internalExpanded;

  const handleToggle = () => {
    if (!isCollapsible) return; // Do nothing if not collapsible

    const newExpandedState = !isExpanded;
    if (onExpandedChange) {
      onExpandedChange(newExpandedState);
    }
    if (!isControlled) {
      setInternalExpanded(newExpandedState);
    }
  };

  // --- THIS IS THE FIX (PART 1) ---
  // Define hover classes for the wrapper div itself
  const hoverBgClassForWrapper =
    app === APPS.POLICIES_AND_PROCEDURES
      ? 'hover:bg-[var(--policiesAndProcedures-highlight)]'
      : 'hover:bg-secondary';

  // Define hover classes for child elements (the icon)
  const hoverTextClassForChild =
    app === APPS.POLICIES_AND_PROCEDURES
      ? 'group-hover:text-[var(--policiesAndProcedures-primary)]'
      : 'group-hover:text-primary';
  // --- END FIX ---

  return (
    <Card className="rounded-sm text-base font-semibold shadow-none border-[#E5E7EB]">
      <CardHeader
        className={`text-[#374151] h-10 flex justify-center ${headerChildren ? '-my-1' : '-my-1'}`}
      >
        <CardTitle>
          <div className="flex flex-row items-center justify-between">
            <div className=" flex flex-row items-center gap-8 text-[#374151] font-semibold flex-1">
              {header && (
                <div
                  className={`${headerChildren ? 'w-[175px]' : ''} flex flex-row items-center gap-2 flex-1`}
                >
                  {header}
                </div>
              )}
              {headerChildren}
            </div>
            {isExpanding && isCollapsible && (
              // --- THIS IS THE FIX (PART 2) ---
              // The wrapper div gets `group` for its children and the direct hover class for its own background.
              <div
                className={cn(
                  'group p-1 rounded-sm ml-4 transition-colors cursor-pointer',
                  hoverBgClassForWrapper
                )}
                onClick={handleToggle}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleToggle();
                }}
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
              >
                {isExpanded ? (
                  <ChevronUp
                    size={24}
                    className={cn('text-gray-400', hoverTextClassForChild)}
                  />
                ) : (
                  <ChevronDown
                    size={24}
                    className={cn('text-gray-400', hoverTextClassForChild)}
                  />
                )}
              </div>
              // --- END FIX ---
            )}
          </div>
        </CardTitle>
      </CardHeader>
      {(isExpanded || !isCollapsible) && (
        <>
          {hasSeparator && <Separator className="w-full" />}
          <CardContent className={contentClassName}>{children}</CardContent>
        </>
      )}
    </Card>
  );
};

export default CustomCardExpanding;
