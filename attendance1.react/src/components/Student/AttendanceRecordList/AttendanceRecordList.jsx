import { ListItem, ListItemIcon, ListItemText, Typography, Box, useTheme } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { ListCard } from '../../Common';
import { styles } from './AttendanceRecordList.styles';

const AttendanceRecordList = (
    {
        title = "Attendance Records",
        isLoading,
        records = [],
        emptyMessage = "No attendance record"
    }
) => {
    const theme = useTheme();
    const themedStyles = styles(theme);

    const renderAttendanceItem = (record) => (
        <ListItem>
          <ListItemIcon>
            {record.isPresent ? (
              <CheckCircleIcon color="success" />
            ) : (
              <HighlightOffIcon color="error" />
            )}
          </ListItemIcon>
          <ListItemText>
            <Box sx={themedStyles.cardItemTitle}>
              <Typography variant="body1" sx={themedStyles.classTitle}>
                <span style={themedStyles.classType(record.sessionName === 'Lecture')}>
                    {record.sessionName}
                </span>
                {record.courseCode} - {record.courseName}
              </Typography>
            </Box> 
            <Box sx={themedStyles.attendanceInfo}>
              <AccessTimeIcon fontSize="small" />
              <Box component="span" sx={{ typography: 'body2' }}>
                {(() => {
                  const utcDate = new Date(record.attendanceTime); // Create a Date object from the UTC string
                  const localDate = new Date(utcDate.getTime() + 8 * 60 * 60 * 1000); // Add 8 hours for Malaysia time
    
                  // Format the date and time
                  const options = {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                  };
                  return utcDate.toLocaleString('en-MY', options).replace(',', '');
                  // Convert to local string and format
                  //return localDate.toLocaleString('en-MY', options).replace(',', '');
                })()}
              </Box>
            </Box>
          </ListItemText>
        </ListItem>
      );

    return (
        <ListCard
            title={title}
            isLoading={isLoading}
            items={records}
            renderItem={renderAttendanceItem}
            emptyMessage={emptyMessage}
        />
    )
}

export default AttendanceRecordList;