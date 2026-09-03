import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/forbidden/admin-role-403')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ForbiddenRoleDemo } from './components/ForbiddenRoleDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"forbidden.tsx 403 권한 부족 접근 차단"}
        concept={"일반 고객(CUSTOMER) 계정으로 관리자 전용 정산 라우트에 접근 시 forbidden()이 호출되어 403 상태 코드와 함께 forbidden.tsx 화면을 렌더링합니다."}
        steps={[
        {
        "step": 1,
        "title": "[일반 고객 (CUSTOMER)] 버튼 선택",
        "description": "권한이 없는 일반 사용자 세션으로 전환합니다.",
        "actionBadge": "CUSTOMER"
        },
        {
        "step": 2,
        "title": "[정산 관리자 페이지 접근 시도] 클릭",
        "description": "관리자 전용 라우트로 진입을 시도하여 forbidden() 예외를 트리거합니다.",
        "actionBadge": "403 트리거"
        },
        {
        "step": 3,
        "title": "[스토어 관리자 (ADMIN)] 선택 후 재시도",
        "description": "관리자 계정으로 전환하여 정상 관리 페이지(200 OK)가 렌더링되는 차이를 대조합니다.",
        "actionBadge": "200 ADMIN",
        "observe": "CUSTOMER 접근 시 403 forbidden.tsx 화면 표시 및 ADMIN 접근 시 정상 렌더링 확인",
        "observeAt": "playground"
        }
        ]}
        />
      <DemoPlaygroundCard title={"비관리자 권한 차단 403 화면 (forbidden.tsx) 실습"}>
        <ForbiddenRoleDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
