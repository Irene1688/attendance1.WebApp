import { useState, useCallback } from 'react';
import { adminApi } from '../../../api/admin';
import { useApiExecutor } from '../../common';

export const useEnrolledStudentManagement = () => {
    // states
    const [enrolledStudents, setEnrolledStudents] = useState([]);
    const [availableStudents, setAvailableStudents] = useState([]);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [confirmRemoveDialog, setConfirmRemoveDialog] = useState({
        open: false,
        students: []
    });

    // hooks
    const { loading, handleApiCall } = useApiExecutor();

    // CRUD operations
    const fetchEnrolledStudents = useCallback(async (params) => {
      const requestDto = {
          paginatedRequest: {
            pageNumber: params.paginatedRequest.pageNumber,
            pageSize: params.paginatedRequest.pageSize,
            orderBy: params.paginatedRequest.orderBy,
            isAscending: params.paginatedRequest.isAscending
          },
          searchTerm: params.searchTerm || '',
          courseId: params.courseId
      };
      return await handleApiCall(
        () => adminApi.getEnrolledStudents(requestDto),
        (paginatedResult) => {
          setEnrolledStudents(paginatedResult.data || []);
          return paginatedResult;
        }
      );
    }, [handleApiCall]);

    const fetchAvailableStudents = useCallback(async (programmeId, courseId) => {
        const requestDto = {
            programmeId: Number(programmeId) || 0,
            courseId: Number(courseId) || 0
        };
        return await handleApiCall(
            () => adminApi.getAvailableStudents(requestDto),
            (response) => {
                setAvailableStudents(response.students || []);
                return response.students;
            }
        );
    }, [handleApiCall]);

    const addStudentToCourse = useCallback(async (id, values) => {
        const requestDto = {
            courseId: Number(id) || 0,
            tutorialId: Number(values.tutorialId) || 0,
            studentUserIds: values.students.map(student => student.studentUserId),
            studentIds: values.students.map(student => student.studentId)
        };
        return await handleApiCall(
            () => adminApi.addStudentToCourse(requestDto),
            () => true
        );
    }, [handleApiCall]);

    const removeStudentFromCourse = useCallback(async (id, students) => {
        const requestDto = {
            courseId: Number(id),
            StudentIdList: students.map(s => s.studentId)
        };
        return await handleApiCall(
            () => adminApi.removeStudentFromCourse(requestDto),
            () => true
        );
    }, [handleApiCall]);
    
  return {
    loading,
    openAddDialog,
    confirmRemoveDialog,
    enrolledStudents,
    availableStudents,
    setOpenAddDialog,
    setConfirmRemoveDialog,
    fetchEnrolledStudents,
    fetchAvailableStudents,
    addStudentToCourse,
    removeStudentFromCourse
  }
}