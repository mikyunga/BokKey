import { Routes, Route } from 'react-router-dom';
import Index from './pages/indexPage';
import LoginPage from './pages/loginPage';
import SignUpPage from './pages/signUpPage';
import MapPage from './pages/mapPage'; // 💡 지도 페이지 추가
import NotFound from './pages/notFound';

function App() {
  return (
    <>
      <Routes>
        {/* 메인 랜딩 페이지 */}
        <Route path="/" element={<Index />} />

        {/* 💡 지도 페이지 (이미지의 그 화면) */}
        <Route path="/map" element={<MapPage />} />

        {/* 로그인/회원가입 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
