import { TableCell, TableRow } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, PaginatedTable } from '../../Common';

const CourseStudentTable = ({
  students,
  total,
  page,
  rowsPerPage,
  orderBy,
  order,
  onPageChange,
  onRowsPerPageChange,
  onSort,
  onRemove,
  searchTerm
}) => {
  const columns = [
    {
      id: 'studentId',
      label: 'Student ID',
      sortable: true
    },
    {
      id: 'studentName',
      label: 'Name',
      sortable: true
    },
    {
      id: 'tutorialSession',
      label: 'Tutorial Session',
      sortable: true
    },
    {
      id: 'attendanceRate',
      label: 'Attendance Rate',
      sortable: true
    },
    {
      id: 'actions',
      label: 'Actions',
      sortable: false,
    }
  ];

  const renderRow = (student) => (
    <TableRow key={student.studentId}>
      <TableCell>{student.studentId}</TableCell>
      <TableCell>{student.studentName}</TableCell>
      <TableCell>{student.tutorialName}</TableCell>
      <TableCell>
        <span style={{ 
          color: student.attendanceRate >= 80 ? 'green' : 
                 student.attendanceRate >= 60 ? 'orange' : 'red'
        }}>
          {student.attendanceRate}%
        </span>
      </TableCell>
      <TableCell>
        <IconButton
          Icon={<DeleteIcon />}
          onClick={() => onRemove(student)}
          color="delete"
          tooltip="Remove Student"
        />
      </TableCell>
    </TableRow>
  );

  return (
    <PaginatedTable
      columns={columns}
      data={students}
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
        title: "No Students Found",
        message: searchTerm 
          ? "Try adjusting your search to find what you're looking for."
          : "No students are enrolled in this course yet."
      }}
    />
  );
};

export default CourseStudentTable; 