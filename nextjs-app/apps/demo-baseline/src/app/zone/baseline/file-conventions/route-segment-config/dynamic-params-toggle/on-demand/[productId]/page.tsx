import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata(
  'baseline',
  'file-conventions/route-segment-config/dynamic-params-toggle/on-demand/[productId]',
)

// 이 세그먼트는 generateStaticParams에 없는 productId도 요청 시점에 렌더링합니다 (기본값과 동일하지만 학습 목적상 명시).
export const dynamicParams = true

import React from 'react'
import Link from 'next/link'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard, DemoDeepDiveCard } from '@study/demo-kit'
import { BranchStatusVerifier } from '../../components/BranchStatusVerifier'
import { BASE_PATH, KNOWN_PRODUCT_IDS, UNKNOWN_PRODUCT_ID, getProduct } from '../../catalog'

export function generateStaticParams() {
  return KNOWN_PRODUCT_IDS.map((productId) => ({ productId }))
}

export default async function OnDemandProductPage({
  params,
}: {
  params: Promise<{ productId: string }>
}) {
  const { productId } = await params
  const { product, isKnown } = getProduct(productId)
  const branchPath = `${BASE_PATH}/on-demand`

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={`dynamicParams = true 브랜치: /on-demand/${productId}`}
        concept="generateStaticParams가 반환하지 않은 ID라도, dynamicParams=true(기본값)라서 요청이 들어온 시점에 서버가 실제로 렌더링합니다. 정적 생성분이 아니라는 사실은 이 화면이 정상적으로 200으로 응답했다는 것 자체로 증명됩니다."
        steps={[
          {
            step: 1,
            title: isKnown ? 'generateStaticParams 포함 ID 확인' : 'generateStaticParams 미포함 ID 확인',
            description: isKnown
              ? `"${productId}"는 빌드 시점에 정적 생성된 ID입니다.`
              : `"${productId}"는 generateStaticParams에 없는 ID이지만 정상 렌더링됩니다.`,
            actionBadge: isKnown ? '정적 생성' : '온디맨드 SSR',
          },
          {
            step: 2,
            title: '하단 검증 패널에서 실제 상태 코드 확인',
            description: '지금 이 URL을 다시 fetch하여 실제 HTTP 상태 코드가 200인지 확인합니다.',
            actionBadge: '200 실측',
            observe: 'Actual 값이 200이면 dynamicParams=true의 온디맨드 렌더링이 실제로 동작한 것',
            observeAt: 'verification',
          },
        ]}
      />

      <DemoPlaygroundCard title={`상품 상세 (dynamicParams=true, ID: ${productId})`}>
        <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-zinc-900 dark:text-zinc-100">{product.name}</h4>
                <span
                  className={`rounded px-2 py-0.5 text-[11px] font-mono font-semibold ${
                    isKnown
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}
                >
                  {isKnown ? '정적 생성됨' : '온디맨드 SSR'}
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

      <BranchStatusVerifier
        title="on-demand 브랜치 실시간 응답 검증"
        expectedStatus={200}
        expectedNote={`dynamicParams=true이므로 ${isKnown ? '정적 생성분' : '미생성 ID도 요청 시점 렌더링으로'} 정상 응답해야 함`}
        description="지금 렌더링된 이 페이지의 URL을 그대로 다시 요청해, 실제 HTTP 상태 코드가 200인지 확인합니다. 하드코딩된 뱃지가 아니라 실제 fetch 결과입니다."
      />

      <DemoDeepDiveCard title="dynamicParams=true: 요청 시점 온디맨드 렌더링">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">핵심 동작</h5>
            <p>
              <code>generateStaticParams()</code>는 <code>{KNOWN_PRODUCT_IDS.join(', ')}</code>만 반환합니다. 이 세그먼트는 <code>dynamicParams = true</code>이므로, 목록에 없는 <code>{UNKNOWN_PRODUCT_ID}</code> 같은 값이 들어와도 Next.js가 요청 시점에 이 서버 컴포넌트를 실행해 정상 응답을 만듭니다. <code>next build</code> 산출물에는 <code>{KNOWN_PRODUCT_IDS.join(', ')}</code> 경로만 정적으로 포함되고, 나머지는 첫 요청 시 렌더링됩니다.
            </p>
          </div>
        </div>
      </DemoDeepDiveCard>
    </DemoContainer>
  )
}
