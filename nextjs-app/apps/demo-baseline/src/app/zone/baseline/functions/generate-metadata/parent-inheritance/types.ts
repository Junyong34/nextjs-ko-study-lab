export interface ProductMeta {
  id: string
  name: string
  title: string
}

export const BASE_PATH = '/zone/baseline/functions/generate-metadata/parent-inheritance'

// products/[productId]의 generateMetadata({ params }, parent)가 실제로 조회하는 데이터 소스.
export const PRODUCTS: ProductMeta[] = [
  {
    id: 'wireless-earbuds-101',
    name: '노이즈캔슬링 무선 이어버드',
    title: '노이즈캔슬링 무선 이어버드 - PB 특별관 단독 129,000원',
  },
  {
    id: 'smart-desk-lamp-102',
    name: '스마트 밝기조절 데스크 램프',
    title: '스마트 밝기조절 데스크 램프 - PB 특별관 단독 59,000원',
  },
]

export function findProduct(productId: string): ProductMeta | undefined {
  return PRODUCTS.find((p) => p.id === productId)
}

// 이 세그먼트의 layout.tsx가 실제로 선언하는 "부모 metadata" 값.
// layout.tsx와 검증 UI(클라이언트)가 같은 상수를 참조해, "부모가 선언한 기대값"과
// "실제 렌더링된 <head>"를 대조할 수 있게 한다 — 값을 두 곳에서 따로 지어내지 않는다.
export const PARENT_OPEN_GRAPH = {
  siteName: '공식 스토어 PB 특별관',
  title: '공식 스토어 PB 특별관 대표 이미지',
  description: '이 섹션의 layout.tsx가 선언한 공통 Open Graph 이미지·설명입니다.',
}

// 인덱스(page.tsx)의 title — demos.yaml의 데모 제목과 동일한 문자열로,
// getDemoMetadata가 반환하는 finalTitle과 일치한다(검증 UI가 기대값 계산에 사용).
export const INDEX_TITLE = '부모 metadata 상속 및 canonical URL 오버라이드'
