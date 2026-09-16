import { ImageResponse } from 'next/og'
import { MOCK_PRODUCTS, MOCK_COUPONS } from '@study/demo-kit'
import { RECEIPT_MAX_QUANTITY, formatKRW } from '../types'

export const dynamic = 'force-dynamic'

const STORE_NAME = 'Next.js Study Mart'
const FREE_SHIPPING_THRESHOLD = 50000
const SHIPPING_FEE = 3000

/**
 * 실제 next/og ImageResponse Route Handler.
 * 쿼리 파라미터(주문번호/상품/수량/쿠폰/결제수단)에 따라 매 요청마다
 * 다른 결제 영수증 PNG 바이너리를 서버에서 실시간 렌더링해 반환한다.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const orderId = searchParams.get('orderId')
  const paidAt = searchParams.get('paidAt')
  const productId = searchParams.get('productId')
  const quantityRaw = searchParams.get('quantity')
  const couponId = searchParams.get('couponId') || 'none'
  const paymentMethod = searchParams.get('paymentMethod') === 'KAKAO_PAY' ? '카카오페이' : '신용카드'

  if (!orderId || !paidAt) {
    return Response.json(
      { error: 'orderId, paidAt 쿼리 파라미터가 필요합니다.' },
      { status: 400 },
    )
  }

  const product = MOCK_PRODUCTS.find((p) => p.id === productId)
  if (!product) {
    return Response.json(
      { error: `존재하지 않는 상품 ID입니다: ${productId}` },
      { status: 404 },
    )
  }

  const quantity = Number(quantityRaw)
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > RECEIPT_MAX_QUANTITY) {
    return Response.json(
      { error: `수량은 1~${RECEIPT_MAX_QUANTITY} 사이의 정수여야 합니다.` },
      { status: 400 },
    )
  }

  const coupon = MOCK_COUPONS.find((c) => c.id === couponId)
  const subtotal = product.price * quantity
  const discountAmount = coupon
    ? Math.min(
        coupon.discountType === 'PERCENT'
          ? Math.round(subtotal * (coupon.discountValue / 100))
          : coupon.discountValue,
        subtotal,
      )
    : 0
  const shippingFee = subtotal - discountAmount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
  const finalAmount = subtotal - discountAmount + shippingFee

  const paidAtLabel = new Date(paidAt).toLocaleString('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'medium',
  })

  try {
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            backgroundColor: '#fafaf9',
            padding: 28,
            fontFamily: 'sans-serif',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              height: '100%',
              backgroundColor: '#ffffff',
              borderRadius: 12,
              padding: 32,
              border: '1px solid #e4e4e7',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'flex', fontSize: 26, fontWeight: 700, color: '#18181b' }}>
                {STORE_NAME}
              </div>
              <div style={{ display: 'flex', fontSize: 16, color: '#71717a', marginTop: 4 }}>
                전자 결제 영수증
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                marginTop: 20,
                borderTop: '2px dashed #d4d4d8',
                width: '100%',
              }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', marginTop: 20, gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#52525b' }}>
                <span style={{ display: 'flex' }}>주문번호</span>
                <span style={{ display: 'flex', fontWeight: 600, color: '#18181b' }}>{orderId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#52525b' }}>
                <span style={{ display: 'flex' }}>결제일시</span>
                <span style={{ display: 'flex', color: '#18181b' }}>{paidAtLabel}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#52525b' }}>
                <span style={{ display: 'flex' }}>결제수단</span>
                <span style={{ display: 'flex', color: '#18181b' }}>{paymentMethod}</span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                marginTop: 20,
                borderTop: '1px solid #e4e4e7',
                width: '100%',
              }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', marginTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, color: '#18181b' }}>
                <span style={{ display: 'flex', maxWidth: 260 }}>
                  {product.name} x {quantity}
                </span>
                <span style={{ display: 'flex', fontWeight: 600 }}>{formatKRW(subtotal)}</span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                marginTop: 20,
                borderTop: '1px solid #e4e4e7',
                width: '100%',
              }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', marginTop: 16, gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#52525b' }}>
                <span style={{ display: 'flex' }}>상품 합계</span>
                <span style={{ display: 'flex' }}>{formatKRW(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#dc2626' }}>
                  <span style={{ display: 'flex' }}>쿠폰 할인 ({coupon!.name})</span>
                  <span style={{ display: 'flex' }}>-{formatKRW(discountAmount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#52525b' }}>
                <span style={{ display: 'flex' }}>배송비</span>
                <span style={{ display: 'flex' }}>{shippingFee === 0 ? '무료' : formatKRW(shippingFee)}</span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                marginTop: 20,
                borderTop: '2px solid #18181b',
                width: '100%',
              }}
            />

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 16,
              }}
            >
              <span style={{ display: 'flex', fontSize: 16, fontWeight: 700, color: '#18181b' }}>
                최종 결제금액
              </span>
              <span style={{ display: 'flex', fontSize: 26, fontWeight: 800, color: '#18181b' }}>
                {formatKRW(finalAmount)}
              </span>
            </div>
          </div>
        </div>
      ),
      {
        width: 480,
        height: 640,
        headers: {
          // 동일 주문번호(orderId)의 영수증 내용은 서버 시각이 아니라 요청 파라미터에만
          // 의존하는 순수 함수 결과라 재발급해도 항상 같은 이미지가 나온다 — 실제 결제
          // 서비스처럼 CDN/브라우저가 영구 캐시해도 안전하다.
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      },
    )
  } catch (error) {
    console.error('[dynamic-receipt] ImageResponse 생성 실패:', error)
    return Response.json({ error: '영수증 이미지 생성에 실패했습니다.' }, { status: 500 })
  }
}
