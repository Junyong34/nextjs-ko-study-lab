'use client'

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { TabNavigator } from './components/TabNavigator'
import { VerificationFooter } from './components/VerificationFooter'
import { TemplateLifecycleProvider } from './components/TemplateLifecycleContext'

export default function TemplateLifecycleRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <TemplateLifecycleProvider>
      <DemoContainer className="space-y-6">
        {/* 1단. 상단 가이드 필드셋 */}
        <DemoGuideCard
          title="template.tsx 파일 컨벤션 & 네비게이션 시 인스턴스 재생성"
          concept="layout.tsx와 달리 template.tsx는 라우트 이동 시마다 기존 인스턴스를 언마운트하고 새로운 인스턴스를 생성(Re-mount)하여 하위 page.tsx와 폼 입력값 및 애니메이션 상태를 자동 초기화합니다."
          steps={[
            {
              step: 1,
              title: 'template.tsx 영역의 평점 선택 및 후기 작성',
              description: '보라색 테두리의 [template.tsx 영역]에서 평점(1~5점)을 선택하고 후기 입력창에 텍스트를 작성합니다.',
              actionBadge: '폼 상태 입력',
            },
            {
              step: 2,
              title: '상단 layout.tsx의 [오버핏 기모 맨투맨] 탭 클릭',
              description: '녹색 테두리의 [layout.tsx 영역]에 위치한 상단 탭에서 [오버핏 기모 맨투맨] 링크를 클릭하여 다른 상품 라우트로 이동합니다.',
              actionBadge: '라우트 이동',
            },
            {
              step: 3,
              title: 'template.tsx 인스턴스 ID 재생성 & 폼 리셋 확인',
              description: 'layout.tsx는 유지되지만 template.tsx 영역 전체가 Re-mount되어 고유 ID(#ID)가 새로 발급되고 작성 중이던 후기 폼이 깨끗하게 리셋된 것을 관찰합니다.',
              actionBadge: '인스턴스 재생성',
              observe: '인스턴스 고유 ID(#ID)가 새로 갱신되고 작성 중이던 후기 폼 텍스트와 평점이 초기화됨',
              observeAt: 'playground',
            },
          ]}
        />

        {/* 2단. 실습 조작 영역 (DemoPlaygroundCard) */}
        <DemoPlaygroundCard title="상품 탭 전환 및 템플릿 생명주기 실습" className="space-y-7">
          {/* 계층 구조 안내 바 */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 rounded-2xl border border-zinc-200/80 bg-zinc-50/90 p-4 sm:p-5 text-xs text-zinc-600 dark:border-zinc-800/80 dark:bg-zinc-900/70 dark:text-zinc-300 shadow-2xs">
            <span className="font-bold text-zinc-900 dark:text-zinc-100 mr-1">
              Next.js 렌더링 계층 순서:
            </span>
            <span className="inline-flex items-center rounded-lg border border-emerald-300 bg-emerald-100/90 px-3 py-1.5 font-mono font-bold text-emerald-900 shadow-2xs dark:border-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-200">
              1. layout.tsx (탭 셸)
            </span>
            <span className="text-zinc-400 font-bold px-1">➔</span>
            <span className="inline-flex items-center rounded-lg border border-indigo-300 bg-indigo-100/90 px-3 py-1.5 font-mono font-bold text-indigo-900 shadow-2xs dark:border-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-200">
              2. template.tsx (재마운트 래퍼)
            </span>
            <span className="text-zinc-400 font-bold px-1">➔</span>
            <span className="inline-flex items-center rounded-lg border border-zinc-300 bg-zinc-200/80 px-3 py-1.5 font-mono font-bold text-zinc-800 shadow-2xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
              3. page.tsx (상품 본문)
            </span>
          </div>

          {/* layout.tsx 영역 표시 */}
          <div className="space-y-3.5 rounded-2xl border-2 border-emerald-500/40 bg-emerald-50/20 p-5 sm:p-6 dark:border-emerald-900/50 dark:bg-emerald-950/20 shadow-xs">
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span className="font-mono text-xs font-bold text-emerald-950 dark:text-emerald-200">
                  layout.tsx 영역
                </span>
                <span className="rounded bg-emerald-100 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-800 dark:bg-emerald-900/80 dark:text-emerald-200">
                  라우트 전환 시에도 유지됨 (Persistent)
                </span>
              </div>
            </div>

            {/* Next.js Link 탭 네비게이션 */}
            <TabNavigator />
          </div>

          {/* template.tsx 래퍼를 거친 실제 page.tsx 콘텐츠 */}
          <div className="pt-2">
            {children}
          </div>
        </DemoPlaygroundCard>

        {/* 3단 및 4단: 검증 패널 및 [개념 정리] 카드 */}
        <VerificationFooter />
      </DemoContainer>
    </TemplateLifecycleProvider>
  )
}
