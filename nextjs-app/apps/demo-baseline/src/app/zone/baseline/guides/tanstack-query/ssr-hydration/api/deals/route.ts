import { NextResponse, type NextRequest } from 'next/server'
import { getDeals } from '../../lib/deals'

export const dynamic = 'force-dynamic'

// 브라우저 useQuery의 기본 queryFn이 부르는 GET. 서버 prefetch와 같은 getDeals()를 읽는다.
export async function GET(request: NextRequest) {
  const variant = request.nextUrl.searchParams.get('variant') === 'client-only' ? 'client-only' : 'prefetched'
  return NextResponse.json(await getDeals('route-handler', variant), { headers: { 'Cache-Control': 'no-store' } })
}
