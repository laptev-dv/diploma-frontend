import React, { useState, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  Button, 
  TextField, 
  Paper, 
  List, 
  Divider,
  Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import ExperimentItem from '../components/ExperimentItem';
import FolderItem from '../components/FolderItem';

function LibraryPage() {
  const navigate = useNavigate();
  // Состояние для активной вкладки
  const [activeTab, setActiveTab] = useState(0);

  // Состояние для поиска
  const [searchQuery, setSearchQuery] = useState('');

  // Состояние для временного скрытия элементов
  const [isItemsHidden, setIsItemsHidden] = useState(false);

  // Состояние для сортировки
  const [sortBy, setSortBy] = useState('date');

  // Состояние для меню "Добавить"
  const [anchorEl, setAnchorEl] = useState(null);
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // Пример данных экспериментов
  const [experiments, setExperiments] = useState([
    {
      id: 1,
      name: 'Эксперимент 1',
      author: 'Иван Иванов',
      resultsCount: 10,
      createdAt: '01.01.2025',
    },
    {
      id: 2,
      name: 'Эксперимент 2',
      author: 'Петр Петров',
      resultsCount: 5,
      createdAt: '01.01.2025',
    },
  ]);

  // Пример данных папок
  const [folders, setFolders] = useState([
    {
      id: 1,
      name: 'Папка 1',
      itemsCount: 2,
      createdAt: '01.01.2025',
    },
    {
      id: 2,
      name: 'Папка 2',
      itemsCount: 3,
      createdAt: '01.01.2025',
    },
  ]);

  // Обработчик смены вкладки
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Обработчик поиска
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Обработчик открытия меню "Добавить"
  const handleAddClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Обработчик закрытия меню "Добавить"
  const handleAddClose = () => {
    setAnchorEl(null);
  };

  // Обработчик создания папки
  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const newFolder = {
        id: folders.length + 1,
        name: newFolderName,
        itemsCount: 0,
        createdAt: new Date().toLocaleDateString(),
      };
      setFolders([...folders, newFolder]);
      setFolderDialogOpen(false);
      setNewFolderName('');
    }
  };

  // Обработчик выбора в меню "Добавить"
  const handleAddItem = (type) => {
    handleAddClose();
    if (type === 'папку') {
      setFolderDialogOpen(true);
    } else if (type === 'эксперимент') {
      navigate('/experiment/create');
    }
  };

  // Обработчик временного скрытия элементов
  const handleToggleItems = () => {
    setIsItemsHidden((prev) => !prev);
  };

  // Обработчик изменения сортировки
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  // Получение текущих данных для активной вкладки
  const currentItems = activeTab === 0 ? experiments : folders;

  // Проверка, есть ли данные на текущей вкладке
  const hasItems = currentItems.length > 0 && !isItemsHidden;

  return (
    <Box sx={{ p: 3 }}>
      {/* Заголовок страницы */}
      <Typography variant="h4" gutterBottom>
        Библиотека
      </Typography>

      {/* Вкладки и кнопка "Добавить" */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Эксперименты" />
          <Tab label="Папки" />
        </Tabs>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" color='warning' onClick={handleToggleItems}>
            {isItemsHidden ? 'Вернуть элементы' : 'Скрыть элементы'}
          </Button>

          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={handleAddClick}
          >
            Добавить
          </Button>

          {/* Меню для кнопки "Добавить" */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleAddClose}
          >
            <MenuItem onClick={() => handleAddItem('эксперимент')}>Создать эксперимент</MenuItem>
            <MenuItem onClick={() => handleAddItem('папку')}>Создать папку</MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Диалог создания папки */}
      <Dialog open={folderDialogOpen} onClose={() => setFolderDialogOpen(false)}>
        <DialogTitle>Создать новую папку</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Введите название для новой папки. Папка поможет вам организовать ваши эксперименты.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Название папки"
            type="text"
            fullWidth
            variant="standard"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFolderDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleCreateFolder} disabled={!newFolderName.trim()}>Создать</Button>
        </DialogActions>
      </Dialog>

      {/* Поле сортировки и поисковая строка (отображаются только если есть элементы) */}
      {hasItems && (
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Сортировать по</InputLabel>
            <Select
              value={sortBy}
              onChange={handleSortChange}
              label="Сортировать по"
            >
              <MenuItem value="date">Дате создания</MenuItem>
              <MenuItem value="name">Названию</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Поиск..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </Box>
      )}

      {/* Список экспериментов или папок */}
      <Paper elevation={3} sx={{ p: 2 }}>
        {hasItems ? (
          activeTab === 0 ? (
            // Список экспериментов
            <List>
              {experiments.map((experiment, index) => (
                <div key={experiment.id}>
                  <ExperimentItem experiment={experiment} />
                  {index !== experiments.length-1 && (<Divider sx={{ mt: 2, mb: 2 }} />)}
                </div>
              ))}
            </List>
          ) : (
            // Список папок
            <List>
              {folders.map((folder, index) => (
                <div key={folder.id}>
                  <FolderItem folder={folder} />
                  {index !== folders.length-1 && (<Divider sx={{ mt: 2, mb: 2 }} />)}
                </div>
              ))}
            </List>
          )
        ) : (
          // Надпись, если элементы отсутствуют
          <Typography variant="body1" align="center" sx={{ p: 3 }}>
            Элементы отсутствуют
          </Typography>
        )}
      </Paper>
    </Box>
  );
}

export default LibraryPage;