import React from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

function FolderItem({ folder }) {
  return (
    <Box 
      component={Link} 
      to={`/folder/${folder.id}`} 
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
        Объектов: {folder.itemsCount} | Дата: {folder.createdAt}
      </Typography>
      <Typography variant="h6" sx={{ mt: 0.5 }}>
        {folder.name}
      </Typography>
    </Box>
  );
}

export default FolderItem;