'use client';

import { ChevronLeft } from 'lucide-react';
import React from 'react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';

type Props = {
  showHeader?: boolean;
  header: string;
  subHeader: string;
  children: React.ReactNode;
  onBackClick?: () => void;
};

const CustomCard: React.FC<Props> = ({
  header,
  subHeader,
  children,
  onBackClick,
  showHeader = true,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        {showHeader && (
          <CardHeader className="border-b text-xl pb-4">
            <div className="flex flex-row items-center gap-2">
              {onBackClick && (
                <button
                  className="text-muted-foreground cursor-pointer"
                  type="button"
                  onClick={onBackClick}
                  aria-label="Go back"
                >
                  <ChevronLeft className="font-semibold" />
                </button>
              )}
              {/* CHANGED: span -> h1 for accessibility and testing */}
              <h1 className="font-semibold text-xl">{header}</h1>
            </div>
            <p className="text-base ">{subHeader}</p>
          </CardHeader>
        )}
        <CardContent className="">{children}</CardContent>
      </Card>
    </div>
  );
};

export default CustomCard;
