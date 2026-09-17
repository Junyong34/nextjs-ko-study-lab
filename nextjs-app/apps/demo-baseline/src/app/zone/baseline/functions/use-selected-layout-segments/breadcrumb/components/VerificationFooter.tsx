'use client'

import React, { useEffect, useRef, useState } from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

const EXPECTED_DEPTHS = [0, 2, 3]

export function VerificationFooter({ segments }: { segments: string[] }) {
  const [visitedDepths, setVisitedDepths] = useState<number[]>([])
  const prevKeyRef = useRef<string | undefined>(undefined)

  useEffect(() => {
    const key = JSON.stringify(segments)
    if (prevKeyRef.current === key) return
    prevKeyRef.current = key
    setVisitedDepths((prev) => (prev.includes(segments.length) ? prev : [...prev, segments.length].sort((a, b) => a - b)))
  }, [segments])

  const hasNavigated = visitedDepths.length > 0
  const hasAllDepths = EXPECTED_DEPTHS.every((depth) => visitedDepths.includes(depth))
  const isMatched = hasNavigated ? hasAllDepths : undefined

  const expected =
    '• 기본 경로에서는 빈 배열(길이 0)이 반환돼야 함\n' +
    '• 카테고리 목록(.../category/[category])에서는 길이 2의 배열이 반환돼야 함\n' +
    '• 상품 상세(.../category/[category]/[id])에서는 길이 3의 배열이 반환돼야 함'

  const actual = hasNavigated
    ? `• 지금까지 실제로 관찰된 배열 길이: [${visitedDepths.join(', ')}]\n` +
      `• 현재 반환값: ${JSON.stringify(segments)} (길이 ${segments.length})\n` +
      `• ${hasAllDepths ? '0, 2, 3 세 깊이를 모두 방문함 → 깊이가 깊어질수록 배열이 실제로 길어짐을 확인' : '아직 방문하지 않은 깊이가 있음 — 카테고리와 상품 상세를 모두 이동해 보세요.'}`
    : `• 현재 반환값: ${JSON.stringify(segments)} (길이 ${segments.length})\n` +
      '• 아직 이동하지 않았습니다. 위에서 카테고리 카드, 이어서 상품 카드를 클릭해 배열이 변하는지 확인하세요.'

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="useSelectedLayoutSegments() 계층형 브레드크럼 생성 검증 결과"
        expected={<>{expected}</>}
        actual={<>{actual}</>}
        isMatched={isMatched}
        description="라우트 깊이(기본 경로 / 카테고리 목록 / 상품 상세)마다 useSelectedLayoutSegments()가 반환한 배열의 실제 길이가 예상대로 늘어나는지 검증합니다."
      />
      <DemoDeepDiveCard title="useSelectedLayoutSegments() 계층형 브레드크럼 생성">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>useSelectedLayoutSegments()</code> (<code>next/navigation</code>)는 이 훅이 호출된{' '}
              <code>layout.tsx</code> 하위에서 활성화된 모든 라우트 세그먼트를 문자열 배열(
              <code>string[]</code>)로 반환하는 Client Component 전용 훅입니다. 하위 세그먼트가 없으면 빈
              배열을 반환합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              이 데모의 최상위 <code>layout.tsx</code>에서 <code>useSelectedLayoutSegments()</code>를 호출한다.
              기본 경로에서는 <code>[]</code>, 카테고리 목록(<code>category/[category]</code>)에서는{' '}
              <code>[&apos;category&apos;, &apos;electronics&apos;]</code>처럼 길이 2, 상품 상세(
              <code>category/[category]/[id]</code>)에서는 길이 3의 배열이 반환된다. 배열의 첫 원소{' '}
              <code>&apos;category&apos;</code>는 실제 디렉토리 세그먼트 이름 그 자체이며 대응하는 페이지가
              없어 브레드크럼에서 링크 없는 라벨로만 표시된다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>
                <strong>전체 중첩 깊이 일괄 수집</strong>: 하위 세그먼트가 몇 단계로 깊어지든 한 번의 호출로
                배열 전체를 얻어 브레드크럼을 손쉽게 렌더링합니다.
              </li>
              <li>
                <strong>Route Groups 자동 포함</strong>: <code>(marketing)</code>처럼 괄호로 묶인 라우트
                그룹도 배열에 포함되므로, UI에 노출하지 않으려면{' '}
                <code>segments.filter((s) =&gt; !s.startsWith(&apos;(&apos;))</code>로 직접 제거해야 합니다.
              </li>
              <li>
                <strong>Catch-all 결합 반환</strong>: <code>[...slug]</code> 캐치올 라우트는 매칭된 경로가
                개별 원소가 아니라 슬래시로 합쳐진 하나의 문자열로 배열에 담깁니다.
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>대규모 쇼핑몰 카테고리 계층 브레드크럼 (전체 상품 {'>'} 전자기기 {'>'} 키보드)</li>
              <li>파일 탐색기 및 클라우드 드라이브 폴더 계층 내비게이션</li>
              <li>다단계 설정·관리자 메뉴의 현재 위치 추적 바</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">
              5. 실무 주의사항 및 핵심 팁 (Caution &amp; Tips)
            </h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>
                <strong>단수형과의 차이</strong>: 바로 한 단계 아래 세그먼트 하나만 필요하면{' '}
                <code>useSelectedLayoutSegment()</code>(단수형)를, 전체 하위 경로 배열이 필요하면{' '}
                <code>useSelectedLayoutSegments()</code>(복수형)를 사용해야 합니다.
              </li>
              <li>
                <strong>호출 위치가 결과를 결정</strong>: 더 하위 <code>layout.tsx</code>에서 호출하면 그
                지점 기준 더 짧은 배열이 반환됩니다. 전체 깊이가 필요하면 반드시 가장 상위 레이아웃에서
                호출해야 합니다.
              </li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
