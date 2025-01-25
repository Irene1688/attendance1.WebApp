export const styles = (theme) => ({
  dialogContent: {
    padding: theme.spacing(2, 3),
    paddingBottom: theme.spacing(1)
  },

  dialogActions: {
    padding: theme.spacing(2, 3),
    paddingTop: theme.spacing(1)
  },

  tutorialSelect: {
    marginBottom: theme.spacing(2)
  },

  searchContainer: {
    marginBottom: theme.spacing(2)
  },

  studentListContainer: {
    maxHeight: 300,
    overflow: 'auto',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper
  },

  selectedStudentsContainer: {
    marginTop: theme.spacing(2)
  },

  selectedStudentsList: {
    maxHeight: 200,
    overflow: 'auto',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper
  },

  divider: {
    mb: 3
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    mt: 2
  },

  uploadSection: {
    mt: 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2
  },

  uploadHint: {
    textAlign: 'center',
    mb: 2
  },

  uploadButton: {
    mt: theme.spacing(2)
  },

  fileName: {
    mt: theme.spacing(1),
    color: 'success.main'
  },

  error: {
    mt: theme.spacing(1),
    color: 'error.main'
  },

  downloadButton: {
    mt: 2
  },

  actions: {
    width: '100%',
    px: 3,
    py: 2
  }
}); 