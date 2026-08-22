import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const statusParam = Number(request.nextUrl.searchParams.get('status') || '200')
  const validStatus = [200, 201, 400, 404, 422, 500].includes(statusParam) ? statusParam : 200

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
      'content-type': 'application/json; charset=utf-8',
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    return NextResponse.json(
      {
        success: true,
        echo: body,
        receivedAt: new Date().toISOString(),
      },
      {
        status: 201,
        headers: {
          'x-study-response-builder': 'NextResponse.json',
        },
      }
    )
  } catch {
    return NextResponse.json(
      { success: false, error: '잘못된 JSON 형식' },
      { status: 400 }
    )
  }
}
