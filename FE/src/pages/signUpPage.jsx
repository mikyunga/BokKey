import Header from '../components/header';
import SignUpForm from '../components/common/signUp/signUpForm';
import { IconLogo } from './../utils/icons';

const signUpPage = () => {
  return (
    <div className="flex flex-col">
      <div className="relative h-screen overflow-y-auto gap-[102px] flex flex-col">
        <header className="flex justify-between items-center">
          <Header></Header>
        </header>
        {/* 본문 전체: 헤더 제외 + InputBox 제외 */}
        <div className="flex justify-center items-center ">
          <div
            className="pt-[48px] w-[404px] p-[42px] gap-[32px] overflow-hidden
            flex flex-col justify-center items-center bg-white rounded-2xl border-[2px] border-black-_04 shadow-[0px_4px_40px_0px_rgba(0,0,0,0.02)]"
          >
            {/* 로고 */}
            <div>
              <div className="flex items-center justify-center gap-1">
                <img src={IconLogo} className="h-[20px]" alt="logo" />
              </div>
              <div className="text-[28px] font-bold mt-[20px]">회원가입</div>
            </div>
            <SignUpForm />
          </div>
        </div>
      </div>
    </div>
  );
};
export default signUpPage;
