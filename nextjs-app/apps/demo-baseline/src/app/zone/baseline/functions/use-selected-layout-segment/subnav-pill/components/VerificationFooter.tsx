'use client'

import React, { useEffect, useRef, useState } from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import { SUBNAV_TABS } from '../types'

export function VerificationFooter({ segment }: { segment: string | null }) {
  const prevSegmentRef = useRef<string | null | undefined>(undefined)
  const [prevSegment, setPrevSegment] = useState<string | null>(null)
  const [transitionCount, setTransitionCount] = useState(0)

  useEffect(() => {
    const prev = prevSegmentRef.current
    if (prev !== undefined && prev !== segment) {
      setPrevSegment(prev)
      setTransitionCount((count) => count + 1)
    }
    prevSegmentRef.current = segment
  }, [segment])

  const activeLabel = SUBNAV_TABS.find((tab) => tab.segment === segment)?.label ?? String(segment)
  const hasNavigated = transitionCount > 0
  const isMatched = hasNavigated ? prevSegment !== segment : undefined

  const formatSegment = (value: string | null) => (value === null ? 'null' : `"${value}"`)

  const expected =
    '• 다른 서브내비 탭을 클릭하면 useSelectedLayoutSegment()의 반환값이 실제로 바뀌어야 함\n• 기본 경로([개요])에서는 문자열이 아니라 null이 반환돼야 함'

  const actual = hasNavigated
    ? `• 실제 세그먼트 전환 감지 횟수: ${transitionCount}회\n• 직전 반환값: ${formatSegment(prevSegment)}\n• 현재 반환값: ${formatSegment(segment)} (${activeLabel})\n• 두 값이 서로 다름 → useSelectedLayoutSegment()가 가짜 state가 아니라 실제 라우트 세그먼트 변화에 반응함`
    : `• 현재 반환값: ${formatSegment(segment)} (${activeLabel})\n• 아직 다른 탭으로 이동하지 않았습니다. 위에서 [상세 스펙], [리뷰] 등 다른 탭을 클릭해 반환값이 바뀌는지 확인하세요.`

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="useSelectedLayoutSegment() 하위 탭 인디케이터 검증 결과"
        expected={<>{expected}</>}
        actual={<>{actual}</>}
        isMatched={isMatched}
        description="탭을 이동할 때마다 useSelectedLayoutSegment()의 실제 반환값이 바뀌는지, 그리고 기본 경로에서 null을 반환하는지 검증합니다."
      />
      <DemoDeepDiveCard title="useSelectedLayoutSegment() 단일 활성 세그먼트 인디케이터">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>useSelectedLayoutSegment()</code> (<code>next/navigation</code>)는 이 훅이 호출된
              레이아웃 바로 한 단계 아래의 활성화된 단일 라우트 세그먼트 이름을 문자열(또는{' '}
              <code>null</code>)로 반환하는 Client Component 전용 훅입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              이 데모는 상품 상세 <code>layout.tsx</code>에서 <code>useSelectedLayoutSegment()</code>를
              호출해 <code>/specs</code>, <code>/reviews</code>, <code>/shipping</code> 3개의 실제 서브
              라우트(<code>page.tsx</code>)와 기본 경로(개요)를 감지하고, 서브내비 Pill 버튼 중 반환값과
              일치하는 탭에만 활성 스타일을 입힙니다. 상위 <code>layout.tsx</code>는 리마운트되지 않고{' '}
              <code>{'{children}'}</code> 슬롯의 페이지만 교체됩니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>
                <strong>단일 단계 정밀 타겟팅</strong>: 전체 경로를 파싱하지 않고 바로 직하위 세그먼트
                이름만 단일 문자열로 추출하여 탭 UI 구현 코드가 간결해집니다.
              </li>
              <li>
                <strong>병렬 라우트 슬롯 지원</strong>: <code>useSelectedLayoutSegment(&apos;slotName&apos;)</code>{' '}
                인수를 통해 특정 <code>@slot</code>의 활성 세그먼트도 조회할 수 있습니다.
              </li>
              <li>
                <strong>하위 깊이 격리</strong>: 이 레이아웃보다 더 깊은 중첩 경로로 이동해도 직하위
                세그먼트(<code>specs</code> 등)만 안정적으로 반환합니다.
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>쇼핑몰 상품 상세 페이지의 [개요]/[상세 스펙]/[리뷰]/[배송 안내] 서브내비 탭 인디케이터</li>
              <li>설정 페이지(계정, 알림, 보안)의 직하위 서브 라우트 메뉴 인디케이터</li>
              <li>마이페이지 내 주문/쿠폰/포인트 탭 바의 슬라이딩 액티브 바 위치 계산</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">
              5. 실무 주의사항 및 핵심 팁 (Caution &amp; Tips)
            </h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>
                <strong>루트 세그먼트 null 반환</strong>: 이 데모의 [개요] 탭처럼 레이아웃과 동일한 기본
                경로에 머물러 있는 경우 <code>null</code>을 반환하므로 <code>segment ?? &apos;default&apos;</code>{' '}
                형태의 기본값 처리가 필요합니다.
              </li>
              <li>
                <strong>다중 계층 불가</strong>: 전체 경로의 배열이 필요한 브레드크럼 구현에는{' '}
                <code>useSelectedLayoutSegments()</code>(복수형)을 사용해야 합니다.
              </li>
              <li>
                <strong>호출 위치 제약</strong>: 반드시 감독하려는 라우트 트리의 <code>layout.tsx</code>{' '}
                (또는 그 안에서 렌더링되는 Client Component)에서 호출해야 합니다. 더 하위인{' '}
                <code>page.tsx</code>에서 호출하면 기준점이 그 페이지 자신으로 바뀌어 값이 어긋납니다.
              </li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
