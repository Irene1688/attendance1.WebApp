import { useState, useCallback } from 'react';
import { adminApi } from '../../../api/admin';
import { useApiExecutor } from '../../common';

export const useCourseManagement = () => {
  // states
  const [courses, setCourses] = useState([]);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState({
    open: false,
    course: null
  });
  const [confirmMultipleDeleteDialog, setConfirmMultipleDeleteDialog] = useState({
    open: false,
    courseIds: []
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
    return await handleApiCall(
      () => adminApi.createCourse(requestDto),
      () => true
    );
  }, [handleApiCall]);

  const updateCourse = useCallback(async (id, values) => {
    if (!id) {
      throw new Error('No course selected for update');
    }

    const requestDto = {
      courseId: Number(id),
      courseCode: values.courseCode,
      courseName: values.courseName,
      courseSession: values.courseSession,
      programmeId: Number(values.programmeId),
      lecturerUserId: Number(values.userId),
      classDays: values.classDays,
      courseStartFrom: values.startDate,
      courseEndTo: values.endDate,
      tutorials: values.tutorials.map(tutorial => ({
        tutorialId: tutorial.id,
        tutorialName: tutorial.name,
        classDay: Number(tutorial.classDay)
      }))
    };
    console.log('Request:', requestDto);
    return await handleApiCall(
      () => adminApi.updateCourse(requestDto),
      () => true
    );
  }, [handleApiCall]);

  const deleteCourse = useCallback(async (course) => {
    return await handleApiCall(
      () => adminApi.deleteCourse({ id: course.courseId }),
      () => true
    );
  }, [handleApiCall]);

  const bulkDeleteCourses = useCallback(async (courseIds) => {
    if (!courseIds?.length) {
      throw new Error('No courses selected for deletion');
    }

    const requestDto = courseIds.map(id => ({
      id: id
    }));

    return await handleApiCall(
      () => adminApi.MultipleDeleteCourse(requestDto),
      () => true
    );
  }, [handleApiCall]);

  return {
    // states
    courses,
    confirmDeleteDialog,
    confirmMultipleDeleteDialog,
    loading,
    
    // setters
    setConfirmDeleteDialog,
    setConfirmMultipleDeleteDialog,
    // operations
    fetchCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    bulkDeleteCourses,
  };
}; 