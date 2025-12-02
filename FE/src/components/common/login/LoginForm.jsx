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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('[v0] Login:', { username, password, autoLogin });
    // 로그인 로직 구현
  };

  const handleKakaoLogin = () => {
    console.log('[v0] Kakao login');
    // 카카오 로그인 로직 구현
  };

  return (
    <div className="max-w-md bg-white rounded-2xl p-8 border-[2px] border-black-_04">
      {/* 로고 */}
      <div className="flex items-center justify-center gap-1">
        <img src={IconLogo} className="h-5" />
      </div>

      {/* 타이틀 */}
      <h1 className="text-2xl font-bold text-center mt-5 mb-8">로그인</h1>

      {/* 로그인 폼 */}
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex flex-col">
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
            // 위쪽 둥글기 제거만 유지 (마진 올림은 그대로)
            className="rounded-t-none focus:relative focus:z-10"
            wrapperClassName="-mt-[1px]"
          />
        </div>

        {/* 자동 로그인 & 회원가입 */}
        <div className="flex items-center justify-between pt-4 w-full">
          <Checkbox checked={autoLogin} onChange={setAutoLogin} label="자동 로그인" />
          <button
            type="button"
            className="text-[14px] font-medium leading-[140%] tracking-[-0.025em] text-black-_30 hover:text-black transition-colors"
          >
            회원가입
          </button>
        </div>

        {/* 로그인 버튼 */}
        <button
          type="submit"
          className="w-full h-[51px] bg-main-_30 hover:bg-main-_10 text-main text-[16px] font-medium tracking-[-0.025em] rounded-[8px] mt-6 transition-colors"
        >
          로그인
        </button>
      </form>

      {/* 소셜 로그인 구분선 */}
      <div className="flex items-center gap-3 my-6 w-[320px]">
        <div className="flex-1 h-px bg-gray-stroke05" />
        <span className="text-[14px] leading-[140%] tracking-[-0.025em] text-black-_30">
          소셜 계정으로 간편 로그인
        </span>
        <div className="flex-1 h-px bg-gray-stroke05" />
      </div>

      {/* 카카오 로그인 */}
      <KakaoLoginButton onClick={handleKakaoLogin} />
    </div>
  );
}
