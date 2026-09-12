import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { CookiesDeleteDemo } from './components/CookiesDeleteDemo'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/cookies/delete-logout')

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="회원 쿠키를 지운 뒤 다음 요청에서 확인하기"
        concept="로그아웃 액션이 보낸 쿠키 만료 지시를 브라우저가 적용하면, 다음 서버 요청에는 그 쿠키가 실리지 않습니다."
        steps={[
          {
            step: 1,
            title: '회원 쿠키 생성',
            description: '준비가 끝나면 회원 쿠키를 생성하세요. 다음 서버 요청에서 예시 VIP 회원과 쿠키 존재 여부를 확인합니다.',
            actionBadge: '생성',
            observe: '쿠키 있음, 생성 확인 이력 완료',
            observeAt: 'playground',
          },
          {
            step: 2,
            title: '삭제 전에 검증',
            description: '쿠키 삭제 검증을 누르세요. 쿠키가 남아 있고 삭제 이력이 없어 불일치가 나와야 합니다.',
            actionBadge: '실패 확인',
          },
          {
            step: 3,
            title: '로그아웃 후 다시 검증',
            description: '로그아웃을 누르고 쿠키 없음을 관찰한 뒤 다시 검증하세요. Network에서 삭제 응답의 Set-Cookie와 뒤따르는 읽기 요청을 비교합니다.',
            actionBadge: '삭제·검증',
            observe: '새 요청에 쿠키 없음 + 생성·삭제 이력 충족 → 검증 완료',
            observeAt: 'playground',
          },
          {
            step: 4,
            title: '초기화하고 재실행',
            description: '예제 초기화로 쿠키와 이력을 비우세요. 게스트 상태에서 바로 검증하면 삭제 성공이 아닙니다.',
            actionBadge: '초기화',
          },
        ]}
      />
      <CookiesDeleteDemo />
    </DemoContainer>
  )
}
