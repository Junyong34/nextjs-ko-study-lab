'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard, DemoResetButton } from '@study/demo-kit'
import { VerificationFooter } from './VerificationFooter'

const base = '/zone/baseline/file-conventions/default/hard-reload-restore'

export function HardReloadPracticeFrame({
  children,
  preview,
}: {
  children: ReactNode
  preview: ReactNode
}) {
  return (
    <DemoContainer className="space-y-4">
      <DemoGuideCard
        title="소프트 내비게이션 유지 vs 하드 리로드 복구"
        concept="Link로 preview 슬롯의 하위 경로로 이동하면 메인(children) 화면은 그대로 유지된다. 그러나 그 상태에서 브라우저를 새로고침하면, 서버는 클라이언트가 기억하던 슬롯 상태를 알 수 없어 URL과 일치하지 않는 슬롯에 default.tsx를 렌더링한다."
        steps={[
          {
            step: 1,
            title: '[미리보기 상세 열기] 클릭',
            description: 'preview 슬롯만 상세 화면으로 바뀌고 메인 화면은 그대로인지 확인한다.',
            actionBadge: 'Link 이동',
            observe: '두 슬롯의 data-screen 값과 아래 검증 패널의 실제 측정값',
            observeAt: 'playground',
          },
          {
            step: 2,
            title: '[브라우저 새로고침 (하드 리로드)] 클릭',
            description: '같은 URL(/preview-detail)에서 실제 전체 페이지 리로드를 실행한다.',
            actionBadge: 'window.location.reload()',
          },
          {
            step: 3,
            title: '리로드 직후 메인 화면 확인',
            description: '메인 화면이 default.tsx의 복구 화면으로 바뀌고, preview 슬롯은 여전히 상세 화면을 유지하는지 대조한다.',
            actionBadge: '슬롯 복구',
            observe: '검증 패널의 기대 결과 vs 실제 측정값 일치 여부',
            observeAt: 'verification',
          },
        ]}
      />

      <DemoPlaygroundCard title="이 라우트의 children slot + @preview slot 조합">
        <div className="mb-3.5 flex flex-wrap items-center gap-2 text-sm">
          <Link href={`${base}/preview-detail`} className="rounded border border-zinc-300 px-3 py-1.5 dark:border-zinc-700">
            미리보기 상세 열기
          </Link>
          <Link href={base} className="rounded border border-zinc-300 px-3 py-1.5 dark:border-zinc-700">
            처음 화면으로
          </Link>
          <DemoResetButton label="브라우저 새로고침 (하드 리로드)" />
        </div>
        <div id="hard-reload-observation" className="grid gap-3 sm:grid-cols-2">
          {children}
          {preview}
        </div>
      </DemoPlaygroundCard>

      <VerificationFooter />
    </DemoContainer>
  )
}
