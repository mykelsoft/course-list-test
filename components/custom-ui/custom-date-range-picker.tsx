'use client';

import * as React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import type { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import CustomButton from '@/components/custom-ui/custom-button';
import { BUTTON_VARIANTS } from '#components/custom-ui/button-variants.ts';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Glowing } from '#components/custom-ui/styling/glowing.ts';
import { APPS } from '#types/ENUMS.ts';

type CustomDateRangePickerProps = React.HTMLAttributes<HTMLDivElement> & {
  app?: APPS;
  date: DateRange | undefined;
  onDateChange: (date: DateRange | undefined) => void;
};

export function CustomDateRangePicker({
  app = APPS.PORTAL,
  className,
  date,
  onDateChange,
}: CustomDateRangePickerProps) {
  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <CustomButton
            variant={BUTTON_VARIANTS.OUTLINE}
            className={`${Glowing(app).dropdown}`}
            title="Date Range"
            leadingIcon={<CalendarIcon size={14} />}
          />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-1.5 bg-[#F9FAFB]" align="start">
          <Card className="p-0 rounded-md ">
            <Calendar
              // initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={onDateChange}
              numberOfMonths={2}
            />
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  );
}
