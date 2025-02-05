import { useState, useCallback } from 'react';
import { 
  TableCell, 
  TableRow,
  Box,
  Typography,
  Tabs,
  Tab,
  Chip,
  IconButton,
  Divider,
  useTheme,
} from '@mui/material';
import { SortableTable, TextButton } from '../../Common';
import { styles } from './AttendanceRecordTable.styles';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PrintIcon from '@mui/icons-material/Print';

const AttendanceRecordTable = ({
  courseStartDate,
  records = [],
  students = [],
  tutorials = [],
  onUpdateStatus,
  courseInfo,
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
        className: 'left-fixed-column',
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
      rowSpan: 2,
      className: 'right-fixed-column'
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
  const handleStatusChange = async (recordId, studentId, currentStatus) => {
    await onUpdateStatus({
      attendanceCodeId: recordId,
      studentId: studentId,
      isPresent: !currentStatus
    });
  };

  // 渲染行数据
  const renderRow = useCallback((student, dateRecords) => {
    // 创建一个映射来快速查找每个记录的考勤状态
    const attendanceMap = {};
    dateRecords.forEach(record => {
      const attendance = record.attendances?.find(a => a.studentId === student.studentId);
      attendanceMap[`attendance_${record.recordId}`] = attendance?.isPresent;
    });

    const presentCount = Object.values(attendanceMap).filter(status => status === true).length;
    const totalValidRecords = Object.values(attendanceMap).filter(status => status !== null && status !== undefined).length;
    const attendanceRate = totalValidRecords > 0 ? (presentCount / totalValidRecords) * 100 : 0;

    return (
      <TableRow key={student.studentId}>
        <TableCell className="left-fixed-column">{student.studentId}</TableCell>
        <TableCell className="base-column">{student.studentName}</TableCell>
        {generateColumns(dateRecords).columns
          .filter(col => col.id.startsWith('attendance_'))
          .map(col => (
            <TableCell 
              key={col.id}
              align="center"
              className={col.className}
            >
              {/* {renderAttendanceStatus(attendanceMap[col.id])} */}
              <IconButton
                onClick={() => handleStatusChange(col.id.split('_')[1], student.studentId, attendanceMap[col.id])}
                sx={themedStyles.statusButton(attendanceMap[col.id])}
                title='Click to change the attendance status'
                data-status={attendanceMap[col.id]}
              >
                {attendanceMap[col.id] === null || attendanceMap[col.id] === undefined ? (
                  <span>-</span>
                ) : (
                  attendanceMap[col.id] ? <CheckCircleOutlineIcon /> : <HighlightOffIcon />
                )}
              </IconButton>
            </TableCell>
          ))}
        <TableCell className="right-fixed-column">
          <span style={themedStyles.attendanceRate(attendanceRate)}>
            {attendanceRate.toFixed(1)}%
          </span>
        </TableCell>
      </TableRow>
    );
  }, [handleStatusChange, themedStyles]);

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

  
  const handlePrint = useCallback(() => {
    const currentTable = document.querySelector('.MuiTable-root');
    if (!currentTable) return;

    const tableClone = currentTable.cloneNode(true);
    
    // remove the sort icon
    tableClone.querySelectorAll('.MuiTableSortLabel-icon').forEach(el => el.remove());

    // change the attendance status icon
    tableClone.querySelectorAll('.MuiIconButton-root').forEach(el => {
      const status = el.getAttribute('data-status');
      const iconHtml = status === null || status === undefined ? 
        `<div style="text-align: center;">-</div>` :
        `<div style="display: flex; justify-content: center; align-items: center; height: 100%;">
          <span style="color: ${status === 'true' ? '#4caf50' : '#f44336'}; font-size: ${status === 'true' ? '15px' : '20px'};">
            ${status === 'true' ? '&#10003;' : '&#10799;'}
          </span>
        </div>`;
      el.parentElement.innerHTML = iconHtml;
    });

    // change the attendance rate header to 'Rate'
    const attedanceRateHeader = tableClone.querySelector('th:last-child');
    if (attedanceRateHeader) {
      attedanceRateHeader.textContent = 'Rate';
    }

    // change the table header's week to W
    const weekHeaderRow = tableClone.querySelector('tr:first-child');
    if (weekHeaderRow && weekHeaderRow.textContent.includes('Week')) {
      weekHeaderRow.innerHTML = weekHeaderRow.innerHTML.replace(/Week/g, 'W');
    }

    const printWindow = window.open('', '_blank');
    const courseTitle = selectedTab === 0 ? 'Lecture' : safeTutorials[selectedTab - 1]?.tutorialName;
    const classType = selectedTab === 0 ? 'Lecture' : 'Tutorial';
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Attendance Records</title>
          <style>
            @page {
              size: landscape;
              margin: 15mm 10mm;
            }
            body {
              font-family: 'Times New Roman', Times, serif;
              margin: 0;
              padding: 0;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .header {
              display: grid;
              grid-template-columns: 1fr 4fr;
              justify-items: center;
              border: 1px solid #000;
              margin-bottom: 20px;
              font-family: 'Times New Roman', Times, serif;
            }
            .header-left {
              padding: 10px 15px;
              border-right: 1px solid #000;
              display: flex;
              align-items: center;
            }
            .logo {
              width: 70px;
              height: auto;
            }
            .logo-text {
              font-size: 60px;
              font-weight: bold;
              margin: 0;
              padding: 0;
              margin-left: 10px;
            }
            .header-right {
              display: grid;
              grid-template-columns: 1fr;
              text-align: center;
              width: 100%;
            }
            .header-right-top {
              font-size: 18px;
              font-weight: bold;
              margin: 0;
              padding: 10px;
              border-bottom: 1px solid #000;

            }
            .header-right-bottom {
              display: flex;
              flex-direction: column;
              padding: 10px;
              gap: 6px;
            }
            .document-title {
              font-size: 16px;
              font-weight: bold;
            }
            .course-info {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 10px;
              margin: 15px 0;
              padding: 10px;
              border: 1px solid #ddd;
              background-color: #f8f8f8;
            }
            .course-info p {
              margin: 3px 0;
              margin-bottom: 6px;
              font-size: 0.85em;
            }
            .info-left {
              text-align: left;
            }
            .info-right {
              text-align: left;
            }
            .footer {
              display: flex;
              flex-direction: column;
              gap: 4px;
              margin-top: 20px;
              text-align: left;
              font-size: 0.65em;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
              font-size: 0.75em; /* 缩小字体大小 */
              table-layout: fixed; /* 固定表格布局 */
            }
            th, td {
              border: 1px solid #ddd;
              padding: 4px; /* 减小内边距 */
              text-align: center;
              overflow: visible; /* Allow overflow */
              white-space: normal; /* Allow text to wrap */
            }
            th {
              background-color: #f5f5f5 !important;
            }
            
            /* student id column */
            th:nth-child(1), 
            td:nth-child(1) { 
              max-width: 80px; 
              text-align: left; 
            } 
            
            /* student name column */
            thead tr:nth-of-type(1) th:nth-child(2), 
            td:nth-child(2) { 
              max-width: 100px; 
              text-align: left; 
              white-space: normal; 
            } 
            
            /* attendance rate column */
            th:last-child, 
            td:last-child { 
              max-width: 40px; 
            } 
            
            /* attendance tbody column */
            tr:nth-of-type(n+2) th, 
            td:not(:nth-child(1)):not(:nth-child(2)):not(:last-child) {
              text-align: center;
            }

            /* attendance column header */
            thead tr:nth-of-type(n+1) th:not(:nth-child(1)):not(:nth-child(2)):not(:last-child),
            thead tr:nth-of-type(n+2) th {
              font-size: 0.80em !important;
            }
            
            @media print {
              @page {
                size: landscape;
                margin: 10mm;
              }
              .no-print {
                display: none !important;
              }
              /* 强制分页设置 */
              .page-break {
                page-break-after: always;
              }
              /* 防止行内断页 */
              tr {
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="header-left">
              <img src="/UTSlogo.svg" alt="UTS Logo" class="logo">
              <p class="logo-text">UTS</p>
            </div>
            <div class="header-right">
              <div class="header-right-top">UNIVERSITY OF TECHNOLOGY SARAWAK</div>
              <div class="header-right-bottom">
                <div class="document-title">ATTENDANCE SHEET</div>
                <div class="document-subtitle">(${courseInfo?.courseCode} ${courseInfo?.courseName})</div>
              </div>
            </div>
          </div>
          <div class="course-info">
            <div class="info-left">
              <p><strong>Programme:</strong> ${courseInfo?.programme}</p>
              <p><strong>Course:</strong> ${courseInfo?.courseCode} ${courseInfo?.courseName}</p>
              <p><strong>Session:</strong> ${courseInfo?.session}</p>
            </div>
            <div class="info-right">
              <p><strong>Lecturer:</strong> ${courseInfo?.lecturerName}</p>
              <p><strong>Class Type:</strong> ${classType}</p>
              ${classType !== 'Lecture' ? `<p><strong>Class:</strong> ${courseTitle}</p>` : ''}
            </div>
          </div>
          ${tableClone.outerHTML}
          <div class="footer">
            <div>Prepared by: ${courseInfo?.lecturerName}</div>
            <div>Date: ${new Date().toLocaleDateString()}</div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  }, [selectedTab, safeTutorials, courseInfo]);

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
          <Box sx={themedStyles.header}>
            <Typography variant="subtitle1" sx={themedStyles.tableTitle}>
              Lecture Attendance Records
            </Typography>
            <TextButton
              onClick={handlePrint}
              variant="outlined"
              Icon={<PrintIcon />}
              sx={themedStyles.printButton}
            >
              Print
            </TextButton>
          </Box>
          
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
          <Box sx={themedStyles.header}>
            <Typography variant="subtitle1" sx={themedStyles.tableTitle}>
              {safeTutorials[selectedTab - 1]?.tutorialName || ''} Attendance Records
            </Typography>
            <TextButton
              onClick={handlePrint}
              variant="outlined"
              color="primary"
              Icon={<PrintIcon />}
              sx={themedStyles.printButton}
            >
              Print 
            </TextButton>
          </Box>
          
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