'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import { useStatePreservation } from './StatePreservationContext'
import { verifyStatePreservation } from '../verification'

export function VerificationFooter() {
  const pathname = usePathname()
  const { mountId, query, baseline, reportedPathname, reportedCategory } = useStatePreservation()

  const result = verifyStatePreservation(
    { mountId, pathname, query, reportedPathname, reportedCategory },
    baseline,
  )

  const expected = (
    <div className="space-y-1">
      <p>• 검색어 입력값이 기준 기록 시점과 이동 후에도 동일하게 유지</p>
      <p>• 실제로 다른 경로(카테고리)로 이동했지만 공유 layout.tsx의 mount 인스턴스는 그대로 유지</p>
      <p>• 이동한 페이지의 실제 콘텐츠가 기준과 다른 카테고리를 보고</p>
    </div>
  )

  const actual = (
    <div className="space-y-1">
      <p>
        • mount ID: <code className="font-mono">{mountId.slice(0, 8)}</code>
        {baseline ? ` (기준 기록 시 ${baseline.mountId.slice(0, 8)})` : ' (기준 미기록)'}
      </p>
      <p>
        • 현재 경로: <code>{pathname}</code>
        {baseline ? ` / 기준 경로: ${baseline.pathname}` : ''}
      </p>
      <p>
        • 실제 페이지 콘텐츠 카테고리: {reportedCategory ?? '보고 대기 중'}
        {baseline ? ` / 기준 카테고리: ${baseline.category}` : ''}
      </p>
      <p>
        • 현재 검색어: &quot;{query}&quot;
        {baseline ? ` / 기준 검색어: "${baseline.query}"` : ''}
      </p>
      <p>• {result.reason}</p>
    </div>
  )

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="레이아웃 상태 보존 검증 결과"
        className="min-w-0 break-all"
        expected={expected}
        actual={actual}
        isMatched={result.isMatched}
        description="검색어 기준을 기록하고 실제 다른 카테고리로 이동한 뒤에만 판정합니다. 이동 전에는 대기 상태입니다."
      />
      <DemoDeepDiveCard title="layout.tsx 상태 보존, 무엇을 실제로 관측했는가" className="min-w-0">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">1. 핵심 스펙 요약</h5>
            <p>
              <code>layout.tsx</code>는 하위 라우트 세그먼트(<code>page.tsx</code>)가 실제 <code>Link</code> 이동으로
              교체되어도 리마운트되지 않는다. 이 layout이 감싸는 클라이언트 컴포넌트 인스턴스와 그 안의{' '}
              <code>useState</code> 값(검색어, 기준 기록, mount ID)은 그대로 유지된다.
            </p>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">2. 이 데모의 코드 트리</h5>
            <pre className="min-w-0 overflow-x-auto rounded bg-zinc-100 p-2.5 font-mono text-[11px] leading-relaxed dark:bg-zinc-900">
{`state-preservation/
├─ layout.tsx            (Server) Provider + 공유 프레임 + {children}
├─ page.tsx               (Server) 도서 카테고리 (기본 경로)
├─ electronics/page.tsx   (Server) 전자기기 카테고리
└─ fashion/page.tsx       (Server) 패션 카테고리`}
            </pre>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">3. 리렌더와 리마운트는 다르다</h5>
            <p>
              위 프레임 안의 검색창·카테고리 내비게이션은 <code>usePathname</code>을 쓰는 클라이언트 컴포넌트라 경로가
              바뀔 때마다 실제로 다시 렌더링된다. 하지만 <strong>리마운트되지는 않는다</strong> — 같은 컴포넌트
              인스턴스가 유지되므로 <code>useState</code> 값이 초기화되지 않는다. &quot;Client Component는 절대
              리렌더되지 않는다&quot;는 설명은 사실이 아니다.
            </p>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">4. 실제로 무엇을 관측하는가</h5>
            <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
              <li>경로(<code>usePathname</code>)와 mount ID(경로와 무관하게 고정된 <code>useState</code> 초기값)</li>
              <li>
                각 하위 <code>page.tsx</code>에 심어진 <code>CategoryReporter</code>가 실제로 렌더된 카테고리를 프레임에
                보고 — <code>pathname</code> 문자열 추정이 아니라 실제 콘텐츠 근거다.
              </li>
              <li>기준 기록 이후 검색어가 그대로인지 문자열 비교</li>
            </ul>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">5. 전체 새로고침과의 차이</h5>
            <p>
              브라우저를 새로고침하면 layout.tsx의 클라이언트 컴포넌트 트리 전체가 다시 마운트되어 mount ID·검색어·기준
              기록이 모두 초기화된다. 이 데모의 [예제 초기화] 버튼은 같은 mount를 유지한 채 기준·검색어만 비워 절차를
              재실행할 수 있게 한다.
            </p>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
