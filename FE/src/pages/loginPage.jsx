import LoginForm from '../components/common/login/loginForm';
import Logo from '../components/common/login/Logo';
import Header from '../components/header';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-white-_100 flex flex-col">
      {/* 상단 로고와 로그인 링크 */}
      <header className="flex justify-between items-center px-6 py-4">
        <Header></Header>
      </header>

      {/* 중앙 로그인 폼 */}

      <main className="flex-1 flex items-start justify-center px-4 pt-[48px]">
        <LoginForm />
      </main>
    </div>
  );
};
export default LoginPage;
