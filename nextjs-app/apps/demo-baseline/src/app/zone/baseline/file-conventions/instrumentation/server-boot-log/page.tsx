import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/instrumentation/server-boot-log')

import React from 'react'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { getServerBootLogSnapshot } from '@/instrumentation'
import { InstrumentationServerLogDemo } from './components/InstrumentationServerLogDemo'

// 이 페이지는 매 요청(새로고침 포함)마다 서버에서 다시 렌더링되지만, register()가 기록한 부팅 스냅샷은
// 서버 프로세스가 살아 있는 한 절대 바뀌지 않는다는 것을 보여주는 것이 핵심이라 캐싱을 배제한다.
export const dynamic = 'force-dynamic'

export default function DemoPage() {
  const snapshot = getServerBootLogSnapshot()

  // register()는 Next.js가 서버 인스턴스를 요청 처리 가능 상태로 만들기 전에 완료되므로, 이 페이지가
  // 렌더링되는 시점에는 항상 값이 존재한다. 그래도 방어적으로 안전한 기본값을 둔다.
  const resolvedSnapshot = snapshot ?? {
    bootedAt: '알 수 없음',
    bootedAtMs: Date.now(),
    runtime: 'nodejs' as const,
    pid: -1,
    nodeVersion: 'unknown',
    registerCallCount: 0,
  }

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="instrumentation.ts 서버 부팅 register() 로그"
        concept="Next.js 서버 인스턴스가 기동될 때 instrumentation.ts의 register() 함수가 정확히 1회 실행되어 부팅 시각을 globalThis에 기록하고, 이후 어떤 페이지 새로고침·API 요청으로도 그 값은 갱신되지 않습니다."
        steps={[
          {
            step: 1,
            title: '좌측 [SSR 렌더 시 읽은 값] 패널 확인',
            description: 'page.tsx가 서버 렌더링 시점에 직접 읽은 bootedAt·registerCallCount를 확인합니다.',
            actionBadge: 'SSR 값 확인',
          },
          {
            step: 2,
            title: '[서버에 요청 보내기] 클릭',
            description: '별도의 Route Handler(/api/boot-snapshot)를 호출해 같은 프로세스에서 읽은 값을 대조합니다.',
            actionBadge: 'API 호출',
          },
          {
            step: 3,
            title: '브라우저 새로고침(F5) 또는 [router.refresh()] 클릭 후 재확인',
            description: '페이지를 다시 렌더링시켜도 bootedAt·registerCallCount가 그대로인지 검증합니다.',
            actionBadge: '재실행 여부 확인',
            observe: '3단 검증 패널에서 SSR 값과 API 응답의 bootedAt·registerCallCount 일치 여부 확인',
            observeAt: 'verification',
          },
        ]}
      />
      <InstrumentationServerLogDemo initialSnapshot={resolvedSnapshot} />
    </DemoContainer>
  )
}
