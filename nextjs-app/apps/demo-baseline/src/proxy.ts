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
