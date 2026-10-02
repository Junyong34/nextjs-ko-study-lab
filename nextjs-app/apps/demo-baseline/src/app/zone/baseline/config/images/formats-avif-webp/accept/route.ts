import { NextResponse, type NextRequest } from 'next/server'

// 브라우저가 이미지 요청에 실제로 싣는 Accept를 받아 보는 엔드포인트다.
// - <img src="…/accept?mode=img">: Accept를 쿠키에 담고 작은 SVG로 응답한다(이미지 응답 본문은 스크립트가 읽을 수 없다).
// - fetch("…/accept?mode=read"): 그 쿠키와 이 fetch 자신의 Accept를 JSON으로 돌려주고 쿠키를 지운다.
// 쿠키 경로를 이 핸들러로 한정해 다른 데모 요청에는 실리지 않게 한다.
const COOKIE = 'fmt-avif-webp-img-accept'
const COOKIE_PATH = '/zone/baseline/config/images/formats-avif-webp/accept'

export async function GET(request: NextRequest) {
  const accept = request.headers.get('accept')

  if (request.nextUrl.searchParams.get('mode') === 'read') {
    const stored = request.cookies.get(COOKIE)?.value
    const res = NextResponse.json(
      { imgAccept: stored ?? null, fetchAccept: accept },
      { headers: { 'Cache-Control': 'no-store' } },
    )
    res.cookies.set(COOKIE, '', { path: COOKIE_PATH, maxAge: 0 })
    return res
  }

  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="40" viewBox="0 0 320 40">' +
    '<rect width="320" height="40" fill="#27272a"/>' +
    '<text x="50%" y="50%" fill="#fafafa" font-size="13" font-family="monospace" text-anchor="middle" dominant-baseline="middle">accept/route.ts가 Accept를 받았습니다</text>' +
    '</svg>'
  const res = new NextResponse(svg, {
    headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'no-store' },
  })
  res.cookies.set(COOKIE, (accept ?? '').slice(0, 300), { path: COOKIE_PATH, maxAge: 120, sameSite: 'lax' })
  return res
}
