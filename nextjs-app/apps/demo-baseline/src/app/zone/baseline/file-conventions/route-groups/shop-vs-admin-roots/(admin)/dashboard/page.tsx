import type { Metadata } from 'next'
import Link from 'next/link'
import { getDemoMetadata } from '@study/demos'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { VerificationFooter } from '../../components/VerificationFooter'
import { ResetProbeButton } from '../../components/ResetProbeButton'

export const metadata: Metadata = getDemoMetadata(
  'baseline',
  'file-conventions/route-groups/shop-vs-admin-roots/dashboard',
)

const BASE_PATH = '/zone/baseline/file-conventions/route-groups/shop-vs-admin-roots'

export default function AdminDashboardPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="Route Group: (admin)/dashboard/page.tsx -> /dashboard"
        concept="왼쪽 다크 사이드바는 (admin)/layout.tsx가 렌더링한 것이다. 방금까지 보이던 (shop)의 파란 GNB는 완전히 사라지고 다른 컴포넌트 트리로 통째로 교체되었다."
        steps={[
          {
            step: 1,
            title: '(admin) 전용 사이드바 확인',
            description: '왼쪽 다크 사이드바가 (admin)/layout.tsx에서만 나온다는 것을 확인합니다.',
            actionBadge: '사이드바 확인',
          },
          {
            step: 2,
            title: '[(shop)/products 이동 →] 클릭',
            description: '다시 스토어프론트로 돌아가 레이아웃이 원래대로 바뀌는 것을 관찰합니다.',
            actionBadge: '그룹 전환',
            observe: 'BOOT_ID가 유지되는지(전체 리로드 없음)',
            observeAt: 'verification',
          },
        ]}
      />

      <DemoPlaygroundCard title="관리자 대시보드 (URL: .../dashboard)">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">(admin)/layout.tsx 내부에서 렌더링된 페이지입니다.</p>
            <ResetProbeButton />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded border border-violet-200 bg-violet-50/50 p-3 dark:border-violet-900 dark:bg-violet-950/30">
              <div className="text-[11px] text-zinc-500">오늘 주문</div>
              <div className="font-bold text-sm text-violet-900 dark:text-violet-200">128건</div>
            </div>
            <div className="rounded border border-violet-200 bg-violet-50/50 p-3 dark:border-violet-900 dark:bg-violet-950/30">
              <div className="text-[11px] text-zinc-500">오늘 매출</div>
              <div className="font-bold text-sm text-violet-900 dark:text-violet-200">KRW 8.4M</div>
            </div>
            <div className="rounded border border-violet-200 bg-violet-50/50 p-3 dark:border-violet-900 dark:bg-violet-950/30">
              <div className="text-[11px] text-zinc-500">재고 경고</div>
              <div className="font-bold text-sm text-violet-900 dark:text-violet-200">3건</div>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Link
              href={`${BASE_PATH}/products`}
              className="rounded bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              (shop)/products 이동 →
            </Link>
            <Link
              href={BASE_PATH}
              className="rounded bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-700"
            >
              실습 홈으로
            </Link>
          </div>
        </div>
      </DemoPlaygroundCard>

      <VerificationFooter currentGroup="admin" />
    </DemoContainer>
  )
}
