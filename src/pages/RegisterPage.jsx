import React, { useState, useContext } from 'react';
import { TextField, Button, Typography, Box, Link } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AlertContext } from '../contexts/AlertContext';
import axios from '../axios';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const { addAlert } = useContext(AlertContext);

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      addAlert('Пароли не совпадают', 'error');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Мокаем ответ сервера
      axios.interceptors.response.use(response => {
        // Если это наш моковый запрос на регистрацию
        if (response.config.url === '/api/auth/register') {
          return {
            ...response,
            data: {
              // В реальном приложении сервер вернет данные пользователя
              id: Math.floor(Math.random() * 1000),
              email,
              name
            }
          };
        }
        return response;
      });

      await register({ email, password, name });
      addAlert('Регистрация прошла успешно!', 'success');
    } catch (error) {
      addAlert('Ошибка при регистрации', 'error');
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
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
        component="form"
        onSubmit={handleRegister}
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
          Регистрация
        </Typography>
        <TextField
          label="Имя"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          type="email"
        />
        <TextField
          label="Пароль"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <TextField
          label="Повторите пароль"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <Button 
          type="submit"
          variant="contained" 
          fullWidth 
          sx={{ mt: 2 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
        </Button>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Link component={RouterLink} to="/auth/login">
            Уже есть аккаунт? Войдите
          </Link>
        </Box>
      </Box>
    </Box>
  );
}

export default RegisterPage;