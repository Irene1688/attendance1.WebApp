import { TableRow, TableCell, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { styles } from './EmptyState.styles';

const EmptyState = ({ 
  icon: Icon = SearchIcon,
  title = 'No Data Found',
  message,
  colSpan = 1,
  ...props 
}) => {
  return (
    <TableRow>
      <TableCell 
        colSpan={colSpan} 
        align="center"
        sx={styles.cell}
      >
        <Icon sx={styles.icon} />
        <Typography 
          variant="h6" 
          component="div"
        >
          {title}
        </Typography>
        <Typography 
          variant="body2" 
          className="noDataMessage"
        >
          {message}
        </Typography>
      </TableCell>
    </TableRow>
  );
};

export default EmptyState; 