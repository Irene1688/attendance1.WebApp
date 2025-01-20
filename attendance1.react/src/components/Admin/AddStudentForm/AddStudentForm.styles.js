export const styles = (theme) => ({
  searchContainer: {
    marginBottom: theme.spacing(2)
  },

  studentListContainer: {
    maxHeight: 300,
    overflow: 'auto',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 4,
    backgroundColor: theme.palette.background.paper
  },

  selectedStudentsContainer: {
    marginTop: theme.spacing(2)
  },

  selectedStudentsList: {
    maxHeight: 200,
    overflow: 'auto'
  },

  tutorialSelect: {
    marginBottom: theme.spacing(2)
  },

  dialogActions: {
    padding: theme.spacing(2, 3),
    paddingTop: theme.spacing(1)
  },

  dialogContent: {
    padding: theme.spacing(2, 3),
    paddingBottom: theme.spacing(1)
  }
}); 