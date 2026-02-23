import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#4318FF',
            light: '#E9E3FF',
            dark: '#2B0EAA',
            contrastText: '#fff',
        },
        secondary: {
            main: '#A3AED0',
            light: '#F4F7FE',
            dark: '#707EAE',
            contrastText: '#fff',
        },
        background: {
            default: '#F4F7FE',
            paper: '#ffffff',
        },
        text: {
            primary: '#2B3674',
            secondary: '#A3AED0',
        }
    },
    typography: {
        fontFamily: [
            '"Inter"',
            '"Roboto"',
            '"Helvetica"',
            '"Arial"',
            'sans-serif'
        ].join(','),
        h4: {
            fontWeight: 700,
            color: '#2B3674',
        },
        h6: {
            fontWeight: 700,
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
        }
    },
    shape: {
        borderRadius: 16,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0px 4px 12px rgba(67, 24, 255, 0.2)',
                    },
                },
                contained: {
                    padding: '8px 24px',
                }
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 20,
                    boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.12)',
                    border: 'none',
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 20,
                    boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.12)',
                }
            }
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    borderRight: 'none',
                    boxShadow: '14px 17px 40px 4px rgba(112, 144, 176, 0.08)',
                }
            }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    backgroundColor: '#F8F9FA',
                    '& fieldset': {
                        border: 'none',
                    },
                    '&:hover fieldset': {
                        border: 'none',
                    },
                    '&.Mui-focused fieldset': {
                        border: '1px solid #4318FF',
                    },
                }
            }
        }
    },
});

export default theme;
