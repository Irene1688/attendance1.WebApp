import { TableCell, TableRow } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockResetIcon from '@mui/icons-material/LockReset';
import { IconButton, PaginatedTable } from '../../Common';

const StudentTable = ({
  students,
  total,
  page,
  rowsPerPage,
  orderBy,
  order,
  onPageChange,
  onRowsPerPageChange,
  onSort,
  onEdit,
  onDelete,
  onResetPassword,
  searchTerm
}) => {
    const columns = [
        {
          id: 'studentName',
          label: 'Name',
          sortable: true
        },
        {
          id: 'studentId',
          label: 'Student ID',
          sortable: true
        },
        {
          id: 'email',
          label: 'Email',
          sortable: true
        },
        {
          id: 'programmeName',
          label: 'Programme',
          sortable: true
        },
        {
          id: 'classes',
          label: 'Classes',
          sortable: false
        },
        {
          id: 'actions',
          label: 'Actions',
          sortable: false,
        }
      ];
    
      // define rows
      const renderRow = (student) => (
        <TableRow key={student.userId}>
          <TableCell>{student.name}</TableCell>
          <TableCell>{student.studentId}</TableCell>
          <TableCell>{student.email}</TableCell>
          <TableCell>{student.programmeName}</TableCell>
          <TableCell>{student.enrolledCourses?.length || 0}</TableCell>
          <TableCell>
            <IconButton
              Icon={<EditIcon />}
              onClick={() => onEdit(student)}
              color="primary"
            />
            <IconButton
              Icon={<LockResetIcon />}
              onClick={() => onResetPassword(student)}
              color="primary"
            />
            <IconButton
              Icon={<DeleteIcon />}
              onClick={() => onDelete(student)}
              color="delete"
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
          : "Try adding some students using the 'Add New Student' button."
      }}
    />
  );
};

export default StudentTable; 