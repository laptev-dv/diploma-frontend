import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  AppBar,
  Toolbar,
  Typography,
  Chip
} from "@mui/material";
import { Save as SaveIcon } from "@mui/icons-material";
import EditableExperimentParameters from "../components/createExperiment/EditableExperimentParameters";

function CreateExperimentPage() {
  const [experimentName, setExperimentName] = useState("Новый эксперимент");
  const [tasks, setTasks] = useState([
    { 
      id: "1", 
      name: "Задача 2×2", 
      parameters: {
        mode: "adaptive",
        rows: 2,
        columns: 2,
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
      }
    }
  ]);

  // Получаем текущий режим из первой задачи (можно доработать для нескольких задач)
  const currentMode = tasks[0]?.parameters?.mode || "adaptive";

  const handleSaveExperiment = () => {
    const experimentData = {
      experimentName: experimentName,
      createdAt: new Date().toISOString(),
      tasks: tasks.map((task, index) => ({
        taskId: task.id,
        taskName: task.name,
        order: index + 1,
        parameters: {
          mode: task.parameters.mode,
          gridSize: {
            rows: task.parameters.rows,
            columns: task.parameters.columns
          },
          appearance: {
            backgroundColor: task.parameters.backgroundColor,
            symbol: {
              type: task.parameters.symbolType,
              font: task.parameters.symbolFont,
              width: task.parameters.symbolWidth,
              height: task.parameters.symbolHeight,
              color: task.parameters.symbolColor
            },
            padding: {
              horizontal: task.parameters.horizontalPadding,
              vertical: task.parameters.verticalPadding
            }
          },
          timing: {
            stimulusTime: Number(task.parameters.stimulusTime),
            responseTime: Number(task.parameters.responseTime),
            pauseTime: Number(task.parameters.pauseTime),
            totalTime: Number(task.parameters.stimulusTime) + 
                      Number(task.parameters.responseTime) + 
                      Number(task.parameters.pauseTime)
          },
          modeSettings: {
            presentationsPerTask: task.parameters.presentationsPerTask,
            ...(task.parameters.mode === "adaptive" ? {
              seriesTime: task.parameters.seriesTime,
              efficiencyMin: task.parameters.efficiencyMin,
              efficiencyMax: task.parameters.efficiencyMax
            } : {})
          }
        }
      }))
    };

    console.log("Полные данные эксперимента:", JSON.stringify(experimentData, null, 2));
    
    console.log("\nДетализация задач:");
    experimentData.tasks.forEach((task, index) => {
      console.log(`\nЗадача #${index + 1}: ${task.taskName} (ID: ${task.taskId})`);
      console.log("Параметры:");
      console.log("- Режим:", task.parameters.mode);
      console.log("- Размер сетки:", `${task.parameters.gridSize.rows}×${task.parameters.gridSize.columns}`);
      console.log("- Временные параметры:");
      console.log("  • Стимул:", task.parameters.timing.stimulusTime, "мс");
      console.log("  • Ответ:", task.parameters.timing.responseTime, "мс");
      console.log("  • Пауза:", task.parameters.timing.pauseTime, "мс");
      console.log("  • Общее время:", task.parameters.timing.totalTime, "мс");
      
      if (task.parameters.mode === "adaptive") {
        console.log("- Настройки адаптивного режима:");
        console.log("  • Время на серию:", task.parameters.modeSettings.seriesTime, "сек");
        console.log("  • Диапазон эффективности:", 
          `${task.parameters.modeSettings.efficiencyMin}–${task.parameters.modeSettings.efficiencyMax}`);
      }
    });
  };

  const handleTasksChange = (updatedTasks) => {
    setTasks(updatedTasks);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {/* Основное содержимое */}
      <Box
        component="main"
        sx={{
          p: 3,
          pb: 10,
          flex: 1,
        }}
      >
        <TextField
          fullWidth
          label="Название эксперимента"
          variant="outlined"
          value={experimentName}
          onChange={(event) => setExperimentName(event.target.value)}
          sx={{
            mb: 4,
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
          inputProps={{
            style: {
              fontSize: "1.2rem",
              padding: "12px 14px",
            },
          }}
        />

        <EditableExperimentParameters
          tasks={tasks}
          onTasksChange={handleTasksChange}
        />
      </Box>

      {/* Фиксированная панель внизу */}
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          top: "auto",
          bottom: 0,
          borderTop: "1px solid",
          borderColor: "divider",
          backgroundColor: "background.default",
        }}
      >
        <Toolbar>
          {/* Отображение текущего режима слева */}
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ mr: 2 }}>
              Текущий режим:
            </Typography>
            <Chip 
              label={currentMode === "adaptive" ? "Адаптивный" : "Жесткий"} 
              color='primary'
              variant="outlined"
            />
          </Box>

          {/* Кнопка сохранения справа */}
          <Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSaveExperiment}
              sx={{
                textTransform: "none",
                fontWeight: 500,
                px: 3,
                py: 1,
                my: 1,
              }}
            >
              Сохранить эксперимент
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default CreateExperimentPage;