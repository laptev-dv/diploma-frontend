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
  CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import { experimentApi } from '../api/experimentApi';

function AddToFolderDialog({ 
  open, 
  onClose, 
  folderId, 
  currentExperimentIds,
  onSave 
}) {
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState([]);

  // Загрузка экспериментов и инициализация выбранных
  useEffect(() => {
    const loadExperiments = async () => {
      try {
        setLoading(true);
        const response = await experimentApi.getAll();
        setExperiments(response.data);
        setSelected(currentExperimentIds || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      loadExperiments();
    }
  }, [open, currentExperimentIds]);

  const handleToggle = (experimentId) => {
    setSelected(prev => {
      const newSelected = [...prev];
      const index = newSelected.indexOf(experimentId);
      
      if (index === -1) {
        newSelected.push(experimentId);
      } else {
        newSelected.splice(index, 1);
      }
      
      return newSelected;
    });
  };

  const handleSubmit = () => {
    onSave(selected);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          Управление экспериментами в папке
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
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 2, color: 'error.main' }}>{error}</Box>
        ) : (
          <List dense>
            {experiments.map((experiment) => (
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
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
        >
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddToFolderDialog;