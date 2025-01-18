import { useState, useCallback } from 'react';
import { adminApi } from '../../../api/admin';
import { useApiExecutor } from '../../common';
import { DAY_TO_NUMBER } from '../../../validations/schemas/courseValidation';

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
        programmeId: params.filters?.programmeId || 0,
        lecturerUserId: params.filters?.lecturerUserId || 0,
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
      programmeId: Number(values.programmeId),
      userId: Number(values.userId),
      classDays: values.classDays,
      courseStartFrom: values.startDate,
      courseEndTo: values.endDate,
      tutorials: values.tutorials.map(tutorial => ({
        tutorialName: tutorial.name,
        classDay: Number(tutorial.classDay)
      }))
    };
    console.log('Request:', requestDto);
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
    bulkDeleteCourses
  };
}; 