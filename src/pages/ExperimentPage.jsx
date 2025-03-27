import React, { useState } from "react";
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
  Alert
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

function ExperimentPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activeHistoryTab, setActiveHistoryTab] = useState(0);

  const [experiment, setExperiment] = useState({
    id: id,
    name: "Эксперимент 1",
    author: "Иван Иванов",
    createdAt: "01.01.2025",
    parameters: {
      backgroundColor: "#FFFFFF",
      symbolColor: "#000000",
      symbolType: "A",
      symbolFont: "Arial",
      symbolSize: 24,
      symbolSpacing: 10,
      stimulusTime: 0.5,
      responseTime: 10,
      pauseTime: 1,
    },
    sessions: [],
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
    navigate(`/experiment/${id}/run`);
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
    <Box sx={{ p: 3 }}>
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

      <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
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
      </Box>

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
