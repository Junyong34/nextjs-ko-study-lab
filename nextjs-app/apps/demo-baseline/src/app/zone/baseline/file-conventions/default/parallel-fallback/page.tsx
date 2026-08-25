import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { DefaultParallelFallbackDemo } from './components/DefaultParallelFallbackDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"default.tsx 병렬 라우트 폴백 렌더링"}
        concept={"병렬 라우트 슬롯(@slot)에서 현재 URL과 매치되는 세그먼트가 없을 때 default.tsx가 폴백으로 렌더링되어 404 에러를 방지합니다."}
        steps={[
        {
        "step": 1,
        "title": "[매칭 탭 (/shoes)] 클릭",
        "description": "양쪽 슬롯 모두 매칭되는 URL로 이동하여 기본 슬롯 콘텐츠를 확인합니다.",
        "actionBadge": "매칭 이동"
        },
        {
        "step": 2,
        "title": "[미매칭 라우트 (/settings)] 클릭",
        "description": "한쪽 슬롯에 매칭 페이지가 없는 URL로 이동하여 default.tsx 폴백 렌더링을 유도합니다.",
        "actionBadge": "default.tsx"
        },
        {
        "step": 3,
        "title": "슬롯 폴백 렌더링 및 404 방지 확인",
        "description": "매칭되지 않는 슬롯에 default.tsx가 렌더링되어 전체 페이지가 404 없이 안정적으로 유지되는지 확인합니다.",
        "actionBadge": "폴백 확인",
        "observe": "미매칭 라우트 접근 시 default.tsx의 폴백 UI가 렌더링되며 3단 검증 패널에 정상 반영되는지 확인",
        "observeAt": "playground"
        }
        ]}
        />
      <DemoPlaygroundCard title={"Parallel Routes 미매칭 시 default.tsx 폴백 실습"}>
        <DefaultParallelFallbackDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
