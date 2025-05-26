import axios from "axios";

const instance = axios.create({
    // baseURL: 'http://localhost:4334',
    baseURL: 'http://192.168.1.213:4334',
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

// Добавляем функцию для изменения baseURL
function setBaseURL(newUrl) {
    instance.defaults.baseURL = newUrl;
    console.log('BaseURL changed to:', newUrl);
}

// Делаем функцию доступной в глобальной области видимости
window.setBaseURL = setBaseURL;

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/auth/login';
        }
        return Promise.reject(error);
    }
);

export default instance;