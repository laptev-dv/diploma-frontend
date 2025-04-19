import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Link, Stack } from '@mui/material';
import { authApi } from '../api/authApi';

const RequestResetPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await authApi.requestPasswordReset(email);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8, p: 3 }}>
      <Typography variant="h4" gutterBottom>Сброс пароля</Typography>
      
      {success ? (
        <>
          <Typography color="success.main" paragraph>
            Ссылка для сброса пароля отправлена на {email}
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/auth/login')}
            fullWidth
          >
            Вернуться к входу
          </Button>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <Typography>
              Введите email, указанный при регистрации
            </Typography>
            
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
            />
            
            {error && (
              <Typography color="error">{error}</Typography>
            )}
            
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              fullWidth
            >
              {isLoading ? 'Отправка...' : 'Отправить ссылку'}
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

export default RequestResetPage;