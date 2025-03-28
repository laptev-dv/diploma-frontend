import { Typography, Paper } from '@mui/material';

const DevPanel = ({ 
    timeLeft, 
    currentTaskIndex, 
    totalTasks, 
    hiddenPosition,
    experiment
  }) => {
    return (
      <Paper
        sx={{
          position: "fixed",
          right: 20,
          top: 20,
          width: 300,
          p: 2,
          zIndex: 1002,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Dev Panel
        </Typography>

        <Typography variant="body1">
          <strong>Time to next change:</strong> {timeLeft}s
        </Typography>

        <Typography variant="body1">
          <strong>Current task:</strong> {currentTaskIndex + 1}/{totalTasks}
        </Typography>

        <Typography variant="body1">
          <strong>Hidden position:</strong>{" "}
          {hiddenPosition
            ? `Row ${hiddenPosition.row}, Col ${hiddenPosition.col}`
            : "None"}
        </Typography>

        <Typography variant="body1" mt={2}>
          <strong>Experiment params:</strong>
        </Typography>
        <Typography
          variant="body2"
          component="pre"
          sx={{
            fontSize: "0.8rem",
            overflowX: "auto",
            whiteSpace: "pre-wrap",
          }}
        >
          {JSON.stringify(
            {
                mode: experiment.parameters.mode.toUpperCase(),
                task: [experiment.parameters.tasks[currentTaskIndex]],
            },
            null,
            2
          )}
        </Typography>
      </Paper>
    );
  };

  export default DevPanel;