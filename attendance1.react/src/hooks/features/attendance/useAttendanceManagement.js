import { useState, useCallback } from 'react';
import { attendanceApi } from '../../../api/attendance';
import { useApiExecutor } from '../../common';

export const useAttendanceManagement = () => {
    // states
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [attendanceCode, setAttendanceCode] = useState(null);

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
          () => attendanceApi.getAttendanceRecordsByCourseId(requestDto),
          (paginatedResult) => {
            setAttendanceRecords(paginatedResult.data || []);
            return paginatedResult;
          }
        );
    }, [handleApiCall]);

    const generateAttendanceCode = useCallback(async (params) => {
        const requestDto = {
            courseId: Number(params.courseId),
            isLecture: Number(params.tutorialId) === 0 ? true : false,
            durationInSeconds: Number(params.duration),
            tutorialId: Number(params.tutorialId)
        };
        return await handleApiCall(
            () => attendanceApi.generateAttendanceCode(requestDto),
            (response) => {
                setAttendanceCode(response);
                return response;
            }
        );
    }, [handleApiCall]);
    
    return {
        loading,
        attendanceRecords,
        attendanceCode,
        fetchAttendanceRecords,
        generateAttendanceCode
    }
    
}