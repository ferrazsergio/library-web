import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes/AppRoutes';

// Importa o provider e hook do ColorMode
import { ColorModeProvider, useColorMode } from './contexts/ColorModeContext';
import { ThemeProvider } from '@mui/material/styles';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 30000,
        },
    },
});

// Componente intermediário para acessar theme do context
const MainApp: React.FC = () => {
    const { theme } = useColorMode();
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <SnackbarProvider
                maxSnack={3}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <BrowserRouter>
                    <AuthProvider>
                        <AppRoutes />
                    </AuthProvider>
                </BrowserRouter>
            </SnackbarProvider>
        </ThemeProvider>
    );
};

const App: React.FC = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <ColorModeProvider>
                <MainApp />
            </ColorModeProvider>
        </QueryClientProvider>
    );
};

export default App;