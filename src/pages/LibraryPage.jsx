import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, Button, TextField, Paper, List, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ExperimentItem from '../components/ExperimentItem';
import FolderItem from '../components/FolderItem';

function LibraryPage() {
  // Состояние для активной вкладки
  const [activeTab, setActiveTab] = useState(0);

  // Состояние для поиска
  const [searchQuery, setSearchQuery] = useState('');

  // Состояние для временного скрытия элементов
  const [isItemsHidden, setIsItemsHidden] = useState(false);

  // Пример данных экспериментов
  const [experiments, setExperiments] = useState([
    {
      id: 1,
      name: 'Эксперимент 1',
      author: 'Иван Иванов',
      resultsCount: 10,
      folder: 'Папка 1',
      createdAt: '2023-10-01',
    },
    {
      id: 2,
      name: 'Эксперимент 2',
      author: 'Петр Петров',
      resultsCount: 5,
      folder: null, // Одиночный эксперимент
      createdAt: '2023-10-05',
    },
  ]);

  // Пример данных папок
  const [folders, setFolders] = useState([
    {
      id: 1,
      name: 'Папка 1',
      itemsCount: 2,
      createdAt: '2023-09-28',
    },
    {
      id: 2,
      name: 'Папка 2',
      itemsCount: 3,
      createdAt: '2023-10-02',
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

  // Обработчик добавления
  const handleAdd = () => {
    alert(activeTab === 0 ? 'Добавить эксперимент' : 'Добавить папку');
  };

  // Обработчик временного скрытия элементов
  const handleToggleItems = () => {
    setIsItemsHidden((prev) => !prev);
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

        <Button variant="outlined" onClick={handleToggleItems}>
          {isItemsHidden ? 'Вернуть элементы' : 'Скрыть элементы'}
        </Button>

        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
          Добавить
        </Button>
      </Box>

      {/* Кнопки сортировки и поисковая строка (отображаются только если есть элементы) */}
      {hasItems && (
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button variant="outlined">Сортировать</Button>
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
                  {index != experiments.length-1 && (<Divider sx={{ mt: 2, mb: 2 }} />)}
                </div>
              ))}
            </List>
          ) : (
            // Список папок
            <List>
              {folders.map((folder, index) => (
                <div key={folder.id}>
                  <FolderItem folder={folder} />
                  {index != experiments.length-1 && (<Divider sx={{ mt: 2, mb: 2 }} />)}
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