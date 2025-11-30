import { createContext, useContext, useState } from 'react';
import api from '../utils/api'; // axios 인스턴스

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ 로그인 함수
  const login = async (id, password) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.post('/api/login', { id, password });
      const { accessToken, user_data } = res.data;

      setAccessToken(accessToken);
      setUser(user_data);
    } catch (err) {
      if (err.response?.data?.message) {
        setErrorMsg(err.response.data.message);
      } else {
        setErrorMsg('로그인 중 오류가 발생했습니다.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const logout = async () => {
    try {
      const res = await api.post(
        '/api/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.data?.success) {
        setUser(null);
        setAccessToken('');
        return { success: true }; // ✅ 명시적으로 리턴 추가
      } else {
        return { success: false, error: '로그아웃 실패' };
      }
    } catch (err) {
      console.error('로그아웃 실패:', err);
      return { success: false, error: '로그아웃 중 오류가 발생했습니다.' }; // ✅ 예외 상황도 리턴
    }
  };
  // ✅ 회원가입 함수 추가
  const signup = async (nickname, id, password) => {
    try {
      const res = await api.post('/api/signup', { nickname, id, password });
      const { accessToken, user_data } = res.data;

      if (accessToken && user_data) {
        setAccessToken(accessToken);
        setUser(user_data); // 🔥 회원가입 즉시 유저 상태 등록
        return { success: true };
      } else if (res.data.message) {
        return { success: false, error: res.data.message };
      }

      return { success: false, error: '알 수 없는 오류가 발생했습니다.' };
    } catch (err) {
      if (err.response?.data?.message) {
        return { success: false, error: err.response.data.message };
      }
      return { success: false, error: '회원가입 중 오류가 발생했습니다.' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        accessToken,
        setAccessToken,
        login,
        logout,
        signup,
        errorMsg,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
