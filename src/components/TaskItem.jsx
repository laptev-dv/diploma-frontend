import React, { useState, useEffect } from "react";
import {
  ListItem,
  ListItemText,
  Avatar,
  IconButton,
  Stack,
  Tooltip,
  TextField,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  DragIndicator as DragIndicatorIcon,
  ContentCopy as CopyIcon,
} from "@mui/icons-material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function TaskItem({
  task,
  onDelete,
  onCopy,
  isActive,
  onClick,
  isDeleteDisabled,
  onTaskNameChange, // Добавляем новый пропс для обновления имени
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const [taskName, setTaskName] = useState(task.name);

  // Синхронизируем локальное состояние с пропсами
  useEffect(() => {
    setTaskName(task.name);
  }, [task.name]);

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setTaskName(newName);
    if (onTaskNameChange) {
      onTaskNameChange(task.id, newName);
    }
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : "auto",
  };
  
  return (
    <ListItem
      ref={setNodeRef}
      style={style}
      sx={{
        backgroundColor: isActive
          ? "primary.light"
          : isDragging
          ? "action.hover"
          : "background.paper",
        "&:hover": {
          backgroundColor: isActive ? "primary.light" : "action.hover",
        },
        touchAction: "none",
        cursor: "pointer",
        alignItems: "flex-start",
      }}
      onClick={onClick}
      secondaryAction={
        <Stack direction="row" spacing={1}>
          <Tooltip title="Копировать задачу">
            <IconButton
              edge="end"
              onClick={(e) => {
                e.stopPropagation();
                onCopy(task.id);
              }}
            >
              <CopyIcon />
            </IconButton>
          </Tooltip>
          <Tooltip
            title={
              isDeleteDisabled
                ? "Нельзя удалить последнюю задачу"
                : "Удалить задачу"
            }
          >
            <IconButton
              edge="end"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
              sx={{ color: "error.main" }}
              disabled={isDeleteDisabled}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      }
    >
      <Avatar
        sx={{
          bgcolor: "grey.300",
          mr: 2,
          cursor: isDragging ? "grabbing" : "grab",
          mt: 1,
        }}
        {...attributes}
        {...listeners}
      >
        <DragIndicatorIcon color="action" />
      </Avatar>
      <Stack direction="column" sx={{ width: '50%' }}>
        <TextField
          variant="standard"
          value={taskName}
          onChange={handleNameChange} // Используем новую функцию обработки
          size="small"
          onClick={(e) => e.stopPropagation()}
          sx={{
            mb: 0.5,
            overflow: "visible",
          }}
        />
        <ListItemText
          secondary={`${task.parameters.rows}×${task.parameters.columns}`}
          sx={{ mt: 0 }}
        />
      </Stack>
    </ListItem>
  );
}