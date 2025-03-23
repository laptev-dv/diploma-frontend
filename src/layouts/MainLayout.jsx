import React from 'react';
import { Box } from '@mui/material';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

function MainLayout({ children }) {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3 }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default MainLayout;