import { createContext, useContext, useState } from 'react';
// import api from '../utils/api'; // API 요청 안 할 거니까 주석 처리하거나 무시하세요

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ [수정됨] API 통신 없이 바로 로그인 시키는 함수
  const login = async (id, password) => {
    setLoading(true);
    setErrorMsg('');

    try {
      // 실제 통신하는 척 0.5초 딜레이 (자연스러운 UX 위해)
      await new Promise((resolve) => setTimeout(resolve, 500));

      console.log(`[AuthContext] 로그인 시도: ${id} / ${password}`);

      // 💡 아이디/비번 하드코딩 검사
      if ((id === 'test' || id === 'test1234') && password === '1234') {
        // 로그인 성공 데이터 가짜로 생성
        const fakeUser = {
          user_id: 1,
          role: 'USER',
          nickname: '테스트유저',
          email: 'test@example.com',
        };
        const fakeToken = 'fake-access-token-12345';

        // 상태 업데이트
        setAccessToken(fakeToken);
        setUser(fakeUser);
        console.log('✅ 로그인 성공 (Bypass Mode)');
      } else {
        // 실패 처리
        throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.');
      }
    } catch (err) {
      console.error('로그인 실패:', err);
      setErrorMsg(err.message || '로그인 중 오류가 발생했습니다.');
      throw err; // LoginForm에서 catch할 수 있게 던짐
    } finally {
      setLoading(false);
    }
  };

  // ✅ [수정됨] 로그아웃도 API 없이 상태만 비움
  const logout = async () => {
    try {
      setUser(null);
      setAccessToken('');
      return { success: true };
    } catch (err) {
      return { success: false, error: '로그아웃 실패' };
    }
  };

  // ✅ 회원가입 (일단 성공 처리)
  const signup = async (nickname, id, password) => {
    // 그냥 성공했다고 침
    return { success: true };
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
