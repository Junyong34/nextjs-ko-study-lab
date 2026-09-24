/**
 * 할인율 데이터 원본(서버 모듈).
 * 외부 가격 API/DB 대신 "서버 시계 기반 타임세일 스케줄"을 사용한다.
 * 30초마다 슬롯이 바뀌고 슬롯마다 할인율이 달라지므로, 이미지가 언제 생성됐는지에 따라
 * 이미지 안의 할인율이 달라진다 — 정적(빌드 시) vs 동적(요청 시) 생성을 구분하는 근거가 된다.
 */
export const DISCOUNT_SLOT_SECONDS = 30

const RATE_TABLE = [10, 15, 20, 25, 30, 35, 40, 50] as const

export const PRODUCT = {
  sku: 'RUN-2026',
  name: 'Aero Runner 2026',
  listPrice: 189000,
} as const

export interface DiscountSnapshot {
  sku: string
  productName: string
  listPrice: number
  rate: number
  salePrice: number
  slot: number
  slotStartedAt: string
  slotEndsAt: string
}

export function getDiscountAt(at: Date): DiscountSnapshot {
  const slotMs = DISCOUNT_SLOT_SECONDS * 1000
  const slot = Math.floor(at.getTime() / slotMs)
  const rate = RATE_TABLE[slot % RATE_TABLE.length]
  return {
    sku: PRODUCT.sku,
    productName: PRODUCT.name,
    listPrice: PRODUCT.listPrice,
    rate,
    salePrice: Math.round((PRODUCT.listPrice * (100 - rate)) / 100),
    slot,
    slotStartedAt: new Date(slot * slotMs).toISOString(),
    slotEndsAt: new Date((slot + 1) * slotMs).toISOString(),
  }
}
