import { createTheme, ThemeOptions } from '@mui/material/styles';

const baseTheme: ThemeOptions = {
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
            light: '#63a4ff',
            dark: '#004ba0',
            contrastText: '#fff',
        },
        secondary: {
            main: '#FFBB28',
            contrastText: '#fff',
        },
        background: {
            default: '#f8f9fa',
            paper: '#fff',
        },
        text: {
            primary: '#222b45',
            secondary: '#6b778c',
            disabled: '#b0b8c1',
        },
        error: {
            main: '#d32f2f',
        },
        success: {
            main: '#388e3c',
        },
        warning: {
            main: '#fbc02d',
        },
        info: {
            main: '#0288d1',
        },
        divider: '#e0e0e0',
    },
    typography: {
        fontFamily: "'Inter', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
        h1: { fontWeight: 700, fontSize: '2.5rem', letterSpacing: '-1.5px' },
        h2: { fontWeight: 700, fontSize: '2rem',   letterSpacing: '-0.5px' },
        h3: { fontWeight: 600, fontSize: '1.5rem' },
        h4: { fontWeight: 600, fontSize: '1.125rem' },
        h5: { fontWeight: 500 },
        h6: { fontWeight: 500 },
        subtitle1: { fontWeight: 500 },
        body1: { fontWeight: 400, fontSize: '1rem' },
        body2: { fontWeight: 400, fontSize: '0.95rem' },
        button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: {
        borderRadius: 10,
    },
    spacing: 8,
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                },
                containedPrimary: {
                    color: '#fff',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                rounded: {
                    borderRadius: 12,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 14,
                    boxShadow: '0 4px 24px 0 rgba(44, 62, 80, 0.04)',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                colorPrimary: {
                    backgroundColor: '#1976d2',
                },
            },
        },
    },
};

const theme = createTheme(baseTheme);

export default theme;