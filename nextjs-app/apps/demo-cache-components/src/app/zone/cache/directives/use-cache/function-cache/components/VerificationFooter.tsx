'use client'

import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export interface VerificationFooterProps {
  /** 모든 호출의 cacheId가 동일했는지 — 2회 이상 호출 전에는 undefined(대기 중) */
  isMatched: boolean | undefined
  /** 기대 결과 설명 */
  expected: string
  /** 실제 호출 이력 기반 관찰값 */
  actual: string
  /** 검증 패널 상단 요약 설명 */
  description: string
}

export function VerificationFooter({
  isMatched,
  expected,
  actual,
  description,
}: VerificationFooterProps) {
  return (
    <>
      <ExpectedActualPanel
        title="반복 호출 cacheId 동일성 검증"
        expected={expected}
        actual={actual}
        isMatched={isMatched}
        description={description}
      />

      <DemoDeepDiveCard title="함수 레벨 'use cache'와 기본(default) 캐시 프로파일">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">
              1. 핵심 스펙 및 개념 요약
            </h5>
            <p>
              비동기 함수 본문 맨 위에 <code>'use cache'</code>만 선언하면, 인자·클로저 값·빌드
              ID로 만든 캐시 키를 기준으로 반환값이 캐시됩니다. <code>cacheTag()</code>나{' '}
              <code>cacheLife()</code>를 붙이지 않아도 캐싱은 이미 동작하며, 이때는 Next.js가
              제공하는 <code>default</code> 프로파일(서버 revalidate 15분, expire 없음)이
              적용됩니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">
              2. 데모 예제 기반 동작 원리
            </h5>
            <p>
              이 데모의 <code>getPopularProductRanking()</code>은 인자가 없으므로 캐시 키가 항상
              동일합니다. 페이지 최초 진입 시 서버에서 한 번 호출되고, 이후 [함수 다시
              호출하기]를 눌러 같은 Server Action을 반복 호출해도 함수 본문은 재실행되지 않고
              같은 <code>cacheId</code>·<code>generatedAt</code>이 반환됩니다. 이는 태그 기반
              무효화가 없기 때문에 서버 프로세스가 유지되는 한(개발 서버 기준) 계속 관찰되는
              동작입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">
              3. 실무적 장점 (Why Use This)
            </h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>
                <strong>최소 선언으로 캐싱 시작</strong>: 태그 설계나 만료 정책을 아직 정하지
                못했어도 <code>'use cache'</code> 한 줄만으로 반복 연산을 줄일 수 있습니다.
              </li>
              <li>
                <strong>자동 캐시 키 생성</strong>: 인자·클로저 값을 직렬화해 키를 만들기 때문에
                수동으로 키 문자열을 조합할 필요가 없습니다.
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">
              4. 실무 주의사항 및 핵심 팁 (Caution & Tips)
            </h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>
                <strong>태그 없이는 온디맨드 무효화가 불가능</strong>: 원본 데이터가 바뀌어도{' '}
                <code>cacheTag</code>가 없으면 <code>revalidateTag()</code>로 즉시 갱신할 수
                없습니다. 즉시 무효화가 필요하면 <code>cacheTag</code>를 반드시 추가해야 합니다.
              </li>
              <li>
                <strong>default 프로파일은 암묵적</strong>: 캐시 수명이 코드에 드러나지 않으므로,
                수명을 명시하고 싶다면 <code>cacheLife()</code>를 직접 호출하는 편이 안전합니다.
              </li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </>
  )
}
