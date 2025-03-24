import React from 'react';
import { Box } from '@mui/material';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

function MainLayout() {
  return (
    <Box sx={{ display: 'flex' }}>
      {/* Боковое меню */}
      <Sidebar />

      {/* Основное содержимое */}
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3,
          maxWidth: 'calc(100% - 240px)' // учитываем ширину сайдбара
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default MainLayout;