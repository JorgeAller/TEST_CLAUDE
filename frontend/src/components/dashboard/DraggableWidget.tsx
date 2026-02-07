import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box, IconButton } from '@mui/material';
import { DragIndicator as DragIndicatorIcon } from '@mui/icons-material';

interface DraggableWidgetProps {
  id: string;
  children: React.ReactNode;
}

export function DraggableWidget({ id, children }: DraggableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative' as const,
  };

  return (
    <Box ref={setNodeRef} style={style} sx={{ mb: 4 }}>
      <IconButton
        {...attributes}
        {...listeners}
        size="small"
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 10,
          cursor: 'grab',
          opacity: 0.4,
          '&:hover': { opacity: 1 },
          '&:active': { cursor: 'grabbing' },
        }}
      >
        <DragIndicatorIcon fontSize="small" />
      </IconButton>
      {children}
    </Box>
  );
}
