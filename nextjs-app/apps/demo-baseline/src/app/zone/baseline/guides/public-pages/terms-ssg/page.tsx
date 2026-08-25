import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { TermsSsgDemo } from './components/TermsSsgDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"약관 및 개인정보처리방침 공공 정적 페이지 100% SSG 서빙"}
        concept={"동적 연산이 불필요한 이용약관 및 개인정보처리방침 문서를 빌드 시점 100% 정적 페이지로 생성하여 서버 리소스를 전혀 소모하지 않고 글로벌 CDN 에지에서 즉시 배포합니다."}
        steps={[
          {
            step: 1,
            title: "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 상품 선택",
            description: "약관 동의가 필요한 쇼핑몰 정적 주문 환경에서 품목을 선택합니다.",
            actionBadge: "품목 선택",
          },
          {
            step: 2,
            title: "[+] 또는 [-] 버튼으로 수량 변경",
            description: "정적 약관 페이지와 연동된 결제 옵션을 설정합니다.",
            actionBadge: "수량 설정",
          },
          {
            step: 3,
            title: "[동작 실행] 클릭으로 약관 동의 및 주문 처리",
            description: "정적 페이지 기반 워크플로에서 액션을 트리거합니다.",
            actionBadge: "약관 동의 실행",
          },
          {
            step: 4,
            title: "100% 정적 HTML 서빙 및 서버 부하 제로 관찰",
            description: "트래픽 폭주 시에도 약관 페이지가 다운되지 않고 무제한 동시 접속을 수용하는 정적 안정성을 확인합니다.",
            actionBadge: "안정성 검증",
            observe: "100% 빌드 타임 정적 SSG 생성을 통한 공공 약관 페이지의 서버 부하 제로 서빙 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"이용약관 정적 SSG 페이지 생성 및 캐시 실습"}>
        <TermsSsgDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
