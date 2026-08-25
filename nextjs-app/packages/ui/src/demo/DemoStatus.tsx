import React from 'react'
import { CheckCircle2, Clock } from 'lucide-react'
import { StatusBadge } from '../primitives/Badge'

/** `done`이면 체크, 아니면 시계. 세 화면이 같은 규칙을 각자 쓰고 있었다. */
export function DemoStatusIcon({ status }: { status: string }) {
  return status === 'done' ? (
    <CheckCircle2 className="h-3 w-3" />
  ) : (
    <Clock className="h-3 w-3" />
  )
}

/** 아이콘까지 붙인 상태 배지. done 상태는 기본적으로 숨기고 예외 상태(wip, draft 등)만 표시합니다. */
export function DemoStatusBadge({ status, showDone = false }: { status: string; showDone?: boolean }) {
  if (status === 'done' && !showDone) {
    return null
  }
  return <StatusBadge status={status} variant="pill" icon={<DemoStatusIcon status={status} />} />
}
