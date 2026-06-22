'use client';

import AddJobRoleForm from '@/components/course-list/add-job-role-form';
import { useRouter } from 'next/navigation';

export default function AddJobRolePage() {
  const router = useRouter();

  return (
    <div className='px-4 py-7 md:px-10 md:py-6'>
      <AddJobRoleForm onBack={() => router.push('/')} />
    </div>
  );
}
