import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('cache', 'guides/auth-cache-components/static-layout-session-context')

import { Suspense } from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { getCurrentUser } from './session'
import { CatalogShell } from './components/CatalogShell'
import { UserProvider } from './components/UserProvider'
import { UserBadge, AccountPanel } from './components/SessionWidgets'
import { AccountPanelFallback, BadgeFallback, StoreFallback } from './components/SessionFallbacks'
import { StreamVerification } from './components/StreamVerification'
import { ConceptCard } from './components/ConceptCard'

/**
 * 가이드 2·3단계: Suspense 경계 "안"에서 세션 Promise를 만들고(await 하지 않음)
 * Context로 내려 두 클라이언트 위젯이 use()로 같은 Promise를 푼다.
 */
function Storefront() {
  const userPromise = getCurrentUser() // do NOT await

  return (
    <UserProvider userPromise={userPromise}>
      {/* 'use cache' 컴포넌트에 슬롯으로 넘기는 요소에는 key를 준다 — 없으면 dev에서 캐시 재생 시 key 경고가 난다(실측) */}
      <CatalogShell
        accountSlot={
          <Suspense key="badge" fallback={<BadgeFallback />}>
            <UserBadge />
          </Suspense>
        }
      >
        <Suspense key="panel" fallback={<AccountPanelFallback />}>
          <AccountPanel />
        </Suspense>
      </CatalogShell>
    </UserProvider>
  )
}

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="정적 상품 레이아웃과 UserContext 기반 세션 스트리밍"
        concept="상품 레이아웃은 'use cache'로 static shell에 넣어 모든 방문자에게 같은 HTML을 먼저 보내고, 쿠키를 읽는 세션 영역만 Suspense fallback 자리에 요청 시점에 스트리밍합니다. 세션 Promise는 한 번만 만들어 Context로 내리고 클라이언트 위젯이 use()로 풉니다."
        steps={[
          {
            step: 1,
            title: '로그인 전 [초기 HTML 응답 측정] 클릭',
            description:
              '현재 페이지의 HTML 응답을 청크 단위로 읽어, 셸·fallback 마커가 세션 마커보다 먼저 도착하는지 확인합니다. 두 번 이상 눌러 셸 렌더 ID와 세션 요청 ID를 비교합니다.',
            actionBadge: '스트림 측정',
          },
          {
            step: 2,
            title: '계정 패널에서 [김쇼핑 (SILVER) 로그인] 클릭',
            description:
              'Server Action이 이 데모 경로 전용 httpOnly 쿠키를 저장합니다. 헤더 배지와 계정 패널만 사용자 UI로 바뀌고 셸 렌더 ID는 그대로입니다.',
            actionBadge: 'Server Action',
            observe: '헤더 배지·계정 패널의 사용자 이름과 세션 요청 ID 변화, 셸 렌더 ID 유지',
            observeAt: 'playground',
          },
          {
            step: 3,
            title: '로그인 후 [초기 HTML 응답 측정] 다시 클릭',
            description:
              '같은 static shell(같은 셸 렌더 ID) 뒤에 이번에는 로그인한 사용자 이름이 스트리밍되는지 확인합니다. [로그아웃]으로 되돌릴 수 있습니다.',
            actionBadge: '전후 비교',
            observe: '측정 표의 셸 렌더 ID 고정, 세션 요청 ID·사용자 변화',
            observeAt: 'verification',
          },
        ]}
      />

      <DemoPlaygroundCard title="SHOPLAB 스토어 — CatalogShell('use cache') + 세션 슬롯(Suspense)">
        <Suspense fallback={<StoreFallback />}>
          <Storefront />
        </Suspense>
      </DemoPlaygroundCard>

      <StreamVerification />

      <ConceptCard />
    </DemoContainer>
  )
}
