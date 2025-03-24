import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
  Menu,
  MenuItem,
  IconButton,
  Paper,
  List,
} from "@mui/material";
import { useParams, Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FolderExperimentItem from "../components/FolderExperimentItem";
import AddToFolderDialog from "../components/AddToFolderDialog";
import EditFolderDialog from "../components/EditFolderDialog";

function FolderPage() {
  const { id } = useParams();
  const [isItemsHidden, setIsItemsHidden] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const openMenu = Boolean(anchorEl);

  // Моковые данные папки
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
    ],
  });

  // Обработчики меню
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
    <Box sx={{ p: 3 }}>
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

      {/* Заголовок и кнопки управления */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h4">{folder.name}</Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            color="warning"
            onClick={handleToggleItems}
          >
            {isItemsHidden ? "Показать элементы" : "Скрыть элементы"}
          </Button>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
          >
            Добавить
          </Button>

          <IconButton
            aria-label="more"
            aria-controls="folder-menu"
            aria-haspopup="true"
            onClick={handleMenuClick}
          >
            <MoreVertIcon />
          </IconButton>

          <Menu
            id="folder-menu"
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleEdit}>Редактировать</MenuItem>
            <MenuItem onClick={handleDelete}>Удалить</MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Автор и дата создания */}
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Автор: {folder.author} | Дата создания: {folder.createdAt}
      </Typography>

      {/* Список экспериментов */}
      <Paper elevation={3} sx={{ p: 2 }}>
        {!isItemsHidden && folder.experiments.length > 0 ? (
          <List>
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
                {index !== folder.experiments.length - 1 && (
                  <Divider sx={{ my: 2 }} />
                )}
              </Box>
            ))}
          </List>
        ) : (
          <Typography variant="body1" align="center" sx={{ p: 3 }}>
            Элементы отсутствуют
          </Typography>
        )}
      </Paper>
    </Box>
  );
}

export default FolderPage;
