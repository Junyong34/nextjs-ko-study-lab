import { NextRequest, NextResponse } from 'next/server'
import type { DeliveryStatus } from '../types'

export const dynamic = 'force-dynamic'

const STAGES = [
  { status: 'payment_done', label: '결제 완료', location: '서울 물류센터 접수' },
  { status: 'preparing', label: '상품 포장 중', location: '김포 자동화 메가허브' },
  { status: 'in_transit', label: '간선 배송 중', location: '대전 Hub 터미널 이동' },
  { status: 'delivered', label: '배송 완료', location: '고객님 문 앞 배송 완료' },
] as const

let currentStageIndex = 0
let serverPollCount = 0

export async function GET(request: NextRequest) {
  serverPollCount++
  const advance = request.nextUrl.searchParams.get('advance') === 'true'
  const reset = request.nextUrl.searchParams.get('reset') === 'true'

  if (reset) {
    currentStageIndex = 0
    serverPollCount = 1
  } else if (advance) {
    currentStageIndex = (currentStageIndex + 1) % STAGES.length
  }

  const stage = STAGES[currentStageIndex]
  const data: DeliveryStatus = {
    trackingId: 'TRK-2026-8831',
    status: stage.status as DeliveryStatus['status'],
    statusLabel: stage.label,
    updatedAt: new Date().toISOString().substring(11, 19),
    currentLocation: stage.location,
    pollCount: serverPollCount,
  }

  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (body.reset) {
      currentStageIndex = 0
      serverPollCount = 1
    } else if (body.step !== undefined) {
      currentStageIndex = Math.min(STAGES.length - 1, Math.max(0, body.step))
    } else {
      currentStageIndex = (currentStageIndex + 1) % STAGES.length
    }
  } catch {
    currentStageIndex = (currentStageIndex + 1) % STAGES.length
  }

  const stage = STAGES[currentStageIndex]
  return NextResponse.json({
    success: true,
    data: {
      trackingId: 'TRK-2026-8831',
      status: stage.status,
      statusLabel: stage.label,
      currentLocation: stage.location,
      pollCount: serverPollCount,
    },
  })
}
