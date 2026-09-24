'use client'

import React from 'react'
import { ExpectedActualPanel } from '@study/demo-kit'
import { RUN_MODE, expectedUniqueIds } from '../probe'
import { ROUTES, SAMPLES_PER_ROUTE } from '../routes'
import { useProbe } from './ProbeContext'
import { ConceptCard } from './ConceptCard'

const EXPECTED_BY_MODE = {
  production:
    '• next build 라우트 표: static ○, headers·search-params·connection ƒ\n' +
    `• static/: ${SAMPLES_PER_ROUTE}번 요청해도 렌더 ID 1개 (빌드 때 만든 HTML 재사용)\n` +
    '  - 응답 헤더 x-nextjs-cache / x-nextjs-prerender가 붙고, cache-control은 s-maxage 계열\n' +
    `• 나머지 3개: ${SAMPLES_PER_ROUTE}번 요청 → 렌더 ID ${SAMPLES_PER_ROUTE}개 (요청마다 서버 렌더)\n` +
    '  - x-nextjs-cache 없음, cache-control은 private, no-cache, no-store …',
  development:
    '• next dev는 정적/동적 구분 없이 모든 page를 요청마다 렌더링\n' +
    `• 4개 page 모두 ${SAMPLES_PER_ROUTE}번 요청 → 렌더 ID ${SAMPLES_PER_ROUTE}개\n` +
    '• ○/ƒ 차이는 next build && next start에서만 실측됨',
}

export function VerificationFooter() {
  const { results, running } = useProbe()
  const done = !running && results.length === ROUTES.length
  const isMatched = done ? results.every((r) => r.ok) : undefined

  const actual =
    results.length === 0
      ? `• 아직 실측하지 않았습니다. 위 [각 page를 ${SAMPLES_PER_ROUTE}번씩 실제 요청] 버튼을 누르세요.`
      : results
          .map((r) => {
            const ids = r.samples.map((s) => s.renderId ?? '없음').join(', ')
            const s = r.samples[0]
            return [
              `[${r.route.segment}/ · ${r.route.api}] 고유 렌더 ID ${r.uniqueIds}개 / 기대 ${expectedUniqueIds(r.route, RUN_MODE, r.samples.length)}개 → ${r.ok ? '일치' : '불일치'}`,
              `  ID: ${ids}`,
              `  x-nextjs-cache=${s.xNextjsCache ?? '없음'} · x-nextjs-prerender=${s.xNextjsPrerender ?? '없음'} · cache-control=${s.cacheControl ?? '없음'}`,
            ].join('\n')
          })
          .join('\n')

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title={`page 본문의 런타임 API 사용 여부 → 렌더 시점 (현재 ${RUN_MODE})`}
        expected={<>{EXPECTED_BY_MODE[RUN_MODE]}</>}
        actual={<>{actual}</>}
        isMatched={isMatched}
        description="기대값은 현재 실행 모드(next dev / next start)에 따라 달라집니다. 판정은 실제로 받은 HTML 안의 렌더 ID가 몇 종류인지로만 하며, 헤더는 근거로 함께 표시합니다."
      />
      <ConceptCard />
    </div>
  )
}
