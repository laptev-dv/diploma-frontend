import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../api/authApi';
import axios from '../utils/axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Проверка аутентификации при загрузке и изменении маршрута
  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (!token || !storedUser) {
        cleanupAuth();
        setIsLoading(false);
        return;
      }

      try {
        // Проверяем валидность токена на сервере
        const { data } = await authApi.verifyToken(token);
        
        if (data.valid) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
          
          // Редирект с auth-страниц если уже авторизован
          if (['/auth', '/auth/login', '/auth/register'].includes(location.pathname)) {
            navigate('/library');
          }
        } else {
          cleanupAuth();
        }
      } catch (error) {
        console.error('Auth verification error:', error);
        cleanupAuth();
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [location.pathname, navigate]);

  const cleanupAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
  };

  const login = async (credentials) => {
    try {
      const response = await authApi.login(credentials);
      const { token, ...userData } = response.data;
      
      // Сохраняем токен и данные пользователя
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Обновляем состояние
      setUser(userData);
      setIsAuthenticated(true);
      navigate('/library');
      
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      cleanupAuth();
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authApi.register(userData);
      
      // После успешной регистрации автоматически логиним пользователя
      if (response.data.token) {
        const { token, ...userData } = response.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        setUser(userData);
        setIsAuthenticated(true);
        navigate('/library');
      }
      
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await authApi.logout(token);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      cleanupAuth();
      navigate('/auth/login');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading,
      isAuthenticated,
      login, 
      register, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};