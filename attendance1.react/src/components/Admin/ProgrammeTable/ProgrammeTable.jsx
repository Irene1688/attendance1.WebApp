import { TableRow, TableCell } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, PaginatedTable } from '../../Common';

const ProgrammeTable = ({
  programmes,
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
  searchTerm
}) => {
  // define columns and headers
  const columns = [
    {
      id: 'programmeName',
      label: 'Programme Name',
      sortable: true
    },
    {
      id: 'actions',
      label: 'Actions',
      sortable: false,
    }
  ];

  // define rows
  const renderRow = (programme) => (
    <TableRow key={programme.programmeId}>
      <TableCell>{programme.programmeName}</TableCell>
      <TableCell>
        <IconButton
          Icon={<EditIcon />}
          onClick={() => onEdit(programme)}
          color="primary"
        />
        <IconButton
          Icon={<DeleteIcon />}
          onClick={() => onDelete(programme)}
          color="delete"
        />
      </TableCell>
    </TableRow>
  );

  return (
    <PaginatedTable
      columns={columns}
      data={programmes}
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
        title: "No Programmes Found",
        message: searchTerm 
          ? "Try adjusting your search to find what you're looking for."
          : "Try adding some programmes using the 'Add New Programme' button."
      }}
    />
  );
};

export default ProgrammeTable; 