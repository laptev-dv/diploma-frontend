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
  AppBar,
  Toolbar,
  Stack,
  Grid,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  CircularProgress,
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
import SessionItem from "../components/SessionItem";
import { sessionApi } from '../api/sessionApi';
import { experimentApi } from '../api/experimentApi';

function ExperimentPage() {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const isMediumScreen = useMediaQuery(theme.breakpoints.up("md"));

  const [anchorEl, setAnchorEl] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activeHistoryTab, setActiveHistoryTab] = useState(0);
  const [experimentLoading, setExperimentLoading] = useState(true);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [experiment, setExperiment] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [editedName, setEditedName] = useState("");

  const openMenu = Boolean(anchorEl);

  // Загрузка данных эксперимента
  useEffect(() => {
    const loadExperiment = async () => {
      try {
        setExperimentLoading(true);
        const response = await experimentApi.getById(id);
        setExperiment(response.data);
        setEditedName(response.data.name);
        
        // Предзагрузка шрифтов
        if (response.data.fontFamilies) {
          preloadFonts(response.data.fontFamilies);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setExperimentLoading(false);
      }
    };

    loadExperiment();
  }, [id]);

  // Загрузка сессий эксперимента
  useEffect(() => {
    const loadSessions = async () => {
      try {
        setSessionsLoading(true);
        const response = await sessionApi.getByExperiment(id);
        setSessions(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setSessionsLoading(false);
      }
    };

    if (id) {
      loadSessions();
    }
  }, [id]);

  const handleDeleteSession = async (sessionId) => {
    try {
      await sessionApi.delete(sessionId);
      setSessions(sessions.filter(s => s.id !== sessionId));
    } catch (err) {
      setError(err.message);
    }
  };
  
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

  const handleStartExperiment = () => {
    navigate(`/experiment/${id}/run`, { state: { experiment } });
  };

  const handleSaveChanges = async () => {
    try {
      const response = await experimentApi.update(id, { name: editedName });
      setExperiment(response.data);
      setEditDialogOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteExperiment = async () => {
    try {
      await experimentApi.delete(id);
      navigate("/library");
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleViewAllSessions = () => {
    navigate(`/experiment/${id}/sessions`);
  };

  if (!experiment && experimentLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden", mb: 3 }}>
          <Box
            sx={{
              p: 2,
              backgroundColor: theme.palette.grey[100],
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <IconButton onClick={() => navigate(-1)} size="small">
                <BackIcon />
              </IconButton>
              <CircularProgress size={24} />
            </Stack>
          </Box>
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <CircularProgress />
          </Box>
        </Paper>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  const filteredSessions =
    activeHistoryTab === 0
      ? sessions
      : sessions.filter((session) => session.isMine);

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
                    Создано: {new Date(experiment.createdAt).toLocaleDateString()} | Автор: {experiment.authorName}
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
                open={openMenu}
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

            {sessionsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : sessions.length > 0 ? (
              <>
                {isMediumScreen ? (
                  <Grid container spacing={2}>
                    {filteredSessions.slice(0, 4).map((session) => (
                      <Grid item xs={12} md={6} key={session._id}>
                        <Link
                          to={`/session/${session._id}`}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <SessionItem session={session} compact onDelete={handleDeleteSession}/>
                        </Link>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <List disablePadding>
                    {filteredSessions.slice(0, 3).map((session, index) => (
                      <Box key={session._id}>
                        <Link
                          to={`/session/${session._id}`}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <SessionItem
                            session={session}
                            onDelete={handleDeleteSession}
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

                {sessions.length > (isMediumScreen ? 4 : 3) && (
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

        {/* Параметры эксперимента */}
        {experimentLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            <Typography variant="h6" gutterBottom>
              Параметры
            </Typography>
            <ExperimentParameters 
              parameters={experiment}
            />
          </Box>
        )}
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
              disabled={experimentLoading}
            >
              Начать эксперимент
            </Button>
            <Button
              variant="outlined"
              startIcon={<InfoIcon />}
              onClick={handleOpenInstructions}
              disabled={experimentLoading}
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
          <Button 
            onClick={handleSaveChanges}
            disabled={!editedName.trim()}
          >
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Удалить эксперимент?</DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены, что хотите удалить эксперимент "{experiment?.name}"?
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