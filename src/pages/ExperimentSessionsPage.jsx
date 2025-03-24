import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  Button,
  Tabs,
  Tab,
  Stack,
  Link
} from '@mui/material';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import SessionItem from '../components/SessionItem';
import ExportSessionsDialog from '../components/ExportSessionsDialog';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function ExperimentSessionsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [sessions, setSessions] = useState(Array(3).fill().map((_, i) => ({
    id: i + 1,
    author: `Автор ${i + 1}`,
    date: `0${i + 1}.01.2025 10:00`,
    duration: `${10 + i} мин`,
    isMine: i % 2 === 0
  })));

  // Фильтрация сессий по вкладке
  const filteredSessions = activeTab === 0 
    ? sessions 
    : sessions.filter(session => session.isMine);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleExportClick = () => {
    setExportDialogOpen(true);
  };

  const handleChangeData = () => {
    // Переключаем между пустым списком, 3 сессиями и 5 сессиями
    if (sessions.length === 0) {
      setSessions(Array(3).fill().map((_, i) => ({
        id: i + 1,
        author: `Автор ${i + 1}`,
        date: `0${i + 1}.01.2025 10:00`,
        duration: `${10 + i} мин`,
        isMine: i % 2 === 0
      })));
    } else if (sessions.length === 3) {
      setSessions(Array(5).fill().map((_, i) => ({
        id: i + 1,
        author: `Автор ${i + 1}`,
        date: `0${i + 1}.01.2025 10:00`,
        duration: `${10 + i} мин`,
        isMine: i % 2 === 0
      })));
    } else {
      setSessions([]);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Кнопка назад */}
      <Link 
        component={RouterLink}
        variant="body1"
        style={{ textDecoration: "none" }}
        to={`/experiment/${id}`}
      >
        <ArrowBackIcon sx={{ mr: 1, fontSize: '1rem' }} />
        Назад к эксперименту
      </Link>

      {/* Заголовок и кнопки управления */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" gutterBottom>
          Все сессии эксперимента #{id}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            color='warning'
            onClick={handleChangeData}
            sx={{ mr: 1 }}
          >
            Изменить данные
          </Button>
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={handleExportClick}
            disabled={sessions.length === 0}
          >
            Экспорт
          </Button>
        </Stack>
      </Stack>

      {/* Табы и список сессий */}
      {sessions.length > 0 ? (
        <>
          <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
            <Tab label="Все" />
            <Tab label="Мои" />
          </Tabs>
          
          <Paper elevation={3} sx={{ p: 2 }}>
            <List>
              {filteredSessions.map((session, index) => (
                <SessionItem 
                  key={session.id} 
                  session={session} 
                  showDivider={index !== filteredSessions.length - 1}
                />
              ))}
            </List>
          </Paper>
        </>
      ) : (
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Элементы отсутствуют
          </Typography>
        </Paper>
      )}

      <ExportSessionsDialog
        open={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        sessions={sessions}
      />
    </Box>
  );
}

export default ExperimentSessionsPage;