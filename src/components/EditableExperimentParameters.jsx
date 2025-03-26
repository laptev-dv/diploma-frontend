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
  Dialog,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  Popover,
} from "@mui/material";
import {
  Fullscreen as FullscreenIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIndicatorIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { ChromePicker } from "react-color";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
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

function SortableTask({ task, onDelete, onEdit }) {
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
        touchAction: "none",
      }}
      secondaryAction={
        <Stack direction="row" spacing={1}>
          <IconButton edge="end" onClick={() => onEdit(task)}>
            <EditIcon />
          </IconButton>
          <IconButton
            edge="end"
            onClick={() => onDelete(task.id)}
            sx={{ color: "error.main" }}
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      }
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
      <ListItemText
        primary={task.name}
        secondary={`${task.rows}×${task.columns}`}
      />
    </ListItem>
  );
}

function ColorPickerButton({ color, onChange }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (color) => {
    onChange(color.hex);
  };

  const open = Boolean(anchorEl);
  const id = open ? "color-picker-popover" : undefined;

  return (
    <>
      <Avatar
        sx={{
          width: 24,
          height: 24,
          backgroundColor: color,
          border: "1px solid #ccc",
          cursor: "pointer",
        }}
        onClick={handleClick}
      >
        <></>
      </Avatar>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <ChromePicker color={color} onChange={handleChange} />
      </Popover>
    </>
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
  const [editingTask, setEditingTask] = useState(null);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);

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

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskDialogOpen(true);
  };

  const handleSaveTask = () => {
    setTasks(tasks.map((t) => (t.id === editingTask.id ? editingTask : t)));
    setTaskDialogOpen(false);
    setEditingTask(null);
  };

  const handleDragEnd = (event) => {
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
    isLast = false,
    unit = null
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
            unit
              ? {
                  endAdornment: (
                    <InputAdornment position="end">{unit}</InputAdornment>
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
          <ColorPickerButton
            color={color}
            onChange={(newColor) => handleColorChange(field, newColor)}
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

  const renderDualNumberRow = (
    label,
    field1,
    value1,
    label1,
    field2,
    value2,
    label2,
    unit = "пикс",
    isLast = false
  ) => (
    <TableRow
      sx={{ "&:last-child td": { borderBottom: isLast ? 0 : undefined } }}
    >
      <TableCell>{label}</TableCell>
      <TableCell>
        <Stack direction="row" spacing={2}>
          <TextField
            label={label1}
            size="small"
            type="number"
            value={value1}
            onChange={(e) => onParamChange(field1, Number(e.target.value))}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">{unit}</InputAdornment>
              ),
            }}
            sx={{ flex: 1 }}
          />
          <TextField
            label={label2}
            size="small"
            type="number"
            value={value2}
            onChange={(e) => onParamChange(field2, Number(e.target.value))}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">{unit}</InputAdornment>
              ),
            }}
            sx={{ flex: 1 }}
          />
        </Stack>
      </TableCell>
    </TableRow>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Диалог редактирования задачи */}
      <Dialog open={taskDialogOpen} onClose={() => setTaskDialogOpen(false)}>
        <DialogContent>
          <TextField
            label="Название задачи"
            fullWidth
            margin="normal"
            value={editingTask?.name || ""}
            onChange={(e) =>
              setEditingTask({ ...editingTask, name: e.target.value })
            }
          />
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Строки"
              type="number"
              fullWidth
              value={editingTask?.rows || 0}
              onChange={(e) =>
                setEditingTask({ ...editingTask, rows: Number(e.target.value) })
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">шт</InputAdornment>
                ),
              }}
            />
            <TextField
              label="Столбцы"
              type="number"
              fullWidth
              value={editingTask?.columns || 0}
              onChange={(e) =>
                setEditingTask({
                  ...editingTask,
                  columns: Number(e.target.value),
                })
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">шт</InputAdornment>
                ),
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTaskDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleSaveTask} variant="contained">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

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
                    <SortableTask
                      task={task}
                      onDelete={handleDeleteTask}
                      onEdit={handleEditTask}
                    />
                    {tasks.indexOf(task) < tasks.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </SortableContext>
          </DndContext>
        </Box>
      </Paper>

      {/* Блок серии и режима работы */}
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
                    "number",
                    false,
                    "шт"
                  )}
                  {renderEditableRow(
                    "Время на серию",
                    "seriesTime",
                    parameters.seriesTime || 30,
                    "number",
                    false,
                    "сек"
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
                  true,
                  "шт"
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
                    "number",
                    false,
                    "шт"
                  )}
                  {renderEditableRow(
                    "Количество столбцов",
                    "columns",
                    parameters.columns || 4,
                    "number",
                    false,
                    "шт"
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
                  {renderDualNumberRow(
                    "Размер символа",
                    "symbolWidth",
                    parameters.symbolWidth || 30,
                    "ширина",
                    "symbolHeight",
                    parameters.symbolHeight || 30,
                    "высота"
                  )}
                  {renderDualNumberRow(
                    "Отступы",
                    "horizontalPadding",
                    parameters.horizontalPadding || 5,
                    "по горизонтали",
                    "verticalPadding",
                    parameters.verticalPadding || 5,
                    "по вертикали"
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
