import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    AppBar,
    Box,
    CssBaseline,
    IconButton,
    Toolbar,
    Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import UserMenu from './UserMenu';
import ColorModeToggle from './ColorModeToggle';
import AccessibilityFontButtons from '../AccessibilityFontButtons';
import PageTransition from './PageTransition';
import LibraryMenuDrawer from '../LibraryMenuDrawer';

const MainLayout: React.FC = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleDrawerToggle = () => setDrawerOpen(prev => !prev);

    const handleNavigate = (path: string) => {
        navigate(path);
        setDrawerOpen(false);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="abrir menu biblioteca"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        Sistema de Biblioteca
                    </Typography>
                    <AccessibilityFontButtons />
                    <ColorModeToggle />
                    <UserMenu />
                </Toolbar>
            </AppBar>

            <LibraryMenuDrawer
                open={drawerOpen}
                onClose={handleDrawerToggle}
                onNavigate={handleNavigate}
                currentPath={location.pathname}
            />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: '100%',
                    mt: '64px',
                }}
            >
                <PageTransition>
                    <Outlet />
                </PageTransition>
            </Box>
        </Box>
    );
};

export default MainLayout;