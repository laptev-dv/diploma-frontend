import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';

function SessionDetailPage() {
  const { id } = useParams();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Детали сессии #{id}
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="body1">
          Здесь будет детальная информация о сессии:
        </Typography>
        <ul>
          <li>Дата и время: 01.01.2025 10:00</li>
          <li>Длительность: 15 минут</li>
          <li>Автор: Иван Иванов</li>
          <li>Параметры эксперимента</li>
          <li>Результаты</li>
        </ul>
      </Paper>
    </Box>
  );
}

export default SessionDetailPage;