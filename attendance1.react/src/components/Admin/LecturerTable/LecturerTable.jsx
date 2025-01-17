import { TableCell, TableRow } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockResetIcon from '@mui/icons-material/LockReset';
import { IconButton, PaginatedTable } from '../../Common';

const LecturerTable = ({
  lecturers,
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
          id: 'lecturerName',
          label: 'Name',
          sortable: true
        },
        {
          id: 'lecturerId',
          label: 'Lecturer ID',
          sortable: true
        },
        {
          id: 'email',
          label: 'Email',
          sortable: true
        },
        {
          id: 'courses',
          label: 'Courses',
          sortable: false
        },
        {
          id: 'actions',
          label: 'Actions',
          sortable: false,
        }
      ];
    
      // define rows
      const renderRow = (lecturer) => (
        <TableRow key={lecturer.userId}>
          <TableCell>{lecturer.name}</TableCell>
          <TableCell>{lecturer.lecturerId}</TableCell>
          <TableCell>{lecturer.email}</TableCell>
          <TableCell>{lecturer.registeredCourses?.length || 0}</TableCell>
          <TableCell>
            <IconButton
              Icon={<EditIcon />}
              onClick={() => onEdit(lecturer)}
              color="primary"
            />
            <IconButton
              Icon={<LockResetIcon />}
              onClick={() => onResetPassword(lecturer)}
              color="primary"
            />
            <IconButton
              Icon={<DeleteIcon />}
              onClick={() => onDelete(lecturer)}
              color="delete"
            />
          </TableCell>
        </TableRow>
      );

  return (
    <PaginatedTable
      columns={columns}
      data={lecturers}
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
        title: "No Lecturers Found",
        message: searchTerm 
          ? "Try adjusting your search to find what you're looking for."
          : "Try adding some lecturers using the 'Add New Lecturer' button."
      }}
    />
  );
};

export default LecturerTable; 