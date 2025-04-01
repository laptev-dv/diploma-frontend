import axios from '../axios';

const API_BASE_URL = '/api/sessions';

let mockSessions = [
  {
    id: 1,
    experimentId: 1,
    name: 'Сессия 1',
    description: 'Первая тестовая сессия',
    status: 'completed',
    startedAt: '2023-05-16T10:00:00Z',
    finishedAt: '2023-05-16T11:30:00Z',
    results: { accuracy: 0.95, time: 120 }
  },
  {
    id: 2,
    experimentId: 1,
    name: 'Сессия 2',
    description: 'Вторая тестовая сессия',
    status: 'failed',
    startedAt: '2023-05-17T14:00:00Z',
    finishedAt: '2023-05-17T14:45:00Z',
    results: { error: 'Connection lost' }
  }
];

export const sessionApi = {
  // Получить все сессии эксперимента
  getByExperimentId: async (experimentId) => {
    try {
      const sessions = mockSessions.filter(s => s.experimentId === parseInt(experimentId));
      return { data: sessions };
    } catch (error) {
      throw error;
    }
  },

  // Получить сессию по ID
  getById: async (id) => {
    try {
      const session = mockSessions.find(s => s.id === parseInt(id));
      if (!session) throw new Error('Сессия не найдена');
      return { data: session };
    } catch (error) {
      throw error;
    }
  },

  // Создать новую сессию
  create: async (sessionData) => {
    try {
      const newSession = {
        id: Math.max(...mockSessions.map(s => s.id)) + 1,
        ...sessionData,
        startedAt: new Date().toISOString(),
        status: 'running'
      };
      mockSessions.push(newSession);
      return { data: newSession };
    } catch (error) {
      throw error;
    }
  },

  // Обновить сессию
  update: async (id, sessionData) => {
    try {
      const index = mockSessions.findIndex(s => s.id === parseInt(id));
      if (index === -1) throw new Error('Сессия не найдена');
      
      mockSessions[index] = {
        ...mockSessions[index],
        ...sessionData
      };
      
      return { data: mockSessions[index] };
    } catch (error) {
      throw error;
    }
  },

  // Завершить сессию
  complete: async (id, results) => {
    try {
      const index = mockSessions.findIndex(s => s.id === parseInt(id));
      if (index === -1) throw new Error('Сессия не найдена');
      
      mockSessions[index] = {
        ...mockSessions[index],
        status: 'completed',
        finishedAt: new Date().toISOString(),
        results
      };
      
      return { data: mockSessions[index] };
    } catch (error) {
      throw error;
    }
  },

  // Удалить сессию
  delete: async (id) => {
    try {
      const initialLength = mockSessions.length;
      mockSessions = mockSessions.filter(s => s.id !== parseInt(id));
      if (mockSessions.length === initialLength) {
        throw new Error('Сессия не найдена');
      }
      return { data: { success: true } };
    } catch (error) {
      throw error;
    }
  }
};