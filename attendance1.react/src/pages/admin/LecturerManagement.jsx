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
} from '../../components/Common';
import { AdminHeader, UserForm, LecturerTable } from '../../components/Admin';
import { useUserManagement, useProgrammeManagement } from '../../hooks/features';
import { usePagination, useSorting } from '../../hooks/common';
import { useMessageContext } from '../../contexts/MessageContext';
import { USER_ROLES } from '../../constants/userRoles';

const LecturerManagement = () => {
  const { setPageTitle } = useOutletContext();

  // hooks
  const { 
    lecturers,
    selectedUser,
    openDialog,
    confirmDeleteDialog,
    confirmMultipleDeleteDialog,
    confirmResetDialog,
    loading,
    setSelectedUser,
    setOpenDialog,
    setConfirmDeleteDialog,
    setConfirmMultipleDeleteDialog,
    setConfirmResetDialog,
    fetchLecturers,
    createUser,
    updateUser,
    deleteUser,
    bulkDeleteUsers,
    resetPassword
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
  } = useSorting('lecturerName', 'asc');

  // search
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    setPage(0);
  }, [setPage]);

  // Initialize
  useEffect(() => {
    setPageTitle('Lecturer Management');
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
    const paginatedResult = await fetchLecturers(requestDto);
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
        ? 'Lecturer updated successfully'
        : 'Lecturer created successfully';
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
        showSuccessMessage('Lecturer deleted successfully');
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
      showSuccessMessage('Selected lecturers deleted successfully');
    }
  };

  // reset password
  const handleResetConfirm = async () => {
    if (confirmResetDialog.user) {
      const success = await resetPassword(confirmResetDialog.user, USER_ROLES.LECTURER);
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
      <AdminHeader title={`Lecturer Management (${total})`}>
        <TextButton 
          onClick={() => {
            setSelectedUser(null);
            setOpenDialog(true);
          }} 
          Icon={<AddIcon />}
          color="primary"
        >
          Add New Lecturer
        </TextButton>
      </AdminHeader>

      <SearchField
        placeholder="Search lecturers..."
        onSearch={handleSearch}
        debounceTime={1000}
      />

      <LecturerTable
        lecturers={lecturers}
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
            campusId: selectedUser.lecturerId,
            name: selectedUser.name,
            email: selectedUser.email,
            programmeId: selectedUser.programmeId,
          } : {
            campusId: '',
            name: '',
            email: '',
            programmeId: '',
          }}
          userRole={USER_ROLES.LECTURER}
          onSubmit={handleSubmit}
          onCancel={() => setOpenDialog(false)}
          isEditing={!!selectedUser}
          programmeSelection={programmeSelection}
        />
      </Dialog>

      <ConfirmDialog
        open={confirmDeleteDialog.open}
        title="Delete Lecturer"
        content="Are you sure you want to delete this lecturer? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDeleteDialog({ open: false, lecturer: null })}
        confirmText="Delete"
        cancelText="Cancel"
        type="delete"
      />

      <ConfirmDialog
        open={confirmMultipleDeleteDialog.open}
        title="Delete Lecturers"
        content={`Are you sure you want to delete ${confirmMultipleDeleteDialog.userIds?.length} lecturers? This action cannot be undone.`}
        onConfirm={handleBulkDeleteConfirm}
        onCancel={() => setConfirmMultipleDeleteDialog({ open: false, userIds: [] })}
        confirmText="Delete"
        cancelText="Cancel"
        type="delete"
      />

      <ConfirmDialog
        open={confirmResetDialog.open}
        title="Reset Password"
        content={`Are you sure you want to reset the password for ${confirmResetDialog.user?.name}? The new password will be the same as their Lecturer ID (lowercase).`}
        onConfirm={handleResetConfirm}
        onCancel={() => setConfirmResetDialog({ open: false, user: null })}
        confirmText="Reset"
        cancelText="Cancel"
        type="primary"
      />
    </Box>
  );
};

export default LecturerManagement;