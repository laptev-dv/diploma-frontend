import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';

function FolderItem({ folder }) {
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
        Объектов: {folder.itemsCount} | Дата: {folder.createdAt}
      </Typography>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
        <FolderIcon color="primary" fontSize="small" />
        <Typography variant="h6">
          {folder.name}
        </Typography>
      </Stack>
    </Box>
  );
}

export default FolderItem;