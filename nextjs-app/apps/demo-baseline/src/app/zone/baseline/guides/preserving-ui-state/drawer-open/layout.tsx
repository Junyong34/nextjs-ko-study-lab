'use client'
import React from 'react'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { DrawerProvider, useDrawer } from './components/DrawerContext'
import { VerificationFooter } from './components/VerificationFooter'

function DrawerContent({ children }: { children: React.ReactNode }) {
  const { isDrawerOpen, toggleDrawer } = useDrawer()

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"레이아웃 유지 및 슬라이드 드로어 상태 보존"}
        concept={"이 드로어 상태는 하위 page.tsx가 아니라 layout.tsx에 있다. 하위 카테고리 페이지 간 실제 라우트 이동이 발생해도 layout은 리마운트되지 않으므로 드로어 상태가 그대로 유지된다."}
        steps={[
          {
            step: 1,
            title: "장바구니 드로어 상태(열림) 및 [토글] 버튼 확인",
            description: "layout.tsx 레벨의 드로어 UI 초기 열림 상태를 확인합니다.",
            actionBadge: "초기 드로어 점검",
          },
          {
            step: 2,
            title: "카테고리 A ↔ 카테고리 B 실제 이동",
            description: "실제 서브 라우트 사이를 이동합니다.",
            actionBadge: "실제 라우트 이동",
          },
          {
            step: 3,
            title: "페이지 전환 중에도 드로어 열림 상태 유지 관찰",
            description: "하위 페이지만 교체되고 layout의 드로어는 리마운트되지 않는지 확인합니다.",
            actionBadge: "상태 보존 검증",
            observe: "라우트 세그먼트 전이 시에도 layout.tsx의 드로어 열림 상태 보존 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-zinc-900 dark:text-zinc-100">장바구니 드로어 상태(layout.tsx 소유): {isDrawerOpen ? '열림' : '닫힘'}</span>
          <button
            type="button"
            onClick={toggleDrawer}
            className="rounded bg-zinc-900 px-2.5 py-1 text-xs font-bold text-white dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer"
          >
            토글
          </button>
        </div>
        {isDrawerOpen && (
          <div className="rounded bg-emerald-50 p-2 text-xs text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
            장바구니 드로어 내용 — 카테고리를 이동해도 이 블록이 사라지지 않아야 정상입니다.
          </div>
        )}
      </div>
      {children}
      <VerificationFooter />
    </DemoContainer>
  )
}

export default function DrawerLayout({ children }: { children: React.ReactNode }) {
  return (
    <DrawerProvider>
      <DrawerContent>{children}</DrawerContent>
    </DrawerProvider>
  )
}
