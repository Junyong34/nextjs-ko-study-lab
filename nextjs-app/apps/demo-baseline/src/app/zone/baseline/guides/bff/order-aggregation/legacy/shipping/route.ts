// 클라이언트 직접 호출 시나리오에서 브라우저가 HTTP로 부르는 레거시 엔드포인트.
// 본체 로직은 _lib/legacy.ts의 함수이며, BFF(bff/route.ts)는 HTTP를 거치지 않고 같은 함수를 직접 호출한다.
import { getLegacyShipping, legacyJsonResponse } from '../../_lib/legacy'

export async function GET() {
  return legacyJsonResponse('shipping', getLegacyShipping)
}
