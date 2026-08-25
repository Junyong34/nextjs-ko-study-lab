import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { UseServerInsertedHtmlDemo } from './components/UseServerInsertedHtmlDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title={"useServerInsertedHTML 훅을 통한 서버 사이드 HTML 헤드 스타일 주입"}
        concept={"next/navigation의 useServerInsertedHTML() 훅을 사용하여 CSS-in-JS 라이브러리가 런타임에 수집한 중요 스타일 규칙을 스트리밍 HTML 초기 청크의 <head>에 직접 인라인 주입합니다."}
        steps={[
          {
            step: 1,
            title: "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 상품 선택",
            description: "useServerInsertedHTML 스타일 레지스트리가 연결된 상품을 선택합니다.",
            actionBadge: "상품 선택",
          },
          {
            step: 2,
            title: "[+] 또는 [-] 버튼으로 수량 변경",
            description: "컴포넌트 리렌더링 시 수집되는 스타일 태그 생성을 트리거합니다.",
            actionBadge: "수량 변경",
          },
          {
            step: 3,
            title: "[동작 실행] 클릭으로 스타일 주입 서버 액션 실행",
            description: "서버 렌더링 사이클에 맞춰 헤드 스타일 주입 핸들러를 실행합니다.",
            actionBadge: "동작 실행",
          },
          {
            step: 4,
            title: "HTML <head> 내 동적 <style> 태그 주입 및 스타일 FOUC 방어 관찰",
            description: "클라이언트 하이드레이션 전에 이미 스타일이 적용되어 화면 깜빡임이 발생하지 않는지 검증합니다.",
            actionBadge: "스타일 주입 검증",
            observe: "useServerInsertedHTML을 통한 서버 HTML <head> 내 인라인 스타일 태그 주입 및 로그 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"useServerInsertedHTML SSR 인라인 스타일/스크립트 주입 실습"}>
        <UseServerInsertedHtmlDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
