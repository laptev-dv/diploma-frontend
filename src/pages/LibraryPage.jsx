import React, { useState } from "react";
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
  IconButton,
  useTheme,
  Stack
} from "@mui/material";
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Search as SearchIcon
} from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import ExperimentItem from "../components/ExperimentItem";
import FolderItem from "../components/FolderItem";
import CreateFolderDialog from "../components/CreateFolderDialog";

function LibraryPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isItemsHidden, setIsItemsHidden] = useState(false);
  const [sortBy, setSortBy] = useState("date");
  const [anchorEl, setAnchorEl] = useState(null);
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);

  const experiments = [
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
  ];

  const [folders, setFolders] = useState([
    {
      id: 1,
      name: "Папка 1",
      itemsCount: 2,
      createdAt: "01.01.2025",
    },
    {
      id: 2,
      name: "Папка 2",
      itemsCount: 3,
      createdAt: "01.01.2025",
    },
  ]);

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

  const handleToggleItems = () => {
    setIsItemsHidden((prev) => !prev);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const currentItems = activeTab === 0 ? experiments : folders;
  const hasItems = currentItems.length > 0 && !isItemsHidden;

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        {/* Шапка с заголовком и управлением */}
        <Box sx={{ 
          p: 2, 
          backgroundColor: theme.palette.grey[100],
        }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              Библиотека экспериментов
            </Typography>
            
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
            </Stack>
          </Stack>
        </Box>

        {/* Основное содержимое */}
        <Box sx={{ p: 3 }}>
          {/* Вкладки и фильтры */}
          <Box sx={{ mb: 3 }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              sx={{ mb: 2 }}
            >
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
                    startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                  }}
                />
              </Stack>
            )}
          </Box>

          {/* Список элементов */}
          <Box>
            {hasItems ? (
              <List disablePadding>
                {currentItems.map((item, index) => (
                  <Box key={item.id}>
                    <Link
                      to={`/${activeTab === 0 ? 'experiment' : 'folder'}/${item.id}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
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
              <Box sx={{ 
                p: 3, 
                textAlign: 'center',
                backgroundColor: theme.palette.grey[50],
                borderRadius: 1
              }}>
                <Typography variant="body1" color="text.secondary">
                  {isItemsHidden ? 'Элементы скрыты' : 'Нет доступных элементов'}
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
        onCreate={(name) => {
          const newFolder = {
            id: folders.length + 1,
            name,
            itemsCount: 0,
            createdAt: new Date().toLocaleDateString(),
          };
          setFolders([...folders, newFolder]);
        }}
      />
    </Container>
  );
}

export default LibraryPage;