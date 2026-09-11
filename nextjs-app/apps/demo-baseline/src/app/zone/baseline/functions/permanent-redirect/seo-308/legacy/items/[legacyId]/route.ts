import { permanentRedirect } from 'next/navigation'
import { LEGACY_PRODUCTS } from '../../../types'

const SHOP_BASE = '/zone/baseline/functions/permanent-redirect/seo-308/shop'

/**
 * 상품 URL 체계가 숫자 ID(/legacy/items/1001)에서 SEO 슬러그(/shop/running-shoes)로
 * 영구 개편된 상황을 재현한다. permanentRedirect()는 NEXT_REDIRECT 예외를 던지고,
 * Next.js 런타임이 이를 실제 HTTP 308 Permanent Redirect 응답으로 변환해 반환한다.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ legacyId: string }> },
) {
  const { legacyId } = await params
  const product = LEGACY_PRODUCTS.find((item) => item.legacyId === legacyId)
  const slug = product?.slug ?? LEGACY_PRODUCTS[0].slug

  permanentRedirect(`${SHOP_BASE}/${slug}?via=permanent`)
}
