import React, { useState, useContext } from 'react';
import { TextField, Button, Typography, Box, Link } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AlertContext } from '../contexts/AlertContext';

function RegisterPage() {
  const [email, setEmail] = useState('email@email.com');
  const [password, setPassword] = useState('test1234');
  const [confirmPassword, setConfirmPassword] = useState('test1234');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const { addAlert } = useContext(AlertContext);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      addAlert('Пожалуйста, заполните все поля', 'error');
      return;
    }

    if (password !== confirmPassword) {
      addAlert('Пароли не совпадают', 'error');
      return;
    }

    if (password.length < 6) {
      addAlert('Пароль должен содержать минимум 6 символов', 'error');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await register({ email, password });
      addAlert('Регистрация прошла успешно!', 'success');
      navigate('/auth/login');
    } catch (error) {
      addAlert(error.message || 'Ошибка при регистрации', 'error');
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
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          type="email"
          autoComplete="email"
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
          autoComplete="new-password"
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
          autoComplete="new-password"
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