export interface GeoTelemetry {
  ip: string | null
  ipSourceHeader: 'x-real-ip' | 'x-forwarded-for' | null
  country: string | null
  city: string | null
  countryRegion: string | null
}

export interface LocalizationInfo {
  currency: string
  symbol: string
  locale: string
  formattedPriceExample: string
}

export interface GeoApiResponse {
  telemetry: GeoTelemetry
  localization: LocalizationInfo | null
  receivedHeaders: Record<string, string>
}

export interface CountryPreset {
  code: 'KR' | 'US' | 'JP' | 'DE'
  label: string
  headers: {
    'x-vercel-ip-country': string
    'x-vercel-ip-city': string
    'x-vercel-ip-country-region': string
    'x-real-ip': string
  }
}

export interface GeoStatus {
  country: string | null
  ip: string | null
  currency: string | null
  hasFetched: boolean
}
