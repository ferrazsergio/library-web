import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
    AppBar,
    Box,
    CssBaseline,
    Drawer,
    IconButton,
    Toolbar,
    Typography,
    useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import UserMenu from './UserMenu';
import ColorModeToggle from './ColorModeToggle';
import AccessibilityFontButtons from '../AccessibilityFontButtons';
import PageTransition from './PageTransition';
import LibraryMenuCarousel from '../LibraryMenuCarousel';

const drawerWidth = 350;

const MainLayout: React.FC = () => {
    const theme = useTheme();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const navigate = useNavigate();

    const handleDrawerToggle = () => {
        setDrawerOpen((prev) => !prev);
    };

    const handleNavigate = (path: string) => {
        navigate(path);
        setDrawerOpen(false);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: '100%',
                    ml: 0,
                }}
            >
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

            <LibraryMenuCarousel
                open={drawerOpen}
                onClose={handleDrawerToggle}
                onNavigate={handleNavigate}
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