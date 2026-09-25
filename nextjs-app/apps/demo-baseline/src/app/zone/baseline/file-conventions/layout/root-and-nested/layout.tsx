import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ObservationProvider } from './components/ObservationContext'
import { RouteNav } from './components/RouteNav'
import { ChainView } from './components/ChainView'
import { ScopeMatrix } from './components/ScopeMatrix'
import { VerificationFooter } from './components/VerificationFooter'

/**
 * 데모 layout (루트 layout 아님). html/body는 src/app/layout.tsx가 이미 만들었으므로
 * 여기서는 자기 자신을 표시하는 data-layout 요소만 렌더하고 children을 그 안에 둔다.
 */
export default function RootAndNestedDemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <ObservationProvider>
      <DemoContainer className="space-y-6">
        <DemoGuideCard
          title="루트 layout의 html/body와 중첩 layout의 감싸는 순서"
          concept={'루트 layout.tsx(src/app/layout.tsx)만 <html lang="ko">·<body>와 전역 metadata를 만들고, 그 아래 폴더의 layout.tsx는 자기 폴더와 하위 경로의 page.tsx만 폴더 깊이 순서대로 감싼다. 5개 경로의 실제 DOM 조상 체인으로 확인한다.'}
          steps={[
            {
              step: 1,
              title: '[의류 > 상의] 링크로 이동',
              description: '조상 체인에 html > body > 데모 layout > clothing/layout > clothing/tops/layout > page가 순서대로 나오는지 봅니다.',
              actionBadge: '가장 깊은 경로',
            },
            {
              step: 2,
              title: '[의류 > 하의], [의류], [전자기기], [전체] 링크로 차례로 이동',
              description: '폴더에 layout.tsx가 없거나 의류 폴더 밖인 경로에서는 해당 layout 칸이 비는지 표에서 비교합니다.',
              actionBadge: '적용 범위',
            },
            {
              step: 3,
              title: '다섯 경로가 모두 관측됐는지 확인',
              description: '모든 체인이 html lang="ko" > body로 시작하고 document.title에 루트 template 접미사가 붙는지 봅니다. [관측 기록 초기화]로 처음부터 다시 관측할 수 있습니다.',
              actionBadge: '루트 계약',
              observe: '루트 html/body·metadata·중첩 범위 세 항목이 모두 일치로 바뀌는지 확인',
              observeAt: 'verification',
            },
          ]}
        />
        <DemoPlaygroundCard title="카테고리 경로와 실제 layout 중첩 (DOM 관측)" className="min-w-0">
          <div className="min-w-0 space-y-4">
            <RouteNav />
            <div data-layout="root-and-nested/layout.tsx" className="min-w-0 space-y-2 rounded border border-zinc-300 p-3 dark:border-zinc-700">
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                <code className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">root-and-nested/layout.tsx</code> · 데모
                layout (모든 경로에 적용)
              </p>
              {children}
            </div>
            <div className="grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-2">
              <ChainView />
              <ScopeMatrix />
            </div>
          </div>
        </DemoPlaygroundCard>
        <VerificationFooter />
      </DemoContainer>
    </ObservationProvider>
  )
}
