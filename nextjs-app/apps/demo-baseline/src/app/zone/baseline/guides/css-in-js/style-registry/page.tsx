import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { StyleRegistryDemo } from './components/StyleRegistryDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"CSS-in-JS 스타일 레지스트리 및 SSR 스타일 사전 주입"}
        concept={"useServerInsertedHTML 훅을 사용하는 Style Registry를 구축하여 styled-components 또는 Emotion이 생성한 CSS 규칙을 첫 SSR HTML <head>에 사전 주입하여 스타일 깨짐을 방지합니다."}
        steps={[
          {
                    "step": 1,
                    "title": "SSR HTML <head>에 주입된 <style> 태그 확인 및 클라이언트 하이드레이션 스타일 일치 여부 점검",
                    "description": "useServerInsertedHTML을 통해 첫 번째 청크와 함께 전달된 CSS 규칙을 점검합니다. 클라이언트 마운트 후에도 동일한 스타일 클래스가 유지되는지 확인합니다.",
                    "actionBadge": "주입 스타일 확인"
          },
          {
                    "step": 2,
                    "title": "클래스 네임 충돌 없는 CSS-in-JS 사전 렌더링 관찰",
                    "description": "브라우저에서 렌더링 시작 전 이미 스타일이 적용되어 깜빡임 없이 완성된 디자인을 검증합니다.",
                    "actionBadge": "스타일 검증",
                    "observe": "useServerInsertedHTML로 주입된 style data-styled 태그 및 서버-클라이언트 스타일 일치 관찰",
                    "observeAt": "playground"
          }
]}
      />
      <DemoPlaygroundCard title={"Style Registry를 통한 CSS-in-JS SSR 스타일 주입 실습"}>
        <StyleRegistryDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
