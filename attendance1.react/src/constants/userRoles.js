export const USER_ROLES = {
  ADMIN: 'Admin',
  LECTURER: 'Lecturer',
  STUDENT: 'Student'
};

// 可选：添加一些辅助函数
export const isAdmin = (role) => role === USER_ROLES.ADMIN;
export const isLecturer = (role) => role === USER_ROLES.LECTURER;
export const isStudent = (role) => role === USER_ROLES.STUDENT; 