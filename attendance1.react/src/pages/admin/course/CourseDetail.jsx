import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useLocation, useOutletContext } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper,
  Tabs,
  Tab,
  Dialog
} from '@mui/material';
import { 
  Loader, 
  PromptMessage,
  ConfirmDialog, 
  TextButton, 
  IconButton, 
  SearchField,
  EmptyState
} from '../../../components/Common';
import { 
  CourseStudentTable, 
  AttendanceRecordTable,
  AddStudentForm
} from '../../../components/Admin';
import { usePagination, useSorting } from '../../../hooks/common';
import { useMessageContext } from '../../../contexts/MessageContext';
import { STATUS, isActive } from '../../../constants/status';
import { NUMBER_TO_DAY } from '../../../constants/courseConstant';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import { useEnrolledStudentManagement, useAttendanceManagement } from '../../../hooks/features';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { setPageTitle } = useOutletContext();
  const [tabValue, setTabValue] = useState(0);
  
  const { 
    loading: enrolledStudentsLoading,
    enrolledStudents, 
    fetchEnrolledStudents,
    openAddDialog,
    setOpenAddDialog,
    addStudentToCourse,
    confirmRemoveDialog,
    setConfirmRemoveDialog,
    removeStudentFromCourse
   } = useEnrolledStudentManagement();

  const {
    loading: attendanceLoading,
    attendanceRecords,
    fetchAttendanceRecords
  } = useAttendanceManagement();

  const { message, showSuccessMessage, hideMessage } = useMessageContext();
  
  const {
    page,
    setPage,
    rowsPerPage,
    total,
    setTotal,
    handlePageChange,
    handleRowsPerPageChange,
    getPaginationParams
  } = usePagination(15);

  const { 
    order, 
    orderBy, 
    handleSort,
    getSortParams 
  } = useSorting('studentId', 'asc');

  const {
    page: recordsPage,
    setPage: setRecordsPage,
    rowsPerPage: recordsPerPage,
    total: recordsTotal,
    setTotal: setRecordsTotal,
    handlePageChange: handleRecordsPageChange,
    handleRowsPerPageChange: handleRecordsPerPageChange,
    getPaginationParams: getRecordsPaginationParams
  } = usePagination(15);

  const { 
    order: recordsOrder, 
    orderBy: recordsOrderBy, 
    handleSort: handleRecordsSort,
    getSortParams: getRecordsSortParams 
  } = useSorting('date', 'desc');

  const [searchTerm, setSearchTerm] = useState('');

  // initialize
  const course = location.state.course;

  useEffect(() => {
    setPageTitle(course.courseName);
  }, [setPageTitle, course]);

  const loadEnrolledStudents = useCallback(async () => {
    const requestDto = {
      courseId: id,
      paginatedRequest: {
        ...getPaginationParams(),
        ...getSortParams(),
      },
      searchTerm: searchTerm,
    };
    
    const paginatedResult = await fetchEnrolledStudents(requestDto);
    setTotal(paginatedResult.totalCount);
  }, [id, getPaginationParams, getSortParams, searchTerm]);

  useEffect(() => {
    loadEnrolledStudents();
  }, [loadEnrolledStudents]);

  const loadAttendanceRecords = useCallback(async () => {
    const requestDto = {
      courseId: id,
      paginatedRequest: {
        ...getRecordsPaginationParams(),
        ...getRecordsSortParams(),
      }
    };
    const paginatedResult = await fetchAttendanceRecords(requestDto);
    setRecordsTotal(paginatedResult.totalCount);
  }, [id, getRecordsPaginationParams, getRecordsSortParams]);

  useEffect(() => {
      loadAttendanceRecords();
  }, [loadAttendanceRecords]);

  // search
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    setPage(0);
  }, [setPage]);

  // add student
  const handleAddStudents = async (values) => {
    const success = await addStudentToCourse(id, values);

    if (success) {
      setOpenAddDialog(false);
      await loadEnrolledStudents();
      showSuccessMessage('Students added successfully');
      
    }
  };

  // remove student
  const handleRemoveStudent = async () => {
    if (confirmRemoveDialog.students.length > 0) {
      const success = await removeStudentFromCourse(id, confirmRemoveDialog.students);

      if (success) {
        setConfirmRemoveDialog({ open: false, students: [] });
        await loadEnrolledStudents();
        showSuccessMessage('Students removed successfully');
      }
    }
  };

  const handleBulkRemove = (students) => {
    setConfirmRemoveDialog({
      open: true,
      students: students
    });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  

  if (enrolledStudentsLoading || attendanceLoading || !course) {
    return <Loader />;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton 
          onClick={() => navigate('/admin/courses')}
          Icon={<ArrowBackIcon />}
          sx={{ mr: 2 }} />
        <Typography variant="h5">
          Class Details
        </Typography>
      </Box>

      {message.show && message.severity === 'success' && (
        <PromptMessage
          open={true}
          message={message.text}
          severity={message.severity}
          fullWidth
          onClose={hideMessage}
          sx={{ mb: 2 }}
        />
      )}

      <Paper sx={{ mb: 3, p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Course Code
            </Typography>
            <Typography variant="body1">
              {course.courseCode}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Class Name
            </Typography>
            <Typography variant="body1">
              {course.courseName}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Programme
            </Typography>
            <Typography variant="body1">
              {course.programmeName}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Lecturer
            </Typography>
            <Typography variant="body1">
              {course.lecturerName}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Session
            </Typography>
            <Typography variant="body1">
              {course.courseSession}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Status
            </Typography>
            <Typography 
              variant="body1"
              sx={{ 
                color: isActive(course.status) ? 'success.main' : 'text.secondary'
              }}
            >
              {STATUS[course.status]}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Class Day
            </Typography>
            <Typography variant="body1">
            {course.classDay
              .split(',')   
              .map(day => Number(day)) 
              .map(day => NUMBER_TO_DAY[day])
              .join(', ')              
            }
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Duration
            </Typography>
            <Typography variant="body1">
              {course.startDate} to {course.endDate}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      
      {/* tab menu */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Tutorial Sessions" />
          <Tab label="Enrolled Students" />
          <Tab label="Attendance Records" />
        </Tabs>
      </Box>
      
      {/* tutorial Sessions */}
      {tabValue === 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Tutorial Sessions
          </Typography>
          {course.tutorials.length === 0 && (
            <EmptyState
              title="No tutorial sessions found"
              description="No tutorial sessions found for this course"
              sx={{ width: '1%' }}
            />
          )}
          {course.tutorials.map((tutorial, index) => (
            <Box key={tutorial.tutorialId} sx={{ mb: 2 }}>
              <Typography variant="subtitle1">
                {tutorial.tutorialName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Class Day: {NUMBER_TO_DAY[Number(tutorial.classDay)]}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Student Count: {tutorial.studentCount}
              </Typography>
            </Box>
          ))}
        </Paper>
      )}

      {/* enrolled students */}
      {tabValue === 1 && (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6">
              Enrolled Students
            </Typography>
            <TextButton 
              color="primary"
              onClick={() => setOpenAddDialog(true)} 
              Icon={<AddIcon />}
            >
              Add Student
            </TextButton>
          </Box>

          <Box sx={{ mb: 2 }}>
            <SearchField
              placeholder="Search students..."
              onSearch={handleSearch}
              debounceTime={1000}
            />
          </Box>
          
          <CourseStudentTable
            students={enrolledStudents}
            total={total}
            page={page}
            rowsPerPage={rowsPerPage}
            orderBy={orderBy}
            order={order}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            onSort={handleSort}
            onRemove={(student) => setConfirmRemoveDialog({ 
              open: true, 
              students: [student]
            })}
            onBulkRemove={handleBulkRemove}
          />
        </Paper>
      )}

      {/* attendance records */}
      {tabValue === 2 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Attendance Records
          </Typography>
          <AttendanceRecordTable
            records={attendanceRecords}
            total={recordsTotal}
            page={recordsPage}
            rowsPerPage={recordsPerPage}
            orderBy={recordsOrderBy}
            order={recordsOrder}
            onPageChange={handleRecordsPageChange}
            onRowsPerPageChange={handleRecordsPerPageChange}
            onSort={handleRecordsSort}
          />
        </Paper>
      )}

      {/* add students dialog */}
      <Dialog 
        open={openAddDialog} 
        onClose={() => setOpenAddDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <AddStudentForm
          open={openAddDialog}
          programmeId={course?.programmeId}
          courseId={id}
          tutorials={course?.tutorials || []}
          onSubmit={handleAddStudents}
          onClose={() => setOpenAddDialog(false)}
          loading={enrolledStudentsLoading}
        />
      </Dialog>

      <ConfirmDialog
        open={confirmRemoveDialog.open}
        title="Remove Students"
        content={`Are you sure you want to remove ${confirmRemoveDialog.students.length} student${confirmRemoveDialog.students.length > 1 ? 's' : ''} from this class?`}
        onConfirm={handleRemoveStudent}
        onCancel={() => setConfirmRemoveDialog({ open: false, students: [] })}
        confirmText="Remove"
        cancelText="Cancel"
        type="delete"
      />
    </Box>
  );
};

export default CourseDetail; 