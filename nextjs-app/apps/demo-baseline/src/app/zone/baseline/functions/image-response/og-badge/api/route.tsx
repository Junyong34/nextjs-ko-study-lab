import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'
import { OG_BADGE_DISCOUNT_RATES, OG_BADGE_PRODUCTS } from '../types'

/**
 * 모듈 스코프 카운터. 같은 dev 서버 프로세스에서 GET이 실행된 실제 횟수를 기록한다.
 * 파라미터를 바꾸지 않고 다시 요청해도 이 값이 증가한다는 것이, 응답이 캐시된 이전
 * 이미지가 아니라 매번 새로 렌더링됐다는 가장 직접적인 실측 증거다.
 */
let requestSeq = 0

function resolveDiscountRate(requested: number): number {
  return (OG_BADGE_DISCOUNT_RATES as readonly number[]).includes(requested)
    ? requested
    : OG_BADGE_DISCOUNT_RATES[0]
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const requestedProductId = searchParams.get('product') ?? OG_BADGE_PRODUCTS[0].id
  const product = OG_BADGE_PRODUCTS.find((p) => p.id === requestedProductId) ?? OG_BADGE_PRODUCTS[0]

  const requestedDiscountRate = Number(searchParams.get('discountRate') ?? OG_BADGE_DISCOUNT_RATES[0])
  const discountRate = resolveDiscountRate(requestedDiscountRate)
  const discountedPrice = Math.round((product.price * (100 - discountRate)) / 100)

  requestSeq += 1
  const renderedAt = new Date()

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#09090b',
          color: '#ffffff',
          padding: '64px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              display: 'flex',
              padding: '10px 24px',
              borderRadius: '9999px',
              backgroundColor: '#ef4444',
              fontSize: '32px',
              fontWeight: 800,
            }}
          >
            -{discountRate}% OFF
          </div>
          <div style={{ display: 'flex', fontSize: '24px', color: '#a1a1aa' }}>
            타임 세일
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', fontSize: '56px', fontWeight: 800 }}>
            {product.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '18px' }}>
            <div style={{ display: 'flex', fontSize: '64px', fontWeight: 800, color: '#34d399' }}>
              {discountedPrice.toLocaleString('ko-KR')}원
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: '32px',
                color: '#71717a',
                textDecoration: 'line-through',
              }}
            >
              {product.price.toLocaleString('ko-KR')}원
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '2px solid #27272a',
            paddingTop: '28px',
            fontSize: '22px',
            color: '#71717a',
          }}
        >
          <div style={{ display: 'flex' }}>{product.id}</div>
          <div style={{ display: 'flex' }}>
            요청 #{requestSeq} · {renderedAt.toLocaleTimeString('ko-KR', { hour12: false })}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        'Cache-Control': 'no-store',
        'x-study-og-request-seq': String(requestSeq),
        'x-study-og-rendered-at': renderedAt.toISOString(),
      },
    },
  )
}
