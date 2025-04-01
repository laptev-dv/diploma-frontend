import React, { useState } from "react";
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
  useMediaQuery,
  Grid
} from "@mui/material";
import { useParams, Link } from "react-router-dom";
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from "@mui/icons-material";
import FolderExperimentItem from "../components/FolderExperimentItem";
import AddToFolderDialog from "../components/AddToFolderDialog";
import EditFolderDialog from "../components/EditFolderDialog";

function FolderPage() {
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.up('md'));
  const { id } = useParams();
  const [isItemsHidden, setIsItemsHidden] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const openMenu = Boolean(anchorEl);

  const [folder, setFolder] = useState({
    id: id,
    name: `Папка ${id}`,
    author: "Иван Иванов",
    createdAt: "01.01.2025",
    experiments: [
      {
        id: 1,
        name: "Эксперимент 1",
        author: "Иван Иванов",
        resultsCount: 10,
        createdAt: "01.01.2025",
      },
      {
        id: 2,
        name: "Эксперимент 2",
        author: "Петр Петров",
        resultsCount: 5,
        createdAt: "01.01.2025",
      },
      {
        id: 3,
        name: "Эксперимент 3",
        author: "Сергей Сергеев",
        resultsCount: 8,
        createdAt: "02.01.2025",
      },
      {
        id: 4,
        name: "Эксперимент 4",
        author: "Алексей Алексеев",
        resultsCount: 3,
        createdAt: "03.01.2025",
      },
    ],
  });

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

  const handleDelete = () => {
    alert("Папка будет удалена");
    handleMenuClose();
  };

  const handleToggleItems = () => {
    setIsItemsHidden(!isItemsHidden);
  };

  const handleAddClick = () => {
    setDialogOpen(true);
  };

  const handleSaveFolder = (updatedFolder) => {
    setFolder(updatedFolder);
    setEditDialogOpen(false);
  };

  const handleRemoveExperiment = (experimentId) => {
    setFolder((prev) => ({
      ...prev,
      experiments: prev.experiments.filter((exp) => exp.id !== experimentId),
    }));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
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
            <Box>
              <Typography variant="body2" color="text.secondary">
                Автор: {folder.author} | Создано: {folder.createdAt}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                {folder.name}
              </Typography>
            </Box>

            <Stack direction="row" spacing={1}>
              <IconButton
                onClick={handleToggleItems}
                color={isItemsHidden ? "primary" : "default"}
                size="small"
              >
                {isItemsHidden ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </IconButton>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddClick}
                size="small"
              >
                Добавить
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
          {!isItemsHidden && folder.experiments.length > 0 ? (
            <List disablePadding>
              {folder.experiments.map((experiment, index) => (
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
                backgroundColor: theme.palette.grey[50],
                borderRadius: 1,
              }}
            >
              <Typography variant="body1" color="text.secondary">
                {isItemsHidden ? "Элементы скрыты" : "Папка пуста"}
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
        currentExperiments={folder.experiments}
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