'use client'
import React, { useState } from 'react'
import type { CountryPreset, GeoApiResponse, GeoStatus } from '../types'

const API_ENDPOINT = '/zone/baseline/functions/next-request/geo-ip-parsing/api'

// RFC 5737 문서용 예약 대역(203.0.113.0/24)의 IP를 써서, 실제 사용자 IP처럼 보이는
// 값을 지어내지 않는다 — 이 프리셋이 "예시 값"임을 값 자체로도 알 수 있게 한다.
const COUNTRY_PRESETS: CountryPreset[] = [
  {
    code: 'KR',
    label: '🇰🇷 한국',
    headers: {
      'x-vercel-ip-country': 'KR',
      'x-vercel-ip-city': 'Seoul',
      'x-vercel-ip-country-region': '11',
      'x-real-ip': '203.0.113.10',
    },
  },
  {
    code: 'US',
    label: '🇺🇸 미국',
    headers: {
      'x-vercel-ip-country': 'US',
      'x-vercel-ip-city': 'San Francisco',
      'x-vercel-ip-country-region': 'CA',
      'x-real-ip': '203.0.113.20',
    },
  },
  {
    code: 'JP',
    label: '🇯🇵 일본',
    headers: {
      'x-vercel-ip-country': 'JP',
      'x-vercel-ip-city': 'Tokyo',
      'x-vercel-ip-country-region': '13',
      'x-real-ip': '203.0.113.30',
    },
  },
  {
    code: 'DE',
    label: '🇩🇪 독일',
    headers: {
      'x-vercel-ip-country': 'DE',
      'x-vercel-ip-city': 'Berlin',
      'x-vercel-ip-country-region': 'BE',
      'x-real-ip': '203.0.113.40',
    },
  },
]

interface NextRequestGeoDemoProps {
  onStatusChange?: (status: GeoStatus) => void
}

export function NextRequestGeoDemo({ onStatusChange }: NextRequestGeoDemoProps) {
  const [selected, setSelected] = useState<'none' | CountryPreset['code']>('none')
  const [sentHeaders, setSentHeaders] = useState<Record<string, string>>({})
  const [response, setResponse] = useState<GeoApiResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasFetched, setHasFetched] = useState(false)

  const runRequest = async (preset: CountryPreset | null) => {
    setIsLoading(true)
    setSelected(preset?.code ?? 'none')
    const headers = preset ? preset.headers : {}
    setSentHeaders(headers)
    try {
      const res = await fetch(API_ENDPOINT, { headers })
      const data: GeoApiResponse = await res.json()
      setResponse(data)
      setHasFetched(true)
      onStatusChange?.({
        country: data.telemetry.country,
        ip: data.telemetry.ip,
        currency: data.localization?.currency ?? null,
        hasFetched: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100">NextRequest.headers 기반 클라이언트 IP &amp; Geo 파싱</h4>
            <span className="rounded bg-blue-100 px-2 py-0.5 text-[11px] font-mono font-semibold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              request.headers.get(...)
            </span>
          </div>
          <p className="text-xs text-zinc-500">
            아래 버튼은 브라우저 fetch()가 실제 HTTP 요청 헤더를 다르게 실어 보낸다. 서버 route.ts는 그 헤더를 그대로 읽을 뿐, 값 자체를 가짜로 채우지 않는다.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => runRequest(null)}
            className={`rounded px-2 py-1 text-xs font-bold cursor-pointer ${
              selected === 'none'
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300'
            }`}
          >
            헤더 없음 (dev 기본값)
          </button>
          {COUNTRY_PRESETS.map((preset) => (
            <button
              key={preset.code}
              onClick={() => runRequest(preset)}
              className={`rounded px-2 py-1 text-xs font-bold cursor-pointer ${
                selected === preset.code
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-2 font-mono text-[11px]">
          <div className="font-bold text-zinc-700 dark:text-zinc-300 font-sans text-xs border-b border-zinc-200 pb-1 dark:border-zinc-800">
            1. 브라우저가 보낸 요청 헤더
          </div>
          {Object.keys(sentHeaders).length === 0 ? (
            <div className="text-zinc-400">(추가 헤더 없이 요청 — 로컬 dev 기본 상태)</div>
          ) : (
            Object.entries(sentHeaders).map(([key, value]) => (
              <div key={key} className="flex justify-between gap-2 text-zinc-600 dark:text-zinc-300">
                <span className="text-zinc-400 truncate">{key}:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{value}</span>
              </div>
            ))
          )}
        </div>

        <div className="rounded border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-2 font-mono text-[11px]">
          <div className="font-bold text-zinc-700 dark:text-zinc-300 font-sans text-xs border-b border-zinc-200 pb-1 dark:border-zinc-800">
            2. route.ts가 request.headers에서 읽은 값 ({isLoading ? '조회 중...' : hasFetched ? '완료' : '대기'})
          </div>
          {response ? (
            <div className="space-y-1.5 text-zinc-600 dark:text-zinc-300">
              <div className="flex justify-between">
                <span className="text-zinc-400">IP ({response.telemetry.ipSourceHeader ?? '없음'}):</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{response.telemetry.ip ?? '(없음)'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">country:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{response.telemetry.country ?? '(없음)'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">city:</span>
                <span>{response.telemetry.city ?? '(없음)'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">countryRegion:</span>
                <span>{response.telemetry.countryRegion ?? '(없음)'}</span>
              </div>
            </div>
          ) : (
            <div className="text-zinc-500">버튼을 눌러 요청을 보내면 결과가 표시됩니다.</div>
          )}
        </div>

        <div className="rounded border border-zinc-200 bg-zinc-950 p-3.5 font-mono text-[11px] text-zinc-300 dark:border-zinc-800 space-y-2">
          <div className="font-bold text-zinc-400 font-sans text-xs border-b border-zinc-800 pb-1">
            3. 이커머스 현지화 결과
          </div>
          {response?.localization ? (
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-zinc-500">통화:</span>
                <span className="font-bold text-amber-400">{response.localization.currency} ({response.localization.symbol})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">로케일:</span>
                <span className="text-zinc-300">{response.localization.locale}</span>
              </div>
              <div className="flex justify-between border-t border-zinc-800 pt-1">
                <span className="text-zinc-500">러닝화 현지 가격:</span>
                <span className="font-bold text-emerald-400 text-sm">{response.localization.formattedPriceExample}</span>
              </div>
            </div>
          ) : (
            <div className="text-zinc-600">country 헤더가 없어 통화를 결정할 수 없음 — KRW 기본값도 적용하지 않음</div>
          )}
        </div>
      </div>
    </div>
  )
}
