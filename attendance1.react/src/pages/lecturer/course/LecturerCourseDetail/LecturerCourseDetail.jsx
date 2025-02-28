// Import necessary dependencies
import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper,
  Grid,
  useTheme,
  Tabs,
  Tab,
  Dialog
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { 
  Loader, 
  PromptMessage,
  TextButton,
  ConfirmDialog
} from '../../../../components/Common';
import { AttendanceRecordTable, AddStudentForm, GenerateNewAttendanceSessionForm } from '../../../../components/Lecturer';
import { CourseStudentTable } from '../../../../components/Shared';
import { usePagination, useSorting } from '../../../../hooks/common';
import { useMessageContext } from '../../../../contexts/MessageContext';
import { useAttendanceManagement, useEnrolledStudentManagement, useCourseById } from '../../../../hooks/features';
import { styles } from './LecturerCourseDetail.styles';
import { NUMBER_TO_DAY } from '../../../../constants/courseConstant';


const LecturerCourseDetail = () => {
  // Hooks
  const { id } = useParams();
  const { setPageTitle } = useOutletContext();
  const navigate = useNavigate();
  const theme = useTheme();
  const themedStyles = styles(theme);
  const { message, showSuccessMessage, hideMessage } = useMessageContext();

  const { loading: courseLoading, course, fetchCourseById } = useCourseById();
  const {  
    loading: recordsLoading, 
    openGenerateNewAttendanceSessionDialog,
    setOpenGenerateNewAttendanceSessionDialog,
    studentAttendanceRecords, 
    fetchStudentAttendanceRecords,
    generateNewAttendanceSession,
    updateStudentAttendanceStatus,
    deleteAttendanceRecord
  } = useAttendanceManagement();

  const { 
    loading: studentsLoading,
    enrolledStudents, 
    fetchEnrolledStudents,
    addSingleStudentToCourse,
    addStudentsToCourseByCSV,
    removeStudentFromCourse,
    confirmRemoveDialog, 
    setConfirmRemoveDialog
  } = useEnrolledStudentManagement();

  // States
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);

  // enrolled students pagination and sorting
  const {
    page,
    rowsPerPage,
    total,
    handlePageChange,
    handleRowsPerPageChange,
    setTotal,
    getPaginationParams
  } = usePagination();

  const {
    orderBy,
    order,
    handleSort,
    getSortParams
  } = useSorting('date');

  // load course data
  useEffect(() => {
    const loadCourseInfo = async () => {
      if (!id) return;
      await fetchCourseById(id);
    };
    loadCourseInfo();
  }, [id]);

  // load attendance records
  const loadAttendanceRecords = useCallback(async () => {
    if (!course) return;
    await fetchStudentAttendanceRecords(id);
  }, [id, course]);

  useEffect(() => {
    loadAttendanceRecords();
  }, [loadAttendanceRecords]);

  // load enrolled students
  const loadEnrolledStudents = useCallback(async () => {
    if (!course) return;

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
  }, [id, getPaginationParams, getSortParams, searchTerm, course]);
 
  useEffect(() => {
    loadEnrolledStudents();
  }, [loadEnrolledStudents]);

  // initialize page title
  useEffect(() => {
    if (course) {
      setPageTitle(`${course.courseCode} - ${course.courseName}`);
    }
  }, [course, setPageTitle]);

  // Handlers
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditClass = () => {
    navigate(`/lecturer/classes/${id}/edit`, 
      { state: { course: {
          ...course,
          startDate: course.semester.startDate,
          endDate: course.semester.endDate,
          classDay: course.classDay,
          tutorials: course.tutorials?.map(t => ({
          ...t,
            classDay: t.classDay.toString()
          }))
        } 
      }
    });
  };

  const handleAddStudents = async (values) => {
    if (values.type === 'single') {
      // add single student
      const success = await addSingleStudentToCourse(id, values);
      if (success) {
        setOpenAddDialog(false);
        await loadEnrolledStudents();
        await loadAttendanceRecords();
        showSuccessMessage('Student added successfully');
      }
    } else {
      // add multiple students
      const formData = new FormData();
      formData.append('File', values.data);
 
      const success = await addStudentsToCourseByCSV(id, formData, values.defaultAttendance);
      if (success) {
        setOpenAddDialog(false);
        await loadEnrolledStudents();
        await loadAttendanceRecords();
        showSuccessMessage('Students added successfully');
      }
    }
  };

  const handleRemoveStudent = async () => {
    if (confirmRemoveDialog.students.length > 0) {
      const success = await removeStudentFromCourse(id, confirmRemoveDialog.students);
      if (success) {
        setConfirmRemoveDialog({ open: false, students: [] });
        await loadEnrolledStudents();
        await loadAttendanceRecords();
        showSuccessMessage('Students removed successfully');
      }
    }
  };

  const handleGenerateNewAttendanceSession = async (values) => {
    const requestDto = {
      courseId: id,
      AttendanceDate: values.AttendanceDate,
      StartTime: values.StartTime,
      IsLecture: values.IsLecture,
      TutorialId: values.TutorialId
    }
    const success = await generateNewAttendanceSession(requestDto);
    if (success) {
      setOpenGenerateNewAttendanceSessionDialog(false);
      await loadAttendanceRecords();
      showSuccessMessage('New attendance session generated successfully');
    }
  };

  const handleUpdateStudentAttendanceStatus = async (values) => {
    const requestDto = {
      courseId: id,
      attendanceCodeId: values.attendanceCodeId,
      studentId: values.studentId,
      isPresent: values.isPresent
    };
    var success = await updateStudentAttendanceStatus(requestDto);
    if (success) {
      await loadAttendanceRecords();
      showSuccessMessage('Student attendance status updated successfully');
    }
  };

  const handleDeleteRecord = async (recordId) => {
    if (recordId) {
      const success = await deleteAttendanceRecord(recordId);
      if (success) {
        await loadAttendanceRecords();
        showSuccessMessage('Attendance session deleted successfully');
      }
    }
  };

  if (courseLoading || studentsLoading || recordsLoading) {
    return <Loader />;
  }


  if (!course) {
    return (
      <>
        {message.show && message.severity === 'error' && (
          <PromptMessage
            open={true}
            message={message.text}
            severity={message.severity}
            fullWidth
            onClose={hideMessage}
            sx={{ mb: 2 }}
          />
        )}
      </>
    );
  }

  return (
    <Box>
      {message.show && (
        <PromptMessage
          open={true}
          message={message.text}
          severity={message.severity}
          fullWidth
          onClose={hideMessage}
          sx={{ mb: 2 }}
        />
      )}

      {/* Course Information */}
      <Box>
        <Paper sx={themedStyles.section}>
          <Box sx={themedStyles.header}>
            <Typography variant="h6" sx={themedStyles.sectionTitle}>
              Class Information
            </Typography>
            <TextButton
              onClick={handleEditClass}
              variant="contained"
              startIcon={<EditIcon />}
              color="primary"
            >
              Edit Class
            </TextButton>
          </Box>
          
          {/* column 1 */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={themedStyles.infoItem}>
                <Typography variant="subtitle2" color="textSecondary">
                  Course Code
                </Typography>
                <Typography variant="body1">
                  {course.courseCode}
                </Typography>
              </Box>
              
              <Box sx={themedStyles.infoItem}>
                <Typography variant="subtitle2" color="textSecondary">
                  Programme
                </Typography>
                <Typography variant="body1">
                  {course.programme.programmeName}
                </Typography>
              </Box>
              <Box sx={themedStyles.infoItem}>
                <Typography variant="subtitle2" color="textSecondary">
                  Duration
                </Typography>
                <Typography variant="body1">
                  {course.semester.startDate} to {course.semester.endDate}
                </Typography>
              </Box>
              <Box sx={themedStyles.infoItem}>
                <Typography variant="subtitle2" color="textSecondary">
                  Tutorial Groups
                </Typography>
                {course.tutorials?.map(t => 
                  <Typography variant="body1" key={t.tutorialId}>
                    {t.tutorialName} - {NUMBER_TO_DAY[Number(t.classDay)]}
                  </Typography>
                )}
              </Box>
            </Grid>

            {/* column 2 */}
            <Grid item xs={12} md={6}>
              <Box sx={themedStyles.infoItem}>
                <Typography variant="subtitle2" color="textSecondary">
                  Class Name
                </Typography>
                <Typography variant="body1">
                  {course.courseName}
                </Typography>
              </Box>
              <Box sx={themedStyles.infoItem}>
                <Typography variant="subtitle2" color="textSecondary">
                  Session
                </Typography>
                <Typography variant="body1">
                  {course.courseSession}
                </Typography>
              </Box>
              <Box sx={themedStyles.infoItem}>
                <Typography variant="subtitle2" color="textSecondary">
                  Lecturer Class Days
                </Typography>
                <Typography variant="body1">
                  {course.classDay
                    .split(',')   
                    .map(day => Number(day)) 
                    .map(day => NUMBER_TO_DAY[day])
                    .join(', ')              
                    }
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Tab Menu */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Attendance Records" />
          <Tab label="Students" />
        </Tabs>
      </Box>

      {/* Attendance Records Tab */}
      {tabValue === 0 && (
        <Paper sx={themedStyles.section}>
          <Box sx={themedStyles.header}>
            <Box>
            <Typography variant="h6" sx={{ ...themedStyles.sectionTitle, mb: 0.2 }}>
              Attendance Records
            </Typography>
              <Typography variant="body1" sx={themedStyles.promptMessage}>
                * You can click the attendance status icon to change the attendance of the student.
              </Typography>
            </Box>
            <TextButton
              onClick={() => setOpenGenerateNewAttendanceSessionDialog(true)}
              variant="contained"
              color="primary"
            >
              Generate New Attendance Session
            </TextButton>
          </Box>

          <AttendanceRecordTable
            records={studentAttendanceRecords?.records || []}
            students={studentAttendanceRecords?.students || []}
            tutorials={course?.tutorials || []}
            courseStartDate={course?.semester?.startDate}
            onUpdateStatus={handleUpdateStudentAttendanceStatus}
            onDeleteRecord={handleDeleteRecord}
            courseInfo={{
              courseCode: course?.courseCode,
              courseName: course?.courseName,
              lecturerName: course?.lecturer.userName,
              session: course?.courseSession,
              programme: course?.programme.programmeName,
            }}
          />
        </Paper>
      )}

      {/* Enrolled Students Tab */}
      {tabValue === 1 && (
        <Paper sx={themedStyles.section}>
          <Box sx={themedStyles.header}>
            <Typography variant="h6">
              Enrolled Students
            </Typography>
            <TextButton
              onClick={() => setOpenAddDialog(true)}
              variant="contained"
              color="primary"
            >
              Add Students
            </TextButton>
          </Box>
          <CourseStudentTable
            students={enrolledStudents || []}
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
            onBulkRemove={(students) => setConfirmRemoveDialog({
              open: true,
              students
            })}
            searchTerm={searchTerm}
            onSearch={setSearchTerm}
          />
        </Paper>
      )}

      

      {/* Add Student Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        maxWidth="sm"
        fullWidth
        disablePortal={false}
        keepMounted
        aria-labelledby="add-student-dialog-title"
      >
        <AddStudentForm
          courseId={id}
          tutorials={course?.tutorials || []}
          hasAttendanceRecordExisted={studentAttendanceRecords?.records?.length > 0 || false}
          onSubmit={handleAddStudents}
          onClose={() => setOpenAddDialog(false)}
          loading={studentsLoading}
        />
      </Dialog>

      {/* Confirm Remove Student Dialog */}
      <ConfirmDialog
        open={confirmRemoveDialog.open}
        title="Remove Students"
        content={`Are you sure you want to remove ${confirmRemoveDialog.students.length} student(s) from this course?`}
        onConfirm={handleRemoveStudent}
        onCancel={() => setConfirmRemoveDialog({ open: false, students: [] })}
        confirmText="Remove"
        cancelText="Cancel"
        type="delete"
      />

      {/* Generate New Attendance Session Dialog */}
      <Dialog
        open={openGenerateNewAttendanceSessionDialog}
        onClose={() => setOpenGenerateNewAttendanceSessionDialog(false)}
        maxWidth="sm"
        fullWidth
        disablePortal={false}
        keepMounted
        aria-labelledby="generate-new-attendance-session-dialog-title"
      >
        <GenerateNewAttendanceSessionForm
          courseId={id}
          tutorials={course?.tutorials || []}
          onSubmit={handleGenerateNewAttendanceSession}
          onClose={() => setOpenGenerateNewAttendanceSessionDialog(false)}
          loading={recordsLoading}
        />
      </Dialog>
    </Box>
  );
};

export default LecturerCourseDetail; 