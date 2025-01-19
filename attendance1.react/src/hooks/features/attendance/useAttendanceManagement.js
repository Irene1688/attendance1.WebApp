import { useState, useCallback } from 'react';
import { adminApi } from '../../../api/admin';
import { useApiExecutor } from '../../common';

export const useAttendanceManagement = () => {
    // states
    const [attendanceRecords, setAttendanceRecords] = useState([]);

    // hooks
    const { loading, handleApiCall } = useApiExecutor();

    // CRUD operations
    const fetchAttendanceRecords = useCallback(async (params) => {
        const requestDto = {
            courseId: params.courseId,
            paginatedRequest: {
              pageNumber: params.paginatedRequest.pageNumber,
              pageSize: params.paginatedRequest.pageSize,
              orderBy: params.paginatedRequest.orderBy,
              isAscending: params.paginatedRequest.isAscending
            }
        };
        return await handleApiCall(
          () => adminApi.getAttendanceRecordsByCourseId(requestDto),
          (paginatedResult) => {
            setAttendanceRecords(paginatedResult.data || []);
            return paginatedResult;
          }
        );
    }, [handleApiCall]);
    
    return {
        loading,
        attendanceRecords,
        fetchAttendanceRecords
    }
    
}