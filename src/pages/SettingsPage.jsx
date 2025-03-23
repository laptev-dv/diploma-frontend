import React from 'react';
import { Box, Typography, Button, Divider, Paper } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

function SettingsPage() {
  // Пример данных пользователя (можно заменить на реальные данные)
  const user = {
    username: 'Иван Иванов',
    password: '********',
  };

  // Обработчики для кнопок
  const handleEditUsername = () => {
    alert('Редактирование имени пользователя');
  };

  const handleEditPassword = () => {
    alert('Редактирование пароля');
  };

  const handleLogout = () => {
    alert('Выход из учетной записи');
  };

  const handleDeleteAccount = () => {
    alert('Удаление учетной записи');
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
              <Typography variant="body1">{user.username}</Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={handleEditUsername}
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
              <Typography variant="body1">{user.password}</Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={handleEditPassword}
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
              onClick={handleDeleteAccount}
            >
              Удалить
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default SettingsPage;