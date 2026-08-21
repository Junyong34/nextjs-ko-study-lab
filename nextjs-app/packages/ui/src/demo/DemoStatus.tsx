import React from 'react'
import { CheckCircle2, Clock, Layers } from 'lucide-react'
import { StatusBadge, ZoneBadge } from '../primitives/Badge'

/** `done`이면 체크, 아니면 시계. 세 화면이 같은 규칙을 각자 쓰고 있었다. */
export function DemoStatusIcon({ status }: { status: string }) {
  return status === 'done' ? (
    <CheckCircle2 className="h-3 w-3" />
  ) : (
    <Clock className="h-3 w-3" />
  )
}

/** 아이콘까지 붙인 상태 배지. 데모 색인과 독립 열람이 쓴다. */
export function DemoStatusBadge({ status }: { status: string }) {
  return <StatusBadge status={status} variant="pill" icon={<DemoStatusIcon status={status} />} />
}

/** zone 배지. `sm`은 데모 색인, `md`는 독립 열람의 크기다. */
export function DemoZoneBadge({ zone, size = 'md' }: { zone: string; size?: 'sm' | 'md' }) {
  return <ZoneBadge zone={zone} size={size} icon={<Layers className="h-3 w-3" />} />
}
