import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/route-groups/group-url-isolation/(marketing)/about')

import React from 'react'
import Link from 'next/link'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { VerificationFooter } from '../../components/VerificationFooter'

export default function MarketingAboutPage() {
  const BASE_PATH = '/zone/baseline/file-conventions/route-groups/group-url-isolation'

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="Route Group: (marketing)/about/page.tsx -> /about"
        concept="파일은 `app/.../(marketing)/about/page.tsx`에 있지만, (marketing)은 Route Group 폴더라 URL 세그먼트로 계산되지 않아 실제 요청 경로는 /about으로 끝난다."
        steps={[
          {
            step: 1,
            title: "폴더 경로와 실제 URL 비교",
            description: "주소창의 경로가 .../group-url-isolation/about으로 끝나는지, 그 사이에 (marketing) 문자열이 없는지 확인합니다.",
            actionBadge: "URL 확인",
          },
          {
            step: 2,
            title: "[(shop)/products 페이지로 이동 →] 클릭",
            description: "쇼핑몰 상품 페이지(/products)로 이동해, 다른 그룹 폴더에서도 괄호 문자열이 URL에 나타나지 않는지 비교합니다.",
            actionBadge: "그룹 전환",
          },
          {
            step: 3,
            title: "[홈으로 복귀] 클릭",
            description: "최상위 인덱스로 돌아가 3단 검증 패널에서 usePathname() 값을 다시 확인합니다.",
            actionBadge: "홈 복귀",
            observe: "usePathname()이 반환한 문자열에 (marketing) 괄호 폴더명이 포함되지 않았는지",
            observeAt: "verification",
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
              폴더 경로는 <code>(marketing)/about</code>이지만, 브라우저 주소창에는 괄호 폴더명 없이 <code>/about</code>만 보입니다. 스토어프론트(<code>(shop)</code>) 폴더와 파일 트리는 나뉘어 있어도 최종 URL 규칙은 동일합니다.
            </p>
          </div>
        </div>
      </DemoPlaygroundCard>

      <VerificationFooter />
    </DemoContainer>
  )
}
