import { 
    Table, 
    TableContainer, 
    TableBody, 
    Paper,
    useTheme,
    TableHead,
    TableRow,
    TableCell,
    TableSortLabel
  } from '@mui/material';
  import { EmptyState } from '../';
  import { styles } from './SortableTable.styles';
  
  const SortableTable = ({
    columns,
    headerRows,
    data,
    orderBy,
    order,
    onSort,
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
          <TableHead>
            {headerRows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((column) => {
                  if (rowIndex > 0 && column.rowSpan === 2) {
                    return null;
                  }
                  return (
                    <TableCell
                      key={column.id}
                      sortDirection={orderBy === column.id ? order : false}
                      style={{ width: column.width }}
                      align={column.align || 'left'}
                      colSpan={column.colSpan}
                      rowSpan={column.rowSpan}
                      className={column.className}
                      sx={{
                        ...(column.fixed === 'left' && {
                          position: 'sticky',
                          left: 0,
                          zIndex: 4,
                        }),
                        ...(column.fixed === 'right' && {
                          position: 'sticky',
                          right: 0,
                          zIndex: 4,
                        }),
                        width: column.width,
                        minWidth: column.width,
                      }}
                    >
                      {column.sortable ? (
                        <TableSortLabel
                          active={orderBy === column.id}
                          direction={orderBy === column.id ? order : 'asc'}
                          onClick={() => onSort(column.id)}
                        >
                          {column.label}
                        </TableSortLabel>
                      ) : (
                        column.label
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableHead>
          <TableBody sx={themedStyles.tableBody}>
            {data.length > 0 ? (
              data.map((row) => renderRow(row))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  <EmptyState
                    title={emptyState.title}
                    message={emptyState.message}
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };
  
  export default SortableTable; 