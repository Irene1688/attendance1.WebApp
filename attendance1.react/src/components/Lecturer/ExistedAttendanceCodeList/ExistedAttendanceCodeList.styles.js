import { alpha } from '@mui/material/styles';

export const styles = (theme) => ({
  dialogHeader: {
    backgroundColor: theme.palette.primary.light,
    px: theme.spacing(3),
    py: theme.spacing(1.5),
  },
  
  dialogHeaderText: {
    color: theme.palette.white.dark,
    fontWeight: 600
  },

  content: {
    padding: theme.spacing(0, 4),
    minHeight: 300,
  },

  actions: {
    padding: theme.spacing(2),
  },

  listItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    px: theme.spacing(3),
    py: theme.spacing(2),
    marginBottom: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 2,
    backgroundColor: theme.palette.background.paper,
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.02),
    },
    '&.Mui-selected': {
      backgroundColor: alpha(theme.palette.primary.main, 0.08),
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.12),
      }
    }
  },

  codeContent: {
    width: '100%',
  },

  codeHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },

  codeInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    marginTop: theme.spacing(1),
    color: theme.palette.text.secondary,
  },

  typeChip: (isLecture) => ({
    backgroundColor: isLecture 
      ? alpha(theme.palette.primary.main, 0.1)
      : alpha(theme.palette.secondary.main, 0.1),
    color: isLecture
      ? theme.palette.primary.main
      : theme.palette.secondary.main,
  }),

  durationContainer: {
    minHeight: 150,
    py: theme.spacing(0),
  },

  durationSection: {
    padding: theme.spacing(2),
    backgroundColor: alpha(theme.palette.primary.main, 0.02),
    borderRadius: 2,
  },

  radioLabel: {
    marginRight: theme.spacing(4),
  }
}); 