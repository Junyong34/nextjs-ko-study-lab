// 서버 전용 모듈: route.ts에서만 import한다. `_lib`는 private folder라 URL 라우트가 되지 않는다.
// 레거시 API의 "본체 로직"을 함수로 두고,
//  - legacy/*/route.ts  : 브라우저가 직접 부르는 HTTP 경로 (클라이언트 직접 호출 시나리오)
//  - bff/route.ts        : 같은 함수를 HTTP 없이 직접 호출 (가이드 Caveats: 서버에서 자기 Route Handler를 fetch하면
//                          절대 URL + 추가 HTTP 왕복이 생기므로 데이터 소스를 직접 호출한다)
// 두 경로가 같은 함수를 공유하므로 응답 데이터는 동일하고, 차이는 "누가 몇 번 왕복하느냐"뿐이다.
import { LEGACY_LATENCY_MS } from '../constants'
import type { LegacyInventory, LegacyOrder, LegacyServiceName, LegacyShipping } from '../types'

/** 레거시 시스템의 응답 지연을 서버 프로세스 안에서 실제로 기다린다. (브라우저 쪽 타이머가 아니다) */
function waitLegacyLatency(service: LegacyServiceName) {
  return new Promise<void>((resolve) => setTimeout(resolve, LEGACY_LATENCY_MS[service]))
}

export async function getLegacyOrder(): Promise<LegacyOrder> {
  await waitLegacyLatency('orders')
  return {
    ORDER_NO: 'ORD-2026-0917-881',
    ORDER_STAT_CD: '20',
    CUST_NO: 'C-00481',
    REG_DTM: '20260917143210',
    ITEM_LIST: [
      { SKU_CD: 'SKU-RUN-270', QTY: 1, UNIT_PRC: 129000 },
      { SKU_CD: 'SKU-SOCK-3P', QTY: 2, UNIT_PRC: 12000 },
    ],
  }
}

export async function getLegacyInventory(): Promise<LegacyInventory> {
  await waitLegacyLatency('inventory')
  return {
    WH_CD: 'WH-ICN-A',
    STOCK_LIST: [
      { SKU_CD: 'SKU-RUN-270', AVAIL_QTY: 42, RSV_QTY: 3 },
      { SKU_CD: 'SKU-SOCK-3P', AVAIL_QTY: 7, RSV_QTY: 1 },
    ],
    UPD_DTM: '20260917140000',
  }
}

export async function getLegacyShipping(): Promise<LegacyShipping> {
  await waitLegacyLatency('shipping')
  return {
    DLV_NO: 'DLV-55120',
    CARRIER_CD: 'CJ',
    TRACK_NO: '6891-2233-0417',
    DLV_STAT_CD: 'PICKED',
  }
}

/** legacy/*\/route.ts 공통 응답: 서버 처리 시간을 표준 Server-Timing 헤더로 함께 싣는다. */
export async function legacyJsonResponse<T>(service: LegacyServiceName, load: () => Promise<T>) {
  const start = performance.now()
  const data = await load()
  const dur = (performance.now() - start).toFixed(1)
  return Response.json(data, {
    headers: {
      'Cache-Control': 'no-store',
      'Server-Timing': `legacy-${service};dur=${dur}`,
    },
  })
}
