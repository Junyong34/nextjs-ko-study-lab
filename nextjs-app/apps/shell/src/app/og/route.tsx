import type { NextRequest } from 'next/server'
import { siteConfig } from '@/lib/seo/config'
import { renderOgImage } from '@/lib/seo/og-image'

/** 문서/데모 상세 페이지가 제목을 쿼리로 넘겨 공유하는 동적 OG 이미지 라우트 (`buildDynamicOgImageUrl` 참고) */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') ?? siteConfig.name
  const eyebrow = searchParams.get('eyebrow') ?? siteConfig.shortName
  return renderOgImage(title, eyebrow)
}
