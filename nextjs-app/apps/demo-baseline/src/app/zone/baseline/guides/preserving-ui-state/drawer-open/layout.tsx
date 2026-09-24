import React from 'react'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { PlacementObserver } from './components/PlacementObserver'
import { CategoryNav } from './components/CategoryNav'
import { CartDrawer } from './components/CartDrawer'
import { KeyedCartDrawer } from './components/KeyedCartDrawer'
import { VerificationFooter } from './components/VerificationFooter'
import { ConceptCard } from './components/ConceptCard'

export default function DrawerOpenLayout({ children }: { children: React.ReactNode }) {
  return (
    <PlacementObserver>
      <DemoContainer className="space-y-6">
        <DemoGuideCard
          title="카테고리 전환 시 장바구니 Drawer 열림 유지"
          concept="같은 장바구니 Drawer라도 어디에 두느냐가 보존을 결정한다. 공유 layout.tsx에 둔 Drawer는 카테고리 page가 바뀌어도 같은 인스턴스라 열림·메모·스크롤이 남고, page.tsx 안이나 key={pathname}으로 둔 Drawer는 새 인스턴스로 초기화된다."
          steps={[
            {
              step: 1,
              title: '세 Drawer를 모두 열고 배송 메모 입력, 목록 스크롤',
              description: 'layout 소유, layout + key, page 소유 Drawer에 같은 조작을 합니다.',
              actionBadge: '상태 만들기',
            },
            {
              step: 2,
              title: '[이동 전 상태 기록] 후 [패션] 또는 [전자기기] 링크 클릭',
              description: '실제 Link로 하위 page.tsx만 바뀌는 클라이언트 이동을 합니다.',
              actionBadge: '실제 라우트 이동',
            },
            {
              step: 3,
              title: '이동 직후 mount ID·열림·메모·스크롤 비교',
              description: '이동 직후 세 Drawer의 첫 보고값을 고정해 이동 전 기록과 대조합니다.',
              actionBadge: '배치별 대조',
              observe: 'layout Drawer만 같은 mount ID로 열림·메모·스크롤 유지, 나머지 둘은 새 mount ID로 초기화',
              observeAt: 'verification',
            },
          ]}
        />
        <fieldset className="min-w-0 rounded-lg border border-zinc-300 bg-white p-3.5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950">
          <legend className="px-2 text-xs font-semibold text-zinc-900 dark:text-zinc-100">
            [실습 화면] 쇼핑 카테고리와 장바구니 Drawer 3종
          </legend>
          <div className="min-w-0 space-y-4">
            <CategoryNav />
            <div className="grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2">
              <CartDrawer slot="layout" />
              <KeyedCartDrawer />
            </div>
            <div className="min-w-0 rounded-lg border border-dashed border-zinc-300 p-3 dark:border-zinc-700">
              {children}
            </div>
          </div>
        </fieldset>
        <VerificationFooter />
        <ConceptCard />
      </DemoContainer>
    </PlacementObserver>
  )
}
