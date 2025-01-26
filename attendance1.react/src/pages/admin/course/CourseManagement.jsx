import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { 
  Loader, 
  PromptMessage, 
  TextButton, 
  ConfirmDialog,
  SearchField,
} from '../../../components/Common';
import { CourseTable, CourseFilter } from '../../../components/Admin';
import { useCourseManagement } from '../../../hooks/features';
import { usePagination, useSorting } from '../../../hooks/common';
import { useMessageContext } from '../../../contexts/MessageContext';
import { useProgrammeManagement } from '../../../hooks/features/programme/useProgrammeManagement';
import { useUserManagement } from '../../../hooks/features/user/useUserManagement';

const CourseManagement = () => {
  const { setPageTitle } = useOutletContext();
  const navigate = useNavigate();
  const { 
    courses,
    loading,
    confirmDeleteDialog,
    setConfirmDeleteDialog,
    confirmMultipleDeleteDialog,
    setConfirmMultipleDeleteDialog,
    fetchCourses,
    deleteCourse,
    bulkDeleteCourses,
  } = useCourseManagement();

  const { 
    programmeSelection, 
    fetchProgrammeSelection 
  } = useProgrammeManagement();
  
  const { 
    lecturerSelection, 
    fetchLecturerSelection 
  } = useUserManagement();

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
  } = useSorting('courseCode', 'asc');

  // search
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    setPage(0);
  }, [setPage]);

  const [filters, setFilters] = useState({
    programmeId: 0,
    lecturerUserId: 0,
    status: '',
    month: '',
    year: ''
  });

  // initialize
  useEffect(() => {
    setPageTitle('Class Management');
  }, [setPageTitle]);

  // fetch data
  const loadData = useCallback(async () => {
    const requestDto = {
      paginatedRequest: {
        ...getPaginationParams(),
        ...getSortParams(),
      },
      searchTerm: searchTerm,
      filters: {
        programmeId: filters.programmeId || 0,
        lecturerUserId: filters.lecturerUserId || 0,
        status: filters.status || '',
        session: filters.month && filters.year 
          ? `${filters.month} ${filters.year}`
          : ''
      }
    };
    const paginatedResult = await fetchCourses(requestDto);
    setTotal(paginatedResult.totalCount);
  }, [getPaginationParams, getSortParams, searchTerm, filters]);
  
  useEffect(() => {
    loadData();
  }, [loadData]);

  // 只在组件挂载时加载一次筛选选项
  useEffect(() => {
    let isMounted = true;

    fetchProgrammeSelection();
    fetchLecturerSelection();

    return () => {
      isMounted = false;
    };
  }, []); // 空依赖数组，只在挂载时执行一次

  // delete
  const handleDeleteConfirm = async () => {
    if (confirmDeleteDialog.course) {
      const success = await deleteCourse(confirmDeleteDialog.course);
      if (success) {
        setConfirmDeleteDialog({ open: false, course: null });
        await loadData();
        showSuccessMessage('Course deleted successfully');
      }
    }
  };

  const handleBulkDeleteConfirm = async () => {
    if (!confirmMultipleDeleteDialog.courseIds?.length) {
      return;
    }
    
    const success = await bulkDeleteCourses(confirmMultipleDeleteDialog.courseIds);
    if (success) {
      setConfirmMultipleDeleteDialog({ open: false, courseIds: [] });
      await loadData();
      showSuccessMessage('Selected courses deleted successfully');
    }
  };

  const handleFilterApplied = useCallback((newFilters) => {
    setFilters({
      ...newFilters,
      programmeId: newFilters.programmeId || 0,
      lecturerUserId: newFilters.lecturerUserId || 0,
      status: newFilters.status || '',
      month: newFilters.month || '',
      year: newFilters.year || ''
    });
  }, []);

  return (
    <Box sx={{ pl: 3, pr: 3 }}>
      {loading && <Loader />}
      
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

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Classes Management ({total})</Typography>
        <TextButton 
          onClick={() => navigate('/admin/courses/add')}
          Icon={<AddIcon />}
          color="primary"
        >
          Add New Class
        </TextButton>
      </Box>

      <Box sx={{ mb: 2 }}>
        <SearchField
          placeholder="Search courses..."
          onSearch={handleSearch}
          debounceTime={1000}
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <CourseFilter
          onFilter={setFilters}
          programmes={programmeSelection || []}
          lecturers={lecturerSelection || []}
          onFilterApplied={handleFilterApplied}
        />
      </Box>

      <CourseTable
        courses={courses}
        total={total}
        page={page}
        rowsPerPage={rowsPerPage}
        orderBy={orderBy}
        order={order}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onSort={handleSort}
        onView={(course) => navigate(`/admin/courses/${course.courseId}`, {
          state: {
            course
          }
        })}
        onEdit={(course) => navigate(`/admin/courses/${course.courseId}/edit`, { 
          state: { 
            course: {
              ...course,
              classDay: course.classDay,
              userId: course.LecturerUserId,
              tutorials: course.tutorials?.map(t => ({
                ...t,
                classDay: t.classDay.toString()
              }))
            } 
          } 
        })}
        onDelete={(course) => {
          setConfirmDeleteDialog({
            open: true,
            course
          });
        }}
        onBulkDelete={(courseIds) => {
          setConfirmMultipleDeleteDialog({
            open: true,
            courseIds
          });
        }}
        searchTerm={searchTerm}
      />

      <ConfirmDialog
        open={confirmDeleteDialog.open}
        title="Delete Course"
        content={`Are you sure you want to delete ${confirmDeleteDialog.course?.courseName}? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDeleteDialog({ open: false, course: null })}
        confirmText="Delete"
        cancelText="Cancel"
        type="delete"
      />

      <ConfirmDialog
        open={confirmMultipleDeleteDialog.open}
        title="Delete Courses"
        content={`Are you sure you want to delete ${confirmMultipleDeleteDialog.courseIds?.length} courses? This action cannot be undone.`}
        onConfirm={handleBulkDeleteConfirm}
        onCancel={() => setConfirmMultipleDeleteDialog({ open: false, courseIds: [] })}
        confirmText="Delete"
        cancelText="Cancel"
        type="delete"
      />
    </Box>
  );
};

export default CourseManagement; 