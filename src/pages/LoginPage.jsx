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

function LoginPage() {
  const theme = useTheme();
  const [email, setEmail] = useState("email@email.com");
  const [password, setPassword] = useState("test1234");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const { addAlert } = useContext(AlertContext);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Пожалуйста, заполните все поля");
      return;
    }

    setIsSubmitting(true);

    try {
      await login({ email, password });
      addAlert("Вы успешно вошли в систему", "success");
      navigate("/");
    } catch (error) {
      setError(error.message || "Неверные учетные данные");
      console.error("Login error:", error);
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
            Вход
          </Typography>
        </Box>

        {/* Основное содержимое */}
        <Box sx={{ padding: 3 }}>
          <form onSubmit={handleLogin}>
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
                autoComplete="current-password"
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
                  'Войти'
                )}
              </Button>

              <Stack 
                direction="row" 
                justifyContent="space-between" 
                sx={{ marginTop: 2 }}
              >
                <Link
                  component={RouterLink}
                  to="/auth/register"
                  underline="hover"
                  color="text.secondary"
                >
                  Нет аккаунта? Зарегистрироваться
                </Link>
                <Link
                  component={RouterLink}
                  to="/auth/request-reset"
                  underline="hover"
                  color="text.secondary"
                >
                  Забыли пароль?
                </Link>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Paper>
    </Container>
  );
}

export default LoginPage;