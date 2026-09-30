'use client'

import React from 'react'
import { DemoPlaygroundCard, DemoResetButton, ExpectedActualPanel } from '@study/demo-kit'
import { useBailoutProbe } from '../hooks/useBailoutProbe'
import { judge } from '../expectations'
import type { ProbeTarget } from '../types'
import { ProbeCard } from './ProbeCard'
import { ConceptCard } from './ConceptCard'

const TARGET_LABEL: Record<ProbeTarget, string> = {
  existing: '재고 파일 package.json (있음)',
  missing: 'no-such-file.csv (없음)',
}
const BTN =
  'rounded bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900'

export function BailoutLab() {
  const { pathname, target, setTarget, results, run, reset } = useBailoutProbe()
  const verdict = judge(results.node, results.edge, target)
  const list = (items: string[]) => (
    <ul className="space-y-1 font-mono text-[11px]">
      {items.map((t) => (
        <li key={t}>• {t}</li>
      ))}
    </ul>
  )

  return (
    <>
      <DemoPlaygroundCard title={`같은 fs 코드를 ${pathname}/node · /edge 로 실행`}>
        <div className="space-y-3 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-xs font-semibold" htmlFor="probe-target">읽을 재고 파일</label>
            <select
              id="probe-target"
              value={target}
              onChange={(e) => setTarget(e.target.value as ProbeTarget)}
              className="rounded border border-zinc-300 bg-white px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-900"
            >
              {(Object.keys(TARGET_LABEL) as ProbeTarget[]).map((t) => (
                <option key={t} value={t}>{TARGET_LABEL[t]}</option>
              ))}
            </select>
            <button type="button" className={BTN} onClick={() => run('node')}>Node.js 라우트 호출</button>
            <button type="button" className={BTN} onClick={() => run('edge')}>Edge 라우트 호출</button>
            <DemoResetButton onReset={reset} className="ml-auto" />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ProbeCard title="node/route.ts" runtime="nodejs" result={results.node} />
            <ProbeCard title="edge/route.ts" runtime="edge" result={results.edge} />
          </div>
        </div>
      </DemoPlaygroundCard>
      <ExpectedActualPanel
        title="Edge에서 Node 전용 모듈(fs) 차단 검증"
        expected={list(verdict.expected)}
        actual={list(verdict.actual)}
        isMatched={verdict.isMatched}
        description={verdict.description}
      />
      <ConceptCard />
    </>
  )
}
