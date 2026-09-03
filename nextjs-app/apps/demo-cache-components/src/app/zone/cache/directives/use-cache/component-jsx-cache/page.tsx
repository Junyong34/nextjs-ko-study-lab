import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('cache', 'directives/use-cache/component-jsx-cache')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { DirectiveUseCacheComponentDemo } from './components/DirectiveUseCacheComponentDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"'use cache' 컴포넌트 단위 JSX 렌더링 캐시"}
        concept={"비동기 서버 컴포넌트에 'use cache'를 선언하면 컴포넌트가 생성한 최종 JSX 가상 DOM 트리가 캐싱되어, 재방문 시 컴포넌트 내부 렌더링 연산 없이 즉각 반환됩니다."}
        steps={[
        {
        "step": 1,
        "title": "카테고리 탭 선택 및 컴포넌트 렌더링",
        "description": "'use cache'가 적용된 ProductList 카테고리 탭을 변경하여 컴포넌트를 렌더링합니다.",
        "actionBadge": "컴포넌트 렌더링"
        },
        {
        "step": 2,
        "title": "JSX 가상 DOM 캐시 재사용 확인",
        "description": "동일 카테고리 재선택 시 서버 컴포넌트 본문 재실행 없이 캐시된 JSX 페이로드가 즉시 반환되는지 확인합니다.",
        "actionBadge": "JSX 캐시 HIT"
        },
        {
        "step": 3,
        "title": "[🔄 컴포넌트 캐시 태그 무효화] 클릭",
        "description": "컴포넌트 레벨에 지정된 캐시 태그를 무효화하여 최신 JSX 트리를 다시 빌드하도록 트리거합니다.",
        "actionBadge": "캐시 무효화",
        "observe": "컴포넌트 캐시 무효화 후 새로 렌더링된 타임스탬프와 3단 검증 패널의 캐시 상태 확인",
        "observeAt": "playground"
        }
        ]}
        />
      <DemoPlaygroundCard title={"'use cache' 컴포넌트 JSX 렌더링 결과 캐싱 실습"}>
        <DirectiveUseCacheComponentDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
