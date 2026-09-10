import type { Metadata } from 'next'
import React from 'react'
import { getDemoMetadata } from '@study/demos'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { ImagePriorityLcpDemo } from './components/ImagePriorityLcpDemo'

export const metadata: Metadata = getDemoMetadata('baseline', 'components/image/priority-lcp-preload')

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="next/image priority(deprecated) / preload로 LCP 이미지 사전 로드"
        concept={
          'next/image의 priority는 Next.js 16부터 deprecated되어 preload로 대체됐습니다. ' +
          '두 prop 모두 실제로 <head>에 <link rel="preload">를 삽입하고 <img>의 loading="lazy" 강제를 해제합니다 — 아래에서 이 변화를 직접 document API로 읽어 확인합니다.'
        }
        steps={[
          {
            step: 1,
            title: '[기본값] 상태 확인',
            description: 'priority·preload를 아무것도 지정하지 않은 기본 상태의 히어로 이미지를 확인합니다.',
            actionBadge: '기본값 확인',
          },
          {
            step: 2,
            title: '[priority] 버튼 클릭',
            description: 'Next.js 16에서 deprecated된 레거시 prop으로 전환해 실제 DOM 변화를 관찰합니다.',
            actionBadge: 'priority 전환',
          },
          {
            step: 3,
            title: '[preload] 버튼 클릭',
            description: '현재 권장되는 대체 prop으로 전환해 priority와 동일한 실제 동작이 재현되는지 확인합니다.',
            actionBadge: 'preload 전환',
            observe: '3단 검증 패널에서 document.head의 실제 <link rel="preload"> 존재 여부와 <img>의 loading 속성이 next/image 소스코드가 명시한 기대값과 일치하는지 확인',
            observeAt: 'verification',
          },
        ]}
      />
      <ImagePriorityLcpDemo />
    </DemoContainer>
  )
}
