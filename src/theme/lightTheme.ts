import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
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
    },
    typography: {
        fontFamily: "'Inter', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
    },
    shape: {
        borderRadius: 10,
    },
});

export default lightTheme;