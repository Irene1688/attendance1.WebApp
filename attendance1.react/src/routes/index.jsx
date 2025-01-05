import { createBrowserRouter, Navigate } from 'react-router-dom';
import AdminLayout from '../components/Layout/AdminLayout/AdminLayout';
import AdminDashboard from '../pages/admin/Dashboard';
import Login from '../pages/auth/Login';
// import Programmes from '../pages/admin/Programmes';
// import Courses from '../pages/admin/Courses';
// import LecturerDashboard from '../pages/lecturer/Dashboard';
// import StudentDashboard from '../pages/student/Dashboard';
import PrivateRoute from './PrivateRoute';
import RootRedirect from './RootRedirect';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRedirect />
  },
  {
    path: '/login',
    element: <Login />
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
      // {
      //   path: 'programmes',
      //   element: <Programmes />
      // },
      // {
      //   path: 'courses/*',
      //   element: <Courses />
      // },
    ]
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />
  }
]); 