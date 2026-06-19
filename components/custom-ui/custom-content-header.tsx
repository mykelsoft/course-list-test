// components/custom-ui/custom-content-header.tsx

import { APPS } from '#types/ENUMS';
import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import Themes from './styling/Themes';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

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
  descriptionColor = 'text-[var(--gray-600)]',
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
    <div className='flex flex-col gap-2'>
      <div className='flex flex-col md:flex-row gap-6 md:gap-2 md:items-center md:justify-between'>
        <div className='flex flex-col gap-2 items-start justify-between'>
          <div className='flex gap-2 flex-col items-start'>
            {onBack && (
              <button
                type='button'
                onClick={onBack}
                // Apply theme-aware classes for ghost button behavior
                className={cn(
                  'py-2.5 px-4.5 rounded-sm cursor-pointer flex gap-1 items-center font-semibold',
                  theme.button.ghost,
                  buttonTextColor,
                )}
                aria-label='Go back'
              >
                <ArrowLeft className='-mt-px size-[18px] text-[#6D28D9]' />
                <span className='text-sm text-[#6D28D9] font-semibold leading-normal'>Back</span>
              </button>
            )}
            <span className='text-lg leading-none font-semibold text-[var(--gray-800)]'>{title}</span>
          </div>
          <span className={`text-sm leading-normal ${descriptionColor}`}>{description}</span>
        </div>
        <div className='md:flex flex-row gap-2 items-center justify-end'>{headerRight}</div>
      </div>
      {children}
    </div>
  );
};

export default CustomContentHeader;
