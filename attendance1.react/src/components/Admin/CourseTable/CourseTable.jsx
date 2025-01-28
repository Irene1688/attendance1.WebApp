import { useState } from 'react';
import { 
  TableCell, 
  TableRow, 
  Checkbox, 
  Tooltip,
  Box,
  Chip,
  useTheme
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { PaginatedTable, IconButton } from '../../Common';
// import { COURSE_STATUS, STATUS } from '../../../validations/schemas/courseValidation';
import { STATUS, isActive } from '../../../constants/status';
import { styles } from './CourseTable.styles';

const CourseTable = ({
  courses,
  total,
  page,
  rowsPerPage,
  orderBy,
  order,
  onPageChange,
  onRowsPerPageChange,
  onSort,
  onView,
  onEdit,
  onDelete,
  onBulkDelete,
  searchTerm
}) => {
  const [selected, setSelected] = useState([]);
  const theme = useTheme();
  const themedStyles = styles(theme);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(courses.map(course => course.courseId));
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (courseId) => {
    const selectedIndex = selected.indexOf(courseId);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, courseId];
    } else {
      newSelected = selected.filter(id => id !== courseId);
    }

    setSelected(newSelected);
  };

  const isSelected = (courseId) => selected.indexOf(courseId) !== -1;

  const columns = [
    {
      id: 'select',
      label: (
        <Checkbox
          indeterminate={selected.length > 0 && selected.length < courses.length}
          checked={courses.length > 0 && selected.length === courses.length}
          onChange={handleSelectAll}
        />
      ),
      sortable: false
    },
    {
      id: 'courseCode',
      label: 'Course Code',
      sortable: true
    },
    {
      id: 'courseName',
      label: 'Class Name',
      sortable: true
    },
    {
      id: 'programmeName',
      label: 'Programme',
      sortable: true
    },
    {
      id: 'lecturerName',
      label: 'Lecturer',
      sortable: true
    },
    {
      id: 'courseSession',
      label: 'Session',
      sortable: true
    },
    {
      id: 'status',
      label: 'Status',
      sortable: true
    },
    {
      id: 'actions',
      label: 'Actions',
      sortable: false
    }
  ];

  const renderRow = (course) => (
    <TableRow key={course.courseId}>
      <TableCell padding="checkbox">
        <Checkbox
          checked={isSelected(course.courseId)}
          onChange={() => handleSelect(course.courseId)}
        />
      </TableCell>
      <TableCell>{course.courseCode}</TableCell>
      <TableCell>{course.courseName}</TableCell>
      <TableCell>{course.programmeName}</TableCell>
      <TableCell>{course.lecturerName}</TableCell>
      <TableCell>{course.courseSession}</TableCell>
      <TableCell>
        <Chip 
          label={STATUS[course.status]} 
          color={isActive(course.status) ? 'success' : 'default'}
          size="small"
          sx={themedStyles.statusChip(course.status)}
        />
      </TableCell>
      <TableCell>
        <Box sx={themedStyles.actionButton}>
          <Tooltip title="View Details">
            <Box component="span">
              <IconButton
                Icon={<VisibilityIcon />}
                onClick={() => onView(course.courseId)}
                color="primary"
              />
            </Box>
          </Tooltip>
          <Tooltip title="Edit">
            <Box component="span">
              <IconButton
                Icon={<EditIcon />}
                onClick={() => onEdit(course.courseId)}
                color="primary"
              />
            </Box>
          </Tooltip>
          <Tooltip title="Delete">
            <Box component="span">
              <IconButton
                Icon={<DeleteIcon />}
                onClick={() => onDelete(course)}
                color="delete"
              />
            </Box>
          </Tooltip>
        </Box>
      </TableCell>
    </TableRow>
  );

  const handleBulkDelete = () => {
    //const selectedCourses = courses.filter((_, index) => selected[index]);
    //console.log('selected', selected);
    //console.log('selectedCourses', selectedCourses);
    onBulkDelete(selected);
    setSelected([]);
  };

  return (
    <>
      {selected.length > 0 && (
        <Box sx={themedStyles.bulkActionContainer}>
          <Chip
            label={`${selected.length} selected`}
            onDelete={() => setSelected([])}
            color="primary"
          />
          <Chip
            label="Delete Selected"
            onClick={handleBulkDelete}
            color="error"
            variant="outlined"
          />
        </Box>
      )}
      <PaginatedTable
        columns={columns}
        data={courses}
        total={total}
        page={page}
        rowsPerPage={rowsPerPage}
        orderBy={orderBy}
        order={order}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        onSort={onSort}
        renderRow={renderRow}
        emptyState={{
          title: "No Courses Found",
          message: searchTerm 
            ? "Try adjusting your search to find what you're looking for."
            : "No courses available yet."
        }}
      />
    </>
  );
};

export default CourseTable; 