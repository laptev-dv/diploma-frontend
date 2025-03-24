import React from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Link
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';

const drawerWidth = 240;

function Sidebar() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <List>
        {/* Ссылка на страницу библиотеки */}
        <Link 
          component={RouterLink} 
          to="/library"
          color="inherit"
          underline="none"
        >
          <ListItem button>
            <ListItemIcon>
              <LibraryBooksIcon />
            </ListItemIcon>
            <ListItemText primary="Библиотека" />
          </ListItem>
        </Link>

        {/* Ссылка на страницу настроек */}
        <Link 
          component={RouterLink} 
          to="/settings"
          color="inherit"
          underline="none"
        >
          <ListItem button>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Настройки" />
          </ListItem>
        </Link>

        {/* Ссылка на страницу дополнительной информации */}
        <Link 
          component={RouterLink} 
          to="/additional-info"
          color="inherit"
          underline="none"
        >
          <ListItem button>
            <ListItemIcon>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText primary="Доп. информация" />
          </ListItem>
        </Link>
      </List>
    </Drawer>
  );
}

export default Sidebar;