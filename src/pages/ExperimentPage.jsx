import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Tabs,
  Tab,
  List,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  ToggleButtonGroup,
  ToggleButton,
  AppBar,
  Toolbar,
  Stack,
} from "@mui/material";
import {
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Info as InfoIcon,
  Delete as DeleteIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { useNavigate, useParams, Link } from "react-router-dom";
import SessionItem from "../components/SessionItem";
import ExperimentParameters from "../components/experimentDetails/ExperimentParameters";
import axios from "axios";

function ExperimentPage() {
  const CACHE_KEY = "google-fonts-cache";
  const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 часа

  const { id } = useParams();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activeHistoryTab, setActiveHistoryTab] = useState(0);

  // Функция для предварительной загрузки всех шрифтов
  const preloadFonts = (fontFamilies) => {
    fontFamilies.forEach((fontFamily) => {
      const link = document.createElement("link");
      link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(
        / /g,
        "+"
      )}&display=swap`;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    });
  };

  useEffect(() => {
    const fetchFonts = async () => {
      try {
        // Проверяем кэш
        const cached = localStorage.getItem(CACHE_KEY);
        const cachedData = cached ? JSON.parse(cached) : null;

        if (cachedData && Date.now() - cachedData.timestamp < CACHE_EXPIRY) {
          preloadFonts(cachedData.fonts); // Предзагружаем шрифты из кэша
          return;
        }

        // Получаем список шрифтов из Google Fonts API
        const response = await axios.get(
          "https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyDgJzM14xNhFsgMoPqMcw14eSmfoIfgPd0&sort=popularity"
        );

        const popularFonts = response.data.items
          .filter((font) => font.subsets.includes("cyrillic"))
          .map((font) => font.family);

        // Сохраняем в кэш
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            fonts: popularFonts,
            timestamp: Date.now(),
          })
        );

        preloadFonts(popularFonts); // Предзагружаем новые шрифты
      } catch (error) {
        console.error("Error fetching fonts:", error);
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const cachedFonts = JSON.parse(cached).fonts;
          preloadFonts(cachedFonts); // Предзагружаем шрифты из кэша даже при ошибке
        }
      }
    };

    fetchFonts();
  });

  const [experiment, setExperiment] = useState({
    id: id,
    name: "Эксперимент",
    author: "Иван Иванов",
    createdAt: "20.03.2025",
    parameters: {
      mode: "adaptive",
      efficiencyMin: 0.6,
      efficiencyMax: 0.85,
      initialTaskNumber: 1,
      seriesTime: 15,
      presentationsPerTask: 50,

      tasks: [
        {
          id: "task1",
          name: "Быстрая реакция 2×3",
          parameters: {
            rows: 2,
            columns: 3,
            backgroundColor: "#FFF8E1",
            symbolColor: "#FF6D00",
            symbolType: "А",
            symbolFont: "Rubik Maze",
            symbolHeight: 128,
            symbolWidth: 128,
            symbolSpacing: 15,
            stimulusTime: 800, // Очень короткое время
            responseTime: 500, // Минимальное время ответа
            pauseTime: 300, // Короткая пауза
          },
        },
        {
          id: "task2",
          name: "Стандарт 4×4",
          parameters: {
            rows: 4,
            columns: 4,
            backgroundColor: "#E8F5E9",
            symbolColor: "#087F23",
            symbolType: "★",
            symbolFont: "Segoe UI",
            symbolHeight: 64,
            symbolWidth: 64,
            symbolSpacing: 8,
            stimulusTime: 1500, // Среднее время
            responseTime: 2000, // Достаточное время для ответа
            pauseTime: 1000, // Стандартная пауза
          },
        },
        {
          id: "task3",
          name: "Сложный анализ 3×5",
          parameters: {
            rows: 3,
            columns: 5,
            backgroundColor: "#E1F5FE",
            symbolColor: "#01579B",
            symbolType: "♣",
            symbolFont: "Times New Roman",
            symbolHeight: 64,
            symbolWidth: 64,
            symbolSpacing: 10,
            stimulusTime: 2500, // Длительное время стимула
            responseTime: 3500, // Максимальное время ответа
            pauseTime: 1500, // Длинная пауза
          },
        },
        {
          id: "task4",
          name: "Экстремальный тест 5×5",
          parameters: {
            rows: 5,
            columns: 5,
            backgroundColor: "#F3E5F5",
            symbolColor: "#6A1B9A",
            symbolType: "◉",
            symbolFont: "Courier New",
            symbolHeight: 32,
            symbolWidth: 32,
            symbolSpacing: 5,
            stimulusTime: 500, // Очень быстрое мелькание
            responseTime: 4000, // Очень долгое время ответа
            pauseTime: 2000, // Долгая пауза
          },
        },
        {
          id: "task5",
          name: "Переменный ритм 4×2",
          parameters: {
            rows: 4,
            columns: 2,
            backgroundColor: "#FFEBEE",
            symbolColor: "#C62828",
            symbolType: "!",
            symbolFont: "Verdana",
            symbolHeight: 54,
            symbolWidth: 54,
            symbolSpacing: 12,
            stimulusTime: 1200, // Среднее время
            responseTime: 800, // Быстрый ответ
            pauseTime: 500, // Средняя пауза
          },
        },
      ],
    },
    sessions: [
      {
        id: "session1",
        author: "Испытуемый A",
        date: "20.03.2025 10:00",
        duration: "25 мин",
        isMine: false,
        results: {
          efficiency: 0.55,
          completedTasks: 3,
        },
      },
      {
        id: "session2",
        author: "Испытуемый B",
        date: "20.03.2025 14:30",
        duration: "42 мин",
        isMine: true,
        results: {
          efficiency: 0.82,
          completedTasks: 5,
        },
      },
    ],
  });

  const [editedName, setEditedName] = useState(experiment.name);

  const handleOpenInstructions = () => {
    window.open("/experiment-guide.pdf", "_blank");
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    setEditedName(experiment.name);
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleHistoryTabChange = (event, newValue) => {
    setActiveHistoryTab(newValue);
  };

  const filteredSessions =
    activeHistoryTab === 0
      ? experiment.sessions
      : experiment.sessions.filter((session) => session.isMine);

  const handleStartExperiment = () => {
    navigate(`/experiment/${id}/run`, { state: { experiment } });
  };

  const handleModeChange = (event, newMode) => {
    if (newMode !== null) {
      setExperiment((prev) => ({
        ...prev,
        parameters: {
          ...prev.parameters,
          mode: newMode,
          // Обновляем режим для всех задач
          tasks: prev.parameters.tasks.map((task) => ({
            ...task,
            parameters: {
              ...task.parameters,
              mode: newMode,
            },
          })),
        },
      }));
    }
  };

  const handleSaveChanges = () => {
    setExperiment({ ...experiment, name: editedName });
    setEditDialogOpen(false);
  };

  const handleDeleteExperiment = () => {
    navigate("/library");
  };

  const handleViewAllSessions = () => {
    navigate(`/experiment/${id}/sessions`);
  };

  const handleChangeData = () => {
    const newSessionsCount =
      experiment.sessions.length === 0
        ? 2
        : experiment.sessions.length === 2
        ? 5
        : 0;
    const newSessions = Array(newSessionsCount)
      .fill()
      .map((_, i) => ({
        id: i + 1,
        author: `Автор ${i + 1}`,
        date: `0${i + 1}.01.2025 10:00`,
        duration: `${10 + i} мин`,
        isMine: i % 2 === 0,
      }));
    setExperiment({ ...experiment, sessions: newSessions });
  };

  return (
    <Box sx={{ p: 3, pb: 10 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h4" sx={{ mr: 2 }}>
            {experiment.name}
          </Typography>
          <Button
            variant="outlined"
            color="warning"
            startIcon={<EditIcon />}
            onClick={handleChangeData}
          >
            Изменить данные
          </Button>
          <ToggleButtonGroup
            value={experiment.parameters.mode}
            exclusive
            onChange={handleModeChange}
            color="warning"
            size="small"
            sx={{ ml: 2 }}
          >
            <ToggleButton value="adaptive">Адаптивный</ToggleButton>
            <ToggleButton value="strict">Жесткий</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <IconButton onClick={handleMenuOpen}>
          <MoreVertIcon />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleEditClick}>
            <EditIcon sx={{ mr: 1 }} /> Редактировать
          </MenuItem>
          <MenuItem onClick={handleDeleteClick}>
            <DeleteIcon sx={{ mr: 1 }} /> Удалить
          </MenuItem>
        </Menu>
      </Box>

      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        Создано: {experiment.createdAt} | Автор: {experiment.author}
      </Typography>

      <Typography variant="h6" gutterBottom>
        История
      </Typography>
      <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
        {experiment.sessions.length > 0 ? (
          <>
            <Tabs
              value={activeHistoryTab}
              onChange={handleHistoryTabChange}
              sx={{ mb: 2 }}
            >
              <Tab label="Все" />
              <Tab label="Мои" />
            </Tabs>

            <List>
              {filteredSessions.slice(0, 3).map((session, index) => (
                <Link
                  key={session.id}
                  to={`/session/${session.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <SessionItem
                    session={session}
                    showDivider={
                      index !== filteredSessions.length - 1 && index !== 2
                    }
                  />
                </Link>
              ))}

              {filteredSessions.length > 3 && (
                <Button
                  fullWidth
                  endIcon={<ArrowForwardIcon />}
                  sx={{ mt: 1 }}
                  onClick={handleViewAllSessions}
                >
                  Посмотреть все
                </Button>
              )}
            </List>
          </>
        ) : (
          <Typography variant="body1" align="center" sx={{ p: 2 }}>
            Нет сохраненных попыток
          </Typography>
        )}
      </Paper>

      <Typography variant="h6" gutterBottom>
        Параметры
      </Typography>

      <ExperimentParameters parameters={experiment.parameters} />

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
          <Stack sx={{ flexGrow: 1 }} direction={'row-reverse'} gap={2}>
            <Button
              variant="contained"
              size="large"
              onClick={handleStartExperiment}
              sx={{ px: 4 }}
            >
              Начать эксперимент
            </Button>{" "}
            <Button
              variant="outlined"
              startIcon={<InfoIcon />}
              onClick={handleOpenInstructions}
            >
              Инструкция
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Редактировать эксперимент</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Название эксперимента"
            fullWidth
            variant="standard"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSaveChanges}>Сохранить</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Удалить эксперимент?</DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены, что хотите удалить эксперимент "{experiment.name}"?
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            Это действие нельзя отменить.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteExperiment} color="error">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ExperimentPage;
