import { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography,
  useTheme 
} from '@mui/material';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { styles } from './WeeklyAttendanceCard.styles';

const WeeklyAttendanceCard = ({ 
  records = [], 
  onDateSelect 
}) => {
  const theme = useTheme();
  const themedStyles = styles(theme);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekDays, setWeekDays] = useState([]);

  // 生成本周的日期数组
  useEffect(() => {
    const today = new Date();
    const startDay = startOfWeek(today, { weekStartsOn: 1 }); // 从周一开始
    const days = Array.from({ length: 5 }).map((_, index) => {
      const date = addDays(startDay, index);
      return {
        date,
        day: format(date, 'dd'),
        weekday: format(date, 'EEE'),
        isToday: isSameDay(date, today)
      };
    });
    setWeekDays(days);
  }, []);

  // 处理日期选择
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    onDateSelect(date);
  };

  return (
    <Box sx={themedStyles.container}>
        <Typography variant="body1" sx={themedStyles.title}>Recent Attendance</Typography>
        <Box sx={themedStyles.cardContainer}>
        {weekDays.map((day) => (
            <Card 
            key={day.weekday}
            sx={themedStyles.card(isSameDay(day.date, selectedDate), day.isToday)}
            onClick={() => handleDateSelect(day.date)}
            >
            <CardContent sx={themedStyles.cardContent}>
                <Typography variant="h5" sx={themedStyles.dayNumber}>
                {day.day}
                </Typography>
                <Typography variant="subtitle2" sx={themedStyles.weekday}>
                {day.weekday}
                </Typography>
            </CardContent>
            </Card>
        ))}
        </Box>
    </Box>
  );
};

export default WeeklyAttendanceCard; 