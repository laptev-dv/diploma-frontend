import React from 'react';
import { Box, Typography } from '@mui/material';

function ExperimentItem({ experiment }) {
  return (
    <Box sx={{ 
      display: 'block',
      '&:hover': {
        backgroundColor: 'action.hover',
      },
      p: 1,
      borderRadius: 1
    }}>
      <Typography variant="body2" color="textSecondary">
        Результатов: {experiment.resultsCount}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
        <Typography variant="h6">
          {experiment.name}
        </Typography>
      </Box>
      <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
        Автор: {experiment.author} | Дата: {experiment.createdAt}
      </Typography>
    </Box>
  );
}

export default ExperimentItem;