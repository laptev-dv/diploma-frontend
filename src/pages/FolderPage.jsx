import React from 'react';
import { Typography, Box } from '@mui/material';

function FolderPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Страница папки
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Здесь будет содержимое папки (заглушка)
      </Typography>
    </Box>
  );
}

export default FolderPage;