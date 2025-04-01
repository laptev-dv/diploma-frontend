import axios from '../axios';

export const userApi = {
  // Получение данных пользователя
  getProfile: async () => {
    try {
      // Моковый ответ
      return {
        data: {
          id: 1,
          username: 'Иван Иванов',
          email: 'user@example.com'
        }
      };
    } catch (error) {
      throw error;
    }
  },

  // Обновление имени пользователя
  updateUsername: async (newUsername) => {
    try {
      // Моковый ответ
      console.log(`Username updated to: ${newUsername}`);
      return { data: { success: true } };
    } catch (error) {
      throw error;
    }
  },

  // Удаление аккаунта
  deleteAccount: async () => {
    try {
      // Моковый ответ
      console.log('Account deletion request sent');
      return { data: { success: true } };
    } catch (error) {
      throw error;
    }
  },

  // Изменение пароля
  changePassword: async (currentPassword, newPassword) => {
    try {
      // Моковый ответ
      console.log('Password changed successfully');
      return { data: { success: true } };
    } catch (error) {
      throw error;
    }
  }
};