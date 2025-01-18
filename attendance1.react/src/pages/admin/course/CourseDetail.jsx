import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper,
  Tabs,
  Tab,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Loader, PromptMessage, ConfirmDialog } from '../../../components/Common';
import { adminApi } from '../../../api/admin';
import { useApiExecutor } from '../../../hooks/common';
import { CourseStudentTable, AttendanceRecordTable } from '../../../components/Admin';
import { usePagination, useSorting } from '../../../hooks/common';
import { useMessageContext } from '../../../contexts/MessageContext';
import { AddStudentDialog } from '../../../components/Admin';
import AddIcon from '@mui/icons-material/Add';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loading, handleApiCall } = useApiExecutor();
  const [course, setCourse] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [confirmRemoveDialog, setConfirmRemoveDialog] = useState({
    open: false,
    student: null
  });
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState([]);
  const [recordsTotal, setRecordsTotal] = useState(0);
  
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

  // 加载课程详情
  useEffect(() => {
    const loadCourseDetail = async () => {
      await handleApiCall(
        () => adminApi.getCourseById(id),
        (data) => {
          setCourse(data);
        }
      );
    };
    loadCourseDetail();
  }, [id, handleApiCall]);

  // 加载已注册学生
  const loadEnrolledStudents = useCallback(async () => {
    const requestDto = {
      courseId: id,
      paginatedRequest: {
        ...getPaginationParams(),
        ...getSortParams(),
      }
    };
    
    await handleApiCall(
      () => adminApi.getEnrolledStudents(requestDto),
      (paginatedResult) => {
        setStudents(paginatedResult.data || []);
        setTotal(paginatedResult.totalCount);
      }
    );
  }, [id, getPaginationParams, getSortParams]);

  // 移除学生
  const handleRemoveStudent = async () => {
    if (confirmRemoveDialog.student) {
      const success = await handleApiCall(
        () => adminApi.removeStudentFromCourse({
          courseId: id,
          studentId: confirmRemoveDialog.student.studentId
        }),
        () => true
      );

      if (success) {
        setConfirmRemoveDialog({ open: false, student: null });
        await loadEnrolledStudents();
        showSuccessMessage('Student removed successfully');
      }
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // 添加学生
  const handleAddStudents = async (values) => {
    const success = await handleApiCall(
      () => adminApi.addStudentToCourse({
        courseId: id,
        tutorialId: values.tutorialId,
        studentIds: values.studentIds
      }),
      () => true
    );

    if (success) {
      setOpenAddDialog(false);
      await loadEnrolledStudents();
      showSuccessMessage('Students added successfully');
    }
  };

  // 加载考勤记录
  const loadAttendanceRecords = useCallback(async () => {
    const requestDto = {
      courseId: id,
      paginatedRequest: {
        ...getRecordsPaginationParams(),
        ...getRecordsSortParams(),
      }
    };
    
    await handleApiCall(
      () => adminApi.getCourseAttendanceRecords(requestDto),
      (paginatedResult) => {
        setRecords(paginatedResult.data || []);
        setRecordsTotal(paginatedResult.totalCount);
      }
    );
  }, [id, getRecordsPaginationParams, getRecordsSortParams]);

  useEffect(() => {
    if (tabValue === 2) {
      loadAttendanceRecords();
    }
  }, [tabValue, loadAttendanceRecords]);

  if (loading || !course) {
    return <Loader />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton 
          onClick={() => navigate('/admin/courses')}
          sx={{ mr: 2 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5">
          Course Details
        </Typography>
      </Box>

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
              Course Name
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
                color: course.status === 'Active' ? 'success.main' : 'text.secondary'
              }}
            >
              {course.status}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Class Day
            </Typography>
            <Typography variant="body1">
              {course.classDay}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Duration
            </Typography>
            <Typography variant="body1">
              {course.startDate} - {course.endDate}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      
      {/* tab menu */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Tutorial Groups" />
          <Tab label="Enrolled Students" />
          <Tab label="Attendance Records" />
        </Tabs>
      </Box>
      
      {/* tutorial groups */}
      {tabValue === 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Tutorial Groups
          </Typography>
          {course.tutorials.map((tutorial, index) => (
            <Box key={tutorial.tutorialId} sx={{ mb: 2 }}>
              <Typography variant="subtitle1">
                {tutorial.tutorialName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Class Day: {tutorial.classDay}
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
              onClick={() => setOpenAddDialog(true)}
              startIcon={<AddIcon />}
            >
              Add Student
            </TextButton>
          </Box>
          
          <CourseStudentTable
            students={students}
            total={total}
            page={page}
            rowsPerPage={rowsPerPage}
            orderBy={orderBy}
            order={order}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            onSort={handleSort}
            onRemove={(student) => {
              setConfirmRemoveDialog({
                open: true,
                student
              });
            }}
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
            records={records}
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

      <AddStudentDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onSubmit={handleAddStudents}
        tutorials={course?.tutorials || []}
        courseId={id}
        loading={loading}
      />

      <ConfirmDialog
        open={confirmRemoveDialog.open}
        title="Remove Student"
        content={`Are you sure you want to remove ${confirmRemoveDialog.student?.studentName} from this course?`}
        onConfirm={handleRemoveStudent}
        onCancel={() => setConfirmRemoveDialog({ open: false, student: null })}
        confirmText="Remove"
        cancelText="Cancel"
        type="delete"
      />
    </Box>
  );
};

export default CourseDetail; 