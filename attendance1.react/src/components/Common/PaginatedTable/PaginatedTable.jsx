import { 
  Table, 
  TableContainer, 
  TableBody, 
  TablePagination, 
  Paper,
  useTheme
} from '@mui/material';
import { SortableTableHead } from '../';
import { EmptyState } from '../';
import { styles } from './PaginatedTable.styles';

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
  const theme = useTheme();
  const themedStyles = styles(theme);

  return (
    <TableContainer 
      component={Paper} 
      sx={themedStyles.container}
      {...props}
    >
      <Table sx={themedStyles.table}>
        <SortableTableHead
          columns={columns}
          order={order}
          orderBy={orderBy}
          onSort={onSort}
        />
        <TableBody sx={themedStyles.tableBody}>
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
        sx={themedStyles.pagination}
      />
    </TableContainer>
  );
};

export default PaginatedTable; 