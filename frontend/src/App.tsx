import { BrowserRouter, Routes, Route, Link as RouterLink, useLocation } from 'react-router-dom';
import Dictionaries from './pages/Dictionaries';
import ItemsList from './pages/ItemsList';
import { Typography, Box, Drawer, List, ListItemText, ListItemButton, Avatar, ListItemIcon } from '@mui/material';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CategoryIcon from '@mui/icons-material/Category';
import ViewInArIcon from '@mui/icons-material/ViewInAr';

const DRAWER_WIDTH = 280;

function AppContent() {
  const location = useLocation();

  const navItems = [
    { text: 'Склад техники', path: '/', icon: <Inventory2Icon /> },
    { text: 'Справочники', path: '/dictionaries', icon: <CategoryIcon /> },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Drawer
        variant="permanent"
        sx={{
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
        <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', borderRadius: 2 }} variant="rounded">
            <ViewInArIcon />
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.5px' }}>
            СкладПро
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
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
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
