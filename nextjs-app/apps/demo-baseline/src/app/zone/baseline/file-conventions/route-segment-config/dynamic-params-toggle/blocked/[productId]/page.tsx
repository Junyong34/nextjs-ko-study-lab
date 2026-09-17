import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata(
  'baseline',
  'file-conventions/route-segment-config/dynamic-params-toggle/blocked/[productId]',
)

// generateStaticParams가 반환하지 않은 productId는 이 컴포넌트에 도달하기 전에 프레임워크가 404로 차단합니다.
export const dynamicParams = false

import React from 'react'
import Link from 'next/link'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard, DemoDeepDiveCard } from '@study/demo-kit'
import { BranchStatusVerifier } from '../../components/BranchStatusVerifier'
import { BASE_PATH, KNOWN_PRODUCT_IDS, UNKNOWN_PRODUCT_ID, getProduct } from '../../catalog'

export function generateStaticParams() {
  return KNOWN_PRODUCT_IDS.map((productId) => ({ productId }))
}

export default async function BlockedProductPage({
  params,
}: {
  params: Promise<{ productId: string }>
}) {
  const { productId } = await params
  // dynamicParams=false라서 여기 도달하는 productId는 항상 generateStaticParams 목록 안의 값입니다.
  // 목록 밖 값을 걸러내는 if/notFound() 분기가 이 컴포넌트에 없다는 점 자체가 학습 포인트입니다.
  const { product } = getProduct(productId)
  const branchPath = `${BASE_PATH}/blocked`

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={`dynamicParams = false 브랜치: /blocked/${productId}`}
        concept="generateStaticParams가 반환한 ID만 이 페이지에 도달합니다. 목록 밖 값은 이 컴포넌트 코드가 실행되기도 전에 라우팅 계층에서 404로 차단되므로, 아래 코드 어디에도 존재 여부를 검사하는 분기가 없습니다."
        steps={[
          {
            step: 1,
            title: '정적 생성 ID 정상 렌더링 확인',
            description: `"${productId}"는 generateStaticParams에 포함된 ID라서 정상 렌더링되었습니다.`,
            actionBadge: '정적 생성',
          },
          {
            step: 2,
            title: '하단 검증 패널에서 형제 경로 실시간 상태 코드 확인',
            description: `이 페이지를 벗어나지 않고, 같은 브랜치의 미생성 ID(${UNKNOWN_PRODUCT_ID}) 경로를 실제로 fetch해 상태 코드를 확인합니다.`,
            actionBadge: '404 실측',
            observe: '이 컴포넌트 코드에는 notFound() 호출이 없는데도 형제 경로가 404를 반환하는 이유 확인',
            observeAt: 'verification',
          },
          {
            step: 3,
            title: `[${UNKNOWN_PRODUCT_ID}] 링크 클릭`,
            description: '직접 이동해 실제 404 화면을 확인합니다.',
            actionBadge: '404 이동',
          },
        ]}
      />

      <DemoPlaygroundCard title={`상품 상세 (dynamicParams=false, ID: ${productId})`}>
        <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-zinc-900 dark:text-zinc-100">{product.name}</h4>
                <span className="rounded bg-blue-100 px-2 py-0.5 text-[11px] font-mono font-semibold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                  정적 생성됨
                </span>
              </div>
              <p className="text-xs text-zinc-500">{product.category}</p>
            </div>
            <Link
              href={BASE_PATH}
              className="rounded bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
            >
              ← 개요로 복귀
            </Link>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">{product.desc}</p>

          <div className="flex gap-2 pt-2 font-mono text-[11px]">
            {[...KNOWN_PRODUCT_IDS, UNKNOWN_PRODUCT_ID].map((id) => (
              <Link
                key={id}
                href={`${branchPath}/${id}`}
                className={`rounded px-2 py-1 ${
                  id === productId
                    ? 'bg-blue-600 text-white font-bold'
                    : id === UNKNOWN_PRODUCT_ID
                    ? 'bg-amber-700 text-amber-100 hover:bg-amber-600'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                {id}
              </Link>
            ))}
          </div>
        </div>
      </DemoPlaygroundCard>

      <div className="space-y-3">
        <BranchStatusVerifier
          title="blocked 브랜치 자기 자신 실시간 응답 검증"
          expectedStatus={200}
          expectedNote="generateStaticParams에 포함된 ID이므로 정상 응답해야 함"
          description="이 페이지가 렌더링되었다는 사실 자체가 이 ID가 정적 생성 목록 안에 있다는 증거입니다. 목록 밖 ID로는 이 컴포넌트가 아예 실행되지 않습니다."
        />
        <BranchStatusVerifier
          title="같은 브랜치의 미생성 ID 실시간 응답 검증"
          targetPath={`${branchPath}/${UNKNOWN_PRODUCT_ID}`}
          expectedStatus={404}
          expectedNote={`${UNKNOWN_PRODUCT_ID}는 generateStaticParams 목록 밖이고 dynamicParams=false이므로 차단되어야 함`}
          description="페이지를 벗어나지 않고, 같은 브랜치의 미생성 ID 경로를 실제로 fetch해 상태 코드를 직접 측정합니다."
        />
      </div>

      <DemoDeepDiveCard title="dynamicParams=false: 목록 밖 요청의 프레임워크 차단">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">핵심 동작</h5>
            <p>
              <code>generateStaticParams()</code>는 <code>{KNOWN_PRODUCT_IDS.join(', ')}</code>만 반환합니다. 이 세그먼트는 <code>dynamicParams = false</code>이므로, 목록 밖 값(<code>{UNKNOWN_PRODUCT_ID}</code>)에 대한 요청은 Next.js 라우팅 계층이 이 <code>page.tsx</code> 컴포넌트를 호출하기 전에 404로 응답을 종료합니다. <code>notFound()</code> 함수를 애플리케이션 코드에서 직접 호출하는 <Link className="underline" href="/zone/baseline/file-conventions/not-found/missing-product-404">별도 데모</Link>와 달리, 이 404는 애플리케이션 코드가 아니라 라우트 세그먼트 설정 하나로 강제됩니다.
            </p>
          </div>
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">실측으로 확인된 차이점: 어떤 404 화면이 뜨는가</h5>
            <p>
              <code>notFound()</code>가 호출되면 가장 가까운 세그먼트의 <code>not-found.tsx</code>가 렌더링됩니다. 하지만 <code>dynamicParams=false</code>로 차단된 경로는 <strong>이 세그먼트(및 상위 <code>blocked</code> 폴더)에 <code>not-found.tsx</code>를 두어도 그것이 쓰이지 않고, 앱 루트의 <code>not-found.tsx</code>(전역 미매칭 URL 처리기)가 렌더링됩니다</strong> — 실제로 <code>blocked/[productId]/not-found.tsx</code>를 만들어 <code>next build && next start</code>로 확인한 결과입니다. 이는 요청이 이 라우트의 세그먼트 트리에 전혀 진입하지 못하기 때문입니다.
            </p>
          </div>
        </div>
      </DemoDeepDiveCard>
    </DemoContainer>
  )
}
