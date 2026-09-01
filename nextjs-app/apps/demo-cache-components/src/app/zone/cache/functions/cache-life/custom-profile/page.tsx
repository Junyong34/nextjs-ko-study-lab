import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { CacheLifeCustomDemo } from './components/CacheLifeCustomDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="next.config.ts에서 custom cacheLife 프로필 정의 및 바인딩"
        concept="next.config.ts의 cacheLife 객체에 커스텀 프로파일(flashSale, catalog, reviews)을 정의하고 컴포넌트 내 cacheLife(profile)로 바인딩하여 5초~604800초 TTL을 제어합니다."
        steps={[
          {
            step: 1,
            title: "[flash-sale], [catalog], [reviews] 프리셋 버튼 선택",
            description: "커스텀 cacheLife 프로파일 프리셋을 선택하여 비즈니스 수명 구성을 전환합니다.",
            actionBadge: "프로파일 선택",
          },
          {
            step: 2,
            title: "next.config.ts 커스텀 수명(stale/revalidate/expire) 확인",
            description: "선택된 프로파일의 초 단위 stale, revalidate, expire 설정값을 확인합니다.",
            actionBadge: "설정값 점검",
          },
          {
            step: 3,
            title: "컴포넌트 내 cacheLife 호출 스니펫 및 타임라인 관찰",
            description: "cacheLife('profile') 호출 구문과 3단계 캐시 수명 타임라인이 정상 동기화되는지 확인합니다.",
            actionBadge: "결과 검증",
            observe: "선택한 커스텀 cacheLife 프로파일의 stale/revalidate/expire 설정이 타임라인에 반영됨",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"next.config.ts에서 custom cacheLife 프로필 정의 및 바인딩 실습"}>
        <CacheLifeCustomDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
