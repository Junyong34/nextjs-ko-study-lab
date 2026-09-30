'use client'

import { useRef, type ReactNode } from 'react'
import Link from 'next/link'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard, DemoResetButton } from '@study/demo-kit'
import { useSlotObservation } from '../hooks/useSlotObservation'
import { judge } from '../lib/judge'
import { BASE } from '../lib/measure'
import { VerificationFooter } from './VerificationFooter'

const LINKS = [
  { href: '', label: '홈 (/)' },
  { href: '/shoes', label: '/shoes' },
  { href: '/settings', label: '/settings' },
  { href: '/strict', label: '/strict' },
  { href: '/strict/detail', label: '/strict/detail' },
]
const btn = 'rounded border border-zinc-300 px-3 py-1.5 text-xs dark:border-zinc-700'

export function PracticeFrame({ children, cart, promo }: { children: ReactNode; cart: ReactNode; promo: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const { load, soft, current, probes, probing, runProbes } = useSlotObservation(rootRef)
  const checks = judge(load, soft, probes)

  return (
    <DemoContainer className="space-y-4">
      <DemoGuideCard
        title="병렬 라우트 슬롯이 매칭되지 않을 때 default.tsx"
        concept="소프트 내비게이션에서는 Next.js가 슬롯마다 활성 상태를 기억해 매칭 페이지가 없는 슬롯을 그대로 둔다. 문서를 새로 로드하면 그 상태를 복구할 수 없으므로, 매칭되지 않는 슬롯 자리에 default.tsx가 렌더링된다."
        steps={[
          {
            step: 1,
            title: '[/shoes] 링크 클릭 (소프트 이동)',
            description: '@promo에는 shoes 페이지가 없는데도 기획전 배너가 그대로 유지되는지 본다.',
            actionBadge: 'Link 이동',
            observe: '@promo 카드의 data-screen이 home으로 남아 있는지',
            observeAt: 'playground',
          },
          {
            step: 2,
            title: '[하드 로드 프로브] 클릭, 또는 /shoes에서 새로고침',
            description: '같은 /shoes를 문서 요청으로 받으면 @promo 자리에 default.tsx 폴백이 나오는지 대조한다.',
            actionBadge: '전체 문서 GET',
            observe: '@promo가 default로 바뀌고 응답이 200인지',
            observeAt: 'verification',
          },
          {
            step: 3,
            title: '[/strict] → [/strict/detail] 이동과 하드 로드 비교',
            description: '먼저 /strict에서 @side를 활성화한 뒤 /strict/detail로 소프트 이동하면 슬롯이 유지된다. 같은 URL의 문서 요청은 strict/@side/default.tsx의 notFound()로 404가 된다.',
            actionBadge: 'notFound()',
            observe: '@side가 유지되는지, 프로브 응답 상태가 404인지',
            observeAt: 'verification',
          },
        ]}
      />

      <DemoPlaygroundCard title="children + @cart + @promo 슬롯 조합 (실제 병렬 라우트)">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {LINKS.map((l) => (
            <Link key={l.label} href={`${BASE}${l.href}`} className={btn}>
              {l.label}
            </Link>
          ))}
          <button type="button" onClick={runProbes} disabled={probing} className={`${btn} cursor-pointer`}>
            {probing ? '요청 중...' : '하드 로드 프로브 (/shoes, /strict/detail)'}
          </button>
          <DemoResetButton label="새로고침 (하드 로드)" />
        </div>
        <p className="mb-3 text-xs text-zinc-500">
          현재 화면 진입 방식:{' '}
          <strong>{!current ? '측정 중' : current.via === 'load' ? `문서 로드 (${current.path})` : `소프트 이동 (${current.path})`}</strong>
        </p>
        <div ref={rootRef} className="grid gap-3 sm:grid-cols-3">
          <div className="sm:col-span-1">{children}</div>
          {cart}
          {promo}
        </div>
      </DemoPlaygroundCard>

      <VerificationFooter checks={checks} />
    </DemoContainer>
  )
}
