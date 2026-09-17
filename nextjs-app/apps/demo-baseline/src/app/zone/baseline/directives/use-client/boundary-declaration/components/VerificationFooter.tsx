'use client'

import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import { useBoundaryState } from './BoundaryContext'
import type { AttemptStatus } from '../types'

const STATUS_LABEL: Record<AttemptStatus, string> = {
  idle: '대기 중',
  success: '정상 동작',
  error: '렌더링 거부(에러)',
}

export function VerificationFooter() {
  const { serverAttempt, clientAttempt, leafAttempt } = useBoundaryState()

  const allDone = [serverAttempt, clientAttempt, leafAttempt].every((r) => r.status !== 'idle')
  const isMatched = allDone
    ? serverAttempt.status === 'error' && clientAttempt.status === 'success' && leafAttempt.status === 'success'
    : undefined

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="'use client' 경계에 따른 이벤트 핸들러 동작 검증"
        isMatched={isMatched}
        description="허브의 두 링크와 클라이언트 화면의 하위 배지를 모두 클릭해 세 결과를 채우면 검증이 완료됩니다."
        expected={
          <ul className="list-disc list-inside space-y-1">
            <li>① 서버 컴포넌트(onClick 바인딩) → 렌더링 거부(에러)</li>
            <li>② 클라이언트 컴포넌트(onClick 바인딩) → 정상 동작</li>
            <li>③ 'use client' 없는 하위 컴포넌트 → 정상 동작(부모 경계 상속)</li>
          </ul>
        }
        actual={
          <ul className="list-disc list-inside space-y-1">
            <li>
              ① {STATUS_LABEL[serverAttempt.status]}
              {serverAttempt.status !== 'idle' && <span className="block font-mono text-[11px] text-zinc-500">{serverAttempt.detail}</span>}
            </li>
            <li>
              ② {STATUS_LABEL[clientAttempt.status]}
              {clientAttempt.status !== 'idle' && <span className="block font-mono text-[11px] text-zinc-500">{clientAttempt.detail}</span>}
            </li>
            <li>
              ③ {STATUS_LABEL[leafAttempt.status]}
              {leafAttempt.status !== 'idle' && <span className="block font-mono text-[11px] text-zinc-500">{leafAttempt.detail}</span>}
            </li>
          </ul>
        }
      />

      <DemoDeepDiveCard title="'use client' 경계와 클라이언트 번들 포함 범위">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>'use client'</code>는 파일 최상단에 선언되어 Server Component 트리와 Client Component 트리 사이의 진입 경계(entry point)를 정의합니다. 경계 반대편인 Server Component는 브라우저에서 실행되지 않으므로 <code>onClick</code> 같은 이벤트 핸들러(직렬화 불가능한 함수)를 가질 수 없고, 실제로 렌더링 시점에 거부됩니다 — 위 <code>server-attempt</code> 실습에서 방금 확인한 에러가 그 증거입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              공식 문서는 "<code>'use client'</code>를 포함하는 모든 파일에 지시어를 붙일 필요는 없다. Server Component 안에서 직접 렌더링하고 싶은 진입점 파일에만 붙이면 된다"고 설명합니다. <code>client-attempt/page.tsx</code>가 그 진입점이고, 이 파일이 import하는 <code>LeafInteractiveBadge.tsx</code>는 자체 <code>'use client'</code>가 없어도 이미 경계 안쪽이라 <code>useState</code>/<code>onClick</code>이 그대로 동작합니다 — 경계 아래로 import된 모든 컴포넌트가 클라이언트 번들에 포함된다는 특성입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>클라이언트 자바스크립트 번들 최소화</strong>: 진입점만 트리 잎(leaf)에 배치하면 그 하위 전체만 번들에 포함되어 페이로드가 줄어듭니다.</li>
              <li><strong>실수 방지 신호</strong>: 상위 Layout/Page에 무심코 <code>'use client'</code>를 선언하면 그 하위 전체(무거운 모듈 포함)가 통째로 클라이언트 번들에 포함되므로, 경계 위치가 곧 번들 크기를 결정합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 실무 주의사항 및 핵심 팁 (Caution &amp; Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>Server → Client 함수 props 금지</strong>: 함수는 직렬화할 수 없으므로 Server Component가 Client Component에 콜백을 props로 내려줄 수 없습니다. 이벤트 핸들러는 Client Component 내부에서 직접 정의해야 합니다.</li>
              <li><strong>경계는 최대한 아래로</strong>: 인터랙션이 필요한 말단 컴포넌트에만 <code>'use client'</code>를 선언하고, 정적 콘텐츠는 Server Component로 남겨 번들을 최소화합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
