// BFF 엔드포인트: 모바일 상품 카드가 쓰는 필드(shaping.ts FIELD_RULES)만 평탄화해 돌려준다.
// 1) 입력 검증 → 2) 레거시 함수 직접 호출(자기 URL을 fetch하지 않음) → 3) 봉투 해석·HTTP 상태 변환 → 4) 필드 선택·이름 변환
import type { NextRequest } from 'next/server'
import { getLegacyProduct } from '../_lib/legacy-product'
import { PRODUCT_ID_PATTERN } from '../constants'
import { shapeForMobile } from '../shaping'
import type { BffError } from '../types'

const NO_STORE = { 'Cache-Control': 'no-store' }

function fail(status: number, error: string, serverTiming?: string) {
  const body: BffError = { error }
  const headers: Record<string, string> = { ...NO_STORE }
  if (serverTiming) headers['Server-Timing'] = serverTiming
  return Response.json(body, { status, headers })
}

export function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id') ?? ''

  // 가이드: 다른 시스템에 넘기기 전에 입력을 검증한다. 형식이 틀리면 레거시를 호출하지 않는다(Server-Timing 헤더 없음).
  if (!PRODUCT_ID_PATTERN.test(id)) {
    return fail(400, '상품 ID 형식이 올바르지 않습니다. (예: P-101)')
  }

  try {
    const t0 = performance.now()
    const envelope = getLegacyProduct(id)
    const t1 = performance.now()
    const timing = `legacy;dur=${(t1 - t0).toFixed(2)}`

    // 레거시의 "HTTP 200 + RESULT_CD" 관례를 표준 HTTP 상태로 바꾸고, SVR_NODE·ERR_STACK은 싣지 않는다.
    if (envelope.RESULT_CD === 'E404') return fail(404, '상품을 찾을 수 없습니다.', timing)
    if (envelope.RESULT_CD !== '0000' || !envelope.DATA) {
      return fail(502, '상품 정보를 불러오지 못했습니다.', timing)
    }

    const card = shapeForMobile(envelope.DATA)
    const shapeDur = (performance.now() - t1).toFixed(2)
    return Response.json(card, { headers: { ...NO_STORE, 'Server-Timing': `${timing}, shape;dur=${shapeDur}` } })
  } catch {
    // 가이드: 오류 메시지에 민감 정보를 담지 않는다. 예외 상세는 서버 로그에만 남긴다.
    return fail(500, '일시적인 오류가 발생했습니다.')
  }
}
