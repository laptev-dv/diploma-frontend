import axios from '../axios';

let mockUsers = [
  {
    id: 1,
    username: 'Иван Иванов',
    email: 'email@email.com',
    password: '1234' // В реальном приложении пароли должны быть хешированы!
  }
];

export const authApi = {
  // Вход в систему
  login: async (credentials) => {
    try {
      const user = mockUsers.find(u => 
        u.email === credentials.email && 
        u.password === credentials.password
      );
      
      if (!user) throw new Error('Неверные учетные данные');
      
      return {
        data: {
          token: 'mock-jwt-token-' + Math.random().toString(36).substring(2),
          user: {
            id: user.id,
            username: user.username,
            email: user.email
          }
        }
      };
    } catch (error) {
      throw error;
    }
  },

  // Выход из системы
  logout: async () => {
    try {
      // В реальном приложении здесь был бы запрос на сервер
      return { data: { success: true } };
    } catch (error) {
      throw error;
    }
  },

  // Регистрация
  register: async (userData) => {
    try {
      if (mockUsers.some(u => u.email === userData.email)) {
        throw new Error('Пользователь с таким email уже существует');
      }
      
      const newUser = {
        id: Math.max(...mockUsers.map(u => u.id)) + 1,
        ...userData
      };
      
      mockUsers.push(newUser);
      
      return {
        data: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email
        }
      };
    } catch (error) {
      throw error;
    }
  },

  // Проверка токена (для защищенных маршрутов)
  verifyToken: async (token) => {
    try {
      // В реальном приложении здесь была бы проверка токена на сервере
      if (!token) throw new Error('Токен не предоставлен');
      
      return {
        data: {
          valid: true,
          user: {
            id: 1,
            username: 'Иван Иванов',
            email: 'user@example.com'
          }
        }
      };
    } catch (error) {
      throw error;
    }
  }
};