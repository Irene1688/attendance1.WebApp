import { useState, useCallback } from 'react';
import { adminApi } from '../../../api/admin';
import { useApiExecutor } from '../../common';

export const useLecturerManagement = () => {
    // states
    const [lecturers, setLecturers] = useState([]);
    const [selectedLecturer, setSelectedLecturer] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        lecturer: null
    });

    // hooks
    const { loading, handleApiCall } = useApiExecutor();

    // CRUD operations

    return {
      // states
      lecturers,
      selectedLecturer,
      openDialog,
      confirmDialog,
      loading,

      // setters
      setSelectedLecturer,
      setOpenDialog,
      setConfirmDialog,

      // operations
      fetchLecturers,
      createLecturer,
      updateLecturer,
      deleteLecturer
    };
};