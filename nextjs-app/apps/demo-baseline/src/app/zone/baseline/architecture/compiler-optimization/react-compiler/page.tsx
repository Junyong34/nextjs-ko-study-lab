import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ArchReactCompilerDemo } from './components/ArchReactCompilerDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"React Compiler 자동 메모이제이션 및 렌더링 최적화"}
        concept={"Next.js에 내장된 React Compiler(실험적 활성화)가 컴포넌트의 JSX와 연산 결과를 빌드 타임에 자동 메모이제이션하여, 수동 useMemo / useCallback 작성 없이도 불필요한 리렌더링을 0건으로 최적화합니다."}
        steps={[
          {
            step: 1,
            title: "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 상품 선택",
            description: "컴파일러 최적화가 적용된 카탈로그 컴포넌트에서 품목을 선택합니다.",
            actionBadge: "상품 선택",
          },
          {
            step: 2,
            title: "[+] 또는 [-] 버튼으로 수량 변경 인터랙션 실행",
            description: "상태 변경 시 하위 컴포넌트 리렌더링 차단 여부를 테스트합니다.",
            actionBadge: "수량 변경",
          },
          {
            step: 3,
            title: "[동작 실행] 클릭으로 비즈니스 로직 동기화",
            description: "자동 메모이제이션된 핸들러를 통해 로그를 기록합니다.",
            actionBadge: "동작 실행",
          },
          {
            step: 4,
            title: "수동 useMemo 없는 자동 세분화 메모이제이션(Fine-grained Memo) 관찰",
            description: "컴파일러가 의존성 배열을 자동 분석하여 값이 변경되지 않은 형제 UI 영역의 렌더링이 건너뛰어지는지 검증합니다.",
            actionBadge: "컴파일러 최적화 검증",
            observe: "React Compiler 자동 메모이제이션에 따른 불필요한 컴포넌트 리렌더링 건너뜀 및 상태 동기화 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"React Compiler 자동 메모이제이션 최적화 실습"}>
        <ArchReactCompilerDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
