'use client'
import React, { useState } from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { PrefetchModesDemo } from './components/PrefetchModesDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  const [hoverCount, setHoverCount] = useState(0)

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"뷰포트 자동 prefetch vs prefetch={false} 호버 패칭 대조"}
        concept={"Next.js <Link>의 기본 동작인 뷰포트 교차 시점 자동 prefetch(true)와 대역폭을 절약하는 prefetch={false}(호버 시점 패칭)의 네트워크 요청 타이밍 차이를 대조합니다."}
        steps={[
          {
                    "step": 1,
                    "title": "뷰포트 진입 링크(기본 prefetch) 네트워크 상태 확인 및 [prefetch=false] 링크에 마우스 호버 실행",
                    "description": "화면에 노출된 <Link> 요소가 뷰포트 교차 즉시 RSC 페이로드를 사전 수신했는지 확인합니다. 사전 다운로드가 차단된 링크에 마우스를 올려 호버 시점에 네트워크 요청이 발생하는지 테스트합니다.",
                    "actionBadge": "자동 prefetch 점검"
          },
          {
                    "step": 2,
                    "title": "자동 prefetch(0ms)와 호버 패칭의 네트워크 타이밍 관찰",
                    "description": "클릭 시점의 즉각 전환 속도와 불필요한 초기 데이터 절감 효과를 비교 검증합니다.",
                    "actionBadge": "동작 대조 검증",
                    "observe": "기본 Link의 뷰포트 진입 즉시 prefetch와 prefetch={false}의 호버 시점 온디맨드 패칭 로그 대조 관찰",
                    "observeAt": "playground"
          }
]}
      />
      <DemoPlaygroundCard title={"뷰포트 진입 시 자동 prefetch와 prefetch={false} 비교 실습"}>
        <PrefetchModesDemo hoverCount={hoverCount} onHover={() => setHoverCount((c) => c + 1)} />
      </DemoPlaygroundCard>
      <VerificationFooter
        isMatched={hoverCount > 0 ? true : undefined}
        actual={hoverCount > 0 ? `- prefetch={false} 링크 호버 감지: ${hoverCount}회\n- Network 탭에서 hover 시점 요청과 기본 링크의 뷰포트 진입 시점 요청을 직접 대조하세요` : undefined}
      />
    </DemoContainer>
  )
}
