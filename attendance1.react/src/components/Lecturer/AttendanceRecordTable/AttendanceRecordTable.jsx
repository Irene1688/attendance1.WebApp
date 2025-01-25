import { useState } from 'react';
import { 
  TableCell, 
  TableRow,
  Box,
  Typography,
  Tabs,
  Tab,
  Chip,
  useTheme 
} from '@mui/material';
import { SortableTable } from '../../Common';
import { styles } from './AttendanceRecordTable.styles';

const AttendanceRecordTable = ({
  courseStartDate,
  records = [],
  students = [],
  tutorials = [],
}) => {
  const theme = useTheme();
  const themedStyles = styles(theme);
  const [selectedTab, setSelectedTab] = useState(0); // 0: Lecture, 1+: Tutorial index
  const [orderBy, setOrderBy] = useState('studentId');
  const [order, setOrder] = useState('asc');

  // 确保数据是数组
  const safeRecords = Array.isArray(records) ? records : [];
  const safeStudents = Array.isArray(students) ? students : [];
  const safeTutorials = Array.isArray(tutorials) ? tutorials : [];

  // 将考勤记录按类型分组
  const lectureRecords = safeRecords.filter(r => r.isLecture);
  const tutorialRecords = safeRecords.filter(r => !r.isLecture);

  // 按教程组分组的考勤记录
  const tutorialGroupedRecords = safeTutorials.map(tutorial => ({
    tutorial,
    records: tutorialRecords.filter(r => r.tutorialId === tutorial.tutorialId)
  }));


  // 生成列定义
  const generateColumns = (dateRecords) => {
    // 计算每个日期所在的周数
    const getWeekIndex = (date, startDate) => {
      const diffTime = Math.abs(date - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return Math.floor(diffDays / 7) + 1;
    };

    // 按周分组的列信息
    const groupedColumns = dateRecords.reduce((acc, record) => {
      const recordDate = new Date(record.date);
      const weekIndex = getWeekIndex(recordDate, new Date(courseStartDate));
      
      // 格式化日期
      const formattedDate = recordDate.toLocaleDateString(undefined, { month: '2-digit', day: '2-digit' });
      
      if (!acc[weekIndex]) {
        acc[weekIndex] = [];
      }
      
      // 检查是否已经存在相同日期
      const sameDateCount = acc[weekIndex].filter(col => 
        new Date(col.originalDate).toLocaleDateString(undefined, { month: '2-digit', day: '2-digit' }) === formattedDate
      ).length;

      // 构建日期标签
      const dateLabel = sameDateCount > 0 
        ? `${formattedDate} - ${sameDateCount + 1}`
        : formattedDate;
      
      acc[weekIndex].push({
        id: `attendance_${record.recordId}`,
        label: dateLabel,
        originalDate: record.date, // 保存原始日期用于比较
        startTime: record.startTime, // Assuming you have a startTime field
        sortable: false,
        width: 90,
        weekIndex
      });
      return acc;
    }, {});

    // Sort the date columns based on date and start time
    const sortedDateColumns = Object.values(groupedColumns).flat().sort((a, b) => {
      const dateA = new Date(a.originalDate);
      const dateB = new Date(b.originalDate);
      const timeA = new Date(a.startTime);
      const timeB = new Date(b.startTime);

      // Sort by date first, then by start time
      if (dateA.getTime() === dateB.getTime()) {
        return timeA.getTime() - timeB.getTime(); // Sort by start time if dates are the same
      }
      return dateA.getTime() - dateB.getTime(); // Sort by date
    });

    const baseColumns = [
      {
        id: 'studentId',
        label: 'Student ID',
        sortable: true,
        width: 120,
        rowSpan: 2,
        className: 'base-column'
      },
      {
        id: 'studentName',
        label: 'Name',
        sortable: true,
        width: 200,
        rowSpan: 2,
        className: 'base-column'
      }
    ];

    // 生成周列和日期列
    const weekColumns = [];
    const dateColumns = [];

    Object.entries(groupedColumns).forEach(([weekIndex, columns]) => {
      weekColumns.push({
        id: `week_${weekIndex}`,
        label: `Week ${weekIndex}`,
        colSpan: columns.length,
        align: 'center',
        className: 'week-column'
      });
      dateColumns.push(...columns);
      // 为每周的最后一列添加特殊边框
      columns[columns.length - 1].className = 'week-column';
    });

    // 添加出勤率列
    const attendanceRateColumn = {
      id: 'attendanceRate',
      label: 'Attendance Rate',
      sortable: true,
      width: 120,
      rowSpan: 2
    };

    return {
      headerRows: [
        [...baseColumns, ...weekColumns, attendanceRateColumn],
        [...baseColumns, ...sortedDateColumns, attendanceRateColumn]
      ],
      columns: [...baseColumns, ...sortedDateColumns, attendanceRateColumn]
    };
  };

  // 渲染学生的考勤状态
  const renderAttendanceStatus = (status) => {
    if (status === undefined) return '-';
    return status ? (
      <Chip 
        label="Present" 
        size="small"
        sx={themedStyles.presentChip} 
      />
    ) : (
      <Chip 
        label="Absent" 
        size="small"
        sx={themedStyles.absentChip}
      />
    );
  };

  // 渲染行数据
  const renderRow = (student, dateRecords) => {
    // 创建一个映射来快速查找每个记录的考勤状态
    const attendanceMap = {};
    dateRecords.forEach(record => {
      const attendance = record.attendances?.find(a => a.studentId === student.studentId);
      attendanceMap[`attendance_${record.recordId}`] = attendance?.isPresent;
    });

    const presentCount = Object.values(attendanceMap).filter(status => status === true).length;
    const attendanceRate = (presentCount / dateRecords.length) * 100;

    return (
      <TableRow key={student.studentId}>
        <TableCell className="base-column">{student.studentId}</TableCell>
        <TableCell className="base-column">{student.studentName}</TableCell>
        {generateColumns(dateRecords).columns
          .filter(col => col.id.startsWith('attendance_'))
          .map(col => (
            <TableCell 
              key={col.id}
              align="center"
              className={col.className}
            >
              {renderAttendanceStatus(attendanceMap[col.id])}
            </TableCell>
          ))}
        <TableCell>
          <span style={themedStyles.attendanceRate(attendanceRate)}>
            {attendanceRate.toFixed(1)}%
          </span>
        </TableCell>
      </TableRow>
    );
  };

  // 处理排序
  const handleSort = (columnId) => {
    const isAsc = orderBy === columnId && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(columnId);
  };

  // 排序函数
  const sortData = (data, records) => {
    return [...data].sort((a, b) => {
      let compareResult = 0;

      switch (orderBy) {
        case 'studentId':
          compareResult = a.studentId.localeCompare(b.studentId);
          break;
        case 'studentName':
          compareResult = a.studentName.localeCompare(b.studentName);
          break;
        case 'attendanceRate':
          const aAttendances = records.map(record => {
            const attendance = record.attendances?.find(att => att.studentId === a.studentId);
            return attendance?.isPresent;
          });
          const bAttendances = records.map(record => {
            const attendance = record.attendances?.find(att => att.studentId === b.studentId);
            return attendance?.isPresent;
          });

          const aRate = (aAttendances.filter(status => status === true).length / records.length) * 100;
          const bRate = (bAttendances.filter(status => status === true).length / records.length) * 100;
          compareResult = aRate - bRate;
          break;
        default:
          compareResult = 0;
      }

      return order === 'asc' ? compareResult : -compareResult;
    });
  };

  return (
    <Box>
      <Tabs 
        value={selectedTab} 
        onChange={(e, newValue) => setSelectedTab(newValue)}
        sx={themedStyles.tabs}
      >
        <Tab label="Lecture" />
        {safeTutorials.map((tutorial, index) => (
          <Tab key={tutorial.tutorialId} label={tutorial.tutorialName} />
        ))}
      </Tabs>

      {selectedTab === 0 ? (
        // Lecture Attendance Table
        <Box sx={themedStyles.tableContainer}>
          <Typography variant="subtitle1" sx={themedStyles.tableTitle}>
            Lecture Attendance Records
          </Typography>
          <SortableTable
            columns={generateColumns(lectureRecords).columns}
            headerRows={generateColumns(lectureRecords).headerRows}
            data={sortData(safeStudents, lectureRecords)}
            orderBy={orderBy}
            order={order}
            onSort={handleSort}
            renderRow={(student) => renderRow(student, lectureRecords)}
            emptyState={{
              title: "No Lecture Records",
              message: "No lecture attendance records available yet."
            }}
          />
        </Box>
      ) : (
        // Tutorial Attendance Table
        <Box sx={themedStyles.tableContainer}>
          <Typography variant="subtitle1" sx={themedStyles.tableTitle}>
            {safeTutorials[selectedTab - 1]?.tutorialName || ''} Attendance Records
          </Typography>
          <SortableTable
            columns={generateColumns(tutorialGroupedRecords[selectedTab - 1].records).columns}
            headerRows={generateColumns(tutorialGroupedRecords[selectedTab - 1].records).headerRows}
            data={sortData(
              safeStudents.filter(s => s.tutorialId === safeTutorials[selectedTab - 1]?.tutorialId),
              tutorialGroupedRecords[selectedTab - 1].records
            )}
            orderBy={orderBy}
            order={order}
            onSort={handleSort}
            renderRow={(student) => renderRow(student, tutorialGroupedRecords[selectedTab - 1].records)}
            emptyState={{
              title: "No Tutorial Records",
              message: "No tutorial attendance records available yet."
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default AttendanceRecordTable; 