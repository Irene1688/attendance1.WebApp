import * as Yup from 'yup';
import { nameRules, studentEmailRules } from '../rules';
import { isStudent, isAdmin } from '../../constants/userRoles';

export const profileValidationSchema = (role) => Yup.object({
  name: nameRules,
  email: isStudent(role)
    ? studentEmailRules
    : Yup.string()
        .required('Email is required')
        .email('Invalid email address'),
  currentPassword: Yup.string()
    .test({
      name: 'password-change',
      message: 'Current password is required when changing password',
      test: function(value) {
        const { newPassword, confirmPassword } = this.parent;
        if (newPassword || confirmPassword) return Boolean(value);
        return true;
      }
    }),
  newPassword: Yup.string()
    .test({
      name: 'password-validation',
      message: 'Password must be at least 6 characters',
      test: function(value) {
        if (value) return value.length >= 6;
        return true;
      }
    })
    .test({
        name: 'password-validation',
        message: 'New password is required if you want to change password',
        test: function(value) {
            const { currentPassword } = this.parent;
            if (currentPassword && !value) return false;
            return true;
        }
    }),
  confirmPassword: Yup.string()
    .test({
      name: 'password-match',
      message: 'Passwords do not match with new password',
      test: function(value) {
        const { newPassword, currentPassword } = this.parent;
        if (newPassword || currentPassword) return value === newPassword;
        return true;
      }
    })
}); 