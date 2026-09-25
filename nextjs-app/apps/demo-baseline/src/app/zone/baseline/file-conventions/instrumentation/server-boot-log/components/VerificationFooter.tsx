'use client'

import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import type { BootSnapshotResponse, ServerBootLogSnapshot } from '../types'

export interface VerificationFooterProps {
  /** page.tsx가 서버 렌더링 시점에 직접 읽은 부팅 스냅샷 (항상 존재) */
  ssrSnapshot: ServerBootLogSnapshot
  /** 클라이언트가 GET /api/boot-snapshot을 호출해 받아온 마지막 응답 (호출 전에는 null) */
  fetchedSnapshot: BootSnapshotResponse | null
}

export function VerificationFooter({ ssrSnapshot, fetchedSnapshot }: VerificationFooterProps) {
  const hasFetched = fetchedSnapshot !== null

  // register()가 정확히 1회만 실행됐다면: (1) SSR 값과 API 응답의 bootedAt·registerCallCount가
  // 완전히 같아야 하고 (2) registerCallCount 자체가 1이어야 한다. 셋 중 하나라도 깨지면 register()가
  // 재실행됐거나 다른 프로세스가 응답한 것이므로 명확한 불일치로 판정한다.
  const isMatched = hasFetched
    ? fetchedSnapshot.bootedAt === ssrSnapshot.bootedAt &&
      fetchedSnapshot.registerCallCount === ssrSnapshot.registerCallCount &&
      fetchedSnapshot.registerCallCount === 1
    : undefined

  const expected =
    '• register()는 새 서버 인스턴스가 시작될 때 정확히 1회만 호출된다\n' +
    '• 따라서 registerCallCount === 1 이며, SSR 렌더와 API 재요청 사이에서 bootedAt이 절대 달라지지 않는다\n' +
    '• 페이지 새로고침(F5)이나 router.refresh()로 Server Component가 다시 렌더링돼도 register()는 다시 실행되지 않는다'

  const actual = !hasFetched
    ? '• [서버에 요청 보내기]를 눌러 API 응답을 받아오면 SSR 값과 실시간으로 대조합니다.'
    : `• SSR bootedAt: ${ssrSnapshot.bootedAt} (registerCallCount=${ssrSnapshot.registerCallCount})\n` +
      `• API bootedAt: ${fetchedSnapshot.bootedAt} (registerCallCount=${fetchedSnapshot.registerCallCount})\n` +
      `• API requestCount: ${fetchedSnapshot.requestCount} (요청마다 증가 — register()의 registerCallCount와는 별개 값)\n` +
      `• 판정: ${isMatched ? 'bootedAt·registerCallCount 완전 일치, register()는 1회만 실행됨' : 'bootedAt 또는 registerCallCount 불일치 감지'}`

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="instrumentation.ts register() 단일 실행 검증"
        expected={expected}
        actual={actual}
        isMatched={isMatched}
        description="서버 렌더링(page.tsx)이 직접 읽은 부팅 스냅샷과, 별도의 Route Handler(/api/boot-snapshot)가 같은 프로세스에서 읽은 값을 실시간으로 대조합니다."
      />
      <DemoDeepDiveCard title="instrumentation.ts register() 및 서버 부팅 라이프사이클">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>src/instrumentation.ts</code>가 내보내는 <code>register()</code> 함수는 새 Next.js 서버
              인스턴스가 기동될 때 <strong>정확히 한 번</strong> 호출되며, 서버가 요청을 처리할 준비가 되기 전에
              완료돼야 한다. 요청 처리(렌더링, Route Handler, Server Action) 횟수와는 무관하게 단 1회다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              이 데모는 <code>register()</code> 안에서 부팅 시각·PID·Node 버전과 호출 횟수를 <code>globalThis</code>
              싱글턴에 기록한다. <code>page.tsx</code>는 서버 렌더링마다 이 값을 직접 읽어 표시하고,
              <code>/api/boot-snapshot</code> Route Handler는 같은 프로세스에서 동일한 값을 별도로 읽어 응답한다.
              두 경로가 언제 어떻게 호출되든 <code>bootedAt</code>과 <code>registerCallCount</code>가 서로
              같다는 사실이 곧 &quot;서버 부팅 시 1회만 실행&quot;의 실측 증거다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>서버 생명주기 1회 실행 보장</strong>: 다중 요청·렌더링과 무관하게 초기화 로직을 안전하게 한 번만 수행한다.</li>
              <li><strong>OpenTelemetry 표준 연계</strong>: <code>registerOTel()</code> 등 APM SDK 초기화를 프레임워크 레벨에서 바인딩한다.</li>
              <li><strong>런타임 분기 안전성</strong>: <code>process.env.NEXT_RUNTIME</code>으로 Node.js/Edge 전용 초기화를 안전하게 나눌 수 있다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>OpenTelemetry / Sentry / Datadog 등 분산 트레이싱 SDK 초기화</li>
              <li>서버 부팅 시 DB 커넥션 풀 웜업, 필수 환경변수 존재 여부 사전 검증(Fail-Fast)</li>
              <li><code>onRequestError</code>와 함께 서버 렌더링·Route Handler·Server Action 에러를 전역 캡처</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>재검증 방법</strong>: dev 서버를 재시작(<code>next dev</code> 재실행)해야 <code>register()</code>가 다시 호출되고 bootedAt이 새로 찍힌다. 페이지 새로고침만으로는 재현되지 않는다.</li>
              <li><strong>배치 위치</strong>: <code>src</code> 디렉토리를 쓰면 <code>src/instrumentation.ts</code>, 아니면 루트 <code>instrumentation.ts</code>에 둬야 인식된다.</li>
              <li><strong>Edge 런타임</strong>: Edge에서도 <code>register()</code>가 호출되지만 별도 워커 프로세스라 이 데모의 Node.js 스냅샷과 값이 공유되지 않는다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
