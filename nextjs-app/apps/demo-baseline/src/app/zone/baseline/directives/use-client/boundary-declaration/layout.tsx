'use client'

import React from 'react'
import Link from 'next/link'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard, DemoResetButton } from '@study/demo-kit'
import { BoundaryProvider, useBoundaryState } from './components/BoundaryContext'
import { VerificationFooter } from './components/VerificationFooter'

const BASE = '/zone/baseline/directives/use-client/boundary-declaration'

function BoundaryLayoutContent({ children }: { children: React.ReactNode }) {
  const { reset } = useBoundaryState()

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="'use client' 서버-클라이언트 경계 선언"
        concept="'use client'는 한 파일만 바꾸는 스위치가 아니라 그 파일부터 아래로 이어지는 모든 import를 클라이언트 번들에 포함시키는 경계선입니다. 경계 건너편의 Server Component에는 onClick 같은 이벤트 핸들러가 아예 존재할 수 없습니다."
        steps={[
          {
            step: 1,
            title: "[① 서버 컴포넌트 시도] 클릭",
            description: "'use client'가 없는 실제 Server Component 페이지(server-attempt)로 이동해 onClick이 바인딩된 버튼을 렌더링합니다.",
            actionBadge: '경계 위반 시도',
            observe: '실제 Next.js 런타임이 이 렌더링을 거부하고 error.tsx가 에러 메시지를 그대로 보여줌',
            observeAt: 'playground',
          },
          {
            step: 2,
            title: "[② 클라이언트 컴포넌트 시도] 클릭",
            description: "'use client'가 선언된 실제 Client Component 페이지(client-attempt)로 이동해 같은 형태의 onClick을 실행합니다.",
            actionBadge: '정상 동작',
          },
          {
            step: 3,
            title: "'use client' 없는 하위 배지 클릭",
            description: "client-attempt 화면 안에서 자신은 'use client'가 없는 하위 컴포넌트도 클릭에 반응하는지 확인합니다.",
            actionBadge: '경계 상속 확인',
            observe: '3단 검증 패널에서 세 결과가 기대값과 일치하는지 대조',
            observeAt: 'verification',
          },
        ]}
      />

      <DemoPlaygroundCard title="/server-attempt vs /client-attempt 실제 라우트 전환">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
          <Link
            href={BASE}
            className="rounded border border-zinc-300 bg-white px-3 py-1.5 font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            허브
          </Link>
          <Link
            href={`${BASE}/server-attempt`}
            className="rounded border border-rose-300 bg-rose-50 px-3 py-1.5 font-medium text-rose-700 hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300"
          >
            ① 서버 컴포넌트 시도
          </Link>
          <Link
            href={`${BASE}/client-attempt`}
            className="rounded border border-emerald-300 bg-emerald-50 px-3 py-1.5 font-medium text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300"
          >
            ② 클라이언트 컴포넌트 시도
          </Link>
          <DemoResetButton
            label="검증 상태 초기화"
            onReset={() => {
              reset()
              window.location.assign(BASE)
            }}
          />
        </div>
        {children}
      </DemoPlaygroundCard>

      <VerificationFooter />
    </DemoContainer>
  )
}

export default function BoundaryDeclarationLayout({ children }: { children: React.ReactNode }) {
  return (
    <BoundaryProvider>
      <BoundaryLayoutContent>{children}</BoundaryLayoutContent>
    </BoundaryProvider>
  )
}
