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
} from "@mui/material";
import {
  Person as PersonIcon,
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
  const [profileData, setProfileData] = useState({ username: "" });
  const [editUsernameOpen, setEditUsernameOpen] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await userApi.getProfile();
        setProfileData(response.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      logout();
      navigate("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleDownload = (item) => {
    console.log(`Downloading ${item}`);
    // Логика загрузки
  };

  const handleEditPassword = () => {
    setPasswordDialogOpen(true);
  };

  const handlePasswordSubmit = async () => {
    if (newPassword !== confirmPassword) {
      alert("Пароли не совпадают");
      return;
    }

    try {
      await userApi.changePassword(currentPassword, newPassword);
      setPasswordDialogOpen(false);
      alert("Пароль успешно изменен");
    } catch (error) {
      console.error("Password change failed:", error);
      alert("Ошибка при изменении пароля");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await userApi.deleteAccount();
      logout();
      navigate("/auth/login");
    } catch (error) {
      console.error("Account deletion failed:", error);
    } finally {
      setDeleteConfirmOpen(false);
    }
  };

  const handleUsernameUpdate = async () => {
    try {
      await userApi.updateUsername(newUsername);
      setProfileData({ ...profileData, username: newUsername });
      setEditUsernameOpen(false);
    } catch (error) {
      console.error("Username update failed:", error);
    }
  };

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

      {/* Блок личной информации */}
      <Paper elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
        <Box sx={{ p: 2, backgroundColor: theme.palette.grey[100] }}>
          <Typography variant="subtitle1">Личная информация</Typography>
        </Box>
        <List>
          <ListItem sx={{ px: 3 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <PersonIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Имя пользователя"
              secondary={profileData.username}
              secondaryTypographyProps={{ color: "text.primary" }}
            />
            <IconButton
              edge="end"
              onClick={() => {
                setNewUsername(profileData.username);
                setEditUsernameOpen(true);
              }}
              sx={{ color: theme.palette.primary.main }}
            >
              <EditIcon />
            </IconButton>
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

      {/* Диалог редактирования имени */}
      <Dialog open={editUsernameOpen} onClose={() => setEditUsernameOpen(false)}>
        <DialogTitle>Редактировать имя пользователя</DialogTitle>
        <DialogContent sx={{ minWidth: 400, py: 2 }}>
          <TextField
            margin="dense"
            autoFocus
            fullWidth
            variant="outlined"
            label="Новое имя"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditUsernameOpen(false)}>Отмена</Button>
          <Button
            onClick={handleUsernameUpdate}
            variant="contained"
            disabled={!newUsername.trim()}
          >
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог изменения пароля */}
      <Dialog
        open={passwordDialogOpen}
        onClose={() => setPasswordDialogOpen(false)}
      >
        <DialogTitle>Изменить пароль</DialogTitle>
        <DialogContent sx={{ minWidth: 400, py: 2 }}>
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
          <Button onClick={() => setPasswordDialogOpen(false)}>Отмена</Button>
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