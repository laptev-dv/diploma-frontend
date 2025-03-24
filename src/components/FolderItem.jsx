import React from 'react';
import { Box, Typography } from '@mui/material';

function FolderItem({ folder }) {
  return (
    <Box>
      {/* Кол-во объектов и дата создания */}
      <Typography variant="body2" color="textSecondary">
        Объектов: {folder.itemsCount} | Дата создания: {folder.createdAt}
      </Typography>

      {/* Название */}
      <Typography variant="h6" sx={{ mt: 1 }}>
        {folder.name}
      </Typography>
    </Box>
  );
}

export default FolderItem;