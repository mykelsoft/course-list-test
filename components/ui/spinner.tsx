import { Loader2 } from 'lucide-react';
import React from 'react';

import { cn } from '@/lib/utils'; // Utility for conditional classNames if available

type SpinnerProps = {
  size?: number; // Size in pixels, e.g., 24 for 24px
  color?: string; // Tailwind text color class like "text-blue-500"
};

const Spinner: React.FC<SpinnerProps> = ({
  size = 24,
  color = 'text-gray-500',
}) => {
  return (
    <div className="flex items-center justify-center" role="status">
      <Loader2
        className={cn('animate-spin', color)}
        style={{ width: size, height: size }}
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;
