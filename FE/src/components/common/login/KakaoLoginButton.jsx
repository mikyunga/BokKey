'use client';

export default function KakaoLoginButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full bg-[#FEE500] text-black font-medium py-4 rounded-xl hover:bg-[#FDD835] transition-colors flex items-center justify-center gap-2"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 3C5.582 3 2 5.79 2 9.25C2 11.395 3.488 13.245 5.694 14.314L4.822 17.386C4.76 17.594 4.996 17.756 5.174 17.634L8.946 15.026C9.294 15.058 9.646 15.074 10 15.074C14.418 15.074 18 12.284 18 8.824C18 5.364 14.418 2.574 10 2.574V3Z"
          fill="currentColor"
        />
      </svg>
      카카오 로그인
    </button>
  );
}
