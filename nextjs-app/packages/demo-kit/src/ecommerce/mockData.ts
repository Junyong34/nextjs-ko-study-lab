import type { Product, Coupon, UserSession, Order } from "./types"

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod-001",
    name: "프로 무선 기계식 키보드 (텐키리스)",
    category: "electronics",
    categoryName: "전자기기",
    price: 189000,
    originalPrice: 229000,
    discountRate: 17,
    stock: 24,
    rating: 4.8,
    reviewCount: 342,
    imageUrl: "/images/products/keyboard.jpg",
    description: "초저지연 2.4GHz 무선 연결 및 핫스왑 지원 커스텀 기계식 키보드",
    tags: ["무선", "기계식", "핫스왑", "RGB"],
    isBest: true,
    isNew: false
  },
  {
    id: "prod-002",
    name: "인체공학 무선 버티컬 트랙볼 마우스",
    category: "electronics",
    categoryName: "전자기기",
    price: 99000,
    originalPrice: 129000,
    discountRate: 23,
    stock: 8,
    rating: 4.9,
    reviewCount: 512,
    imageUrl: "/images/products/mouse.jpg",
    description: "손목 터널 증후군 예방을 위한 57도 각도 인체공학 무선 트랙볼",
    tags: ["버티컬", "손목보호", "무선"],
    isBest: true,
    isNew: true
  },
  {
    id: "prod-003",
    name: "노이즈 캔슬링 프리미엄 블루투스 헤드폰",
    category: "electronics",
    categoryName: "전자기기",
    price: 349000,
    originalPrice: 420000,
    discountRate: 16,
    stock: 15,
    rating: 4.7,
    reviewCount: 189,
    imageUrl: "/images/products/headphone.jpg",
    description: "적응형 액티브 노이즈 캔슬링 및 Hi-Res 무선 오디오 코덱 탑재",
    tags: ["노이즈캔슬링", "무선헤드폰", "고음질"],
    isBest: false,
    isNew: true
  },
  {
    id: "prod-004",
    name: "오버핏 헤비웨이트 코튼 후드 집업",
    category: "fashion",
    categoryName: "패션/의류",
    price: 79000,
    originalPrice: 99000,
    discountRate: 20,
    stock: 45,
    rating: 4.6,
    reviewCount: 128,
    imageUrl: "/images/products/hoodie.jpg",
    description: "900g 고중량 프렌치 테리 원단으로 탄탄한 핏을 유지하는 후드 집업",
    tags: ["오버핏", "스트릿", "코튼100%"],
    isBest: true,
    isNew: false
  },
  {
    id: "prod-005",
    name: "테이퍼드 핏 셀비지 데님 팬츠",
    category: "fashion",
    categoryName: "패션/의류",
    price: 119000,
    originalPrice: 149000,
    discountRate: 20,
    stock: 19,
    rating: 4.5,
    reviewCount: 94,
    imageUrl: "/images/products/jeans.jpg",
    description: "13.5oz 전통 셔틀 직기로 제직된 정통 셀비지 롤업 데님",
    tags: ["셀비지", "데님", "테이퍼드핏"],
    isBest: false,
    isNew: false
  },
  {
    id: "prod-006",
    name: "실전 Next.js 16 프로덕션 완벽 가이드",
    category: "books",
    categoryName: "도서",
    price: 38000,
    originalPrice: 42000,
    discountRate: 9,
    stock: 120,
    rating: 5.0,
    reviewCount: 630,
    imageUrl: "/images/products/book-nextjs.jpg",
    description: "App Router 아키텍처부터 캐시 컴포넌트, 성능 최적화까지 완벽 정리",
    tags: ["Next.js", "React 19", "웹개발", "베스트셀러"],
    isBest: true,
    isNew: true
  },
  {
    id: "prod-007",
    name: "모던 미니멀 세라믹 탁상용 무드등",
    category: "living",
    categoryName: "리빙/인테리어",
    price: 45000,
    originalPrice: 58000,
    discountRate: 22,
    stock: 3,
    rating: 4.8,
    reviewCount: 88,
    imageUrl: "/images/products/lamp.jpg",
    description: "3단계 색온도 조절 및 스마트 터치 디밍 지원 세라믹 램프",
    tags: ["인테리어", "무드등", "미니멀"],
    isBest: false,
    isNew: false
  },
  {
    id: "prod-008",
    name: "경량 쿠셔닝 러닝화 (러너스 에디션)",
    category: "sports",
    categoryName: "스포츠/레저",
    price: 159000,
    originalPrice: 199000,
    discountRate: 20,
    stock: 0,
    rating: 4.9,
    reviewCount: 420,
    imageUrl: "/images/products/running-shoes.jpg",
    description: "초경량 카본 플레이트 및 고탄성 폼 미드솔 장착 레이싱화",
    tags: ["러닝화", "카본플레이트", "마라톤", "품절"],
    isBest: true,
    isNew: false
  }
]

export const MOCK_COUPONS: Coupon[] = [
  {
    id: "cp-welcome",
    code: "WELCOME2026",
    name: "신규 가입 환영 10% 할인 쿠폰",
    discountType: "PERCENT",
    discountValue: 10,
    minOrderAmount: 30000,
    expiresAt: "2026-12-31"
  },
  {
    id: "cp-flash",
    code: "FLASH5000",
    name: "타임세일 깜짝 5,000원 할인 쿠폰",
    discountType: "FIXED",
    discountValue: 5000,
    minOrderAmount: 50000,
    expiresAt: "2026-08-31"
  },
  {
    id: "cp-vip",
    code: "VIPSPECIAL",
    name: "VIP 회원 전용 20% 특별 우대 쿠폰",
    discountType: "PERCENT",
    discountValue: 20,
    minOrderAmount: 100000,
    expiresAt: "2026-12-31"
  }
]

export const MOCK_USER_SESSIONS: Record<string, UserSession> = {
  customer: {
    userId: "usr_guest123",
    email: "customer@example.com",
    name: "김쇼핑",
    role: "CUSTOMER",
    tier: "SILVER",
    points: 2500
  },
  vip: {
    userId: "usr_vip999",
    email: "vip.user@example.com",
    name: "이우수",
    role: "VIP",
    tier: "PLATINUM",
    points: 48000
  },
  admin: {
    userId: "usr_admin001",
    email: "store.admin@shoplab.io",
    name: "박관리",
    role: "ADMIN",
    tier: "PLATINUM",
    points: 999999
  }
}

export const MOCK_ORDERS: Order[] = [
  {
    id: "ord-20260822-001",
    orderNumber: "ORD-20260822-8921",
    items: [
      { product: MOCK_PRODUCTS[0], quantity: 1, selected: true },
      { product: MOCK_PRODUCTS[1], quantity: 1, selected: true }
    ],
    totalAmount: 288000,
    discountAmount: 28800,
    shippingFee: 0,
    finalAmount: 259200,
    status: "SHIPPING",
    statusName: "배송 중",
    recipient: {
      name: "김쇼핑",
      phone: "010-1234-5678",
      address: "서울특별시 강남구 테헤란로 152 강남파이낸스센터 12층",
      zipCode: "06236"
    },
    paymentMethod: "CARD",
    createdAt: "2026-08-22 09:30:15"
  }
]
