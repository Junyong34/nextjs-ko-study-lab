import React from 'react'
import Link from 'next/link'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { VerificationFooter } from '../../components/VerificationFooter'

export default function MarketingAboutPage() {
  const BASE_PATH = '/zone/baseline/file-conventions/route-groups/group-url-isolation'

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="Route Group: (marketing)/about -> /about"
        concept="Next.js의 괄호 폴더 (marketing)을 통해 마케팅 전용 배너 레이아웃을 독립적으로 적용하면서도 깔끔한 /about URL을 유지합니다."
        steps={[
          {
            step: 1,
            title: "마케팅 레이아웃 확인",
            description: "보라색 마케팅 배너 레이아웃이 (marketing) 그룹 하위의 /about에만 적용됩니다.",
            actionBadge: "마케팅 레이아웃",
          },
          {
            step: 2,
            title: "URL 경로 격리 검증",
            description: "주소창에 (marketing) 문구가 포함되지 않고 순수 /about으로 유지됩니다.",
            actionBadge: "URL 검증",
          },
          {
            step: 3,
            title: "(shop) 그룹과 비교",
            description: "쇼핑몰 상품 페이지(/products)로 이동하여 완전히 다른 레이아웃 구조를 확인합니다.",
            actionBadge: "그룹 전환",
          },
        ]}
      />

      <DemoPlaygroundCard title="브랜드 스토리 & 프로모션 (URL: .../about)">
        <div className="space-y-4 rounded-lg bg-white p-4 text-sm dark:bg-zinc-950">
          <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
            <div>
              <h5 className="font-bold text-zinc-900 dark:text-zinc-100">브랜드 미션 & 소개</h5>
              <p className="text-xs text-zinc-500">(marketing) 레이아웃 내부에서 렌더링된 브랜드 소개 뷰입니다.</p>
            </div>
            <div className="flex gap-2">
              <Link
                href={`${BASE_PATH}/products`}
                className="rounded bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                (shop)/products 페이지로 이동 →
              </Link>
              <Link
                href={BASE_PATH}
                className="rounded bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
              >
                홈으로 복귀
              </Link>
            </div>
          </div>

          <div className="rounded border border-purple-200 bg-purple-50/50 p-4 dark:border-purple-900 dark:bg-purple-950/30 space-y-2">
            <div className="font-bold text-xs text-purple-900 dark:text-purple-200">
              "혁신적인 기술로 최고의 쇼핑 경험을 선사합니다."
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              본 페이지는 마케팅 전용 헤더 및 푸터를 탑재하고 있으며, 스토어프론트((shop)) 영역과 레이아웃 코드 간섭 없이 독립적으로 배포 및 유지보수됩니다.
            </p>
          </div>
        </div>
      </DemoPlaygroundCard>

      <VerificationFooter currentGroup="marketing" currentPath="/about" />
    </DemoContainer>
  )
}
