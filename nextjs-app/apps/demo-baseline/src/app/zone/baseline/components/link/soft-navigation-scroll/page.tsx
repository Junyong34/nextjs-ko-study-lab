import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { LinkSoftNavScrollDemo } from './components/LinkSoftNavScrollDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"next/link scroll={false} 스크롤 위치 유지"}
        concept={"<Link href=\"...\" scroll={false}>를 설정하면 페이지 이동 시 뷰포트가 최상단(y: 0)으로 강제 스크롤되지 않고 현재 스크롤 위치를 유지합니다."}
        steps={[
        {
        "step": 1,
        "title": "[scroll 속성 토글 (현재: )] 클릭",
        "description": "scroll 속성을 true에서 false로 토글하여 네비게이션 스크롤 정책을 변경합니다.",
        "actionBadge": "scroll 토글"
        },
        {
        "step": 2,
        "title": "하위 탭 링크 클릭 및 페이지 이동",
        "description": "페이지 중간에 위치한 탭 링크를 클릭하여 소프트 네비게이션을 실행합니다.",
        "actionBadge": "탭 이동"
        },
        {
        "step": 3,
        "title": "스크롤 위치 보존 여부 확인",
        "description": "scroll={false}일 때 뷰포트가 최상단으로 튀지 않고 현재 스크롤 위치에 머무는지 확인합니다.",
        "actionBadge": "스크롤 유지",
        "observe": "3단 검증 패널에서 scroll={false} 설정에 따른 스크롤 유지 동작 및 검증 데이터 확인",
        "observeAt": "verification"
        }
        ]}
        />
      <DemoPlaygroundCard title={"<Link> 소프트 내비게이션 및 scroll 제어 실습"}>
        <LinkSoftNavScrollDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
