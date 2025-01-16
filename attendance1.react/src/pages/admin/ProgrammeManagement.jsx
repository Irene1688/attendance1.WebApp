import { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Typography,
  TableRow,
  TableCell,
  Dialog,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { adminApi } from '../../api/admin';
import { useApiExecutor } from '../../hooks/useApiExecutor';
import { useMessageContext } from '../../contexts/MessageContext';
import { 
  Loader, 
  PromptMessage, 
  TextButton, 
  IconButton, 
  ConfirmDialog,
  SearchField,
  PaginatedTable
} from '../../components/Common';
import { ProgrammeForm } from '../../components/Admin';
import { useSorting } from '../../hooks/useSorting';
import { usePagination } from '../../hooks/usePagination';

const ProgrammeManagement = () => {
  // states
  const [programmes, setProgrammes] = useState([]);
  const [selectedProgramme, setSelectedProgramme] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    programme: null
  });

  // hooks
  const { loading, handleApiCall } = useApiExecutor();

  const { message, showSuccessMessage, hideMessage } = useMessageContext();
  
  const {
    page,
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
  } = useSorting('programmeName', 'asc', () => {
    setPage(0); // reset to first page
  });

  // fetch programmes
  const fetchProgrammes = useCallback(async () => {
    const requestDto = {
      paginatedRequest: {
        ...getPaginationParams(),
        ...getSortParams()
      },
      searchTerm: searchTerm
    }
    await handleApiCall(
      () => adminApi.getAllProgrammes(requestDto),
      (paginatedResult) => {
        setProgrammes(paginatedResult.data || []);
        setTotal(paginatedResult.totalCount || 0);
      }
    );
  }, [searchTerm, getPaginationParams, getSortParams]);

  useEffect(() => {
    fetchProgrammes();
  }, [searchTerm, getPaginationParams, getSortParams]);

  // handle search
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    setPage(0);
  }, []);

  // crud operations
  const handleAddClick = () => {
    setSelectedProgramme(null);
    setOpenDialog(true);
  };

  const handleEditClick = (programme) => {
    setSelectedProgramme(programme);
    setOpenDialog(true);
  };

  const handleDeleteClick = (programme) => {
    setConfirmDialog({
      open: true,
      programme
    });
  };

  // Handle form submission (create/update)
  const handleSubmit = async (values, { resetForm }) => {
    if (selectedProgramme) {
      // Update existing programme
      const requestDto = {
        programmeId: selectedProgramme.programmeId,
        programmeName: values.name,
      }
      await handleApiCall(
        () => adminApi.updateProgramme(requestDto),
        async () => {
          await fetchProgrammes();
          showSuccessMessage('Programme updated successfully');
        },
        () => {
          resetForm();
          setOpenDialog(false);
        }
      );
    } else {
      // Create new programme
      const requestDto = {
        programmeName: values.name
      };      
      await handleApiCall(
        () => adminApi.createProgramme(requestDto),
        async () => {
          await fetchProgrammes();
          showSuccessMessage('Programme created successfully');
        },
        () => {
          resetForm();
          setOpenDialog(false);
        }
      );
    }
  };

  const deleteProgramme = async (programme) => {
    await handleApiCall(
      () => adminApi.deleteProgramme({ id: programme.programmeId }),
      async () => {
        await fetchProgrammes();
        showSuccessMessage('Programme deleted successfully');
      },
      () => {
        setConfirmDialog({ open: false, programme: null });
      }
    );
  };

  // define table columns' headers
  const columns = [
    {
      id: 'programmeName',
      label: 'Programme Name',
      sortable: true
    },
    {
      id: 'actions',
      label: 'Actions',
      sortable: false,
    }
  ];
  
  // define table content renderer
  const renderRow = useCallback((programme) => (
    <TableRow key={programme.programmeId}>
      <TableCell>{programme.programmeName}</TableCell>
      <TableCell>
        <IconButton
          Icon={<EditIcon />}
          onClick={() => handleEditClick(programme)}
          color="cancel"
        />
        <IconButton
          Icon={<DeleteIcon />}
          onClick={() => handleDeleteClick(programme)}
          color="delete"
        />
      </TableCell>
    </TableRow>
  ), []);
  
  return (
    <Box sx={{ pl: 3, pr: 3 }}>
      {loading && <Loader />}
      
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

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Programme Management ({total})</Typography>
        <TextButton 
          onClick={handleAddClick} 
          Icon={<AddIcon />}
          color="primary"
        >
          Add New Programme
        </TextButton>
      </Box>

      <Box sx={{ mb: 3 }}>
        <SearchField
          placeholder="Search programmes..."
          onSearch={handleSearch}
          debounceTime={1000}
        />
      </Box>

      <PaginatedTable
        columns={columns}
        data={programmes}
        total={total}
        page={page}
        rowsPerPage={rowsPerPage}
        orderBy={orderBy}
        order={order}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onSort={handleSort}
        renderRow={renderRow}
        emptyState={{
          title: "No Programmes Found",
          message: searchTerm 
            ? "Try adjusting your search to find what you're looking for."
            : "Try adding some programmes using the 'Add New Programme' button."
        }}
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
        open={confirmDialog.open}
        title="Delete Programme"
        content="Are you sure you want to delete this programme? This action cannot be undone."
        onConfirm={() => confirmDialog.programme && deleteProgramme(confirmDialog.programme)}
        onCancel={() => setConfirmDialog({ open: false, programme: null })}
        confirmText="Delete"
        cancelText="Cancel"
        type="delete"
      />
    </Box>
  );
};

export default ProgrammeManagement; 