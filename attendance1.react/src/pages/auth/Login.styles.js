export const styles = (theme) => ({
    loginContainer: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: theme.spacing(2),
        background: theme.palette.background.default
      },
        
      loginPaper: (isStaff) => ({
        padding: theme.spacing(4),
        width: '100%',
        maxWidth: 400,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: theme.spacing(2),
        boxShadow: '0 3px 15px rgba(0, 0, 0, 0.2)',
        background: isStaff 
          ? theme.palette.background.paper
          : theme.palette.grey[800],
        color: isStaff 
          ? theme.palette.grey[800]
          : theme.palette.common.white,
        position: 'relative',
        overflow: 'visible', // 改为visible以显示切换按钮
    
        [theme.breakpoints.down('sm')]: {
          padding: theme.spacing(3),
          borderRadius: theme.spacing(1.5),
          margin: theme.spacing(0, 2),
          // 添加一些动画效果
          transition: 'all 0.3s ease'
        }
      }),
    
      formContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(2)
      }
});