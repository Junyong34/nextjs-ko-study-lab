import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ConfigOutputExportDemo } from './components/ConfigOutputExportDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="output: 'export' 정적 산출물 생성"
        concept="next.config.ts의 output: 'export' 설정을 통해 Node.js 서버 없이 S3/Nginx 정적 웹 호스팅 환경에 배포 가능한 순수 정적 HTML/CSS/JS 산출물을 빌드합니다."
        steps={[
          {
            step: 1,
            title: "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택",
            description: "정적 HTML로 내보내질 상품 컴포넌트를 선택합니다.",
            actionBadge: "상품 선택",
          },
          {
            step: 2,
            title: "[+] 수량 조절 후 [동작 실행] 클릭",
            description: "정적 익스포트(output: export) 빌드 규칙을 시뮬레이션합니다.",
            actionBadge: "정적 빌드",
          },
          {
            step: 3,
            title: "정적 HTML/JS 산출물 생성 및 서버리스 배포 관찰",
            description: "서버 런타임 의존성 없이 순수 정적 파일 구조로 배포 가능한지 실시간 로그에서 확인합니다.",
            actionBadge: "로그 검증",
            observe: "output: export 설정에 따라 완전한 정적 HTML/JS 산출물이 생성되어 서빙됨",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title={"output: 'export' 정적 산출물 생성 실습"}>
        <ConfigOutputExportDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
