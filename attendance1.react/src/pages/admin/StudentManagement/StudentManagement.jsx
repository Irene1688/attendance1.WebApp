import { useCallback, useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Box, Typography, Dialog } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { 
  Loader, 
  PromptMessage, 
  TextButton, 
  ConfirmDialog,
  SearchField,
} from '../../../components/Common';
import { AdminHeader, UserForm, StudentTable } from '../../../components/Admin';
import { useUserManagement, useProgrammeManagement } from '../../../hooks/features';
import { usePagination, useSorting } from '../../../hooks/common';
import { useMessageContext } from '../../../contexts/MessageContext';
import { USER_ROLES } from '../../../constants/userRoles';

const StudentManagement = () => {
  const { setPageTitle } = useOutletContext();

  // hooks
  const { 
    students,
    selectedUser,
    openDialog,
    confirmRebindDialog,
    confirmDeleteDialog,
    confirmMultipleDeleteDialog,
    confirmResetDialog,
    loading,
    setSelectedUser,
    setOpenDialog,
    setConfirmRebindDialog,
    setConfirmDeleteDialog,
    setConfirmMultipleDeleteDialog,
    setConfirmResetDialog,
    fetchStudents,
    createUser,
    updateUser,
    deleteUser,
    bulkDeleteUsers,
    resetPassword,
    rebindStudentDevice
  } = useUserManagement();
  const { programmeSelection, fetchProgrammeSelection } = useProgrammeManagement();
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

  // initialize
  useEffect(() => {
    setPageTitle('Student Management');
  }, [setPageTitle]);

  useEffect(() => {
    let isMounted = true;
    fetchProgrammeSelection();
    return () => {
      isMounted = false;
    };
  }, []);

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

  const handleBulkDeleteConfirm = async () => {
    if (!confirmMultipleDeleteDialog.userIds?.length) {
      return;
    }
    
    const success = await bulkDeleteUsers(confirmMultipleDeleteDialog.userIds);
    if (success) {
      setConfirmMultipleDeleteDialog({ open: false, userIds: [] });
      await loadData();
      showSuccessMessage('Selected students deleted successfully');
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

  // rebind device
  const handleRebindConfirm = async () => {
    if (confirmRebindDialog.user) {
      const success = await rebindStudentDevice(confirmRebindDialog.user);
      if (success) {
        setConfirmRebindDialog({ open: false, user: null });
        await loadData();
        showSuccessMessage('Device unbound successfully');
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

      <AdminHeader title={`Student Management (${total})`}>
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
      </AdminHeader>

      <SearchField
        placeholder="Search students..."
        onSearch={handleSearch}
        debounceTime={1000}
      />

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
        onRebindDevice={(user) => {
          setConfirmRebindDialog({
            open: true,
            user
          });
        }}
        onDelete={(user) => {
          setConfirmDeleteDialog({
            open: true,
            user
          });
        }}
        onBulkDelete={(userIds) => {
          setConfirmMultipleDeleteDialog({
            open: true,
            userIds
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
          programmeSelection={programmeSelection}
        />
      </Dialog>

      <ConfirmDialog
        open={confirmRebindDialog.open}
        title="Unbind Student Device"
        content={`Are you sure you want to unbind the device for ${confirmRebindDialog.user?.name}?`}
        onConfirm={handleRebindConfirm}
        onCancel={() => setConfirmRebindDialog({ open: false, user: null })}
        confirmText="Unbind"
        cancelText="Cancel"
        type="primary"
      />

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
        open={confirmMultipleDeleteDialog.open}
        title="Delete Students"
        content={`Are you sure you want to delete ${confirmMultipleDeleteDialog.userIds?.length} students? This action cannot be undone.`}
        onConfirm={handleBulkDeleteConfirm}
        onCancel={() => setConfirmMultipleDeleteDialog({ open: false, userIds: [] })}
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