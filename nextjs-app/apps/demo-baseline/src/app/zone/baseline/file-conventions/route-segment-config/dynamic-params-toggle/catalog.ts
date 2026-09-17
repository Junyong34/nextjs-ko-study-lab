import type { ProductInfo } from './types'

export const BASE_PATH = '/zone/baseline/file-conventions/route-segment-config/dynamic-params-toggle'

/**
 * on-demand·blocked 두 브랜치가 동일하게 사용하는 generateStaticParams 목록.
 * 두 값 모두 이 목록으로 사전 생성되고, PROD-999는 의도적으로 제외한다.
 */
export const KNOWN_PRODUCT_IDS = ['PROD-101', 'PROD-102'] as const

export const UNKNOWN_PRODUCT_ID = 'PROD-999'

const PRODUCT_CATALOG: Record<string, ProductInfo> = {
  'PROD-101': {
    id: 'PROD-101',
    name: '프리미엄 러닝화',
    category: '러닝 / 신발',
    price: 129000,
    desc: '통기성 메쉬 소재의 쿠셔닝 러닝화입니다. generateStaticParams가 반환한 목록에 포함되어 있어 두 브랜치 모두 빌드 시점에 정적 생성됩니다.',
  },
  'PROD-102': {
    id: 'PROD-102',
    name: '방수 윈드브레이커',
    category: '아우터 / 스포츠',
    price: 189000,
    desc: '경량 방수 원단의 윈드브레이커입니다. generateStaticParams가 반환한 목록에 포함되어 있어 두 브랜치 모두 빌드 시점에 정적 생성됩니다.',
  },
}

export function getProduct(id: string): { product: ProductInfo; isKnown: boolean } {
  const known = PRODUCT_CATALOG[id]
  if (known) {
    return { product: known, isKnown: true }
  }
  return {
    product: {
      id,
      name: `카탈로그에 없는 상품 (${id})`,
      category: '미등록',
      price: 0,
      desc: `"${id}"는 generateStaticParams가 반환하지 않은 값입니다. 이 화면이 보인다면 dynamicParams=true가 요청 시점에 온디맨드로 렌더링을 허용했다는 뜻입니다.`,
    },
    isKnown: false,
  }
}
