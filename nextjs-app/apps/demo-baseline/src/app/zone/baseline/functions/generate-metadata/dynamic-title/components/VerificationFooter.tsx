'use client'

import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import { useLiveHead } from '../hooks/useLiveHead'
import { ROOT_TITLE, type ProductMeta } from '../types'

export interface VerificationFooterProps {
  products: ProductMeta[]
  activeProductId?: string
}

export function VerificationFooter({ products, activeProductId }: VerificationFooterProps) {
  const liveHead = useLiveHead()
  const activeProduct = products.find((p) => p.id === activeProductId)

  // 기대하는 title 조각이 실제 <title>에 포함되는지로 판정한다 — 루트 레이아웃의
  // title.template('%s | Baseline 데모 - Next.js 학습')이 뒤에 자동으로 붙기 때문에
  // 완전 일치(===)가 아니라 포함 여부(includes)로 검증해야 한다.
  const expectedFragment = activeProduct ? activeProduct.title : ROOT_TITLE
  const isMatched = liveHead ? liveHead.title.includes(expectedFragment) : undefined

  const expected = activeProduct
    ? `• /products/${activeProduct.id} 라우트의 generateMetadata({ params })가 반환한 title "${activeProduct.title}"이 실제 <title>에 포함됨\n• description도 "${activeProduct.description}"로 함께 바뀜\n• openGraph는 이 라우트가 override하지 않으므로 루트 레이아웃 값 그대로 유지됨`
    : `• 정적 루트: params 없이 title "${ROOT_TITLE}"과 고정 description을 사용함\n• 상품 프리셋으로 이동하면 그 라우트의 generateMetadata({ params })가 다시 실행되어 값이 바뀜`

  const actual = !liveHead
    ? '• <head> 읽는 중...'
    : `• 현재 라우트: ${activeProduct ? `/products/${activeProduct.id} (동적)` : '정적 루트'}\n• 실제 <title>: "${liveHead.title}"\n• 실제 meta description: "${liveHead.description}"\n• 실제 og:title(변경 없음): "${liveHead.ogTitle}"`

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="generateMetadata 동적 SEO 타이틀 검증 결과"
        expected={expected}
        actual={actual}
        isMatched={isMatched}
        description="상품 세그먼트가 바뀔 때마다 generateMetadata({ params })가 실제로 다시 실행되어 title/description을 새로 계산하는지 검증합니다."
      />
      <DemoDeepDiveCard title="generateMetadata 동적 SEO 타이틀 및 메타태그 생성">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 요약</h5>
            <p>
              <code>generateMetadata({'{'} params {'}'})</code>는 <code>page.tsx</code>가 내보내는 비동기 함수로, 다이나믹 라우트
              파라미터를 받아 <code>&lt;title&gt;</code>, <code>&lt;meta name="description"&gt;</code> 등을 요청마다 서버에서
              새로 계산한다. Next.js 15+부터 <code>params</code>는 <code>Promise</code>이므로 반드시{' '}
              <code>const {'{'} productId {'}'} = await params</code>로 언래핑해야 한다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 이 데모의 동작 원리</h5>
            <p>
              [상품 프리셋]은 실제 <code>/products/[productId]</code> 세그먼트로 이동하는 <code>&lt;Link&gt;</code>다. 이동할
              때마다 그 라우트의 <code>generateMetadata</code>가 <code>params.productId</code>로 상품을 조회해 상품별로
              고유한 title/description을 반환하고, 위 인스펙터는 그 결과를 <code>document.title</code>/meta 태그에서 직접 읽어
              보여준다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무 활용</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>상품 상세, 블로그 글, 사용자 프로필처럼 URL 파라미터에 따라 콘텐츠가 바뀌는 페이지의 SEO 타이틀/설명 생성</li>
              <li>검색 결과나 SNS 공유 링크에서 페이지마다 다른 제목·요약이 노출되어야 하는 경우</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주의사항</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>
                <strong>Server Component 전용</strong>: <code>generateMetadata</code>는 <code>'use client'</code> 컴포넌트에서
                내보낼 수 없다.
              </li>
              <li>
                <strong>title.template 자동 결합</strong>: 이 zone의 루트 레이아웃은{' '}
                <code>title: {'{'} template: '%s | Baseline 데모 - Next.js 학습' {'}'}</code>를 정의하므로, 실제 브라우저 탭
                제목은 여기서 반환한 title 뒤에 그 접미사가 자동으로 붙는다 — 위 인스펙터의 값과 상품 데이터의 title 문자열이
                완전히 같지 않은 이유다.
              </li>
              <li>
                <strong>openGraph는 그대로 상속</strong>: 이 라우트는 <code>openGraph</code> 필드를 반환하지 않으므로 루트
                레이아웃의 og:title/og:description이 그대로 유지된다. 하위 세그먼트에서 상위 값을 override하면서 일부만
                합성하려면 <code>parent: ResolvingMetadata</code>가 필요하다(별도 실습 참고).
              </li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
