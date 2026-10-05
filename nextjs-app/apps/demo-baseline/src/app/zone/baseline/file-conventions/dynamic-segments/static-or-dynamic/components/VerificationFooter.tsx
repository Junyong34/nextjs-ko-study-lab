'use client'

import React from 'react'
import { ExpectedActualPanel } from '@study/demo-kit'
import { RUN_MODE, expectedUniqueIds } from '../probe'
import { ROUTES, SAMPLES_PER_ROUTE } from '../routes'
import { useProbe } from './ProbeContext'
import { ConceptCard } from './ConceptCard'

const EXPECTED_BY_MODE = {
  production:
    '• next build 라우트 표: no-gsp/[slug] ƒ, with-gsp/[slug] ● (alpha·beta만 나열), with-headers/[slug] ƒ\n' +
    `• no-gsp/alpha: ${SAMPLES_PER_ROUTE}번 요청 → 렌더 ID ${SAMPLES_PER_ROUTE}개 (런타임 API가 없어도 요청마다 렌더)\n` +
    '• with-gsp/alpha(목록 안): 렌더 ID 1개, x-nextjs-cache HIT\n' +
    '• with-gsp/zeta(목록 밖): 첫 요청에 렌더되고 이후 재사용 → 렌더 ID 1개 (첫 요청만 MISS일 수 있음)\n' +
    `• with-headers/alpha: 목록이 있어도 headers()가 있으면 렌더 ID ${SAMPLES_PER_ROUTE}개`,
  development:
    '• next dev는 정적/동적 구분 없이 모든 라우트를 요청마다 렌더링\n' +
    `• 4개 라우트 모두 ${SAMPLES_PER_ROUTE}번 요청 → 렌더 ID ${SAMPLES_PER_ROUTE}개\n` +
    '• ○/●/ƒ 차이는 next build && next start에서만 실측됨',
}

export function VerificationFooter() {
  const { results, running } = useProbe()
  const done = !running && results.length === ROUTES.length
  const isMatched = done ? results.every((r) => r.ok) : undefined

  const actual =
    results.length === 0
      ? `• 아직 실측하지 않았습니다. 위 [각 라우트를 ${SAMPLES_PER_ROUTE}번씩 실제 요청] 버튼을 누르세요.`
      : results
          .map((r) => {
            const s = r.samples[0]
            const ids = r.samples.map((x) => x.renderId ?? '없음').join(', ')
            return [
              `[/${r.route.path}] 고유 렌더 ID ${r.uniqueIds}개 / 기대 ${expectedUniqueIds(r.route, RUN_MODE, r.samples.length)}개 → ${r.ok ? '일치' : '불일치'}`,
              `  ID: ${ids}`,
              `  첫 요청 x-nextjs-cache=${s.xNextjsCache ?? '없음'} · cache-control=${s.cacheControl ?? '없음'}`,
            ].join('\n')
          })
          .join('\n')

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title={`[slug] 라우트의 렌더 시점 (현재 ${RUN_MODE})`}
        expected={<>{EXPECTED_BY_MODE[RUN_MODE]}</>}
        actual={<>{actual}</>}
        isMatched={isMatched}
        description="기대값은 실행 모드에 따라 달라집니다. 판정은 실제로 받은 HTML 안의 렌더 ID가 몇 종류인지로만 하고, 헤더는 근거로 함께 표시합니다."
      />
      <ConceptCard />
    </div>
  )
}
