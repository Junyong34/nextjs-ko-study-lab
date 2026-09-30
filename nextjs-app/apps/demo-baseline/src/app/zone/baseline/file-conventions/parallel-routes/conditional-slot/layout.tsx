import React from 'react'
import { cookies } from 'next/headers'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard, type DemoStep } from '@study/demo-kit'
import { ROLE_COOKIE, toRole } from './roleCookie'
import { RoleControls } from './components/RoleControls'
import { VerificationFooter } from './components/VerificationFooter'

const steps: DemoStep[] = [
  { step: 1, title: '역할 쿠키 정하기', description: "'관리자' 또는 '일반 회원' 버튼을 누르면 Server Action이 demo_role 쿠키를 저장합니다.", actionBadge: '쿠키 저장' },
  { step: 2, title: '슬롯 교체 관찰', description: '서버의 layout.tsx가 요청마다 쿠키를 읽어 @admin과 @user 중 하나만 화면에 반환합니다. 아래 슬롯 영역이 바뀌는지 봅니다.', actionBadge: '화면 관찰' },
  { step: 3, title: '불일치 만들기', description: "'쿠키만 admin으로 바꾸기'는 화면 갱신 없이 브라우저 쿠키만 바꿉니다. 화면의 슬롯은 그대로이므로 검증이 실패합니다. '다시 측정'은 새로고침 없이 재판정만 하고, 새로고침하면 서버가 새 쿠키로 다시 그립니다.", observe: '기대 슬롯(쿠키)과 실제 슬롯(DOM)', observeAt: 'verification' },
]

export default async function ConditionalSlotLayout({
  children,
  admin,
  user,
}: {
  children: React.ReactNode
  admin?: React.ReactNode
  user?: React.ReactNode
}) {
  const role = toRole((await cookies()).get(ROLE_COOKIE)?.value)
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="역할 쿠키로 @admin / @user 슬롯 고르기"
        concept="layout.tsx는 두 슬롯을 모두 props로 받지만, 쿠키에서 읽은 역할에 따라 하나만 반환해 화면에 그립니다."
        steps={steps}
      />
      <DemoPlaygroundCard title="역할별 슬롯 분기">
        <RoleControls />
        <div id="slot-observation" data-server-role={role} className="mt-4">
          {role === 'admin' ? admin : user}
        </div>
      </DemoPlaygroundCard>
      <VerificationFooter />
      {children}
    </DemoContainer>
  )
}
