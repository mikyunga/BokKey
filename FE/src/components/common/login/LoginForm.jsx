'use client';

import { useState } from 'react';
import InputField from './InputField';
import Checkbox from './Checkbox';
import KakaoLoginButton from './KakaoLoginButton';

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
    <div className="w-full max-w-md bg-white rounded-2xl shadow-modal p-8">
      {/* 로고 */}
      <div className="flex items-center justify-center gap-1 mb-2">
        <span className="text-main text-xl font-bold">북키</span>
        <div className="w-4 h-4 rounded-full bg-main flex items-center justify-center">
          <svg
            width="10"
            height="10"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 2L4 6.5L8 6.5L6 11"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* 타이틀 */}
      <h1 className="text-2xl font-bold text-center mb-8">로그인</h1>

      {/* 로그인 폼 */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <InputField
          placeholder="아이디를 입력해주세요."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
        />

        <InputField
          placeholder="비밀번호를 입력해주세요."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type={showPassword ? 'text' : 'password'}
          showPasswordToggle
          onTogglePassword={() => setShowPassword(!showPassword)}
          showPassword={showPassword}
        />

        {/* 자동 로그인 & 회원가입 */}
        <div className="flex items-center justify-between pt-1">
          <Checkbox checked={autoLogin} onChange={setAutoLogin} label="자동 로그인" />
          <button
            type="button"
            className="text-sm text-gray-stroke50 hover:text-black transition-colors"
          >
            회원가입
          </button>
        </div>

        {/* 로그인 버튼 */}
        <button
          type="submit"
          className="w-full bg-main-_30 text-main font-medium py-4 rounded-xl hover:bg-main-_10 transition-colors mt-4"
        >
          로그인
        </button>
      </form>

      {/* 소셜 로그인 구분선 */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-gray-stroke05" />
        <span className="text-xs text-gray-stroke30">소셜 계정으로 간편 로그인</span>
        <div className="flex-1 h-px bg-gray-stroke05" />
      </div>

      {/* 카카오 로그인 */}
      <KakaoLoginButton onClick={handleKakaoLogin} />
    </div>
  );
}
