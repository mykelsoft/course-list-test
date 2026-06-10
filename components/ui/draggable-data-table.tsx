import type { DragEndEvent } from '@dnd-kit/core';
import { closestCenter, DndContext } from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ColumnDef } from '@tanstack/react-table';
import React, { useEffect, useState } from 'react';

import DraggableTableStyle from '@/assets/draggable-table.module.css';
import type { CustomTablePropsType } from '@/components/ui/data-table';
import { DataTable } from '@/components/ui/data-table';
import { TableRow } from '@/components/ui/table';

export type DraggableTableProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
  onRowReorder: (currentIndex: number, newIndex: number, data: TData[]) => void;
};

type TDataType = { id: string } & Record<string, unknown>;

function DraggableTable<TData extends TDataType>({
  data,
  columns,
  onRowReorder,
}: DraggableTableProps<TData>) {
  const [items, setItems] = useState(data);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      const newData = arrayMove(items, oldIndex, newIndex);
      setItems(newData);
      if (onRowReorder) {
        onRowReorder(oldIndex, newIndex, newData);
      }
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setItems(data);
  }, [data]);

  const columnsWithDragHandle: ColumnDef<TData>[] = [...columns];

  return (
    <DndContext
      key={items.map((item) => item.id).join(',')}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToParentElement]}
    >
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <DataTable<TData>
          data={items}
          columns={columnsWithDragHandle}
          CTableRow={SortableRow}
        />
      </SortableContext>
    </DndContext>
  );
}

function SortableRow<TData extends TDataType>({
  row,
  children,
  ...props
}: CustomTablePropsType<TData>) {
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({ id: row.original.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      {...props}
      className={`${DraggableTableStyle.draggable} ${props.className}`}
    >
      {children}
    </TableRow>
  );
}

export default DraggableTable;
