'use client'
import React, { useState } from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { HydrationBoundaryDemo } from './components/HydrationBoundaryDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  const [state, setState] = useState<{ mounted: boolean; clientOnlyValue: string | null }>({ mounted: false, clientOnlyValue: null })

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"Hydration 경계 및 클라이언트 마운트 생명주기"}
        concept={"서버에서 사전 렌더링된 정적 HTML에 브라우저의 React 이벤트 리스너가 연결되는(Hydration) 과정을 추적하고, useEffect 마운트 전후의 UI 상태 차이를 확인합니다."}
        steps={[
          {
            step: 1,
            title: "서버 렌더링 정적 HTML 초기 스냅샷 확인",
            description: "Hydration 전 서버에서 전달된 초기 마크업과 텍스트 내용을 확인합니다.",
            actionBadge: "초기 HTML 확인",
          },
          {
            step: 2,
            title: "useEffect(() => setMounted(true), [])가 자동 실행됨",
            description: "버튼 조작 없이, Hydration이 끝난 뒤 useEffect가 자동으로 실행되어 브라우저 전용 값을 채웁니다.",
            actionBadge: "자동 Hydration",
          },
          {
            step: 3,
            title: "서버 스냅샷과 다른 브라우저 전용 값(뷰포트 크기) 확인",
            description: "서버는 window에 접근할 수 없어 렌더링하지 못했던 값이 마운트 후에만 나타나는지 검증합니다.",
            actionBadge: "생명주기 검증",
            observe: "마운트 전(서버 HTML) vs 마운트 후(클라이언트 전용 값)의 실제 차이 관찰",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title={"Hydration 경계와 번들 격리 예제"}>
        <HydrationBoundaryDemo onMountedChange={(mounted, clientOnlyValue) => setState({ mounted, clientOnlyValue })} />
      </DemoPlaygroundCard>
      <VerificationFooter
        isMatched={state.mounted}
        actual={state.mounted ? `- mounted: true\n- 브라우저 전용 값(서버는 알 수 없음): ${state.clientOnlyValue}` : undefined}
        expected="서버 HTML에는 없던 브라우저 전용 값(뷰포트 크기, 시각)이 Hydration 뒤 자동으로 나타나야 한다."
      />
    </DemoContainer>
  )
}
