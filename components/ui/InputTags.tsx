'use client';

import { Pencil, XIcon } from 'lucide-react';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

type InputTagsProps = Omit<InputProps, 'value' | 'onChange'> & {
  value: string[];
  onChange: React.Dispatch<React.SetStateAction<string[]>>;
  onEditTag?: (newTag: string, index: number) => void;
  onRemoveTag?: (tag: string, index: number) => void;
};

function cn(...classes: (string | undefined | null | boolean)[]): string {
  return classes.filter(Boolean).join(' ');
}

function EditTagForm({
  tag,
  index,
  onEditTag,
  onClose,
}: {
  tag: string;
  index: number;
  onEditTag?: (newTag: string, index: number) => void;
  onClose: () => void;
}) {
  const [editValue, setEditValue] = React.useState(tag);

  const handleSave = () => {
    if (onEditTag) {
      onEditTag(editValue, index);
    }
    onClose();
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        className="w-full rounded border px-2 py-1 text-sm"
      />
      <Button onClick={handleSave} size="sm">
        Save
      </Button>
    </div>
  );
}

const InputTags = ({
  ref,
  className,
  value,
  onChange,
  onEditTag,
  onRemoveTag,
  ...props
}: InputTagsProps & { ref?: React.RefObject<HTMLInputElement | null> }) => {
  const [pendingDataPoint, setPendingDataPoint] = React.useState('');

  React.useEffect(() => {
    if (pendingDataPoint.includes(',')) {
      const newDataPoints = new Set([
        ...value,
        ...pendingDataPoint.split(',').map((chunk) => chunk.trim()),
      ]);
      onChange(Array.from(newDataPoints));
      requestAnimationFrame(() => setPendingDataPoint(''));
    }
  }, [pendingDataPoint, onChange, value]);

  const addPendingDataPoint = () => {
    if (pendingDataPoint) {
      const newDataPoints = new Set([...value, pendingDataPoint]);
      onChange(Array.from(newDataPoints));
      setPendingDataPoint('');
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950',
        className
      )}
    >
      <input
        className="outline-none placeholder:text-neutral-500 dark:placeholder:text-neutral-400"
        value={pendingDataPoint}
        onChange={(e) => setPendingDataPoint(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addPendingDataPoint();
          } else if (
            e.key === 'Backspace' &&
            pendingDataPoint.length === 0 &&
            value.length > 0
          ) {
            e.preventDefault();
            onChange(value.slice(0, -1));
          }
        }}
        {...props}
        ref={ref}
      />
      {/* Wrapping badges in a container with a fixed max height */}
      <div className="w-full max-h-[200px] overflow-y-auto flex flex-col gap-2">
        {value.map((item, index) => (
          <Badge
            key={item}
            variant="secondary"
            className="w-full flex justify-between items-center p-2"
          >
            {item}
            <div className="flex items-center">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-2 h-3 w-3">
                    <Pencil className="w-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56">
                  {/*
                      The onClose callback is provided by the PopoverContent.
                      Here, we wrap our form so that once the user saves, the popover closes.
                    */}
                  <EditTagForm
                    tag={item}
                    index={index}
                    onEditTag={onEditTag}
                    onClose={() => {}}
                  />
                </PopoverContent>
              </Popover>
              <Button
                variant="ghost"
                size="icon"
                className="ml-2 h-3 w-3"
                onClick={() => {
                  if (onRemoveTag) {
                    onRemoveTag(item, index);
                  }
                  // Also remove the tag from the state
                  onChange(value.filter((_, i) => i !== index));
                }}
              >
                <XIcon className="w-3" />
              </Button>
            </div>
          </Badge>
        ))}
      </div>
    </div>
  );
};

InputTags.displayName = 'InputTags';

export { InputTags };
