import { useState, useCallback } from 'react';
import { adminApi } from '../../../api/admin';
import { useApiExecutor } from '../../common';

export const useProgrammeManagement = () => {
  // states
  const [programmes, setProgrammes] = useState([]);
  const [selectedProgramme, setSelectedProgramme] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState({
    open: false,
    programme: null
  });

  // hooks
  const { loading, handleApiCall } = useApiExecutor();

  // CRUD operations
  const fetchProgrammes = useCallback(async (params) => {
    const requestDto = {
      paginatedRequest: {
        pageNumber: params.paginatedRequest.pageNumber,
        pageSize: params.paginatedRequest.pageSize,
        orderBy: params.paginatedRequest.orderBy,
        isAscending: params.paginatedRequest.isAscending
      },
      searchTerm: params.searchTerm || ''
    };

    return await handleApiCall(
      () => adminApi.getAllProgrammes(requestDto),
      (paginatedResult) => {
        setProgrammes(paginatedResult.data || []);
      }
    );
  }, [handleApiCall]);

  const createProgramme = useCallback(async (values) => {
    const requestDto = {
      programmeName: values.name
    };
    
    return await handleApiCall(
      () => adminApi.createProgramme(requestDto),
      () => {
        return true;
      }
    );
  }, [handleApiCall]);

  const updateProgramme = useCallback(async (values) => {
    const requestDto = {
      programmeId: selectedProgramme.programmeId,
      programmeName: values.name,
    };
    return await handleApiCall(
      () => adminApi.updateProgramme(requestDto),
      async () => {
        return true;
      }
    );
  }, [handleApiCall, selectedProgramme]);

  const deleteProgramme = useCallback(async (programme) => {
    return await handleApiCall(
      () => adminApi.deleteProgramme({ id: programme.programmeId }),
      () => {
        return true;
      }
    );
  }, [handleApiCall]);

  return {
    // states
    programmes,
    selectedProgramme,
    openDialog,
    confirmDeleteDialog,
    loading,
    
    // setters
    setSelectedProgramme,
    setOpenDialog,
    setConfirmDeleteDialog,
    
    // operations
    fetchProgrammes,
    createProgramme,
    updateProgramme,
    deleteProgramme
  };
}; 