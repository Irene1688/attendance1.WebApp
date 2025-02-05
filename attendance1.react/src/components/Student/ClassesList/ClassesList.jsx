import { ListItem, ListItemIcon, ListItemText, Typography, Box, useTheme } from '@mui/material';
import ClassIcon from '@mui/icons-material/Class';
import PersonIcon from '@mui/icons-material/Person';
import { ListCard } from '../../Common';
import { styles } from './ClassesList.styles';

const ClassesList = ({
    title,
    isLoading,
    classes = [],
    emptyMessage = "No classes available"
}) => {
    const theme = useTheme();
    const themedStyles = styles(theme);

    const renderClassItem = (classItem) => (
        <ListItem>
          <ListItemIcon>
            <ClassIcon color="primary"/>
          </ListItemIcon>
          <ListItemText
            primary={
                <Box sx={themedStyles.cardItemTitle}>
                    <Typography variant="caption" sx={themedStyles.classType(classItem.type === 'Lecture')}>
                        {classItem.type}
                    </Typography>
                    <Typography variant="body1" sx={themedStyles.classTitle}>
                        {classItem.courseCode} - {classItem.courseName}
                    </Typography>
                </Box>
            }
            secondaryTypographyProps={{ component: 'div' }}
            secondary={
              <Box sx={themedStyles.classLecturerInfo}>
                <PersonIcon fontSize="small" />
                <Box component="span" sx={{ typography: 'body2' }}>
                  {classItem.lecturerName}
                </Box>
               
              </Box>
            }
          />
        </ListItem>
      );

    return (
        <ListCard
            title={title}
            isLoading={isLoading}
            items={classes}
            renderItem={renderClassItem}
            emptyMessage={emptyMessage}
        />
    )
}

export default ClassesList;