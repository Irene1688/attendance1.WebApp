/**
 * Get color based on attendance rate
 * @param {number} rate - Attendance rate percentage
 * @returns {string} - Color name (success/warning/error)
 */
export const getAttendanceRateColor = (rate) => {
  if (rate >= 80) return 'success';
  if (rate >= 60) return 'warning';
  if (rate < 60) return 'error';
  return 'primary';
};

/**
 * Format page title
 * @param {string} title - Page title
 * @returns {string} - Formatted title
 */
export const formatPageTitle = (title) => {
  return title ? `${title} | UTS Attendance` : 'UTS Attendance';
}; 