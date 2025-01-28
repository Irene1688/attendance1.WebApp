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
import { AdminHeader, ProgrammeForm, ProgrammeTable } from '../../../components/Admin';
import { useProgrammeManagement } from '../../../hooks/features'
import { usePagination, useSorting } from '../../../hooks/common';
import { useMessageContext } from '../../../contexts/MessageContext';

const ProgrammeManagement = () => {
  const { setPageTitle } = useOutletContext();
  // hooks
  const { 
    programmes,
    selectedProgramme,
    openDialog,
    confirmDeleteDialog,
    loading,
    setSelectedProgramme,
    setOpenDialog,
    setConfirmDeleteDialog,
    fetchProgrammes,
    createProgramme,
    updateProgramme,
    deleteProgramme
  } = useProgrammeManagement();

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
  } = useSorting('programmeName', 'asc');

  useEffect(() => {
    setPageTitle('Programme Management');
  }, [setPageTitle]);

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
    const paginatedResult = await fetchProgrammes(requestDto);
    setTotal(paginatedResult.totalCount);
  }, [getPaginationParams, getSortParams, searchTerm]);
  
  useEffect(() => {
    loadData();
  }, [loadData]);

  // create / update
  const handleSubmit = async (values, { resetForm }) => {
    const operation = selectedProgramme ? updateProgramme : createProgramme;
    const success = await operation(values);
    if (success) {
      await loadData();
      const message = selectedProgramme 
        ? 'Programme updated successfully'
        : 'Programme created successfully';
      showSuccessMessage(message);
      resetForm();
      setOpenDialog(false);
    }
  };

  // delete
  const handleDeleteConfirm = async () => {
    if (confirmDeleteDialog.programme) {
      const success = await deleteProgramme(confirmDeleteDialog.programme);
      if (success) {
        setConfirmDeleteDialog({ open: false, programme: null });
        await loadData();
        showSuccessMessage('Programme deleted successfully');
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

      <AdminHeader title={`Programme Management (${total})`}>
        <TextButton 
          onClick={() => {
            setSelectedProgramme(null);
            setOpenDialog(true);
          }} 
          Icon={<AddIcon />}
          color="primary"
        >
          Add New Programme
        </TextButton>
      </AdminHeader>

      <SearchField
        placeholder="Search programmes..."
        onSearch={handleSearch}
        debounceTime={1000}
      />

      <ProgrammeTable
        programmes={programmes}
        total={total}
        page={page}
        rowsPerPage={rowsPerPage}
        orderBy={orderBy}
        order={order}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onSort={handleSort}
        onEdit={(programme) => {
          setSelectedProgramme(programme);
          setOpenDialog(true);
        }}
        onDelete={(programme) => {
          setConfirmDeleteDialog({
            open: true,
            programme
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
        <ProgrammeForm
          initialValues={selectedProgramme ? {
            name: selectedProgramme.programmeName
          } : { name: '' }}
          onSubmit={handleSubmit}
          onCancel={() => setOpenDialog(false)}
          isEditing={!!selectedProgramme}
        />
        
      </Dialog>

      <ConfirmDialog
        open={confirmDeleteDialog.open}
        title="Delete Programme"
        content="Are you sure you want to delete this programme? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDeleteDialog({ open: false, programme: null })}
        confirmText="Delete"
        cancelText="Cancel"
        type="delete"
      />
    </Box>
  );
};

export default ProgrammeManagement; 