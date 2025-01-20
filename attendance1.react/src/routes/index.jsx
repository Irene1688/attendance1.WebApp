import { createBrowserRouter, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import RootRedirect from './RootRedirect';
import AdminLayout from '../components/Layout/AdminLayout/AdminLayout';
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
import Profile from '../pages/admin/Profile';

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
      <PrivateRoute role="Admin">
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
    path: '*',
    element: <Navigate to="/login" replace />
  }
]); 