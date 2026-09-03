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
    id: 'prod-headphone',
    name: '프리미엄 헤드폰',
    title: '노이즈 캔슬링 무선 헤드폰 WH-2026 | 오디오 랩',
    description: '40mm HD 드라이버와 적응형 ANC 기술이 선사하는 궁극의 사운드 경험.',
  },
  {
    id: 'prod-keyboard',
    name: '기계식 키보드',
    title: 'CNC 풀알루미늄 커스텀 기계식 키보드 | 테크 랩',
    description: '가스켓 마운트와 윤활 스위치로 완성된 최상의 타건감을 경험하세요.',
  },
]

export function findProduct(productId: string): ProductMeta | undefined {
  return PRODUCTS.find((p) => p.id === productId)
}
