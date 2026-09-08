'use client'
import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard, DemoResetButton } from '@study/demo-kit'
import { VerificationFooter } from './VerificationFooter'
const base = '/zone/baseline/file-conventions/parallel-routes'
export function ParallelPracticeFrame({ children, analytics, team }: { children: ReactNode; analytics: ReactNode; team: ReactNode }) {
  const path = usePathname()
  if (path !== base && path !== base + '/details') return children
  return <DemoContainer className="space-y-4">
    <DemoGuideCard title="슬롯 이동과 새로고침 비교" concept="Link 이동에서는 다른 슬롯 화면을 유지하지만, 새로고침하면 현재 경로와 일치하지 않는 슬롯은 default.tsx로 표시됩니다." steps={[
      { step: 1, title: '운영 메모 입력', description: '운영팀 화면의 메모에 오늘 확인할 일을 적습니다.' },
      { step: 2, title: '분석 상세 열기', description: '분석만 상세 화면으로 바뀌고 운영팀 메모와 메인 화면은 유지되는지 확인합니다.', observe: '실제 슬롯 화면과 선택된 세그먼트', observeAt: 'verification' },
      { step: 3, title: '상세 화면에서 실습 화면 새로고침', description: '운영팀과 메인 화면이 기본 화면으로 바뀌고 메모가 사라지는지 확인합니다.' },
      { step: 4, title: '처음 화면으로', description: '초기 화면으로 돌아가 메모를 새로 적고 반복합니다.' },
    ]} />
    <DemoPlaygroundCard title="운영 대시보드 화면 조합">
      <div className="mb-3 flex flex-wrap items-center gap-3 text-sm">
        <Link href={base + '/details'} className="rounded border px-3 py-2">분석 상세 열기</Link>
        <Link href={base} className="rounded border px-3 py-2">처음 화면으로</Link>
        <DemoResetButton label="실습 화면 새로고침" />
        <DemoResetButton onReset={() => window.location.assign(base)} />
      </div>
      <div id="parallel-observation" className="space-y-3">{children}<div className="grid gap-3 sm:grid-cols-2">{analytics}{team}</div></div>
    </DemoPlaygroundCard>
    <VerificationFooter />
  </DemoContainer>
}
