import React from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  Divider,
} from "@mui/material";
import SessionResultItem from "./SessionResultItem";

const SessionResults = ({
  results,
  activeResultId,
  onTaskClick,
}) => {
  return (
    <Paper elevation={3}>
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Результаты ({results.length} шт)
        </Typography>

        <List dense>
          {results.map((result, index) => (
            <React.Fragment key={result._id}>
              <SessionResultItem
                task={result.task}
                isActive={activeResultId === result._id}
                onClick={() => onTaskClick(result._id)}
                stats={{
                  success: result.successCount,
                  error: result.errorCount,
                  miss: result.missCount,
                  efficiency: result.efficiency
                }}
              />
              {index < results.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Paper>
  );
};

export default SessionResults;