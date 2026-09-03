import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/route-groups/group-url-isolation/(shop)/products')

import React from 'react'
import Link from 'next/link'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { VerificationFooter } from '../../components/VerificationFooter'

export default function ShopProductsPage() {
  const BASE_PATH = '/zone/baseline/file-conventions/route-groups/group-url-isolation'

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="Route Group: (shop)/products -> /products"
        concept="Next.js의 괄호 폴더 (folder) 컨벤션을 사용하면 URL 경로 세그먼트에 영향을 주지 않고 레이아웃을 논리적으로 분리할 수 있습니다."
        steps={[
          {
            step: 1,
            title: "폴더 구조 확인",
            description: "디렉토리는 /(shop)/products에 위치하지만 실제 요청 URL은 /products입니다.",
            actionBadge: "URL 격리",
          },
          {
            step: 2,
            title: "(shop) 전용 레이아웃 적용",
            description: "상단 파란색 스토어프론트 헤더 레이아웃이 (shop) 하위 페이지에만 적용됩니다.",
            actionBadge: "쇼핑 레이아웃",
          },
          {
            step: 3,
            title: "(marketing) 그룹으로 전환",
            description: "마케팅 소개 페이지(/about)로 이동하여 보라색 마케팅 레이아웃과의 차이를 비교합니다.",
            actionBadge: "그룹 전환",
          },
        ]}
      />

      <DemoPlaygroundCard title="쇼핑몰 상품 카탈로그 (URL: .../products)">
        <div className="space-y-4 rounded-lg bg-white p-4 text-sm dark:bg-zinc-950">
          <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
            <div>
              <h5 className="font-bold text-zinc-900 dark:text-zinc-100">추천 상품 목록</h5>
              <p className="text-xs text-zinc-500">(shop) 레이아웃 내부에서 렌더링된 메인 상품 뷰입니다.</p>
            </div>
            <div className="flex gap-2">
              <Link
                href={`${BASE_PATH}/about`}
                className="rounded bg-purple-600 px-3 py-1 text-xs font-semibold text-white hover:bg-purple-700 transition-colors"
              >
                (marketing)/about 페이지로 이동 →
              </Link>
              <Link
                href={BASE_PATH}
                className="rounded bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
              >
                홈으로 복귀
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="rounded border border-blue-200 bg-blue-50/50 p-3 dark:border-blue-900 dark:bg-blue-950/30">
              <div className="font-bold text-xs text-blue-900 dark:text-blue-200">에어 맥스 러닝화</div>
              <div className="text-xs text-zinc-500">스토어프론트 전용 UI 컴포넌트 • KRW 149,000</div>
            </div>
            <div className="rounded border border-blue-200 bg-blue-50/50 p-3 dark:border-blue-900 dark:bg-blue-950/30">
              <div className="font-bold text-xs text-blue-900 dark:text-blue-200">하이드로 쉘 자켓</div>
              <div className="text-xs text-zinc-500">스토어프론트 전용 UI 컴포넌트 • KRW 219,000</div>
            </div>
          </div>
        </div>
      </DemoPlaygroundCard>

      <VerificationFooter currentGroup="shop" currentPath="/products" />
    </DemoContainer>
  )
}
