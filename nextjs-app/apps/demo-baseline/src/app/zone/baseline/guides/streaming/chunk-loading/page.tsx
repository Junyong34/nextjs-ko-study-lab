import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/streaming/chunk-loading')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ChunkLoadingDemo } from './components/ChunkLoadingDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"점진적 HTML 청크 스트리밍 및 Suspense 경계"}
        concept={"서버에서 느린 백엔드 API(800ms) 대기 중에도 빠른 정적 셸을 먼저 브라우저로 전송하고, 준비된 HTML 청크를 <script> 삽입 방식으로 스트리밍 교체합니다."}
        steps={[
          {
            step: 1,
            title: "초기 빠른 셸 청크(헤더/내비게이션) 수신 확인",
            description: "서버 통신 지연 없이 브라우저에 첫 번째 HTML 청크가 렌더링되는 것을 확인합니다.",
            actionBadge: "초기 셸 수신",
          },
          {
            step: 2,
            title: "[다음 청크 수신] 버튼 클릭으로 후속 스트림 로딩 시뮬레이션",
            description: "데이터 패칭 중인 상품 카탈로그 영역으로 후속 HTML 청크를 전달합니다.",
            actionBadge: "청크 수신",
          },
          {
            step: 3,
            title: "800ms 후 인라인 스트리밍 청크 교체 마운트 관찰",
            description: "비동기 데이터가 서버에서 완료되어 브라우저의 스켈레톤 영역이 실제 상품 카드로 즉시 치환되는 과정을 확인합니다.",
            actionBadge: "스트리밍 완료",
            observe: "800ms 지연 후 서버로부터 전송된 후속 HTML 청크가 클라이언트 DOM에 인라인 교체 렌더링되는 과정 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"Suspense 스트리밍과 로딩 청크 순차 처리 실습"}>
        <ChunkLoadingDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
