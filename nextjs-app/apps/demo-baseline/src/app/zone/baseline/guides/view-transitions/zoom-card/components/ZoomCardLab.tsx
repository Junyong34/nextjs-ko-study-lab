'use client'

import type { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard, DemoResetButton } from '@study/demo-kit'
import { BASE, MORPH_CLASS } from '../data'
import { useTransitionProbe } from '../hooks/useTransitionProbe'
import { TransitionLog } from './TransitionLog'
import { Verification } from './Verification'

// 공유 요소 morph를 겨냥하는 CSS. 기본 morph(250ms)가 눈에 보이도록 늘리고 reduced motion에서는 줄인다.
const MORPH_CSS = `
::view-transition-group(.${MORPH_CLASS}) { animation-duration: 600ms; }
@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(.${MORPH_CLASS}) { animation-duration: 0.01ms; }
}`

export function ZoomCardLab({ children }: { children: ReactNode }) {
  const probe = useTransitionProbe()
  const router = useRouter()

  const reset = () => {
    probe.reset()
    router.push(BASE)
  }

  return (
    <DemoContainer className="space-y-6">
      <style>{MORPH_CSS}</style>
      <DemoGuideCard
        title="View Transition으로 썸네일을 상세 이미지로 확대"
        concept="목록 썸네일과 상세 hero에 같은 name의 <ViewTransition>을 두면, 라우트 이동 때 브라우저가 두 요소를 하나의 요소로 보고 크기와 위치를 보간한다. 실제 startViewTransition 호출과 전환 중 pseudo 애니메이션을 측정해 확인한다."
        steps={[
          { step: 1, title: '썸네일 목록 확인', description: '세 장의 카드는 실제 <Link>이며 각 이미지에 고유한 ViewTransition name이 붙어 있습니다.', actionBadge: '초기 상태', observe: '관측 로그의 지원 여부와 reduced motion 값', observeAt: 'playground' },
          { step: 2, title: '[썸네일] 클릭', description: '상세 라우트로 이동하며 같은 이미지가 확대됩니다. 이동은 일반 라우트 전환입니다.', actionBadge: '확대 이동', observe: '카드가 hero 위치로 확대되는 morph', observeAt: 'playground' },
          { step: 3, title: '[← 목록으로] 클릭', description: '반대로 축소되며 목록으로 돌아옵니다.', actionBadge: '축소 이동' },
          { step: 4, title: '검증 패널 확인', description: 'startViewTransition 호출, ready, 공유 name의 old·new·group pseudo 쌍을 확인합니다. [예제 초기화]는 기록을 지우고 목록으로 돌아갑니다.', actionBadge: '판정', observeAt: 'verification' },
        ]}
      />
      <DemoPlaygroundCard title="사진 목록 → 상세 라우트 (실제 <Link> 이동)">
        <div className="mb-3 flex justify-end">
          <DemoResetButton onReset={reset} />
        </div>
        {children}
        <TransitionLog probe={probe} />
      </DemoPlaygroundCard>
      <Verification probe={probe} />
    </DemoContainer>
  )
}
