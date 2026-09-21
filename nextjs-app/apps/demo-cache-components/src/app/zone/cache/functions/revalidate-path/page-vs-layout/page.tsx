import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('cache', 'functions/revalidate-path/page-vs-layout')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { RevalidatePathScopeDemo } from './components/RevalidatePathScopeDemo'
import { VerificationFooter } from './components/VerificationFooter'
import { getHubCache } from './cachedData'

export default async function DemoPage() {
  const hub = await getHubCache()

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="revalidatePath page vs layout 레벨 일괄 무효화 대조"
        concept="revalidatePath(path, 'page')는 그 경로의 페이지 하나만 무효화하고, revalidatePath(path, 'layout')은 그 경로의 layout.tsx와 그 아래 모든 중첩 페이지를 함께 무효화합니다."
        steps={[
          {
            step: 1,
            title: "허브·상품·카테고리 페이지의 초기 cacheId 확인",
            description: "실습화면의 허브 cacheId를 확인하고, 아래 링크로 상품(items/101)·카테고리(category/electronics) 페이지도 열어 각각의 cacheId를 기록해 둡니다.",
            actionBadge: "초기 상태 확인",
          },
          {
            step: 2,
            title: "'page' 스코프로 무효화 후 재확인",
            description: "'page' 버튼을 눌러 revalidatePath(path, 'page')를 실행합니다. 허브로 돌아와 cacheId가 바뀐 것을 확인한 뒤, 상품/카테고리 페이지로 이동해 cacheId가 그대로인지 확인합니다.",
            actionBadge: "page 스코프 실행",
          },
          {
            step: 3,
            title: "'layout' 스코프로 무효화 후 재확인",
            description: "'layout' 버튼을 눌러 revalidatePath(path, 'layout')를 실행합니다. layout 배너와 허브·상품·카테고리 페이지의 cacheId가 모두 바뀌는지 확인합니다.",
            actionBadge: "layout 스코프 실행",
            observe: "'page'는 허브만, 'layout'은 공유 layout.tsx 아래 모든 페이지가 함께 바뀜",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"revalidatePath page vs layout 레벨 일괄 무효화 실습"}>
        <RevalidatePathScopeDemo hub={hub} />
      </DemoPlaygroundCard>
      <VerificationFooter
        isLoaded={Boolean(hub.cacheId)}
        actual={`- 허브 cacheId: #${hub.cacheId}\n- 생성 시각: ${hub.generatedAt}`}
        expected="'page' 스코프는 허브 cacheId만 바꾸고, 'layout' 스코프는 허브·상품·카테고리 cacheId를 모두 바꾼다."
      />
    </DemoContainer>
  )
}
