'use client';

import CustomAccordion from '@/components/custom-ui/custom-accordion';
import { Switch } from '@/components/ui/switch';
import { Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';

type UnitDetailsSectionProps = {
  title: string;
  children: ReactNode;
  showToggle?: boolean;
  enabled?: boolean;
  onEnabledChange?: (enabled: boolean) => void;
  onDelete?: () => void;
  showDelete?: boolean;
  defaultExpanded?: boolean;
};

function SectionTrashButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type='button'
      onClick={onClick}
      className='rounded-sm p-1 text-[var(--gray-700)] hover:text-primary'
      aria-label='Remove section'
    >
      <Trash2 className='size-5' />
    </button>
  );
}

export default function UnitDetailsSection({
  title,
  children,
  showToggle = false,
  enabled = true,
  onEnabledChange,
  onDelete,
  showDelete = true,
  defaultExpanded = true,
}: UnitDetailsSectionProps) {
  const headerActions = (
    <div className='flex items-center gap-2'>
      {showToggle && (
        <Switch
          checked={enabled}
          onCheckedChange={onEnabledChange}
          className='data-[state=checked]:bg-[#FFA600]'
        />
      )}
      {showDelete && <SectionTrashButton onClick={onDelete} />}
    </div>
  );

  return (
    <CustomAccordion title={title} headerActions={headerActions} defaultExpanded={defaultExpanded}>
      {enabled ? children : (
        <p className='text-sm text-[var(--gray-600)]'>This section is disabled.</p>
      )}
    </CustomAccordion>
  );
}
