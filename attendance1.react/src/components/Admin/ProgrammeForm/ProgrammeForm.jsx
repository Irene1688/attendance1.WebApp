import { Formik, Form } from 'formik';
import { 
  Box, 
  TextField, 
  DialogTitle,
  DialogContent,
  DialogActions 
} from '@mui/material';
import { programmeValidationSchema } from '../../../validations/schemas';
import { TextButton } from '../../Common';


const ProgrammeForm = ({ initialValues, onSubmit, onCancel, isEditing }) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={programmeValidationSchema}
      onSubmit={onSubmit}
    >
      {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
        <Form>
          <DialogTitle>
            {isEditing ? 'Edit Programme' : 'Add New Programme'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <TextField
                fullWidth
                name="name"
                label="Programme Name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
                margin="normal"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <TextButton 
              onClick={onCancel}
              variant="text"
              color="cancel"
            >
              Cancel
            </TextButton>
            <TextButton 
              type="submit" 
              variant="contained"
              color="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </TextButton>
          </DialogActions>
        </Form>
      )}
    </Formik>
  );
};

export default ProgrammeForm; 