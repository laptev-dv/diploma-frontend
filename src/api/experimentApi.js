import axios from '../axios';

let mockExperiments = [
  {
    id: 1,
    name: 'Адаптивный эксперимент',
    description: 'Эксперимент с адаптивными параметрами',
    author: 'Иван Иванов',
    mode: 'adaptive',
    createdAt: '2023-05-15T10:30:00Z',
    updatedAt: '2023-05-16T14:20:00Z',
    folderId: 1,
    parameters: {
      efficiencyMin: 60,
      efficiencyMax: 85,
      initialTaskNumber: 1,
      seriesTime: 1,
      presentationsPerTask: 5,
      tasks: [
        {
          id: "task1",
          name: "Быстрая реакция 2×3",
          parameters: {
            rows: 2,
            columns: 3,
            backgroundColor: "#FFF8E1",
            symbolColor: "#FF6D00",
            symbolType: "А",
            symbolFont: "Rubik Maze",
            symbolHeight: 128,
            symbolWidth: 128,
            symbolSpacing: 15,
            stimulusTime: 10000,
            responseTime: 4000,
            pauseTime: 100,
          }
        }
      ]
    },
    sessions: [
      {
        id: "session1",
        author: "Испытуемый A",
        date: "2023-05-16T10:00:00Z",
        duration: "25 мин",
        isMine: false,
        results: {
          efficiency: 0.55,
          completedTasks: 3,
        },
      }
    ]
  },
  {
    id: 2,
    name: 'Жесткий эксперимент',
    description: 'Эксперимент с фиксированными параметрами',
    author: 'Петр Петров',
    mode: 'strict',
    createdAt: '2023-05-20T09:15:00Z',
    updatedAt: '2023-05-21T11:45:00Z',
    folderId: 2,
    parameters: {
      presentationsPerTask: 5,
      tasks: [
        {
          id: "task1",
          name: "Стандарт 4×4",
          parameters: {
            rows: 4,
            columns: 4,
            backgroundColor: "#E8F5E9",
            symbolColor: "#087F23",
            symbolType: "★",
            symbolFont: "Segoe UI",
            symbolHeight: 64,
            symbolWidth: 64,
            symbolSpacing: 8,
            stimulusTime: 10000,
            responseTime: 4000,
            pauseTime: 100,
          }
        }
      ]
    },
    sessions: [
      {
        id: "session2",
        author: "Испытуемый B",
        date: "2023-05-21T14:30:00Z",
        duration: "42 мин",
        isMine: true,
        results: {
          efficiency: 0.82,
          completedTasks: 5,
        },
      }
    ]
  }
];

export const experimentApi = {
  // Получить эксперимент по ID с полными данными
  getByIdWithDetails: async (id) => {
    try {
      const experiment = mockExperiments.find(exp => exp.id === parseInt(id));
      if (!experiment) throw new Error('Эксперимент не найден');
      
      // Добавляем информацию о шрифтах
      const fontFamilies = experiment.parameters.tasks.map(
        task => task.parameters.symbolFont
      );
      
      return { 
        data: {
          ...experiment,
          fontFamilies: [...new Set(fontFamilies)] // Уникальные шрифты
        }
      };
    } catch (error) {
      throw error;
    }
  },

  // Остальные методы остаются без изменений
  getAll: async () => {
    await new Promise(r => setTimeout(r, 1000));
    try {
      return { data: mockExperiments };
    } catch (error) {
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const experiment = mockExperiments.find(exp => exp.id === parseInt(id));
      if (!experiment) throw new Error('Эксперимент не найден');
      return { data: experiment };
    } catch (error) {
      throw error;
    }
  },

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

  delete: async (id) => {
    try {
      const initialLength = mockExperiments.length;
      mockExperiments = mockExperiments.filter(exp => exp.id !== parseInt(id));
      if (mockExperiments.length === initialLength) {
        throw new Error('Эксперимент не найдена');
      }
      return { data: { success: true } };
    } catch (error) {
      throw error;
    }
  }
};