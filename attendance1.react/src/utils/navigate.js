import { useNavigate } from 'react-router-dom';

// 创建一个自定义的导航函数
export const useCustomNavigate = () => {
  const navigate = useNavigate();

  return {
    navigateWithState: (path, state = null) => {
      navigate(path, { state });
    }
  };
}; 