'use client'
import React, { useEffect, useState } from 'react'

interface TelemetryData {
  ip: string
  country: string
  city: string
  region: string
  userAgent: string
  acceptLanguage: string
}

interface LocalizationData {
  currency: string
  symbol: string
  locale: string
  exchangeRate: number
  formattedPriceExample: string
}

interface NextRequestGeoDemoProps {
  onStatusChange?: (status: {
    ip: string
    country: string
    currency: string
    isLoaded: boolean
  }) => void
}

export function NextRequestGeoDemo({ onStatusChange }: NextRequestGeoDemoProps) {
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null)
  const [localization, setLocalization] = useState<LocalizationData | null>(null)
  const [selectedCountry, setSelectedCountry] = useState<string>('KR')
  const [isLoading, setIsLoading] = useState(false)

  const API_ENDPOINT = '/zone/baseline/functions/next-request/geo-ip-parsing/api'

  const fetchTelemetry = async (countryCode: string) => {
    setIsLoading(true)
    try {
      const url = `${API_ENDPOINT}?simulateCountry=${countryCode}&simulateIp=${
        countryCode === 'KR' ? '211.234.120.10' : countryCode === 'US' ? '198.51.100.24' : '150.246.10.5'
      }`
      const res = await fetch(url)
      const data = await res.json()
      if (res.ok && data.telemetry) {
        setTelemetry(data.telemetry)
        setLocalization(data.localization)
        onStatusChange?.({
          ip: data.telemetry.ip,
          country: data.telemetry.country,
          currency: data.localization.currency,
          isLoaded: true,
        })
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTelemetry('KR')
  }, [])

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100">NextRequest 클라이언트 IP & Geo 텔레메트리</h4>
            <span className="rounded bg-blue-100 px-2 py-0.5 text-[11px] font-mono font-semibold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              request.ip / request.geo
            </span>
          </div>
          <p className="text-xs text-zinc-500">서버 route.ts에서 수신한 NextRequest 객체의 네트워크 위치 정보를 파싱합니다.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">지역 시뮬레이션:</span>
          {(['KR', 'US', 'JP', 'EU'] as const).map((cc) => (
            <button
              key={cc}
              onClick={() => {
                setSelectedCountry(cc)
                fetchTelemetry(cc)
              }}
              className={`rounded px-2 py-1 text-xs font-bold cursor-pointer ${
                selectedCountry === cc
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300'
              }`}
            >
              {cc === 'KR' ? '🇰🇷 한국' : cc === 'US' ? '🇺🇸 미국' : cc === 'JP' ? '🇯🇵 일본' : '🇪🇺 유럽'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-2.5 font-mono text-xs">
          <div className="font-bold text-zinc-700 dark:text-zinc-300 font-sans text-xs border-b border-zinc-200 pb-1 dark:border-zinc-800">
            NextRequest 수신 텔레메트리 ({isLoading ? '조회 중...' : '완료'})
          </div>
          {telemetry ? (
            <div className="space-y-1.5 text-zinc-600 dark:text-zinc-300">
              <div className="flex justify-between">
                <span className="text-zinc-400">request.ip:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{telemetry.ip}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">request.geo.country:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{telemetry.country}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">request.geo.city:</span>
                <span>{telemetry.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Accept-Language:</span>
                <span className="text-[10px] text-zinc-500 truncate max-w-[150px]">{telemetry.acceptLanguage}</span>
              </div>
            </div>
          ) : (
            <div className="text-zinc-500">데이터 로드 중...</div>
          )}
        </div>

        <div className="rounded border border-zinc-200 bg-zinc-950 p-3.5 font-mono text-xs text-zinc-300 dark:border-zinc-800 space-y-2.5">
          <div className="font-bold text-zinc-400 font-sans text-xs border-b border-zinc-800 pb-1">
            이커머스 지역 자동 현지화 (Localization)
          </div>
          {localization ? (
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-zinc-500">자동 감지 통화:</span>
                <span className="font-bold text-amber-400">{localization.currency} ({localization.symbol})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">포맷팅 로케일:</span>
                <span className="text-zinc-300">{localization.locale}</span>
              </div>
              <div className="flex justify-between border-t border-zinc-800 pt-1">
                <span className="text-zinc-500">러닝화 현지 가격:</span>
                <span className="font-bold text-emerald-400 text-sm">{localization.formattedPriceExample}</span>
              </div>
            </div>
          ) : (
            <div className="text-zinc-600">통화 계산 대기 중...</div>
          )}
        </div>
      </div>
    </div>
  )
}
