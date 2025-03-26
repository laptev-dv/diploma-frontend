import React, { useState, useEffect } from "react";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Stack,
  TextField,
  Typography,
  Tooltip
} from "@mui/material";
import {
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  DragIndicator as DragIndicatorIcon,
} from "@mui/icons-material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function TaskItemMinimal({
  task,
  onDelete,
  onCopy,
  isActive,
  onClick,
  isDeleteDisabled,
  onTaskNameChange
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id });

  const [taskName, setTaskName] = useState(task.name);

  useEffect(() => {
    setTaskName(task.name);
  }, [task.name]);

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setTaskName(newName);
    onTaskNameChange(task.id, newName);
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : "auto"
  };

  return (
    <ListItem
      ref={setNodeRef}
      style={style}
      sx={{
        px: 1,
        py: 0.5,
        borderLeft: isActive ? "3px solid" : "none",
        borderColor: "primary.main",
        backgroundColor: isActive ? "action.selected" : "transparent",
        "&:hover": {
          backgroundColor: "action.hover"
        },
        cursor: "pointer"
      }}
      onClick={onClick}
      secondaryAction={
        <Stack direction="row" spacing={0}>
          <Tooltip title="Копировать задачу">
            <IconButton
              edge="end"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onCopy(task.id);
              }}
            >
              <CopyIcon fontSize="small" />
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
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
              sx={{ color: "error.main" }}
              disabled={isDeleteDisabled}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      }
    >
      <ListItemIcon
        sx={{ minWidth: 32, cursor: isDragging ? "grabbing" : "grab" }}
        {...attributes}
        {...listeners}
      >
        <DragIndicatorIcon color="action" />
      </ListItemIcon>
      <ListItemText
        primary={
          <TextField
            variant="outlined"
            size='small'
            value={taskName}
            onChange={handleNameChange}
            onClick={(e) => e.stopPropagation()}
          />
        }
        secondary={
          <Typography variant="caption" color="text.secondary">
            {`${task.parameters.rows}×${task.parameters.columns}`}
          </Typography>
        }
        sx={{ my: 0 }}
      />
    </ListItem>
  );
}