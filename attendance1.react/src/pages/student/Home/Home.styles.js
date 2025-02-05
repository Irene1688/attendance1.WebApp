import { alpha } from '@mui/material/styles';

export const styles = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3)
  },
  header: {
    marginBottom: theme.spacing(1)
  },
  headerTitle: {
    fontWeight: 600,
    mt: theme.spacing(1),
    whiteSpace: 'normal',
    overflow: 'visible',
    maxWidth: '100%'
  },
  headerSubtitle: {
    fontWeight: 400,
    color: theme.palette.text.secondary,
    mt: theme.spacing(1),
    whiteSpace: 'normal',
    overflow: 'visible',
    maxWidth: '100%'
  },

  cardItemTitle: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(1),
    alignItems: 'center',
    marginBottom: theme.spacing(1)
  },
  classTitle: {
    fontWeight: 600,
    whiteSpace: 'normal',
    overflow: 'visible',
  },
  classLecturerInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginTop: theme.spacing(0.5)
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