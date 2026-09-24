import type { LegacyServiceName } from './types'

/** 이 데모 라우트의 루트 경로. 절대 URL이 아닌 상대 경로라 셸 rewrites·Vercel 배포에서도 그대로 동작한다. */
export const DEMO_BASE = '/zone/baseline/guides/bff/order-aggregation'

/**
 * 레거시 시스템마다 서버에서 실제로 기다리는 응답 지연(ms).
 * _lib/legacy.ts가 이 값만큼 서버 프로세스 안에서 대기한 뒤 응답한다 — 느린 사내 레거시 API의 대기 시간을 재현하는 입력값이며,
 * 화면의 소요 시간은 이 값을 복사하지 않고 브라우저·서버에서 각각 따로 측정한다.
 */
export const LEGACY_LATENCY_MS: Record<LegacyServiceName, number> = {
  orders: 320,
  inventory: 480,
  shipping: 260,
}

export const LEGACY_SERVICES: LegacyServiceName[] = ['orders', 'inventory', 'shipping']

export const LEGACY_LABEL: Record<LegacyServiceName, string> = {
  orders: '주문 시스템',
  inventory: '물류 재고(WMS)',
  shipping: '배송 추적',
}

export const LATENCY_SUM_MS = LEGACY_SERVICES.reduce((acc, s) => acc + LEGACY_LATENCY_MS[s], 0)
export const LATENCY_MAX_MS = Math.max(...LEGACY_SERVICES.map((s) => LEGACY_LATENCY_MS[s]))
