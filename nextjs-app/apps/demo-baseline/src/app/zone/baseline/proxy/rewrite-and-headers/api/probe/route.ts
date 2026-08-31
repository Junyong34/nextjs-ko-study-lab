import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const variantParam = request.nextUrl.searchParams.get('variant') || 'control'
  const countryParam = request.nextUrl.searchParams.get('country') || 'KR'
  const authParam = request.nextUrl.searchParams.get('auth') !== 'false'

  const headers = {
    'x-proxy-gateway': request.headers.get('x-proxy-gateway') || 'Active',
    'x-ab-variant': request.headers.get('x-ab-variant') || variantParam,
    'x-forwarded-country': request.headers.get('x-forwarded-country') || countryParam,
    'x-user-authenticated': request.headers.get('x-user-authenticated') || String(authParam),
    'x-proxy-rewritten-path':
      request.headers.get('x-proxy-rewritten-path') ||
      `/landing/${(request.headers.get('x-ab-variant') || variantParam) === 'variant_b' ? 'experiment-b' : 'control'}`,
  }

  const isAuthenticated = headers['x-user-authenticated'] !== 'false'

  return NextResponse.json({
    status: isAuthenticated ? 200 : 307,
    action: isAuthenticated ? 'rewrite' : 'redirect',
    rewrittenPath: headers['x-proxy-rewritten-path'],
    redirectUrl: isAuthenticated ? null : '/login',
    headers,
    timestamp: new Date().toISOString(),
  })
}
