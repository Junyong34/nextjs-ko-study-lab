'use client'

import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import type { ServerFilterResult } from '../types'

interface StartTransitionVerificationProps {
  hasInteracted: boolean
  isPending: boolean
  selected: string
  result: ServerFilterResult
  clickCount: number
}

export function StartTransitionVerification({
  hasInteracted,
  isPending,
  selected,
  result,
  clickCount,
}: StartTransitionVerificationProps) {
  // Next.js는 클라이언트당 Server Action을 순차 디스패치하므로, 트랜지션이 끝나면
  // 마지막으로 클릭한 카테고리(selected)와 서버 응답 카테고리(result.category)는 항상 같아야 한다.
  const isMatched = !hasInteracted || isPending ? undefined : selected === result.category

  const expected =
    '탭 클릭 → isPending=true → 4000ms 후 isPending=false 전환\n선택한 카테고리(selected)와 서버 응답 카테고리(result.category)가 일치'

  const actual = !hasInteracted
    ? '아직 카테고리 탭을 클릭하지 않았습니다. 위 실습 화면에서 탭을 눌러보세요.'
    : isPending
      ? `isPending = true (트랜지션 처리 중, 클릭 ${clickCount}회째)`
      : `isPending = false / selected = "${selected}" / result.category = "${result.category}" / 지연 ${result.serverLatencyMs}ms (총 클릭 ${clickCount}회)`

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="startTransition 상태 전이 및 서버 응답 일치 검증"
        expected={expected}
        actual={actual}
        isMatched={isMatched}
        description="카테고리 탭을 클릭해 startTransition을 트리거하면, isPending이 실제로 true→false로 전이되고 selected와 result.category가 일치하는지 실시간으로 대조합니다."
      />
      <DemoDeepDiveCard title="startTransition 프로그래밍 방식 Server Action 호출 & 트랜지션 우선순위">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>startTransition</code> 및 <code>useTransition</code>은 <code>{'<'}form{'>'}</code> 요소 없이도 버튼 클릭(<code>onClick</code>)이나 커스텀 이벤트 핸들러에서 Server Action을 프로그래밍 방식으로 실행하고, 서버 통신 및 RSC 리렌더링을 비차단(Non-blocking) 백그라운드 트랜지션으로 스케줄링하는 React 19 표준 API입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 [전자기기] · [의류] · [도서] 카테고리 탭 클릭 시 <code>startTransition(async () ={'>'} {'{'} const res = await filterCategoryProductsAction(cat); setResult(res) {'}'})</code>을 호출합니다. <code>isPending</code> 플래그가 활성화되어 4000ms 동안 파란색 안내 문구가 표시되는 사이에도, 바로 아래 논블로킹 입력창에 자유롭게 타이핑할 수 있습니다 — 메인 스레드가 서버 응답을 기다리며 멈추지 않는다는 뜻입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>UI 반응성 보장(INP 최적화)</strong>: 네트워크 응답 대기 중에도 메인 스레드가 멈추지 않아 인터랙션 응답 지연(Interaction to Next Paint)을 최소화합니다.</li>
              <li><strong>선언적 Pending 상태 관리</strong>: 별도의 <code>useState(isLoading)</code> 보일러플레이트 없이 <code>isPending</code> 불리언 값으로 탭 상태 표시를 자동 제어합니다.</li>
              <li><strong>폼 없는 자유로운 제어</strong>: 단일 버튼, 드롭다운 변경, 탭 전환 등 복잡한 폼 래핑 없이도 깔끔하게 Server Action을 트리거합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>이 데모처럼 탭·필터 클릭으로 서버 데이터를 다시 조회하는 목록 UI</li>
              <li>장바구니 수량 증감(+/-) 버튼 클릭 시 서버 재고 확인 및 금액 갱신</li>
              <li>다크모드/알림 수신 여부 등 사용자 환경설정 스위치 토글의 즉시 서버 저장</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>React 19 비동기 지원</strong>: React 19부터 <code>startTransition</code> 내에서 <code>async/await</code> 비동기 함수를 직접 전달할 수 있습니다(React 18의 동기 전용 제약 해결).</li>
              <li><strong>클라이언트 순차 디스패치</strong>: Next.js는 클라이언트당 Server Action을 한 번에 하나씩 디스패치합니다. 탭을 연속으로 빠르게 클릭해도 응답은 항상 마지막 클릭 순서와 일관되게 도착하며, 위 검증 패널의 selected와 result.category가 그 일관성을 실시간으로 보여줍니다.</li>
              <li><strong>에러 바운더리 연동</strong>: Server Action 내부에서 예외가 발생하면 <code>startTransition</code>이 속한 가장 가까운 React Error Boundary로 에러가 전파됩니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
