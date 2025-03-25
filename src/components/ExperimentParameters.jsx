import React, { useState } from "react";
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
} from "@mui/material";
import { Fullscreen as FullscreenIcon } from "@mui/icons-material";
import TimeParameters from '../components/TimeParameters';

const timeParametersColors = {
  stimulus: "#4CAF50",
  response: "#2196F3",
  pause: "#FF9800",
};

function ExperimentParameters({ parameters }) {
  const [mode, setMode] = useState("adaptive");
  const [selectedTask, setSelectedTask] = useState(1);

  const tasks = [
    { id: 1, name: "Задача №1 2×2" },
    { id: 2, name: "Задача №2 3×3" },
    { id: 3, name: "Задача №3 4×4" },
  ];

  const renderSymbolGrid = () => {
    const symbol = parameters.symbolType;
    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `repeat(${parameters.columns || 4}, 1fr)`,
          gridTemplateRows: `repeat(${parameters.rows || 4}, 1fr)`,
          gap: `${parameters.symbolSpacing}px`,
          width: "100%",
          aspectRatio: 1/1,
          placeItems: "center",
        }}
      >
        {Array((parameters.rows || 4) * (parameters.columns || 4))
          .fill(symbol)
          .map((char, index) => (
            <Typography
              key={index}
              sx={{
                color: parameters.symbolColor,
                fontFamily: parameters.symbolFont,
                fontSize: `${parameters.symbolSize}px`,
                lineHeight: 1,
              }}
            >
              {char}
            </Typography>
          ))}
      </Box>
    );
  };

  const handleModeChange = (event, newMode) => {
    if (newMode !== null) {
      setMode(newMode);
    }
  };

  const handleTaskChange = (event) => {
    setSelectedTask(event.target.value);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Блок серии и режима работы - теперь вверху */}
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
            <Typography variant="subtitle1">
              Серия и режим работы
            </Typography>
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
              <TableRow>
                <TableCell>Режим</TableCell>
                <TableCell>
                  {mode === "adaptive" ? "Адаптивный" : "Жесткий"}
                </TableCell>
              </TableRow>
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
              <TableRow>
                <TableCell>Количество задач</TableCell>
                <TableCell>
                  {mode === "adaptive"
                    ? parameters.taskCountAdaptive || 10
                    : parameters.taskCountStrict || 10}
                </TableCell>
              </TableRow>
              {mode === "adaptive" && (
                <>
                  <TableRow>
                    <TableCell>Номер начальной задачи</TableCell>
                    <TableCell>{parameters.initialTask || 1}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Количество предъявлений в задаче</TableCell>
                    <TableCell>
                      {parameters.presentationsPerTask || 20}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Время на серию (с)</TableCell>
                    <TableCell>{parameters.seriesTime || 30}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Нижняя граница эффективности</TableCell>
                    <TableCell>{parameters.efficiencyMin || 0.5}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Верхняя граница эффективности</TableCell>
                    <TableCell>{parameters.efficiencyMax || 0.8}</TableCell>
                  </TableRow>
                </>
              )}
              {mode === "strict" && (
                <TableRow>
                  <TableCell>Количество предъявлений в задаче</TableCell>
                  <TableCell>
                    {parameters.presentationsPerTaskStrict || 20}
                  </TableCell>
                </TableRow>
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
                  <TableRow>
                    <TableCell>Количество строк</TableCell>
                    <TableCell>{parameters.rows || 4}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Количество столбцов</TableCell>
                    <TableCell>{parameters.columns || 4}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Цвет фона</TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Chip
                          sx={{
                            backgroundColor: parameters.backgroundColor,
                            width: 24,
                            height: 24,
                            border: "1px solid #ccc",
                          }}
                        />
                        <span>{parameters.backgroundColor}</span>
                      </Stack>
                    </TableCell>
                  </TableRow>
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
                  <TableRow>
                    <TableCell>Вид символа</TableCell>
                    <TableCell>{parameters.symbolType}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Шрифт символа</TableCell>
                    <TableCell>{parameters.symbolFont}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Размер символа</TableCell>
                    <TableCell>{parameters.symbolSize} пикс</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Ширина символа</TableCell>
                    <TableCell>{parameters.symbolWidth || 24} пикс</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Высота символа</TableCell>
                    <TableCell>{parameters.symbolHeight || 24} пикс</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Горизонтальный отступ</TableCell>
                    <TableCell>
                      {parameters.horizontalPadding || 5} пикс
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Вертикальный отступ</TableCell>
                    <TableCell>
                      {parameters.verticalPadding || 5} пикс
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Цвет символа</TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Chip
                          sx={{
                            backgroundColor: parameters.symbolColor,
                            width: 24,
                            height: 24,
                            border: "1px solid #ccc",
                          }}
                        />
                        <span>{parameters.symbolColor}</span>
                      </Stack>
                    </TableCell>
                  </TableRow>
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
              height: '100%'
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
                backgroundColor: parameters.backgroundColor,
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

      {/* Временные параметры - теперь внизу */}
      <TimeParameters
        parameters={{
          stimulusTime: parameters.stimulusTime,
          responseTime: parameters.responseTime,
          pauseTime: parameters.pauseTime,
        }}
      />
    </Box>
  );
}

export default ExperimentParameters;