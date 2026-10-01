import type { CatalogProduct } from '../types'

// 카탈로그 데이터는 6종이지만 generateStaticParams는 앞의 4종(인기 상품)만 사전 생성한다.
// 5·6번은 데이터가 있어도 dynamicParams = false 때문에 404가 되는 것을 보여 주기 위한 구성이다.
export const CATALOG: CatalogProduct[] = [
  { id: '001', name: '프리미엄 러닝화', price: 129000 },
  { id: '002', name: '방수 윈드브레이커', price: 189000 },
  { id: '003', name: '경량 트레킹 배낭', price: 98000 },
  { id: '004', name: '메리노 울 양말 3종', price: 24000 },
  { id: '005', name: '트레일 러닝 베스트', price: 76000 },
  { id: '006', name: '보온 텀블러 500ml', price: 32000 },
]

export const PREBUILT_IDS = CATALOG.slice(0, 4).map((p) => p.id)

/** 카탈로그에 아예 없는 id. 데이터가 없어도 같은 404가 나오는지 비교하는 용도 */
export const UNKNOWN_ID = '999'

export const PROBE_IDS = [...CATALOG.map((p) => p.id), UNKNOWN_ID]

export const isPrebuilt = (id: string) => PREBUILT_IDS.includes(id)
