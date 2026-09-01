import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { MigrateCacheDemo } from './components/MigrateCacheDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"unstable_cache에서 use cache 지시어로의 현대화 마이그레이션"}
        concept={"복잡한 키 배열과 함수 래핑이 필요했던 레거시 unstable_cache()를 React 19 선언적 'use cache' 지시어로 리팩토링하여 인자 자동 직렬화와 직관적인 캐시 경계를 구성합니다."}
        steps={[
          {
            step: 1,
            title: "레거시 [unstable_cache] 방식 코드 및 호출 점검",
            description: "키 배열과 revalidation 태그를 수동으로 전달하던 레거시 캐싱 패턴을 점검합니다.",
            actionBadge: "레거시 점검",
          },
          {
            step: 2,
            title: "모던 [use cache] 선언적 캐싱 방식 호출",
            description: "함수 스코프 내 'use cache' 지시어를 추가하여 동일한 데이터 캐싱을 수행합니다.",
            actionBadge: "모던 캐시 실행",
          },
          {
            step: 3,
            title: "두 캐싱 방식의 결과 동등성 및 코드 간결성 대조",
            description: "반환된 데이터의 동일성과 인자 자동 직렬화로 인한 안정성을 비교 검증합니다.",
            actionBadge: "마이그레이션 검증",
            observe: "unstable_cache와 use cache 호출 간 반환 데이터 일치 및 캐시 태그 자동 관리 결과 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"unstable_cache에서 Next.js 16 use cache로 마이그레이션 실습"}>
        <MigrateCacheDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
