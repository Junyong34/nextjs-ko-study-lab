// 레거시 원본 → 모바일 상품 카드 변환 규칙.
// bff/route.ts는 이 표로 응답을 만들고, 화면의 "필드 매핑" 표도 같은 배열을 그대로 그린다 — 설명과 실제 변환이 어긋날 수 없다.
// 순수 함수만 두므로 서버·클라이언트 어디서 import해도 레거시 데이터는 번들에 들어가지 않는다.
import type { LegacyProductData, MobileProductCard } from './types'

interface FieldRule<K extends keyof MobileProductCard = keyof MobileProductCard> {
  key: K
  /** 원본에서 읽는 경로 (설명용) */
  from: string
  /** 이름 변경 외에 한 일 */
  note: string
  pick: (d: LegacyProductData) => MobileProductCard[K]
}

const rule = <K extends keyof MobileProductCard>(r: FieldRule<K>) => r as unknown as FieldRule

function stockStatus(d: LegacyProductData): MobileProductCard['stockStatus'] {
  const available = d.STOCK_INFO.TOT_QTY - d.STOCK_INFO.RSV_QTY
  if (available <= 0) return '품절'
  return available < d.STOCK_INFO.SAFETY_QTY ? '품절 임박' : '구매 가능'
}

export const FIELD_RULES: FieldRule[] = [
  rule({ key: 'id', from: 'DATA.PRD_NO', note: '이름 변경', pick: (d) => d.PRD_NO }),
  rule({ key: 'name', from: 'DATA.PRD_INFO.PRD_NM', note: '평탄화', pick: (d) => d.PRD_INFO.PRD_NM }),
  rule({ key: 'brand', from: 'DATA.PRD_INFO.BRAND_NM', note: '평탄화', pick: (d) => d.PRD_INFO.BRAND_NM }),
  rule({ key: 'price', from: 'DATA.PRICE_INFO.SALE_PRC', note: '평탄화', pick: (d) => d.PRICE_INFO.SALE_PRC }),
  rule({ key: 'listPrice', from: 'DATA.PRICE_INFO.LIST_PRC', note: '평탄화', pick: (d) => d.PRICE_INFO.LIST_PRC }),
  rule({
    key: 'discountRate',
    from: 'LIST_PRC, SALE_PRC',
    note: '서버에서 계산 (%)',
    pick: (d) => Math.round((1 - d.PRICE_INFO.SALE_PRC / d.PRICE_INFO.LIST_PRC) * 100),
  }),
  rule({
    key: 'thumbnailUrl',
    from: 'DATA.IMG_LIST[TYPE=THUMB_S].URL',
    note: '이미지 5종 중 모바일 썸네일 1개만',
    pick: (d) => d.IMG_LIST.find((img) => img.TYPE === 'THUMB_S')?.URL ?? '',
  }),
  rule({
    key: 'rating',
    from: 'DATA.REVIEW_SUMMARY.AVG_SCORE',
    note: '소수 1자리로 반올림',
    pick: (d) => Math.round(d.REVIEW_SUMMARY.AVG_SCORE * 10) / 10,
  }),
  rule({ key: 'reviewCount', from: 'DATA.REVIEW_SUMMARY.CNT', note: '평탄화', pick: (d) => d.REVIEW_SUMMARY.CNT }),
  rule({
    key: 'stockStatus',
    from: 'DATA.STOCK_INFO.TOT_QTY·RSV_QTY·SAFETY_QTY',
    note: '수량 대신 상태 라벨만',
    pick: stockStatus,
  }),
  rule({
    key: 'freeShipping',
    from: 'DATA.SHIP_POLICY.FREE_SHIP_YN',
    note: "'Y'/'N' → boolean",
    pick: (d) => d.SHIP_POLICY.FREE_SHIP_YN === 'Y',
  }),
  rule({ key: 'optionCount', from: 'DATA.OPT_LIST', note: '배열 대신 개수만', pick: (d) => d.OPT_LIST.length }),
]

/** 원본 봉투의 DATA에서 규칙에 적힌 필드만 골라 1단계 객체로 만든다. 규칙에 없는 키(원가·공급사·감사 로그 등)는 자연히 빠진다. */
export function shapeForMobile(data: LegacyProductData): MobileProductCard {
  return Object.fromEntries(FIELD_RULES.map((r) => [r.key, r.pick(data)])) as unknown as MobileProductCard
}
