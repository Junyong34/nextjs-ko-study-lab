import { headers } from 'next/headers'
import { resolveTenant } from '../../lib/tenants'

/** 요청의 Host 헤더에서 테넌트를 판별한다. 서버가 실제로 받은 헤더만 읽고 되돌려 준다. */
export async function GET() {
  const h = await headers()
  const host = h.get('host')
  const forwardedHost = h.get('x-forwarded-host')
  // 프록시 뒤에서는 x-forwarded-host 가 원래 요청의 호스트다. 있으면 그것을 우선한다.
  const effective = forwardedHost ?? host
  const resolution = resolveTenant(effective)

  return Response.json(
    {
      host,
      forwardedHost,
      effectiveHost: effective,
      // Next 는 x-forwarded-host 가 없으면 host 값으로 채우므로, 둘이 다를 때만 별도 출처로 본다.
      source: forwardedHost && forwardedHost !== host ? 'x-forwarded-host' : 'host',
      label: resolution.label,
      tenant: resolution.tenant,
      handledAt: new Date().toISOString(),
    },
    { headers: { 'cache-control': 'no-store' } },
  )
}
