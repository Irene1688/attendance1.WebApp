import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { courseApi } from '../../../api/course';
import { useApiExecutor } from '../../common';
import { isAdmin } from '../../../constants/userRoles';

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
  const { user } = useSelector(state => state.auth);

  // hooks
  const { loading, handleApiCall } = useApiExecutor();

  // CRUD operations
  const fetchCourses = useCallback(async (params, userRole) => {
    const lecturerUserId = isAdmin(userRole) 
      ? params.filters?.lecturerUserId 
      : user.userId;

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
        lecturerUserId: lecturerUserId || 0,
        status: params.filters?.status || null,
        session: params.filters?.session || null
      }
    };
    return await handleApiCall(
      () => courseApi.getAllCourses(requestDto),
      (paginatedResult) => {
        setCourses(paginatedResult.data || []);
        return paginatedResult;
      }
    );
  }, [handleApiCall]);

  const createCourse = useCallback(async (values, userRole) => {
    const requestDto = {
      createdBy: userRole,
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
      () => courseApi.createCourse(requestDto),
      (newCourseId) => newCourseId
    );
  }, [handleApiCall]);

  const updateCourse = useCallback(async (id, values, userRole) => {
    if (!id) {
      throw new Error('No course selected for update');
    }
    const requestDto = {
      updatedBy: userRole,
      courseId: Number(id),
      courseCode: values.courseCode,
      courseName: values.courseName,
      courseSession: values.courseSession,
      programmeId: Number(values.programmeId) || 0,
      lecturerUserId: Number(values.userId) || 0,
      classDays: values.classDays,
      courseStartFrom: values.startDate,
      courseEndTo: values.endDate,
      tutorials: values.tutorials.map(tutorial => ({
        tutorialId: tutorial.id,
        tutorialName: tutorial.name,
        classDay: Number(tutorial.classDay)
      })),
      removedTutorialIds: values.removedTutorialIds
    };
    return await handleApiCall(
      () => courseApi.updateCourse(requestDto),
      () => true
    );
  }, [handleApiCall]);

  const deleteCourse = useCallback(async (course) => {
    return await handleApiCall(
      () => courseApi.deleteCourse({ id: course.courseId }),
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
      () => courseApi.MultipleDeleteCourse(requestDto),
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