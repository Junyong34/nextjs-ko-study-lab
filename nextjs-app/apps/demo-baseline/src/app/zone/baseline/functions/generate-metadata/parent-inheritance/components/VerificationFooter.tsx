'use client'

import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import { useLiveHead } from '../hooks/useLiveHead'
import { BASE_PATH, PARENT_OPEN_GRAPH, INDEX_TITLE, findProduct } from '../types'

export interface VerificationFooterProps {
  activeProductId?: string
}

export function VerificationFooter({ activeProductId }: VerificationFooterProps) {
  const liveHead = useLiveHead()
  const activeProduct = activeProductId ? findProduct(activeProductId) : undefined

  const expectedTitleFragment = activeProduct ? activeProduct.title : INDEX_TITLE
  // metadataBase가 절대 URL로 변환하므로, 여기서는 서버가 실제로 넘긴 경로만 비교한다
  // (siteUrl 상수는 서버 전용 패키지(@study/demos)에 있어 클라이언트 번들에 넣지 않는다).
  const expectedCanonicalPath = activeProduct ? `${BASE_PATH}/products/${activeProduct.id}` : BASE_PATH
  // 인덱스는 자체 openGraph를 반환해 부모 값을 통째로 교체하므로 og:site_name이 사라져야 하고,
  // 상품 페이지는 openGraph를 반환하지 않아 부모 값이 그대로 상속돼야 한다.
  const expectedOgSiteName = activeProduct ? PARENT_OPEN_GRAPH.siteName : null
  const expectedOgTitle = activeProduct ? PARENT_OPEN_GRAPH.title : INDEX_TITLE

  const titleMatched = liveHead ? liveHead.title.includes(expectedTitleFragment) : undefined
  const canonicalMatched = liveHead ? (liveHead.canonical?.endsWith(expectedCanonicalPath) ?? false) : undefined
  const ogSiteNameMatched = liveHead ? liveHead.ogSiteName === expectedOgSiteName : undefined
  const ogTitleMatched = liveHead ? liveHead.ogTitle === expectedOgTitle : undefined

  const isMatched =
    liveHead === null
      ? undefined
      : Boolean(titleMatched && canonicalMatched && ogSiteNameMatched && ogTitleMatched)

  const expected = activeProduct
    ? `• title에 "${activeProduct.title}"이 포함됨 (generateMetadata가 반환)\n• canonical이 "${expectedCanonicalPath}"로 끝남 (generateMetadata가 반환, metadataBase가 절대 URL로 변환)\n• og:site_name: "${expectedOgSiteName}" (../layout.tsx에서 그대로 상속 — 이 라우트는 openGraph를 반환하지 않음)\n• og:title: "${expectedOgTitle}" (../layout.tsx에서 그대로 상속)`
    : `• title에 "${INDEX_TITLE}"이 포함됨 (getDemoMetadata가 반환)\n• canonical이 "${expectedCanonicalPath}"로 끝남 (이 페이지는 alternates를 반환하지 않아 ../layout.tsx 값을 그대로 상속)\n• og:site_name: 없음 (이 페이지가 자체 openGraph를 반환해 ../layout.tsx의 openGraph를 통째로 교체)\n• og:title: "${expectedOgTitle}" (getDemoMetadata가 반환)`

  const actual = !liveHead
    ? '• <head> 읽는 중...'
    : `• 실제 <title>: "${liveHead.title}"\n• 실제 canonical: "${liveHead.canonical ?? '(없음)'}"\n• 실제 og:site_name: "${liveHead.ogSiteName ?? '(없음)'}"\n• 실제 og:title: "${liveHead.ogTitle ?? '(없음)'}"`

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="부모 metadata 상속 및 canonical URL 오버라이드 검증 결과"
        expected={expected}
        actual={actual}
        isMatched={isMatched}
        description="title/canonical은 자식이 반환한 값으로 바뀌고, openGraph는 이 라우트가 반환하지 않을 때만 상위 layout.tsx 값 그대로 상속되는지 실제 <head> 태그로 검증합니다."
      />
      <DemoDeepDiveCard title="generateMetadata parent 상속과 얕은 병합(shallow merge)">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 요약</h5>
            <p>
              Next.js는 루트 세그먼트부터 현재 세그먼트까지 각 <code>metadata</code>/<code>generateMetadata</code> 결과를{' '}
              <strong>얕게(shallow) 병합</strong>한다. 같은 키를 나중 세그먼트가 다시 정의하면 그 값으로{' '}
              <strong>완전히 교체</strong>되고, 정의하지 않으면 가장 가까운 조상의 값이 <strong>그대로</strong> 내려온다.{' '}
              <code>openGraph</code>처럼 중첩된 객체도 필드 단위로 합쳐지지 않고 객체 전체가 교체·상속 중 하나로만 처리된다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 이 데모의 실제 세그먼트 구조</h5>
            <p>
              <code>../layout.tsx</code>가 <code>openGraph</code>(siteName/title/description/images)와{' '}
              <code>alternates.canonical</code>을 선언한다. 같은 디렉토리의 두 형제 라우트가 이 값을 서로 다르게 다룬다:
            </p>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1 mt-1">
              <li>
                <strong>인덱스(page.tsx)</strong>: <code>getDemoMetadata()</code>가 자체 <code>openGraph</code>를 반환 →{' '}
                <code>og:site_name</code>이 통째로 사라짐(교체).
              </li>
              <li>
                <strong>상품(products/[productId]/page.tsx)</strong>: <code>generateMetadata</code>가{' '}
                <code>title</code>/<code>alternates.canonical</code>만 반환하고 <code>openGraph</code>는 반환하지 않음 →{' '}
                <code>og:site_name</code>/<code>og:image</code>가 그대로 상속됨.
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. await parent의 역할</h5>
            <p>
              상품 페이지의 <code>generateMetadata(props, parent: ResolvingMetadata)</code>는{' '}
              <code>await parent</code>로 상위 layout.tsx가 실제로 해석한 <code>openGraph.siteName</code>을 서버에서 읽어{' '}
              <code>other</code> 필드로 <code>&lt;meta name="x-demo-parent-og-site-name"&gt;</code>에 심는다. 위 인스펙터에
              표시되는 이 값과 브라우저가 최종 렌더링한 <code>og:site_name</code>이 같다는 것은, 상속이 우연히 같은 문자열을
              써서가 아니라 실제 병합 메커니즘으로 전달됐다는 뜻이다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주의사항</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>
                <strong>부분 병합이 아니다</strong>: <code>openGraph</code>를 하나라도 반환하면 그 객체 전체가 교체된다.
                일부 필드만 이어받고 싶다면 <code>{'{'} ...(await parent).openGraph, title: "..."{'}'}</code>처럼 직접
                펼쳐서 합성해야 한다(공식 문서 <code>previousImages</code> 예제 참고).
              </li>
              <li>
                <strong>title은 별도 규칙</strong>: <code>title</code>은 상위 <code>title.template</code>과 결합하는
                고유 규칙이 있어, 이 데모의 <code>og:title</code>(완전 교체/상속)과 <code>&lt;title&gt;</code>(템플릿 결합)의
                실제 표시값이 다르게 보일 수 있다.
              </li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
