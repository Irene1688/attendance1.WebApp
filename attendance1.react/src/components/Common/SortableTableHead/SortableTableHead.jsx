import { TableHead, TableRow, TableCell, TableSortLabel } from '@mui/material';

const SortableTableHead = ({ 
  columns, 
  order, 
  orderBy, 
  onSort 
}) => {
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    onSort(property, isAsc ? 'desc' : 'asc');
  };

  return (
    <TableHead>
      <TableRow>
        {columns.map((column) => (
          <TableCell
            key={column.id}
            sortDirection={orderBy === column.id ? order : false}
            sx={column.sx}
          >
            {column.sortable ? (
              <TableSortLabel
                active={orderBy === column.id}
                direction={orderBy === column.id ? order : 'asc'}
                onClick={() => handleSort(column.id)}
              >
                {column.label}
              </TableSortLabel>
            ) : (
              column.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default SortableTableHead; 