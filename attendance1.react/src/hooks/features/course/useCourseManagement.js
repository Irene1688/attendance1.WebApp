import { useState, useCallback } from 'react';
import { adminApi } from '../../../api/admin';
import { useApiExecutor } from '../../common';

export const useCourseManagement = () => {
  // states
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [programmes, setProgrammes] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState({
    open: false,
    course: null
  });

  // hooks
  const { loading, handleApiCall } = useApiExecutor();

  // CRUD operations
  const fetchCourses = useCallback(async (params) => {
    const requestDto = {
      paginatedRequest: {
        pageNumber: params.paginatedRequest.pageNumber,
        pageSize: params.paginatedRequest.pageSize,
        orderBy: params.paginatedRequest.orderBy,
        isAscending: params.paginatedRequest.isAscending
      },
      searchTerm: params.searchTerm || '',
      filters: {
        programmeId: params.filters?.programmeId || null,
        lecturerId: params.filters?.lecturerId || null,
        status: params.filters?.status || null,
        session: params.filters?.session || null
      }
    };
    return await handleApiCall(
      () => adminApi.getAllCourses(requestDto),
      (paginatedResult) => {
        console.log('Response:', paginatedResult);
        setCourses(paginatedResult.data || []);
        return paginatedResult;
      }
    );
  }, [handleApiCall]);

  const createCourse = useCallback(async (values) => {
    const requestDto = {
      courseCode: values.courseCode,
      courseName: values.courseName,
      courseSession: values.courseSession,
      programmeId: values.programmeId,
      lecturerId: values.lecturerId,
      classDay: values.classDay,
      courseStartFrom: values.startDate,
      courseEndTo: values.endDate,
      tutorials: values.tutorials.map(tutorial => ({
        tutorialName: tutorial.name,
        classDay: tutorial.classDay
      }))
    };

    return await handleApiCall(
      () => adminApi.createCourse(requestDto),
      () => true
    );
  }, [handleApiCall]);

  const updateCourse = useCallback(async (values) => {
    if (!selectedCourse) {
      throw new Error('No course selected for update');
    }

    const requestDto = {
      courseId: selectedCourse.courseId,
      courseCode: values.courseCode,
      courseName: values.courseName,
      courseSession: values.courseSession,
      programmeId: values.programmeId,
      lecturerId: values.lecturerId,
      classDay: values.classDay,
      courseStartFrom: values.startDate,
      courseEndTo: values.endDate,
      tutorials: values.tutorials.map(tutorial => ({
        tutorialId: tutorial.id,
        tutorialName: tutorial.name,
        classDay: tutorial.classDay
      }))
    };

    return await handleApiCall(
      () => adminApi.updateCourse(requestDto),
      () => true
    );
  }, [handleApiCall, selectedCourse]);

  const deleteCourse = useCallback(async (course) => {
    return await handleApiCall(
      () => adminApi.deleteCourse({ id: course.courseId }),
      () => true
    );
  }, [handleApiCall]);

  const fetchCourseById = useCallback(async (id) => {
    return await handleApiCall(
      () => adminApi.getCourseById(id),
      (data) => {
        setSelectedCourse(data);
        return data;
      }
    );
  }, [handleApiCall]);

  const loadFilterOptions = useCallback(async () => {
    const [programmeResult, lecturerResult] = await Promise.all([
      handleApiCall(
        () => adminApi.getAllProgrammes({ 
          paginatedRequest: { pageNumber: 1, pageSize: 100 } 
        }),
        (result) => result
      ),
      handleApiCall(
        () => adminApi.getAllLecturers({ 
          paginatedRequest: { pageNumber: 1, pageSize: 100 } 
        }),
        (result) => result
      )
    ]);
    
    setProgrammes(programmeResult?.data || []);
    setLecturers(lecturerResult?.data || []);
  }, [handleApiCall]);

  const bulkDeleteCourses = useCallback(async (courseIds) => {
    return await handleApiCall(
      () => adminApi.bulkDeleteCourses({ courseIds }),
      () => true
    );
  }, [handleApiCall]);

  return {
    // states
    courses,
    selectedCourse,
    openDialog,
    confirmDeleteDialog,
    loading,
    programmes,
    lecturers,
    
    // setters
    setSelectedCourse,
    setOpenDialog,
    setConfirmDeleteDialog,
    
    // operations
    fetchCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    fetchCourseById,
    loadFilterOptions,
    bulkDeleteCourses
  };
}; 