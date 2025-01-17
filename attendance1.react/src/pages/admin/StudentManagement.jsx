import { useCallback, useEffect, useState } from 'react';
import { Box, Typography, Dialog } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { 
  Loader, 
  PromptMessage, 
  TextButton, 
  ConfirmDialog,
  SearchField,
} from '../../components/Common';
import { UserForm, StudentTable } from '../../components/Admin';
import { useUserManagement } from '../../hooks/features';
import { usePagination, useSorting } from '../../hooks/common';
import { useMessageContext } from '../../contexts/MessageContext';
import { USER_ROLES } from '../../constants/userRoles';

const StudentManagement = () => {
  // hooks
  const { 
    students,
    selectedUser,
    openDialog,
    confirmDeleteDialog,
    confirmResetDialog,
    loading,
    setSelectedUser,
    setOpenDialog,
    setConfirmDeleteDialog,
    setConfirmResetDialog,
    fetchStudents,
    createUser,
    updateUser,
    deleteUser,
    resetPassword
  } = useUserManagement();

  const { message, showSuccessMessage, hideMessage } = useMessageContext();

  const {
    page,
    setPage,
    rowsPerPage,
    total,
    setTotal,
    handlePageChange,
    handleRowsPerPageChange,
    getPaginationParams
  } = usePagination(15);

  const { 
    order, 
    orderBy, 
    handleSort,
    getSortParams 
  } = useSorting('studentName', 'asc');

  // search
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    setPage(0);
  }, [setPage]);

  // fetch data
  const loadData = useCallback(async () => {
    const requestDto = {
      paginatedRequest: {
        ...getPaginationParams(),
        ...getSortParams(),
      },
      searchTerm: searchTerm,
    };
    const paginatedResult = await fetchStudents(requestDto);
    setTotal(paginatedResult.totalCount);
  }, [getPaginationParams, getSortParams, searchTerm]);
  
  useEffect(() => {
    loadData();
  }, [loadData]);

  // create / update
  const handleSubmit = async (values, { resetForm }) => {
    const operation = selectedUser ? updateUser : createUser;
    const success = await operation(values);
    if (success) {
      await loadData();
      const message = selectedUser 
        ? 'Student updated successfully'
        : 'Student created successfully';
      showSuccessMessage(message);
      resetForm();
      setOpenDialog(false);
    }
  };

  // delete
  const handleDeleteConfirm = async () => {
    if (confirmDeleteDialog.user) {
      const success = await deleteUser(confirmDeleteDialog.user);
      if (success) {
        setConfirmDeleteDialog({ open: false, user: null });
        await loadData();
        showSuccessMessage('Student deleted successfully');
      }
    }
  };

  // reset password
  const handleResetConfirm = async () => {
    if (confirmResetDialog.user) {
      const success = await resetPassword(confirmResetDialog.user, USER_ROLES.STUDENT);
      if (success) {
        setConfirmResetDialog({ open: false, user: null });
        showSuccessMessage('Password has been reset successfully');
      }
    }
  };

  return (
    <Box sx={{ pl: 3, pr: 3 }}>
      {loading && <Loader />}
      
      {message.show && message.severity === 'success' && (
        <PromptMessage
          open={true}
          message={message.text}
          severity={message.severity}
          fullWidth
          onClose={hideMessage}
          sx={{ mb: 2 }}
        />
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Student Management ({total})</Typography>
        <TextButton 
          onClick={() => {
            setSelectedUser(null);
            setOpenDialog(true);
          }} 
          Icon={<AddIcon />}
          color="primary"
        >
          Add New Student
        </TextButton>
      </Box>

      <Box sx={{ mb: 3 }}>
        <SearchField
          placeholder="Search students..."
          onSearch={handleSearch}
          debounceTime={1000}
        />
      </Box>

      <StudentTable
        students={students}
        total={total}
        page={page}
        rowsPerPage={rowsPerPage}
        orderBy={orderBy}
        order={order}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onSort={handleSort}
        onEdit={(user) => {
          setSelectedUser(user);
          setOpenDialog(true);
        }}
        onDelete={(user) => {
          setConfirmDeleteDialog({
            open: true,
            user
          });
        }}
        onResetPassword={(user) => {
          setConfirmResetDialog({
            open: true,
            user
          });
        }}
        searchTerm={searchTerm}
      />

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <UserForm
          initialValues={selectedUser ? {
            campusId: selectedUser.studentId,
            name: selectedUser.name,
            email: selectedUser.email,
          } : {
            campusId: '',
            name: '',
            email: '',
          }}
          userRole={USER_ROLES.STUDENT}
          onSubmit={handleSubmit}
          onCancel={() => setOpenDialog(false)}
          isEditing={!!selectedUser}
        />
      </Dialog>

      <ConfirmDialog
        open={confirmDeleteDialog.open}
        title="Delete Student"
        content="Are you sure you want to delete this student? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDeleteDialog({ open: false, user: null })}
        confirmText="Delete"
        cancelText="Cancel"
        type="delete"
      />

      <ConfirmDialog
        open={confirmResetDialog.open}
        title="Reset Password"
        content={`Are you sure you want to reset the password for ${confirmResetDialog.user?.name}? The new password will be the same as their Student ID (lowercase).`}
        onConfirm={handleResetConfirm}
        onCancel={() => setConfirmResetDialog({ open: false, user: null })}
        confirmText="Reset"
        cancelText="Cancel"
        type="primary"
      />
    </Box>
  );
};

export default StudentManagement;