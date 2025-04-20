import React, { useState, useContext } from "react";
import { 
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Stack,
  Alert,
  CircularProgress,
  Box,
  useTheme
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { AlertContext } from "../contexts/AlertContext";

function RegisterPage() {
  const theme = useTheme();
  const [email, setEmail] = useState("email@email.com");
  const [password, setPassword] = useState("test1234");
  const [confirmPassword, setConfirmPassword] = useState("test1234");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const { addAlert } = useContext(AlertContext);
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    setError("");

    if (!email || !password || !confirmPassword) {
      setError("Пожалуйста, заполните все поля");
      return;
    }

    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    if (password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      return;
    }

    setIsSubmitting(true);

    try {
      await register({ email, password });
      addAlert("Регистрация прошла успешно!", "success");
      navigate("/auth/login");
    } catch (error) {
      setError(error.message || "Ошибка при регистрации");
      console.error("Registration error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
        {/* Серая шапка */}
        <Box
          sx={{
            padding: 2,
            backgroundColor: theme.palette.grey[100],
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            Регистрация
          </Typography>
        </Box>

        {/* Основное содержимое */}
        <Box sx={{ padding: 3 }}>
          <form onSubmit={handleRegister}>
            <Stack spacing={2}>
              {error && (
                <Alert severity="error">{error}</Alert>
              )}

              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                size="small"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                type="email"
                autoComplete="email"
              />

              <TextField
                label="Пароль"
                type="password"
                variant="outlined"
                fullWidth
                size="small"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                autoComplete="new-password"
              />

              <TextField
                label="Повторите пароль"
                type="password"
                variant="outlined"
                fullWidth
                size="small"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                autoComplete="new-password"
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  'Зарегистрироваться'
                )}
              </Button>

              <Box sx={{ textAlign: "center", marginTop: 2 }}>
                <Link
                  component={RouterLink}
                  to="/auth/login"
                  underline="hover"
                  color="text.secondary"
                >
                  Уже есть аккаунт? Войдите
                </Link>
              </Box>
            </Stack>
          </form>
        </Box>
      </Paper>
    </Container>
  );
}

export default RegisterPage;