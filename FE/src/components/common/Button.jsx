const Button = ({ text, onClick, disabled, isActive, type = 'button' }) => {
  return (
    <button
      type={type}
      className={`relative w-full h-[46px] tracking-[-0.025em] rounded-[8px] text-white overflow-hidden  font-medium
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        bg-login
      `}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="relative z-10">{text}</span>
      <div
        className={`absolute inset-0 rounded-[8px] bg-main transition-opacity duration-200 font-medium
          ${isActive ? 'opacity-100' : 'opacity-0'}
        `}
      />
    </button>
  );
};

export default Button;
