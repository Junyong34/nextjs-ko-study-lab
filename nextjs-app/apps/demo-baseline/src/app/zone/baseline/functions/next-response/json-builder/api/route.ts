import { NextRequest, NextResponse } from 'next/server'
import { FALLBACK_STATUS_CODE, VALID_STATUS_CODES } from '../types'

function resolveStatus(requested: number): number {
  return (VALID_STATUS_CODES as readonly number[]).includes(requested)
    ? requested
    : FALLBACK_STATUS_CODE
}

export async function GET(request: NextRequest) {
  const requestedStatus = Number(request.nextUrl.searchParams.get('status') || FALLBACK_STATUS_CODE)
  const validStatus = resolveStatus(requestedStatus)
  const isSuccess = validStatus >= 200 && validStatus < 300

  const payload = isSuccess
    ? {
        success: true,
        message: 'NextResponse.json() 빌더를 통한 정형화된 JSON 응답',
        data: {
          catalog: [
            { id: 'PROD-001', name: '프리미엄 러닝화', price: 129000 },
            { id: 'PROD-002', name: '방수 윈드브레이커', price: 189000 },
          ],
          cachedAt: new Date().toISOString(),
        },
      }
    : {
        success: false,
        error: `HTTP ${validStatus} 에러 응답 시뮬레이션`,
        code: `ERR_STATUS_${validStatus}`,
      }

  return NextResponse.json(payload, {
    status: validStatus,
    headers: {
      'x-study-response-builder': 'NextResponse.json',
      'x-custom-header-auth': 'bearer-token-verified',
    },
  })
}
