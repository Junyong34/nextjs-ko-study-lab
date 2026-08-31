'use client'
import React, { useEffect, useState } from 'react'

// 실제 백엔드 원본 응답을 흉내 낸 객체(불필요한 내부 필드 포함).
const RAW_BACKEND_RESPONSE = {
  id: 'PROD-101',
  title: '프리미엄 노이즈캔슬링 헤드폰',
  price: 289000,
  thumbnail: 'https://cdn.example.com/prod-101-thumb.jpg',
  internal_audit_trail: Array.from({ length: 20 }, (_, i) => ({
    actor: `admin-${i}`,
    action: 'price_update',
    timestamp: new Date(2026, 0, i + 1).toISOString(),
  })),
  raw_supplier_logs: Array.from({ length: 15 }, (_, i) => `LOG-${i}: supplier sync ok`),
  warehouse_internal_sku: 'WH-INTERNAL-88213-A',
  cost_price_confidential: 210000,
}

function shapeForMobile(raw: typeof RAW_BACKEND_RESPONSE) {
  // 실제 셰이핑 함수: 프론트엔드에 필요한 4개 필드만 선별한다.
  return {
    id: raw.id,
    title: raw.title,
    price: raw.price,
    thumbnail: raw.thumbnail,
  }
}

interface BffResponseShapingDemoProps {
  onMeasure: (rawBytes: number, shapedBytes: number) => void
}

export function BffResponseShapingDemo({ onMeasure }: BffResponseShapingDemoProps) {
  const [measured, setMeasured] = useState<{ rawBytes: number; shapedBytes: number } | null>(null)

  useEffect(() => {
    const shaped = shapeForMobile(RAW_BACKEND_RESPONSE)
    // 실제 JSON 문자열 바이트 길이를 측정한다 — 가정된 수치가 아니다.
    const rawBytes = new TextEncoder().encode(JSON.stringify(RAW_BACKEND_RESPONSE)).length
    const shapedBytes = new TextEncoder().encode(JSON.stringify(shaped)).length
    setMeasured({ rawBytes, shapedBytes })
    onMeasure(rawBytes, shapedBytes)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const reduction = measured ? Math.round((1 - measured.shapedBytes / measured.rawBytes) * 100) : null

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 font-mono text-xs">
      <div className="rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="font-bold text-zinc-500">원본 백엔드 응답 ({Object.keys(RAW_BACKEND_RESPONSE).length}개 필드):</div>
        <div className="text-zinc-400 mt-1">실측 크기: {measured ? `${measured.rawBytes} bytes` : '측정 중...'}</div>
      </div>
      <div className="rounded border border-emerald-300 bg-emerald-50/50 p-3 dark:border-emerald-950 dark:bg-emerald-950/20">
        <div className="font-bold text-emerald-900 dark:text-emerald-300">BFF 정제 (4개 필드):</div>
        <div className="text-emerald-600 dark:text-emerald-400 mt-1">
          실측 크기: {measured ? `${measured.shapedBytes} bytes` : '측정 중...'}
          {reduction !== null && ` (${reduction}% 감축, 실측값)`}
        </div>
      </div>
    </div>
  )
}
