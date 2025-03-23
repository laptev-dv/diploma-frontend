import React from 'react';
import { TextField, Button, Typography, Box, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function RegisterForm() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh', // Занимает всю высоту экрана
      }}
    >
      <Box
        sx={{
          width: '50%', // Ширина контейнера — половина страницы
          maxWidth: 400, // Максимальная ширина (опционально)
          padding: 3, // Внутренние отступы
          boxShadow: 3, // Тень для контейнера
          borderRadius: 2, // Закругленные углы
          bgcolor: 'background.paper', // Цвет фона контейнера
        }}
      >
        <Typography variant="h4" gutterBottom align="center">
          Регистрация
        </Typography>
        <TextField
          label="Логин"
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <TextField
          label="Пароль"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <TextField
          label="Повторите пароль"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <Button variant="contained" fullWidth sx={{ mt: 2 }}>
          Зарегистрироваться
        </Button>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link component={RouterLink} to="/login">
                Уже есть аккаунт? Войдите
            </Link>
        </Box>
      </Box>
    </Box>
  );
}

export default RegisterForm;