'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import { useNavigationHistoryCheck } from '../hooks/useNavigationHistoryCheck'

const METHOD_LABEL: Record<string, string> = {
  push: 'router.push()',
  replace: 'router.replace()',
  back: 'router.back()',
}

export interface NavigationVerificationFooterProps {
  variant: 'root' | 'complete'
}

export function NavigationVerificationFooter({ variant }: NavigationVerificationFooterProps) {
  const { pathname, entry, historyLengthAfterNav, expectedDelta, actualDelta, isMatched } =
    useNavigationHistoryCheck()

  const expected = entry
    ? `${METHOD_LABEL[entry.method]} 호출 → history.length ${
        expectedDelta === 1 ? '+1 (새 엔트리 추가)' : '변화 없음 (엔트리 추가 없이 이동)'
      }`
    : '• 실습 화면에서 버튼을 눌러 실제 내비게이션을 발생시켜 주세요.'

  const actual =
    entry && historyLengthAfterNav !== null
      ? `history.length: ${entry.historyLengthBeforeNav} → ${historyLengthAfterNav} (Δ${actualDelta})\n실제 도착 URL(usePathname): ${pathname}`
      : `현재 URL(usePathname): ${pathname}\n아직 이 화면으로의 이동 기록이 없습니다.`

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="브라우저 히스토리 스택 실측 검증"
        expected={expected}
        actual={actual}
        isMatched={isMatched}
        description="router.push/replace/back 호출 직전에 기록해 둔 window.history.length와, 도착한 화면에서 다시 측정한 값을 비교합니다. Next.js가 히스토리 엔트리를 실제로 늘렸는지 아닌지를 브라우저 표준 History API로 직접 확인하는 검증입니다."
      />

      {variant === 'root' ? <RootDeepDive /> : <CompleteDeepDive />}
    </div>
  )
}

function RootDeepDive() {
  return (
    <DemoDeepDiveCard title="useRouter push, replace, back 프로그래밍 방식 내비게이션">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
          <p>
            <code>useRouter()</code>(<code>next/navigation</code>)는 클라이언트 컴포넌트(<code>&apos;use client&apos;</code>)
            전용 훅으로, 라우터 인스턴스를 가져와 프로그래밍 방식으로 브라우저 히스토리를 조작합니다.
            <code>router.push(href)</code>는 히스토리 스택에 새 엔트리를 추가하며 이동하고, <code>router.replace(href)</code>는
            새 엔트리를 추가하지 않고 현재 엔트리를 대체하며 이동합니다. <code>router.back()</code>은 스택의 직전
            엔트리로 이동합니다.
          </p>
        </div>

        <div>
          <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 이 데모의 검증 방식</h5>
          <p>
            Next.js는 히스토리 스택의 실제 목록을 JS로 조회하는 API를 제공하지 않습니다. 대신 이 데모는 이동 직전
            <code>window.history.length</code>를 기록해 두고, 도착 화면에서 다시 측정해 <code>push</code>만 그 값을
            1 늘린다는 사실을 브라우저 표준 History API로 직접 관찰합니다.
          </p>
        </div>

        <div>
          <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
          <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
            <li>
              <strong>뒤로가기 루프 방지</strong>: 결제 완료 후 결제 페이지 재진입을 막기 위해 <code>replace()</code>로
              히스토리를 교체해 안전한 내비게이션 플로우를 보장합니다.
            </li>
            <li>
              <strong>SPA 소프트 내비게이션</strong>: 전체 페이지 리로드 없이 변경된 세그먼트만 다시 렌더링해 빠른 화면
              전환을 제공합니다.
            </li>
            <li>
              <strong>프로그래밍 제어 유연성</strong>: 비동기 처리 완료, 인증 콜백 등 조건에 따라 동적으로 이동 경로를
              분기할 수 있습니다.
            </li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주의사항 및 관련 API</h5>
          <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
            <li>
              <strong>서버 컴포넌트 사용 불가</strong>: <code>useRouter</code>는 클라이언트 전용 훅이므로 서버
              컴포넌트에서는 <code>redirect()</code> 함수를 사용해야 합니다.
            </li>
            <li>
              <strong>Link 컴포넌트 우선 원칙</strong>: 단순 링크 이동이라면 자동 prefetch 이점이 있는{' '}
              <code>{'<Link>'}</code> 컴포넌트 사용을 권장합니다.
            </li>
            <li>
              <strong>검증되지 않은 URL 금지</strong>: 신뢰할 수 없는 문자열을 <code>push</code>/<code>replace</code>에
              그대로 전달하면 XSS로 이어질 수 있습니다.
            </li>
            <li>
              <strong>Next.js 16.3.2의 <code>router.bfcacheId</code></strong>: push/replace로 세그먼트가 새로 생성되면
              값이 바뀌고, back/forward·<code>refresh()</code>에서는 유지되는 불투명 식별자입니다. 이 데모의 범위는
              아니지만, 구버전 지식(<code>router.refresh()</code>는 별도 데모에서 다룹니다)과 혼동하지 않도록
              참고합니다.
            </li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}

function CompleteDeepDive() {
  return (
    <DemoDeepDiveCard title="router.replace() vs router.back()">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 왜 이 화면에서 replace를 쓰는가</h5>
          <p>
            이 주문 완료 화면은 <code>router.push()</code>로 도착했으므로 히스토리에 별도 엔트리로 남아 있습니다.
            사용자가 여기서 <strong>[이전 화면으로]</strong>(<code>back()</code>)를 누르면 상품 상세로 돌아가지만,
            주문 완료 엔트리는 스택에 그대로 남아 있어 앞으로 가기(forward)로 다시 돌아올 수 있습니다.
          </p>
        </div>
        <div>
          <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. replace가 다른 점</h5>
          <p>
            <strong>[계속 쇼핑하기]</strong>(<code>replace()</code>)를 누르면 이 완료 화면 엔트리 자체가 상품 상세
            URL로 교체됩니다. 결제·주문 완료처럼 &quot;다시 보여주면 안 되는&quot; 화면을 히스토리에서 지우고
            싶을 때 쓰는 표준 패턴입니다.
          </p>
        </div>
        <div>
          <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무 팁</h5>
          <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
            <li>
              <code>router.push(href, {'{'} scroll: false {'}'})</code>처럼 옵션을 넘기면 이동 후 스크롤을 상단으로
              올리지 않고 현재 위치를 유지할 수 있습니다.
            </li>
            <li>
              결제 승인처럼 서버에서 완결해야 하는 리다이렉트는 서버 컴포넌트/Server Action의{' '}
              <code>redirect()</code>가 담당 영역이며, <code>useRouter</code>는 이미 클라이언트에 도착한 뒤의 후속
              이동을 담당합니다.
            </li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
