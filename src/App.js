// src/App.js
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LibraryPage from "./pages/LibraryPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import MainLayout from "./layouts/MainLayout";
import ExperimentLayout from "./layouts/ExperimentLayout";
import CreateExperimentPage from "./pages/CreateExperimentPage";
import FolderPage from "./pages/FolderPage";
import ExperimentPage from "./pages/ExperimentPage";
import SessionsListPage from "./pages/SessionsListPage";
import SessionDetailPage from "./pages/SessionDetailPage";
import ExperimentRunPage from "./pages/ExperimentRunPage";
import RequestResetPage from "./pages/RequestResetPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthRedirectRoute from "./components/AuthRedirectRoute";

function App() {
  return (
    <>
      <Routes>
        {/* Маршруты для авторизации - доступны ТОЛЬКО для НЕАВТОРИЗОВАННЫХ */}
        <Route element={<AuthRedirectRoute />}>
          <Route path="/auth">
            <Route index element={<LoginPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="request-reset" element={<RequestResetPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />
          </Route>
        </Route>

        {/* Защищённые маршруты - доступны ТОЛЬКО для АВТОРИЗОВАННЫХ */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<LibraryPage />} />
            <Route path="library" element={<LibraryPage />} />
            <Route path="profile" element={<ProfilePage />} />

            <Route path="experiment">
              <Route path="create" element={<CreateExperimentPage />} />
              <Route path=":id" element={<ExperimentPage />} />
              <Route path=":id/sessions" element={<SessionsListPage />} />
            </Route>

            <Route path="folder/:id" element={<FolderPage />} />
            <Route path="session/:id" element={<SessionDetailPage />} />
          </Route>

          <Route path="/experiment/:id/run" element={<ExperimentLayout />}>
            <Route index element={<ExperimentRunPage />} />
          </Route>
        </Route>

        {/* Страница 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
