import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LibraryPage from './pages/LibraryPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import MainLayout from './layouts/MainLayout';
import ExperimentLayout from './layouts/ExperimentLayout';
import CreateExperimentPage from './pages/CreateExperimentPage';
import FolderPage from './pages/FolderPage';
import ExperimentPage from './pages/ExperimentPage';
import SessionsListPage from './pages/SessionsListPage';
import SessionDetailPage from './pages/SessionDetailPage';
import ExperimentRunPage from './pages/ExperimentRunPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Главный layout для всех основных страниц */}
        <Route path="/" element={<MainLayout />}>
          {/* Основные разделы */}
          <Route index element={<LibraryPage />} />
          <Route path="library" element={<LibraryPage />} />
          <Route path="profile" element={<ProfilePage />} />

          {/* Работа с экспериментами */}
          <Route path="experiment">
            <Route path="create" element={<CreateExperimentPage />} />
            <Route path=":id" element={<ExperimentPage />} />
            <Route path=":id/sessions" element={<SessionsListPage />} />
          </Route>
          
          {/* Работа с папками */}
          <Route path="folder/:id" element={<FolderPage />} />

          <Route path="session/:id" element={<SessionDetailPage />} />
        </Route>

        {/* Отдельный layout для страницы запуска эксперимента без Header */}
        <Route path="/experiment/:id/run" element={<ExperimentLayout />}>
          <Route index element={<ExperimentRunPage />} />
        </Route>

        {/* Авторизация (без основного layout) */}
        <Route path="auth">
          <Route index element={<LoginPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        {/* Страница 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;