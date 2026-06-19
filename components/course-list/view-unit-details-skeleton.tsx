import { Skeleton } from '@/components/ui/skeleton';

export default function ViewUnitDetailsSkeleton() {
  return (
    <div className='space-y-10'>
      <div className='flex flex-col gap-2'>
        <div className='flex flex-row items-center justify-between'>
          <div className='flex flex-col gap-2 items-start'>
            <Skeleton className='h-9 w-24 rounded-sm' />
            <Skeleton className='h-6 w-72 max-w-full rounded' />
            <Skeleton className='h-4 w-full max-w-xl rounded' />
            <Skeleton className='h-4 w-4/5 max-w-lg rounded' />
          </div>
          <Skeleton className='h-10 w-[112px] shrink-0 rounded' />
        </div>
      </div>

      <div className='rounded-lg border border-[var(--gray-200)] bg-white'>
        <div className='flex items-center justify-between p-6'>
          <Skeleton className='h-5 w-56 max-w-[70%] rounded' />
          <Skeleton className='size-6 shrink-0 rounded' />
        </div>

        <div className='h-px bg-[var(--gray-200)]' />

        <div className='space-y-12 p-6'>
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
  );
}
