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
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { PaginatedTable, IconButton } from '../../Common';
import { styles } from './StudentTable.styles';
import { set } from 'date-fns';

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
  onRebindDevice,
  onBulkRebindDevice,
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
      setSelected(students.map(student => student.userId));
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

  // 处理批量解绑设备
  const handleBulkRebind = () => {
    onBulkRebindDevice(selected);
    setSelected([]);
  };

  const columns = [
    {
      id: 'select',
      label: (
        <Checkbox
          indeterminate={selected.length > 0 && selected.length < students.length}
          checked={students.length > 0 && selected.length === students.length}
          onChange={handleSelectAll}
        />
      ),
      sortable: false
    },
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
      id: 'hasDevice',
      label: 'Has Device',
      sortable: false
    },
    {
      id: 'deviceBindDate',
      label: 'Device Bind Date',
      sortable: false
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

  const renderRow = (student) => (
    <TableRow key={student.userId}>
      <TableCell padding="checkbox">
        <Checkbox
          checked={isSelected(student.userId)}
          onChange={() => handleSelect(student.userId)}
        />
      </TableCell>
      <TableCell>{student.studentId}</TableCell>
      <TableCell>{student.name}</TableCell>
      <TableCell>{student.email}</TableCell>
      <TableCell>{student.programmeName}</TableCell>
      <TableCell>{student.hasDevice ? 'Yes' : 'No'}</TableCell>
      <TableCell sx={{textAlign: 'center'}}>
        { 
          (() => {
            const date = new Date(student.deviceBindDate).toLocaleString().split(',')[0];
            return date !== "1/1/1" ? date : '-';
          })()
        }
      </TableCell>
      <TableCell>{student.enrolledCourses?.length || 0}</TableCell>
      <TableCell>
        <Box sx={themedStyles.actionButton}>
          <Tooltip title="Edit">
            <Box component="span">
              <IconButton 
                Icon={<EditIcon />} 
                onClick={() => onEdit(student)} 
                color="primary" 
              />
            </Box>
          </Tooltip>
          <Tooltip title="Rebind Device">
            <Box component="span">
              <IconButton 
                Icon={<RestartAltIcon />} 
                onClick={() => onRebindDevice(student)} 
                color="primary" 
              />
            </Box>
          </Tooltip>
          <Tooltip title="Reset Password">
            <Box component="span">
              <IconButton 
              Icon={<LockResetIcon />} 
              onClick={() => onResetPassword(student)} 
              color="primary" 
              />
            </Box>
          </Tooltip>
          <Tooltip title="Delete">
            <Box component="span">
              <IconButton 
                Icon={<DeleteIcon />} 
              onClick={() => onDelete(student)} 
                color="delete" 
              />
            </Box>
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
            label="Unbound Device Selected"
            onClick={handleBulkRebind}
            color="info"
            variant="outlined"
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
            : "No students available yet."
        }}
      />
    </>
  );
};

export default StudentTable; 