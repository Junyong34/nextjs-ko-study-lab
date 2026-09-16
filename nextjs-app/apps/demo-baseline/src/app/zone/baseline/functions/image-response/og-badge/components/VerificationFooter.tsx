'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import type { OgBadgeResponseState } from '../types'

type VerificationFooterProps = Partial<OgBadgeResponseState>

export function VerificationFooter({
  requestedProductId,
  requestedDiscountRate,
  httpStatus,
  contentType,
  contentLength,
  cacheControl,
  requestSeq,
  renderedAt,
  previousContentLength,
}: VerificationFooterProps) {
  const hasRequested = requestedProductId !== null && requestedProductId !== undefined
  const isPng = contentType === 'image/png'
  const isNoStore = cacheControl === 'no-store'
  const hasFreshSeq = requestSeq !== null && requestSeq !== undefined && requestSeq > 0
  const bytesChanged =
    previousContentLength !== null &&
    previousContentLength !== undefined &&
    contentLength !== null &&
    contentLength !== undefined
      ? previousContentLength !== contentLength
      : null

  const isMatched = hasRequested ? isPng && isNoStore && hasFreshSeq : undefined

  const expected = !hasRequested
    ? '요청 대기 중'
    : `Content-Type: image/png + Cache-Control: no-store + x-study-og-request-seq는 요청마다 새 값(캐시 재사용이 아니라 매번 서버가 다시 렌더링했다는 증거)`

  const actual = !hasRequested
    ? '상품/할인율을 선택하고 [OG 이미지 생성]을 눌러 실제 요청을 보내보세요.'
    : `HTTP ${httpStatus} · Content-Type ${contentType ?? '없음'} · Cache-Control ${cacheControl ?? '없음'} · 요청 #${requestSeq ?? '?'} (${renderedAt ?? '-'}) · ${contentLength?.toLocaleString() ?? '?'} bytes${
        bytesChanged === null ? '' : bytesChanged ? ' (직전 응답과 바이트 크기 다름)' : ' (직전 응답과 바이트 크기 동일)'
      }`

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="ImageResponse 실시간 OG 뱃지 생성 검증 결과"
        expected={expected}
        actual={actual}
        isMatched={isMatched}
        description="route.tsx의 ImageResponse가 요청 파라미터(할인율)를 읽어 매 요청 새로운 PNG를 렌더링하고, 캐시하지 않고 그대로 반환하는지 응답 헤더로 확인합니다."
      />
      <DemoDeepDiveCard title="ImageResponse 실시간 파라미터 기반 PNG 생성">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>ImageResponse</code> (<code>next/og</code>)는 Satori와 Resvg를 사용해 JSX/CSS Flexbox를
              PNG로 변환하는 생성자입니다. Route Handler의 <code>GET</code> 함수 안에서 호출하면, 함수가 실행될
              때마다 그 순간의 인자로 새 이미지를 만들어 <code>Response</code>로 반환합니다 — 미리 만들어둔
              파일을 서빙하는 것이 아닙니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              이 데모의 <code>api/route.tsx</code>는 <code>request.nextUrl.searchParams</code>로 <code>discountRate</code>와
              <code>product</code>를 읽어 화이트리스트로 검증한 뒤, 할인가를 계산해 JSX에 그대로 바인딩합니다. 요청마다
              증가하는 모듈 스코프 카운터(<code>requestSeq</code>)와 렌더링 시각을 <code>x-study-og-request-seq</code> /
              <code>x-study-og-rendered-at</code> 커스텀 헤더로 노출해, 같은 할인율로 다시 요청해도 매번 새로
              실행됐음을 직접 확인할 수 있게 했습니다. Route Handler의 <code>GET</code>은 Next.js 15부터 기본적으로
              캐시되지 않으므로, 여기서도 <code>Cache-Control: no-store</code>를 명시해 그 사실을 응답에서 그대로
              드러냅니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>
                <strong>파라미터화된 소셜 공유 이미지</strong>: 상품·쿠폰·이벤트마다 정적 이미지를 미리 만들어둘 필요 없이,
                URL 쿼리 하나로 무한한 조합의 OG 카드를 즉석에서 생성합니다.
              </li>
              <li>
                <strong>초경량 서버리스 렌더링</strong>: Chromium 없이 Satori(레이아웃) + Resvg(래스터화) 조합만으로 수십
                밀리초 내에 PNG를 만듭니다.
              </li>
              <li>
                <strong>Route Handler 기반이라 자유로운 입력 검증</strong>: 파일 컨벤션 <code>opengraph-image.tsx</code>와
                달리 임의의 쿼리 파라미터를 받아 직접 검증·가공할 수 있습니다.
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>타임세일 할인율이 실시간으로 바뀌는 상품의 소셜 공유 배너</li>
              <li>추천인 코드·닉네임이 새겨진 초대 이벤트 카드</li>
              <li>퀴즈/설문 결과처럼 사용자별로 값이 달라지는 공유 이미지</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>
                <strong>클라이언트 입력을 그대로 신뢰하지 않기</strong>: 이 데모처럼 <code>discountRate</code>를 화이트리스트로
                검증한 뒤 사용해야, 임의의 쿼리로 레이아웃이 깨지거나 잘못된 가격이 노출되는 것을 막을 수 있습니다.
              </li>
              <li>
                <strong>한글 웹폰트</strong>: Satori 기본 폰트는 한글을 지원하지 않을 수 있으므로, 실제 서비스에서는
                Pretendard/NotoSans 등의 <code>ArrayBuffer</code>를 <code>fonts</code> 옵션으로 주입해야 합니다.
              </li>
              <li>
                <strong>CSS 서브셋 제약</strong>: Flexbox 기반 속성만 지원하므로 Grid·애니메이션 등은 사용할 수 없습니다.
              </li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
