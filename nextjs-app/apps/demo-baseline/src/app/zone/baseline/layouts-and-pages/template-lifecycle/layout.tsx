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
      <DemoContainer className="space-y-8">
        {/* 1단. 상단 가이드 필드셋 */}
        <DemoGuideCard
          title="template.tsx 파일 컨벤션 & 네비게이션 시 인스턴스 재생성"
          concept="layout.tsx와 달리 template.tsx는 라우트 이동 시마다 기존 인스턴스를 언마운트하고 새로운 인스턴스를 생성(Re-mount)하여 하위 page.tsx와 폼 입력값 및 애니메이션 상태를 자동 초기화합니다."
          steps={[
            {
              step: 1,
              title: '[평점 선택] 및 [후기 작성] 텍스트 입력',
              description: '보라색 [template.tsx 영역] 하단의 폼에서 평점(1~5점)을 선택하고 후기 입력창에 테스트 텍스트를 작성합니다.',
              actionBadge: '후기 입력',
            },
            {
              step: 2,
              title: '상단 layout.tsx의 [오버핏 기모 맨투맨] 탭 클릭',
              description: '녹색 [layout.tsx 영역] 상단 탭에서 [오버핏 기모 맨투맨] 링크를 클릭하여 다른 상품 라우트로 이동합니다.',
              actionBadge: '탭 이동',
            },
            {
              step: 3,
              title: '인스턴스 ID 재생성(#ID) 및 폼 리셋 확인',
              description: '녹색 layout.tsx는 그대로 유지되지만, 보라색 template.tsx 영역 전체가 Re-mount되어 고유 ID(#ID)가 새로 발급되고 작성 중이던 후기 폼(평점·텍스트)이 깨끗하게 초기화된 것을 확인합니다.',
              actionBadge: '재마운트 확인',
              observe: '인스턴스 고유 ID(#ID) 갱신 및 작성 중이던 후기 텍스트와 평점 자동 초기화',
              observeAt: 'playground',
            },
          ]}
        />

        {/* 2단. 실습 조작 영역 (DemoPlaygroundCard) */}
        <DemoPlaygroundCard title="상품 탭 전환 및 템플릿 생명주기 실습" className="space-y-8">
          {/* 계층 구조 안내 바 */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 sm:p-5 text-xs text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 shadow-2xs mb-6">
            <span className="font-bold text-zinc-900 dark:text-white mr-1">
              Next.js 렌더링 계층 순서:
            </span>
            <span className="inline-flex items-center rounded-lg border border-emerald-400 bg-emerald-100 px-3 py-1.5 font-mono font-bold text-emerald-900 shadow-2xs dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-200">
              1. layout.tsx (탭 셸)
            </span>
            <span className="text-zinc-500 dark:text-zinc-400 font-bold px-1">➔</span>
            <span className="inline-flex items-center rounded-lg border border-indigo-400 bg-indigo-100 px-3 py-1.5 font-mono font-bold text-indigo-900 shadow-2xs dark:border-indigo-700 dark:bg-indigo-950 dark:text-indigo-200">
              2. template.tsx (재마운트 래퍼)
            </span>
            <span className="text-zinc-500 dark:text-zinc-400 font-bold px-1">➔</span>
            <span className="inline-flex items-center rounded-lg border border-zinc-400 bg-zinc-200 px-3 py-1.5 font-mono font-bold text-zinc-900 shadow-2xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100">
              3. page.tsx (상품 본문)
            </span>
          </div>

          {/* layout.tsx 영역 표시 */}
          <div className="rounded-2xl border-2 border-emerald-500/50 bg-emerald-50/30 p-5 sm:p-6 dark:border-emerald-700/60 dark:bg-emerald-950/30 shadow-xs mb-8">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-emerald-200/60 dark:border-emerald-800/60">
              <div className="flex items-center gap-2.5">
                <span className="h-3 w-3 rounded-full bg-emerald-600 dark:bg-emerald-400 shrink-0" />
                <span className="font-mono text-sm font-extrabold text-zinc-900 dark:text-white">
                  layout.tsx 영역
                </span>
                <span className="rounded-md bg-emerald-600 px-2.5 py-0.5 font-mono text-[11px] font-bold text-white shadow-2xs dark:bg-emerald-500 dark:text-white">
                  라우트 전환 시에도 유지됨 (Persistent)
                </span>
              </div>
            </div>

            {/* Next.js Link 탭 네비게이션 */}
            <TabNavigator />
          </div>

          {/* template.tsx 래퍼를 거친 실제 page.tsx 콘텐츠 */}
          <div className="mt-8">
            {children}
          </div>
        </DemoPlaygroundCard>

        {/* 3단 및 4단: 검증 패널 및 [개념 정리] 카드 */}
        <VerificationFooter />
      </DemoContainer>
    </TemplateLifecycleProvider>
  )
}
