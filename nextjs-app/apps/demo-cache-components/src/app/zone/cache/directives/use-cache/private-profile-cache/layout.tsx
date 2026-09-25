import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ObservationProvider } from './components/ObservationContext'
import { SessionControls } from './components/SessionControls'
import { ProfileTabs } from './components/ProfileTabs'
import { SharedCacheProbe } from './components/SharedCacheProbe'
import { VerificationFooter } from './components/VerificationFooter'
import { ConceptDeepDive } from './components/ConceptDeepDive'

/**
 * 두 탭(page.tsx = 주문 내역, shipping/page.tsx = 배송 조회)이 공유하는 레이아웃.
 * 관측 기록(ObservationProvider)이 탭 이동 동안 유지되도록 여기서 감싼다.
 */
export default function PrivateProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="'use cache: private' 개인화 주문 내역 캐시 격리"
        concept="'use cache: private' 함수는 캐시 스코프 안에서 cookies()를 직접 읽을 수 있습니다. 대신 결과는 서버에 저장되지 않고 요청한 브라우저의 메모리에만 캐시되어, 새로고침하면 사라지고 다른 사용자와 공유되지 않습니다."
        steps={[
          {
            step: 1,
            title: '[민지] 로그인 후 [배송 조회]·[주문 내역] 탭을 두 번 왕복',
            description: 'Server Action이 데모 경로 한정 쿠키를 발급하고, 두 탭은 실제 서브 라우트입니다. 첫 왕복에서 각 탭 값이 정해지면 두 번째 왕복 전후로 [서버 실행 횟수 조회]를 눌러 보세요.',
            actionBadge: '브라우저 캐시',
            observe: '두 번째 왕복에서 각 탭의 cacheId·본문 실행 시각이 그대로이고 서버 실행 횟수도 늘지 않음',
            observeAt: 'playground',
          },
          {
            step: 2,
            title: '브라우저 새로고침(F5)',
            description: '문서 로드 ID가 바뀝니다. 관측 기록은 sessionStorage로 이어서 비교합니다.',
            actionBadge: '서버 미저장',
            observe: '같은 사용자·같은 탭인데 새 cacheId, 서버 실행 순번 증가',
            observeAt: 'verification',
          },
          {
            step: 3,
            title: '[준호]로 전환 후 대조군 실행',
            description: "다른 사용자 쿠키로 같은 함수를 호출하고, 일반 'use cache' 안에서 cookies()를 부르는 함수도 실행합니다.",
            actionBadge: '사용자 격리',
            observe: '준호는 다른 cacheId와 주문을 받고, 대조군은 오류로 거부되어 검증 패널이 "검증 완료"로 바뀜',
            observeAt: 'verification',
          },
        ]}
      />
      <ObservationProvider>
        <DemoPlaygroundCard title="마이페이지 — getMyOrders() ('use cache: private')">
          <div className="space-y-3">
            <SessionControls />
            <ProfileTabs />
            {children}
            <SharedCacheProbe />
          </div>
        </DemoPlaygroundCard>
        <VerificationFooter />
      </ObservationProvider>
      <ConceptDeepDive />
    </DemoContainer>
  )
}
