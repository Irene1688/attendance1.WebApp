import { TableCell, TableRow, Checkbox, Box, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, PaginatedTable } from '../../Common';
import { useState } from 'react';

const CourseStudentTable = ({
  students,
  total,
  page,
  rowsPerPage,
  orderBy,
  order,
  onPageChange,
  onRowsPerPageChange,
  onSort,
  onRemove,
  onBulkRemove,
  searchTerm
}) => {
  const [selected, setSelected] = useState([]);

  // 处理全选
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(students);
    } else {
      setSelected([]);
    }
  };

  // 处理单个选择
  const handleSelect = (student) => {
    const selectedIndex = selected.findIndex(s => s.studentId === student.studentId);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, student];
    } else {
      newSelected = selected.filter(s => s.studentId !== student.studentId);
    }

    setSelected(newSelected);
  };

  // 处理批量删除
  const handleBulkRemove = () => {
    onBulkRemove(selected);
    setSelected([]);
  };

  const columns = [
    {
      id: 'select',
      label: <Checkbox
        checked={students.length > 0 && selected.length === students.length}
        indeterminate={selected.length > 0 && selected.length < students.length}
        onChange={handleSelectAll}
      />,
      sortable: false,
      sx: { width: '48px' }
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
      id: 'tutorialSession',
      label: 'Tutorial Session',
      sortable: true
    },
    {
      id: 'attendanceRate',
      label: 'Attendance Rate',
      sortable: true
    },
    {
      id: 'actions',
      label: 'Actions',
      sortable: false,
    }
  ];

  const renderRow = (student) => (
    <TableRow key={student.studentId}>
      <TableCell padding="checkbox">
        <Checkbox
          checked={selected.some(s => s.studentId === student.studentId)}
          onChange={() => handleSelect(student)}
        />
      </TableCell>
      <TableCell>{student.studentId}</TableCell>
      <TableCell>{student.studentName}</TableCell>
      <TableCell>{student.tutorialName}</TableCell>
      <TableCell>
        <span style={{ 
          color: student.attendanceRate * 100 >= 80 ? 'green' : 
                 student.attendanceRate * 100 >= 60 ? 'orange' : 'red'
        }}>
          { (student.attendanceRate * 100).toFixed(2) === "100.00" ? "100%" : (student.attendanceRate * 100).toFixed(2).replace(/\.00$/, '') + '%' }
        </span>
      </TableCell>
      <TableCell>
        <IconButton
          Icon={<DeleteIcon />}
          onClick={() => onRemove(student)}
          color="delete"
          tooltip="Remove Student"
        />
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {selected.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Chip
            label={`${selected.length} selected`}
            onDelete={() => setSelected([])}
            color="primary"
            sx={{ mr: 1 }}
          />
          <Chip
            label="Remove Selected"
            onClick={handleBulkRemove}
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
            : "No students are enrolled in this course yet."
        }}
      />
    </>
  );
};

export default CourseStudentTable; 