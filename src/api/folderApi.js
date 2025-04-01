import axios from '../axios';

let mockFolders = [
  {
    id: 1,
    name: 'Основная папка',
    description: 'Основная папка для экспериментов',
    createdAt: '2023-05-10T08:00:00Z',
    updatedAt: '2023-05-12T16:30:00Z',
    experimentIds: [1, 2]
  },
  {
    id: 2,
    name: 'Архив',
    description: 'Старые эксперименты',
    createdAt: '2023-05-18T11:20:00Z',
    updatedAt: '2023-05-20T09:45:00Z',
    experimentIds: [3, 4]
  }
];

let mockExperiments = [
  { id: 1, name: 'Эксперимент 1', author: 'Иван Иванов' },
  { id: 2, name: 'Эксперимент 2', author: 'Петр Петров' },
  { id: 3, name: 'Эксперимент 3', author: 'Сергей Сергеев' },
  { id: 4, name: 'Эксперимент 4', author: 'Алексей Алексеев' },
  { id: 5, name: 'Эксперимент 5', author: 'Дмитрий Дмитриев' }
];

export const folderApi = {
  // Получить папку по ID с экспериментами
  getByIdWithExperiments: async (id) => {
    try {
      const folder = mockFolders.find(f => f.id === parseInt(id));
      if (!folder) throw new Error('Папка не найдена');
      
      const experiments = mockExperiments.filter(exp => 
        folder.experimentIds.includes(exp.id)
      );
      
      return { 
        data: {
          ...folder,
          experiments
        }
      };
    } catch (error) {
      throw error;
    }
  },

  // Обновить эксперименты в папке
  setExperiments: async (folderId, experimentIds) => {
    try {
      const index = mockFolders.findIndex(f => f.id === parseInt(folderId));
      if (index === -1) throw new Error('Папка не найдена');
      
      mockFolders[index] = {
        ...mockFolders[index],
        experimentIds,
        updatedAt: new Date().toISOString()
      };
      
      const experiments = mockExperiments.filter(exp => 
        experimentIds.includes(exp.id)
      );
      
      return { 
        data: {
          ...mockFolders[index],
          experiments
        }
      };
    } catch (error) {
      throw error;
    }
  },

  // Остальные методы остаются без изменений
  getAll: async () => {
    await new Promise(r => setTimeout(r, 2000));
    try {
      return { data: mockFolders };
    } catch (error) {
      throw error;
    }
  },

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
  }
};

export const experimentApi = {
  getAll: async () => {
    try {
      return { data: mockExperiments };
    } catch (error) {
      throw error;
    }
  }
};