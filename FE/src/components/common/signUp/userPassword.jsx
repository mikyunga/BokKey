import { useState, useEffect } from 'react';
import { Eye, EyeOff, Check } from 'lucide-react';

const UserPassWord = ({ value, onChange, setIsPasswordValidAll }) => {
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 입력값 없으면 errorborder안뜨게
  const isInputStarted = value.length > 0;

  // 👉 추가: 비밀번호 확인 칸에 입력이 시작되었는지 확인
  const isConfirmStarted = confirmPassword.length > 0;

  // 조건 1: 영문/숫자/특수문자 중 2가지 이상 포함
  const validateCondition1 = (value) => {
    const hasLetter = /[a-zA-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecial = /[^a-zA-Z0-9]/.test(value);
    return [hasLetter, hasNumber, hasSpecial].filter(Boolean).length >= 2;
  };

  // 조건 2: 공백 제외 8~32자
  const validateCondition2 = (value) => {
    const trimmed = value.replace(/\s/g, '');
    return trimmed.length >= 8 && trimmed.length <= 32;
  };

  // 비밀번호 전체 유효성 검사
  const validatePassword = (value) => {
    return validateCondition1(value) && validateCondition2(value);
  };

  const isPasswordValid = validatePassword(value);
  const isPasswordMatch = value === confirmPassword;
  const isValidPasswordAll = isPasswordValid && isPasswordMatch;

  useEffect(() => {
    if (typeof setIsPasswordValidAll === 'function') {
      setIsPasswordValidAll(isValidPasswordAll);
    }
  }, [value, confirmPassword, setIsPasswordValidAll]);

  return (
    <>
      {/* 비밀번호 입력 */}
      <div className="flex flex-col gap-[6px]">
        <div className="text-[15px] font-semibold text-gray">비밀번호</div>
        <div
          className={`w-full flex items-center px-[16px] py-[14px] gap-[12px]
            border ${
              !isInputStarted
                ? 'border-gray-stroke08'
                : isPasswordValid
                  ? 'border-gray-stroke08'
                  : 'border-rederror'
            }
            rounded-[8px] h-[51px]
            ${
              !isInputStarted
                ? 'focus-within:border-main'
                : isPasswordValid
                  ? 'focus-within:border-main'
                  : 'focus-within:border-rederror'
            }
            transition duration-200`}
        >
          <input
            type={showPassword ? 'text' : 'password'}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsPasswordFocused(true)}
            onBlur={() => setIsPasswordFocused(false)}
            placeholder="비밀번호를 입력해주세요."
            className="w-full outline-none
            placeholder-gray-stroke30 tracking-[-0.025em] focus:border-main 
            transition-all duration-300 ease-in-out
            focus:placeholder:opacity-30"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="z-20 text-gray-stroke30 hover:text-gray-stroke50 transition-colors cursor-pointer"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {isPasswordFocused && (
          <div className="flex flex-col font-medium gap-[4px] text-[13px] ">
            <div
              className={`flex items-center gap-[6px] transition-colors duration-200 ${
                validateCondition1(value) ? 'text-main' : 'text-gray-stroke30'
              }`}
            >
              <Check size={12} strokeWidth={3} />
              <div>영문/숫자/특수문자 중 2가지 이상 포함</div>
            </div>
            <div
              className={`flex items-center gap-[6px] transition-colors duration-200 ${
                validateCondition2(value) ? 'text-main' : 'text-gray-stroke30'
              }`}
            >
              <Check size={12} strokeWidth={3} />
              <div>8자 이상 32자 이하 입력 (공백 제외)</div>
            </div>
          </div>
        )}
      </div>

      {/* 비밀번호 확인 */}
      <div className="flex flex-col gap-[6px]">
        <div className="text-[15px] font-semibold text-gray">비밀번호 확인</div>
        <div
          // 👇 수정됨: 입력이 시작되지 않았으면 기본 스타일, 시작되었는데 불일치하면 에러 스타일
          className={`w-full flex items-center px-[16px] py-[14px] gap-[12px]
            border ${
              !isConfirmStarted
                ? 'border-gray-stroke08' // 입력 전: 기본
                : isPasswordMatch
                  ? 'border-gray-stroke08' // 일치: 기본
                  : 'border-rederror' // 불일치: 빨강
            }
            rounded-[8px] h-[51px]
            ${
              !isConfirmStarted
                ? 'focus-within:border-main'
                : isPasswordMatch
                  ? 'focus-within:border-main'
                  : 'focus-within:border-rederror'
            }
            transition duration-200`}
        >
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="비밀번호를 재입력해주세요."
            className="w-full outline-none
            placeholder-gray-stroke30 tracking-[-0.025em] focus:border-main 
            transition-all duration-300 ease-in-out
            focus:placeholder:opacity-30 "
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="z-20 text-gray-stroke30 hover:text-gray-stroke50 transition-colors cursor-pointer"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* 👇 수정됨: 입력이 시작되었고(&&) 일치하지 않을 때만 에러 메시지 표시 */}
        {isConfirmStarted && !isPasswordMatch && (
          <div className="text-rederror text-[13px] font-medium leading-[1.4]">
            비밀번호가 일치하지 않습니다. 다시 입력해주세요.
          </div>
        )}
      </div>
    </>
  );
};

export default UserPassWord;
