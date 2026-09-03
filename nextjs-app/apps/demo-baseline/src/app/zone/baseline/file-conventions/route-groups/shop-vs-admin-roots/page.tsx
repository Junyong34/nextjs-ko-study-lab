import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/route-groups/shop-vs-admin-roots')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ShopVsAdminRootsDemo } from './components/ShopVsAdminRootsDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"(shop) vs (admin) 다중 루트 레이아웃 분리"}
        concept={"최상위 app 폴더에 단일 layout.tsx 대신 (shop)/layout.tsx와 (admin)/layout.tsx를 두어, 고객용 쇼핑몰과 관리자 백오피스의 html, body 태그를 완전히 독립 분리합니다."}
        steps={[
          {
                    "step": 1,
                    "title": "쇼핑몰 고객 루트 레이아웃 (shop) 점검 및 관리자 백오피스 루트 레이아웃 (admin) 점검",
                    "description": "고객용 GNB, 장바구니 위젯, 푸터가 포함된 독립 html 루트 구조를 확인합니다. 관리자 사이드바, 다크 대시보드 테마가 적용된 별도의 html 루트 구조를 확인합니다.",
                    "actionBadge": "(shop) 루트"
          },
          {
                    "step": 2,
                    "title": "다중 루트 레이아웃 독립성 검증",
                    "description": "두 라우트 그룹이 상위 레이아웃을 공유하지 않고 완전 분리된 DOM 트리를 생성하는지 검증합니다.",
                    "actionBadge": "루트 분리",
                    "observe": "3단 검증 패널에서 (shop)과 (admin)의 다중 루트 레이아웃 분리 사양이 정상 충족되는지 확인",
                    "observeAt": "verification"
          }
]}
        />
      <DemoPlaygroundCard title={"상점용 vs 관리자용 다중 루트 레이아웃 실습"}>
        <ShopVsAdminRootsDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
