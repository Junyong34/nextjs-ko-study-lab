import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { LazyModalDemo } from './components/LazyModalDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"next/dynamic을 통한 모달 다이얼로그 조건부 지연 로딩"}
        concept={"자주 열리지 않는 모달 컴포넌트를 next/dynamic({ ssr: false })으로 지연 로드하여 초기 번들에서 제외(0 KB)하고, 사용자가 모달 열기 버튼을 클릭하는 시점에만 비동기 청크를 다운로드합니다."}
        steps={[
          {
            step: 1,
            title: "초기 화면 로드 및 0 KB 모달 청크 미포함 상태 확인",
            description: "초기 번들에 모달 다이얼로그 라이브러리 코드가 번들링되지 않은 상태를 점검합니다.",
            actionBadge: "초기 상태 점검",
          },
          {
            step: 2,
            title: "[상품 리뷰 작성 모달 열기] 버튼 클릭",
            description: "모달 열기 액션을 트리거하여 동적 import 청크를 요청하고 모달을 렌더링합니다.",
            actionBadge: "모달 청크 로드",
          },
          {
            step: 3,
            title: "모달 다이얼로그 마운트 및 [닫기] 인터랙션 관찰",
            description: "동적으로 로드된 모달 UI가 정상 표시되고 닫기 버튼으로 메모리에서 해제되는 과정을 확인합니다.",
            actionBadge: "모달 렌더링 검증",
            observe: "모달 열기 버튼 클릭 시점에 비동기 다운로드되는 다이얼로그 컴포넌트 마운트 및 닫기 동작 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"결제 모달 next/dynamic 지연 로드 실습"}>
        <LazyModalDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
