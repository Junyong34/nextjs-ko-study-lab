import { NextRequest, NextResponse } from 'next/server'

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

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/zone/baseline/file-conventions/proxy/:path*',
    '/zone/baseline/proxy/:path*',
    '/zone/baseline/guides/authentication/:path*',
    '/zone/baseline/guides/content-security-policy/:path*',
  ],
}
