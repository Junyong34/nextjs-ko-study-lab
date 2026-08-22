import { NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone()
  const pathname = url.pathname

  // 1. 프록시 게이트웨이 데모 경로 헤더 주입 및 제어
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

  // 2. 인증 가드 데모 경로 세션 쿠키 검사
  if (pathname.includes('/guides/authentication/middleware-guard')) {
    const authSession = request.cookies.get('study_auth_session')?.value

    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-auth-guard-checked', 'true')
    requestHeaders.set('x-auth-session-present', authSession ? 'yes' : 'no')

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/zone/baseline/file-conventions/proxy/:path*',
    '/zone/baseline/proxy/:path*',
    '/zone/baseline/guides/authentication/:path*',
  ],
}
