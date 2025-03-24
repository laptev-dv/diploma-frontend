import React, { useContext } from 'react';
import { TextField, Button, Typography, Box, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { AlertContext } from '../context/AlertContext';

function LoginForm() {
  const { addAlert } = useContext(AlertContext);

  const handleLogin = () => {
    var textArray = [
      'error',
      'info',
      'success',
      'warning',
    ];
    var randomIndex = Math.floor(Math.random() * textArray.length); 
    var randomElement = textArray[randomIndex];
    addAlert('Проверка!', randomElement);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <Box
        sx={{
          width: '50%',
          maxWidth: 400,
          padding: 3,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="h4" gutterBottom align="center">
          Вход
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
        <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleLogin}>
          Войти
        </Button>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Link component={RouterLink} to="/auth/register">
            Зарегистрироваться
          </Link>
        </Box>
        <Box sx={{ mt: 1, textAlign: 'center' }}>
            <Link component={RouterLink} to="/">
              Неавторизованный вход
            </Link>
        </Box>
      </Box>
    </Box>
  );
}

export default LoginForm;