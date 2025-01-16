import { 
  Table, 
  TableContainer, 
  TableBody, 
  TablePagination, 
  Paper 
} from '@mui/material';
import { SortableTableHead } from '../';
import { EmptyState } from '../';

const PaginatedTable = ({
  columns,
  data,
  total,
  page,
  rowsPerPage,
  orderBy,
  order,
  onPageChange,
  onRowsPerPageChange,
  onSort,
  rowsPerPageOptions = [15, 25, 50],
  renderRow,
  emptyState = {
    title: 'No Data Found',
    message: 'No records to display.',
  },
  ...props
}) => {
  return (
    <TableContainer component={Paper} {...props}>
      <Table>
        <SortableTableHead
          columns={columns}
          order={order}
          orderBy={orderBy}
          onSort={onSort}
        />
        <TableBody>
          {data.length > 0 ? (
            data.map((row) => renderRow(row))
          ) : (
            <EmptyState
              title={emptyState.title}
              message={emptyState.message}
              colSpan={columns.length}
            />
          )}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={rowsPerPageOptions}
      />
    </TableContainer>
  );
};

export default PaginatedTable; 