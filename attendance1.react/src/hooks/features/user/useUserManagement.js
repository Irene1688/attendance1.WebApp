import { useState, useCallback } from 'react';
import { adminApi } from '../../../api/admin';
import { useApiExecutor } from '../../common';
import { USER_ROLES } from '../../../constants/userRoles';

export const useUserManagement = () => {
    // states
    const [lecturers, setLecturers] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [confirmDeleteDialog, setConfirmDeleteDialog] = useState({
        open: false,
        user: null
    });
    const [confirmResetDialog, setConfirmResetDialog] = useState({
        open: false,
        user: null
    });

    // hooks
    const { loading, handleApiCall } = useApiExecutor();

    // CRUD operations
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
            () => adminApi.getAllLecturers(requestDto),
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
            () => adminApi.getAllStudents(requestDto),
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
            role: values.role  
        };
        return await handleApiCall(
            () => adminApi.createUser(requestDto),
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
        return await handleApiCall(
            () => adminApi.updateUser(requestDto),
            () => {
                return true;
            }
        );
    }, [handleApiCall]);

    const deleteUser = useCallback(async (user) => {
        return await handleApiCall(
            () => adminApi.deleteUser({ id: user.userId }),
            () => {
                return true;
            }
        );
    }, [handleApiCall]);

    const resetPassword = useCallback(async (user, role) => {
        const requestDto = {
            idInInteger: user.userId,
            idInString: role === USER_ROLES.LECTURER ? user.lecturerId : user.studentId
        };
        return await handleApiCall(
            () => adminApi.resetPassword(requestDto),
            () => {
                return true;
            }
        );
    }, [handleApiCall]);

    return {
        // states
        lecturers,
        students,
        selectedUser,
        openDialog,
        confirmDeleteDialog,
        confirmResetDialog,
        loading,
        
        // setters
        setLecturers,
        setStudents,
        setSelectedUser,
        setOpenDialog,
        setConfirmDeleteDialog,
        setConfirmResetDialog,
        
        // operations
        fetchLecturers,
        fetchStudents,
        createUser,
        updateUser,
        deleteUser,
        resetPassword
    };
};