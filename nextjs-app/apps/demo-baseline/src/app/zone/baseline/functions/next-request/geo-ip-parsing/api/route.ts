import { NextRequest, NextResponse } from 'next/server'
import type { GeoApiResponse } from '../types'

// NextRequest.geo / NextRequest.ip는 Next.js v15.0.0에서 완전히 제거됐다.
// 이 값들은 애초에 Next.js가 계산한 적이 없고, 호스팅 플랫폼(Vercel 등)이 엣지에서
// 요청에 주입한 HTTP 헤더였을 뿐이다 — 그래서 지금은 request.headers로 직접 읽는다.
// (@vercel/functions의 geolocation()/ipAddress() 헬퍼도 내부적으로 정확히 이 헤더들을 읽는다.)
const GEO_HEADERS = {
  country: 'x-vercel-ip-country',
  city: 'x-vercel-ip-city',
  countryRegion: 'x-vercel-ip-country-region',
  realIp: 'x-real-ip',
  forwardedFor: 'x-forwarded-for',
} as const

const CURRENCY_MAP: Record<string, { currency: string; symbol: string; locale: string; rate: number }> = {
  KR: { currency: 'KRW', symbol: '₩', locale: 'ko-KR', rate: 1 },
  US: { currency: 'USD', symbol: '$', locale: 'en-US', rate: 0.00075 },
  JP: { currency: 'JPY', symbol: '¥', locale: 'ja-JP', rate: 0.11 },
  DE: { currency: 'EUR', symbol: '€', locale: 'de-DE', rate: 0.00069 },
}

export async function GET(request: NextRequest) {
  const country = request.headers.get(GEO_HEADERS.country)
  const city = request.headers.get(GEO_HEADERS.city)
  const countryRegion = request.headers.get(GEO_HEADERS.countryRegion)

  // Vercel은 x-real-ip를 신뢰할 수 있는 클라이언트 IP로 제공한다.
  // x-forwarded-for는 표준 프록시 헤더라 체인에 여러 IP가 붙을 수 있어 첫 값만 쓴다.
  const realIp = request.headers.get(GEO_HEADERS.realIp)
  const forwardedFor = request.headers.get(GEO_HEADERS.forwardedFor)
  const ip = realIp ?? forwardedFor?.split(',')[0]?.trim() ?? null
  const ipSourceHeader = realIp ? 'x-real-ip' : forwardedFor ? 'x-forwarded-for' : null

  const currencyConfig = country ? CURRENCY_MAP[country.toUpperCase()] : undefined

  const body: GeoApiResponse = {
    telemetry: { ip, ipSourceHeader, country, city, countryRegion },
    localization: currencyConfig
      ? {
          currency: currencyConfig.currency,
          symbol: currencyConfig.symbol,
          locale: currencyConfig.locale,
          formattedPriceExample: `${currencyConfig.symbol}${(129000 * currencyConfig.rate).toLocaleString(currencyConfig.locale)}`,
        }
      : null,
    receivedHeaders: {
      [GEO_HEADERS.country]: country ?? '(없음)',
      [GEO_HEADERS.city]: city ?? '(없음)',
      [GEO_HEADERS.countryRegion]: countryRegion ?? '(없음)',
      [GEO_HEADERS.realIp]: realIp ?? '(없음)',
      [GEO_HEADERS.forwardedFor]: forwardedFor ?? '(없음)',
    },
  }

  return NextResponse.json(body)
}
