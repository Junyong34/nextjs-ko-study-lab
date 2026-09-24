import type { NextRequest } from 'next/server'
import { encodeScenePng } from '../lib/scene'

// "원격/동적 이미지"를 재현하는 실제 네트워크 엔드포인트.
// 서버가 응답을 ?delay=ms 만큼 실제로 늦게 보낸다 — 브라우저는 그동안 진짜로 이미지를 기다리므로
// next/image의 placeholder 상태(img의 style background-image)가 그 시간 동안 DOM에 그대로 남는다.
// 클라이언트에서 setTimeout으로 "로드된 척" 하는 것이 아니라, 요청-응답 자체가 느린 것이다.
const MAX_DELAY_MS = 5000
const WIDTH = 1200
const HEIGHT = 500

export async function GET(request: NextRequest) {
  const raw = Number(request.nextUrl.searchParams.get('delay') ?? '0')
  const delay = Number.isFinite(raw) ? Math.min(Math.max(Math.round(raw), 0), MAX_DELAY_MS) : 0

  if (delay > 0) await new Promise((resolve) => setTimeout(resolve, delay))

  const png = encodeScenePng(WIDTH, HEIGHT)
  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'no-store',
      'X-Demo-Delay-Ms': String(delay),
    },
  })
}
