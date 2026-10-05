import { DETAIL_DELAY_MS, NO_SEED_ID } from './constants'
import type { ProductDetail, ProductSummary } from './types'

const PRODUCTS: ProductDetail[] = [
  {
    id: '201',
    name: '트레일 GTX 하이킹화',
    category: '아웃도어 슈즈',
    price: 159000,
    color: 'from-orange-600 to-red-700',
    description: '방수 고어텍스 멤브레인과 러그 아웃솔로 젖은 산길에서도 접지력을 유지합니다.',
    specs: ['고어텍스 방수 멤브레인', '비브람 러그 아웃솔', '무게 약 420g'],
    stock: 12,
  },
  {
    id: '202',
    name: '스톰 쉘 자켓',
    category: '아웃도어 아우터',
    price: 219000,
    color: 'from-sky-600 to-blue-700',
    description: '3레이어 방풍 원단으로 강풍과 비바람을 동시에 차단하는 등산용 쉘 자켓입니다.',
    specs: ['3레이어 방풍·방수 원단', '밀봉 처리한 심 테이핑', '수납 가능한 후드'],
    stock: 5,
  },
  {
    id: '203',
    name: '얼티라이트 다운 베스트',
    category: '보온 이너웨어',
    price: 129000,
    color: 'from-amber-600 to-yellow-700',
    description: '초경량 충전재로 부피 부담 없이 체온을 유지하는 미니멀 다운 베스트입니다.',
    specs: ['초경량 다운 충전재', '파우치에 압축 수납', '무게 약 210g'],
    stock: 0,
  },
  {
    id: NO_SEED_ID,
    name: '나이트 트레일 헤드랜턴',
    category: '야간 장비',
    price: 69000,
    color: 'from-emerald-600 to-teal-700',
    description: '300루멘 밝기와 적색 보조등을 갖춘 야간 산행용 헤드랜턴입니다.',
    specs: ['최대 300루멘', '적색 보조등', 'USB-C 충전'],
    stock: 24,
  },
]

/** 목록 화면이 갖고 있는 요약. NO_SEED_ID 상품은 일부러 뺐다(목록에 없는 상품). */
export const PRODUCT_SUMMARIES: ProductSummary[] = PRODUCTS.filter((p) => p.id !== NO_SEED_ID).map(
  ({ id, name, category, price, color }) => ({ id, name, category, price, color }),
)

/** 지연 없는 가벼운 조회 — generateMetadata처럼 빨리 끝나야 하는 곳에서 쓴다. */
export function findProductSummary(id: string): ProductSummary | undefined {
  const found = PRODUCTS.find((p) => p.id === id)
  return found && { id: found.id, name: found.name, category: found.category, price: found.price, color: found.color }
}

/** 상세 조회. 느린 서버·DB를 흉내 내는 학습용 지연이 들어 있다(DETAIL_DELAY_MS). */
export async function getProductDetail(id: string): Promise<ProductDetail | null> {
  await new Promise((resolve) => setTimeout(resolve, DETAIL_DELAY_MS))
  return PRODUCTS.find((p) => p.id === id) ?? null
}
