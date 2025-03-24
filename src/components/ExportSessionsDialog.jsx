import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Divider,
  Stack,
  Typography
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

function ExportSessionsDialog({ open, onClose, sessions }) {
  const [selectedSessions, setSelectedSessions] = useState([]);

  const handleToggle = (sessionId) => {
    const currentIndex = selectedSessions.indexOf(sessionId);
    const newSelected = [...selectedSessions];

    if (currentIndex === -1) {
      newSelected.push(sessionId);
    } else {
      newSelected.splice(currentIndex, 1);
    }

    setSelectedSessions(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedSessions.length === sessions.length) {
      setSelectedSessions([]);
    } else {
      setSelectedSessions(sessions.map(session => session.id));
    }
  };

  const handleExport = () => {
    // Здесь должна быть логика экспорта выбранных сессий
    console.log('Экспортировать сессии:', selectedSessions);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <FileDownloadIcon />
          <Typography variant="h6">Экспорт сессий</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1" gutterBottom>
          Выберите сессии для экспорта:
        </Typography>
        
        <List dense>
          <ListItem disablePadding>
            <ListItemButton onClick={handleSelectAll}>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={selectedSessions.length === sessions.length && sessions.length > 0}
                  indeterminate={selectedSessions.length > 0 && selectedSessions.length < sessions.length}
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemIcon>
              <ListItemText primary="Выбрать все" />
            </ListItemButton>
          </ListItem>
          <Divider />
          
          {sessions.map((session) => (
            <ListItem key={session.id} disablePadding>
              <ListItemButton onClick={() => handleToggle(session.id)}>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={selectedSessions.indexOf(session.id) !== -1}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText 
                  primary={`Сессия от ${session.date}`}
                  secondary={`Автор: ${session.author} | Длительность: ${session.duration}`}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={handleExport} 
          variant="contained" 
          disabled={selectedSessions.length === 0}
          startIcon={<FileDownloadIcon />}
        >
          Экспортировать ({selectedSessions.length})
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ExportSessionsDialog;