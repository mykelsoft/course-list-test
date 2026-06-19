'use client';

import AddCompanyForm from '@/components/course-list/add-company-form';
import { useRouter } from 'next/navigation';

export default function AddUnitPage() {
  const router = useRouter();

  return (
    <div className='px-4 py-7 md:px-10 md:py-6'>
      <AddCompanyForm onBack={() => router.push('/')} />
    </div>
  );
}
