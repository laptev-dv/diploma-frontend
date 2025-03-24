import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Divider, 
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

function SettingsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: 'Иван Иванов',
  });
  
  // Состояния для диалогов
  const [editUsernameOpen, setEditUsernameOpen] = useState(false);
  const [editPasswordOpen, setEditPasswordOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  
  // Состояния для форм
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  // Обработчики открытия/закрытия диалогов
  const handleEditUsernameOpen = () => {
    setNewUsername(user.username);
    setEditUsernameOpen(true);
  };

  const handleEditPasswordOpen = () => {
    setNewPassword({ password: '', confirmPassword: '' });
    setEditPasswordOpen(true);
  };

  // Сохранение нового имени пользователя
  const handleSaveUsername = () => {
    if (newUsername.trim()) {
      setUser({ ...user, username: newUsername });
      setEditUsernameOpen(false);
    }
  };

  // Валидация и сохранение пароля
  const handleSavePassword = () => {
    const newErrors = {};
    
    if (!newPassword.password) {
      newErrors.password = 'Введите новый пароль';
    } else if (newPassword.password.length < 6) {
      newErrors.password = 'Пароль должен быть не менее 6 символов';
    }
    
    if (newPassword.password !== newPassword.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }
    
    if (Object.keys(newErrors).length === 0) {
      // Здесь должна быть логика смены пароля
      console.log('Пароль изменен:', newPassword.password);
      setEditPasswordOpen(false);
      setErrors({});
    } else {
      setErrors(newErrors);
    }
  };

  // Выход из учетной записи
  const handleLogout = () => {
    // Здесь должна быть логика выхода
    navigate('/auth/login');
  };

  // Удаление учетной записи
  const handleDeleteAccount = () => {
    // Здесь должна быть логика удаления аккаунта
    setDeleteAccountOpen(false);
    navigate('/auth/login');
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Заголовок страницы */}
      <Typography variant="h4" gutterBottom>
        Настройки
      </Typography>

      {/* Блок "Личная информация" */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Личная информация
        </Typography>

        {/* Контейнер с параметрами */}
        <Paper elevation={3} sx={{ p: 2 }}>
          {/* Имя пользователя */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Box>
              <Typography variant="subtitle1">Имя пользователя</Typography>
              <Typography variant="body2">{user.username}</Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={handleEditUsernameOpen}
            >
              Редактировать
            </Button>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Пароль пользователя */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box>
              <Typography variant="subtitle1">Пароль пользователя</Typography>
              <Typography variant="body2">••••••••</Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={handleEditPasswordOpen}
            >
              Редактировать
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* Блок "Учетная запись" */}
      <Box>
        <Typography variant="h6" gutterBottom>
          Учетная запись
        </Typography>

        {/* Контейнер с параметрами */}
        <Paper elevation={3} sx={{ p: 2 }}>
          {/* Выйти из учетной записи */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="subtitle1">Выйти из учетной записи</Typography>
            <Button
              variant="outlined"
              startIcon={<ExitToAppIcon />}
              onClick={handleLogout}
            >
              Выйти
            </Button>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Удалить учетную запись */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="subtitle1">Удалить учетную запись</Typography>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteForeverIcon />}
              onClick={() => setDeleteAccountOpen(true)}
            >
              Удалить
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* Диалог редактирования имени пользователя */}
      <Dialog open={editUsernameOpen} onClose={() => setEditUsernameOpen(false)}>
        <DialogTitle>Изменить имя пользователя</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Введите новое имя пользователя. Это имя будет отображаться в вашем профиле.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Новое имя пользователя"
            fullWidth
            variant="standard"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleSaveUsername} 
            disabled={!newUsername.trim() || newUsername === user.username}
          >
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог смены пароля */}
      <Dialog open={editPasswordOpen} onClose={() => setEditPasswordOpen(false)}>
        <DialogTitle>Изменить пароль</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Введите новый пароль и подтвердите его. Пароль должен содержать не менее 6 символов.
          </DialogContentText>
          
          <TextField
            autoFocus
            margin="dense"
            label="Новый пароль"
            type="password"
            fullWidth
            variant="standard"
            value={newPassword.password}
            onChange={(e) => setNewPassword({...newPassword, password: e.target.value})}
            error={!!errors.password}
            helperText={errors.password}
          />
          
          <TextField
            margin="dense"
            label="Подтвердите пароль"
            type="password"
            fullWidth
            variant="standard"
            value={newPassword.confirmPassword}
            onChange={(e) => setNewPassword({...newPassword, confirmPassword: e.target.value})}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleSavePassword} 
            disabled={!newPassword.password || !newPassword.confirmPassword}
          >
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог подтверждения удаления аккаунта */}
      <Dialog open={deleteAccountOpen} onClose={() => setDeleteAccountOpen(false)}>
        <DialogTitle>Удалить учетную запись?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите удалить свою учетную запись? Это действие невозможно отменить. 
            Все ваши данные будут безвозвратно удалены.
          </DialogContentText>
          <Alert severity="warning" sx={{ mt: 2 }}>
            Это действие необратимо! Пожалуйста, убедитесь в своем решении.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleDeleteAccount} 
            color="error"
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default SettingsPage;