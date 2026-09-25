import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'edge/v8-lightweight/global-web-apis')

import React from 'react'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { WebApisLab } from './components/WebApisLab'
import { ConceptCard } from './components/ConceptCard'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="Edge Runtime V8 Web API 실행"
        concept="Edge Runtime에는 Node.js 모듈 대신 브라우저와 같은 Web 표준 API가 있습니다. runtime = 'edge'인 Route Handler 두 개에 같은 입력을 보내 해시·인코딩·스트림·타이머 API의 실제 결과를 받고, 브라우저에서 같은 코드로 계산한 값과 비교합니다."
        steps={[
          {
            step: 1,
            title: '페이지 진입 시 기본 입력으로 자동 측정',
            description: './probe가 Web API 11개 항목을 edge 안에서 호출한 결과를, ./stream이 청크 5개를 400ms 간격으로 흘려보냅니다.',
            actionBadge: '실측',
            observe: '표 상단의 NEXT_RUNTIME=edge, typeof EdgeRuntime=string과 항목별 OK',
            observeAt: 'playground',
          },
          {
            step: 2,
            title: '입력을 바꾸고 [Edge에서 실행] 클릭',
            description: '한글·이모지를 넣으면 UTF-8 바이트 수와 Base64가 달라집니다. edge와 브라우저의 SHA-256이 같은지 봅니다.',
            actionBadge: '재측정',
            observe: 'SHA-256 hex, 바이트 수, Base64가 edge·브라우저 두 줄에서 동일',
            observeAt: 'playground',
          },
          {
            step: 3,
            title: '스트림 타임라인과 검증 패널 확인',
            description: '청크 도착 시각이 약 400ms씩 벌어지는지, 여섯 검증 항목이 모두 일치하는지 확인합니다.',
            actionBadge: '결과 검증',
            observe: '점진 도착 간격 ≥ 960ms를 포함해 모든 항목이 일치하면 검증 완료',
            observeAt: 'verification',
          },
        ]}
      />
      <WebApisLab />
      <ConceptCard />
    </DemoContainer>
  )
}
