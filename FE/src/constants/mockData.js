// 📂 uploaded: welfare_store_edit.csv 기반 데이터
export const CHILD_PLACES = [
  {
    id: 1,
    name: '길림성',
    category: 'restaurant', // category_id: 1 -> restaurant 매핑
    categoryText: '일반음식점', // category_id: 1 -> 일반음식점 매핑
    address: '강원특별자치도 동해시 가마골길 42-15',
    phone: '033-531-8940',
    isOpen: true, // weekday_open/close 시간 기반 로직 필요 (일단 true)
    delivery: true, // is_delivery: "Y" -> true
    latitude: 37.53767004,
    longitude: 129.1016932,
  },
  {
    id: 2,
    name: 'GS25 천곡원룸점',
    category: 'convenience', // category_id: 2
    categoryText: '편의점',
    address: '강원특별자치도 동해시 감추4길 11',
    phone: '033-535-3777',
    isOpen: true,
    delivery: true, // is_delivery: "Y"
    latitude: 37.51569664,
    longitude: 129.1195216,
  },
  {
    id: 3,
    name: '세븐일레븐 동해천곡점',
    category: 'convenience',
    categoryText: '편의점',
    address: '강원특별자치도 동해시 감추5길 22',
    phone: '033-532-5286',
    isOpen: true,
    delivery: true,
    latitude: 37.52569664, // (좌표 임의 보정)
    longitude: 129.1295216,
  },
  {
    id: 4,
    name: '파리바게뜨',
    category: 'bakery', // category_id: 3
    categoryText: '베이커리',
    address: '강원특별자치도 동해시 중앙로 23',
    phone: '033-123-4567',
    isOpen: true,
    delivery: false,
    latitude: 37.53569664,
    longitude: 129.1395216,
  },
];

// 📂 uploaded: meal_center.csv 기반 데이터
export const SENIOR_PLACES = [
  {
    id: 1,
    name: '서부종합사회복지관',
    category: 'welfare',
    categoryText: '복지관',
    address: '충청북도 청주시 흥덕구 가로수로1370번길 16',
    target: '노인, 취약계층', // target_id 매핑 결과
    isOpen: true,
    schedule: '월-금 09:00 - 18:00', // meal_days 데이터 기반
    latitude: 36.6356, // 청주 좌표 예시
    longitude: 127.4456,
    phone: '043-236-3600',
  },
  {
    id: 2,
    name: '중촌효심정',
    category: 'center',
    categoryText: '무료급식소',
    address: '대전광역시 중구 대전천서로 616',
    target: '65세 이상 노인',
    isOpen: true,
    schedule: '월-금 중식',
    latitude: 36.3385338,
    longitude: 127.4159917,
    phone: '042-252-0872',
  },
  {
    id: 3,
    name: '학산종합사회복지관',
    category: 'welfare',
    categoryText: '복지관',
    address: '대구광역시 달서구 월성로 77',
    target: '저소득층 독거노인',
    isOpen: false, // 영업종료 예시
    schedule: '월-금 11:30~12:30',
    latitude: 35.8285,
    longitude: 128.5285,
    phone: '053-634-1234',
  },
];
