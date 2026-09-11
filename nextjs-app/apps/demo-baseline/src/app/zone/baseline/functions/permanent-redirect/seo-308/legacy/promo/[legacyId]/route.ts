import { redirect } from 'next/navigation'
import { LEGACY_PRODUCTS } from '../../../types'

const SHOP_BASE = '/zone/baseline/functions/permanent-redirect/seo-308/shop'

/**
 * 주말 한정 프로모션처럼 곧 원래 URL로 복귀할 "일시적인" 이동을 재현하는 대조군이다.
 * redirect()는 같은 NEXT_REDIRECT 메커니즘을 쓰지만 HTTP 307 Temporary Redirect를 반환해
 * 검색엔진이 이 legacy URL의 기존 색인을 계속 유지하도록 만든다 — permanentRedirect()의 308과 대비된다.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ legacyId: string }> },
) {
  const { legacyId } = await params
  const product = LEGACY_PRODUCTS.find((item) => item.legacyId === legacyId)
  const slug = product?.slug ?? LEGACY_PRODUCTS[0].slug

  redirect(`${SHOP_BASE}/${slug}?via=temporary`)
}
