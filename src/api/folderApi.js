import axios from '../axios';

let mockFolders = [
  {
    _id: 1,
    name: 'Основная папка',
    description: 'Основная папка для экспериментов',
    createdAt: '2023-05-10T08:00:00Z',
    updatedAt: '2023-05-12T16:30:00Z',
    author: 'Иван Иванов',
    experiments: []
  },
  {
    _id: 2,
    name: 'Архив',
    description: 'Старые эксперименты',
    createdAt: '2023-05-18T11:20:00Z',
    updatedAt: '2023-05-20T09:45:00Z',
    author: 'Петр Петров',
    experiments: []
  },
  {
    _id: 3,
    name: 'Тестовая папка',
    description: 'Для тестирования функционала',
    createdAt: '2023-05-22T14:00:00Z',
    updatedAt: '2023-05-22T15:30:00Z',
    author: 'Сергей Сергеев',
    experiments: []
  }
];

export const folderApi = {
  getAll: async ({ search = '', sortBy = 'date' }) => {
    await new Promise(r => setTimeout(r, 500)); // Имитация задержки сети
    
    try {
      let data = [...mockFolders];
      
      // Фильтрация по поисковому запросу
      if (search) {
        const searchLower = search.toLowerCase();
        data = data.filter(folder => 
          folder.name.toLowerCase().includes(searchLower) ||
          folder.description.toLowerCase().includes(searchLower)
        );
      }
      
      // Сортировка
      if (sortBy === 'date') {
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (sortBy === 'name') {
        data.sort((a, b) => a.name.localeCompare(b.name));
      }
      
      return { data };
    } catch (error) {
      throw error;
    }
  },

  // Остальные методы остаются без изменений
  getById: async (id) => {
    try {
      const folder = mockFolders.find(f => f.id === parseInt(id));
      if (!folder) throw new Error('Папка не найдена');
      return { data: folder };
    } catch (error) {
      throw error;
    }
  },

  create: async (folderData) => {
    try {
      const newFolder = {
        id: Math.max(...mockFolders.map(f => f.id)) + 1,
        ...folderData,
        experimentIds: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockFolders.push(newFolder);
      return { data: newFolder };
    } catch (error) {
      throw error;
    }
  },

  update: async (id, folderData) => {
    try {
      const index = mockFolders.findIndex(f => f.id === parseInt(id));
      if (index === -1) throw new Error('Папка не найдена');
      
      mockFolders[index] = {
        ...mockFolders[index],
        ...folderData,
        updatedAt: new Date().toISOString()
      };
      
      return { data: mockFolders[index] };
    } catch (error) {
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const initialLength = mockFolders.length;
      mockFolders = mockFolders.filter(f => f.id !== parseInt(id));
      if (mockFolders.length === initialLength) {
        throw new Error('Папка не найдена');
      }
      return { data: { success: true } };
    } catch (error) {
      throw error;
    }
  },

  setExperiments: async (folderId, experimentIds) => {
    try {
      const index = mockFolders.findIndex(f => f.id === parseInt(folderId));
      if (index === -1) throw new Error('Папка не найдена');
      
      mockFolders[index] = {
        ...mockFolders[index],
        experimentIds,
        updatedAt: new Date().toISOString()
      };
      
      return { data: mockFolders[index] };
    } catch (error) {
      throw error;
    }
  }
};