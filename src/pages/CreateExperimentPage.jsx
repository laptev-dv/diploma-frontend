import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Tabs,
  Tab,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Fullscreen as FullscreenIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import TimeParameters from "../components/TimeParameters";

function CreateExperimentPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [mode, setMode] = useState("adaptive");
  const [selectedTask, setSelectedTask] = useState(1);

  const [experiment, setExperiment] = useState({
    name: "Новый эксперимент",
    parameters: {
      // Общие параметры
      backgroundColor: "#FFFFFF",
      symbolColor: "#000000",
      symbolType: "A",
      symbolFont: "Arial",
      symbolSize: 24,
      symbolSpacing: 10,
      rows: 4,
      columns: 4,
      
      // Временные параметры
      stimulusTime: 0.5,
      responseTime: 10,
      pauseTime: 1,
      
      // Параметры режима
      taskCountAdaptive: 10,
      taskCountStrict: 10,
      initialTask: 1,
      presentationsPerTask: 20,
      seriesTime: 30,
      efficiencyMin: 0.5,
      efficiencyMax: 0.8,
    },
  });

  const tasks = [
    { id: 1, name: "Задача №1 2×2" },
    { id: 2, name: "Задача №2 3×3" },
    { id: 3, name: "Задача №3 4×4" },
  ];

  const handleChange = (field, value) => {
    setExperiment({
      ...experiment,
      parameters: {
        ...experiment.parameters,
        [field]: value,
      },
    });
  };

  const handleTimeChange = (field, value) => {
    handleChange(field, parseFloat(value) || 0);
  };

  const handleModeChange = (event, newMode) => {
    if (newMode !== null) {
      setMode(newMode);
    }
  };

  const handleTaskChange = (event) => {
    setSelectedTask(event.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const renderSymbolGrid = () => {
    const symbol = experiment.parameters.symbolType;
    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `repeat(${experiment.parameters.columns}, 1fr)`,
          gridTemplateRows: `repeat(${experiment.parameters.rows}, 1fr)`,
          gap: `${experiment.parameters.symbolSpacing}px`,
          width: "100%",
          aspectRatio: 1/1,
          placeItems: "center",
        }}
      >
        {Array(experiment.parameters.rows * experiment.parameters.columns)
          .fill(symbol)
          .map((char, index) => (
            <Typography
              key={index}
              sx={{
                color: experiment.parameters.symbolColor,
                fontFamily: experiment.parameters.symbolFont,
                fontSize: `${experiment.parameters.symbolSize}px`,
                lineHeight: 1,
              }}
            >
              {char}
            </Typography>
          ))}
      </Box>
    );
  };

  const renderEditableRow = (label, value, field, type = "text") => {
    return (
      <TableRow>
        <TableCell>{label}</TableCell>
        <TableCell>
          <TextField
            size="small"
            fullWidth
            type={type}
            value={value}
            onChange={(e) => handleChange(field, type === "number" ? parseFloat(e.target.value) : e.target.value)}
          />
        </TableCell>
      </TableRow>
    );
  };

  const renderColorRow = (label, value, field) => {
    return (
      <TableRow>
        <TableCell>{label}</TableCell>
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={1}>
            <input
              type="color"
              value={value}
              onChange={(e) => handleChange(field, e.target.value)}
              style={{ width: 30, height: 30 }}
            />
            <TextField
              size="small"
              value={value}
              onChange={(e) => handleChange(field, e.target.value)}
              sx={{ width: 100 }}
            />
          </Stack>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">Создание эксперимента</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ mr: 2 }}
          >
            Назад
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={() => navigate("/experiment/123")}
          >
            Сохранить
          </Button>
        </Box>
      </Box>

      <TextField
        label="Название эксперимента"
        fullWidth
        value={experiment.name}
        onChange={(e) => setExperiment({...experiment, name: e.target.value})}
        sx={{ mb: 3 }}
      />

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Основные параметры" />
        <Tab label="Дополнительные настройки" />
      </Tabs>

      {activeTab === 0 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Блок серии и режима работы */}
          <Paper elevation={3}>
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Серия и режим работы
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Select
                  value={selectedTask}
                  onChange={handleTaskChange}
                  size="small"
                  sx={{ width: 200 }}
                >
                  {tasks.map((task) => (
                    <MenuItem key={task.id} value={task.id}>
                      {task.name}
                    </MenuItem>
                  ))}
                </Select>
                <ToggleButtonGroup
                  value={mode}
                  exclusive
                  onChange={handleModeChange}
                  size="small"
                  color="primary"
                >
                  <ToggleButton value="adaptive">Адаптивный</ToggleButton>
                  <ToggleButton value="strict">Жесткий</ToggleButton>
                </ToggleButtonGroup>
              </Box>
              <Table>
                <TableBody>
                  {mode === "adaptive" ? (
                    <>
                      {renderEditableRow(
                        "Количество задач",
                        experiment.parameters.taskCountAdaptive,
                        "taskCountAdaptive",
                        "number"
                      )}
                      {renderEditableRow(
                        "Номер начальной задачи",
                        experiment.parameters.initialTask,
                        "initialTask",
                        "number"
                      )}
                      {renderEditableRow(
                        "Количество предъявлений в задаче",
                        experiment.parameters.presentationsPerTask,
                        "presentationsPerTask",
                        "number"
                      )}
                      {renderEditableRow(
                        "Время на серию (с)",
                        experiment.parameters.seriesTime,
                        "seriesTime",
                        "number"
                      )}
                      {renderEditableRow(
                        "Нижняя граница эффективности",
                        experiment.parameters.efficiencyMin,
                        "efficiencyMin",
                        "number"
                      )}
                      {renderEditableRow(
                        "Верхняя граница эффективности",
                        experiment.parameters.efficiencyMax,
                        "efficiencyMax",
                        "number"
                      )}
                    </>
                  ) : (
                    <>
                      {renderEditableRow(
                        "Количество задач",
                        experiment.parameters.taskCountStrict,
                        "taskCountStrict",
                        "number"
                      )}
                      {renderEditableRow(
                        "Количество предъявлений в задаче",
                        experiment.parameters.presentationsPerTaskStrict,
                        "presentationsPerTaskStrict",
                        "number"
                      )}
                    </>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Paper>

          {/* Основной блок с параметрами и предпросмотром */}
          <Box sx={{ display: "flex", gap: 3 }}>
            {/* Левый столбец - общие параметры и параметры символа */}
            <Box sx={{ width: "50%", display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Блок общих параметров */}
              <Paper elevation={3}>
                <Box sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Общие параметры
                  </Typography>
                  <Table>
                    <TableBody>
                      {renderEditableRow(
                        "Количество строк",
                        experiment.parameters.rows,
                        "rows",
                        "number"
                      )}
                      {renderEditableRow(
                        "Количество столбцов",
                        experiment.parameters.columns,
                        "columns",
                        "number"
                      )}
                      {renderColorRow(
                        "Цвет фона",
                        experiment.parameters.backgroundColor,
                        "backgroundColor"
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
                      {renderEditableRow(
                        "Вид символа",
                        experiment.parameters.symbolType,
                        "symbolType"
                      )}
                      {renderEditableRow(
                        "Шрифт символа",
                        experiment.parameters.symbolFont,
                        "symbolFont"
                      )}
                      {renderEditableRow(
                        "Размер символа (пикс)",
                        experiment.parameters.symbolSize,
                        "symbolSize",
                        "number"
                      )}
                      {renderEditableRow(
                        "Ширина символа (пикс)",
                        experiment.parameters.symbolWidth || 24,
                        "symbolWidth",
                        "number"
                      )}
                      {renderEditableRow(
                        "Высота символа (пикс)",
                        experiment.parameters.symbolHeight || 24,
                        "symbolHeight",
                        "number"
                      )}
                      {renderEditableRow(
                        "Горизонтальный отступ (пикс)",
                        experiment.parameters.horizontalPadding || 5,
                        "horizontalPadding",
                        "number"
                      )}
                      {renderEditableRow(
                        "Вертикальный отступ (пикс)",
                        experiment.parameters.verticalPadding || 5,
                        "verticalPadding",
                        "number"
                      )}
                      {renderColorRow(
                        "Цвет символа",
                        experiment.parameters.symbolColor,
                        "symbolColor"
                      )}
                    </TableBody>
                  </Table>
                </Box>
              </Paper>
            </Box>

            {/* Правый столбец - предпросмотр */}
            <Box sx={{ width: "50%" }}>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  boxSizing: "border-box",
                  height: "100%",
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
                    Предпросмотр стимула
                  </Typography>
                  <Button startIcon={<FullscreenIcon />} size="small">
                    Полный экран
                  </Button>
                </Box>
                <Box
                  sx={{
                    flex: 1,
                    backgroundColor: experiment.parameters.backgroundColor,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "4px",
                    aspectRatio: "1/1",
                    width: "100%",
                  }}
                >
                  {renderSymbolGrid()}
                </Box>
              </Paper>
            </Box>
          </Box>

          {/* Временные параметры */}
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Временные параметры
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="Стимул (с)"
                  type="number"
                  value={experiment.parameters.stimulusTime}
                  onChange={(e) => handleTimeChange("stimulusTime", e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Ответ (с)"
                  type="number"
                  value={experiment.parameters.responseTime}
                  onChange={(e) => handleTimeChange("responseTime", e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Пауза (с)"
                  type="number"
                  value={experiment.parameters.pauseTime}
                  onChange={(e) => handleTimeChange("pauseTime", e.target.value)}
                  fullWidth
                />
              </Box>
            </Box>
            <TimeParameters
              parameters={{
                stimulusTime: experiment.parameters.stimulusTime,
                responseTime: experiment.parameters.responseTime,
                pauseTime: experiment.parameters.pauseTime,
              }}
            />
          </Paper>
        </Box>
      )}

      {activeTab === 1 && (
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Дополнительные настройки
          </Typography>
          <Typography color="text.secondary">
            Здесь будут дополнительные параметры эксперимента
          </Typography>
        </Paper>
      )}
    </Box>
  );
}

export default CreateExperimentPage;