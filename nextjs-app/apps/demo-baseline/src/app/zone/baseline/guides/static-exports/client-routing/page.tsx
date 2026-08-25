import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { StaticExportsDemo } from './components/StaticExportsDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"정적 내보내기(output: 'export') 환경의 클라이언트 라우팅"}
        concept={"Node.js 서버 없이 순수 HTML/JS/CSS로 빌드되는 output: 'export' 환경에서 Next.js App Router가 히스토리 API 기반 클라이언트 SPA 라우팅을 부드럽게 유지합니다."}
        steps={[
          {
            step: 1,
            title: "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 상품 선택",
            description: "정적 내보내기 빌드로 생성된 카탈로그 품목을 선택합니다.",
            actionBadge: "상품 선택",
          },
          {
            step: 2,
            title: "[+] 또는 [-] 버튼으로 클라이언트 상태 변경",
            description: "서버 런타임 없이 브라우저 메모리 내에서 동작하는 인터랙션을 수행합니다.",
            actionBadge: "상태 조작",
          },
          {
            step: 3,
            title: "[동작 실행] 클릭으로 클라이언트 핸들러 실행",
            description: "정적 환경에서 클라이언트 라우터와 로컬 스토리지를 연동합니다.",
            actionBadge: "동작 실행",
          },
          {
            step: 4,
            title: "서버리스 정적 HTML 환경 내 클라이언트 라우팅 유지 관찰",
            description: "정적 S3/CDN 호스팅 환경에서도 화면 깜빡임 없이 SPA 라우팅과 상태가 온전히 동작함을 확인합니다.",
            actionBadge: "정적 배포 검증",
            observe: "output: 'export' 빌드 환경에서의 클라이언트 사이드 상태 보존 및 정적 라우팅 동작 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"output: 'export' 빌드 산출물 및 클라이언트 라우팅 실습"}>
        <StaticExportsDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
