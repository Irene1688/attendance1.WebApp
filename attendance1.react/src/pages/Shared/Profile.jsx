import { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Box, 
  Paper, 
  Grid,
  Divider
} from '@mui/material';
import { 
  AvatarSection,
  TextButton, 
  PromptMessage,
  Loader 
} from '../../components/Common';
import { AdminHeader, ProfileForm } from '../../components/Admin';
import { useAuth } from '../../hooks/auth';
import { useMessageContext } from '../../contexts/MessageContext';

const Profile = () => {
  const { setPageTitle } = useOutletContext();
  const { profileData, fetchUserProfile, updateProfile, loading } = useAuth();
  const { message, showSuccessMessage, showErrorMessage, hideMessage } = useMessageContext();
  const [isEditing, setIsEditing] = useState(false);

  const loadProfileData = useCallback(async () => {
    const success = await fetchUserProfile();
    if (!success) showErrorMessage('Failed to fetch profile data');
  }, []);
  
  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  useEffect(() => {
    setPageTitle('Profile');
  }, [setPageTitle]);

  // 处理表单提交
  const handleSubmit = async (values, { setSubmitting }) => {
    const success = await updateProfile(values);
    if (success) {
      setIsEditing(false);
      await loadProfileData();
      showSuccessMessage('Profile updated successfully');
    }
    setSubmitting(false);
  };

  if (loading && !profileData) {
    return <Loader />;
  }

  return (
    <Box>
      {message.show && (
        <PromptMessage
          open={true}
          message={message.text}
          severity={message.severity}
          fullWidth
          onClose={hideMessage}
          sx={{ mb: 2 }}
        />
      )}

      <Paper sx={{ p: 3 }}>
        <AdminHeader title="Profile" isTitleBold={true} sx={{ mb: 2 }}>
          {!isEditing && (
            <TextButton
              onClick={() => setIsEditing(true)}
              variant="contained"
              color="primary"
            >
              Edit Profile
            </TextButton>
          )}
        </AdminHeader>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <AvatarSection
              name={profileData?.name}
              campusId={profileData?.campusId}
            />
          </Grid>

          <Grid item xs={12} md={9}>
            <ProfileForm
              initialValues={{
                name: profileData?.name || '',
                email: profileData?.email || '',
                programmeName: profileData?.programmeName || '',
                campusId: profileData?.campusId || '',
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
              }}
              isEditing={isEditing}
              role={profileData?.role || ''}
              onSubmit={handleSubmit}
              onCancel={() => setIsEditing(false)}
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Profile; 