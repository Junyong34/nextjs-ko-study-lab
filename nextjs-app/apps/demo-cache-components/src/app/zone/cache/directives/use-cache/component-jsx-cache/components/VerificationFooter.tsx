'use client'
import React, { useEffect, useRef, useState } from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import type { CategoryId } from './DirectiveUseCacheComponentDemo'

export interface VerificationFooterProps {
  category: CategoryId
  renderId: string
  renderedAt: string
}

export function VerificationFooter({ category, renderId, renderedAt }: VerificationFooterProps) {
  const seenRef = useRef<Partial<Record<CategoryId, string>>>({})
  const [state, setState] = useState<{ isFirstVisit: boolean; isMatched: boolean | undefined }>({
    isFirstVisit: true,
    isMatched: undefined,
  })

  useEffect(() => {
    const prevRenderId = seenRef.current[category]
    if (prevRenderId === undefined) {
      seenRef.current[category] = renderId
      setState({ isFirstVisit: true, isMatched: undefined })
    } else {
      seenRef.current[category] = renderId
      setState({ isFirstVisit: false, isMatched: prevRenderId === renderId })
    }
  }, [category, renderId])

  const expected =
    "동일 category로 재방문하면 BestSellerRankingHero 함수가 재실행되지 않고, 최초 렌더 시 생성된 동일한 renderId/renderedAt이 그대로 반환되어야 한다."

  const actual = state.isFirstVisit
    ? `• '${category}' 최초 렌더 (MISS): renderId=${renderId}, renderedAt=${renderedAt}`
    : state.isMatched
      ? `• '${category}' 재선택 (HIT): renderId=${renderId} — 이전 방문과 동일하게 재사용됨 (renderedAt=${renderedAt})`
      : `• '${category}' renderId=${renderId}가 이전 방문과 달라짐 — 캐시가 재사용되지 않았습니다.`

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="'use cache' 컴포넌트 JSX 렌더링 결과 캐싱 검증 결과"
        expected={expected}
        actual={actual}
        isMatched={state.isFirstVisit ? undefined : state.isMatched}
        description="카테고리 탭을 반복 선택해 동일 category 재방문 시 renderId가 그대로 재사용되는지 실측합니다."
      />
      <DemoDeepDiveCard title="컴포넌트 JSX 레벨 'use cache' 지시어 선언">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              async 서버 컴포넌트 함수 본문 맨 위에 <code>'use cache'</code>를 선언하면, 그 함수가 반환하는 JSX 트리
              전체가 캐시 대상이 됩니다. 캐시 키는 빌드 ID + 함수 위치(Function ID) + 직렬화된 인자(props)로 결정되며,
              동일 인자 조합으로 다시 호출되면 함수 본문을 재실행하지 않고 캐시된 JSX를 그대로 반환합니다.
            </p>
          </div>
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. '함수 캐시'와의 차이 — 무엇이 캐시되는가</h5>
            <p>
              이웃한 <code>function-cache</code> 데모는 <code>getProductDetail(id)</code>처럼{' '}
              <strong>데이터 값</strong>을 반환하는 비동기 함수에 <code>'use cache'</code>를 적용합니다. 이 데모는 그
              대신 <code>{'<BestSellerRankingHero category={category} />'}</code>처럼{' '}
              <strong>렌더링된 JSX(UI)</strong> 자체를 반환하는 서버 컴포넌트 함수에 적용합니다. 캐시 계층이 동작하는
              원리(인자 직렬화 → 캐시 키 → 재사용)는 동일하지만, 캐시되는 결과물이 원시 데이터인지 완성된 UI 트리인지가
              다릅니다.
            </p>
          </div>
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 태그/cacheLife를 지정하지 않은 이유</h5>
            <p>
              이 데모는 <code>cacheTag</code>/<code>cacheLife</code>를 선언하지 않아 암묵적 <code>'default'</code>{' '}
              프로파일(클라이언트 stale 5분, 서버 revalidate 15분, expire 없음)이 적용됩니다. 수동 무효화 수단이 없으므로,
              캐시를 비우는 유일한 방법은 새 인자 조합(다른 category)으로 전환하는 것뿐입니다.
            </p>
          </div>
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 실무 주의사항</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>
                <strong>Props 직렬화 필수</strong>: 컴포넌트로 전달되는 모든 props는 캐시 키 생성을 위해 직렬화 가능해야
                합니다(문자열/숫자/불리언/일반 객체/배열 등). 클래스 인스턴스나 함수는 불가합니다.
              </li>
              <li>
                <strong>런타임 API 접근 불가</strong>: <code>'use cache'</code> 스코프 내부에서는{' '}
                <code>cookies()</code>/<code>headers()</code>/<code>searchParams</code>를 직접 읽을 수 없습니다. 이
                데모에서도 <code>searchParams</code>는 캐시 스코프 바깥(페이지 레벨)에서 읽어 category 문자열로 변환한
                뒤 인자로 전달합니다.
              </li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
