'use client';

import CustomAccordion from '@/components/custom-ui/custom-accordion';
import CustomButton from '@/components/custom-ui/custom-button';
import CustomContentHeader from '@/components/custom-ui/custom-content-header';
import { getUnitViewData } from '@/lib/unit-view-data';
import { APPS, type CourseWithDetails } from '@/types/courses';
import { Pencil } from 'lucide-react';

type ViewUnitDetailsProps = {
  course: CourseWithDetails;
  onBack: () => void;
  onEdit?: () => void;
};

export default function ViewUnitDetails({ course, onBack, onEdit }: ViewUnitDetailsProps) {
  const { summaryDescription, unitDescription, additionalFiles } = getUnitViewData(course);

  return (
    <div className='space-y-10'>
      <CustomContentHeader
        title={course.name}
        description={summaryDescription}
        onBack={onBack}
        app={APPS.TRAINING}
        headerRight={
          <CustomButton
            title='Edit Unit'
            leadingIcon={<Pencil className='size-3.5' />}
            app={APPS.TRAINING}
            width='w-auto'
            buttonClass='px-4 w-[112px]'
            onClick={onEdit}
          />
        }
      />

      <CustomAccordion title={`Unit 1 Details (${course.unitType})`}>
        <div className='space-y-12'>
          <div className='space-y-4'>
            <p className='text-sm font-medium text-[var(--gray-700)]'>Description</p>
            <p className='text-sm leading-normal text-[var(--gray-600)]'>{unitDescription}</p>
          </div>

          <div className='space-y-4'>
            <p className='text-sm font-medium text-[var(--gray-700)]'>Additional Files</p>
            <div className='flex flex-col gap-1'>
              {additionalFiles.map((file) => (
                <a
                  key={file.name}
                  href={file.url}
                  className='text-sm font-medium leading-normal text-[#FFA600] hover:underline w-fit'
                >
                  {file.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </CustomAccordion>
    </div>
  );
}
