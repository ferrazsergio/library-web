import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
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
            default: '#181C25',
            paper: '#232936',
        },
        text: {
            primary: '#f8f9fa',
            secondary: '#b0b8c1',
            disabled: '#6b778c',
        },
    },
    typography: {
        fontFamily: "'Inter', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
    },
    shape: {
        borderRadius: 10,
    },
});

export default darkTheme;