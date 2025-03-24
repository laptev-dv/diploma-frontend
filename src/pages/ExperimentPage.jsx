import React from 'react';
import { Typography, Box } from '@mui/material';

function ExperimentPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Страница эксперимента
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Здесь будет содержимое эксперимента (заглушка)
      </Typography>
    </Box>
  );
}

export default ExperimentPage;