import { NextRequest, NextResponse } from 'next/server'

const CURRENCY_MAP: Record<string, { currency: string; symbol: string; rate: number; locale: string }> = {
  KR: { currency: 'KRW', symbol: '₩', rate: 1, locale: 'ko-KR' },
  US: { currency: 'USD', symbol: '$', rate: 0.00075, locale: 'en-US' },
  JP: { currency: 'JPY', symbol: '¥', rate: 0.11, locale: 'ja-JP' },
  EU: { currency: 'EUR', symbol: '€', rate: 0.00069, locale: 'de-DE' },
  GB: { currency: 'GBP', symbol: '£', rate: 0.00059, locale: 'en-GB' },
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const simulateCountry = searchParams.get('simulateCountry')
  const simulateIp = searchParams.get('simulateIp')

  // Next.js NextRequest IP & Geo 추출 (플랫폼 헤더 폴백 지원)
  const forwardedFor = request.headers.get('x-forwarded-for')
  const detectedIp = simulateIp || (request as any).ip || (forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1')
  
  const headerCountry = request.headers.get('x-vercel-ip-country') || request.headers.get('cf-ipcountry')
  const detectedCountry = (simulateCountry || (request as any).geo?.country || headerCountry || 'KR').toUpperCase()

  const currencyConfig = CURRENCY_MAP[detectedCountry] || CURRENCY_MAP['KR']

  return NextResponse.json({
    source: 'NextRequest (api/route.ts)',
    telemetry: {
      ip: detectedIp,
      country: detectedCountry,
      city: (request as any).geo?.city || (detectedCountry === 'KR' ? 'Seoul' : 'Default City'),
      region: (request as any).geo?.region || 'Default Region',
      userAgent: request.headers.get('user-agent') || 'Unknown',
      acceptLanguage: request.headers.get('accept-language') || 'ko-KR,ko;q=0.9',
    },
    localization: {
      currency: currencyConfig.currency,
      symbol: currencyConfig.symbol,
      locale: currencyConfig.locale,
      exchangeRate: currencyConfig.rate,
      formattedPriceExample: `${currencyConfig.symbol}${(129000 * currencyConfig.rate).toLocaleString()}`,
    },
    nextUrl: {
      pathname: request.nextUrl.pathname,
      search: request.nextUrl.search,
      protocol: request.nextUrl.protocol,
    },
    timestamp: new Date().toISOString(),
  })
}
