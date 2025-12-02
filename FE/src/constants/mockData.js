// 아동 급식카드 가맹점 데이터
export const CHILD_PLACES = [
  {
    id: 1,
    name: '맛있는 분식',
    categoryText: '분식',
    address: '서울특별시 강남구 테헤란로 123',
    phone: '02-1234-5678',
    isOpen: true,
    delivery: true,
  },
  {
    id: 2,
    name: 'GS25 역삼점',
    categoryText: '편의점',
    address: '서울특별시 강남구 역삼로 456',
    phone: '02-5678-1234',
    isOpen: true,
    delivery: false,
  },
  {
    id: 3,
    name: '행복 한식뷔페',
    categoryText: '한식',
    address: '서울특별시 강남구 논현로 789',
    phone: '02-9876-5432',
    isOpen: false,
    delivery: true,
  },
];

// 노인 무료급식소 데이터
export const SENIOR_PLACES = [
  {
    id: 1,
    name: '강남 종합사회복지관',
    categoryText: '복지관',
    address: '서울특별시 강남구 개포로 111',
    target: '65세 이상 기초수급자',
    isOpen: true,
    schedule: '월-금 11:30 - 13:00',
  },
  {
    id: 2,
    name: '역삼 노인복지센터',
    categoryText: '복지센터',
    address: '서울특별시 강남구 테헤란로 222',
    target: '저소득층 독거노인',
    isOpen: true,
    schedule: '매일 12:00 - 13:00',
  },
];
