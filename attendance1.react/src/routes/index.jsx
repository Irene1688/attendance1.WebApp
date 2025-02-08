import { createBrowserRouter, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import RootRedirect from './RootRedirect';
import { USER_ROLES } from '../constants/userRoles';
import { AdminLayout, LecturerLayout, StudentLayout } from '../components/Layout';
import Login from '../pages/auth/Login';
import { 
  AdminDashboard, 
  ProgrammeManagement, 
  LecturerManagement, 
  StudentManagement,
  CourseManagement,
  CourseDetail,
  CourseFormPage
} from '../pages/admin';
import { 
  TakeAttendance, 
  CodePage, 
  LecturerCourseDetail, 
  LecturerCourseFormPage, 
  LecturerCourseList 
} from '../pages/lecturer';
import {
  StudentHome,
  MePage,
  StudentClassDetail
} from '../pages/student';
import Profile from '../pages/Shared/Profile';
// import StudentCheckIn from '../pages/student/CheckIn/CheckIn';
// import StudentProfile from '../pages/student/Profile/Profile';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRedirect />
  },
  {
    path: '/login',
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    )
  },
  {
    path: '/admin',
    element: (
      <PrivateRoute role={[USER_ROLES.ADMIN]}>
        <AdminLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />
      },
      {
        path: 'dashboard',
        element: <AdminDashboard />
      },
      {
        path: 'programmes',
        element: <ProgrammeManagement />
      },
      {
        path: 'lecturers',
        element: <LecturerManagement />
      },
      {
        path: 'students',
        element: <StudentManagement />
      },
      {
        path: 'courses',
        element: <CourseManagement />
      },
      {
        path: 'courses/:id',
        element: <CourseDetail />
      },
      {
        path: 'courses/add',
        element: <CourseFormPage />
      },
      {
        path: 'courses/:id/edit',
        element: <CourseFormPage />
      },
      {
        path: 'profile',
        element: <Profile />
      }
    ]
  },
  {
    path: '/lecturer',
    element: (
      <PrivateRoute role={[USER_ROLES.LECTURER]}>
        <LecturerLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/lecturer/take-attendance" replace />
      },
      {
        path: 'take-attendance',
        element: <TakeAttendance />
      },
      {
        path: 'add-class',
        element: <LecturerCourseFormPage />
      },
      {
        path: 'classes/:id',
        element: <LecturerCourseDetail />
      },
      {
        path: 'classes/:id/edit',
        element: <LecturerCourseFormPage />
      },
      {
        path: 'all-classes',
        element: <LecturerCourseList />
      },
      {
        path: 'profile',
        element: <Profile />
      }
    ]
  },
  {
    path: '/lecturer/codePage',
    element: (
      <PrivateRoute role={[USER_ROLES.LECTURER]}>
        <CodePage />
      </PrivateRoute>
    )
  },
  {
    path: '/student',
    element: (
      <PrivateRoute role={[USER_ROLES.STUDENT]}>
        <StudentLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/student/home" replace />
      },
      {
        path: 'home',
        element: <StudentHome />
      },
      {
        path: 'classes/:id',
        element: <StudentClassDetail />
      },
      {
        path: 'me',
        element: <MePage />
      },
      {
        path: 'profile',
        element: <Profile />
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />
  }
]); 