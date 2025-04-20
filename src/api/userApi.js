import axios from '../axios';

export const userApi = {
  // Изменение пароля
  changePassword: async (currentPassword, newPassword) => {
    try {
      const { data } = await axios.put('/user/change-password', {
        currentPassword,
        newPassword
      });
      return { data };
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Удаление аккаунта
  deleteAccount: async () => {
    try {
      const { data } = await axios.delete('/user');
      return { data };
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Получение данных текущего пользователя
  getProfile: async () => {
    try {
      const { data } = await axios.get('/user/me');
      return { data };
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};