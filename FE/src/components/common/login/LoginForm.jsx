'use client';

import { useState } from 'react';
import InputField from './InputField';
import Checkbox from './Checkbox';
import KakaoLoginButton from './KakaoLoginButton';
import { IconLogo } from '../../../utils/icons';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [autoLogin, setAutoLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 유효성 검사
  const isFormValid = username.length > 0 && password.length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    console.log('[v0] Login:', { username, password, autoLogin });
  };

  const handleKakaoLogin = () => {
    console.log('[v0] Kakao login');
  };

  return (
    <div className="flex flex-col items-center bg-white rounded-2xl p-10 border-[2px] border-black-_04 shadow-[0px_4px_40px_0px_rgba(0,0,0,0.02)]">
      {/* 로고 */}
      <div className="flex items-center justify-center gap-1">
        <img src={IconLogo} className="h-[18px]" alt="logo" />
      </div>

      {/* 타이틀 */}
      <h1 className="text-[28px] font-bold text-center mt-4 mb-8">로그인</h1>

      {/* 폼 너비 고정 */}
      <form onSubmit={handleSubmit} className="w-[320px] flex flex-col">
        {/* 입력창 그룹 */}
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

        {/* 자동 로그인 & 회원가입 */}
        <div className="flex items-center justify-between pt-4 w-full px-[1px]">
          <Checkbox checked={autoLogin} onChange={setAutoLogin} label="자동 로그인" />
          <button
            type="button"
            className="text-[14px] leading-[140%] tracking-[-0.025em] text-black-_30 hover:text-black-_50 transition-colors"
          >
            회원가입
          </button>
        </div>

        {/* 로그인 버튼 */}
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

        {/* 소셜 로그인 구분선 */}
        <div className="flex items-center gap-3 mt-7 mb-6 w-full">
          <div className="flex-1 h-px bg-gray-stroke08" />
          <span className="text-[14px] leading-[140%] tracking-[-0.025em] text-black-_50">
            소셜 계정으로 간편 로그인
          </span>
          <div className="flex-1 h-px bg-gray-stroke08" />
        </div>

        {/* 카카오 로그인 */}
        <KakaoLoginButton onClick={handleKakaoLogin} />
      </form>
    </div>
  );
}
