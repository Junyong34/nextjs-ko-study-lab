import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'directives/use-client/window-storage-access')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoDeepDiveCard } from '@study/demo-kit'
import { WindowStorageAccessDemo } from './components/WindowStorageAccessDemo'
import type { ServerWindowProbeResult } from './types'

function probeServerWindowAccess(): ServerWindowProbeResult {
  const typeofWindow = typeof window
  let errorName = '(에러 없음)'
  let errorMessage = '(에러 없음)'

  try {
    // 이 함수는 'use client'가 없는 서버 컴포넌트(page.tsx) 안에서 실행된다.
    // Node.js 렌더링 런타임에는 window 전역이 존재하지 않으므로 아래 접근은 실제로 실패해야 한다.
    window.localStorage.getItem('demo_recent_products')
  } catch (error) {
    errorName = error instanceof Error ? error.name : 'UnknownError'
    errorMessage = error instanceof Error ? error.message : String(error)
  }

  console.log(
    `[window-storage-access] 서버 렌더링 시점 typeof window = "${typeofWindow}", 접근 결과 = ${errorName}: ${errorMessage}`
  )

  return { typeofWindow, errorName, errorMessage, checkedAt: new Date().toISOString() }
}

export default function DemoPage() {
  const serverProbe = probeServerWindowAccess()

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="'use client' 내부 브라우저 window.localStorage 접근"
        concept="서버 컴포넌트는 Node.js 런타임에서 렌더링되므로 window가 없어 접근이 실제로 실패합니다. 'use client' 컴포넌트만 마운트된 뒤 브라우저의 window/localStorage에 안전하게 접근할 수 있습니다."
        steps={[
          {
            step: 1,
            title: '서버 컴포넌트의 실제 접근 결과 확인',
            description: '이 페이지(page.tsx)는 서버 컴포넌트입니다. 렌더링 시점에 window.localStorage 접근을 실제로 시도한 결과를 [실습 화면] 좌측 패널에서 확인합니다.',
            actionBadge: '서버 실측',
          },
          {
            step: 2,
            title: '상품 클릭 → localStorage 저장',
            description: "우측 패널의 'use client' 컴포넌트에서 상품을 클릭하면 실제 localStorage.setItem이 호출되어 최근 본 상품이 저장됩니다.",
            actionBadge: '클라이언트 저장',
          },
          {
            step: 3,
            title: '새로고침 후 유지 확인',
            description: '브라우저를 새로고침해도 마지막 저장 시각과 목록이 그대로 남아있는지 확인해 실제 영속성을 검증합니다.',
            actionBadge: '영속성 확인',
            observe: '서버 접근 실패 결과 vs 클라이언트 접근 성공 결과 대조',
            observeAt: 'verification',
          },
        ]}
      />

      <WindowStorageAccessDemo serverProbe={serverProbe} />

      <DemoDeepDiveCard title="'use client' 브라우저 API 접근 경계">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">1. 서버 컴포넌트에서 실패하는 이유</h5>
            <p>
              이 페이지의 <code>page.tsx</code>는 <code>&apos;use client&apos;</code>가 없는 서버 컴포넌트입니다. Next.js는
              이를 브라우저가 아닌 Node.js 런타임에서 렌더링하므로 <code>window</code> 전역 객체 자체가 존재하지 않습니다.
              위 [실습 화면]의 왼쪽 패널에 표시된 <code>{serverProbe.errorName}: {serverProbe.errorMessage}</code>는 이
              페이지를 렌더링할 때마다 서버가 실제로 던진 예외를 그대로 캡처한 값입니다.
            </p>
          </div>

          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">2. 'use client' 컴포넌트에서 성공하는 이유</h5>
            <p>
              <code>WindowStorageAccessDemo.tsx</code>는 최상단에 <code>&apos;use client&apos;</code>를 선언했습니다. 이
              디렉티브는 이 파일의 컴포넌트를 브라우저에서도 실행되는 클라이언트 엔트리포인트로 만듭니다. 컴포넌트 본문이
              아니라 <code>useEffect</code> 내부에서 <code>window</code>를 읽기 때문에, 브라우저에 실제로 마운트된 이후
              (오른쪽 패널의 <code>typeof window === &apos;object&apos;</code>)에만 접근이 실행됩니다.
            </p>
          </div>

          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">3. 렌더링 본문에서 직접 읽으면 안 되는 이유</h5>
            <p>
              <code>useEffect</code> 밖, 즉 컴포넌트 렌더링 본문에서 곧바로 <code>localStorage.getItem(...)</code>을 호출하면
              서버 렌더링 시점(1번 항목과 동일한 상황)에 그대로 실패합니다. 클라이언트 컴포넌트도 최초 렌더는 서버에서
              함께 수행되기 때문에, 브라우저 전용 API는 반드시 마운트 이후(<code>useEffect</code>)에만 접근해야
              하이드레이션 시점의 크래시를 피할 수 있습니다.
            </p>
          </div>

          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">4. 실무 활용</h5>
            <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
              <li>비로그인 사용자의 최근 본 상품·검색 기록 저장</li>
              <li>다크모드 같은 로컬 UI 설정 복구</li>
              <li>폼 작성 중 임시 자동 저장 복구</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </DemoContainer>
  )
}
