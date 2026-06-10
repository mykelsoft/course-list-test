import React from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '#components/ui/card.tsx';
import { Separator } from '#components/ui/separator.tsx';

type CustomCardFixedProps = {
  children: React.ReactNode;
  header?: string;
  headerChildren?: React.ReactNode | null;
};

const CustomCardFixed: React.FC<CustomCardFixedProps> = ({
  children,
  header,
  headerChildren = null,
}) => {
  return (
    <Card className="rounded-sm text-base font-semibold shadow-none border-[#E5E7EB]">
      {header && (
        <>
          <CardHeader
            className={`text-[#374151] ${headerChildren ? '-my-1' : '-my-1'}`}
          >
            <CardTitle>
              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row items-center gap-8">
                  <div
                    className={`${headerChildren ? 'w-[175px]' : ''} flex flex-row items-center gap-2`}
                  >
                    {header}
                  </div>
                  {headerChildren}
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <Separator className="w-full" />
        </>
      )}
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default CustomCardFixed;
