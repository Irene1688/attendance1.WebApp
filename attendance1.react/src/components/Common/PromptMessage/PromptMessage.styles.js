import { Alert } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledAlert = styled(Alert)(({ theme, severity }) => ({
  position: 'relative',
  padding: '12px 16px',
  borderRadius: theme.shape.borderRadius,
  fontSize: '0.875rem',
  fontWeight: 500,
  lineHeight: 1.5,
  letterSpacing: '0.01em',
  boxShadow: theme.shadows[2],
  
  // 根据不同的 severity 设置不同的样式
  ...(severity === 'error' && {
    backgroundColor: 'rgba(211, 47, 47, 0.05)',
    color: theme.palette.error.dark,
    '& .MuiAlert-icon': {
      color: theme.palette.error.main
    }
  }),
  
  ...(severity === 'warning' && {
    backgroundColor: 'rgba(237, 108, 2, 0.05)',
    color: theme.palette.warning.dark,
    '& .MuiAlert-icon': {
      color: theme.palette.warning.main
    }
  }),
  
  ...(severity === 'info' && {
    backgroundColor: 'rgba(2, 136, 209, 0.05)',
    color: theme.palette.info.dark,
    '& .MuiAlert-icon': {
      color: theme.palette.info.main
    }
  }),
  
  ...(severity === 'success' && {
    backgroundColor: 'rgba(46, 125, 50, 0.05)',
    color: theme.palette.success.dark,
    '& .MuiAlert-icon': {
      color: theme.palette.success.main
    }
  }),

  // 图标样式
  '& .MuiAlert-icon': {
    padding: '4px 0',
    marginRight: 12,
    fontSize: 22,
    opacity: 0.9
  },

  // 关闭按钮样式
  '& .MuiAlert-action': {
    padding: '2px 0',
    marginRight: -8,
    '& .MuiButtonBase-root': {
      padding: 4,
      borderRadius: '50%',
      color: 'inherit',
      opacity: 0.7,
      '&:hover': {
        opacity: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.05)'
      }
    }
  },

  // 消息文本样式
  '& .MuiAlert-message': {
    padding: '4px 0',
    flex: 1
  },

  // 全宽度时的样式
  '&.fullWidth': {
    width: '100%'
  },

  // 动画效果
  transition: theme.transitions.create(
    ['background-color', 'box-shadow', 'opacity'],
    {
      duration: theme.transitions.duration.short
    }
  ),

  // 悬停效果
  '&:hover': {
    boxShadow: theme.shadows[4]
  }
})); 