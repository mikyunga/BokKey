// import './header.css';
// import {
//   iconSearch,
//   minLogo,
//   iconPersonWhite,
//   iconItem,
//   iconArrowLeft,
//   IconLogout,
// } from './../utils/icons.js';
// import { useNavigate } from 'react-router-dom';
// import { useState } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import { useCart } from '../contexts/CartContext.jsx';

// const Header = ({ storeName, showCartOnly, showLogoOnly }) => {
//   const navigate = useNavigate();
//   const isRoot = !storeName && !showCartOnly && !showLogoOnly;
//   const { cartItems } = useCart();
//   const { user, logout } = useAuth();

//   const goToCartPage = () => navigate('/order');
//   const goIndexPage = () => navigate('/');

//   const handleAuthClick = async () => {
//     if (!user) {
//       navigate('/login');
//       return;
//     }

//     const result = await logout();
//     if (result.success) {
//       alert('로그아웃 되었습니다!');
//     } else {
//       alert(result.error);
//     }
//   };

//   return (
//     <header className="bg-main flex items-center justify-between px-5 h-[52px] text-white">
//       {isRoot ? (
//         // 루트 페이지
//         <>
//           <div className="flex-shrink-0">
//             <img src={minLogo} alt="로고" className="h-5" />
//           </div>
//           <div className="flex-1" />
//           <div
//             className="w-fit flex items-center justify-end border border-white-_05 px-3 py-[6px] rounded-[5px] gap-2 cursor-pointer"
//             onClick={handleAuthClick}
//           >
//             <img src={user ? IconLogout : iconPersonWhite} alt="" className="w-3" />
//             <button className="text-sm">{user ? '로그아웃' : '로그인'}</button>
//           </div>
//         </>
//       ) : showCartOnly ? (
//         // MyPage 등: 장바구니만 보여주는 헤더
//         <>
//           <div className="flex-shrink-0">
//             <img src={minLogo} alt="로고" className="h-5" />
//           </div>
//           <div className="flex-1" />
//           <div className="w-[24px] flex justify-end gap-4">
//             {/* <img src={iconSearch} alt="검색" className="h-[18px] cursor-pointer" /> */}
//             <div className="relative">
//               <img
//                 src={iconItem}
//                 alt="장바구니"
//                 className="h-[18px] cursor-pointer"
//                 onClick={goToCartPage}
//               />
//               {cartItems.length > 0 && (
//                 <div className="absolute -top-1 -right-1 w-[6px] h-[6px] bg-yellow-200 rounded-full" />
//               )}
//             </div>
//           </div>
//         </>
//       ) : showLogoOnly ? (
//         <>
//           <div className="flex-shrink-0">
//             <img src={minLogo} alt="로고" className="h-5" />
//           </div>
//         </>
//       ) : (
//         // 매장 페이지 (storeName 있는 경우)
//         <>
//           <div className="w-[24px]">
//             <img
//               src={iconArrowLeft}
//               alt="이전"
//               className="h-[18px] cursor-pointer"
//               onClick={goIndexPage}
//             />
//           </div>
//           <h1 className="flex-1 text-center text-[20px] font-semibold">{storeName}</h1>
//           <div className="w-[24px] flex justify-end gap-4">
//             {/* <img src={iconSearch} alt="검색" className="h-[18px] cursor-pointer" /> */}
//             <div className="relative">
//               <img
//                 src={iconItem}
//                 alt="장바구니"
//                 className="h-[18px] cursor-pointer"
//                 onClick={goToCartPage}
//               />
//               {cartItems.length > 0 && (
//                 <div className="absolute -top-1 -right-1 w-[6px] h-[6px] bg-yellow-200 rounded-full" />
//               )}
//             </div>
//           </div>
//         </>
//       )}
//     </header>
//   );
// };
// export default Header;
