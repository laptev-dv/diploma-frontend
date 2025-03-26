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
  Divider,
  Popover,
  Chip,
} from "@mui/material";
import {
  Fullscreen as FullscreenIcon,
  Close as CloseIcon,
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
} from "@dnd-kit/sortable";
import EditableTimeParameters from "./EditableTimeParameters";
import StimulusPreview from "./StimulusPreview";
import TaskItem from "./TaskItem";
import FontSelect from "./FontSelect";
import AsciiSymbolSelect from "./AsciiSymbolSelect";

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
      <Chip
        sx={{
          width: 24,
          height: 24,
          backgroundColor: color,
          border: "1px solid #ccc",
          cursor: "pointer",
        }}
        onClick={handleClick}
      />
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

function EditableExperimentParameters({
  tasks: initialTasks = [],
  onTasksChange,
}) {
  const [tasks, setTasks] = useState(
    initialTasks.length > 0
      ? initialTasks
      : [
          {
            id: Date.now().toString(),
            name: "Задача 4×4",
            parameters: {
              mode: "adaptive",
              rows: 4,
              columns: 4,
              backgroundColor: "#ffffff",
              symbolType: "X",
              symbolFont: "Arial",
              symbolWidth: 30,
              symbolHeight: 30,
              horizontalPadding: 5,
              verticalPadding: 5,
              symbolColor: "#000000",
              presentationsPerTask: 20,
              seriesTime: 30,
              efficiencyMin: 0.5,
              efficiencyMax: 0.8,
              stimulusTime: 500,
              responseTime: 1000,
              pauseTime: 300,
            },
          },
        ]
  );

  const [activeTaskId, setActiveTaskId] = useState(tasks[0]?.id || null);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);

  const activeTask = tasks.find((task) => task.id === activeTaskId);
  const activeParameters = activeTask?.parameters || {};

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleTaskClick = (taskId) => {
    setActiveTaskId(taskId);
  };

  const handleParamChange = (field, value) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === activeTaskId) {
        return {
          ...task,
          parameters: {
            ...task.parameters,
            [field]: value,
          },
        };
      }
      return task;
    });

    setTasks(updatedTasks);
    onTasksChange(updatedTasks);
  };

  const handleTaskNameChange = (taskId, newName) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          name: newName,
        };
      }
      return task;
    });

    setTasks(updatedTasks);
    onTasksChange(updatedTasks);
  };

  const handleModeChange = (event) => {
    const newMode = event.target.value;
    handleParamChange("mode", newMode);
  };

  const handleFullscreenOpen = () => {
    setFullscreenOpen(true);
  };

  const handleFullscreenClose = () => {
    setFullscreenOpen(false);
  };

  const handleColorChange = (field, color) => {
    handleParamChange(field, color);
  };

  const handleDeleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);

    if (activeTaskId === id) {
      setActiveTaskId(updatedTasks[0]?.id || null);
    }

    onTasksChange(updatedTasks);
  };

  const handleCopyTask = (taskId) => {
    const taskIndex = tasks.findIndex((task) => task.id === taskId);
    if (taskIndex >= 0) {
      const taskToCopy = tasks[taskIndex];
      const newTask = {
        ...taskToCopy,
        id: Date.now().toString(),
        name: `${taskToCopy.name} (копия)`,
      };
      const updatedTasks = [
        ...tasks.slice(0, taskIndex + 1),
        newTask,
        ...tasks.slice(taskIndex + 1),
      ];
      setTasks(updatedTasks);
      setActiveTaskId(newTask.id);
      onTasksChange(updatedTasks);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setTasks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        onTasksChange(newItems);
        return newItems;
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
            handleParamChange(
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
            onChange={(e) => handleParamChange(field1, Number(e.target.value))}
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
            onChange={(e) => handleParamChange(field2, Number(e.target.value))}
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

  if (!activeTask) {
    return <Typography>Нет активных задач</Typography>;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Dialog
        fullScreen
        open={fullscreenOpen}
        onClose={handleFullscreenClose}
        PaperProps={{
          sx: {
            backgroundColor: activeParameters.backgroundColor,
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
          <StimulusPreview parameters={activeParameters} />
        </DialogContent>
      </Dialog>

      <Paper elevation={3}>
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Задачи
          </Typography>

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
                    <TaskItem
                      task={task}
                      onDelete={handleDeleteTask}
                      onCopy={handleCopyTask}
                      isActive={activeTaskId === task.id}
                      onClick={() => handleTaskClick(task.id)}
                      isDeleteDisabled={tasks.length <= 1}
                      onTaskNameChange={handleTaskNameChange}
                    />
                    {tasks.indexOf(task) < tasks.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </SortableContext>
          </DndContext>
        </Box>
      </Paper>

      {activeTask && (
        <>
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
                        value={activeParameters.mode || "adaptive"}
                        onChange={handleModeChange}
                        size="small"
                        fullWidth
                      >
                        <MenuItem value="adaptive">Адаптивный</MenuItem>
                        <MenuItem value="strict">Жесткий</MenuItem>
                      </Select>
                    </TableCell>
                  </TableRow>
                  {activeParameters.mode === "adaptive" && (
                    <>
                      {renderEditableRow(
                        "Количество предъявлений в задаче",
                        "presentationsPerTask",
                        activeParameters.presentationsPerTask || 20,
                        "number",
                        false,
                        "шт"
                      )}
                      {renderEditableRow(
                        "Время на серию",
                        "seriesTime",
                        activeParameters.seriesTime || 30,
                        "number",
                        false,
                        "сек"
                      )}
                      {renderEditableRow(
                        "Нижняя граница эффективности",
                        "efficiencyMin",
                        activeParameters.efficiencyMin || 0.5,
                        "number"
                      )}
                      {renderEditableRow(
                        "Верхняя граница эффективности",
                        "efficiencyMax",
                        activeParameters.efficiencyMax || 0.8,
                        "number",
                        true
                      )}
                    </>
                  )}
                  {activeParameters.mode === "strict" &&
                    renderEditableRow(
                      "Количество предъявлений в задаче",
                      "presentationsPerTaskStrict",
                      activeParameters.presentationsPerTaskStrict || 20,
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
                        activeParameters.rows || 4,
                        "number",
                        false,
                        "шт"
                      )}
                      {renderEditableRow(
                        "Количество столбцов",
                        "columns",
                        activeParameters.columns || 4,
                        "number",
                        false,
                        "шт"
                      )}
                      {renderColorRow(
                        "Цвет фона",
                        "backgroundColor",
                        activeParameters.backgroundColor || "#ffffff",
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
                      <TableRow>
                        <TableCell>Вид символа</TableCell>
                        <TableCell>
                          <AsciiSymbolSelect
                            value={activeParameters.symbolType || "X"}
                            onChange={(newSymbol) =>
                              handleParamChange("symbolType", newSymbol)
                            }
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Шрифт символа</TableCell>
                        <TableCell>
                          <FontSelect
                            value={activeParameters.symbolFont || "Arial"}
                            onChange={(newFont) =>
                              handleParamChange("symbolFont", newFont)
                            }
                          />
                        </TableCell>
                      </TableRow>
                      {renderDualNumberRow(
                        "Размер символа",
                        "symbolWidth",
                        activeParameters.symbolWidth || 30,
                        "ширина",
                        "symbolHeight",
                        activeParameters.symbolHeight || 30,
                        "высота"
                      )}
                      {renderDualNumberRow(
                        "Отступы",
                        "horizontalPadding",
                        activeParameters.horizontalPadding || 5,
                        "по горизонтали",
                        "verticalPadding",
                        activeParameters.verticalPadding || 5,
                        "по вертикали"
                      )}
                      {renderColorRow(
                        "Цвет символа",
                        "symbolColor",
                        activeParameters.symbolColor || "#000000",
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
                  backgroundColor: activeParameters.backgroundColor,
                  borderRadius: "4px",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <StimulusPreview parameters={activeParameters} />
              </Box>
            </Paper>
          </Box>

          <EditableTimeParameters
            parameters={{
              stimulusTime: activeParameters.stimulusTime,
              responseTime: activeParameters.responseTime,
              pauseTime: activeParameters.pauseTime,
            }}
            onParamChange={(field, value) => handleParamChange(field, value)}
          />
        </>
      )}
    </Box>
  );
}

export default EditableExperimentParameters;
