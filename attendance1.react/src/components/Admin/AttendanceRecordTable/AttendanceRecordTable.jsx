import { TableCell, TableRow } from '@mui/material';
import { PaginatedTable } from '../../Common';

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
  const columns = [
    {
      id: 'date',
      label: 'Date',
      sortable: true
    },
    {
      id: 'time',
      label: 'Time',
      sortable: true
    },
    {
      id: 'type',
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
      label: 'Rate',
      sortable: true
    }
  ];

  const renderRow = (record) => (
    <TableRow key={record.recordId}>
      <TableCell>{record.date}</TableCell>
      <TableCell>{`${record.startTime} - ${record.endTime}`}</TableCell>
      <TableCell>{record.isLecture ? 'Lecture' : 'Tutorial'}</TableCell>
      <TableCell>{record.tutorialName || '-'}</TableCell>
      <TableCell>{record.presentCount}</TableCell>
      <TableCell>{record.absentCount}</TableCell>
      <TableCell>
        <span style={{ 
          color: record.attendanceRate >= 80 ? 'green' : 
                 record.attendanceRate >= 60 ? 'orange' : 'red'
        }}>
          {record.attendanceRate}%
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