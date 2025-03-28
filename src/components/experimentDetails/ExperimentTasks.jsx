import React from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  Divider,
} from "@mui/material";
import TaskItem from "./TaskItem";

const ExperimentTasks = ({
  tasks,
  activeTaskId,
  onTaskClick,
}) => {
  return (
    <Paper
      elevation={3}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Задачи ({tasks.length} шт)
        </Typography>

        <List dense >
          {tasks.map((task, index) => (
            <React.Fragment key={task.id}>
              <TaskItem
                task={task}
                isActive={activeTaskId === task.id}
                onClick={() => onTaskClick(task.id)}
              />
              {index < tasks.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Paper>
  );
};

export default ExperimentTasks;