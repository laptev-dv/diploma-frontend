import React, { useState, useContext } from "react";
import { TextField, Button, Typography, Box, Link, Stack } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { AlertContext } from "../contexts/AlertContext";

function LoginPage() {
  const [email, setEmail] = useState("email@email.com");
  const [password, setPassword] = useState("test1234");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const { addAlert } = useContext(AlertContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      addAlert("Пожалуйста, заполните все поля", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      await login({ email, password });
      addAlert("Вы успешно вошли в систему", "success");
      navigate("/");
    } catch (error) {
      addAlert(error.message || "Неверные учетные данные", "error");
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{
          width: "50%",
          maxWidth: 400,
          padding: 3,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: "background.paper",
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
          autoComplete="current-password"
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Вход..." : "Войти"}
        </Button>
        <Stack justifyContent="space-between" alignItems='center' sx={{ mt: 2 }}>
          <Link
            component={RouterLink}
            to="/auth/register"
            underline="hover"
          >
            Нет аккаунта? Зарегистрироваться
          </Link>
          <Link
            component={RouterLink}
            to="/auth/request-reset"
            underline="hover"
          >
            Забыли пароль?
          </Link>
        </Stack>{" "}
      </Box>
    </Box>
  );
}

export default LoginPage;
