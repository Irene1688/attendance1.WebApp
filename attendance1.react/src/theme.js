import { createTheme, alpha } from '@mui/material/styles';

// 定义主要颜色变量
const colors = {
  red: {
    main: '#e63946',     // 鲜艳的红色
    light: '#ff4d5a',    // 较亮的红色
    dark: '#cc2936',     // 深红色
  },
  grey: {
    main: '#2b2d42',     // 深灰色（替代纯黑）
    light: '#8d99ae',    // 浅灰色
    dark: '#1a1b2e',     // 更深的灰色
  },
  white: {
    main: '#ffffff',     // 纯白
    off: '#f8f9fa',      // 灰白色
    dark: '#edf2f4',     // 较深的白色
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
    secondary: { // red
        main: colors.red.main,
        light: colors.red.light,
        dark: colors.red.dark,
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
    // 登录页面特定配色
    login: {
      title: colors.grey.main,
      toggleButton: colors.grey.light,
      inputBorder: colors.grey.light,
      buttonBg: colors.red.main,
      buttonHover: colors.red.dark,
      background: colors.white.off,
      paper: colors.white.main,
      error: colors.red.main,
    }
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
  },
  shadows,
});

export default theme; 