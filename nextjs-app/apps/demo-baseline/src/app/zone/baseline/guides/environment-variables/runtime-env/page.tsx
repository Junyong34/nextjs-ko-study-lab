import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { RuntimeEnvDemo } from './components/RuntimeEnvDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"동적 런타임 환경변수(process.env) 실시간 참조"}
        concept={"서버 컴포넌트와 Server Action은 빌드 시점이 아닌 실제 요청 시점의 런타임 환경변수(process.env.API_ENDPOINT)를 동적으로 참조하여 컨테이너 재빌드 없이 인프라 설정을 변경합니다."}
        steps={[
          {
            step: 1,
            title: "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택",
            description: "런타임 설정이 적용된 쇼핑몰 카탈로그 품목을 선택합니다.",
            actionBadge: "품목 선택",
          },
          {
            step: 2,
            title: "[+] 또는 [-] 버튼으로 테스트 수량 조절",
            description: "런타임 환경변수를 통해 연결된 엔드포인트로 전송할 수량을 설정합니다.",
            actionBadge: "수량 조절",
          },
          {
            step: 3,
            title: "[동작 실행] 클릭으로 런타임 환경변수 기반 요청 실행",
            description: "process.env에서 실시간으로 읽어온 호스트 주소로 백엔드 통신을 수행합니다.",
            actionBadge: "런타임 요청",
          },
          {
            step: 4,
            title: "실시간 런타임 환경변수 반영 및 API 통신 성공 로그 관찰",
            description: "빌드 타임 고정값이 아닌 런타임 환경변수가 정상 반영된 API 트리거 로그를 확인합니다.",
            actionBadge: "환경변수 검증",
            observe: "서버 런타임 process.env 참조를 통한 동적 API 트리거 및 장바구니 동기화 성공 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"process.env 런타임 환경변수 동적 참조 실습"}>
        <RuntimeEnvDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
