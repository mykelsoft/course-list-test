// components/custom-ui/custom-content-header.tsx

import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { APPS } from '#types/ENUMS.ts';
import Themes from './styling/Themes';

type CustomContentHeaderProps = {
  title: string;
  description?: string;
  descriptionColor?: string;
  onBack?: () => void;
  children?: ReactNode;
  headerRight?: ReactNode;
  app?: APPS;
};

const CustomContentHeader: React.FC<CustomContentHeaderProps> = ({
  title,
  description,
  descriptionColor = 'text-gray-600',
  onBack,
  children,
  headerRight,
  app = APPS.PORTAL,
}) => {
  // Get theme-specific styles based on the app context
  const theme = useMemo(() => Themes(app), [app]);

  let buttonTextColor;

  switch (app) {
    case APPS.PORTAL:
      buttonTextColor = 'text-primary';
      break;
    case APPS.POLICIES_AND_PROCEDURES:
      buttonTextColor = 'text-[var(--policiesAndProcedures-primary)]';
      break;
    case APPS.FORMS:
      buttonTextColor = 'text-[var(--forms-primary)]';
      break;
    default:
  }
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-2 items-center justify-between">
        <div className="flex flex-col gap-2 items-start justify-between">
          <div className="flex gap-1 flex-col items-start">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                // Apply theme-aware classes for ghost button behavior
                className={cn(
                  'py-3 px-4 rounded-sm cursor-pointer flex gap-2 items-center font-semibold',
                  theme.button.ghost,
                  buttonTextColor
                )}
                aria-label="Go back"
              >
                <ArrowLeft className="size-4.5" />
                <span className="text-sm">Back</span>
              </button>
            )}
            <span className="text-lg font-semibold text-gray-800">{title}</span>
          </div>
          <span className={`text-sm ${descriptionColor}`}>{description}</span>
        </div>
        <div className="flex flex-row gap-2 items-center justify-end">
          {headerRight}
        </div>
      </div>
      {children}
    </div>
  );
};

export default CustomContentHeader;
