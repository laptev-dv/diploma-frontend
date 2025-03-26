import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import ExperimentSeriesSettings from "./ExperimentSeriesSettings";
import ExperimentTasks from "./ExperimentTasks";
import ExperimentGeneralParams from "./ExperimentGeneralParams";
import ExperimentPreview from "./ExperimentPreview";
import EditableTimeParameters from "./EditableTimeParameters";

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
  const activeTask = tasks.find((task) => task.id === activeTaskId);
  const activeParameters = activeTask?.parameters || {};

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

  if (!activeTask) {
    return <Typography>Нет активных задач</Typography>;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <ExperimentSeriesSettings
        parameters={activeParameters}
        onParamChange={handleParamChange}
      />

      <Box sx={{ display: "flex", gap: 3 }}>
        <Box sx={{ flex: 1 }}>
          <ExperimentTasks
            tasks={tasks}
            activeTaskId={activeTaskId}
            onTaskClick={handleTaskClick}
            onDeleteTask={handleDeleteTask}
            onCopyTask={handleCopyTask}
            onTaskNameChange={handleTaskNameChange}
            onTasksChange={(newTasks) => {
              setTasks(newTasks);
              onTasksChange(newTasks);
            }}
          />
        </Box>

        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
          <ExperimentGeneralParams
            parameters={activeParameters}
            onParamChange={handleParamChange}
          />

          <EditableTimeParameters
            parameters={{
              stimulusTime: activeParameters.stimulusTime,
              responseTime: activeParameters.responseTime,
              pauseTime: activeParameters.pauseTime,
            }}
            onParamChange={handleParamChange}
          />
        </Box>

        <Box sx={{ flex: 1, maxWidth: "30%" }}>
          <ExperimentPreview parameters={activeParameters} />
        </Box>
      </Box>
    </Box>
  );
}

export default EditableExperimentParameters;
