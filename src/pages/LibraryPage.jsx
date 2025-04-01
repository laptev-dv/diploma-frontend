import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Tabs,
  Tab,
  Button,
  TextField,
  List,
  Divider,
  Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  useTheme,
  Stack,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import ExperimentItem from "../components/ExperimentItem";
import FolderItem from "../components/FolderItem";
import CreateFolderDialog from "../components/CreateFolderDialog";
import { experimentApi } from "../api/experimentApi";
import { folderApi } from "../api/folderApi";

function LibraryPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [anchorEl, setAnchorEl] = useState(null);
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const [loading, setLoading] = useState({
    experiments: false,
    folders: false,
    creating: false
  });
  const [experiments, setExperiments] = useState([]);
  const [folders, setFolders] = useState([]);
  const [dataLoaded, setDataLoaded] = useState({
    experiments: false,
    folders: false
  });

  // Загрузка данных при первом открытии вкладки
  useEffect(() => {
    const fetchData = async () => {
      if (activeTab === 0 && !dataLoaded.experiments) {
        setLoading(prev => ({ ...prev, experiments: true }));
        try {
          const response = await experimentApi.getAll();
          setExperiments(response.data);
          setDataLoaded(prev => ({ ...prev, experiments: true }));
        } catch (error) {
          console.error("Ошибка загрузки экспериментов:", error);
        } finally {
          setLoading(prev => ({ ...prev, experiments: false }));
        }
      } else if (activeTab === 1 && !dataLoaded.folders) {
        setLoading(prev => ({ ...prev, folders: true }));
        try {
          const response = await folderApi.getAll();
          setFolders(response.data);
          setDataLoaded(prev => ({ ...prev, folders: true }));
        } catch (error) {
          console.error("Ошибка загрузки папок:", error);
        } finally {
          setLoading(prev => ({ ...prev, folders: false }));
        }
      }
    };

    fetchData();
  }, [activeTab, dataLoaded]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleAddClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAddClose = () => {
    setAnchorEl(null);
  };

  const handleAddItem = (type) => {
    handleAddClose();
    if (type === "папку") {
      setFolderDialogOpen(true);
    } else if (type === "эксперимент") {
      navigate("/experiment/create");
    }
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleCreateFolder = async (name) => {
    try {
      setLoading(prev => ({ ...prev, creating: true }));
      const response = await folderApi.create({ name });
      const newFolder = response.data;
      setFolders([...folders, newFolder]);
      navigate(`/folder/${newFolder.id}`);
    } catch (error) {
      console.error("Ошибка создания папки:", error);
    } finally {
      setLoading(prev => ({ ...prev, creating: false }));
      setFolderDialogOpen(false);
    }
  };

  const currentItems = activeTab === 0 ? experiments : folders;
  const hasItems = currentItems.length > 0;
  const isLoading = activeTab === 0 ? loading.experiments : loading.folders;

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
        {/* Шапка с заголовком и управлением */}
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
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              Библиотека
            </Typography>

            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddClick}
                size="small"
              >
                Добавить
              </Button>
            </Stack>
          </Stack>
        </Box>

        {/* Основное содержимое */}
        <Box sx={{ p: 3 }}>
          {/* Вкладки и фильтры */}
          <Box sx={{ mb: 3 }}>
            <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
              <Tab label="Эксперименты" />
              <Tab label="Папки" />
            </Tabs>

            {hasItems && (
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <FormControl size="small" sx={{ minWidth: 180 }}>
                  <InputLabel>Сортировка</InputLabel>
                  <Select
                    value={sortBy}
                    onChange={handleSortChange}
                    label="Сортировка"
                  >
                    <MenuItem value="date">По дате</MenuItem>
                    <MenuItem value="name">По названию</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  size="small"
                  fullWidth
                  variant="outlined"
                  placeholder="Поиск..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <SearchIcon color="action" sx={{ mr: 1 }} />
                    ),
                  }}
                />
              </Stack>
            )}
          </Box>

          {/* Список элементов */}
          <Box>
            {isLoading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  p: 3,
                }}
              >
                <CircularProgress />
              </Box>
            ) : hasItems ? (
              <List disablePadding>
                {currentItems.map((item, index) => (
                  <Box key={item.id}>
                    <Link
                      to={`/${activeTab === 0 ? "experiment" : "folder"}/${
                        item.id
                      }`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {activeTab === 0 ? (
                        <ExperimentItem experiment={item} />
                      ) : (
                        <FolderItem folder={item} />
                      )}
                    </Link>
                    {index !== currentItems.length - 1 && (
                      <Divider sx={{ my: 2 }} />
                    )}
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
                  Нет доступных элементов
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Меню добавления */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleAddClose}
      >
        <MenuItem onClick={() => handleAddItem("эксперимент")}>
          Создать эксперимент
        </MenuItem>
        <MenuItem onClick={() => handleAddItem("папку")}>
          Создать папку
        </MenuItem>
      </Menu>

      {/* Диалог создания папки */}
      <CreateFolderDialog
        open={folderDialogOpen}
        onClose={() => setFolderDialogOpen(false)}
        onCreate={handleCreateFolder}
        loading={loading.creating}
      />
    </Container>
  );
}

export default LibraryPage;