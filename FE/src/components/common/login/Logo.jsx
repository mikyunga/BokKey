const Logo = () => {
  return (
    <div className="flex items-center gap-1">
      <span className="text-main text-2xl font-bold">북키</span>
      <div className="w-5 h-5 rounded-full bg-main flex items-center justify-center">
        <svg
          width="12"
          height="12"
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
  );
};

export default Logo;
