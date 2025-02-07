export const styles = (theme) => ({
  loginRoleToggle: (isStaff, helperTextCount, error) => ({
    width: '100%',
    height: 'auto',
    fontWeight: 500,
    position: 'relative',
    marginTop: theme.spacing(3),
    cursor: 'pointer',
    color: isStaff 
      ? theme.palette.grey[800]
      : theme.palette.common.white,
    textDecoration: 'none',
    opacity: 1,
    padding: theme.spacing(1.5),
    textAlign: 'center',
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${isStaff 
      ? theme.palette.grey[300]
      : 'rgba(255, 255, 255, 0.2)'}`,
    transition: 'all 0.3s ease',
    backgroundColor: 'transparent',

    '&:hover': {
      backgroundColor: isStaff
        ? theme.palette.grey[50]
        : 'rgba(255, 255, 255, 0.1)',
    },

    [theme.breakpoints.down('sm')]: {
      position: 'relative',
      margin: theme.spacing(3, 0, 0),
      width: '100%',
      boxShadow: 'none',
      backgroundColor: 'transparent'
    }
  }),
  helperText: {
    marginTop: theme.spacing(1),
    color: theme.palette.error.main,
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      position: 'fixed',
      bottom: theme.spacing(12),
      left: theme.spacing(2),
      right: theme.spacing(2),
      zIndex: 1000
    }
  }
});

// export const StyledLoginRoleToggle = styled(Link, {
//   shouldForwardProp: (prop) => !['isStaff', 'helperTextCount', 'error'].includes(prop)
// })(({ theme, isStaff, error, helperTextCount }) => ({
//   width: '100%',
//   height: isStaff 
//     ? 'auto' 
//     : error ? theme.spacing(4) : 'auto',
//   fontWeight: 'bold',
//   position: 'absolute',
//   top: isStaff 
//     ? theme.spacing(2)
//     : error 
//       ? theme.spacing(66) // when has error
//       : helperTextCount === 1 
//         ? theme.spacing(61) // when has 1 helper text
//         : helperTextCount === 2 
//           ? theme.spacing(63) // when has 2 helper text
//           : theme.spacing(58), // when has no helper text and no error
//   cursor: 'pointer',
//   color: isStaff 
//     ? theme.palette.common.white
//     : theme.palette.grey[800],
//   textDecoration: 'none',
//   opacity: 1,
//   padding: theme.spacing(1.5, 3),
//   zIndex: 1,
//   textAlign: 'center',
//   '&:hover': {
//     opacity: 0.8,
//     color: isStaff 
//       ? theme.palette.common.white
//       : theme.palette.grey[800],
//   },
//   '&::before': {
//     content: '""',
//     position: 'absolute',
//     top: isStaff 
//       ? theme.spacing(-5)
//       : theme.spacing(-2),
//     left: theme.spacing(0),
//     right: theme.spacing(0),
//     bottom: isStaff 
//       ? theme.spacing(-2)
//       : theme.spacing(-8),
//     background: isStaff 
//       ? theme.palette.grey[800]
//       : theme.palette.common.white,
//     borderTopLeftRadius: isStaff 
//       ? theme.spacing(0)
//       : theme.spacing(40),
//     borderTopRightRadius: isStaff 
//       ? theme.spacing(0)
//       : theme.spacing(40),
//     borderBottomLeftRadius: isStaff 
//       ? theme.spacing(40)
//       : theme.spacing(0),
//     borderBottomRightRadius: isStaff 
//       ? theme.spacing(40)
//       : theme.spacing(0),
//     zIndex: -1,
//     transition: 'all 0.8s ease',
//   }
// })); 