'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export function VerificationFooter() {
  const pathname = usePathname()
  const isSubRoute = pathname !== '/zone/baseline/layouts-and-pages/nested-layouts'

  const expectedText =
    '• Next.js App Router: 사이드바 Link 클릭 시 실제 URL 라우트(/shoes, /clothing 등)로 이동함\n• 상위 layout.tsx는 언마운트되지 않고 GNB 검색어와 타이머를 유지하며, 자식 children(Page)만 교체됨'

  const actualText = `• 현재 실제 라우트 경로: "${pathname}"\n• 라우트 이동 감지: ${
    isSubRoute
      ? `서브 라우트 진입 성공 (${pathname.split('/').pop()} 세그먼트)`
      : '루트 세그먼트 (사이드바의 [신발], [의류] 링크를 눌러보세요)'
  }`

  return (
    <div className="space-y-4">
      {/* 3단. 기대값 vs 실제값 검증 패널 */}
      <ExpectedActualPanel
        title="실제 Next.js 라우팅 및 중첩 레이아웃 부분 렌더링 검증"
        expected={expectedText}
        actual={actualText}
        isMatched={isSubRoute}
        description={
          isSubRoute
            ? `실제 Next.js 라우트가 "${pathname}"(으)로 변경되었으나, 상위 Layout이 보존되어 GNB 타이머와 검색창이 그대로 유지되었습니다.`
            : '사이드바에서 [신발], [의류], [전자기기] 중 하나의 링크를 클릭하여 라우트를 이동해 보세요.'
        }
      />

      {/* 4단. 최하단 개념 정리 카드 */}
      <DemoDeepDiveCard title="layout.tsx의 children 주입 원리와 중첩 레이아웃 구성도">
        <div className="space-y-3">
          {/* 1. 예제 레이아웃 구성도 */}
          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5">
              1. 예제 레이아웃 시각적 구성도
            </h4>
            <div className="overflow-x-auto rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/70 font-mono text-[11px] leading-relaxed text-zinc-800 dark:text-zinc-200">
              <pre className="whitespace-pre">
{`┌─────────────────────────────────────────────────────────────────┐
│ 1. RootLayout (app/.../nested-layouts/layout.tsx)               │
│   ┌───────────────────────────────────────────────────────────┐ │
│   │ [GNB Header] 검색창 ("러닝화") + 인스턴스 타이머 (상태 유지)│ │
│   └───────────────────────────────────────────────────────────┘ │
│   ┌─────────────────┬─────────────────────────────────────────┐ │
│   │ [SidebarNav]    │ 2. {children} (말단 Page 슬롯)          │ │
│   │ • 전체 상품     │    ┌──────────────────────────────────┐ │ │
│   │ • 신발 <Link>   │ ──>│  /shoes/page.tsx                 │ │ │
│   │ • 의류 <Link>   │    │  [에어 줌 프로 러닝화]           │ │ │
│   │ • 전자기기 <Link│    └──────────────────────────────────┘ │ │
│   └─────────────────┴─────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘`}
              </pre>
            </div>
            <p className="mt-1.5 text-[11px] text-zinc-500">
              • <strong>고정 영역 (Layout):</strong> GNB와 사이드바는 URL이 바뀌어도 언마운트되지 않고 계속 살아있습니다.<br />
              • <strong>교체 영역 ({'{children}'}):</strong> 사이드바 링크를 누르면 우측 구멍(Slot)의 <code className="font-mono text-[10px]">page.tsx</code>만 쏙 교체됩니다.
            </p>
          </div>

          {/* 2. children prop 주입 메커니즘 */}
          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
              2. layout.tsx의 children prop에는 무엇이 넘어오는가?
            </h4>
            <p className="leading-relaxed">
              `layout.tsx`의 <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11px] text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">children</code>에는 단순히 <code className="font-mono text-[11px]">page.tsx</code> 하나만 넘어오는 것이 아니라, <strong>현재 레이아웃보다 하위에 정의된 모든 자식 세그먼트(하위 layout 또는 최종 page.tsx)가 React Element로 합성</strong>되어 전달됩니다.
            </p>
          </div>

          {/* 3. 특수 파일 자동 래핑 계층 */}
          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
              3. 특수 파일들이 함께 있을 때의 자동 래핑 순서
            </h4>
            <div className="rounded border border-zinc-200 bg-zinc-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-900/60 font-mono text-[11px] leading-relaxed text-zinc-800 dark:text-zinc-200">
              <div>&lt;<span className="font-bold text-emerald-600">Layout</span>&gt;</div>
              <div className="pl-3">&lt;<span className="font-bold text-indigo-600">Template</span>&gt;</div>
              <div className="pl-6">&lt;<span className="font-bold text-rose-600">ErrorBoundary</span> fallback=&#123;&lt;<span className="text-rose-500">Error</span> /&gt;&#125;&gt;</div>
              <div className="pl-9">&lt;<span className="font-bold text-amber-600">Suspense</span> fallback=&#123;&lt;<span className="text-amber-500">Loading</span> /&gt;&#125;&gt;</div>
              <div className="pl-12">&lt;<span className="font-bold text-zinc-900 dark:text-zinc-100">Page</span> /&gt; <span className="text-zinc-400">&#47;&#47; 최종 page.tsx가 가장 안쪽에 위치</span></div>
              <div className="pl-9">&lt;/<span className="font-bold text-amber-600">Suspense</span>&gt;</div>
              <div className="pl-6">&lt;/<span className="font-bold text-rose-600">ErrorBoundary</span>&gt;</div>
              <div className="pl-3">&lt;/<span className="font-bold text-indigo-600">Template</span>&gt;</div>
              <div>&lt;/<span className="font-bold text-emerald-600">Layout</span>&gt;</div>
            </div>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
