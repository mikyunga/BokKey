const Button = ({ text, onClick, disabled, isActive, type = 'button' }) => {
  return (
    <button
      type={type}
      className={`relative w-full h-[46px] tracking-[-0.025em] rounded-[8px] text-white overflow-hidden  font-medium
        ${disabled ? 'bg-main-_30 cursor-not-allowed' : 'bg-main'}
      `}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="relative z-10 text-white-_100">{text}</span>
      <div
        className={`absolute inset-0 rounded-[8px] bg-main transition-opacity duration-200 font-medium
          ${isActive ? 'bg-main' : 'bg-main-_30'}
        `}
      />
    </button>
  );
};

export default Button;
