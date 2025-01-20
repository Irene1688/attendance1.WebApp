import { useState, useCallback } from 'react';
import { programmeApi } from '../../../api/programme';
import { useApiExecutor } from '../../common';

export const useProgrammeManagement = () => {
  // states
  const [programmes, setProgrammes] = useState([]);
  const [programmeSelection, setProgrammeSelection] = useState([]);
  const [selectedProgramme, setSelectedProgramme] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState({
    open: false,
    programme: null
  });

  // hooks
  const { loading, handleApiCall } = useApiExecutor();

  // CRUD operations
  const fetchProgrammeSelection = useCallback(async () => {
    return await handleApiCall(
      () => programmeApi.getProgrammeSelection(),
      (response) => {
        setProgrammeSelection(response.programmes || []);
        return response.programmes;
      }
    );
  }, [handleApiCall]);

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
      () => programmeApi.getAllProgrammes(requestDto),
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
      () => programmeApi.createProgramme(requestDto),
      () => true
    );
  }, [handleApiCall]);

  const updateProgramme = useCallback(async (values) => {
    const requestDto = {
      programmeId: selectedProgramme.programmeId,
      programmeName: values.name,
    };
    return await handleApiCall(
      () => programmeApi.updateProgramme(requestDto),
      () => true
    );
  }, [handleApiCall, selectedProgramme]);

  const deleteProgramme = useCallback(async (programme) => {
    return await handleApiCall(
      () => programmeApi.deleteProgramme({ id: programme.programmeId }),
      () => true
    );
  }, [handleApiCall]);

  return {
    // states
    programmes,
    programmeSelection,
    selectedProgramme,
    openDialog,
    confirmDeleteDialog,
    loading,
    
    // setters
    setSelectedProgramme,
    setProgrammeSelection,
    setOpenDialog,
    setConfirmDeleteDialog,
    
    // operations
    fetchProgrammes,
    fetchProgrammeSelection,
    createProgramme,
    updateProgramme,
    deleteProgramme
  };
}; 