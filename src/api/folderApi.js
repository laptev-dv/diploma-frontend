import axios from '../axios';

let mockFolders = [
  {
    id: 1,
    name: 'Основная папка',
    description: 'Основная папка для экспериментов',
    createdAt: '2023-05-10T08:00:00Z',
    updatedAt: '2023-05-12T16:30:00Z'
  },
  {
    id: 2,
    name: 'Архив',
    description: 'Старые эксперименты',
    createdAt: '2023-05-18T11:20:00Z',
    updatedAt: '2023-05-20T09:45:00Z'
  }
];

export const folderApi = {
  // Получить все папки
  getAll: async () => {
    try {
      return { data: mockFolders };
    } catch (error) {
      throw error;
    }
  },

  // Получить папку по ID
  getById: async (id) => {
    try {
      const folder = mockFolders.find(f => f.id === parseInt(id));
      if (!folder) throw new Error('Папка не найдена');
      return { data: folder };
    } catch (error) {
      throw error;
    }
  },

  // Создать новую папку
  create: async (folderData) => {
    try {
      const newFolder = {
        id: Math.max(...mockFolders.map(f => f.id)) + 1,
        ...folderData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockFolders.push(newFolder);
      return { data: newFolder };
    } catch (error) {
      throw error;
    }
  },

  // Обновить папку
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

  // Удалить папку
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

  // Получить эксперименты в папке
  getExperiments: async (folderId) => {
    try {
      // В реальном приложении это был бы отдельный запрос
      const experiments = mockExperiments.filter(exp => exp.folderId === parseInt(folderId));
      return { data: experiments };
    } catch (error) {
      throw error;
    }
  }
};