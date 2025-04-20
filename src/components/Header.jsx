import React from 'react';
import { 
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Slide,
  useScrollTrigger
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import PersonIcon from '@mui/icons-material/Person';
import InfoIcon from '@mui/icons-material/Info';
import MenuIcon from '@mui/icons-material/Menu';

function HideOnScroll({ children, window }) {
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

function HeaderSimpleHide(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <HideOnScroll {...props}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Имитатор операторской задачи
          </Typography>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/library"
              startIcon={<LibraryBooksIcon />}
            >
              Библиотека
            </Button>
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/profile"
              startIcon={<PersonIcon />}
            >
              Профиль
            </Button>
          </Box>

          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleMenu}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem 
                component={RouterLink} 
                to="/library"
                onClick={handleClose}
              >
                <LibraryBooksIcon sx={{ mr: 1 }} />
                Библиотека
              </MenuItem>
              <MenuItem 
                component={RouterLink} 
                to="/profile"
                onClick={handleClose}
              >
                <PersonIcon sx={{ mr: 1 }} />
                Профиль
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  );
}

export default HeaderSimpleHide;