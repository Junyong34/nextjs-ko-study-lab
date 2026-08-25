import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { PreventFlashDemo } from './components/PreventFlashDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"인라인 블로킹 스크립트를 통한 다크모드 깜빡임(FOUC) 방지"}
        concept={"HTML <head> 내부에 동기식 인라인 스크립트를 배치하여 브라우저 첫 페인트 전에 localStorage 테마 값을 읽어 <html> 클래스를 주입함으로써 흰색 화면 번쩍임(Flash of Unstyled Content)을 0ms로 차단합니다."}
        steps={[
          {
            step: 1,
            title: "현재 테마(dark) 및 주입된 인라인 스크립트 점검",
            description: "하이드레이션 전에 실행되는 동기 테마 감지 스크립트 상태를 확인합니다.",
            actionBadge: "테마 상태 확인",
          },
          {
            step: 2,
            title: "[테마 토글] 버튼 클릭",
            description: "라이트 모드와 다크 모드 간 전환을 실행하여 localStorage 및 <html> 클래스를 변경합니다.",
            actionBadge: "테마 토글",
          },
          {
            step: 3,
            title: "새로고침 시 FOUC 없는 0ms 다크모드 즉각 적용 관찰",
            description: "페이지 새로고침 시에도 흰색 화면 플래시 없이 즉시 다크 배경이 렌더링되는지 검증합니다.",
            actionBadge: "깜빡임 방지 검증",
            observe: "테마 토글 후 새로고침 시 인라인 스크립트에 의해 FOUC 깜빡임 없이 즉각 적용되는 테마 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"다크모드 SSR 인라인 스크립트 FOUC 방지 실습"}>
        <PreventFlashDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
