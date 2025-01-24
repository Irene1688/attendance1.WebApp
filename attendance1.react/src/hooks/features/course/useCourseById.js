import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { courseApi } from '../../../api/course';
import { useApiExecutor } from '../../common';

export const useCourseById = () => {
  // states
  const [courseMenuItems, setCourseMenuItems] = useState([]);
  const [activeCourses, setActiveCourses] = useState([]);
  const user = useSelector(state => state.auth.user);

  // hooks
  const { loading, handleApiCall } = useApiExecutor();

  // operations
  const fetchActiveCoursesMenuItems = useCallback(async () => {
    if (!user?.campusId) return;

    const requestDto = {
      idInString: user.campusId,
      idInInteger: user.userId
    };

    return await handleApiCall(
      () => courseApi.getActiveCourseSelectionByLecturerId(requestDto),
      (response) => {
        setCourseMenuItems(response.courses?.map(course => ({
          id: course.id,
          name: `${course.name}`
        })) || []);
        return response.courses;
      }
    );
  }, [handleApiCall, user?.campusId]);

  const fetchActiveCourses = useCallback(async () => {
    if (!user?.campusId) return;

    const requestDto = {
      idInString: user.campusId,
      idInInteger: user.userId
    };
    return await handleApiCall(
      () => courseApi.getActiveCoursesByLecturerId(requestDto),
      // (response) => {
      //   setActiveCourses(response?.courses?.map(course => ({
      //     id: course.courseId,
      //     courseCode: course.courseCode,
      //     name: course.courseName,
      //     session: course.courseSession,
      //     classDay: course.classDay || '' ,
      //     tutorials: course.tutorials || []
      //   })) || []);
      (response) => {
        setActiveCourses(response?.courses || []);
        return response.courses;
      }
    );
  }, [handleApiCall, user?.campusId]);

  return {
    // states
    courseMenuItems,
    activeCourses,
    loading,

    // operations
    fetchActiveCoursesMenuItems,
    fetchActiveCourses
  };
}; 