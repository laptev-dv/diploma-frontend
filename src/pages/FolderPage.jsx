import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Paper,
  List,
  Stack,
  ListItemIcon,
  ListItemText,
  useTheme,
  CircularProgress,
  Alert
} from "@mui/material";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  ArrowBack as BackIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import FolderExperimentItem from "../components/FolderExperimentItem";
import AddToFolderDialog from "../components/AddToFolderDialog";
import EditFolderDialog from "../components/EditFolderDialog";
import { folderApi } from "../api/folderApi";

function FolderPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();

  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [folder, setFolder] = useState(null);

  const openMenu = Boolean(anchorEl);

  // Загрузка данных папки
  useEffect(() => {
    const loadFolder = async () => {
      try {
        setLoading(true);
        const response = await folderApi.getById(id);
        setFolder(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadFolder();
  }, [id]);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleDelete = async () => {
    try {
      await folderApi.delete(id);
      navigate('/library');
    } catch (err) {
      setError(err.message);
    } finally {
      handleMenuClose();
    }
  };

  const handleAddClick = () => {
    setDialogOpen(true);
  };

  const handleSaveFolder = async (updatedFolder) => {
    try {
      const response = await folderApi.update(id, updatedFolder);
      setFolder(response.data);
      setEditDialogOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateExperiments = async (experimentIds) => {
    try {
      const response = await folderApi.setExperiments(id, experimentIds);
      setFolder(response.data);
      setDialogOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemoveExperiment = async (experimentId) => {
    try {
      const newExperimentIds = folder.experimentIds.filter(id => id !== experimentId);
      const response = await folderApi.setExperiments(folder.id, newExperimentIds);
      setFolder(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  if (!folder && loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
          <Box
            sx={{
              p: 2,
              backgroundColor: theme.palette.grey[100],
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              Загрузка папки...
            </Typography>
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
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
        {/* Шапка с информацией о папке */}
        <Box
          sx={{
            p: 2,
            backgroundColor: theme.palette.grey[100],
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" spacing={1} alignItems='center'>
              <IconButton onClick={() => navigate('/library')} size="small">
                <BackIcon />
              </IconButton>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Автор: {folder.author} | Создано: {new Date(folder.createdAt).toLocaleDateString()}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  {folder.name}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddClick}
                size="small"
              >
                Добавить \ Изменить
              </Button>

              <IconButton size="small" onClick={handleMenuClick}>
                <MoreVertIcon />
              </IconButton>
            </Stack>
          </Stack>
        </Box>

        {/* Меню действий */}
        <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}>
          <MenuItem
            onClick={handleEdit}
            sx={{ color: theme.palette.text.primary }}
          >
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Редактировать</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={handleDelete}
            sx={{ color: theme.palette.error.main }}
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Удалить</ListItemText>
          </MenuItem>
        </Menu>

        {/* Список экспериментов */}
        <Box sx={{ p: 2 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : folder.experiments.length > 0 ? (
            <List disablePadding>
              {folder.experiments.map((experiment) => (
                <Box key={experiment.id}>
                  <Link
                    to={`/experiment/${experiment.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <FolderExperimentItem
                      experiment={experiment}
                      onRemove={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleRemoveExperiment(experiment.id);
                      }}
                    />
                  </Link>
                </Box>
              ))}
            </List>
          ) : (
            <Box
              sx={{
                p: 3,
                textAlign: "center",
              }}
            >
              <Typography variant="body1" color="text.secondary">
                Папка пуста
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Диалог добавления экспериментов */}
      <AddToFolderDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        folderId={id}
        currentExperimentIds={folder.experimentIds}
        onSave={handleUpdateExperiments}
      />

      {/* Диалог редактирования папки */}
      <EditFolderDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        folder={folder}
        onSave={handleSaveFolder}
      />
    </Container>
  );
}

export default FolderPage;