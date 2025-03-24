import React from 'react';
import { Box, Typography } from '@mui/material';

function ExperimentItem({ experiment }) {
  return (
    <Box>
      {/* Кол-во результатов */}
      <Typography variant="body2" color="textSecondary">
        Результатов: {experiment.resultsCount}
      </Typography>

      {/* Название */}
      <Typography variant="h6" sx={{ mt: 1 }}>
        {experiment.name}
      </Typography>

      {/* Автор и дата создания */}
      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
        Автор: {experiment.author} | Дата создания: {experiment.createdAt}
      </Typography>
    </Box>
  );
}

export default ExperimentItem;