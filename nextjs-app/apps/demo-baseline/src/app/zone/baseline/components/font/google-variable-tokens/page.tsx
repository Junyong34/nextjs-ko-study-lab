import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { FontGoogleVariableDemo } from './components/FontGoogleVariableDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"Google Fonts 가변 폰트 CSS 변수 연동"}
        concept={"Next.js 빌트인 컴포넌트 'Google Fonts 가변 폰트 CSS 변수 연동'을 활용하여 쇼핑몰의 성능, SEO, 폼 상호작용을 최적화하는 실무 구현입니다."}
        steps={[
          {
                    "step": 1,
                    "title": "컴포넌트 렌더링 점검",
                    "description": "빌트인 컴포넌트가 생성한 최종 HTML 마크업과 속성을 확인합니다.",
                    "actionBadge": "마크업 확인"
          },
          {
                    "step": 2,
                    "title": "동적 옵션 조작",
                    "description": "옵션(속성)을 변경하며 브라우저 동작 및 네트워크 최적화 효과를 관찰합니다.",
                    "actionBadge": "속성 변경"
          },
          {
                    "step": 3,
                    "title": "최적화 결과 대조",
                    "description": "CLS 방지, 자동 포맷 변환, 폼 데이터 직렬화 결과를 검증합니다.",
                    "actionBadge": "결과 검증"
          }
]}
      />
      <DemoPlaygroundCard title={"Google Fonts 가변 폰트 CSS 변수 연동 실습"}>
        <FontGoogleVariableDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
