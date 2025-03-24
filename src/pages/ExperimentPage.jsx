import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
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
  Table,
  TableBody,
  TableCell,
  TableRow,
  Chip,
  Stack,
} from "@mui/material";
import {
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Info as InfoIcon,
  Delete as DeleteIcon,
  FileDownload as FileDownloadIcon,
  ArrowForward as ArrowForwardIcon,
  Fullscreen as FullscreenIcon,
} from "@mui/icons-material";
import { useNavigate, useParams, Link } from "react-router-dom";
import SessionItem from "../components/SessionItem";

function ExperimentPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Состояния для меню и диалогов
  const [anchorEl, setAnchorEl] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activeHistoryTab, setActiveHistoryTab] = useState(0);

  // Данные эксперимента (заглушка)
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
      responseTime: 2,
      pauseTime: 1,
    },
    sessions: [],
  });

  // Состояние для редактирования
  const [editedName, setEditedName] = useState(experiment.name);

  // Обработчик открытия PDF инструкции
  const handleOpenInstructions = () => {
    window.open("/instructions.pdf", "_blank");
  };

  // Обработчики меню
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

  // Обработчики вкладок истории
  const handleHistoryTabChange = (event, newValue) => {
    setActiveHistoryTab(newValue);
  };

  // Фильтрация сессий по вкладке
  const filteredSessions =
    activeHistoryTab === 0
      ? experiment.sessions
      : experiment.sessions.filter((session) => session.isMine);

  // Обработчик начала эксперимента
  const handleStartExperiment = () => {
    navigate(`/experiment/${id}/run`);
  };

  // Обработчик сохранения изменений
  const handleSaveChanges = () => {
    setExperiment({ ...experiment, name: editedName });
    setEditDialogOpen(false);
  };

  // Обработчик удаления эксперимента
  const handleDeleteExperiment = () => {
    // Здесь должна быть логика удаления
    navigate("/library");
  };

  // Обработчик просмотра всех сессий
  const handleViewAllSessions = () => {
    navigate(`/experiment/${id}/sessions`);
  };

  // Обработчик изменения данных (для демонстрации)
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

  // Генерация сетки 4x4 символов для превью
  const renderSymbolGrid = () => {
    const symbol = experiment.parameters.symbolType;
    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: `${experiment.parameters.symbolSpacing}px`,
          width: "100%",
          height: "100%",
          placeItems: "center",
        }}
      >
        {Array(16).fill(symbol).map((char, index) => (
          <Typography
            key={index}
            sx={{
              color: experiment.parameters.symbolColor,
              fontFamily: experiment.parameters.symbolFont,
              fontSize: `${experiment.parameters.symbolSize}px`,
              lineHeight: 1,
            }}
          >
            {char}
          </Typography>
        ))}
      </Box>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Заголовок и кнопки управления */}
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

      {/* Информация об авторе и дате */}
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        Создано: {experiment.createdAt} | Автор: {experiment.author}
      </Typography>

      {/* Кнопки начала эксперимента и информации */}
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

      {/* Блок истории */}
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

      {/* Блок параметров и превью */}
      <Typography variant="h6" gutterBottom>
        Параметры
      </Typography>
      <Box sx={{ display: "flex", gap: 3 }}>
        <Paper elevation={3} sx={{ p: 2, flex: 1 }}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Цвет фона</TableCell>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Chip
                      sx={{
                        backgroundColor: experiment.parameters.backgroundColor,
                        width: 24,
                        height: 24,
                        border: "1px solid #ccc",
                      }}
                    />
                    <span>{experiment.parameters.backgroundColor}</span>
                  </Stack>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Цвет символа</TableCell>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Chip
                      sx={{
                        backgroundColor: experiment.parameters.symbolColor,
                        width: 24,
                        height: 24,
                        border: "1px solid #ccc",
                      }}
                    />
                    <span>{experiment.parameters.symbolColor}</span>
                  </Stack>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Вид символа</TableCell>
                <TableCell>{experiment.parameters.symbolType}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Шрифт символа</TableCell>
                <TableCell>{experiment.parameters.symbolFont}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Размер символа</TableCell>
                <TableCell>{experiment.parameters.symbolSize} пикс</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Расстояние между символами</TableCell>
                <TableCell>
                  {experiment.parameters.symbolSpacing} пикс
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Время предъявления стимула</TableCell>
                <TableCell>{experiment.parameters.stimulusTime} с</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Время ожидания ответа</TableCell>
                <TableCell>{experiment.parameters.responseTime} с</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Время паузы</TableCell>
                <TableCell>{experiment.parameters.pauseTime} с</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>

        {/* Превью эксперимента */}
        <Paper elevation={3} sx={{ p: 2, width: "50%", display: "flex", flexDirection: "column" }}>
          <Box
            sx={{
              flex: 1,
              backgroundColor: experiment.parameters.backgroundColor,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: 2,
              position: "relative",
              minHeight: "300px",
            }}
          >
            {renderSymbolGrid()}
          </Box>
          <Button 
            fullWidth 
            startIcon={<FullscreenIcon />}
            sx={{ mt: "auto" }}
          >
            Полный экран
          </Button>
        </Paper>
      </Box>

      {/* Диалог редактирования */}
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
          <Button onClick={handleSaveChanges} variant="contained">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог удаления */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Удалить эксперимент?</DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены, что хотите удалить эксперимент "{experiment.name}"?
          </Typography>
          <Typography color="error" sx={{ mt: 2 }}>
            Это действие нельзя отменить.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Отмена</Button>
          <Button
            onClick={handleDeleteExperiment}
            color="error"
            variant="contained"
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ExperimentPage;