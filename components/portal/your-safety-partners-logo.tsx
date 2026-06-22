import Image from 'next/image';
import { cn } from '@/lib/utils';

type YourSafetyPartnersLogoProps = {
  className?: string;
};

export function YourSafetyPartnersLogo({ className }: YourSafetyPartnersLogoProps) {
  return (
    <Image
      src='/your-safety-partners-logo.png'
      alt='your safety partners'
      width={114}
      height={64}
      priority
      className={cn('mx-auto h-16 w-[114px] object-contain', className)}
    />
  );
}
