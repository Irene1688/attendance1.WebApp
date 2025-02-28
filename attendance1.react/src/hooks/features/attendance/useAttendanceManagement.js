import { useState, useCallback } from 'react';
import { attendanceApi } from '../../../api/attendance';
import { useApiExecutor } from '../../common';
import { id } from 'date-fns/locale';

export const useAttendanceManagement = () => {
    // states
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [attendanceCode, setAttendanceCode] = useState(null);
    const [studentAttendanceRecords, setStudentAttendanceRecords] = useState([]);
    const [openGenerateNewAttendanceSessionDialog, setOpenGenerateNewAttendanceSessionDialog] = useState(false);

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

    const markAbsentForUnattendedStudents = useCallback(async (courseId, attendanceCodeId, tutorialId) => {
      var requestDto = {
        courseId: Number(courseId),
        attendanceCodeId: Number(attendanceCodeId),
        tutorialId: Number(tutorialId)
      }
      return await handleApiCall(
          () => attendanceApi.markAbsentForUnattended(requestDto),
          () => true
      );
    }, [handleApiCall]);

    const generateNewAttendanceSession = useCallback(async (params) => {
      const requestDto = {
        courseId: Number(params.courseId),
        AttendanceDate: params.AttendanceDate,
        StartTime: params.StartTime,
        IsLecture: params.IsLecture,
        TutorialId: params.TutorialId
      }
      return await handleApiCall(
        () => attendanceApi.generateNewAttendanceSession(requestDto),
        () => true
      );

    }, [handleApiCall]);

    const updateStudentAttendanceStatus = useCallback(async (params) => {
      const requestDto = {
        courseId: Number(params.courseId),
        attendanceCodeId: Number(params.attendanceCodeId),
        studentId: params.studentId,
        isPresent: params.isPresent
      };
      
      return await handleApiCall(
        () => attendanceApi.updateStudentAttendanceStatus(requestDto),
        () => true
      );
    }, [handleApiCall]);

    // fetch attendance of a student
    const fetchAttendanceOfStudent = useCallback(async (studentId, courseId = 0, isCurrentWeek = false) => {
      const requestDto = {
        idInString: studentId,
        idInInteger: Number(courseId)
      }
      return await handleApiCall(
        () => attendanceApi.getAttendanceOfStudent(requestDto, isCurrentWeek),
        (response) => {
          setStudentAttendanceRecords(response);
          return response;
        }
      );
    }, [handleApiCall]);

    // submit attendance by a student
    const submitAttendance = useCallback(async (params) => {
      const requestDto = {
        studentId: params.studentId,
        attendanceCode: String(params.attendanceCode)
      };
      return await handleApiCall(
        () => attendanceApi.submitAttendance(requestDto),
        () => true
      );
    }, [handleApiCall]);

    const deleteAttendanceRecord = useCallback(async (recordId) => {
      return await handleApiCall(
        () => attendanceApi.deleteAttendanceRecord({ id: Number(recordId) }),
        () => true
      );
    }, [handleApiCall]);

    return {
        loading,
        openGenerateNewAttendanceSessionDialog,
        attendanceRecords,
        attendanceCode,
        studentAttendanceRecords,
        setOpenGenerateNewAttendanceSessionDialog,
        fetchAttendanceRecords,
        generateAttendanceCode,
        fetchStudentAttendanceRecords,
        markAbsentForUnattendedStudents,
        generateNewAttendanceSession,
        updateStudentAttendanceStatus,
        fetchAttendanceOfStudent,
        submitAttendance,
        deleteAttendanceRecord
    }
    
}