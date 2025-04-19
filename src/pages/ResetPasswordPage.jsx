import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Typography, TextField, Button, Link, Stack } from '@mui/material';
import { authApi } from '../api/authApi';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await authApi.resetPassword({ token, newPassword: password });
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8, p: 3 }}>
      <Typography variant="h4" gutterBottom>Новый пароль</Typography>
      
      {success ? (
        <>
          <Typography color="success.main" paragraph>
            Пароль успешно изменен!
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/auth/login')}
            fullWidth
          >
            Войти с новым паролем
          </Button>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            {!token && (
              <Typography color="error">
                Неверная или устаревшая ссылка для сброса пароля
              </Typography>
            )}
            
            <TextField
              label="Новый пароль"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />
            
            <TextField
              label="Подтвердите пароль"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              fullWidth
            />
            
            {error && (
              <Typography color="error">{error}</Typography>
            )}
            
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading || !token}
              fullWidth
            >
              {isLoading ? 'Сохранение...' : 'Сохранить пароль'}
            </Button>
            
            <Box sx={{ textAlign: 'center' }}>
              <Link href="/auth/login" underline="hover">
                Вернуться к входу
              </Link>
            </Box>
          </Stack>
        </form>
      )}
    </Box>
  );
};

export default ResetPasswordPage;