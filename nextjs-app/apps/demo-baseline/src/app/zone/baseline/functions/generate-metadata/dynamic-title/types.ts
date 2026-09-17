export interface ProductMeta {
  id: string
  name: string
  title: string
  description: string
}

// generateMetadata({ params })가 실제로 params.productId로 조회하는 데이터 소스.
// 실무에서는 이 자리에 DB/CMS 조회가 들어간다.
export const PRODUCTS: ProductMeta[] = [
  {
    id: 'running-shoes-001',
    name: '트레일 러닝화 X1',
    title: '트레일 러닝화 X1 - 고어텍스 방수 트레일화 129,000원',
    description: '고어텍스 방수 아웃솔과 경량 미드솔을 적용해 젖은 산길에서도 안정적인 접지력을 제공하는 트레일 러닝화.',
  },
  {
    id: 'windbreaker-002',
    name: '방수 윈드브레이커',
    title: '방수 윈드브레이커 - 3레이어 쉘 재킷 189,000원',
    description: '3레이어 방수 쉘 원단과 심실링 처리로 폭우 속에서도 완전 방수되는 윈드브레이커.',
  },
  {
    id: 'trekking-backpack-003',
    name: '트레킹 백팩 40L',
    title: '트레킹 백팩 40L - 알루미늄 프레임 149,000원',
    description: '알루미늄 프레임 지지대와 통기성 매쉬 등판으로 장시간 트레킹에도 편안한 40리터 백팩.',
  },
]

// 루트(정적) 페이지의 title — demos.yaml의 데모 제목과 동일한 문자열로,
// getDemoMetadata가 params 없이 항상 반환하는 값과 일치한다.
export const ROOT_TITLE = 'generateMetadata 동적 SEO 타이틀 및 메타태그 생성'

export function findProduct(productId: string): ProductMeta | undefined {
  return PRODUCTS.find((p) => p.id === productId)
}
