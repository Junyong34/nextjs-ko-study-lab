'use client'
import React from 'react'
import { ExpectedActualPanel } from '@study/demo-kit'
import type { HopRecord, ProbeRun } from '../types'
import { HOP_ORDER, isViaShell, judgeHop, judgeProbes, type Check } from '../lib/judge'
import { CrossZoneDeepDive } from './CrossZoneDeepDive'

interface Props {
  run: ProbeRun | null
  hops: HopRecord[]
}

const EXPECTED = (
  <ul className="list-disc space-y-1 pl-4">
    <li>셸 origin에서 /demo/...는 셸이, /zone/baseline/...은 baseline zone이, /zone/cache/...는 cache zone이 응답한다 (script 접두사 /_next/ · /demo-static/baseline/ · /demo-static/cache/).</li>
    <li>cache zone의 정적 자산 /demo-static/cache/_next/...도 같은 origin에서 200으로 받는다.</li>
    <li>같은 zone: &lt;Link&gt;는 문서를 유지한 채 이동하고, &lt;a&gt;는 새 문서를 로드한다.</li>
    <li>zone 경계: &lt;Link&gt;의 soft navigation은 cache zone 화면에 도달하지 못하고, &lt;a&gt;는 새 문서로 cache zone 화면에 도착한다.</li>
  </ul>
)

const MARK = (ok: Check['ok']) => (ok === true ? '✅' : ok === false ? '❌' : ok === null ? '판정 불가' : '대기')

export function VerificationFooter({ run, hops }: Props) {
  const shell = isViaShell(run)
  const probeChecks = run ? judgeProbes(run) : []
  const hopChecks = HOP_ORDER.map((k) => judgeHop(k, hops.find((h) => h.kind === k), shell))
  const checks = [...probeChecks, ...hopChecks]
  const complete = run !== null && hopChecks.every((c) => c.ok !== undefined)

  // 하나라도 어긋나면 불일치. 모두 측정됐고 셸 경유라 판정 불가 항목이 없을 때만 검증 완료.
  let isMatched: boolean | undefined
  if (checks.some((c) => c.ok === false)) isMatched = false
  else if (complete && checks.every((c) => c.ok === true)) isMatched = true

  const actual =
    checks.length === 0 || (!run && hops.length === 0) ? (
      '• 대기 중: [같은 origin 응답 측정]을 실행하고, iframe의 링크 4개를 하나씩 눌러 보세요.'
    ) : (
      <ul className="space-y-1">
        {!run && <li>대기: [같은 origin 응답 측정]을 아직 실행하지 않았습니다.</li>}
        {checks.map((c) => (
          <li key={c.id}>
            {MARK(c.ok)} {c.label}
            <div className="break-all pl-5 text-[11px] text-zinc-500">{c.detail}</div>
          </li>
        ))}
        {shell === false && (
          <li className="text-amber-600">
            이 문서는 baseline zone에 직접 열려 있어 셸 경유 항목은 판정할 수 없습니다. 셸 주소의 /zone/baseline/... 경로로 열면 전체 항목이 판정됩니다.
          </li>
        )}
      </ul>
    )

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="셸 → zone rewrites 라우팅 검증 결과"
        expected={EXPECTED}
        actual={actual}
        isMatched={isMatched}
        description={
          shell === false
            ? 'baseline zone 직접 접속이라 셸 경유 항목이 판정 불가여서 전체 판정을 보류합니다.'
            : '같은 origin에 보낸 실제 응답(상태·헤더·script 접두사)과 iframe 문서의 timeOrigin·주소로만 판정합니다.'
        }
      />
      <CrossZoneDeepDive />
    </div>
  )
}
