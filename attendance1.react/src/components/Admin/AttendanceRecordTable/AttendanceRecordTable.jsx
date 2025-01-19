import { TableCell, TableRow } from '@mui/material';
import { PaginatedTable } from '../../Common';
import { useTheme } from '@mui/material';
import { styles } from './AttendanceRecordTable.styles';

const AttendanceRecordTable = ({
  records,
  total,
  page,
  rowsPerPage,
  orderBy,
  order,
  onPageChange,
  onRowsPerPageChange,
  onSort,
  searchTerm
}) => {
  const theme = useTheme();
  const themedStyles = styles(theme);

  const columns = [
    {
      id: 'date',
      label: 'Date',
      sortable: true
    },
    {
      id: 'startTime',
      label: 'Start Time',
      sortable: true
    },
    {
      id: 'endTime',
      label: 'End Time',
      sortable: true
    },
    {
      id: 'isLecture',
      label: 'Type',
      sortable: true
    },
    {
      id: 'tutorialSession',
      label: 'Tutorial Session',
      sortable: true
    },
    {
      id: 'presentCount',
      label: 'Present',
      sortable: true
    },
    {
      id: 'absentCount',
      label: 'Absent',
      sortable: true
    },
    {
      id: 'attendanceRate',
      label: 'Attendance Rate',
      sortable: true
    }
  ];

  const renderRow = (record) => (
    <TableRow key={record.recordId}>
      {/* <TableCell>{record.date}</TableCell> */}
      <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
      <TableCell>{record.startTime}</TableCell>
      <TableCell>{record.endTime}</TableCell>
      <TableCell sx={themedStyles.typeCell(record.isLecture)}>
        {record.isLecture ? 'Lecture' : 'Tutorial'}
      </TableCell>
      <TableCell>{record.tutorialName || '-'}</TableCell>
      <TableCell sx={themedStyles.countCell}>{record.presentCount}</TableCell>
      <TableCell sx={themedStyles.countCell}>{record.absentCount}</TableCell>
      <TableCell>
        <span style={{ 
          ...themedStyles.attendanceRate(record.attendanceRate)
        }}>
          {(record.attendanceRate * 100).toFixed(1)}%
        </span>
      </TableCell>
    </TableRow>
  );

  return (
    <PaginatedTable
      columns={columns}
      data={records}
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
        title: "No Attendance Records",
        message: searchTerm 
          ? "Try adjusting your search to find what you're looking for."
          : "No attendance records available for this course."
      }}
    />
  );
};

export default AttendanceRecordTable; 