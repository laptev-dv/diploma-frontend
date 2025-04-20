import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  TextField,
  Link,
  Stack,
  Alert,
  CircularProgress,
  useTheme
} from '@mui/material';
import { authApi } from '../api/authApi';

const RequestResetPage = () => {
  const theme = useTheme();
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
      setError(err.message || 'Произошла ошибка при отправке запроса');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
        {/* Серая шапка как в LibraryPage */}
        <Box
          sx={{
            p: 2,
            backgroundColor: theme.palette.grey[100],
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            Сброс пароля
          </Typography>
        </Box>

        {/* Основное содержимое */}
        <Box sx={{ p: 3 }}>
          {success ? (
            <Stack spacing={2}>
              <Alert severity="success">
                Ссылка для сброса пароля была отправлена на {email}
              </Alert>
              <Button
                variant="contained"
                size="small"
                fullWidth
                onClick={() => navigate('/auth/login')}
              >
                Вернуться к входу
              </Button>
            </Stack>
          ) : (
            <form onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <Typography variant="body1" color="text.secondary">
                  Введите email, указанный при регистрации. Мы отправим вам ссылку для сброса пароля.
                </Typography>

                {error && (
                  <Alert severity="error">{error}</Alert>
                )}

                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  fullWidth
                  size='small'
                  variant="outlined"
                />

                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                  fullWidth
                >
                  {isLoading ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    'Отправить ссылку'
                  )}
                </Button>

                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Link
                    href="/auth/login"
                    underline="hover"
                    color="text.secondary"
                  >
                    Вернуться к странице входа
                  </Link>
                </Box>
              </Stack>
            </form>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default RequestResetPage;