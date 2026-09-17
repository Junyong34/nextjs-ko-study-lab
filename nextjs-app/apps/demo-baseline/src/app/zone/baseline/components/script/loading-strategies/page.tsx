import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'components/script/loading-strategies')

import React from 'react'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { ScriptTimingWorkspace } from './components/ScriptTimingWorkspace'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="next/script 로딩 전략 상세 비교 (beforeInteractive / afterInteractive / lazyOnload / worker)"
        concept="4가지 strategy로 동일한 프로브 스크립트를 동시에 로드하고, 각 스크립트가 실제로 실행된 performance.now() 시각을 하이드레이션 완료 시각과 비교해 로딩 순서를 실측으로 증명합니다."
        steps={[
          {
            step: 1,
            title: '[다시 측정 (새로고침)] 페이지 새로고침으로 측정 시작',
            description: '4개 strategy의 스크립트가 동시에 마운트되고, 실행되는 즉시 각자 실제 로드 시각을 보고합니다.',
            actionBadge: '측정 시작',
          },
          {
            step: 2,
            title: '실습 화면의 실측 타임라인 확인',
            description: 'beforeInteractive → afterInteractive → lazyOnload 순으로 실제 로드 이벤트가 쌓이는 것을 관찰합니다.',
            actionBadge: '순서 관찰',
          },
          {
            step: 3,
            title: 'worker 전략과 hydration 대비 선후 관계 검증',
            description: 'beforeInteractive가 hydration보다 먼저, afterInteractive가 이후에 로드되는지, worker가 실제로 로드되지 않는지 확인합니다.',
            actionBadge: 'beforeInteractive vs hydration',
            observe: '3단 검증 패널에서 실측 순서가 공식 문서 기대와 일치하는지 대조',
            observeAt: 'verification',
          },
        ]}
      />
      <ScriptTimingWorkspace />
    </DemoContainer>
  )
}
