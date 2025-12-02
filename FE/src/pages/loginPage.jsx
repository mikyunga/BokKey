import LoginForm from '../components/common/login/loginForm';
import Logo from '../components/common/login/Logo';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-white-_100 flex flex-col">
      {/* 상단 로고와 로그인 링크 */}
      <header className="flex justify-between items-center px-6 py-4">
        <Logo />
        <button className="text-main text-sm font-medium">로그인</button>
      </header>

      {/* 중앙 로그인 폼 */}
      <main className="flex-1 flex items-center justify-center px-4">
        <LoginForm />
      </main>
    </div>
  );
};
export default LoginPage;
