import { readCounts, resetCounts } from '../server-counter'

// 목적지 layout/page의 서버 렌더 횟수를 실습 화면에 전달한다 (GET은 매 요청 동적 실행).
export async function GET() {
  return Response.json(readCounts(), { headers: { 'Cache-Control': 'no-store' } })
}

export async function POST() {
  resetCounts()
  return Response.json({ ok: true })
}
