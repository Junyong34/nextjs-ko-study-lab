import type { NextRequest } from 'next/server'

// 실제 네트워크 요청으로 관찰 가능한 히어로 이미지를 만들기 위한 Route Handler다.
// 데모 앱에는 public/ 자산을 두지 않으므로(apps/AGENTS.md 5항), data: URI 대신 이 진짜 엔드포인트를
// <Image src>로 사용한다 — data:/blob: URI는 Next.js가 항상 non-lazy로 취급해(get-img-props.js)
// variant별 loading 속성 차이가 사라지므로, 실제 loading="lazy" 관찰을 위해선 진짜 URL이 필요하다.
const FILL: Record<string, string> = { none: '#71717a', priority: '#d97706', preload: '#059669' }
const TEXT: Record<string, string> = {
  none: 'no preload / no priority (lazy)',
  priority: 'priority={true} (deprecated)',
  preload: 'preload={true} (recommended)',
}

export async function GET(request: NextRequest) {
  const variant = request.nextUrl.searchParams.get('variant') ?? 'none'
  const fill = FILL[variant] ?? FILL.none
  const text = TEXT[variant] ?? TEXT.none
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="500"><rect width="1200" height="500" fill="${fill}"/><text x="50%" y="50%" fill="white" font-size="40" font-family="monospace" text-anchor="middle" dominant-baseline="middle">${text}</text></svg>`

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'no-store',
    },
  })
}
