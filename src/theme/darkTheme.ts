import { ThemeOptions } from '@mui/material/styles';

const darkTheme: ThemeOptions = {
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
            contrastText: '#222b45',
        },
        background: {
            default: '#181C25',
            paper: '#20232a',
        },
        text: {
            primary: '#f8f9fa',
            secondary: '#b0b8c1',
            disabled: '#6b778c',
        },
        divider: 'rgba(255,255,255,0.08)',
    },
    typography: {
        fontFamily: "'Inter', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
    },
    shape: {
        borderRadius: 10,
    },
    components: {
        MuiTableCell: {
            styleOverrides: {
                root: {
                    backgroundColor: '#232936',
                    color: '#f8f9fa',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                },
                head: {
                    backgroundColor: '#20232a',
                    color: '#f8f9fa',
                    fontWeight: 600,
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: '#232936',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                containedPrimary: {
                    backgroundColor: '#1976d2',
                    color: '#fff',
                    '&:hover': {
                        backgroundColor: '#1565c0',
                    },
                },
            },
        },
    },
};

export default darkTheme;