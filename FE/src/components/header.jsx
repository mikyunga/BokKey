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
    // 회원가입 페이지는 항상 로그인으로 이동
    if (isSignupPage) return navigate('/login');

    // 로그인 X → 로그인 이동
    if (!user) return navigate('/login');

    // 로그인 O → 로그아웃
    const result = await logout();
    if (result.success) alert('로그아웃 되었습니다!');
    else alert(result.error);
  };

  return (
    <header className="fixed top-0 left-0 w-full h-[70px] px-6 bg-white z-40">
      <div className=" flex items-center justify-between h-full w-full">
        <img
          src={IconLogo}
          alt="로고"
          className="h-6 cursor-pointer"
          onClick={() => navigate('/')}
        />
        {/* 루트 페이지일 때만 로그인/로그아웃 버튼 표시 */}
        {isRootPage && (
          <div
            className="flex items-center gap-2 border border-white-_05 px-3 py-[6px] rounded-[5px] cursor-pointer"
            onClick={handleAuthClick}
          >
            <img src={user && !isSignupPage ? IconLogout : IconPersonMain} alt="" className="w-3" />
            <span className="text-sm">
              {isSignupPage ? '로그인' : user ? '로그아웃' : '로그인'}
            </span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
