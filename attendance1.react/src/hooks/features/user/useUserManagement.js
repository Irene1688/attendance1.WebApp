import { useState, useCallback } from 'react';
import { accountApi } from '../../../api/account';
import { useApiExecutor } from '../../common';
import { USER_ROLES } from '../../../constants/userRoles';

export const useUserManagement = () => {
    // states
    const [lecturers, setLecturers] = useState([]);
    const [students, setStudents] = useState([]);
    const [lecturerSelection, setLecturerSelection] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [confirmDeleteDialog, setConfirmDeleteDialog] = useState({
        open: false,
        user: null
    });
    const [confirmMultipleDeleteDialog, setConfirmMultipleDeleteDialog] = useState({
        open: false,
        userIds: []
    });
    const [confirmResetDialog, setConfirmResetDialog] = useState({
        open: false,
        user: null
    });
    const [confirmRebindDialog, setConfirmRebindDialog] = useState({
        open: false,
        user: null
    });

    // hooks
    const { loading, handleApiCall } = useApiExecutor();

    // CRUD operations
    const fetchLecturerSelection = useCallback(async () => {
        return await handleApiCall(
            () => accountApi.getLecturerSelection(),
            (response) => {
                setLecturerSelection(response.lecturers || []);
                return response.lecturers;
            }
        );
    }, [handleApiCall]);

    const fetchLecturers = useCallback(async (params) => {
        try {
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
            () => accountApi.getAllLecturers(requestDto),
            (paginatedResult) => {
                setLecturers(paginatedResult.data || []);
                return paginatedResult;
            }
            );
        } catch (error) {
            console.error('fetchLecturers', error);
            return null;
        }
    }, [handleApiCall]);

    const fetchStudents = useCallback(async (params) => {
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
            () => accountApi.getAllStudents(requestDto),
            (paginatedResult) => {
                setStudents(paginatedResult.data || []);
                return paginatedResult;
            }
        );
    }, [handleApiCall]);

    const createUser = useCallback(async (values) => {
        const requestDto = {
            campusId: values.campusId,
            name: values.name,
            email: values.email,
            password: values.campusId.toLowerCase(),
            role: values.role,
            programmeId: Number(values.programmeId),
        };
        return await handleApiCall(
            () => accountApi.createUser(requestDto),
            () => {
                return true;
            }
        );
    }, [handleApiCall]);

    const updateUser = useCallback(async (values) => {
        const requestDto = {
            userId: selectedUser.userId,
            campusId: values.campusId,
            name: values.name,
            email: values.email,
            role: values.role
        };
        console.log('selectedUser', selectedUser);
        return await handleApiCall(
            () => accountApi.updateUser(requestDto),
            () => {
                return true;
            }
        );
    }, [handleApiCall]);

    const deleteUser = useCallback(async (user) => {
        return await handleApiCall(
            () => accountApi.deleteUser({ id: user.userId }),
            () => {
                return true;
            }
        );
    }, [handleApiCall]);

    const bulkDeleteUsers = useCallback(async (userIds) => {
        if (!userIds?.length) {
          throw new Error('No users selected for deletion');
        }
    
        const requestDto = userIds.map(id => ({
          id: id
        }));
    
        return await handleApiCall(
          () => accountApi.MultipleDeleteUser(requestDto),
          () => true
        );
      }, [handleApiCall]);

    const resetPassword = useCallback(async (user, role) => {
        const requestDto = {
            idInInteger: user.userId,
            idInString: role === USER_ROLES.LECTURER ? user.lecturerId : user.studentId
        };
        return await handleApiCall(
            () => accountApi.resetPassword(requestDto),
            () => {
                return true;
            }
        );
    }, [handleApiCall]);

    const rebindStudentDevice = useCallback(async (user) => {
        const requestDto = {
            idInInteger: user.userId,
            idInString: user.studentId
        };
        return await handleApiCall(
            () => accountApi.rebindStudentDevice(requestDto),
            () => true
        );
    }, [handleApiCall]);

    return {
        // states
        lecturers,
        students,
        lecturerSelection,
        selectedUser,
        openDialog,
        confirmRebindDialog,
        confirmDeleteDialog,
        confirmMultipleDeleteDialog,
        confirmResetDialog,
        loading,
        
        // setters
        setLecturers,
        setStudents,
        setLecturerSelection,
        setSelectedUser,
        setOpenDialog,
        setConfirmRebindDialog,
        setConfirmDeleteDialog,
        setConfirmMultipleDeleteDialog,
        setConfirmResetDialog,
        
        // operations
        fetchLecturers,
        fetchStudents,
        fetchLecturerSelection,
        createUser,
        updateUser,
        deleteUser,
        resetPassword,
        bulkDeleteUsers,
        rebindStudentDevice
    };
};