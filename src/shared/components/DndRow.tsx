import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string;
}
export const DndRow = ({ ...props }: RowProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: props['data-row-key'],
  });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging
      ? { position: 'relative', zIndex: 10, cursor: 'grabbing', backgroundColor: '#fafafa' }
      : {
          cursor: 'grab',
          backgroundColor: '#fff',
        }),
  };

  return (
    <tr
      {...props}
      className={`${isDragging ? 'ant-table-cell-row-hover' : 'ant-table-cell'}`}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    />
  );
};
