import React from 'react'

/** 검증 패널의 기대/실제 칸에 쓰는 줄 목록. 줄마다 한 가지 관측 항목만 적는다. */
export function Lines({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1">
      {items.map((line) => (
        <li key={line}>{line}</li>
      ))}
    </ul>
  )
}

/** 항목별 판정(true/false/undefined=측정 전)을 하나로 합친다. 하나라도 false면 실패, 전부 true여야 성공. */
export function combine(checks: Array<boolean | undefined>): boolean | undefined {
  if (checks.some((c) => c === false)) return false
  if (checks.every((c) => c === true)) return true
  return undefined
}
