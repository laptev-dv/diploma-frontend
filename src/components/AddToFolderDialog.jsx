import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Divider,
  Box,
  CircularProgress,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

function AddToFolderDialog({ 
  open,
  onClose,
  experiments = [],
  selectedExperimentIds = [],
  loading = false,
  searchTerm = '',
  onSearchChange,
  onSave
}) {
  const [localSelected, setLocalSelected] = useState([]);

  // Инициализируем и синхронизируем состояние при открытии диалога
  useEffect(() => {
    if (open) {
      setLocalSelected([...selectedExperimentIds]);
    }
  }, [open, selectedExperimentIds]);

  const handleToggle = (experimentId) => {
    setLocalSelected(prev => {
      const currentIndex = prev.indexOf(experimentId);
      const newSelected = [...prev];
      
      if (currentIndex === -1) {
        newSelected.push(experimentId);
      } else {
        newSelected.splice(currentIndex, 1);
      }
      
      return newSelected;
    });
  };

  const clearSearch = () => {
    onSearchChange('');
  };

  const handleSubmit = () => {
    onSave(localSelected);
    onClose();
  };

  const getExperimentInfo = (experiment) => {
    return `Задач: ${experiment.parameters?.initialTaskNumber || 0}, 
            Сессий: ${experiment.sessionsCount || 0}`;
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="md"
      scroll="paper"
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            Управление экспериментами в папке
          </Typography>
          <Button
            component={Link}
            to="/experiment/create"
            variant="contained"
            startIcon={<AddIcon />}
            size="small"
            sx={{ ml: 2 }}
          >
            Создать эксперимент
          </Button>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Поиск экспериментов по названию или автору..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <IconButton onClick={clearSearch} size="small">
                  <ClearIcon fontSize="small" />
                </IconButton>
              )
            }}
          />
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : experiments.length === 0 ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              {searchTerm ? 'Ничего не найдено' : 'Нет доступных экспериментов'}
            </Typography>
          </Box>
        ) : (
          <List dense>
            {experiments.map((experiment) => (
              <React.Fragment key={experiment._id}>
                <ListItem 
                  sx={{ 
                    bgcolor: localSelected.includes(experiment._id) 
                      ? 'action.selected' 
                      : 'background.paper',
                    '&:hover': {
                      bgcolor: 'action.hover'
                    }
                  }}
                >
                  <Checkbox
                    edge="start"
                    checked={localSelected.includes(experiment._id)}
                    onChange={() => handleToggle(experiment._id)}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': `checkbox-${experiment._id}` }}
                  />
                  
                  <ListItemText
                    id={`checkbox-${experiment._id}`}
                    primary={experiment.name}
                    secondary={
                      <>
                        <Typography 
                          component="span" 
                          variant="body2" 
                          color="text.primary"
                        >
                          Автор: {experiment.author?.name || 'Неизвестен'}
                        </Typography>
                        <br />
                        <Typography 
                          component="span" 
                          variant="body2" 
                          color="text.secondary"
                        >
                          {getExperimentInfo(experiment)}
                        </Typography>
                      </>
                    }
                    sx={{ my: 0 }}
                  />
                  
                  <Tooltip title="Подробнее об эксперименте">
                    <IconButton
                      component={Link}
                      to={`/experiment/${experiment._id}`}
                      edge="end"
                      size="small"
                    >
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{ mr: 1 }}
        >
          Отмена
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
        >
          Сохранить изменения
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddToFolderDialog;