import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Typography,
  Alert,
  useTheme,
  CircularProgress
} from "@mui/material";
import {
  Email as EmailIcon,
  Lock as LockIcon,
  ExitToApp as ExitIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Window as WindowsIcon,
  Description as ManualIcon,
  Science as ExperimentIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { userApi } from "../api/userApi";
import { authApi } from "../api/authApi";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const theme = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await userApi.getProfile();
        setProfileData(response.data);
      } catch (error) {
        console.error("Ошибка загрузки профиля:", error);
        setError("Не удалось загрузить данные профиля");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout(user.token);
      logout();
      navigate("/auth/login");
    } catch (error) {
      console.error("Ошибка выхода:", error);
      setError("Не удалось выйти из системы");
    }
  };

  const handleDownload = (item) => {
    console.log(`Загрузка: ${item}`);
    // Реализация загрузки файлов
  };

  const handleEditPassword = () => {
    setPasswordDialogOpen(true);
    setError("");
  };

  const handlePasswordSubmit = async () => {
    if (newPassword !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    try {
      await userApi.changePassword(currentPassword, newPassword);
      setPasswordDialogOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError("");
      alert("Пароль успешно изменен");
    } catch (error) {
      console.error("Ошибка изменения пароля:", error);
      setError(error.message || "Ошибка при изменении пароля");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await userApi.deleteAccount();
      logout();
      navigate("/auth/login");
    } catch (error) {
      console.error("Ошибка удаления аккаунта:", error);
      setError("Не удалось удалить аккаунт");
    } finally {
      setDeleteConfirmOpen(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!profileData) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Alert severity="error">
          {error || "Не удалось загрузить данные профиля"}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          mb: 3,
          fontWeight: 500,
          color: theme.palette.text.primary,
        }}
      >
        Профиль пользователя
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Блок личной информации */}
      <Paper elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
        <Box sx={{ p: 2, backgroundColor: theme.palette.grey[100] }}>
          <Typography variant="subtitle1">Личная информация</Typography>
        </Box>
        <List>
          <ListItem sx={{ px: 3 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <EmailIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Email"
              secondary={profileData.email}
              secondaryTypographyProps={{ color: "text.primary" }}
            />
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem sx={{ px: 3 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <LockIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Пароль"
              secondary="••••••••"
              secondaryTypographyProps={{ color: "text.primary" }}
            />
            <IconButton
              edge="end"
              onClick={handleEditPassword}
              sx={{ color: theme.palette.primary.main }}
            >
              <EditIcon />
            </IconButton>
          </ListItem>
        </List>
      </Paper>

      {/* Блок управления аккаунтом */}
      <Paper elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
        <Box sx={{ p: 2, backgroundColor: theme.palette.grey[100] }}>
          <Typography variant="subtitle1">Управление аккаунтом</Typography>
        </Box>
        <List>
          <ListItem
            button
            sx={{ px: 3, "&:hover": { cursor: "pointer" } }}
            onClick={handleLogout}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <ExitIcon color="action" />
            </ListItemIcon>
            <ListItemText primary="Выйти из системы" />
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem
            button
            sx={{ px: 3, "&:hover": { cursor: "pointer" } }}
            onClick={() => setDeleteConfirmOpen(true)}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <DeleteIcon color="error" />
            </ListItemIcon>
            <ListItemText
              primary="Удалить аккаунт"
              primaryTypographyProps={{ color: "error" }}
            />
          </ListItem>
        </List>
      </Paper>

      {/* Блок дополнительных материалов */}
      <Paper elevation={2} sx={{ borderRadius: 2 }}>
        <Box sx={{ p: 2, backgroundColor: theme.palette.grey[100] }}>
          <Typography variant="subtitle1">Дополнительные материалы</Typography>
        </Box>
        <List>
          <ListItem sx={{ px: 3 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <WindowsIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Версия для Windows"
              secondary="Десктопное приложение"
            />
            <IconButton
              edge="end"
              onClick={(e) => {
                e.stopPropagation();
                handleDownload("windows_app");
              }}
              sx={{ color: theme.palette.primary.main }}
            >
              <DownloadIcon />
            </IconButton>
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem sx={{ px: 3 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <ManualIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Руководство пользователя"
              secondary="Полное описание функций"
            />
            <IconButton
              edge="end"
              onClick={(e) => {
                e.stopPropagation();
                handleDownload("user_manual");
              }}
              sx={{ color: theme.palette.primary.main }}
            >
              <DownloadIcon />
            </IconButton>
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem sx={{ px: 3 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <ExperimentIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Проведение эксперимента"
              secondary="Инструкция по работе"
            />
            <IconButton
              edge="end"
              onClick={(e) => {
                e.stopPropagation();
                handleDownload("experiment_guide");
              }}
              sx={{ color: theme.palette.primary.main }}
            >
              <DownloadIcon />
            </IconButton>
          </ListItem>
        </List>
      </Paper>

      {/* Диалог изменения пароля */}
      <Dialog
        open={passwordDialogOpen}
        onClose={() => {
          setPasswordDialogOpen(false);
          setError("");
        }}
      >
        <DialogTitle>Изменить пароль</DialogTitle>
        <DialogContent sx={{ minWidth: 400, py: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            margin="dense"
            autoFocus
            fullWidth
            type="password"
            variant="outlined"
            label="Текущий пароль"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type="password"
            variant="outlined"
            label="Новый пароль"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type="password"
            variant="outlined"
            label="Подтвердите новый пароль"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setPasswordDialogOpen(false);
              setError("");
            }}
          >
            Отмена
          </Button>
          <Button
            onClick={handlePasswordSubmit}
            variant="contained"
            disabled={!currentPassword || !newPassword || !confirmPassword}
          >
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог подтверждения удаления */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Подтвердите удаление аккаунта</DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            Это действие невозможно отменить!
          </Alert>
          <Typography>
            Все ваши данные будут безвозвратно удалены. Вы уверены, что хотите
            продолжить?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Отмена</Button>
          <Button
            onClick={handleDeleteAccount}
            color="error"
            variant="contained"
          >
            Удалить аккаунт
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProfilePage;