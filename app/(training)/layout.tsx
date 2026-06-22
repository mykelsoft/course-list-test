import { TrainingLayout } from '@/components/training/training-layout';

export default function TrainingRouteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <TrainingLayout>{children}</TrainingLayout>;
}
