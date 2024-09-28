// components/Navbar/Navbar.jsx

import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  IconButton,
  Divider,
  Box,
  Avatar,
  useTheme,
  useMediaQuery,
  Tooltip,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  MonetizationOn as MonetizationOnIcon,
} from '@mui/icons-material';
import MoneyOffCsredIcon from '@mui/icons-material/MoneyOffCsred';
import BarChartIcon from '@mui/icons-material/BarChart';
import LogoutIcon from '@mui/icons-material/Logout'; // Icono de logout
import { styled } from '@mui/material/styles';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signOut } from 'firebase/auth';
import { logout } from '../../store/authSlice';
import { auth } from '../../firebaseConfig'; // Importamos el auth de Firebase
import logo from '../../assets/royalclub-logo.png';

const drawerWidth = 260;

const CustomToolbar = styled(Toolbar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 2),
  boxShadow: theme.shadows[3],
}));

const CustomTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.primary.main,
}));

const CustomDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    boxSizing: 'border-box',
    overflowX: 'hidden',
  },
}));

const CustomListItemButton = styled(ListItemButton)(({ theme }) => ({
  '&.Mui-selected, &.Mui-selected:hover': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.contrastText,
    },
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  borderRadius: '8px',
  margin: theme.spacing(0.5, 1),
}));

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        dispatch(logout());
      })
      .catch((error) => {
        console.error('Logout failed', error);
      });
  };

  const menuItems = [
    { text: 'Ingresos', icon: <MonetizationOnIcon />, path: '/ingresos' },
    { text: 'Gastos', icon: <MoneyOffCsredIcon />, path: '/gastos' },
    { text: 'Data', icon: <BarChartIcon />, path: '/data' },
  ];

  const drawer = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div>
        <CustomToolbar>
          <Box display="flex" alignItems="center">
            <Avatar src={logo} alt="Logo de la empresa" sx={{ mr: 2, width: 40, height: 40 }} />
            <CustomTypography variant="h6" noWrap>
              Royal Club
            </CustomTypography>
          </Box>
        </CustomToolbar>
        <Divider sx={{ backgroundColor: theme.palette.divider }} />
        <List>
          {menuItems.map((item) => (
            <Tooltip title={item.text} arrow placement="right" key={item.text}>
              <CustomListItemButton
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
                onClick={isMobile ? handleDrawerToggle : null}
              >
                <ListItemIcon sx={{ color: theme.palette.primary.main }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontFamily: 'Poppins, sans-serif',
                    color: theme.palette.text.primary,
                  }}
                />
              </CustomListItemButton>
            </Tooltip>
          ))}
        </List>
      </div>

      {/* Botón de Logout en la parte inferior */}
      <Box sx={{ mt: 'auto', p: 2 }}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{borderRadius: '18px', fontSize: '20px', textTransform: 'none'}}
        >
          Cerrar Sesion
        </Button>
      </Box>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{
          display: { sm: 'none' },
          color: theme.palette.primary.main,
          position: 'fixed',
          top: 10,
          left: 10,
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <MenuIcon />
      </IconButton>
      <CustomDrawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
      >
        {drawer}
      </CustomDrawer>
    </Box>
  );
};

export default Navbar;
