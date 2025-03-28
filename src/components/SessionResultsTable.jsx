import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Chip,
  Box,
  Typography,
  Paper
} from '@mui/material';
import { 
  CheckCircle,
  Cancel,
  Timer
} from '@mui/icons-material';

const SessionResultsTable = ({ results }) => {
  if (!results || results.length === 0) {
    return (
      <Typography variant="body1" sx={{ p: 2 }}>
        Нет данных о результатах
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Задача</TableCell>
            <TableCell align="center">Ответы</TableCell>
            <TableCell align="center">Среднее время (мс)</TableCell>
            <TableCell align="center">Эффективность</TableCell>
            <TableCell align="center">Нагрузка</TableCell>
            <TableCell align="center">Итоговая оценка</TableCell>
            <TableCell align="center">Производительность</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {results.map((task, index) => (
            <TableRow key={task.taskId || index}>
              <TableCell>{task.taskName || `Задача ${index + 1}`}</TableCell>
              <TableCell align="center">
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                  <Chip 
                    icon={<CheckCircle />} 
                    label={task.correct} 
                    color="success" 
                    size="small" 
                  />
                  <Chip 
                    icon={<Cancel />} 
                    label={task.wrong} 
                    color="error" 
                    size="small" 
                  />
                  <Chip 
                    icon={<Timer />} 
                    label={task.missed} 
                    color="warning" 
                    size="small" 
                  />
                </Box>
              </TableCell>
              <TableCell align="center">{task.avgResponseTime.toFixed(0)}</TableCell>
              <TableCell align="center">{(task.efficiency * 100).toFixed(1)}%</TableCell>
              <TableCell align="center">{task.workload.toFixed(2)}</TableCell>
              <TableCell align="center">{task.finalScore.toFixed(4)}</TableCell>
              <TableCell align="center">{task.performance.toFixed(4)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SessionResultsTable;