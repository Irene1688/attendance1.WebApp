import { alpha } from '@mui/material/styles';

export const styles = (theme) => ({
  cardItemTitle: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(1),
    alignItems: 'center',
    marginBottom: theme.spacing(1)
  },
  classType: (isLecture) => ({
    backgroundColor: isLecture
      ? alpha(theme.palette.info.light, 0.1)
      : alpha(theme.palette.info.dark, 0.1),
    color: isLecture
      ? theme.palette.info.dark 
      : theme.palette.info.dark,
    padding: theme.spacing(0.2, 1),
    borderRadius: 4,
    textTransform: 'uppercase',
    fontSize: '0.75rem'
  }),
  attendanceInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1)
  },
  emptyMessage: {
    textAlign: 'center',
    color: theme.palette.text.secondary,
    padding: theme.spacing(3)
  }
});