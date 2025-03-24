import React from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

function ExperimentItem({ experiment }) {
  return (
    <Box 
      component={Link} 
      to={`/experiment/${experiment.id}`} 
      sx={{ 
        textDecoration: 'none', 
        color: 'inherit',
        display: 'block',
        '&:hover': {
          backgroundColor: 'action.hover',
        },
        p: 1,
        borderRadius: 1
      }}
    >
      <Typography variant="body2" color="textSecondary">
        Результатов: {experiment.resultsCount}
      </Typography>
      <Typography variant="h6" sx={{ mt: 0.5 }}>
        {experiment.name}
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
        Автор: {experiment.author} | Дата: {experiment.createdAt}
      </Typography>
    </Box>
  );
}

export default ExperimentItem;