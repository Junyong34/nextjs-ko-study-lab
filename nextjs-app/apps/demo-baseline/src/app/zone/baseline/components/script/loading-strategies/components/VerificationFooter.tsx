'use client'
import React from 'react'
import { DemoDeepDiveCard, ExpectedActualPanel } from '@study/demo-kit'
import type { ScriptLoadEvent } from '../types'

export interface VerificationFooterProps {
  hydratedAt: number | null
  events: ScriptLoadEvent[]
  workerTimedOut: boolean
}

function findEvent(events: ScriptLoadEvent[], strategy: ScriptLoadEvent['strategy']) {
  return events.find((e) => e.strategy === strategy) ?? null
}

export function VerificationFooter({ hydratedAt, events, workerTimedOut }: VerificationFooterProps) {
  const before = findEvent(events, 'beforeInteractive')
  const after = findEvent(events, 'afterInteractive')
  const lazy = findEvent(events, 'lazyOnload')
  const worker = findEvent(events, 'worker')

  const coreCaptured = hydratedAt !== null && before !== null && after !== null && lazy !== null
  const beforeRanBeforeHydration = coreCaptured ? before!.loadedAt < hydratedAt! : undefined
  const afterRanAfterHydration = coreCaptured ? after!.loadedAt >= hydratedAt! : undefined
  const orderCorrect = coreCaptured ? before!.loadedAt < after!.loadedAt && after!.loadedAt < lazy!.loadedAt : undefined
  const workerResolved = workerTimedOut || worker !== null
  const workerBehavedAsDocumented = workerResolved ? worker === null : undefined

  const isMatched =
    coreCaptured && workerResolved
      ? Boolean(beforeRanBeforeHydration && afterRanAfterHydration && orderCorrect && workerBehavedAsDocumented)
      : undefined

  // ExpectedActualPanel은 isMatched가 undefined일 때 expected/actual이 둘 다 string이면
  // 문자열 내용을 그대로 비교해 "불일치"로 오판정한다(공유 컴포넌트 자체 로직, 수정 대상 아님).
  // "대기 중" 3단 상태를 올바르게 보여주기 위해 텍스트를 <> 프래그먼트로 감싸 그 자동비교 분기를 우회한다.
  const expectedText = [
    'beforeInteractive 프로브는 하이드레이션 완료(useEffect 최초 실행) 이전에 로드되어야 함',
    'afterInteractive 프로브는 하이드레이션 완료 이후 로드되어야 함(기본 전략)',
    '실제 로드 순서는 beforeInteractive → afterInteractive → lazyOnload 순이어야 함',
    'worker 전략은 이 앱(App Router, Partytown 미구성)에서 실행되지 않아야 함 — 공식 문서가 "아직 App Router에서 동작하지 않음"이라 명시',
  ].join('\n')
  const expected = <>{expectedText}</>

  const actualText = coreCaptured
    ? [
        `beforeInteractive t=${before!.loadedAt.toFixed(1)}ms · hydration t=${hydratedAt!.toFixed(1)}ms → ${
          beforeRanBeforeHydration ? '하이드레이션보다 먼저 로드됨' : '하이드레이션보다 늦게 로드됨(불일치)'
        }`,
        `afterInteractive t=${after!.loadedAt.toFixed(1)}ms → ${afterRanAfterHydration ? '하이드레이션 이후 로드됨' : '하이드레이션 이전에 로드됨(불일치)'}`,
        `lazyOnload t=${lazy!.loadedAt.toFixed(1)}ms → 로드 순서: ${orderCorrect ? 'beforeInteractive < afterInteractive < lazyOnload 확인됨' : '기대 순서와 불일치'}`,
        `worker: ${
          !workerResolved
            ? `측정 중 (최대 4초 대기)`
            : worker
              ? `⚠ 실행 이벤트 수신됨 t=${worker.loadedAt.toFixed(1)}ms — 공식 문서의 "App Router 미지원" 설명과 다르게 동작함`
              : '4초 대기 후에도 로드 이벤트 미수신 → 실행되지 않음이 실측으로 확인됨(문서와 일치)'
        }`,
      ].join('\n')
    : '상호작용 대기 중 (페이지 로드 직후 자동으로 측정이 시작됩니다. 위 실습 화면의 타임라인을 확인해 주세요.)'
  const actual = <>{actualText}</>

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="strategy별 실제 로드 시각 · 하이드레이션 선후 관계 검증"
        expected={expected}
        actual={actual}
        isMatched={isMatched}
        description="이 패널은 실습 화면과 동일한 실측 performance.now() 타임스탬프를 근거로, beforeInteractive/afterInteractive/lazyOnload의 로드 순서가 하이드레이션 완료 시점과 공식 문서가 설명하는 관계를 실제로 만족하는지, 그리고 worker 전략이 이 앱에서 실행되지 않는다는 문서의 경고가 실측으로도 확인되는지 검증합니다."
      />
      <DemoDeepDiveCard title="next/script 로딩 전략 (beforeInteractive / afterInteractive / lazyOnload / worker)">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>next/script</code>의 <code>strategy</code> prop은 서드파티 스크립트가 <strong>언제</strong> 다운로드·실행될지를
              선언적으로 제어합니다. <code>beforeInteractive</code>는 서버가 내려준 초기 HTML에 직접 주입되어 Next.js 코드보다
              먼저 실행되고, <code>afterInteractive</code>(기본값)는 하이드레이션이 일부/전부 끝난 뒤, <code>lazyOnload</code>는
              모든 리소스 로드가 끝난 브라우저 유휴 시간에 실행됩니다. <code>worker</code>는 Partytown을 통해 웹 워커로
              오프로딩하는 실험적 전략입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 이 데모의 동작 원리</h5>
            <p>
              4개 strategy 각각으로 이 데모 전용 <code>timing-script</code> Route Handler(순수 로컬 JS, 외부 CDN 아님)를 동시에
              로드합니다. 각 프로브는 실행되는 즉시 <code>performance.now()</code>와 <code>document.readyState</code>를
              커스텀 이벤트로 방출하고, 별도로 이 페이지의 첫 <code>useEffect</code> 실행 시각을 하이드레이션 완료 시각으로
              기록합니다. 위 실습 화면의 타임라인은 이 실측값들을 발생한 순서 그대로 나열한 것이며, 순서를 미리 정해 두지
              않습니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>메인 스레드 경합 최소화</strong>: 중요도가 낮은 스크립트를 유휴 시간으로 미뤄 INP/TBT를 줄입니다.</li>
              <li><strong>중복 로드 자동 방지</strong>: 같은 <code>id</code>/<code>src</code>의 스크립트는 한 번만 실행되도록 Next.js가 캐시합니다(이 데모의 새로고침이 필요한 이유).</li>
              <li><strong>필수 스크립트의 실행 우선순위 보장</strong>: 봇 감지·인증처럼 늦으면 안 되는 스크립트만 <code>beforeInteractive</code>로 격상할 수 있습니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 실무 주의사항 및 핵심 팁 (Caution &amp; Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>beforeInteractive 배치 위치</strong>: 공식 문서는 루트 <code>app/layout.tsx</code> 배치를 권장합니다(사이트 전체에 필요한 스크립트용). 이 데모는 작업 범위가 이 라우트 디렉터리로 제한돼 있어 같은 세그먼트의 페이지 트리에 배치했으며, head 우선 주입·hydration 비차단이라는 핵심 동작은 이 위치에서도 동일하게 관찰됩니다.</li>
              <li><strong>onLoad는 beforeInteractive와 함께 쓸 수 없음</strong>: 공식 문서 경고에 따라 이 데모는 모든 strategy에 대해 <code>onLoad</code> prop 대신 <code>window</code> 커스텀 이벤트로 통일해 실측했습니다.</li>
              <li><strong>worker는 App Router 미지원</strong>: 공식 문서가 "아직 App Router에서 동작하지 않는다"고 명시합니다. <code>next/script</code> 클라이언트 소스(<code>node_modules/next/dist/client/script.js</code>)를 실제로 추적해보면, App Router 렌더 경로는 <code>beforeInteractive</code>(preload + 조기 실행 큐잉)와 <code>afterInteractive</code>(preload)만 처리하고 <code>worker</code>는 어떤 분기에도 걸리지 않습니다. 그 결과 <code>experimental.nextScriptWorkers</code>를 켜지 않은 이 앱에서는 worker 스크립트에 대한 preload도, 네트워크 요청도 아예 발생하지 않습니다 — 위 타임라인의 미실행 확정이 이 사실을 그대로 보여줍니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
