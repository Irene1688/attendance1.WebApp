import React, { useState } from 'react';
import { 
  TableCell, 
  TableRow, 
  Checkbox, 
  Tooltip,
  Box,
  Chip,
  useTheme
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockResetIcon from '@mui/icons-material/LockReset';
import { PaginatedTable, IconButton } from '../../Common';
import { styles } from './LecturerTable.styles';

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
  onBulkDelete,
  searchTerm
}) => {
  const [selected, setSelected] = useState([]);
  const theme = useTheme();
  const themedStyles = styles(theme);

  // 处理全选
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(lecturers.map(lecturer => lecturer.userId));
    } else {
      setSelected([]);
    }
  };

  // 处理单个选择
  const handleSelect = (userId) => {
    const selectedIndex = selected.indexOf(userId);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, userId];
    } else {
      newSelected = selected.filter(id => id !== userId);
    }

    setSelected(newSelected);
  };

  // 检查是否被选中
  const isSelected = (userId) => selected.indexOf(userId) !== -1;

  // 处理批量删除
  const handleBulkDelete = () => {
    onBulkDelete(selected);
    setSelected([]);
  };

  const columns = [
    {
      id: 'select',
      label: (
        <Checkbox
          indeterminate={selected.length > 0 && selected.length < lecturers.length}
          checked={lecturers.length > 0 && selected.length === lecturers.length}
          onChange={handleSelectAll}
        />
      ),
      sortable: false
    },
    {
      id: 'lecturerId',
      label: 'Lecturer ID',
      sortable: true
    },
    {
      id: 'lecturerName',
      label: 'Name',
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
  const renderRow = (lecturer) => (
    <TableRow key={lecturer.userId}>
      <TableCell padding="checkbox">
        <Checkbox
          checked={isSelected(lecturer.userId)}
          onChange={() => handleSelect(lecturer.userId)}
        />
      </TableCell>
      <TableCell>{lecturer.lecturerId}</TableCell>
      <TableCell>{lecturer.name}</TableCell>
      <TableCell>{lecturer.email}</TableCell>
      <TableCell>{lecturer.programmeName}</TableCell>
      <TableCell>{lecturer.registeredCourses?.length || 0}</TableCell>
      <TableCell>
        <Box sx={themedStyles.actionButton}>
          <Tooltip title="Edit">
            <IconButton 
              Icon={<EditIcon />} 
              onClick={() => onEdit(lecturer)} 
              color="primary" 
            />
          </Tooltip>
          <Tooltip title="Reset Password">
            <IconButton 
              Icon={<LockResetIcon />} 
              onClick={() => onResetPassword(lecturer)} 
              color="primary" 
            />
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton 
              Icon={<DeleteIcon />} 
              onClick={() => onDelete(lecturer)} 
              color="delete" 
            />
          </Tooltip>
        </Box>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {selected.length > 0 && (
        <Box sx={themedStyles.bulkActionContainer}>
          <Chip
            label={`${selected.length} selected`}
            onDelete={() => setSelected([])}
            color="primary"
          />
          <Chip
            label="Delete Selected"
            onClick={handleBulkDelete}
            color="error"
            variant="outlined"
          />
        </Box>
      )}
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
            : "No lecturers available yet."
        }}
      />
    </>
  );
};

export default LecturerTable; 