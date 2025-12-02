'use client';

import { IconArrowRight, IconIphone, IconLogo } from '../utils/icons';
import Header from '../components/header';

export default function Index() {
  return (
    <section
      style={{ background: 'linear-gradient(to bottom, #FFFFFF, rgba(149, 215, 105, 0.1))' }}
      className="h-screen flex flex-col overflow-hidden relative"
    >
      <Header />

      <main className="flex-1 w-full relative flex justify-center">
        {/* 1. 텍스트 컨텐츠 영역 */}
        <div className="absolute top-[15%] z-10 flex flex-col items-center px-4 w-full">
          <h1 className="text-[60px] font-bold text-center leading-none text-black">
            <span className="block mb-4">복지를 여는 열쇠,</span>

            <div className="flex items-center justify-center gap-2">
              <img src={IconLogo} alt="복키 로고" className="h-[72px] object-contain" />
            </div>
          </h1>

          <p className="text-[24px] font-semibold text-center mt-4 bg-white/30 backdrop-blur-sm py-1 px-4 rounded-full">
            내 주변 무료 급식소와 급식카드 가맹점을 한눈에!
          </p>
        </div>

        {/* 2. 아이폰 목업 & 버튼 영역 */}
        <div className="absolute bottom-0 w-full flex justify-center z-0 pointer-events-none">
          <img
            src={IconIphone}
            alt="아이폰 목업"
            className="max-w-full h-auto object-bottom"
            style={{ maxHeight: '80vh' }}
          />

          {/* 💡 [수정됨] 피그마 스타일 강제 적용 (인라인 스타일 사용) */}
          <button
            className="absolute top-[35%] left-1/2 -translate-x-1/2 pointer-events-auto 
            rounded-[10px] px-6 py-[12px]
            flex items-center gap-[3px] 
            hover:bg-white transition-all duration-300 whitespace-nowrap"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.75)', // 흰색 80%
              backdropFilter: 'blur(5px)', // 블러 10
              WebkitBackdropFilter: 'blur(5px)', // 사파리용 블러
              border: '2px solid rgba(0, 0, 0, 0.1)', // 검정 6%, 두께 2px
              boxShadow: '0px 4px 10px 0px rgba(0, 0, 0, 0.05)', // 그림자
            }}
          >
            {/* 텍스트: 검정 70% */}
            <span
              className="text-[16px] font-medium tracking-[-0.025em] mr-3"
              style={{ color: 'rgba(0, 0, 0, 0.7)' }}
            >
              내 주변 식사 장소 찾기
            </span>

            {/* 화살표 3개: 투명도 30% */}
            <img src={IconArrowRight} alt="" className="h-3 opacity-30" />
            <img src={IconArrowRight} alt="" className="h-3 opacity-30" />
            <img src={IconArrowRight} alt="" className="h-3 opacity-30" />
          </button>
        </div>
      </main>
    </section>
  );
}
