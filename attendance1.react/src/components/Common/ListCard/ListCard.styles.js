export const styles = (theme) => ({
    card: {
        borderRadius: 2
      },
      cardTitle: {
        marginBottom: theme.spacing(2),
        fontWeight: 600
      },
      divider: {
        borderTop: `1px solid ${theme.palette.divider}`,
        my: 1
      },
      classTimeInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1),
        marginTop: theme.spacing(0.5)
      },
      attendanceInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1)
      },
      classType: (isLecture) => ({
        backgroundColor: isLecture ? theme.palette.primary.main : theme.palette.grey[500],
        color: theme.palette.common.white,
        padding: theme.spacing(0.5, 1),
        borderRadius: theme.shape.borderRadius,
        textTransform: 'uppercase',
        fontSize: '0.75rem'
      }),
      emptyMessage: {
        textAlign: 'center',
        color: theme.palette.text.secondary,
        padding: theme.spacing(3)
      }
});
