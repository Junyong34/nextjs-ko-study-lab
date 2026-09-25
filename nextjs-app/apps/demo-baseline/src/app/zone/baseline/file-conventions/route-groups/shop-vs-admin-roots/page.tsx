import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ShopVsAdminRootsDemo } from './components/ShopVsAdminRootsDemo'
import { VerificationFooter } from './components/VerificationFooter'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/route-groups/shop-vs-admin-roots')

export default function ShopVsAdminRootsIndexPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="(shop) vs (admin) — 다중 루트 레이아웃을 실제로 시도해 본다"
        concept="app/layout.tsx가 이미 <html>/<body>를 쥐고 있는 위치 아래에서 (shop)/(admin) 그룹 레이아웃을 실제로 만들어, 문서 전체 리로드 없이도 완전히 다른 GNB/디자인을 가진 두 그룹을 오갈 수 있는지 실측한다."
        steps={[
          {
            step: 1,
            title: '[(shop)/products 이동 →] 클릭',
            description: '파란 GNB의 스토어프론트 그룹으로 이동해 레이아웃 디자인을 확인합니다.',
            actionBadge: '(shop) 진입',
          },
          {
            step: 2,
            title: '[(admin)/dashboard 이동 →] 클릭',
            description: '다크 사이드바의 관리자 콘솔 그룹으로 이동합니다. GNB가 사이드바로 완전히 교체됩니다.',
            actionBadge: '(admin) 진입',
          },
          {
            step: 3,
            title: '서로 반대편 그룹으로 다시 이동',
            description: '(shop) ↔ (admin)을 한 번 더 오가며 3단 검증 패널의 BOOT_ID 판정을 확인합니다.',
            actionBadge: '왕복 이동',
            observe: 'BOOT_ID가 그대로 유지되는지(소프트 내비게이션), 문서 전체 리로드가 일어나는지',
            observeAt: 'verification',
          },
        ]}
      />

      <DemoPlaygroundCard title="상점용 vs 관리자용 그룹 레이아웃 실습">
        <ShopVsAdminRootsDemo />
      </DemoPlaygroundCard>

      <VerificationFooter currentGroup="index" />
    </DemoContainer>
  )
}
