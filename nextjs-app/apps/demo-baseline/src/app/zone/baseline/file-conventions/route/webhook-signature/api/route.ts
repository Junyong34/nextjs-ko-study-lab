import { NextRequest, NextResponse } from 'next/server'
import crypto from 'node:crypto'

const WEBHOOK_SECRET = 'study_webhook_secret_key_2026'

export async function GET() {
  return NextResponse.json({
    endpoint: '/zone/baseline/file-conventions/route/webhook-signature/api',
    protocol: 'HMAC-SHA256 Webhook Verification',
    headerKey: 'x-signature-sha256',
    status: 'ACTIVE',
  })
}

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-signature-sha256') || request.headers.get('x-hub-signature-256')
    const rawBody = await request.text()

    if (!signature) {
      return NextResponse.json(
        {
          verified: false,
          error: '헤더에 서명(x-signature-sha256)이 누락되었습니다.',
          receivedHeaders: Object.fromEntries(request.headers.entries()),
        },
        { status: 400 }
      )
    }

    // 서버 측 HMAC-SHA256 계산
    const expectedSignature = crypto
      .createHmac('sha256', WEBHOOK_SECRET)
      .update(rawBody)
      .digest('hex')

    const isValid = crypto.timingSafeEqual(
      Buffer.from(signature, 'utf8'),
      Buffer.from(expectedSignature, 'utf8')
    )

    if (!isValid) {
      return NextResponse.json(
        {
          verified: false,
          error: 'HMAC-SHA256 서명 불일치 (위변조 감지)',
          receivedSignature: signature.slice(0, 12) + '...',
          expectedSignature: expectedSignature.slice(0, 12) + '...',
        },
        { status: 401 }
      )
    }

    const payload = JSON.parse(rawBody)

    return NextResponse.json({
      verified: true,
      message: '웹훅 서명 검증 성공 (결제 이벤트 처리 완료)',
      event: payload.event,
      paymentId: payload.paymentId,
      amount: payload.amount,
      receivedAt: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        verified: false,
        error: error instanceof Error ? error.message : '요청 처리 실패',
      },
      { status: 500 }
    )
  }
}
