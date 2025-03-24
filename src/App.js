import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LibraryPage from './pages/LibraryPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';
import MainLayout from './layouts/MainLayout';
import CreateExperimentPage from './pages/CreateExperimentPage';
import FolderPage from './pages/FolderPage';
import ExperimentPage from './pages/ExperimentPage';
import ExperimentSessionsPage from './pages/ExperimentSessionsPage';
import SessionDetailPage from './pages/SessionDetailPage';
import AdditionalInfoPage from './pages/AdditionalInfoPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Главный layout для всех основных страниц */}
        <Route path="/" element={<MainLayout />}>
          {/* Основные разделы */}
          <Route index element={<LibraryPage />} />
          <Route path="library" element={<LibraryPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="additional-info" element={<AdditionalInfoPage />} />

          {/* Работа с экспериментами */}
          <Route path="experiment">
            <Route path="create" element={<CreateExperimentPage />} />
            <Route path=":id" element={<ExperimentPage />} />
            <Route path=":id/sessions" element={<ExperimentSessionsPage />} />
            <Route path=":id/run" element={<div>Страница проведения эксперимента</div>} />
          </Route>
          
          {/* Работа с папками */}
          <Route path="folder/:id" element={<FolderPage />} />

          <Route path="session/:id" element={<SessionDetailPage />} />
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