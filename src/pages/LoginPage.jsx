import React, { useState, useContext } from 'react';
import { TextField, Button, Typography, Box, Link } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AlertContext } from '../contexts/AlertContext';
import axios from '../axios';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const { addAlert } = useContext(AlertContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Мокаем ответ сервера
      axios.interceptors.response.use(response => {
        console.log(response.config.url)
        // Если это наш моковый запрос на логин
        if (response.config.url === '/api/auth/login') {
          return {
            ...response,
            data: {
              token: 'mock-jwt-token-123456789', // Моковый JWT токен
              user: {
                id: 1,
                email: email,
                name: 'Test User'
              }
            }
          };
        }
        return response;
      });

      await login({ email, password });
      addAlert('Вы успешно вошли в систему', 'success');
    } catch (error) {
      addAlert('Неверные учетные данные', 'error');
      console.error('Login error:', error);
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
        onSubmit={handleLogin}
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
        <Button 
          type="submit"
          variant="contained" 
          fullWidth 
          sx={{ mt: 2 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Вход...' : 'Войти'}
        </Button>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Link component={RouterLink} to="/auth/register">
            Зарегистрироваться
          </Link>
        </Box>
      </Box>
    </Box>
  );
}

export default LoginPage;