import { createTheme, alpha } from '@mui/material/styles';

// 定义主要颜色变量
const colors = {
  red: {
    main: '#ff4d5a',     // 鲜艳的红色
    light: '#ff4d5a',    // 较亮的红色
    dark: '#cc2936',     // 深红色
  },
  grey: {
    main: '#24292e',     // 深灰色（替代纯黑）
    light: '#282e34',    // 浅灰色
    dark: '#1f2428',     // 更深的灰色
  },
  white: {
    main: '#ffffff',     // 纯白
    off: '#f8f9fa',      // 灰白色
    dark: '#edf2f4',     // 较深的白色
  },
  green: {
    main: '#28a745',     // 较深的绿色
    light: '#28a745',    // 较亮的绿色
    dark: '#218838',     // 深绿色
  },
  purple: {
    main: '#6f42c1',     // 紫色
    light: '#6f42c1',    // 较亮的紫色
    dark: '#563d7c',     // 深紫色
  }
};

// 创建完整的阴影数组
const shadows = Array(25).fill('').map((_, index) => {
  if (index === 0) return 'none';
  const y = index > 16 ? 1 : 0;
  const blur = index > 16 ? 1 : 0.5;
  const spread = index > 16 ? 1 : 0.25;
  return `0px ${index}px ${index * 2}px ${index * blur}px ${alpha(colors.grey.main, spread)}`;
});

const theme = createTheme({
  palette: {
    primary: { // grey
        main: colors.grey.main,
        light: colors.grey.light,
        dark: colors.grey.dark,
        contrastText: colors.white.main,
    },
    secondary: { // purple
        main: colors.purple.main,
        light: colors.purple.light,
        dark: colors.purple.dark,
        contrastText: colors.white.main,
    },
    text: {
        primary: colors.grey.main,
        secondary: colors.grey.light,
        disabled: alpha(colors.grey.main, 0.38),
    },
    background: {
        default: colors.white.off,
        paper: colors.white.main,
    },
    error: {
        main: colors.red.main,
        light: colors.red.light,
        dark: colors.red.dark,
    },
    success: {
        main: colors.green.main,
        light: colors.green.light,
        dark: colors.green.dark,
    },
    white: {
      main: colors.white.main,
      off: colors.white.off,
      dark: colors.white.dark,
    },
    grey: {
      50: colors.white.off,
      100: colors.white.dark,
      200: '#e9ecef',
      300: '#dee2e6',
      400: colors.grey.light,
      500: '#6c757d',
      600: '#495057',
      700: '#343a40',
      800: colors.grey.main,
      900: colors.grey.dark,
    },
    divider: alpha(colors.grey.main, 0.12),
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2rem',
      fontWeight: 600,
      color: colors.grey.main,
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: colors.grey.main,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    }
  },
  shape: {
    borderRadius: 8
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: `0 4px 8px ${alpha(colors.grey.main, 0.15)}`,
          },
        },
        containedPrimary: {
          backgroundColor: colors.red.main,
          '&:hover': {
            backgroundColor: colors.red.dark,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: alpha(colors.grey.light, 0.5),
            },
            '&:hover fieldset': {
              borderColor: colors.grey.light,
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.red.main,
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: `0 4px 20px ${alpha(colors.grey.main, 0.1)}`,
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: '0.85rem',
          fontWeight: 500,
          transition: 'all 0.2s ease-in-out'
        },
        secondary: {
          fontSize: '0.75rem',
          fontWeight: 400
        }
      }
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 40,
          color: 'inherit'
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '2px 4px',
          padding: '6px 16px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: alpha(colors.white.main, 0.1)
          }
        }
      }
    },
    MuiCollapse: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease-in-out'
        }
      }
    }
  },
  shadows,
});

export default theme; 