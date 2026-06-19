'use client';

import { useRouter } from 'next/navigation';

import AddUnitForm from '@/components/course-list/add-unit-form';

export default function AddUnitPage() {
  const router = useRouter();

  return (
    <div className='px-4 py-7 md:px-10 md:py-6'>
      <AddUnitForm onBack={() => router.push('/')} />
    </div>
  );
}
