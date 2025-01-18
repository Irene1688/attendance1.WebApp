import { useState, useMemo } from 'react';
import { 
  Box, 
  TextField, 
  MenuItem, 
  IconButton,
  Collapse,
  Grid,
  Typography
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { TextButton } from '../../Common';
import { COURSE_STATUS } from '../../../validations/schemas/courseValidation';

const MONTHS = [
  { value: 'SEP', label: 'September' },
  { value: 'JUL', label: 'July' },
  { value: 'FEB', label: 'February' }
];

const validateYearFormat = (value) => {
  if (!value) return true; // 允许空值
  
  const yearPattern = /^(\d{4})\/(\d{4})$/;
  const match = value.match(yearPattern);
  
  if (!match) return false;
  
  const firstYear = parseInt(match[1]);
  const secondYear = parseInt(match[2]);
  
  return secondYear - firstYear === 1;
};

const CourseFilter = ({ 
  onFilter,
  programmes = [],
  lecturers = []
}) => {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({
    programmeId: '',
    lecturerId: '',
    status: '',
    month: '',
    year: ''
  });

  const [yearError, setYearError] = useState('');

  const handleChange = (field) => (event) => {
    setFilters(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleReset = () => {
    const resetFilters = {
      programmeId: 0,
      lecturerUserId: 0,
      status: '',
      month: '',
      year: ''
    };
    setFilters(resetFilters);
    onFilter(resetFilters);
  };

  const handleYearChange = (event) => {
    const value = event.target.value;
    setFilters(prev => ({
      ...prev,
      year: value
    }));
    
    if (!value) {
      setYearError('');
    } else if (!validateYearFormat(value)) {
      setYearError('Format should be YYYY/YYYY with consecutive years (e.g., 2023/2024)');
    } else {
      setYearError('');
    }
  };

  const handleApplyFilter = () => {
    if (yearError) return; // 如果年份格式错误，不允许应用筛选

    const filterValues = {
      programmeId: filters.programmeId,
      lecturerUserId: filters.lecturerUserId,
      status: filters.status,
      session: filters.month && filters.year 
        ? `${filters.month} ${filters.year}`
        : ''
    };
    onFilter(filterValues);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <IconButton onClick={() => setOpen(!open)} size="small">
          <FilterListIcon />
        </IconButton>
        <Typography variant="subtitle2" sx={{ ml: 1 }}>
          Filters
        </Typography>
      </Box>

      <Collapse in={open}>
        <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                select
                size="small"
                label="Programme"
                value={filters.programmeId}
                onChange={handleChange('programmeId')}
              >
                <MenuItem value="">All Programmes</MenuItem>
                {programmes.map((programme) => ( 
                  <MenuItem 
                    key={programme.id} 
                    value={programme.id}
                  >
                    {programme.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                select
                size="small"
                label="Lecturer"
                value={filters.lecturerUserId}
                onChange={handleChange('lecturerUserId')}
              >
                <MenuItem value="">All Lecturers</MenuItem>
                {lecturers.map((lecturer) => (
                  <MenuItem 
                    key={lecturer.id} 
                    value={lecturer.id}
                  >
                    {lecturer.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                select
                size="small"
                label="Status"
                value={filters.status}
                onChange={handleChange('status')}
              >
                <MenuItem value="">All Status</MenuItem>
                {Object.entries(COURSE_STATUS).map(([key, value]) => (
                  <MenuItem key={key} value={key}>
                    {value}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    select
                    size="small"
                    label="Session Month"
                    value={filters.month}
                    onChange={handleChange('month')}
                  >
                    <MenuItem value="">All Months</MenuItem>
                    {MONTHS.map((month) => (
                      <MenuItem key={month.value} value={month.value}>
                        {month.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Session Year"
                    value={filters.year}
                    onChange={handleYearChange}
                    error={!!yearError}
                    helperText={yearError || 'Format: YYYY/YYYY (e.g., 2023/2024)'}
                    placeholder="2023/2024"
                  />
                </Grid>
              </Grid>
              <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, display: 'block' }}>
                {filters.month && filters.year 
                  ? `Selected Session: ${filters.month} ${filters.year}`
                  : 'Select both month and year to filter by session'}
              </Typography>
            </Grid>
          </Grid>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            mt: 3,
            pt: 2,
            borderTop: '1px solid',
            borderColor: 'divider'
          }}>
            <TextButton
              onClick={handleReset}
              variant="text"
              color="cancel"
              sx={{ mr: 1 }}
            >
              Reset
            </TextButton>
            <TextButton
              onClick={() => setOpen(false)}
              variant="text"
              sx={{ mr: 1 }}
            >
              Close
            </TextButton>
            <TextButton
              onClick={handleApplyFilter}
              variant="contained"
              color="primary"
            >
              Go
            </TextButton>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

export default CourseFilter; 