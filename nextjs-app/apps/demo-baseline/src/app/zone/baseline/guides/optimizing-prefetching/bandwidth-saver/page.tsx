'use client'
import React, { useState } from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { BandwidthSaverDemo } from './components/BandwidthSaverDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  const [optimized, setOptimized] = useState(false)
  const [hoverCount, setHoverCount] = useState(0)

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"prefetch={false} 선택 적용을 통한 프리페칭 대역폭 절약"}
        concept={"대규모 카탈로그 링크 그리드에 prefetch={false}를 적용하면 뷰포트에 다수 진입해도 자동 프리페치가 발생하지 않고, 호버 시점에만 온디맨드로 요청됩니다. 실제 절감 비율은 카탈로그 규모에 따라 다르므로 Network 탭에서 직접 측정해야 합니다."}
        steps={[
          {
            step: 1,
            title: "기본 모드에서 12개 링크의 뷰포트 진입 관찰",
            description: "체크박스를 끈 상태에서 기본 prefetch 동작을 확인합니다.",
            actionBadge: "기본 모드 확인",
          },
          {
            step: 2,
            title: "[최적화 모드] 체크박스 켜기",
            description: "12개 링크 모두 prefetch={false}로 전환됩니다.",
            actionBadge: "최적화 모드 전환",
          },
          {
            step: 3,
            title: "Network 탭에서 두 모드의 실제 요청 수 대조",
            description: "과장된 고정 수치 대신 브라우저 Network 탭에서 직접 요청 수를 비교합니다.",
            actionBadge: "실측 대조",
            observe: "기본 모드와 최적화 모드의 실제 prefetch 요청 발생 시점 차이 관찰",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title={"대규모 카탈로그 대역폭 절약 최적화 실습"}>
        <BandwidthSaverDemo optimized={optimized} onToggle={setOptimized} hoverCount={hoverCount} onHover={() => setHoverCount((c) => c + 1)} />
      </DemoPlaygroundCard>
      <VerificationFooter
        isMatched={optimized ? hoverCount > 0 : undefined}
        actual={optimized ? `- 최적화 모드 적용됨\n- 호버 감지 횟수: ${hoverCount}\n- 실제 요청 수 절감분은 Network 탭에서 직접 확인` : undefined}
        expected="prefetch={false} 적용 시 뷰포트 진입만으로는 요청이 발생하지 않고 호버 시점에만 발생해야 한다."
      />
    </DemoContainer>
  )
}
