import type { ReactNode } from 'react';
import React from 'react';

import Spinner from '@/components/ui/spinner';

type LoadingSpinnerProps = {
  loading: boolean;
  children?: ReactNode;
};

const CustomLoadingIndicator: React.FC<LoadingSpinnerProps> = ({
  loading,
  children,
}) => {
  return loading ? (
    <div className="fixed inset-0 bg-background/70 backdrop-blur-xs flex items-center justify-center z-50">
      <Spinner size={48} color="text-primary" />
    </div>
  ) : (
    <>{children}</>
  );
};

export default CustomLoadingIndicator;
