import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login';
import AdminDashboard from '../pages/admin/Dashboard';
// import LecturerDashboard from '../pages/lecturer/Dashboard';
// import StudentDashboard from '../pages/student/Dashboard';
import PrivateRoute from './PrivateRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/admin/*',
    element: (
      <PrivateRoute role="Admin">
        <AdminDashboard />
      </PrivateRoute>
    )
  },
  
  // {
  //   path: '/lecturer/*',
  //   element: (
  //     <PrivateRoute role="Lecturer">
  //       <LecturerDashboard />
  //     </PrivateRoute>
  //   )
  // },
  // {
  //   path: '/student/*',
  //   element: (
  //     <PrivateRoute role="Student">
  //       <StudentDashboard />
  //     </PrivateRoute>
  //   )
  // }
]); 