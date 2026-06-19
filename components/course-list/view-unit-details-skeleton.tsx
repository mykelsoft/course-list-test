import { Skeleton } from '@/components/ui/skeleton';

export default function ViewUnitDetailsSkeleton() {
  return (
    <div className='space-y-8 md:space-y-10'>
      <div className='flex flex-col gap-2'>
        <div className='flex flex-col md:flex-row gap-6 md:gap-2 md:items-center md:justify-between'>
          <div className='flex flex-col gap-2 items-start justify-between'>
            <div className='flex gap-2 flex-col items-start'>
              <Skeleton className='h-9 w-24 rounded-sm' />
              <Skeleton className='h-7 w-72 max-w-full rounded' />
            </div>
            <Skeleton className='h-4 w-full max-w-xl rounded' />
          </div>
          <div className='md:flex flex-row gap-2 items-center justify-end'>
            <Skeleton className='h-10 w-full md:w-[112px] shrink-0 rounded' />
          </div>
        </div>
      </div>

      <div className='rounded-lg border border-[var(--gray-200)] bg-white'>
        <div className='flex items-center justify-between p-4 md:p-6'>
          <Skeleton className='h-9 w-56 max-w-[70%] rounded' />
          <Skeleton className='size-6 shrink-0 rounded' />
        </div>

        <div className='h-px bg-[var(--gray-200)]' />

        <div className='p-4 md:p-6'>
          <div className='space-y-8 md:space-y-12'>
            <div className='space-y-4'>
              <Skeleton className='h-4 w-24 rounded' />
              <Skeleton className='h-4 w-full rounded' />
              <Skeleton className='h-4 w-11/12 rounded' />
              <Skeleton className='h-4 w-4/5 rounded' />
            </div>

            <div className='space-y-4'>
              <Skeleton className='h-4 w-32 rounded' />
              <Skeleton className='h-4 w-28 rounded' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
