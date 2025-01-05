import { useSelector } from 'react-redux';
import { Typography } from '@mui/material';

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  console.log("i am rendered");
  return (
    <Typography variant="h4" component="h1" gutterBottom>
      Hello, {user?.name || 'Admin'}.
    </Typography>
  );
};

export default AdminDashboard; 