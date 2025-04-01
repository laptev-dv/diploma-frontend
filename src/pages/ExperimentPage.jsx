import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Tabs,
  Tab,
  List,
  IconButton,
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
  Grid,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Info as InfoIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as BackIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useNavigate, useParams, Link } from "react-router-dom";
import ExperimentParameters from "../components/experimentDetails/ExperimentParameters";
import axios from "axios";
import SessionItem from "../components/SessionItem";

function ExperimentPage() {
  const CACHE_KEY = "google-fonts-cache";
  const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 часа

  const theme = useTheme();

  const { id } = useParams();
  const navigate = useNavigate();
  const isMediumScreen = useMediaQuery(theme.breakpoints.up("md"));

  const [anchorEl, setAnchorEl] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activeHistoryTab, setActiveHistoryTab] = useState(0);

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
        const cached = localStorage.getItem(CACHE_KEY);
        const cachedData = cached ? JSON.parse(cached) : null;

        if (cachedData && Date.now() - cachedData.timestamp < CACHE_EXPIRY) {
          preloadFonts(cachedData.fonts);
          return;
        }

        const response = await axios.get(
          "https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyDgJzM14xNhFsgMoPqMcw14eSmfoIfgPd0&sort=popularity"
        );

        const popularFonts = response.data.items
          .filter((font) => font.subsets.includes("cyrillic"))
          .map((font) => font.family);

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            fonts: popularFonts,
            timestamp: Date.now(),
          })
        );

        preloadFonts(popularFonts);
      } catch (error) {
        console.error("Error fetching fonts:", error);
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const cachedFonts = JSON.parse(cached).fonts;
          preloadFonts(cachedFonts);
        }
      }
    };

    fetchFonts();
  }, [CACHE_EXPIRY]);

  const [experiment, setExperiment] = useState({
    id: id,
    name: "Эксперимент",
    author: "Иван Иванов",
    createdAt: "20.03.2025",
    parameters: {
      mode: "adaptive",
      efficiencyMin: 60,
      efficiencyMax: 85,
      initialTaskNumber: 1,
      seriesTime: 1,
      presentationsPerTask: 5,

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
            stimulusTime: 10000,
            responseTime: 4000,
            pauseTime: 100,
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
            stimulusTime: 10000,
            responseTime: 4000,
            pauseTime: 100,
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
            stimulusTime: 10000,
            responseTime: 4000,
            pauseTime: 100,
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
            stimulusTime: 10000,
            responseTime: 4000,
            pauseTime: 100,
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
            stimulusTime: 10000,
            responseTime: 4000,
            pauseTime: 100,
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
    <Box sx={{ pb: 10 }}>
      {/* Верхняя часть с информацией об эксперименте */}
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Paper
          elevation={2}
          sx={{ borderRadius: 2, overflow: "hidden", mb: 3 }}
        >
          {/* Шапка с навигацией и названием */}
          <Box
            sx={{
              p: 2,
              backgroundColor: theme.palette.grey[100],
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={2}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <IconButton onClick={() => navigate(-1)} size="small">
                  <BackIcon />
                </IconButton>

                <Stack direction="column" alignItems="start" spacing={0}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Создано: {experiment.createdAt} | Автор: {experiment.author}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    {experiment.name}
                  </Typography>
                </Stack>
              </Stack>
              <IconButton onClick={handleMenuOpen} size="small">
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleEditClick}>
                  <EditIcon fontSize="small" sx={{ mr: 1 }} />
                  Редактировать
                </MenuItem>
                <MenuItem onClick={handleDeleteClick}>
                  <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                  Удалить
                </MenuItem>
              </Menu>
            </Stack>
          </Box>

          {/* Блок управления режимом */}
          <Box
            sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <ToggleButtonGroup
                value={experiment.parameters.mode}
                exclusive
                onChange={handleModeChange}
                color="primary"
                size="small"
              >
                <ToggleButton value="adaptive">Адаптивный</ToggleButton>
                <ToggleButton value="strict">Жесткий</ToggleButton>
              </ToggleButtonGroup>

              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={handleChangeData}
                  size="small"
                >
                  Тест данных
                </Button>
              </Stack>
            </Stack>
          </Box>

          {/* Блок истории сессий */}
          <Box sx={{ p: 2 }}>
            <Typography gutterBottom>История сессий</Typography>

            <Tabs
              value={activeHistoryTab}
              onChange={handleHistoryTabChange}
              sx={{ mb: 2 }}
            >
              <Tab label="Все" />
              <Tab label="Мои" />
            </Tabs>

            {experiment.sessions.length > 0 ? (
              <>
                {isMediumScreen ? (
                  // Табличное представление для широких экранов
                  <Grid container spacing={2}>
                    {filteredSessions.slice(0, 4).map((session) => (
                      <Grid item xs={12} md={6} key={session.id}>
                        <Link
                          to={`/session/${session.id}`}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <SessionItem session={session} compact />
                        </Link>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  // Списковое представление для узких экранов
                  <List disablePadding>
                    {filteredSessions.slice(0, 3).map((session, index) => (
                      <Box key={session.id}>
                        <Link
                          to={`/session/${session.id}`}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <SessionItem
                            session={session}
                            showDivider={
                              index !== filteredSessions.length - 1 &&
                              index !== 2
                            }
                          />
                        </Link>
                      </Box>
                    ))}
                  </List>
                )}

                {experiment.sessions.length > (isMediumScreen ? 4 : 3) && (
                  <Button
                    fullWidth
                    endIcon={<ArrowForwardIcon />}
                    sx={{ mt: 2 }}
                    onClick={handleViewAllSessions}
                    size="small"
                  >
                    Посмотреть все
                  </Button>
                )}
              </>
            ) : (
              <Box
                sx={{
                  p: 2,
                  textAlign: "center",
                  backgroundColor: theme.palette.grey[50],
                  borderRadius: 1,
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  Нет сохраненных сессий
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>

        <Box>
          <Typography variant="h6" gutterBottom>
            Параметры
          </Typography>
          <ExperimentParameters parameters={experiment.parameters} />
        </Box>
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
          <Stack sx={{ flexGrow: 1 }} direction={"row-reverse"} gap={2}>
            <Button
              variant="contained"
              size="large"
              onClick={handleStartExperiment}
              sx={{ px: 4 }}
            >
              Начать эксперимент
            </Button>
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

      {/* Диалоговые окна */}
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
          <Button onClick={() => setEditDialogOpen(false)}>Отмена</Button>
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
          <Alert severity="error" sx={{ mt: 2 }}>
            Это действие нельзя отменить. Все данные будут удалены.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleDeleteExperiment} color="error">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ExperimentPage;
