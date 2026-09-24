import type { NextRequest } from 'next/server'

// srcset 후보마다 "진짜로 다른 폭의 파일"이 오도록 만든 이미지 엔드포인트다.
// 데모 앱에는 public/ 자산을 둘 수 없고(apps/AGENTS.md 5항) images.unoptimized: true라서
// /_next/image 리사이즈도 없다. 그래서 래스터 리사이즈 대신 요청한 폭(w)을 intrinsic width로 갖는
// SVG를 직접 응답한다 — 브라우저가 어떤 후보를 골랐는지 파일 폭(naturalWidth)으로 되읽을 수 있다.
const DEFAULT_WIDTH = 1600

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get('w')
  const parsed = raw === null ? NaN : Number.parseInt(raw, 10)
  const hasWidth = Number.isFinite(parsed)
  const width = hasWidth ? Math.min(4096, Math.max(16, parsed)) : DEFAULT_WIDTH
  const height = Math.round(width / 2)
  const label = hasWidth ? `w=${width} (loader)` : `original ${width}px (no w)`
  const fill = hasWidth ? '#27272a' : '#52525b'
  const fontSize = Math.max(10, Math.round(width / 16))

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
    `<rect width="${width}" height="${height}" fill="${fill}"/>` +
    `<text x="50%" y="50%" fill="#fafafa" font-size="${fontSize}" font-family="monospace" text-anchor="middle" dominant-baseline="middle">${label}</text>` +
    `</svg>`

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      // 매 요청이 Network 탭에 그대로 보이도록 캐시하지 않는다.
      'Cache-Control': 'no-store',
    },
  })
}
