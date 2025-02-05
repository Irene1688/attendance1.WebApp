import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { courseApi } from '../../../api/course';
import { useApiExecutor } from '../../common';
import { useDispatch } from 'react-redux';
import { setLecturerCoursesMenuItems } from '../../../store/slices/courseSlice';

export const useCourseById = () => {
  // states
  const [courseMenuItems, setCourseMenuItems] = useState([]);
  const [activeCourses, setActiveCourses] = useState([]);
  const [course, setCourse] = useState(null);
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();

  // hooks
  const { loading, handleApiCall } = useApiExecutor();

  // operations
  // fetch active course of a lecturer 
  // fetch name and id only
  const fetchActiveCoursesMenuItems = useCallback(async () => {
    if (!user?.campusId) return;

    const requestDto = {
      idInString: user.campusId,
      idInInteger: user.userId
    };

    return await handleApiCall(
      () => courseApi.getActiveCourseSelectionByLecturerId(requestDto),
      (response) => {
        if (!response) return;
        const menuItems = response.courses?.map(course => ({
          id: course.id,
          name: course.name
        }));  
        dispatch(setLecturerCoursesMenuItems(menuItems));
      }
    );
  }, [handleApiCall, dispatch, user?.campusId]);

  // fetch active course of a lecturer 
  // fetch basic info of the course
  const fetchActiveCoursesByLecturerId = useCallback(async () => {
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

  const fetchActiveCoursesByStudentId = useCallback(async () => {
    if (!user?.campusId) return;

    const requestDto = {
      idInString: user.campusId,
      idInInteger: user.userId
    };
    return await handleApiCall(
      () => courseApi.getActiveCoursesByStudentId(requestDto),
      (response) => {
        setActiveCourses(response || []);
        return response;
      }
    );
  }, [handleApiCall, user?.campusId]);


  // fetch all details of a course
  const fetchCourseById = useCallback(async (id) => {
    if (!id) return;

    const requestDto = {
      idInInteger: Number(id)
    };

    return await handleApiCall(
      () => courseApi.getCourseDetailsById(requestDto),
      (response) => {
        setCourse(response);
        return response;
      }
    );
  }, [handleApiCall]);

  return {
    // states
    courseMenuItems,
    activeCourses,
    course,
    loading,

    // operations
    fetchActiveCoursesMenuItems,
    fetchActiveCoursesByLecturerId,
    fetchActiveCoursesByStudentId,
    fetchCourseById
  };
}; 