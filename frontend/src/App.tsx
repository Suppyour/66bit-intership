import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link as RouterLink, useLocation } from 'react-router-dom';
import Dictionaries from './pages/Dictionaries';
import ItemsList from './pages/ItemsList';
import { Typography, Box, Drawer, List, ListItemText, ListItemButton, Avatar, ListItemIcon, AppBar, Toolbar, IconButton, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CategoryIcon from '@mui/icons-material/Category';
import ViewInArIcon from '@mui/icons-material/ViewInAr';

const DRAWER_WIDTH = 280;

function AppContent() {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { text: 'Склад техники', path: '/', icon: <Inventory2Icon /> },
    { text: 'Справочники', path: '/dictionaries', icon: <CategoryIcon /> },
  ];

  const drawerContent = (
    <>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Avatar sx={{ bgcolor: 'primary.main', borderRadius: 2 }} variant="rounded">
          <ViewInArIcon />
        </Avatar>
        <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.5px' }}>
          Склад66bit
        </Typography>
      </Box>

      <List sx={{ px: 2, flexGrow: 1 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItemButton
              key={item.text}
              component={RouterLink}
              to={item.path}
              onClick={() => isMobile && setMobileOpen(false)}
              sx={{
                borderRadius: 3,
                mb: 1,
                backgroundColor: isActive ? 'primary.light' : 'transparent',
                color: isActive ? 'primary.main' : 'text.secondary',
                '&:hover': {
                  backgroundColor: isActive ? 'primary.light' : 'rgba(0,0,0,0.04)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.95rem'
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: isMobile ? 'column' : 'row' }}>
      {isMobile && (
        <AppBar position="static" elevation={0} sx={{ bgcolor: 'background.default', borderBottom: '1px solid #e0e0e0' }}>
          <Toolbar>
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, color: 'text.primary' }}>
              <MenuIcon />
            </IconButton>
            <Avatar sx={{ bgcolor: 'primary.main', borderRadius: 2, width: 32, height: 32, mr: 1 }} variant="rounded">
              <ViewInArIcon fontSize="small" />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
              Склад66bit
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: isMobile ? (mobileOpen ? 'block' : 'none') : 'block',
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            backgroundColor: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 4 },
          width: isMobile ? '100%' : `calc(100% - ${DRAWER_WIDTH}px)`,
          backgroundColor: 'background.default',
        }}
      >
        <Routes>
          <Route path="/" element={<ItemsList />} />
          <Route path="/dictionaries" element={<Dictionaries />} />
        </Routes>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
