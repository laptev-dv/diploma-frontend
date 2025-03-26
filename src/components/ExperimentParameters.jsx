import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Chip,
  Stack,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Select,
  MenuItem,
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import {
  Fullscreen as FullscreenIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import TimeParameters from "../components/TimeParameters";
import StimulusPreview from "../components/StimulusPreview";

// Компонент полноэкранного просмотра
const FullscreenPreview = ({ open, onClose, parameters }) => {
  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: parameters.backgroundColor,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: "fixed",
          top: 16,
          right: 16,
          color: "common.white",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
          },
          zIndex: 1,
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
          p: 0,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <StimulusPreview parameters={parameters}/>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

// Конфигурация параметров для разных задач
const tasksConfig = {
  1: {
    // Задача 2×2
    rows: 2,
    columns: 2,
    symbolSize: 32,
    horizontalPadding: 15,
    verticalPadding: 15,
  },
  2: {
    // Задача 3×3
    rows: 3,
    columns: 3,
    symbolSize: 28,
    horizontalPadding: 12,
    verticalPadding: 12,
  },
  3: {
    // Задача 4×4
    rows: 4,
    columns: 4,
    symbolSize: 24,
    horizontalPadding: 10,
    verticalPadding: 10,
  },
};

function ExperimentParameters({ parameters }) {
  const [mode, setMode] = useState("adaptive");
  const [selectedTask, setSelectedTask] = useState(1);
  const [taskParameters, setTaskParameters] = useState({
    ...parameters,
    ...tasksConfig[1],
  });
  const [fullscreenOpen, setFullscreenOpen] = useState(false);

  const tasks = [
    { id: 1, name: "Задача №1 2×2" },
    { id: 2, name: "Задача №2 3×3" },
    { id: 3, name: "Задача №3 4×4" },
  ];

  useEffect(() => {
    setTaskParameters((prev) => ({
      ...prev,
      ...parameters,
      ...tasksConfig[selectedTask],
    }));
  }, [selectedTask, parameters]);

  const handleModeChange = (event, newMode) => {
    if (newMode !== null) {
      setMode(newMode);
    }
  };

  const handleTaskChange = (event) => {
    setSelectedTask(event.target.value);
  };

  const handleFullscreenOpen = () => {
    setFullscreenOpen(true);
  };

  const handleFullscreenClose = () => {
    setFullscreenOpen(false);
  };

  const renderTableRow = (label, value, isLast = false) => (
    <TableRow
      sx={{ "td": { borderBottom: isLast ? 0 : undefined } }}
    >
      <TableCell>{label}</TableCell>
      <TableCell>{value}</TableCell>
    </TableRow>
  );

  const renderColorRow = (label, color, isLast = false) => (
    <TableRow
      sx={{ "td": { borderBottom: isLast ? 0 : undefined } }}
    >
      <TableCell>{label}</TableCell>
      <TableCell>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Chip
            sx={{
              backgroundColor: color,
              width: 24,
              height: 24,
              border: "1px solid #ccc",
            }}
          />
          <span>{color}</span>
        </Stack>
      </TableCell>
    </TableRow>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Диалог полноэкранного просмотра */}
      <FullscreenPreview
        open={fullscreenOpen}
        onClose={handleFullscreenClose}
        parameters={taskParameters}
      />

      {/* Блок серии и режима работы */}
      <Paper elevation={3}>
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="subtitle1">Серия и режим работы</Typography>
            <ToggleButtonGroup
              value={mode}
              exclusive
              onChange={handleModeChange}
              size="small"
              color="warning"
            >
              <ToggleButton value="adaptive">Адаптивный</ToggleButton>
              <ToggleButton value="strict">Жесткий</ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <Table>
            <TableBody>
              {renderTableRow(
                "Режим",
                mode === "adaptive" ? "Адаптивный" : "Жесткий"
              )}
              <TableRow>
                <TableCell>Задача</TableCell>
                <TableCell>
                  <Select
                    value={selectedTask}
                    onChange={handleTaskChange}
                    size="small"
                    fullWidth
                  >
                    {tasks.map((task) => (
                      <MenuItem key={task.id} value={task.id}>
                        {task.name}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
              </TableRow>
              {renderTableRow("Количество задач", tasks.length)}
              {mode === "adaptive" && (
                <>
                  {renderTableRow(
                    "Номер начальной задачи",
                    taskParameters.initialTask || 1
                  )}
                  {renderTableRow(
                    "Количество предъявлений в задаче",
                    taskParameters.presentationsPerTask || 20
                  )}
                  {renderTableRow(
                    "Время на серию (с)",
                    taskParameters.seriesTime || 30
                  )}
                  {renderTableRow(
                    "Нижняя граница эффективности",
                    taskParameters.efficiencyMin || 0.5
                  )}
                  {renderTableRow(
                    "Верхняя граница эффективности",
                    taskParameters.efficiencyMax || 0.8,
                    true
                  )}
                </>
              )}
              {mode === "strict" &&
                renderTableRow(
                  "Количество предъявлений в задаче",
                  taskParameters.presentationsPerTaskStrict || 20,
                  true
                )}
            </TableBody>
          </Table>
        </Box>
      </Paper>

      {/* Основной блок с параметрами и предпросмотром */}
      <Box sx={{ display: "flex", gap: 3 }}>
        {/* Левый столбец - общие параметры и параметры символа */}
        <Box
          sx={{
            width: "50%",
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          {/* Блок общих параметров */}
          <Paper elevation={3}>
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Общие параметры
              </Typography>
              <Table>
                <TableBody>
                  {renderTableRow("Количество строк", taskParameters.rows)}
                  {renderTableRow(
                    "Количество столбцов",
                    taskParameters.columns
                  )}
                  {renderColorRow(
                    "Цвет фона",
                    taskParameters.backgroundColor,
                    true
                  )}
                </TableBody>
              </Table>
            </Box>
          </Paper>

          {/* Параметры символа */}
          <Paper elevation={3}>
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Параметры символа
              </Typography>
              <Table>
                <TableBody>
                  {renderTableRow("Вид символа", taskParameters.symbolType)}
                  {renderTableRow("Шрифт символа", taskParameters.symbolFont)}
                  {renderTableRow(
                    "Размер символа",
                    `${taskParameters.symbolSize} пикс`
                  )}
                  {renderTableRow(
                    "Ширина символа",
                    `${taskParameters.symbolWidth || 24} пикс`
                  )}
                  {renderTableRow(
                    "Высота символа",
                    `${taskParameters.symbolHeight || 24} пикс`
                  )}
                  {renderTableRow(
                    "Горизонтальный отступ",
                    `${taskParameters.horizontalPadding || 5} пикс`
                  )}
                  {renderTableRow(
                    "Вертикальный отступ",
                    `${taskParameters.verticalPadding || 5} пикс`
                  )}
                  {renderColorRow(
                    "Цвет символа",
                    taskParameters.symbolColor,
                    true
                  )}
                </TableBody>
              </Table>
            </Box>
          </Paper>
        </Box>

        {/* Правый столбец - предпросмотр */}
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
              display: 'flex',
              position: "relative",
              overflow: "hidden",
              backgroundColor: taskParameters.backgroundColor,
              borderRadius: "4px",
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <StimulusPreview parameters={taskParameters} />
          </Box>
        </Paper>
      </Box>

      {/* Временные параметры */}
      <TimeParameters
        parameters={{
          stimulusTime: taskParameters.stimulusTime,
          responseTime: taskParameters.responseTime,
          pauseTime: taskParameters.pauseTime,
        }}
      />
    </Box>
  );
}

export default ExperimentParameters;
