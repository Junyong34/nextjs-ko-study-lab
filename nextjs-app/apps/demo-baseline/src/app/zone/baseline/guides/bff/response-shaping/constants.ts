/** 이 데모 라우트의 루트 경로. 절대 URL이 아닌 상대 경로라 셸 rewrites·Vercel 배포에서도 그대로 동작한다. */
export const DEMO_BASE = '/zone/baseline/guides/bff/response-shaping'

/** BFF가 레거시에 넘기기 전에 검사하는 상품 ID 형식 (가이드: 다른 시스템에 넘기기 전에 입력을 검증한다) */
export const PRODUCT_ID_PATTERN = /^P-\d{3}$/

/**
 * 클라이언트에 나가면 안 되는 레거시 키 이름.
 * 레거시 원본은 이 키들을 실제로 담고 있으며, 화면은 받은 JSON을 재귀 순회해 이 키가 남아 있는지 검사한다.
 */
export const SENSITIVE_KEYS = [
  'COST_PRC',
  'MARGIN_RT',
  'PRICE_POLICY_ID',
  'WH_INTERNAL_SKU',
  'SUPPLIER_CD',
  'CONTRACT_NO',
  'SETTLE_ACCT',
  'ADMIN_ID',
  'INTERNAL_MEMO',
  'SVR_NODE',
  'ERR_STACK',
] as const

export type ScenarioKind = 'product' | 'not-found' | 'invalid'

export const SCENARIOS: { id: string; label: string; kind: ScenarioKind; hint: string }[] = [
  { id: 'P-101', label: 'P-101 무선 이어폰', kind: 'product', hint: '정상 조회' },
  { id: 'P-102', label: 'P-102 러닝화', kind: 'product', hint: '정상 조회 · 재고 적음' },
  { id: 'P-103', label: 'P-103 텀블러', kind: 'product', hint: '정상 조회 · 재고 소진' },
  { id: 'P-999', label: 'P-999 없는 상품', kind: 'not-found', hint: '형식은 맞지만 데이터 없음' },
  { id: 'abc', label: 'abc 형식 오류', kind: 'invalid', hint: '검증 실패 → 레거시 미호출' },
]
