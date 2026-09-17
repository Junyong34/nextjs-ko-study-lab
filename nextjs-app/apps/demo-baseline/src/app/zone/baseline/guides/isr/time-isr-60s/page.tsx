import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/isr/time-isr-60s')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { TimeIsrDemo } from './components/TimeIsrDemo'
import { VerificationFooter } from './components/VerificationFooter'

export const revalidate = 60

export default function DemoPage() {
  const renderId = Math.random().toString(36).slice(2, 8).toUpperCase()
  const generatedAt = new Date().toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
  })

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={'시간 기반 ISR(revalidate = 60) 점진적 정적 재생성'}
        concept={
          'export const revalidate = 60 설정을 통해 이 페이지 세그먼트의 렌더 결과를 60초간 캐시합니다. 60초가 지난 뒤 첫 요청은 기존 캐시(renderId)를 즉시 반환하면서 백그라운드에서 페이지를 재생성하고, 그 다음 요청부터 새 renderId로 교체됩니다.'
        }
        steps={[
          {
            step: 1,
            title: '현재 renderId, generatedAt 확인',
            description: '이 페이지가 마지막으로 재계산된 시점의 식별자와 시각을 확인합니다.',
            actionBadge: '초기 상태 확인',
          },
          {
            step: 2,
            title: '60초 이내에 새로고침',
            description: 'revalidate 기간 안에는 renderId가 그대로 유지되는지 확인합니다.',
            actionBadge: 'ISR 캐시 유지 확인',
          },
          {
            step: 3,
            title: '60초 이후 새로고침',
            description: 'revalidate 기간이 지난 뒤 재요청하면 백그라운드 재생성이 트리거되어 renderId가 바뀌는지 확인합니다.',
            actionBadge: '백그라운드 재생성 검증',
            observe: '60초 전후 renderId·generatedAt 값의 변화를 직접 대조 관찰',
            observeAt: 'playground',
          },
        ]}
      />
      <DemoPlaygroundCard title={'60초 주기 상품 상세 증분 정적 재생성 (ISR) 실습'}>
        <TimeIsrDemo renderId={renderId} generatedAt={generatedAt} />
      </DemoPlaygroundCard>
      <VerificationFooter
        isLoaded={Boolean(renderId)}
        actual={`- renderId: ${renderId}\n- generatedAt: ${generatedAt}\n- revalidate: 60초`}
        expected="60초 이내 재방문은 같은 renderId, 60초 경과 후 재방문은 새 renderId를 반환해야 한다."
      />
    </DemoContainer>
  )
}
