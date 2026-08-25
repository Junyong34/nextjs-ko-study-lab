import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { GenerateMetadataInheritDemo } from './components/GenerateMetadataInheritDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="부모 metadata 상속 및 canonical URL 오버라이드"
        concept="generateMetadata의 parent 인자(parent: ResolvingMetadata)를 await하여 상위 레이아웃의 공통 SEO 메타태그를 100% 상속받고 canonical URL만 개별 오버라이드합니다."
        steps={[
          {
                    "step": 1,
                    "title": "상위 레이아웃 메타데이터 기본값 점검 및 ResolvingMetadata를 통한 부모 메타 상속 실행",
                    "description": "루트 레이아웃에서 정의된 siteName, 기본 openGraph 이미지 등 공통 메타 설정을 확인합니다. 하위 페이지에서 await parent를 호출하여 상위 메타 필드를 안전하게 병합합니다.",
                    "actionBadge": "상위 메타 점검"
          },
          {
                    "step": 2,
                    "title": "canonical URL 및 title 템플릿 오버라이드 관찰",
                    "description": "상속된 사이트명에 하위 페이지 고유의 canonical 링크와 세부 타이틀이 결합된 최종 메타를 확인합니다.",
                    "actionBadge": "최종 메타 검증",
                    "observe": "부모 레이아웃의 공통 메타데이터를 상속받아 canonical URL이 올바르게 오버라이드됨",
                    "observeAt": "playground"
          }
]}
      />
      <DemoPlaygroundCard title={"부모 metadata 상속 및 canonical URL 오버라이드 실습"}>
        <GenerateMetadataInheritDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
