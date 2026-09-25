'use client'

import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import { useTransitionMetrics } from '../hooks/useTransitionMetrics'

const EXPECTED_TEXT =
  '라우트 이동마다 onRouterTransitionStart(url, navigationType, event)가 호출되고, ' +
  '도착한 페이지가 마운트되는 순간까지의 실제 경과 시간(ms)이 기록된다.'

export function VerificationFooter() {
  const { transitions } = useTransitionMetrics()
  const completed = transitions.filter((t) => t.durationMs !== null)
  const latest = completed[0]

  return (
    <div className="space-y-4">
      {/*
        ExpectedActualPanel은 isMatched를 생략하고 expected/actual이 둘 다 문자열이면
        내부적으로 문자열 완전 일치 비교로 자동 판정한다("측정 대기 중" 문구가 expected와
        우연히 달라 "불일치"로 오판정되는 문제). 아직 측정값이 없는 "대기" 상태에서는
        actual에 JSX 엘리먼트를 넘겨 문자열 자동 비교 분기를 타지 않게 하고, 실측값이
        생기면 별도 분기에서 isMatched를 항상 boolean으로 명시한다.
      */}
      {latest ? (
        <ExpectedActualPanel
          title="클라이언트 라우터 전환 실측 검증"
          expected={EXPECTED_TEXT}
          actual={`총 ${completed.length}회 전환 기록 · 최근 전환 "${latest.url}" (${latest.navigationType}) → ${latest.durationMs!.toFixed(1)}ms`}
          isMatched={Number.isFinite(latest.durationMs) && (latest.durationMs as number) >= 0}
          description="상단 실습 화면에서 실제 페이지 이동을 발생시키면 이 패널의 실제 측정값이 갱신됩니다."
        />
      ) : (
        <ExpectedActualPanel
          title="클라이언트 라우터 전환 실측 검증"
          expected={EXPECTED_TEXT}
          actual={
            <span className="text-zinc-400">
              아직 라우터 전환이 발생하지 않았습니다. 실습 화면의 이동 버튼을 눌러주세요.
            </span>
          }
          description="상단 실습 화면에서 실제 페이지 이동을 발생시키면 이 패널의 실제 측정값이 갱신됩니다."
        />
      )}

      <DemoDeepDiveCard title="instrumentation-client.ts & 라우터 전환 실측">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 메커니즘</h5>
            <p>
              <code>instrumentation-client.ts|js</code>는 앱 루트 또는 <code>src</code> 폴더에 두면 Next.js가
              자동으로 인식하는 클라이언트 전용 계측 파일이다. HTML 문서가 로드된 <strong>이후</strong>,
              React hydration이 시작되기 <strong>이전</strong>, 사용자 상호작용이 가능해지기{' '}
              <strong>이전</strong> 시점에 최상위 동기 코드가 실행된다. 이 파일이 내보내는{' '}
              <code>onRouterTransitionStart(url, navigationType, event)</code>는 App Router 내비게이션이
              시작될 때마다 호출되며, 훅 내부 오류는 격리되어 다른 훅이나 실제 내비게이션에 영향을 주지 않는다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 이 데모의 실측 경로</h5>
            <p>
              <code>onRouterTransitionStart</code>는 전환의 <em>시작</em>만 알려주고 종료 시점은 알려주지
              않는다. 그래서 시작 시각은 <code>performance.now()</code>로 전역 스토어(
              <code>window.__clientTimingMetricsDemo</code>)에 기록해 두고, 도착한 라우트의{' '}
              <code>page.tsx</code>가 실제로 마운트되는 순간(<code>useEffect</code>)에{' '}
              <code>recordArrival()</code>을 호출해 종료 시각을 채운다. 두 시각의 차이가 이 데모가
              화면에 보여주는 &ldquo;실측 전환 시간&rdquo;이며, 실제 클릭 → 라우팅 시작 → 새 페이지 렌더링까지
              걸린 브라우저 실측값이지 인위적으로 흉내 낸 지연이 아니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무 이점</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>서드파티 SDK 없이도 코드 몇 줄로 App Router 전환 지연을 RUM(Real User Monitoring) 형태로 수집한다.</li>
              <li>
                <code>next.config.ts</code>의 <code>experimental.instrumentationClientRouterTransitionEvents</code>를
                켜면 세 번째 인자로 <code>event.id</code>, <code>event.timestamp</code>,{' '}
                <code>event.fromRoutes</code>, <code>event.prefetchIntent</code>까지 함께 받을 수 있다. 이
                데모는 zone 공용 <code>next.config.ts</code>를 건드리지 않는 작업 범위 제약상 이 플래그를
                켜지 않았으므로, <code>event</code> 인자는 항상 <code>null</code>로 수신된다(코드에 반영됨).
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주의사항</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>동기 최상위 코드만 hydration 전 완료가 보장된다. 여기서 시작한 Promise·동적 import는 실행 후 잊혀지는(fire-and-forget) 작업으로 취급해야 한다.</li>
              <li>Next.js는 개발 모드에서 초기화가 16ms를 넘기면 경고를 남긴다 — 계측 코드는 가볍게 유지한다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
