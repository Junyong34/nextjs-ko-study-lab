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
        title="Route Group: (shop)/products/page.tsx -> /products"
        concept="파일은 `app/.../(shop)/products/page.tsx`에 있지만, (shop)은 Route Group 폴더라 URL 세그먼트로 계산되지 않아 실제 요청 경로는 /products로 끝난다."
        steps={[
          {
            step: 1,
            title: "폴더 경로와 실제 URL 비교",
            description: "주소창의 경로가 .../group-url-isolation/products로 끝나는지, 그 사이에 (shop) 문자열이 없는지 확인합니다.",
            actionBadge: "URL 확인",
          },
          {
            step: 2,
            title: "[(marketing)/about 페이지로 이동 →] 클릭",
            description: "마케팅 소개 페이지(/about)로 이동해, 다른 그룹 폴더에서도 괄호 문자열이 URL에 나타나지 않는지 비교합니다.",
            actionBadge: "그룹 전환",
          },
          {
            step: 3,
            title: "[홈으로 복귀] 클릭",
            description: "최상위 인덱스로 돌아가 3단 검증 패널에서 usePathname() 값을 다시 확인합니다.",
            actionBadge: "홈 복귀",
            observe: "usePathname()이 반환한 문자열에 (shop) 괄호 폴더명이 포함되지 않았는지",
            observeAt: "verification",
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

      <VerificationFooter />
    </DemoContainer>
  )
}
