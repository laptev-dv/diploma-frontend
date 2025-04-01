import axios from '../axios';

export const authApi = {
  // Вход в систему
  login: async (credentials) => {
    try {
      const response = await axios.post('/auth/login', {
        email: credentials.email,
        password: credentials.password
      });
      
      return {
        data: {
          token: response.data.token,
          user: {
            id: response.data._id,
            email: response.data.email
          }
        }
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ошибка авторизации');
    }
  },

  // Выход из системы (добавим на бэкенде)
  logout: async (token) => {
    try {
      await axios.post('/auth/logout', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return { data: { success: true } };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ошибка выхода');
    }
  },

  // Регистрация
  register: async (userData) => {
    try {
      const response = await axios.post('/auth/register', {
        email: userData.email,
        password: userData.password
      });
      
      return {
        data: {
          id: response.data._id,
          email: response.data.email,
          token: response.data.token
        }
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ошибка регистрации');
    }
  },

  // Проверка токена
  verifyToken: async (token) => {
    try {
      const response = await axios.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      return {
        data: {
          valid: true,
          user: {
            id: response.data._id,
            email: response.data.email
          }
        }
      };
    } catch (error) {
      throw new Error(error.response?.data?.message);
    }
  }
};