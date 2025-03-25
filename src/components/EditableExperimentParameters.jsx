import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Stack,
  Button,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Dialog,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Avatar,
} from "@mui/material";
import {
  Fullscreen as FullscreenIcon,
  Colorize as ColorizeIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIndicatorIcon,
} from "@mui/icons-material";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TimeParameters from "./TimeParameters";
import StimulusPreview from "./StimulusPreview";

function SortableTask({ task, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

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
        backgroundColor: isDragging ? "action.hover" : "background.paper",
        "&:hover": {
          backgroundColor: "action.hover",
        },
        touchAction: "none", // Important for mobile drag
      }}
    >
      <Avatar
        sx={{
          bgcolor: "grey.300",
          mr: 2,
          cursor: isDragging ? "grabbing" : "grab",
        }}
        {...attributes}
        {...listeners}
      >
        <DragIndicatorIcon color="action" />
      </Avatar>
      <ListItemText primary={task.name} />
      <ListItemSecondaryAction>
        <IconButton
          edge="end"
          onClick={() => onDelete(task.id)}
          sx={{ color: "error.main" }}
        >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

function EditableExperimentParameters({ parameters, onParamChange }) {
  const [mode, setMode] = useState("adaptive");
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [tasks, setTasks] = useState([
    { id: "1", name: "Задача 2×2", rows: 2, columns: 2 },
    { id: "2", name: "Задача 3×3", rows: 3, columns: 3 },
    { id: "3", name: "Задача 4×4", rows: 4, columns: 4 },
  ]);
  const [newTaskName, setNewTaskName] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleModeChange = (event) => {
    const newMode = event.target.value;
    setMode(newMode);
    onParamChange("mode", newMode);
  };

  const handleFullscreenOpen = () => {
    setFullscreenOpen(true);
  };

  const handleFullscreenClose = () => {
    setFullscreenOpen(false);
  };

  const handleColorChange = (field, color) => {
    onParamChange(field, color);
  };

  const handleAddTask = () => {
    if (newTaskName.trim()) {
      const newTask = {
        id: Date.now().toString(),
        name: newTaskName,
        rows: 4,
        columns: 4,
      };
      setTasks([...tasks, newTask]);
      setNewTaskName("");
    }
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setTasks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const renderEditableRow = (
    label,
    field,
    value,
    type = "text",
    isLast = false
  ) => (
    <TableRow
      sx={{ "&:last-child td": { borderBottom: isLast ? 0 : undefined } }}
    >
      <TableCell>{label}</TableCell>
      <TableCell>
        <TextField
          size="small"
          fullWidth
          type={type}
          value={value}
          onChange={(e) =>
            onParamChange(
              field,
              type === "number" ? Number(e.target.value) : e.target.value
            )
          }
          InputProps={
            type === "number"
              ? {
                  endAdornment: (
                    <InputAdornment position="end">
                      {label.includes("эффективности") ? "" : "пикс"}
                    </InputAdornment>
                  ),
                }
              : {}
          }
        />
      </TableCell>
    </TableRow>
  );

  const renderColorRow = (label, field, color, isLast = false) => (
    <TableRow
      sx={{ "&:last-child td": { borderBottom: isLast ? 0 : undefined } }}
    >
      <TableCell>{label}</TableCell>
      <TableCell>
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton
            size="small"
            onClick={() => {
              const newColor = prompt("Введите цвет в HEX формате", color);
              if (newColor) handleColorChange(field, newColor);
            }}
          >
            <ColorizeIcon />
          </IconButton>
          <Chip
            sx={{
              backgroundColor: color,
              width: 24,
              height: 24,
              border: "1px solid #ccc",
            }}
          />
          <TextField
            size="small"
            value={color}
            onChange={(e) => handleColorChange(field, e.target.value)}
            sx={{ width: 100 }}
          />
        </Stack>
      </TableCell>
    </TableRow>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Диалог полноэкранного просмотра */}
      <Dialog
        fullScreen
        open={fullscreenOpen}
        onClose={handleFullscreenClose}
        PaperProps={{
          sx: {
            backgroundColor: parameters.backgroundColor,
          },
        }}
      >
        <DialogActions>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleFullscreenClose}
            aria-label="close"
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "common.white",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogActions>
        <DialogContent
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <StimulusPreview parameters={parameters} />
        </DialogContent>
      </Dialog>

      {/* Блок задач */}
      <Paper elevation={3}>
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Задачи
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              size="small"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              placeholder="Название новой задачи"
              sx={{ flexGrow: 1 }}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddTask}
            >
              Добавить
            </Button>
          </Box>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={tasks}
              strategy={verticalListSortingStrategy}
            >
              <List dense>
                {tasks.map((task) => (
                  <React.Fragment key={task.id}>
                    <SortableTask task={task} onDelete={handleDeleteTask} />
                    {tasks.indexOf(task) < tasks.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </SortableContext>
          </DndContext>
        </Box>
      </Paper>

      {/* Остальные блоки остаются без изменений */}
      <Paper elevation={3}>
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Серия и режим работы
          </Typography>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Режим</TableCell>
                <TableCell>
                  <Select
                    value={mode}
                    onChange={handleModeChange}
                    size="small"
                    fullWidth
                  >
                    <MenuItem value="adaptive">Адаптивный</MenuItem>
                    <MenuItem value="strict">Жесткий</MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
              {mode === "adaptive" && (
                <>
                  {renderEditableRow(
                    "Количество предъявлений в задаче",
                    "presentationsPerTask",
                    parameters.presentationsPerTask || 20,
                    "number"
                  )}
                  {renderEditableRow(
                    "Время на серию (с)",
                    "seriesTime",
                    parameters.seriesTime || 30,
                    "number"
                  )}
                  {renderEditableRow(
                    "Нижняя граница эффективности",
                    "efficiencyMin",
                    parameters.efficiencyMin || 0.5,
                    "number"
                  )}
                  {renderEditableRow(
                    "Верхняя граница эффективности",
                    "efficiencyMax",
                    parameters.efficiencyMax || 0.8,
                    true
                  )}
                </>
              )}
              {mode === "strict" &&
                renderEditableRow(
                  "Количество предъявлений в задаче",
                  "presentationsPerTaskStrict",
                  parameters.presentationsPerTaskStrict || 20,
                  "number",
                  true
                )}
            </TableBody>
          </Table>
        </Box>
      </Paper>

      <Box sx={{ display: "flex", gap: 3 }}>
        <Box
          sx={{
            width: "50%",
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <Paper elevation={3}>
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Общие параметры
              </Typography>
              <Table>
                <TableBody>
                  {renderEditableRow(
                    "Количество строк",
                    "rows",
                    parameters.rows || 4,
                    "number"
                  )}
                  {renderEditableRow(
                    "Количество столбцов",
                    "columns",
                    parameters.columns || 4,
                    "number"
                  )}
                  {renderColorRow(
                    "Цвет фона",
                    "backgroundColor",
                    parameters.backgroundColor,
                    true
                  )}
                </TableBody>
              </Table>
            </Box>
          </Paper>

          <Paper elevation={3}>
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Параметры символа
              </Typography>
              <Table>
                <TableBody>
                  {renderEditableRow(
                    "Вид символа",
                    "symbolType",
                    parameters.symbolType
                  )}
                  {renderEditableRow(
                    "Шрифт символа",
                    "symbolFont",
                    parameters.symbolFont
                  )}
                  {renderEditableRow(
                    "Размер символа",
                    "symbolSize",
                    parameters.symbolSize,
                    "number"
                  )}
                  {renderEditableRow(
                    "Горизонтальный отступ",
                    "horizontalPadding",
                    parameters.horizontalPadding || 5,
                    "number"
                  )}
                  {renderEditableRow(
                    "Вертикальный отступ",
                    "verticalPadding",
                    parameters.verticalPadding || 5,
                    "number"
                  )}
                  {renderColorRow(
                    "Цвет символа",
                    "symbolColor",
                    parameters.symbolColor,
                    true
                  )}
                </TableBody>
              </Table>
            </Box>
          </Paper>
        </Box>

        <Paper
          elevation={3}
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box",
            width: "50%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="subtitle1" gutterBottom>
              Предпросмотр
            </Typography>
            <Button
              startIcon={<FullscreenIcon />}
              size="small"
              onClick={handleFullscreenOpen}
            >
              Полный экран
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              position: "relative",
              overflow: "hidden",
              backgroundColor: parameters.backgroundColor,
              borderRadius: "4px",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <StimulusPreview parameters={parameters} />
          </Box>
        </Paper>
      </Box>

      <TimeParameters
        parameters={{
          stimulusTime: parameters.stimulusTime,
          responseTime: parameters.responseTime,
          pauseTime: parameters.pauseTime,
        }}
        onParamChange={onParamChange}
      />
    </Box>
  );
}

export default EditableExperimentParameters;
