import { Formik, Form } from 'formik';
import { 
  Box, 
  TextField, 
  DialogTitle,
  DialogContent,
  DialogActions 
} from '@mui/material';
import { programmeValidationSchema } from '../../../validations/schemas';
import { TextButton, PromptMessage } from '../../Common';
import { useMessageContext } from '../../../contexts/MessageContext';


const ProgrammeForm = ({ initialValues, onSubmit, onCancel, isEditing }) => {
  const { message, hideMessage } = useMessageContext();
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
            {message.show && message.severity === 'error' && (
              <Box sx={{ mt: 2, mb: 0 }}>
                <PromptMessage
                  open={true}
                  message={message.text}
                  duration={10000}
                  severity={message.severity}
                  fullWidth
                  onClose={hideMessage}
                  scrollToTop={false}
                />
              </Box>
            )}
            <Box>
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
          <DialogActions sx={{ pb: 2, px: 3 }}>
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