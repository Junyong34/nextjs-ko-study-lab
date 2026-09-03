import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/videos/lazy-video-player')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { LazyVideoDemo } from './components/LazyVideoDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"Intersection Observer 기반 뷰포트 감지 비디오 지연 재생"}
        concept={"HTML5 <video> 요소에 Intersection Observer를 적용하여 사용자가 스크롤하여 화면에 비디오가 진입했을 때만 4K 동영상 스트림을 다운로드하고 자동 재생하여 모바일 데이터를 보호합니다."}
        steps={[
          {
            step: 1,
            title: "뷰포트 진입 전 대기 상태(대역폭 보존 중) 확인",
            description: "비디오가 뷰포트에 들어오기 전까지 네트워크 스트리밍이 차단된 상태를 확인합니다.",
            actionBadge: "대기 상태 점검",
          },
          {
            step: 2,
            title: "[자동재생 시뮬레이션] 버튼 클릭으로 뷰포트 교차 트리거",
            description: "비디오 플레이어가 화면 중심에 위치한 상황을 시뮬레이션하여 재생 상태로 전환합니다.",
            actionBadge: "재생 시뮬레이션",
          },
          {
            step: 3,
            title: "▶ 4K 고화질 홍보 영상 스트리밍 활성화 및 [일시정지] 관찰",
            description: "뷰포트 진입 시점에 동영상 청크 다운로드가 시작되고 일시정지 토글이 동작하는지 검증합니다.",
            actionBadge: "스트리밍 검증",
            observe: "자동재생 시뮬레이션 클릭 시 스트리밍 활성화(isPlaying: true) 및 일시정지 토글 동작 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"상품 홍보 영상 지연 로딩 및 자동 재생 실습"}>
        <LazyVideoDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
