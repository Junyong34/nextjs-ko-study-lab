import type { NextRequest } from 'next/server'
import { renderOgImage } from '@/lib/seo/og-image'

/** 데모 페이지가 제목을 쿼리로 넘겨 공유하는 동적 OG 이미지 라우트 (getDemoMetadata 참고) */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') ?? 'Next.js 16 Cache Components 데모'
  const eyebrow = searchParams.get('eyebrow') ?? 'Cache Components 데모'
  return renderOgImage(title, eyebrow)
}
