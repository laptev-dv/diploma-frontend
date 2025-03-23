import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

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

      {/* Разделитель */}
      <Divider sx={{ mt: 2, mb: 2 }} />
    </Box>
  );
}

export default FolderItem;