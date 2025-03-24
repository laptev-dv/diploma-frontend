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
  Box
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';

function AddToFolderDialog({ open, onClose, folderId, currentExperiments }) {
  // Все доступные эксперименты
  const [allExperiments, setAllExperiments] = useState([
    { id: 1, name: 'Эксперимент 1', author: 'Иван Иванов' },
    { id: 2, name: 'Эксперимент 2', author: 'Петр Петров' },
    { id: 3, name: 'Эксперимент 3', author: 'Сергей Сергеев' }
  ]);

  // Выбранные эксперименты (изначально те, что уже в папке)
  const [selected, setSelected] = useState([]);

  // Инициализация выбранных экспериментов
  useEffect(() => {
    if (currentExperiments) {
      setSelected(currentExperiments.map(exp => exp.id));
    }
  }, [currentExperiments]);

  const handleToggle = (experimentId) => {
    setSelected(prev => {
      const newSelected = [...prev];
      const index = newSelected.indexOf(experimentId);
      
      if (index === -1) {
        newSelected.push(experimentId); // Добавляем
      } else {
        newSelected.splice(index, 1); // Удаляем
      }
      
      return newSelected;
    });
  };

  const handleSubmit = () => {
    // Здесь будет логика сохранения изменений
    const addedExperiments = allExperiments.filter(
      exp => selected.includes(exp.id) && !currentExperiments.some(e => e.id === exp.id)
    );
    
    const removedExperiments = currentExperiments.filter(
      exp => !selected.includes(exp.id)
    );

    console.log('Добавлены:', addedExperiments);
    console.log('Удалены:', removedExperiments);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          Добавить в папку
          <Button
            component={Link}
            to="/experiment/create"
            variant="contained"
            startIcon={<AddIcon />}
            size="small"
          >
            Создать
          </Button>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <List dense>
          {allExperiments.map((experiment) => (
            <React.Fragment key={experiment.id}>
              <ListItem>
                <ListItemText
                  primary={experiment.name}
                  secondary={`Автор: ${experiment.author}`}
                  sx={{ my: 0 }}
                />
                <Checkbox
                  edge="end"
                  checked={selected.includes(experiment.id)}
                  onChange={() => handleToggle(experiment.id)}
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
        >
          Готово
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddToFolderDialog;