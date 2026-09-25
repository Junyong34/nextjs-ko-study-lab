import { NextRequest, NextResponse } from 'next/server'

const DEVICE_USER_AGENTS = {
  mobile:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
  desktop:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
} as const

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone()
  const pathname = url.pathname

  // 1. 프록시 rewrite 및 헤더 주입 데모 (/proxy/rewrite-and-headers)
  if (pathname.includes('/proxy/rewrite-and-headers')) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-proxy-gateway', 'Active')
    requestHeaders.set('x-proxy-forwarded-at', new Date().toISOString())
    const clientIp = request.headers.get('x-forwarded-for') || (request as any).ip || '127.0.0.1'
    requestHeaders.set('x-client-ip-simulated', clientIp)

    const variant = url.searchParams.get('variant') || request.cookies.get('ab_bucket')?.value || 'control'
    const country = url.searchParams.get('country') || 'KR'
    const auth = url.searchParams.get('auth') !== 'false'

    requestHeaders.set('x-ab-variant', variant)
    requestHeaders.set('x-forwarded-country', country)
    requestHeaders.set('x-user-authenticated', String(auth))
    requestHeaders.set('x-proxy-rewritten-path', `/landing/${variant === 'variant_b' ? 'experiment-b' : 'control'}`)

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
    response.headers.set('x-proxy-gateway', 'Active')
    response.headers.set('x-ab-variant', variant)
    response.headers.set('x-forwarded-country', country)
    return response
  }

  // 8. 게이트웨이 라우터 데모: 경로 접두사(prefix) 기반 내부 마이크로서비스 rewrite 라우팅
  // (/file-conventions/proxy/gateway-router)
  // 주의: 분기 2(일반 프록시 게이트웨이 데모)가 '/file-conventions/proxy'로 시작하는 모든 경로를
  // 조건 없이 가로채 반환하므로, 분기 2 뒤에 두면 이 분기는 영원히 실행되지 않는 도달 불가 코드가
  // 된다. 그래서 분기 2보다 앞에 배치했다 — 분기 1과 분기 2~7의 코드·순서, matcher의 기존 항목은
  // 그대로 두었고(바이트 단위로 무수정), 이 블록만 새로 추가했다.
  if (pathname.includes('/file-conventions/proxy/gateway-router/api/')) {
    const GATEWAY_SERVICE_TABLE: Record<string, { service: string; port: number }> = {
      orders: { service: 'order-service', port: 8081 },
      inventory: { service: 'inventory-service', port: 8082 },
      search: { service: 'search-service', port: 8083 },
    }

    const routeMatch = pathname.match(/\/file-conventions\/proxy\/gateway-router\/api\/([^/?]+)\/?$/)
    const prefix = routeMatch?.[1] ?? ''
    const upstream = GATEWAY_SERVICE_TABLE[prefix]

    if (upstream) {
      const target = url.clone()
      target.pathname = `/zone/baseline/file-conventions/proxy/gateway-router/services/${upstream.service}`
      target.search = ''

      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-gateway-target-service', upstream.service)
      requestHeaders.set('x-gateway-matched-prefix', `/api/${prefix}`)
      requestHeaders.set('x-gateway-upstream-port', String(upstream.port))
      requestHeaders.set('x-gateway-request-id', crypto.randomUUID())

      const response = NextResponse.rewrite(target, {
        request: { headers: requestHeaders },
      })
      response.headers.set('x-gateway-target-service', upstream.service)
      response.headers.set('x-gateway-matched-prefix', `/api/${prefix}`)
      response.headers.set('x-gateway-upstream-port', String(upstream.port))
      return response
    }

    // 라우팅 테이블에 없는 접두사: 실제 매핑이 없음을 헤더로만 표시하고 그대로 통과시켜
    // Next.js 파일 시스템 라우터가 존재하지 않는 services/* 파일에 대해 자연스러운 404를
    // 내도록 둔다 (가짜 응답을 직접 만들어내지 않는다 — No-Simulation 원칙).
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-gateway-target-service', 'unrouted')
    const response = NextResponse.next({ request: { headers: requestHeaders } })
    response.headers.set('x-gateway-target-service', 'unrouted')
    return response
  }

  // 2. 일반 프록시 게이트웨이 데모 경로
  if (pathname.includes('/file-conventions/proxy') || pathname.includes('/proxy/')) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-proxy-gateway', 'Active')
    requestHeaders.set('x-proxy-forwarded-at', new Date().toISOString())
    const clientIp = request.headers.get('x-forwarded-for') || (request as any).ip || '127.0.0.1'
    requestHeaders.set('x-client-ip-simulated', clientIp)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  // 3. 인증 가드 데모 경로 세션 쿠키 검사
  if (pathname.includes('/guides/authentication/middleware-guard')) {
    const authToken = request.cookies.get('auth_token')?.value
    const isAuth = authToken === 'valid'
    const probe = url.searchParams.get('probe')

    if ((probe === 'admin' || probe === 'mypage') && !isAuth) {
      const redirectUrl = url.clone()
      redirectUrl.searchParams.delete('probe')
      redirectUrl.searchParams.set('probed', probe)
      redirectUrl.searchParams.set('guardResult', 'redirected')
      return NextResponse.redirect(redirectUrl, 307)
    }

    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-auth-guard-checked', 'true')
    requestHeaders.set('x-auth-token-present', isAuth ? 'yes' : 'no')

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
    if (probe) {
      response.headers.set('x-middleware-guard-decision', 'allowed')
    }
    return response
  }

  // 4. CSP Nonce 데모 경로
  if (pathname.includes('/guides/content-security-policy/nonce-injection')) {
    const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
    const isDev = process.env.NODE_ENV === 'development'
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ''};
      style-src 'self' 'unsafe-inline';
      img-src 'self' blob: data:;
      object-src 'none';
      base-uri 'self';
    `
    const contentSecurityPolicyHeaderValue = cspHeader.replace(/\s{2,}/g, ' ').trim()

    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-nonce', nonce)
    requestHeaders.set('Content-Security-Policy', contentSecurityPolicyHeaderValue)

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
    response.headers.set('Content-Security-Policy', contentSecurityPolicyHeaderValue)
    return response
  }

  // 5. headers() Authorization 포워딩 데모: 세션 쿠키를 Authorization 헤더로 변환 (BFF 게이트웨이 역할)
  if (pathname.includes('/functions/headers/custom-auth-token')) {
    const sessionToken = request.cookies.get('demo_headers_auth_token')?.value
    if (sessionToken) {
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('authorization', `Bearer ${sessionToken}`)
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    }
    return NextResponse.next()
  }

  // 6. headers() User-Agent 기기 판별 데모: 쿼리로 지정한 기기의 실제 User-Agent로 교체
  if (pathname.includes('/functions/headers/user-agent-device')) {
    const forcedDevice = url.searchParams.get('device')
    if (forcedDevice === 'mobile' || forcedDevice === 'desktop') {
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('user-agent', DEVICE_USER_AGENTS[forcedDevice])
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    }
    return NextResponse.next()
  }

  // 7. NextResponse.rewrite() 가상 라우팅 데모: URL 유지 내부 리라이트(rewrite) vs 주소 변경 리다이렉트(redirect) 대조
  if (pathname.includes('/functions/next-response/rewrite-virtual') && !pathname.includes('/target-event')) {
    const scenario = url.searchParams.get('scenario')

    if (scenario === 'rewrite') {
      const target = url.clone()
      target.pathname = '/zone/baseline/functions/next-response/rewrite-virtual/target-event'
      target.search = ''
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-rewrite-origin', `${url.pathname}${url.search}`)
      return NextResponse.rewrite(target, {
        request: {
          headers: requestHeaders,
        },
      })
    }

    if (scenario === 'redirect') {
      const target = url.clone()
      target.pathname = '/zone/baseline/functions/next-response/rewrite-virtual/target-event'
      target.searchParams.delete('scenario')
      target.searchParams.set('via', 'redirect')
      return NextResponse.redirect(target, 307)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/zone/baseline/file-conventions/proxy/:path*',
    '/zone/baseline/proxy/:path*',
    '/zone/baseline/guides/authentication/:path*',
    '/zone/baseline/guides/content-security-policy/:path*',
    '/zone/baseline/functions/headers/:path*',
    '/zone/baseline/functions/next-response/rewrite-virtual/:path*',
  ],
}
