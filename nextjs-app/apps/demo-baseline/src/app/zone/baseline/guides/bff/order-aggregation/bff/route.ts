// BFF 엔드포인트: 브라우저는 이 경로 하나만 호출한다.
// 레거시 3종은 HTTP로 다시 부르지 않고 _lib/legacy.ts 함수를 직접 호출한다 — 자기 자신의 URL을 fetch하면
// 절대 URL(배포 도메인)이 필요하고 서버→서버 HTTP 왕복이 한 번 더 생기기 때문이다.
import type { NextRequest } from 'next/server'
import { getLegacyInventory, getLegacyOrder, getLegacyShipping } from '../_lib/legacy'
import type {
  BffMode,
  BffOrderResponse,
  LegacyCallSpan,
  LegacyInventory,
  LegacyOrder,
  LegacyServiceName,
  LegacyShipping,
} from '../types'

const ORDER_STATUS: Record<LegacyOrder['ORDER_STAT_CD'], string> = { '10': '주문접수', '20': '결제완료', '30': '취소' }
const SHIPPING_STATUS: Record<LegacyShipping['DLV_STAT_CD'], string> = {
  READY: '출고 준비',
  PICKED: '집화 완료',
  IN_TRANSIT: '배송 중',
}
const CARRIER: Record<string, string> = { CJ: 'CJ대한통운' }
const round1 = (v: number) => Math.round(v * 10) / 10

export async function GET(request: NextRequest) {
  const mode: BffMode = request.nextUrl.searchParams.get('mode') === 'serial' ? 'serial' : 'parallel'
  const spans: LegacyCallSpan[] = []
  const t0 = performance.now()

  // 레거시 호출 1건의 시작·끝 시각을 서버에서 기록한다. 병렬이면 구간이 겹치고, 직렬이면 이어 붙는다.
  const timed = async <T>(service: LegacyServiceName, load: () => Promise<T>): Promise<T> => {
    const startMs = performance.now() - t0
    const data = await load()
    spans.push({ service, startMs: round1(startMs), endMs: round1(performance.now() - t0) })
    return data
  }

  try {
    let order: LegacyOrder
    let inventory: LegacyInventory
    let shipping: LegacyShipping

    if (mode === 'parallel') {
      ;[order, inventory, shipping] = await Promise.all([
        timed('orders', getLegacyOrder),
        timed('inventory', getLegacyInventory),
        timed('shipping', getLegacyShipping),
      ])
    } else {
      order = await timed('orders', getLegacyOrder)
      inventory = await timed('inventory', getLegacyInventory)
      shipping = await timed('shipping', getLegacyShipping)
    }

    const serverMs = round1(performance.now() - t0)
    spans.sort((a, b) => a.startMs - b.startMs)
    const stockBySku = new Map(inventory.STOCK_LIST.map((s) => [s.SKU_CD, s.AVAIL_QTY]))

    const body: BffOrderResponse = {
      order: {
        orderId: order.ORDER_NO,
        statusLabel: ORDER_STATUS[order.ORDER_STAT_CD],
        items: order.ITEM_LIST.map((item) => ({
          sku: item.SKU_CD,
          qty: item.QTY,
          available: stockBySku.get(item.SKU_CD) ?? 0,
        })),
      },
      shipping: {
        carrier: CARRIER[shipping.CARRIER_CD] ?? shipping.CARRIER_CD,
        trackingNo: shipping.TRACK_NO,
        statusLabel: SHIPPING_STATUS[shipping.DLV_STAT_CD],
      },
      meta: { mode, serverMs, spans },
    }

    return Response.json(body, {
      headers: {
        'Cache-Control': 'no-store',
        'Server-Timing': `bff-${mode};dur=${serverMs}`,
      },
    })
  } catch {
    // 가이드 권장: 내부 오류 상세(레거시 호스트, 스택)는 클라이언트에 노출하지 않는다.
    return Response.json({ error: '주문 정보를 불러오지 못했습니다.' }, { status: 502 })
  }
}
