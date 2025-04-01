import React from 'react';
import { Box, Paper, Typography, styled } from '@mui/material';

const InputContainer = styled(Paper)({
  position: 'fixed',
  bottom: 20,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 1000,
  backgroundColor: 'rgba(255, 255, 255, 0.6)',
  padding: 8,
  display: 'flex',
  gap: 16,
  alignItems: 'center',
});

const InputSegment = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const InputValue = styled(Typography)({
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: 'rgba(0, 0, 0, 0.6)',
  minWidth: 24,
  textAlign: 'center',
});

const InputLabel = styled(Typography)({
  fontSize: '0.75rem',
  color: 'rgba(91, 91, 91, 0.7)',
});

const UserInputDisplay = ({ userInput }) => {
  return (
    <InputContainer>
      <InputSegment>
        <InputLabel>Строка</InputLabel>
        <InputValue>{userInput[0] || '-'}</InputValue>
      </InputSegment>
      
      <Box sx={{ color: 'rgba(246, 246, 246, 0.3)' }}>/</Box>
      
      <InputSegment>
        <InputLabel>Столбец</InputLabel>
        <InputValue>{userInput[1] || '-'}</InputValue>
      </InputSegment>
    </InputContainer>
  );
};

export default UserInputDisplay;