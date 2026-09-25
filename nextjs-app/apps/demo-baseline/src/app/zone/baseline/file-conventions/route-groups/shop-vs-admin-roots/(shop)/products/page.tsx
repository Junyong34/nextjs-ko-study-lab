import type { Metadata } from 'next'
import Link from 'next/link'
import { getDemoMetadata } from '@study/demos'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { VerificationFooter } from '../../components/VerificationFooter'
import { ResetProbeButton } from '../../components/ResetProbeButton'

export const metadata: Metadata = getDemoMetadata(
  'baseline',
  'file-conventions/route-groups/shop-vs-admin-roots/products',
)

const BASE_PATH = '/zone/baseline/file-conventions/route-groups/shop-vs-admin-roots'

export default function ShopProductsPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="Route Group: (shop)/products/page.tsx -> /products"
        concept="지금 보이는 파란 GNB는 (shop)/layout.tsx가 실제로 렌더링한 것이다. (admin) 그룹으로 이동하면 이 GNB가 완전히 다른 다크 사이드바로 통째로 교체된다."
        steps={[
          {
            step: 1,
            title: '(shop) 전용 GNB 확인',
            description: '상단 파란 GNB, 장바구니 배지가 (shop)/layout.tsx에서만 나온다는 것을 확인합니다.',
            actionBadge: 'GNB 확인',
          },
          {
            step: 2,
            title: '[(admin)/dashboard 이동 →] 클릭',
            description: '관리자 콘솔로 이동해 레이아웃이 완전히 바뀌는 것을 관찰합니다.',
            actionBadge: '그룹 전환',
            observe: 'BOOT_ID가 유지되는지(전체 리로드 없음)',
            observeAt: 'verification',
          },
        ]}
      />

      <DemoPlaygroundCard title="스토어프론트 상품 목록 (URL: .../products)">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">(shop)/layout.tsx 내부에서 렌더링된 페이지입니다.</p>
            <ResetProbeButton />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded border border-blue-200 bg-blue-50/50 p-3 dark:border-blue-900 dark:bg-blue-950/30">
              <div className="font-bold text-xs text-blue-900 dark:text-blue-200">에어 맥스 러닝화</div>
              <div className="text-xs text-zinc-500">KRW 149,000</div>
            </div>
            <div className="rounded border border-blue-200 bg-blue-50/50 p-3 dark:border-blue-900 dark:bg-blue-950/30">
              <div className="font-bold text-xs text-blue-900 dark:text-blue-200">하이드로 쉘 자켓</div>
              <div className="text-xs text-zinc-500">KRW 219,000</div>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Link
              href={`${BASE_PATH}/dashboard`}
              className="rounded bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700 transition-colors"
            >
              (admin)/dashboard 이동 →
            </Link>
            <Link
              href={BASE_PATH}
              className="rounded bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
            >
              실습 홈으로
            </Link>
          </div>
        </div>
      </DemoPlaygroundCard>

      <VerificationFooter currentGroup="shop" />
    </DemoContainer>
  )
}
