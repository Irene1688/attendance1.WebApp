import { useState, useCallback } from 'react';
import { attendanceApi } from '../../../api/attendance';
import { useApiExecutor } from '../../common';

export const useAttendanceManagement = () => {
    // states
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [attendanceCode, setAttendanceCode] = useState(null);
    const [studentAttendanceRecords, setStudentAttendanceRecords] = useState([]);

    // hooks
    const { loading, handleApiCall } = useApiExecutor();

    // CRUD operations
    // fetch attendance records without student info
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
    
    // fetch attendance records with student info
    const fetchStudentAttendanceRecords = useCallback(async (courseId) => {
      const requestDto = {
          idInInteger: Number(courseId),
      }  
      return await handleApiCall(
        () => attendanceApi.getCourseStudentAttendanceRecords(requestDto),
        (data) => {
          setStudentAttendanceRecords(data);
          return data;
        }
      );
      }, [handleApiCall]);

    const markAbsentForUnattendedStudents = useCallback(async (courseId, attendanceCodeId) => {
      var requestDto = {
        courseId: Number(courseId),
        attendanceCodeId: Number(attendanceCodeId)
      }
        return await handleApiCall(
            () => attendanceApi.markAbsentForUnattended(requestDto),
            () => true
        );
    }, [handleApiCall]);

    return {
        loading,
        attendanceRecords,
        attendanceCode,
        studentAttendanceRecords,
        fetchAttendanceRecords,
        generateAttendanceCode,
        fetchStudentAttendanceRecords,
        markAbsentForUnattendedStudents
    }
    
}