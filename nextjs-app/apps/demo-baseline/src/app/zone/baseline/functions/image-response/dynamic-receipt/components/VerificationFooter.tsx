'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import type { ReceiptFetchSuccess, ReceiptFetchFailure } from '../types'

export interface VerificationFooterProps {
  mode: 'idle' | 'success' | 'error'
  current?: ReceiptFetchSuccess
  previous?: ReceiptFetchSuccess
  error?: ReceiptFetchFailure
}

export function VerificationFooter({ mode, current, previous, error }: VerificationFooterProps) {
  const expected =
    '① 정상 파라미터로 요청하면 Content-Type: image/png가 반환되고, 다시 요청할 때마다 응답 PNG의 SHA-256 해시가 이전 값과 달라야 한다(주문번호·결제시각이 매번 새로 발급되므로).\n② 존재하지 않는 상품 ID로 요청하면 이미지가 아니라 4xx JSON 에러가 반환되어야 한다.'

  let actual: string = '상호작용 대기 중 (위에서 [영수증 생성]을 눌러 실제 요청을 보내 주세요.)'
  let isMatched: boolean | undefined

  if (mode === 'success' && current) {
    const hashChanged = previous ? previous.sha256 !== current.sha256 : undefined
    actual = [
      `Content-Type: ${current.contentType}`,
      `Cache-Control: ${current.cacheControl}`,
      `응답 크기: ${current.byteLength.toLocaleString()} bytes`,
      `SHA-256: ${current.sha256.slice(0, 24)}…`,
      previous
        ? `직전 응답과 해시 다름: ${hashChanged ? '예' : '아니오'} (직전 ${previous.byteLength.toLocaleString()} bytes / ${previous.sha256.slice(0, 24)}…)`
        : '아직 비교할 이전 응답 없음 — 한 번 더 [영수증 생성]을 눌러 두 PNG를 대조하세요.',
    ].join('\n')
    isMatched =
      current.contentType === 'image/png' && (previous ? hashChanged === true : undefined)
  } else if (mode === 'error' && error) {
    actual = `HTTP ${error.status} · ${error.message}`
    isMatched = error.status === 404 || error.status === 400
  }

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="ImageResponse 동적 결제 영수증 생성 검증"
        expected={expected}
        actual={actual}
        isMatched={isMatched}
        description="curl/fetch로 실제 반환된 PNG 바이트와 HTTP 헤더를 측정해 대조합니다. 서버가 보낸 값을 그대로 표시할 뿐, 화면에서 만들어낸 값이 아닙니다."
      />
      <DemoDeepDiveCard title="ImageResponse Satori 엔진 기반 동적 결제 영수증 생성">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙</h5>
            <p>
              <code>next/og</code>의 <code>ImageResponse</code>는 Route Handler(
              <code>api/route.tsx</code>)의 <code>GET</code> 안에서 <code>new ImageResponse(jsx, options)</code>
              를 호출해 JSX/Flexbox CSS를 Satori + Resvg로 해석, PNG 바이너리를 담은{' '}
              <code>Response</code>를 반환하는 표준 함수입니다. 헤드리스 브라우저 없이 서버에서
              직접 래스터화합니다.
            </p>
          </div>
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 이 데모의 동작 원리</h5>
            <p>
              상품·수량·쿠폰·결제수단을 바꿔 [영수증 생성]을 누르면, 클라이언트는 매번 새{' '}
              <code>orderId</code>와 <code>paidAt</code>을 발급해 <code>GET /api?orderId=...&amp;productId=...</code>
              로 요청합니다. Route Handler는 이 쿼리로 합계·쿠폰 할인·배송비·최종 결제금액을 서버에서
              직접 계산해 JSX에 주입하므로, 같은 상품을 골라도 클릭할 때마다 실제로 다른 PNG 바이트가
              생성됩니다 — 위 SHA-256 비교가 그 증거입니다.
            </p>
          </div>
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. Cache-Control 설계</h5>
            <p>
              응답 헤더는 <code>public, max-age=31536000, immutable</code>입니다. 같은{' '}
              <code>orderId</code>의 영수증 내용은 서버의 현재 시각이 아니라 요청 쿼리에만 좌우되는
              순수 함수 결과라 재발급해도 항상 동일한 이미지이므로, 실제 결제 서비스의 영수증
              이미지 링크처럼 브라우저·CDN이 영구 캐시해도 안전합니다.
            </p>
          </div>
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 한글 렌더링과 Satori 제약</h5>
            <p>
              Satori는 <code>display: flex</code> 기반 CSS 서브셋만 지원하고(Grid 불가), 커스텀 폰트는
              ttf/otf/woff만 허용합니다. 이 데모는 별도 <code>fonts</code> 옵션을 지정하지 않았고,
              한글은 Next.js가 감지된 문자 범위에 맞춰 자동으로 불러오는 기본 폰트로 렌더링됩니다 — 이
              zone의 다른 opengraph-image 예제들과 같은 방식입니다.
            </p>
          </div>
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 주의사항</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>JSX·CSS·폰트를 합친 번들이 500KB를 넘으면 생성에 실패합니다.</li>
              <li>[잘못된 상품 ID로 요청] 버튼처럼 서버 쪽 파라미터 검증(404/400)이 없으면 위조된 요청으로 임의 금액의 위조 영수증이 만들어질 수 있습니다.</li>
              <li>이 Cache-Control은 HTTP 캐시 계층 이야기이며, Next.js의 데이터 캐시(<code>fetch</code> 캐시)와는 별개입니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
