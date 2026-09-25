'use client'

import React from 'react'
import { DemoDeepDiveCard, ExpectedActualPanel } from '@study/demo-kit'
import type { CheckResult } from '../hooks/evaluateChecks'

const EXPECTED = [
  '1) 먼저 선언했어도 늦게 도착한 core-sdk보다 core-plugin이 먼저 실행되어 코어 전역이 없고, onReady 이후 렌더한 chained 플러그인은 코어 뒤에 실행된다.',
  '2) afterInteractive 스크립트는 하이드레이션 이후, lazyOnload 스크립트는 window load 이벤트 이후에 실행된다.',
  '3) 레이아웃의 layout-analytics와 페이지의 core-sdk는 하위 라우트를 오가도 1회만 실행되고, campaign/layout.tsx의 campaign-pixel은 campaign에 들어가기 전까지 요청조차 없다.',
  '4) 같은 id의 src·인라인 스크립트는 슬롯을 몇 번 마운트해도 1회만 실행되고, id 없는 인라인 스크립트는 마운트 횟수만큼 실행된다.',
]

function badge(ok: boolean | undefined) {
  return ok === undefined ? '측정 중' : ok ? '일치' : '불일치'
}

export function VerificationFooter({ checks }: { checks: CheckResult[] }) {
  const pending = checks.some((c) => c.ok === undefined)
  const isMatched = pending ? undefined : checks.every((c) => c.ok)

  // ExpectedActualPanel은 isMatched가 undefined이고 두 값이 문자열이면 문자열 비교로 "불일치"를 띄운다.
  // 측정 중 상태를 올바르게 보이도록 JSX로 감싼다(코드베이스 관례).
  const expected = <>{EXPECTED.join('\n')}</>
  const actual = <>{checks.map((c, i) => `${i + 1}) [${badge(c.ok)}] ${c.label}\n   ${c.detail}`).join('\n')}</>

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="여러 스크립트 실행 순서 · 로드 범위 · 중복 방지 검증"
        expected={expected}
        actual={actual}
        isMatched={isMatched}
        description="모든 판정은 프로브 스크립트가 실행 순간 남긴 performance.now() 기록, 레이아웃의 하이드레이션 시각, Navigation Timing의 loadEventEnd, Resource Timing의 요청 수만 사용합니다. 3번은 campaign → campaign/detail → 루트로 실제 이동한 뒤 다시 확인하세요."
      />
      <DemoDeepDiveCard title="가이드 관점의 next/script 배치 전략">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">1. 핵심 개념</h5>
            <p>
              공식 가이드는 서드파티 스크립트를 <strong>필요한 라우트의 page 또는 layout에만</strong> 두라고 권장합니다. layout에 둔 스크립트는
              그 폴더 라우트와 모든 하위 라우트에서 로드되며, 같은 layout 안에서 이동해도 <strong>한 번만</strong> 로드됩니다. <code>strategy</code>는
              각 스크립트의 시작 시점만 정할 뿐, 같은 strategy 안에서의 실행 순서까지 보장하지는 않습니다.
            </p>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">2. 이 데모의 동작 원리</h5>
            <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
              <li>모든 스크립트는 이 데모 하위 <code>probe</code> Route Handler가 서빙하는 실제 JS입니다(외부 네트워크 없음). core-sdk만 서버가 응답을 실제로 800ms 늦춥니다.</li>
              <li><code>afterInteractive</code>는 하이드레이션 후 useEffect에서 <code>&lt;script&gt;</code>를 동적으로 붙입니다. 동적 삽입 스크립트는 기본이 async라서 <strong>먼저 도착한 것부터</strong> 실행됩니다.</li>
              <li>next/script는 <code>id || src</code>를 키로 로드 완료를 기억하고, 같은 src가 로딩 중이면 새 태그를 만들지 않습니다. 인라인 스크립트는 src가 없어 <code>id</code>가 유일한 추적 키입니다 — 공식 문서가 인라인 스크립트에 id를 요구하는 이유입니다.</li>
              <li><code>lazyOnload</code>는 &ldquo;모든 afterInteractive 다음&rdquo;이 아니라 &ldquo;load 이벤트 뒤 유휴 시간&rdquo;입니다. 타임라인에서 chat-widget(lazyOnload)이 늦게 도착한 core-sdk(afterInteractive)보다 먼저 실행될 수 있고, load 이벤트가 하이드레이션보다 먼저 찍힐 수도 있습니다(Next.js 클라이언트 번들이 async라 load를 막지 않음).</li>
              <li>이 기록은 window에 저장되어 소프트 내비게이션 동안 유지되고, 새로고침하면 next/script 캐시와 함께 초기화됩니다.</li>
            </ul>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">3. 실무 배치 체크리스트</h5>
            <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
              <li><strong>범위</strong>: 전 사이트용은 루트 layout, 특정 섹션용(예: 캠페인 전환 픽셀)은 그 세그먼트 layout, 한 화면용은 page에 둡니다.</li>
              <li><strong>의존 순서</strong>: A에 의존하는 B는 같은 strategy로 나란히 두지 말고, A의 <code>onReady</code>(재마운트에도 호출) 이후에 렌더합니다.</li>
              <li><strong>중복</strong>: 여러 컴포넌트가 같은 SDK를 선언해도 되지만 같은 <code>id</code>를 주고, 인라인 스크립트에는 반드시 <code>id</code>를 붙입니다.</li>
            </ul>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">4. 이 데모에서 실측하지 않는 strategy</h5>
            <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
              <li><code>beforeInteractive</code>: API 레퍼런스상 <strong>루트 layout(app/layout.tsx)에만</strong> 둘 수 있고, 모든 Next.js 코드와 하이드레이션보다 먼저 실행됩니다(하이드레이션을 막지는 않음). 루트 layout은 zone 공유 파일이라 이 데모는 설명만 합니다. strategy별 시점 비교는 &lsquo;next/script 로딩 전략 상세 비교&rsquo; 실습을 참고하세요.</li>
              <li><code>worker</code>: <code>experimental.nextScriptWorkers</code>와 Partytown이 필요한 실험 기능이며, 공식 가이드가 &ldquo;아직 App Router에서 동작하지 않는다&rdquo;고 경고합니다. 이 앱은 해당 플래그를 켜지 않았습니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
