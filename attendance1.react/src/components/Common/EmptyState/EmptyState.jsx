import React from 'react';
import { 
  Box, 
  Typography, 
  TableCell, 
  TableRow,
  useTheme 
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { styles } from './EmptyState.styles';

const EmptyState = ({ 
  title = 'No Data', 
  message = 'No records to display.',
  icon: Icon = InfoIcon,
  colSpan = 1
}) => {
  const theme = useTheme();
  const themedStyles = styles(theme);

  const content = (
    <Box sx={themedStyles.container}>
      <Icon sx={themedStyles.icon} />
      <Typography variant="h6" sx={themedStyles.title}>
        {title}
      </Typography>
      <Typography variant="body1" sx={themedStyles.message}>
        {message}
      </Typography>
    </Box>
  );

  // 如果在表格中使用，包装在 TableRow 和 TableCell 中
  if (colSpan > 1) {
    return (
      <TableRow>
        <TableCell 
          colSpan={colSpan} 
          sx={themedStyles.tableCell}
        >
          {content}
        </TableCell>
      </TableRow>
    );
  }

  return content;
};

export default EmptyState; 