'use client'

import React from 'react'
import { ExpectedActualPanel } from '@study/demo-kit'
import { evaluateProbe } from '../inspect'
import { PROBE_LABELS, type ProbeKind } from '../types'
import { useProbes } from './ProbeContext'
import { ConceptCard } from './ConceptCard'

const REQUIRED: ProbeKind[] = ['server-await', 'client-use']
const ORDER: ProbeKind[] = ['server-await', 'forwarded-use', 'client-use']

const EXPECTED =
  '• server/[sku]와 client/[sku] 양쪽에서 params, searchParams 모두 instanceof Promise === true\n' +
  '• Server page는 await, Client page는 use()로 풀며, 언래핑 결과는 실제 URL과 일치\n' +
  '  - params.sku === URL의 마지막 세그먼트\n' +
  '  - searchParams === URL 쿼리 (중복 키는 배열)\n' +
  '• Server page의 검사 실행 환경은 server, Client 쪽은 browser'

/** 예제 페이지들이 보고한 실측값을 관측 시점의 실제 브라우저 URL과 대조한다. */
export function VerificationFooter() {
  const { observed } = useProbes()
  const kinds = ORDER.filter((kind) => observed[kind])
  const results = kinds.map((kind) => ({ kind, probe: observed[kind]!, eval: evaluateProbe(observed[kind]!) }))

  const hasRequired = REQUIRED.every((kind) => observed[kind])
  const anyFailed = results.some((r) => !r.eval.ok)
  const isMatched = anyFailed ? false : hasRequired ? true : undefined
  const missing = REQUIRED.filter((kind) => !observed[kind]).map((kind) => PROBE_LABELS[kind])

  const actual =
    results.length === 0
      ? '• 아직 관측 기록이 없습니다. 위 링크로 server/[sku] 또는 client/[sku] 라우트로 이동하세요.'
      : [
          ...results.map(({ kind, probe, eval: e }) =>
            [
              `[${PROBE_LABELS[kind]}]`,
              `  URL: ${probe.url.pathname}${Object.keys(probe.url.query).length ? ` ? ${JSON.stringify(probe.url.query)}` : ''}`,
              `  instanceof Promise: params=${probe.report.params.isPromise}, searchParams=${probe.report.searchParams.isPromise}`,
              `  ${probe.report.unwrapApi} 결과: ${JSON.stringify(probe.report.resolvedParams)} / ${JSON.stringify(probe.report.resolvedSearchParams)}`,
              `  검사 환경: ${probe.report.inspectedIn}(일치=${e.envMatch}) · sku 일치=${e.paramsMatch} · 쿼리 일치=${e.queryMatch}`,
            ].join('\n'),
          ),
          missing.length ? `• 남은 관측: ${missing.join(', ')}` : '',
        ]
          .filter(Boolean)
          .join('\n')

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="page props Promise 언래핑 (await vs use()) 검증"
        expected={<>{EXPECTED}</>}
        actual={<>{actual}</>}
        isMatched={isMatched}
        description="각 예제 페이지가 언래핑 전에 검사한 prop의 실제 타입과, 언래핑 결과를 관측 시점의 브라우저 URL과 대조합니다. Server page와 Client page를 모두 방문하면 판정됩니다."
      />
      <ConceptCard />
    </div>
  )
}
