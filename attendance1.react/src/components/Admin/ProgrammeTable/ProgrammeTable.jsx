import React, { useState } from 'react';
import { 
  TableCell, 
  TableRow, 
  Tooltip,
  Box,
  useTheme
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { PaginatedTable, IconButton } from '../../Common';
import { styles } from './ProgrammeTable.styles';

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
  const theme = useTheme();
  const themedStyles = styles(theme);

  
  const columns = [
    {
      id: 'programmeName',
      label: 'Programme Name',
      sortable: true
    },
    {
      id: 'actions',
      label: 'Actions',
      sortable: false
    }
  ];

  // define rows
  const renderRow = (programme) => (
    <TableRow key={programme.programmeId}>
      <TableCell>{programme.programmeName}</TableCell>
      <TableCell>
        <Box sx={themedStyles.actionButton}>
          <Tooltip title="Edit">
            <IconButton 
              Icon={<EditIcon />} 
              onClick={() => onEdit(programme)} 
              color="primary" 
            />
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton 
              Icon={<DeleteIcon />} 
              onClick={() => onDelete(programme)} 
              color="delete" 
            />
          </Tooltip>
        </Box>
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