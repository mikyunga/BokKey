import { IconLogo, IconPersonMain, IconLogout } from './../utils/icons.js';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const isRootPage = location.pathname === '/';
  const isSignupPage = location.pathname === '/signup';

  const handleAuthClick = async () => {
    if (isSignupPage) return navigate('/login');
    if (!user) return navigate('/login');

    const result = await logout();
    if (result.success) alert('로그아웃 되었습니다!');
    else alert(result.error);
  };

  return (
    <header className="fixed top-0 left-0 w-full h-[70px] px-6 bg-transparent z-40">
      <div className="flex items-center justify-between h-full w-full">
        <img
          src={IconLogo}
          alt="로고"
          className="h-6 cursor-pointer"
          onClick={() => navigate('/')}
        />

        {(isRootPage || isSignupPage) && (
          <button
            // 💡 수정됨: hover:bg-[#E2F0DD] -> hover:bg-[#EAF6E6] (아주 미세하게 진해짐)
            className="flex items-center gap-[8px] bg-[#F1F9EE] hover:bg-[#EAF6E6] px-4 py-[8px] rounded-[8px] cursor-pointer transition-colors duration-200"
            onClick={handleAuthClick}
          >
            <img
              src={user && !isSignupPage ? IconLogout : IconPersonMain}
              alt=""
              className="w-[12px] h-[12px]"
            />

            <span className="text-[16px] font-medium text-main tracking-[-0.025em]">
              {isSignupPage ? '로그인' : user ? '로그아웃' : '로그인'}
            </span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
