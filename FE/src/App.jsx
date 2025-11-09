import { Routes, Route } from 'react-router-dom';
import Index from './pages/index';
// import Main from './pages/MainPage';
// import MyPage from './pages/MyPage';
import NotFound from './pages/notFound';
// import BookMarkPage from './pages/bookMarkPage';
import LoginPage from './pages/loginPage';
import SignUpPage from './pages/signUpPage';

function App() {
  return (
    <>
      <Routes>
        {/* 식당 선택 */}
        <Route path="/" element={<Index />} />
        {/* 1. 로그인 */}
        <Route path="/login" element={<LoginPage />} />
        {/* 2. 회원가입 */}
        <Route path="/signup" element={<SignUpPage />} />
        {/* main/선택된 식당으로 이동*/}
        {/* <Route path="/mypage" element={<MyPage />} /> */}
        {/* <Route path="/bookmark" element={<BookMarkPage />} /> */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
