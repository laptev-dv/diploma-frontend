import axios from '../axios';

const mockExperiments = [
  {
    id: 1,
    name: "Адаптивный эксперимент с цветами",
    author: "Иван Иванов",
    createdAt: "2023-05-15T10:30:00Z",
    mode: "adaptive",
    parameters: {
      efficiencyMin: 60,
      efficiencyMax: 85,
      initialTaskNumber: 1,
      seriesTime: 1,
      presentationsPerTask: 5,
      tasks: [
        {
          id: "task1",
          name: "Цветовая реакция 3×3",
          parameters: {
            rows: 3,
            columns: 3,
            backgroundColor: "#FFF8E1",
            symbolColor: "#FF6D00",
            symbolType: "■",
            symbolFont: "Arial",
            symbolHeight: 80,
            symbolWidth: 80,
            symbolSpacing: 10,
            stimulusTime: 8000,
            responseTime: 3000,
            pauseTime: 100,
          },
        },
        {
          id: "task2",
          name: "Цветовой анализ 4×4",
          parameters: {
            rows: 4,
            columns: 4,
            backgroundColor: "#E8F5E9",
            symbolColor: "#087F23",
            symbolType: "●",
            symbolFont: "Verdana",
            symbolHeight: 60,
            symbolWidth: 60,
            symbolSpacing: 8,
            stimulusTime: 10000,
            responseTime: 4000,
            pauseTime: 100,
          },
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
          efficiency: 0.65,
          completedTasks: 2,
        },
      },
      {
        id: "session2",
        author: "Испытуемый B",
        date: "2023-05-17T14:30:00Z",
        duration: "35 мин",
        isMine: true,
        results: {
          efficiency: 0.78,
          completedTasks: 2,
        },
      }
    ]
  },
  {
    id: 2,
    name: "Жесткий тест на внимание",
    author: "Петр Петров",
    createdAt: "2023-05-20T09:15:00Z",
    mode: "strict",
    parameters: {
      presentationsPerTask: 10,
      tasks: [
        {
          id: "task1",
          name: "Концентрация 2×2",
          parameters: {
            rows: 2,
            columns: 2,
            backgroundColor: "#E1F5FE",
            symbolColor: "#01579B",
            symbolType: "▲",
            symbolFont: "Times New Roman",
            symbolHeight: 90,
            symbolWidth: 90,
            symbolSpacing: 15,
            stimulusTime: 5000,
            responseTime: 2000,
            pauseTime: 100,
          },
        },
        {
          id: "task2",
          name: "Фокусировка 3×3",
          parameters: {
            rows: 3,
            columns: 3,
            backgroundColor: "#F3E5F5",
            symbolColor: "#6A1B9A",
            symbolType: "▼",
            symbolFont: "Courier New",
            symbolHeight: 70,
            symbolWidth: 70,
            symbolSpacing: 10,
            stimulusTime: 7000,
            responseTime: 3000,
            pauseTime: 100,
          },
        },
        {
          id: "task3",
          name: "Интенсив 4×4",
          parameters: {
            rows: 4,
            columns: 4,
            backgroundColor: "#FFEBEE",
            symbolColor: "#C62828",
            symbolType: "◆",
            symbolFont: "Georgia",
            symbolHeight: 50,
            symbolWidth: 50,
            symbolSpacing: 8,
            stimulusTime: 10000,
            responseTime: 4000,
            pauseTime: 100,
          },
        }
      ]
    },
    sessions: [
      {
        id: "session1",
        author: "Испытуемый C",
        date: "2023-05-21T11:00:00Z",
        duration: "45 мин",
        isMine: false,
        results: {
          efficiency: 0.72,
          completedTasks: 3,
        },
      },
      {
        id: "session2",
        author: "Испытуемый D",
        date: "2023-05-22T16:15:00Z",
        duration: "55 мин",
        isMine: true,
        results: {
          efficiency: 0.88,
          completedTasks: 3,
        },
      }
    ]
  },
  {
    id: 3,
    name: "Комбинированный адаптивный тест",
    author: "Сергей Сергеев",
    createdAt: "2023-05-25T14:20:00Z",
    mode: "adaptive",
    parameters: {
      efficiencyMin: 65,
      efficiencyMax: 90,
      initialTaskNumber: 2,
      seriesTime: 2,
      presentationsPerTask: 6,
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
          },
        },
        {
          id: "task2",
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
          },
        },
        {
          id: "task3",
          name: "Сложный анализ 3×5",
          parameters: {
            rows: 3,
            columns: 5,
            backgroundColor: "#E1F5FE",
            symbolColor: "#01579B",
            symbolType: "♣",
            symbolFont: "Times New Roman",
            symbolHeight: 64,
            symbolWidth: 64,
            symbolSpacing: 10,
            stimulusTime: 10000,
            responseTime: 4000,
            pauseTime: 100,
          },
        }
      ]
    },
    sessions: [
      {
        id: "session1",
        author: "Испытуемый E",
        date: "2023-05-26T09:30:00Z",
        duration: "40 мин",
        isMine: false,
        results: {
          efficiency: 0.68,
          completedTasks: 3,
        },
      },
      {
        id: "session2",
        author: "Испытуемый F",
        date: "2023-05-27T13:45:00Z",
        duration: "50 мин",
        isMine: true,
        results: {
          efficiency: 0.85,
          completedTasks: 3,
        },
      },
      {
        id: "session3",
        author: "Испытуемый G",
        date: "2023-05-28T15:20:00Z",
        duration: "60 мин",
        isMine: false,
        results: {
          efficiency: 0.75,
          completedTasks: 3,
        },
      }
    ]
  },
  {
    id: 4,
    name: "Строгий тест на скорость",
    author: "Алексей Алексеев",
    createdAt: "2023-06-01T08:45:00Z",
    mode: "strict",
    parameters: {
      presentationsPerTask: 8,
      tasks: [
        {
          id: "task1",
          name: "Экстремальный тест 5×5",
          parameters: {
            rows: 5,
            columns: 5,
            backgroundColor: "#F3E5F5",
            symbolColor: "#6A1B9A",
            symbolType: "◉",
            symbolFont: "Courier New",
            symbolHeight: 32,
            symbolWidth: 32,
            symbolSpacing: 5,
            stimulusTime: 10000,
            responseTime: 4000,
            pauseTime: 100,
          },
        },
        {
          id: "task2",
          name: "Переменный ритм 4×2",
          parameters: {
            rows: 4,
            columns: 2,
            backgroundColor: "#FFEBEE",
            symbolColor: "#C62828",
            symbolType: "!",
            symbolFont: "Verdana",
            symbolHeight: 54,
            symbolWidth: 54,
            symbolSpacing: 12,
            stimulusTime: 10000,
            responseTime: 4000,
            pauseTime: 100,
          },
        }
      ]
    },
    sessions: [
      {
        id: "session1",
        author: "Испытуемый H",
        date: "2023-06-02T10:15:00Z",
        duration: "30 мин",
        isMine: true,
        results: {
          efficiency: 0.92,
          completedTasks: 2,
        },
      }
    ]
  }
];

export const experimentApi = {
  getAll: async ({ search = '', sortBy = 'date' }) => {
    await new Promise(r => setTimeout(r, 500)); // Имитация задержки сети
    
    try {
      let data = [...mockExperiments];
      
      // Фильтрация по поисковому запросу
      if (search) {
        const searchLower = search.toLowerCase();
        data = data.filter(exp => 
          exp.name.toLowerCase().includes(searchLower) ||
          exp.description.toLowerCase().includes(searchLower)
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
  getByIdWithDetails: async (id) => {
    try {
      const experiment = mockExperiments.find(exp => exp.id === parseInt(id));
      if (!experiment) throw new Error('Эксперимент не найден');
      
      const fontFamilies = experiment.parameters.tasks.map(
        task => task.parameters.symbolFont
      );
      
      return { 
        data: {
          ...experiment,
          fontFamilies: [...new Set(fontFamilies)]
        }
      };
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