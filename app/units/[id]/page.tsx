'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import type { CourseWithDetails } from '@/types/courses';
import ViewUnitDetails from '@/components/course-list/view-unit-details';
import ViewUnitDetailsSkeleton from '@/components/course-list/view-unit-details-skeleton';
import { courseService } from '@/services/course-service';

export default function ViewUnitPage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<CourseWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const id = Number(params.id);

    if (Number.isNaN(id)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    courseService.fetchCourseById(id).then((data) => {
      if (isMounted) {
        setCourse(data);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [params.id]);

  if (isLoading) {
    return (
      <div className='px-4 py-7 md:px-10 md:py-6'>
        <ViewUnitDetailsSkeleton />
      </div>
    );
  }

  if (!course) {
    return (
      <div className='px-4 py-7 md:px-10 md:py-6'>
        <p className='text-sm text-[var(--gray-600)]'>Unit not found.</p>
      </div>
    );
  }

  return (
    <div className='px-4 py-7 md:px-10 md:py-6'>
      <ViewUnitDetails
        course={course}
        onBack={() => router.push('/')}
        onEdit={() => router.push(`/units/add?id=${course.id}`)}
      />
    </div>
  );
}
