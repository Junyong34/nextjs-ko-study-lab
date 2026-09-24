import React from 'react'
import Link from 'next/link'
import { SCENARIOS } from '../scenarios'

/**
 * 직접 눌러보는 트리거 목록. prefetch={false}로 두어 클릭하는 순간에만 서버 렌더가 일어나게 한다
 * (미리 가져오기로 서버 카운터가 먼저 올라가는 것을 막기 위함).
 */
export function TriggerLinks() {
  const hardScenarios = SCENARIOS.filter((s) => s.mode === 'hard')

  return (
    <div className="space-y-2">
      <h5 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">직접 이동해 보기 (Link 소프트 내비게이션)</h5>
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {hardScenarios.map((s) => (
          <li key={s.key}>
            <Link
              href={s.url}
              prefetch={false}
              className={`block rounded border px-3 py-2 text-xs transition hover:border-zinc-500 ${
                s.expectSite
                  ? 'border-amber-300 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-950/20'
                  : 'border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50'
              }`}
            >
              <span className="block font-semibold text-zinc-900 dark:text-zinc-100">{s.condition} →</span>
              <span className="block font-mono text-[11px] text-zinc-500">호출 위치: {s.where}</span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="text-[11px] text-zinc-500">
        Server Action 트리거는 P-100 상품 화면의 [R-2 수정 열기] 버튼으로 실행합니다. 404 화면의 [← 실습으로 돌아가기]로 복귀하세요.
      </p>
    </div>
  )
}
