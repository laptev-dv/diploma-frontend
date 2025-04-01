import React, { useState } from "react";
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

const ProfilePage = () => {
  const theme = useTheme();
  const [user, setUser] = useState({ username: "Иван Иванов" });
  const [editUsernameOpen, setEditUsernameOpen] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const handleLogout = () => {
    console.log("Logout logic here");
    // Добавьте здесь логику выхода из системы
  };

  const handleDownload = (item) => {
    console.log(`Downloading ${item}`);
    // Добавьте здесь логику загрузки
  };

  const handleEditPassword = () => {
    console.log("Edit password logic here");
    // Добавьте здесь логику изменения пароля
  };

  const handleDeleteAccount = () => {
    console.log("Account deletion logic here");
    // Добавьте здесь логику удаления аккаунта
    setDeleteConfirmOpen(false);
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
              secondary={user.username}
              secondaryTypographyProps={{ color: "text.primary" }}
            />
            <IconButton
              edge="end"
              onClick={() => {
                setNewUsername(user.username);
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
      <Dialog
        open={editUsernameOpen}
        onClose={() => setEditUsernameOpen(false)}
      >
        <DialogTitle>Редактировать имя пользователя</DialogTitle>
        <DialogContent sx={{ minWidth: 400, ьy: 2 }}>
          <TextField
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
            onClick={() => {
              setUser({ username: newUsername });
              setEditUsernameOpen(false);
            }}
            variant="contained"
            disabled={!newUsername.trim()}
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
