import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  Button,
  Tabs,
  Tab,
  Stack,
  IconButton,
  useTheme,
  AppBar,
  Toolbar
} from "@mui/material";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import {
  FileDownload as ExportIcon,
  Edit as EditIcon,
  ArrowBack as BackIcon,
  Person as MySessionsIcon,
  Info as InfoIcon
} from "@mui/icons-material";
import SessionItem from "../components/SessionItem";
import ExportSessionsDialog from "../components/ExportSessionsDialog";

function SessionsListPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [sessions, setSessions] = useState(
    Array(3).fill().map((_, i) => ({
      id: i + 1,
      author: `Автор ${i + 1}`,
      date: `0${i + 1}.01.2025 10:00`,
      duration: `${10 + i} мин`,
      isMine: i % 2 === 0,
    }))
  );

  const filteredSessions = activeTab === 0 ? sessions : sessions.filter(session => session.isMine);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleExportClick = () => {
    setExportDialogOpen(true);
  };

  const handleChangeData = () => {
    if (sessions.length === 0) {
      setSessions(
        Array(3).fill().map((_, i) => ({
          id: i + 1,
          author: `Автор ${i + 1}`,
          date: `0${i + 1}.01.2025 10:00`,
          duration: `${10 + i} мин`,
          isMine: i % 2 === 0,
        }))
      );
    } else if (sessions.length === 3) {
      setSessions(
        Array(5).fill().map((_, i) => ({
          id: i + 1,
          author: `Автор ${i + 1}`,
          date: `0${i + 1}.01.2025 10:00`,
          duration: `${10 + i} мин`,
          isMine: i % 2 === 0,
        }))
      );
    } else {
      setSessions([]);
    }
  };

  return (
    <Box sx={{ pb: 10 }}>
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          {/* Шапка с навигацией */}
          <Box sx={{ 
            p: 2, 
            backgroundColor: theme.palette.grey[100],
          }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <IconButton onClick={() => navigate(-1)} size="small">
                <BackIcon />
              </IconButton>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                Сессии эксперимента #{id}
              </Typography>
            </Stack>
          </Box>

          {/* Блок управления */}
          <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange}
                sx={{ minHeight: 40 }}
              >
                <Tab 
                  label="Все" 
                  sx={{ minHeight: 40 }} 
                />
                <Tab 
                  icon={<MySessionsIcon fontSize="small" />} 
                  iconPosition="start" 
                  label="Мои" 
                  sx={{ minHeight: 40 }} 
                />
              </Tabs>

              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={handleChangeData}
                size="small"
              >
                Тест данных
              </Button>
            </Stack>
          </Box>

          {/* Список сессий */}
          <Box sx={{ p: 2 }}>
            {sessions.length > 0 ? (
              <List disablePadding>
                {filteredSessions.map((session, index) => (
                  <Box key={session.id}>
                    <RouterLink
                      to={`/session/${session.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <SessionItem
                        session={session}
                        showDivider={index !== filteredSessions.length - 1}
                      />
                    </RouterLink>
                  </Box>
                ))}
              </List>
            ) : (
              <Box sx={{ 
                p: 3, 
                textAlign: 'center',
                backgroundColor: theme.palette.grey[50],
                borderRadius: 1
              }}>
                <Typography variant="body1" color="text.secondary">
                  Нет доступных сессий
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>

      {/* Фиксированная панель внизу */}
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          top: "auto",
          bottom: 0,
          borderTop: "1px solid",
          borderColor: "divider",
          backgroundColor: "background.default",
        }}
      >
        <Toolbar>
          <Stack direction="row" spacing={2} sx={{ flexGrow: 1 }} justifyContent="flex-end">
            <Button
              variant="contained"
              startIcon={<ExportIcon />}
              onClick={handleExportClick}
              disabled={sessions.length === 0}
            >
              Экспорт сессий
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <ExportSessionsDialog
        open={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        sessions={sessions}
      />
    </Box>
  );
}

export default SessionsListPage;