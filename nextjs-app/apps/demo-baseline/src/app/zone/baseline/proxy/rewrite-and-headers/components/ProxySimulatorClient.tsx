'use client'

import React, { useState } from 'react'
import { VerificationFooter, ProxyProbeResponse } from './VerificationFooter'

const PROBE_ENDPOINT = '/zone/baseline/proxy/rewrite-and-headers/api/probe'

export function ProxySimulatorClient() {
  const [abBucket, setAbBucket] = useState<'control' | 'variant_b'>('control')
  const [region, setRegion] = useState<'KR' | 'US' | 'JP'>('KR')
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [activeTab, setActiveTab] = useState<'rewrite' | 'headers' | 'redirect'>('rewrite')
  const [probeResult, setProbeResult] = useState<ProxyProbeResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  const executeProxyPipeline = async (
    bucket = abBucket,
    country = region,
    auth = isAuthenticated,
  ) => {
    setIsLoading(true)
    try {
      const query = new URLSearchParams({
        variant: bucket,
        country: country,
        auth: String(auth),
      })
      const res = await fetch(`${PROBE_ENDPOINT}?${query.toString()}`)
      const data: ProxyProbeResponse = await res.json()
      setProbeResult(data)
      setHasInteracted(true)
    } catch (err) {
      console.error('Proxy probe request failed:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBucketChange = (b: 'control' | 'variant_b') => {
    setAbBucket(b)
    executeProxyPipeline(b, region, isAuthenticated)
  }

  const handleRegionChange = (r: 'KR' | 'US' | 'JP') => {
    setRegion(r)
    executeProxyPipeline(abBucket, r, isAuthenticated)
  }

  const handleAuthChange = (checked: boolean) => {
    setIsAuthenticated(checked)
    executeProxyPipeline(abBucket, region, checked)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {/* 1. 프록시 수신 요청 제어 패널 */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 rounded-md border border-zinc-200 bg-zinc-50 p-3.5 text-xs dark:border-zinc-800 dark:bg-zinc-900/50">
          <div>
            <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
              A/B 테스트 버킷 (ab_bucket)
            </label>
            <div className="mt-1 flex gap-1.5">
              {(['control', 'variant_b'] as const).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => handleBucketChange(b)}
                  className={`rounded px-2 py-1 text-[11px] font-medium transition cursor-pointer ${
                    abBucket === b
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold'
                      : 'bg-white text-zinc-700 border border-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700'
                  }`}
                >
                  {b === 'control' ? '대조군 (Control)' : '실험군 (Variant B)'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
              GeoIP 국가 (x-forwarded-country)
            </label>
            <div className="mt-1 flex gap-1.5">
              {(['KR', 'US', 'JP'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleRegionChange(r)}
                  className={`rounded px-2 py-1 text-[11px] font-mono font-medium transition cursor-pointer ${
                    region === r
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold'
                      : 'bg-white text-zinc-700 border border-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700'
                  }`}
                >
                  {r === 'KR' ? ' 한국' : r === 'US' ? ' 미국' : ' 일본'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
              인증 토큰 유무
            </label>
            <label className="mt-2 flex items-center gap-1.5 cursor-pointer text-zinc-800 dark:text-zinc-200">
              <input
                type="checkbox"
                checked={isAuthenticated}
                onChange={(e) => handleAuthChange(e.target.checked)}
                className="rounded border-zinc-300"
              />
              <span>{isAuthenticated ? '로그인 세션 유효' : '비로그인 상태 (Redirect)'}</span>
            </label>
          </div>
        </div>

        {/* 2. 실행 트리거 툴바 */}
        <div className="flex items-center justify-between rounded-md border border-zinc-200 bg-zinc-50 p-2.5 text-xs dark:border-zinc-800 dark:bg-zinc-900/50">
          <button
            type="button"
            onClick={() => executeProxyPipeline(abBucket, region, isAuthenticated)}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
          >
            <span>{isLoading ? '프록시 파이프라인 처리 중...' : '▶ 프록시 파이프라인 실행'}</span>
          </button>
          <span className="font-mono text-[11px] text-zinc-500">
            {probeResult ? `최근 응답: HTTP ${probeResult.status} (${probeResult.action})` : '대기 상태'}
          </span>
        </div>

        {/* 3. Proxy 가로채기 파이프라인 시각화 */}
        <div className="space-y-3 rounded-md border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-2 dark:border-zinc-800">
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
              Next.js 16 proxy.ts 실행 결과
            </span>
            <div className="flex gap-1.5">
              {(['rewrite', 'headers', 'redirect'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded px-2.5 py-0.5 text-[11px] font-medium uppercase transition cursor-pointer ${
                    activeTab === tab
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400'
                  }`}
                >
                  {tab === 'rewrite' ? 'A/B Rewrite' : tab === 'headers' ? '헤더 주입' : 'Redirect'}
                </button>
              ))}
            </div>
          </div>

          {activeTab === 'rewrite' && (
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between rounded bg-zinc-50 p-3 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <div>
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                    브라우저 URL: <code className="font-mono text-blue-600">/landing</code>
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">
                    NextResponse.rewrite()는 URL 변경 없이 내부 서빙 세그먼트를 투명하게 교체합니다.
                  </div>
                </div>
                <span className="rounded bg-blue-100 px-2 py-0.5 font-mono text-[10px] font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                  서빙 세그먼트: {probeResult?.rewrittenPath || `/landing/${abBucket === 'control' ? 'control' : 'experiment-b'}`}
                </span>
              </div>
            </div>
          )}

          {activeTab === 'headers' && (
            <div className="space-y-2 text-xs">
              <div className="rounded bg-zinc-900 p-3 font-mono text-emerald-400 text-[11px] space-y-1">
                <div>x-proxy-gateway: "{probeResult?.headers['x-proxy-gateway'] || 'Active'}"</div>
                <div>x-ab-variant: "{probeResult?.headers['x-ab-variant'] || abBucket}"</div>
                <div>x-forwarded-country: "{probeResult?.headers['x-forwarded-country'] || region}"</div>
              </div>
            </div>
          )}

          {activeTab === 'redirect' && (
            <div className="space-y-2 text-xs">
              <div
                className={`rounded border p-3 ${
                  isAuthenticated
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-200'
                    : 'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900 dark:bg-rose-950/20 dark:text-rose-200'
                }`}
              >
                <div className="font-bold">
                  {isAuthenticated ? '✔ 인증 성공: 보호 경로 접근 허용 (HTTP 200)' : '⚠️ 인증 실패: 307 Temporary Redirect 발동'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3단 & 4단 검증 패널 및 개념 정리 */}
      <VerificationFooter
        probeResult={probeResult}
        selectedVariant={abBucket}
        selectedCountry={region}
        isAuthenticated={isAuthenticated}
        hasInteracted={hasInteracted}
      />
    </div>
  )
}
