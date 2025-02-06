export const styles = (theme) => ({
  card: {
    borderRadius: 2,
  },
  listContainer: {
    padding: 0
  },
  cardTitle: {
    marginBottom: theme.spacing(1),
    fontWeight: 600
  },
  divider: {
    borderTop: `1px solid ${theme.palette.divider}`,
    my: 1
  },
  emptyMessage: {
    textAlign: 'center',
    color: theme.palette.text.secondary,
    padding: theme.spacing(3)
  }
});
