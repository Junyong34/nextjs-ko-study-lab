import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { CacheLifeHoursDemo } from './components/CacheLifeHoursDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"Cache Components의 cacheLife 프로필 기반 정적 캐싱"}
        concept={"Next.js 16의 'use cache' 지시어와 cacheLife('hours') 프로필을 선언하여 컴포넌트 단위로 stale(1시간), revalidate(1시간), expire(1일) 수명 주기를 정밀 제어합니다."}
        steps={[
          {
            step: 1,
            title: "[cacheLife('hours')] 프로필 설정 점검",
            description: "컴포넌트 함수 상단에 선언된 use cache 지시어와 시간 단위 캐시 프로필 구성을 확인합니다.",
            actionBadge: "프로필 점검",
          },
          {
            step: 2,
            title: "[컴포넌트 캐시 패치 실행] 클릭",
            description: "독립적인 캐시 수명 주기를 갖는 상품 프로모션 블록을 호출하여 캐시 생성 시점을 기록합니다.",
            actionBadge: "캐시 패치",
          },
          {
            step: 3,
            title: "cacheLife 수명 주기에 따른 컴포넌트 캐시 HIT 관찰",
            description: "정의된 수명 주기(hours) 동안 서버 리렌더링 없이 즉각 캐시 결과가 반환되는지 확인합니다.",
            actionBadge: "캐시 HIT 검증",
            observe: "cacheLife('hours') 프로필 적용에 따른 컴포넌트 수준 캐시 응답(0ms HIT) 및 만료 주기 메타데이터 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"Next.js 16 cacheLife('hours') 프로필 기반 수명 제어 실습"}>
        <CacheLifeHoursDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
