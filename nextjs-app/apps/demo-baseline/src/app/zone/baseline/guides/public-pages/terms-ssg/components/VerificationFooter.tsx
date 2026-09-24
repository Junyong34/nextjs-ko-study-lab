'use client'

import React from 'react'
import { ExpectedActualPanel } from '@study/demo-kit'
import { RUN_MODE } from '../probe'
import { PROBE_TARGETS, SAMPLES_PER_TARGET } from '../terms'
import { useProbe } from './ProbeContext'
import { ConceptCard } from './ConceptCard'

const N = SAMPLES_PER_TARGET

const EXPECTED_BY_MODE = {
  production:
    '• next build 라우트 표: documents/[lang]/[version] ●(SSG) + 생성 경로 3개, with-cookies/[version] ƒ\n' +
    `• documents/ko/2025-07 · ko/2026-03 · en/2026-03: ${N}번 모두 200, 렌더 ID 1개\n` +
    '  - 렌더 시각이 실측 시작보다 과거(빌드 시점에 고정)\n' +
    '  - x-nextjs-cache 존재, cache-control에 s-maxage (CDN 공유 캐시 허용)\n' +
    `• documents/ko/2019-01 · en/2025-07: ${N}번 모두 404 (dynamicParams=false)\n` +
    `• with-cookies/2026-03: ${N}번 모두 200, 렌더 ID ${N}개, x-nextjs-cache 없음, cache-control에 no-store`,
  development:
    '• next dev는 사전 생성 여부와 무관하게 page를 요청마다 렌더링\n' +
    `• 200 대상 4개 모두 렌더 ID ${N}개 (빌드 시점 고정은 next start에서만 관찰)\n` +
    `• documents/ko/2019-01 · en/2025-07: ${N}번 모두 404 — dev에서도 generateStaticParams를 호출해 목록 밖 조합을 거절`,
}

export function VerificationFooter() {
  const { results, running } = useProbe()
  const done = !running && results.length === PROBE_TARGETS.length
  const isMatched = done ? results.every((r) => r.ok) : undefined

  const actual =
    results.length === 0
      ? `• 아직 실측하지 않았습니다. 위 [약관 URL을 ${N}번씩 실제 요청] 버튼을 누르세요.`
      : results
          .map((r) => {
            const s = r.samples[0]
            const failed = r.checks.filter((c) => !c.ok).map((c) => c.label)
            return [
              `[${r.target.label}] status ${r.samples.map((x) => x.status).join('/')} · 고유 렌더 ID ${r.uniqueIds}개 → ${r.ok ? '일치' : `불일치 (${failed.join(', ')})`}`,
              s.renderedAt ? `  렌더 시각 ${s.renderedAt} (실측 시작 ${r.probedAt})` : null,
              `  x-nextjs-cache=${s.xNextjsCache ?? '없음'} · cache-control=${s.cacheControl ?? '없음'}`,
            ]
              .filter(Boolean)
              .join('\n')
          })
          .join('\n')

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title={`약관 문서 사전 생성·404·캐시 헤더 (현재 ${RUN_MODE})`}
        expected={<>{EXPECTED_BY_MODE[RUN_MODE]}</>}
        actual={<>{actual}</>}
        isMatched={isMatched}
        description="판정은 브라우저가 실제로 받은 상태 코드, HTML 안의 렌더 ID·렌더 시각, 응답 헤더로만 합니다. 기대값은 실행 모드(next dev / next start)에 따라 달라집니다."
      />
      <ConceptCard />
    </div>
  )
}
