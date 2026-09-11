import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/forbidden/admin-role-403')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { AdminRoleAccessDemo } from './components/AdminRoleAccessDemo'
import { VerificationFooter } from './components/VerificationFooter'
import { getCurrentDemoRole } from './actions'

export default async function DemoPage() {
  const currentRole = await getCurrentDemoRole()

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="forbidden.tsx 파일 배치가 결정하는 403 화면"
        concept="forbidden()이 던지는 예외는 어디서 호출하든 동일하지만, 실제로 렌더링되는 UI는 그 세그먼트 기준 '가장 가까운 조상' forbidden.tsx 파일이 결정합니다. 같은 예외라도 forbidden.tsx가 어느 폴더에 있느냐에 따라 다른 화면이 뜹니다."
        steps={[
          {
            step: 1,
            title: '[일반 고객 (CUSTOMER)] 선택',
            description: '실제 서버 세션 쿠키를 전환합니다. 페이지 로딩 시 초기값은 CUSTOMER입니다.',
            actionBadge: '역할 선택',
          },
          {
            step: 2,
            title: '[전체 공지 관리 →] 클릭',
            description:
              'general-notice 폴더에는 전용 forbidden.tsx가 없습니다. forbidden() 예외가 상위로 전파되어 admin-role-403/forbidden.tsx(공통 파일)가 렌더링됩니다.',
            actionBadge: '상위 파일 상속',
          },
          {
            step: 3,
            title: '[정산 금고 →] 클릭',
            description:
              'settlement-vault 폴더에는 같은 위치에 전용 forbidden.tsx가 있습니다. 같은 forbidden() 호출이지만 상위 파일 대신 이 전용 파일이 렌더링됩니다.',
            actionBadge: '전용 파일 우선',
            observe: '두 경로 모두 실제 403이지만, 렌더링된 forbidden.tsx의 파일 경로와 문구가 서로 다름을 확인',
            observeAt: 'playground',
          },
        ]}
      />
      <DemoPlaygroundCard title="forbidden.tsx 파일 배치 규칙 실습">
        <AdminRoleAccessDemo currentRole={currentRole} />
      </DemoPlaygroundCard>
      <VerificationFooter currentRole={currentRole} />
    </DemoContainer>
  )
}
