import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { UseSearchParamsDebounceDemo } from './components/UseSearchParamsDebounceDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="useTransition 연동 디바운스 검색 쿼리 동기화"
        concept="React 19 useTransition과 300ms 디바운스를 결합하여 사용자 키보드 입력 중 UI 프리징 없이 URL searchParams를 논블로킹으로 동기화합니다."
        steps={[
          {
            step: 1,
            title: "[상품명을 입력하세요 (예: 맥북, 모니터)] 검색창 입력",
            description: "검색 입력창에 검색어를 연속으로 타이핑합니다.",
            actionBadge: "키보드 입력",
          },
          {
            step: 2,
            title: "300ms 디바운스 및 startTransition 백그라운드 전환",
            description: "300ms 대기 후 startTransition을 통해 URL 쿼리 파라미터가 비동기 백그라운드로 갱신됩니다.",
            actionBadge: "전환 실행",
          },
          {
            step: 3,
            title: "입력 반응성 및 실시간 검색 결과 관찰",
            description: "입력창 타이핑 지연 없이 URL searchParams와 검색 결과 목록이 부드럽게 동기화되는지 확인합니다.",
            actionBadge: "결과 검증",
            observe: "300ms 디바운스 후 URL 쿼리와 실시간 검색 결과 리스트가 논블로킹으로 갱신됨",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title={"useTransition 연동 디바운스 검색 쿼리 동기화 실습"}>
        <UseSearchParamsDebounceDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
