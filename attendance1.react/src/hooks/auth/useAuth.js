import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials, logout, updateUserProfile } from '../../store/slices/authSlice';
import { authApi } from '../../api/auth';
import { userApi } from '../../api/user';
import { useApiExecutor } from '../../hooks/common';
import { USER_ROLES } from '../../constants/userRoles';
import { getVisitorInfo, getDeviceType } from '../../services/deviceInfo';
import { useMessageContext } from '../../contexts/MessageContext';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, handleApiCall } = useApiExecutor();
  const [profileData, setProfileData] = useState(null);
  const user = useSelector(state => state.auth.user);
  const { showErrorMessage } = useMessageContext();

  const handleLogin = useCallback(async (values, formikHelpers, isStaff) => {
    try {
      if (!isStaff) {
        // memorize the login role
        localStorage.setItem('lastLoginRole', 'student');

        // // 获取访客信息
        // const deviceType = await getDeviceType();
        // if (deviceType === 'Desktop') {
        //   showErrorMessage('You should login with your mobile device');
        //   return;
        // }

        // const deviceInfo = await getVisitorInfo();
        
        // 将指纹信息添加到登录请求
        const loginData = {
          email: values.email.toLowerCase(),
          password: values.password,
          //deviceInfo
        };

        await handleApiCall(
          () => authApi.studentLogin(loginData),
          (data) => {
            const { userId, name, role, campusId, accessToken, refreshToken } = data;
            dispatch(setCredentials({
              user: { userId, name, role, campusId },
              accessToken,
              refreshToken
            }));
            //navigate('/student/home');
          }
        );
      } else {
        // memorize the login role
        localStorage.setItem('lastLoginRole', 'staff');

        const loginData = {
          username: values.username,
          password: values.password,
          role: values.role
        }

        await handleApiCall(
          () => authApi.staffLogin(loginData),
          (data) => {
            const { userId, name, role, campusId, accessToken, refreshToken } = data;
            dispatch(setCredentials({
              user: { userId, name, role, campusId },
              accessToken,
              refreshToken
            }));

            let redirectPath;
            redirectPath = role === 'Admin' ? '/admin/dashboard' : '/lecturer/take-attendance';
          
            localStorage.removeItem('returnPath');
            navigate(redirectPath);
          }
        );
      }
    } catch (error) {
      formikHelpers?.setSubmitting(false);
    }
  }, [dispatch, navigate, handleApiCall]);

  const handleLogout = useCallback(async () => {
    try {
      const logoutData = {
        accessToken: localStorage.getItem('accessToken'),
        refreshToken: localStorage.getItem('refreshToken')
      }

      await handleApiCall(
        () => authApi.logout(logoutData),
        () => {
          dispatch(logout());
          navigate('/login');
        }
      );
    } catch (err) {
      // even logout failed, also clear local auth info
      dispatch(logout());
      navigate('/login');
    }
  }, [dispatch, navigate, handleApiCall]);

  const fetchUserProfile = useCallback(async () => {
    if (!user) return false;
    var requestDto = {
      campusId: user.campusId,
      role: user.role
    }
    return await handleApiCall(
      () => userApi.getUserProfile(requestDto),
      (response) => {
        setProfileData(response);
        dispatch(updateUserProfile({
          userId: user.userId,
          name: response.name,
          role: response.role,
          campusId: response.campusId
        }));
        return true;
      }
    );
  }, [handleApiCall, user, dispatch]);

  const updateProfile = useCallback(async (values) => {
    const requestDto = {
      campusId: user.campusId,
      role: user.role,
      name: values.name,
      email: values.email
    };

    // if password is changed
    if (values.currentPassword && values.newPassword) {
      requestDto.currentPassword = values.currentPassword;
      requestDto.newPassword = values.newPassword;
    }

    return await handleApiCall(
      () => userApi.updateProfileWithPassword(requestDto),
      (response) => {
        dispatch(updateUserProfile({
          userId: user.userId,
          name: values.name,
          email: values.email,
          campusId: user.campusId,
        }));
        return true;
      }
    );
  }, [dispatch, handleApiCall]);

  return {
    loading,
    user,
    handleLogin,
    handleLogout,
    profileData,
    updateProfile,
    fetchUserProfile
  };
};