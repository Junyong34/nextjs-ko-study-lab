'use client'

import React, { useState } from 'react'

export function ProxySimulatorClient() {
  const [abBucket, setAbBucket] = useState<'control' | 'variant_b'>('control')
  const [region, setRegion] = useState<'KR' | 'US' | 'JP'>('KR')
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [activeTab, setActiveTab] = useState<'rewrite' | 'headers' | 'redirect'>('rewrite')

  return (
    <div className="space-y-4">
      {/* 1. 프록시 수신 요청 제어 패널 */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 rounded-md border border-zinc-200 bg-zinc-50 p-3.5 text-xs dark:border-zinc-800 dark:bg-zinc-900/50">
        <div>
          <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
            A/B 테스트 버킷 쿠키 (ab_bucket)
          </label>
          <div className="mt-1 flex gap-1.5">
            <button
              type="button"
              onClick={() => setAbBucket('control')}
              className={`rounded px-2 py-1 text-[11px] font-medium transition cursor-pointer ${
                abBucket === 'control'
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold'
                  : 'bg-white text-zinc-700 border border-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700'
              }`}
            >
              대조군 (Control)
            </button>
            <button
              type="button"
              onClick={() => setAbBucket('variant_b')}
              className={`rounded px-2 py-1 text-[11px] font-medium transition cursor-pointer ${
                abBucket === 'variant_b'
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold'
                  : 'bg-white text-zinc-700 border border-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700'
              }`}
            >
              실험군 (Variant B)
            </button>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
            GeoIP 국가 (x-vercel-ip-country)
          </label>
          <div className="mt-1 flex gap-1.5">
            {(['KR', 'US', 'JP'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRegion(r)}
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
              onChange={(e) => setIsAuthenticated(e.target.checked)}
              className="rounded border-zinc-300"
            />
            <span>{isAuthenticated ? '로그인 세션 유효' : '비로그인 상태 (Redirect)'}</span>
          </label>
        </div>
      </div>

      {/* 2. Proxy 가로채기 파이프라인 시각화 */}
      <div className="space-y-3 rounded-md border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center justify-between border-b border-zinc-200 pb-2 dark:border-zinc-800">
          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
            Next.js 16 proxy.ts 실행 결과 (요청 완료 전 개입)
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

        {/* 탭 1: Rewrite 시뮬레이션 */}
        {activeTab === 'rewrite' && (
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between rounded bg-zinc-50 p-3 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div>
                <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                  브라우저 주소창 URL: <code className="font-mono text-blue-600">/landing</code>
                </div>
                <div className="text-[11px] text-zinc-500 mt-0.5">
                  NextResponse.rewrite()는 브라우저 URL 변경 없이 내부 렌더링 페이지만 몰래 교체합니다.
                </div>
              </div>
              <span className="rounded bg-blue-100 px-2 py-0.5 font-mono text-[10px] font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                실제 서빙 세그먼트: /{abBucket === 'control' ? 'landing/control' : 'landing/experiment-b'}
              </span>
            </div>

            <div
              className={`rounded-lg border p-4 transition-all ${
                abBucket === 'control'
                  ? 'border-blue-200 bg-blue-50/40 text-blue-950 dark:border-blue-900 dark:bg-blue-950/20 dark:text-blue-200'
                  : 'border-purple-200 bg-purple-50/40 text-purple-950 dark:border-purple-900 dark:bg-purple-950/20 dark:text-purple-200'
              }`}
            >
              <h4 className="font-bold text-sm">
                {abBucket === 'control'
                  ? ' 기존 프로모션 랜딩 뷰 (대조군 Control)'
                  : ' 신규 AI 추천 맞춤형 랜딩 뷰 (실험군 Variant B)'}
              </h4>
              <p className="mt-1 text-[11px] text-zinc-600 dark:text-zinc-400">
                사용자의 브라우저에는 동일하게 <code className="font-mono font-bold">/landing</code>으로 표시되지만 서버는 0ms 지연으로 A/B 테스트 분기 페이지를 렌더링했습니다.
              </p>
            </div>
          </div>
        )}

        {/* 탭 2: Headers 주입 시뮬레이션 */}
        {activeTab === 'headers' && (
          <div className="space-y-2 text-xs">
            <div className="rounded bg-zinc-900 p-3 font-mono text-emerald-400 text-[11px] space-y-1">
              <div>// proxy.ts가 downstream Server Component로 전달하는 주입 헤더</div>
              <div>x-forwarded-country: "{region}"</div>
              <div>x-request-id: "req_2026_ab{Math.floor(Math.random() * 1000)}"</div>
              <div>x-user-authenticated: "{String(isAuthenticated)}"</div>
            </div>
            <p className="text-[11px] text-zinc-500">
              Server Component 및 Route Handler에서 <code className="font-mono">headers()</code> API를 호출하여 프록시가 주입한 지역 정보와 인증 식별자를 읽을 수 있습니다.
            </p>
          </div>
        )}

        {/* 탭 3: Redirect 시뮬레이션 */}
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
                {isAuthenticated ? '[확인] 인증 성공: 요청 경로로 즉시 통과' : '[주의]️ 인증 실패: NextResponse.redirect(/login) 발동'}
              </div>
              <div className="text-[11px] mt-0.5">
                {isAuthenticated
                  ? 'NextResponse.next()를 호출하여 보호된 대시보드로 이동합니다.'
                  : '미인증 사용자는 페이지 렌더링이 시작되기도 전에 307 Temporary Redirect로 로그인 페이지로 튕겨납니다.'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
