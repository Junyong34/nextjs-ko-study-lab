'use client'

import React from 'react'
import { DemoDeepDiveCard } from '@study/demo-kit'

export interface VerificationFooterProps {
  /** page.tsx가 실제로 export한 maxDuration 값 (Server Action 몫). */
  pageMaxDurationSeconds: number
}

export function VerificationFooter({ pageMaxDurationSeconds }: VerificationFooterProps) {
  return (
    <DemoDeepDiveCard title="maxDuration 라우트 세그먼트 설정 (Server Action / Route Handler)">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙</h5>
          <p>
            <code>export const maxDuration = number</code>는 라우트 세그먼트 서버 측 로직의 최대 실행 시간(초 단위)을
            선언하는 표준 Route Segment Config 값이다. Next.js는 이 값을 빌드 출력에 실어 두고, 배포 플랫폼(Vercel 등)이
            그 값을 읽어 서버리스 함수 실행 제한으로 적용한다. 공식 문서에 실행 강제 로직 자체는 없다 — Next.js는
            "선언"만 담당하고, "강제"는 배포 플랫폼의 몫이다.
          </p>
        </div>

        <div>
          <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 이 데모의 두 선언</h5>
          <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
            <li>
              <code>page.tsx</code>: <code>export const maxDuration = {pageMaxDurationSeconds}</code> — 이 페이지에서
              호출하는 모든 Server Action(<code>actions.ts</code>)의 기본 타임아웃을 결정한다 (공식 문서 Server Actions
              섹션).
            </li>
            <li>
              <code>settle-batch/route.ts</code>: <code>export const maxDuration = 3</code> — 같은 데모 안에서도 Route
              Handler 세그먼트는 독립적으로 더 타이트한 값을 선언할 수 있음을 보여준다.
            </li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 로컬에서 관찰 가능한 것 / 불가능한 것</h5>
          <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
            <li>
              <strong>관찰 가능</strong>: 소스에 선언된 maxDuration 값(각 응답 JSON의 <code>declaredMaxDurationSeconds</code>
              , 같은 모듈의 상수를 그대로 반환한다), 주문 건수에 비례해 실제로 걸리는 처리 시간(<code>elapsedMs</code>
              , <code>Date.now()</code> 차이로 직접 측정), 요청이 끝까지 실행돼 HTTP 200으로 완료되는지.
            </li>
            <li>
              <strong>관찰 불가</strong>: 배포 플랫폼이 maxDuration 초과 시 함수를 실제로 강제 종료하는 동작. 로컬
              <code> next dev</code>/<code>next start</code>는 이 값을 실행 시간 제한으로 사용하지 않으므로, 주문 건수를
              늘려 선언값을 넘겨도 이 데모는 타임아웃을 흉내 내지 않고 정직하게 "로컬에서는 끝까지 실행됐다"는 실측
              결과만 보여준다.
            </li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 실무 주의사항</h5>
          <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
            <li>
              <strong>플랫폼 요금제 상한</strong>: 배포 플랫폼별 플랜이 허용하는 최대 실행 시간을 초과하는 값은 무시되거나
              빌드/배포 단계에서 조정될 수 있다.
            </li>
            <li>
              <strong>Server Action 범위</strong>: 개별 Server Action은 자체 maxDuration을 선언할 수 없다 — 페이지
              레벨 선언 하나가 그 페이지의 모든 Server Action에 적용된다.
            </li>
            <li>
              <strong>도입 버전</strong>: <code>maxDuration</code>은 v13.4.10에서 도입됐다 (공식 문서 Version History).
            </li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
