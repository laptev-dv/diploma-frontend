import axios from '../axios';

let mockExperiments = [
  {
    id: 1,
    name: 'Эксперимент 1',
    description: 'Описание первого эксперимента',
    createdAt: '2023-05-15T10:30:00Z',
    updatedAt: '2023-05-16T14:20:00Z',
    folderId: 1
  },
  {
    id: 2,
    name: 'Эксперимент 2',
    description: 'Описание второго эксперимента',
    createdAt: '2023-05-20T09:15:00Z',
    updatedAt: '2023-05-21T11:45:00Z',
    folderId: 2
  }
];

export const experimentApi = {
  // Получить все эксперименты
  getAll: async () => {
    try {
      // Моковый ответ
      return { data: mockExperiments };
    } catch (error) {
      throw error;
    }
  },

  // Получить эксперимент по ID
  getById: async (id) => {
    try {
      const experiment = mockExperiments.find(exp => exp.id === parseInt(id));
      if (!experiment) throw new Error('Эксперимент не найден');
      return { data: experiment };
    } catch (error) {
      throw error;
    }
  },

  // Создать новый эксперимент
  create: async (experimentData) => {
    try {
      const newExperiment = {
        id: Math.max(...mockExperiments.map(exp => exp.id)) + 1,
        ...experimentData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockExperiments.push(newExperiment);
      return { data: newExperiment };
    } catch (error) {
      throw error;
    }
  },

  // Обновить эксперимент
  update: async (id, experimentData) => {
    try {
      const index = mockExperiments.findIndex(exp => exp.id === parseInt(id));
      if (index === -1) throw new Error('Эксперимент не найден');
      
      mockExperiments[index] = {
        ...mockExperiments[index],
        ...experimentData,
        updatedAt: new Date().toISOString()
      };
      
      return { data: mockExperiments[index] };
    } catch (error) {
      throw error;
    }
  },

  // Удалить эксперимент
  delete: async (id) => {
    try {
      const initialLength = mockExperiments.length;
      mockExperiments = mockExperiments.filter(exp => exp.id !== parseInt(id));
      if (mockExperiments.length === initialLength) {
        throw new Error('Эксперимент не найден');
      }
      return { data: { success: true } };
    } catch (error) {
      throw error;
    }
  }
};