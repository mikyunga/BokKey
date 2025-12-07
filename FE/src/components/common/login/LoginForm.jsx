'use client';

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputField from './InputField';
import Checkbox from './Checkbox';
import KakaoLoginButton from './KakaoLoginButton';
import { IconLogo } from '../../../utils/icons';

// 💡 중요: login.js 대신 AuthContext를 가져옵니다.
import { useAuth } from '../../../contexts/AuthContext';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [autoLogin, setAutoLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // 💡 AuthContext에서 login 함수와 에러 메시지를 가져옵니다.
  const { login, errorMsg } = useAuth();

  const isFormValid = username.length > 0 && password.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      // 💡 Context의 login 함수 호출
      // (AuthContext 내부에서 api.post 요청을 보냄 -> MSW가 가로챔)
      await login(username, password);

      console.log('로그인 성공');
      navigate('/map');
    } catch (error) {
      console.error('로그인 실패 핸들링:', error);
      // 에러 메시지는 AuthContext의 errorMsg 또는 catch 블록에서 처리
      alert('아이디 또는 비밀번호를 확인해주세요.');
    }
  };

  return (
    <div className="flex flex-col items-center bg-white rounded-2xl p-10 border-[2px] border-black-_04 shadow-[0px_4px_40px_0px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-center gap-1">
        <img src={IconLogo} className="h-[18px]" alt="logo" />
      </div>

      <h1 className="text-[28px] font-bold text-center mt-4 mb-8">로그인</h1>

      <form onSubmit={handleSubmit} className="w-[320px] flex flex-col">
        <div className="flex flex-col w-full">
          <InputField
            placeholder="아이디를 입력해주세요."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            className="rounded-b-none border-b-transparent focus:relative focus:z-10 focus:border-main"
          />

          <InputField
            placeholder="비밀번호를 입력해주세요."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? 'text' : 'password'}
            showPasswordToggle
            onTogglePassword={() => setShowPassword(!showPassword)}
            showPassword={showPassword}
            className="rounded-t-none focus:relative focus:z-10"
            wrapperClassName="-mt-[1px]"
          />
        </div>

        {/* 에러 메시지 표시용 (선택 사항) */}
        {errorMsg && <p className="text-red-500 text-xs mt-2 text-center">{errorMsg}</p>}

        <div className="flex items-center justify-between pt-4 w-full px-[1px]">
          <Checkbox checked={autoLogin} onChange={setAutoLogin} label="자동 로그인" />

          <Link
            to="/signup"
            className="text-[14px] leading-[140%] tracking-[-0.025em] text-black-_30 hover:text-black-_50 transition-colors"
          >
            회원가입
          </Link>
        </div>

        <button
          type="submit"
          disabled={!isFormValid}
          className={`w-full h-[51px] text-[16px] font-medium tracking-[-0.025em] rounded-[8px] mt-6 transition-all text-[#FFFFFF] ${
            isFormValid
              ? 'bg-main hover:shadow-[inset_0_0_0_100px_rgba(0,0,0,0.02)] cursor-pointer'
              : 'bg-main-_30 cursor-not-allowed'
          }`}
        >
          로그인
        </button>

        <div className="flex items-center gap-3 mt-7 mb-6 w-full">
          <div className="flex-1 h-px bg-gray-stroke08" />
          <span className="text-[14px] leading-[140%] tracking-[-0.025em] text-black-_50">
            소셜 계정으로 간편 로그인
          </span>
          <div className="flex-1 h-px bg-gray-stroke08" />
        </div>

        <KakaoLoginButton onClick={() => console.log('kakao')} />
      </form>
    </div>
  );
}
