import React, { useState } from 'react';
import { 
  Box,
  Container,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
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
  useTheme
} from '@mui/material';
import {
  Person as PersonIcon,
  Lock as LockIcon,
  ExitToApp as ExitIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Window as WindowsIcon,
  Description as ManualIcon,
  Science as ExperimentIcon,
  Edit as EditIcon
} from '@mui/icons-material';

const ProfilePage = () => {
  const theme = useTheme();
  const [user, setUser] = useState({ username: 'Иван Иванов' });
  const [editUsernameOpen, setEditUsernameOpen] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ 
        mb: 3,
        fontWeight: 500,
        color: theme.palette.text.primary
      }}>
        Профиль пользователя
      </Typography>

      {/* Блок личной информации */}
      <Paper elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
        <Box sx={{ p: 2, backgroundColor: theme.palette.grey[100] }}>
          <Typography variant="subtitle1">Личная информация</Typography>
        </Box>
        <List>
          <ListItem sx={{ px: 3 }}>
            <ListItemIcon sx={{ minWidth: 40 }}><PersonIcon color="primary" /></ListItemIcon>
            <ListItemText 
              primary="Имя пользователя" 
              secondary={user.username} 
              secondaryTypographyProps={{ color: 'text.primary' }}
            />
            <ListItemSecondaryAction>
              <IconButton 
                edge="end" 
                onClick={() => { setNewUsername(user.username); setEditUsernameOpen(true); }}
                sx={{ color: theme.palette.primary.main }}
              >
                <EditIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem sx={{ px: 3 }}>
            <ListItemIcon sx={{ minWidth: 40 }}><LockIcon color="primary" /></ListItemIcon>
            <ListItemText 
              primary="Пароль" 
              secondary="••••••••" 
              secondaryTypographyProps={{ color: 'text.primary' }}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" sx={{ color: theme.palette.primary.main }}>
                <EditIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>

      {/* Блок управления аккаунтом */}
      <Paper elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
        <Box sx={{ p: 2, backgroundColor: theme.palette.grey[100] }}>
          <Typography variant="subtitle1">Управление аккаунтом</Typography>
        </Box>
        <List>
          <ListItem button sx={{ px: 3 }}>
            <ListItemIcon sx={{ minWidth: 40 }}><ExitIcon color="action" /></ListItemIcon>
            <ListItemText primary="Выйти из системы" />
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem 
            button 
            sx={{ px: 3 }}
            onClick={() => setDeleteConfirmOpen(true)}
          >
            <ListItemIcon sx={{ minWidth: 40 }}><DeleteIcon color="error" /></ListItemIcon>
            <ListItemText 
              primary="Удалить аккаунт" 
              primaryTypographyProps={{ color: 'error' }} 
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
            <ListItemIcon sx={{ minWidth: 40 }}><WindowsIcon color="primary" /></ListItemIcon>
            <ListItemText 
              primary="Версия для Windows" 
              secondary="Десктопное приложение" 
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" sx={{ color: theme.palette.primary.main }}>
                <DownloadIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem sx={{ px: 3 }}>
            <ListItemIcon sx={{ minWidth: 40 }}><ManualIcon color="primary" /></ListItemIcon>
            <ListItemText 
              primary="Руководство пользователя" 
              secondary="Полное описание функций" 
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" sx={{ color: theme.palette.primary.main }}>
                <DownloadIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem sx={{ px: 3 }}>
            <ListItemIcon sx={{ minWidth: 40 }}><ExperimentIcon color="primary" /></ListItemIcon>
            <ListItemText 
              primary="Проведение эксперимента" 
              secondary="Инструкция по работе" 
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" sx={{ color: theme.palette.primary.main }}>
                <DownloadIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>

      {/* Диалог редактирования имени */}
      <Dialog open={editUsernameOpen} onClose={() => setEditUsernameOpen(false)}>
        <DialogTitle>Редактировать имя пользователя</DialogTitle>
        <DialogContent sx={{ minWidth: 400, py: 2 }}>
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
            onClick={() => { setUser({ username: newUsername }); setEditUsernameOpen(false); }}
            variant="contained"
            disabled={!newUsername.trim()}
          >
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог подтверждения удаления */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Подтвердите удаление аккаунта</DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            Это действие невозможно отменить!
          </Alert>
          <Typography>
            Все ваши данные будут безвозвратно удалены. Вы уверены, что хотите продолжить?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Отмена</Button>
          <Button 
            onClick={() => { 
              setDeleteConfirmOpen(false);
              // Здесь должна быть логика удаления аккаунта
            }}
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