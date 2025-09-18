import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';
import { AuthProvider } from './components/contexts/AuthContext';
import AppRoutes from './routes/AppRoutes';

// Providers de tema e acessibilidade
import { ColorModeProvider } from './components/contexts/ColorModeContext';
import { FontSizeProvider } from './components/contexts/FontSizeContext';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 30000,
        },
    },
});

const App: React.FC = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <ColorModeProvider>
                <FontSizeProvider>
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
                </FontSizeProvider>
            </ColorModeProvider>
        </QueryClientProvider>
    );
};

export default App;