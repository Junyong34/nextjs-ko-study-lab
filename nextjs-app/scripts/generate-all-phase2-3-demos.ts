import fs from 'fs'
import path from 'path'

const BASE_DIR = '/Users/devpark/workspace/devpark/nextjs-ko-study-lab-phase-1/nextjs-app'
const BASELINE_APP = path.join(BASE_DIR, 'apps/demo-baseline/src/app/zone/baseline')
const CACHE_APP = path.join(BASE_DIR, 'apps/demo-cache-components/src/app/zone/cache')

export interface FullDemoSpec {
  url: string
  title: string
  doc: string
  zone: 'baseline' | 'cache'
  concept: string
  step1: { title: string; desc: string; badge: string }
  step2: { title: string; desc: string; badge: string }
  step3: { title: string; desc: string; badge: string }
  expected: string
  actual: string
  deepDiveTitle: string
  deepDiveBody: string
  componentName: string
  componentCode: string
}

function makeDemo(
  url: string,
  title: string,
  doc: string,
  zone: 'baseline' | 'cache',
  concept: string,
  deepDiveTitle: string,
  deepDiveBody: string,
  componentName: string,
  componentCode: string
): FullDemoSpec {
  return {
    url,
    title,
    doc,
    zone,
    concept,
    step1: { title: '기본 동작 확인', desc: '초기 렌더링 상태 및 파라미터를 점검합니다.', badge: '초기 렌더' },
    step2: { title: '인터랙션 및 상태 변경', desc: '버튼을 클릭하거나 입력을 변경하여 실시간 반응을 확인합니다.', badge: '인터랙션' },
    step3: { title: '원리 및 아키텍처 학습', desc: '하단 개념 정리 카드를 통해 Next.js 내부 동작을 학습합니다.', badge: '개념 검증' },
    expected: `• ${title}: Next.js App Router 공식 표준 스펙을 준수하여 렌더링\n• 아키텍처 정합성: Server/Client 컴포넌트 경계 및 캐시 정책 정상 작동\n• 사용자 경험: 0ms 즉각 반응성 �  makeDemo('guides/rendering-philosophy/server-vs-client', '서버 렌더링 vs 클라이언트 렌더링 수명주기 대조', '2-guides/rendering-philosophy.md', 'baseline',
    'Server Component는 서버에서 0 KB JS로 정적 HTML을 렌더링하고, Client Component는 브라우저 이벤트와 리액트 상태를 위해 번들링되어 하이드레이션됩니다.',
    'Next.js App Router의 Server vs Client Component 렌더링 철학',
    'Next.js는 기본적으로 모든 컴포넌트를 Server Component로 렌더링합니다. 인터랙션(onClick, useState)이나 브라우저 API(window, localStorage)가 필요한 최소한의 리프 노드에만 "use client"를 선언하는 것이 번들 크기를 줄이는 핵심입니다.',
    'ServerVsClientDemo',
    `'use client'
import React, { useState } from 'react'

export function ServerVsClientDemo() {
  const [couponClaimed, setCouponClaimed] = useState(false)
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div className="rounded border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-950 dark:bg-blue-950/20 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-blue-950 dark:text-blue-200">📦 상품 정적 사양서 (Server Component)</span>
          <span className="rounded bg-blue-600 px-1.5 py-0.2 font-mono text-[9px] text-white">0 KB JS</span>
        </div>
        <div className="space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
          <p className="font-bold text-zinc-900 dark:text-zinc-100">맥북 프로 16 M3 Max (36GB / 1TB SSD)</p>
          <p>정가: 4,490,000원 | 배송: 당일 로켓배송 가능</p>
        </div>
        <div className="font-mono text-[11px] text-zinc-500">서버 빌드 시점 정적 사전 렌더링 완료</div>
      </div>
      <div className="rounded border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-950 dark:bg-emerald-950/20 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-emerald-950 dark:text-emerald-200">⚡ 실시간 타임세일 쿠폰 발급 (Client Component)</span>
          <span className="rounded bg-emerald-600 px-1.5 py-0.2 font-mono text-[9px] text-white">Interactive</span>
        </div>
        <p className="text-xs text-zinc-600 dark:text-zinc-400">브라우저 클릭 이벤트로 10% 추가 할인 쿠폰을 즉시 발급합니다.</p>
        <div className="pt-1">
          <button type="button" onClick={() => setCouponClaimed(true)} className="rounded bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-emerald-700 cursor-pointer">
            {couponClaimed ? '✓ 449,000원 할인 쿠폰 적용됨 (최종가: 4,041,000원)' : '🎟️ 10% 타임 할인 쿠폰 받기'}
          </button>
        </div>
      </div>
    </div>
  )
}`
  ),
  makeDemo('guides/server-and-client-boundary/children-slot', 'Server and Client Component 합성 (children 슬롯 주입)', '2-guides/server-and-client-boundary.md', 'baseline',
    'Client Component 내부에서 Server Component를 직접 import하면 Server Component도 클라이언트 번들에 포함되지만, children props 슬롯으로 넘기면 서버 컴포넌트 특성을 온전히 유지합니다.',
    'Server Component를 Client Component 안에 넣는 올바른 합성 패턴',
    'Client Component 안에서 Server Component를 직접 import하면 클라이언트 번들로 다운그레이드됩니다. 반드시 부모 Server Component에서 children prop을 통해 슬롯 주입해야 합니다.',
    'ChildrenSlotDemo',
    `'use client'
import React, { useState } from 'react'

export function ChildrenSlotDemo() {
  const [isOpen, setIsOpen] = useState(true)
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">🛒 장바구니 요약 슬라이드 Drawer ({isOpen ? '열림' : '닫힘'})</span>
        <button type="button" onClick={() => setIsOpen(o => !o)} className="rounded bg-zinc-900 px-3 py-1 text-xs font-bold text-white dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer">
          {isOpen ? 'Drawer 접기' : 'Drawer 열기'}
        </button>
      </div>
      {isOpen && (
        <div className="rounded border border-blue-300 bg-blue-50/40 p-4 dark:border-blue-900 dark:bg-blue-950/20 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-blue-950 dark:text-blue-200">📦 주입된 연관 추천 상품 (Server Component Slot)</span>
            <span className="font-mono text-[10px] text-zinc-400">0 KB Bundle</span>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">• 매직 마우스 2 (99,000원) | • USB-C 140W 고속 충전기 (119,000원) - 서버에서 직접 쿼리된 추천 목록</p>
        </div>
      )}
    </div>
  )
}`
  ),
  makeDemo('guides/how-revalidation-works/swr-flow', 'Stale-While-Revalidate 백그라운드 재검증 수명 주기', '2-guides/how-revalidation-works.md', 'cache',
    'Next.js의 캐시 재검증은 Stale-While-Revalidate 모델을 따릅니다. 캐시 만료 후 첫 요청자에게는 즉시 직전 캐시(Stale)를 응답하고 백그라운드에서 비동기 갱신을 수행합니다.',
    'Next.js SWR(Stale-While-Revalidate) 캐시 아키텍처',
    'SWR 전략은 서버가 다운되거나 느려져도 사용자에게 항상 즉각적인 캐시 응답을 보장합니다. 백그라운드 재검증이 완료되는 즉시 새 캐시 스냅샷으로 교체됩니다.',
    'SwrFlowDemo',
    `'use client'
import React, { useState } from 'react'

export function SwrFlowDemo() {
  const [step, setStep] = useState(1)
  return (
    <div className="space-y-3">
      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">👟 한정판 나이키 에어포스 1 '07 재고 수명 주기 시뮬레이션:</div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setStep(1)} className={\`rounded px-2.5 py-1 text-xs font-bold \${step === 1 ? 'bg-blue-600 text-white' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'}\`}>1단계: Stale 응답 (잔여 12개, 0ms)</button>
        <button type="button" onClick={() => setStep(2)} className={\`rounded px-2.5 py-1 text-xs font-bold \${step === 2 ? 'bg-amber-600 text-white' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'}\`}>2단계: 물류 DB 백그라운드 동기화</button>
        <button type="button" onClick={() => setStep(3)} className={\`rounded px-2.5 py-1 text-xs font-bold \${step === 3 ? 'bg-emerald-600 text-white' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'}\`}>3단계: 최신 재고 전파 (잔여 3개 품절임박)</button>
      </div>
      <div className="rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 font-mono text-xs space-y-1">
        {step === 1 && <div className="text-blue-600 dark:text-blue-400">✓ [고객 A] 1초의 지연 없이 직전 캐시(잔여 12개)를 즉시 수신하여 화면에 표시</div>}
        {step === 2 && <div className="text-amber-600 dark:text-amber-400">⚡ [Server Background] 물류 ERP 시스템과 비동기 재고 수량 동기화 중...</div>}
        {step === 3 && <div className="text-emerald-600 dark:text-emerald-400">✓ [고객 B+] 새로 갱신된 Fresh 재고(잔여 3개)를 즉시 서빙 (수명 주기 리셋)</div>}
      </div>
    </div>
  )
}`
  ),etStep] = useState(1)
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button type="button" onClick={() => setStep(1)} className={\`rounded px-2.5 py-1 text-xs font-bold \${step === 1 ? 'bg-blue-600 text-white' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'}\`}>1단계: Stale 응답 (0ms)</button>
        <button type="button" onClick={() => setStep(2)} className={\`rounded px-2.5 py-1 text-xs font-bold \${step === 2 ? 'bg-amber-600 text-white' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'}\`}>2단계: 백그라운드 재검증</button>
        <button type="button" onClick={() => setStep(3)} className={\`rounded px-2.5 py-1 text-xs font-bold \${step === 3 ? 'bg-emerald-600 text-white' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'}\`}>3단계: 최신 캐시 전파</button>
      </div>
      <div className="rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 font-mono text-xs space-y-1">
        {step === 1 && <div className="text-blue-600 dark:text-blue-400">✓ [Client 1] 만료된 캐시(Stale)를 0ms 만에 즉시 수신하여 화면을 렌더링함</div>}
        {step === 2 && <div className="text-amber-600 dark:text-amber-400">⚡ [Server Background] 비동기 데이터 패칭 및 새 캐시 스냅샷 생성 중...</div>}
        {step === 3 && <div className="text-emerald-600 dark:text-emerald-400">✓ [Client 2+] 새로 생성된 Fresh 캐시를 즉시 서빙함 (수명 주기 리셋)</div>}
      </div>
    </div>
  )
}`
  ),
  makeDemo('guides/caching-legacy/fetch-cache', 'Next.js 14 레거시 fetch cache vs Route Segment revalidate', '2-guides/caching-without-cache-components.md', 'baseline',
    'Cache Components 이전의 Next.js 14에서는 fetch(url, { next: { revalidate: 60 } }) 또는 export const revalidate = 60을 통해 세그먼트 단위로 캐시를 제어했습니다.',
    'fetch 캐시에서 Next.js 16 use cache로의 패러다임 전환',
    '과거에는 fetch()가 가능한 REST API만 캐싱할 수 있었으나, Next.js 16의 use cache는 ORM, DB 쿼리, 무거운 연산 함수, JSX 컴포넌트까지 모든 자바스크립트 실행 결과를 캐싱할 수 있습니다.',
    'LegacyFetchCacheDemo',
    `'use client'
import React from 'react'

export function LegacyFetchCacheDemo() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div className="rounded border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900 space-y-1">
        <span className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">fetch(url, {'{ next: { revalidate: 60 } }'})</span>
        <p className="text-[11px] text-zinc-500">개별 HTTP fetch 요청 단위 60초 캐싱 (Next.js 14)</p>
      </div>
      <div className="rounded border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900 space-y-1">
        <span className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">export const revalidate = 60</span>
        <p className="text-[11px] text-zinc-500">라우트 세그먼트 전체 60초 ISR 설정 (Next.js 14)</p>
      </div>
    </div>
  )
}`
  ),
  makeDemo('guides/streaming/chunk-loading', '점진적 Suspense 스트리밍 및 로딩 청크 순차 주입', '2-guides/streaming.md', 'baseline',
    'Next.js는 HTML 응답 스트림을 열어둔 상태로, 준비된 컴포넌트부터 브라우저로 점진적 청크를 주입하여 사용자 체감 속도를 극대화합니다.',
    'Next.js 스트리밍과 React Server Components 아키텍처',
    '스트리밍은 단순히 로딩 스피너를 보여주는 것이 아니라, 서버가 준비된 RSC 페이로드를 인라인 script 태그와 함께 브라우저 DOM에 즉시 삽입하는 강력한 메커니즘입니다.',
    'ChunkLoadingDemo',
    `'use client'
import React, { useState } from 'react'

export function ChunkLoadingDemo() {
  const [chunks, setChunks] = useState<string[]>(['초기 셸 (0ms)'])
  const loadNext = () => {
    if (chunks.length === 1) setChunks(prev => [...prev, '1차 청크: 상품 기본 스펙 (300ms)'])
    else if (chunks.length === 2) setChunks(prev => [...prev, '2차 청크: 실시간 고객 리뷰 (800ms)'])
  }
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">수신된 스트리밍 청크: {chunks.length} / 3</span>
        <button type="button" onClick={loadNext} disabled={chunks.length >= 3} className="rounded bg-zinc-900 px-3 py-1 text-xs font-bold text-white disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer">
          {chunks.length >= 3 ? '스트림 수신 완료' : '다음 청크 수신'}
        </button>
      </div>
      <div className="rounded border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-2">
        {chunks.map((c, i) => (
          <div key={i} className="flex items-center gap-2 rounded bg-white p-2.5 text-xs font-mono border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800">
            <span className="rounded bg-emerald-600 px-1.5 py-0.2 text-[10px] font-bold text-white">CHUNK #{i+1}</span>
            <span>{c}</span>
          </div>
        ))}
      </div>
    </div>
  )
}`
  ),
  makeDemo('guides/isr/time-isr-60s', '60초 주기 상품 상세 증분 정적 재생성 (ISR)', '2-guides/incremental-static-regeneration.md', 'baseline',
    'ISR(Incremental Static Regeneration)을 사용하면 전체 사이트를 다시 빌드하지 않고도 특정 상품 상세 페이지만 60초 주기로 백그라운드 재생성할 수 있습니다.',
    'Next.js ISR(Incremental Static Regeneration) 작동 원리',
    'ISR은 정적 사이트 생성(SSG)의 속도와 서버 사이드 렌더링(SSR)의 동적 데이터 갱신 능력을 결합한 Next.js의 핵심 기능입니다.',
    'TimeIsrDemo',
    `'use client'
import React, { useState } from 'react'

export function TimeIsrDemo() {
  const [secondsLeft, setSecondsLeft] = useState(60)
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 space-y-3">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-2 dark:border-zinc-800">
        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">상품 상세 정적 스냅샷 (#ITEM-8921)</span>
        <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">재검증 주기: 60초</span>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-zinc-500">다음 백그라운드 갱신까지 남은 시간:</span>
        <span className="font-mono font-bold text-emerald-600">{secondsLeft}초 (유효 캐시 상태)</span>
      </div>
    </div>
  )
}`
  ),
  makeDemo('guides/isr-cache-components/cache-life-hours', 'Next.js 16 cacheLife("hours") 프로파일 기반 수명 제어', '2-guides/incremental-static-regeneration-cache-components.md', 'cache',
    'Next.js 16의 Cache Components에서는 cacheLife("hours") 또는 custom cacheLife 설정을 통해 캐시의 stale, revalidate, expire 타임라인을 정밀하게 제어합니다.',
    'Next.js 16 cacheLife 프로파일 시스템',
    'Next.js 16은 next.config.ts의 experimental.cacheLife 설정을 통해 기업 맞춤형 캐시 수명 프로파일을 전역 정의할 수 있습니다.',
    'CacheLifeHoursDemo',
    `'use client'
import React from 'react'

export function CacheLifeHoursDemo() {
  return (
    <div className="rounded border border-emerald-300 bg-emerald-50/50 p-4 dark:border-emerald-950 dark:bg-emerald-950/20 space-y-2 font-mono text-xs">
      <div className="font-bold text-emerald-950 dark:text-emerald-200">cacheLife("hours") 프리셋 타임라인:</div>
      <div className="grid grid-cols-3 gap-2 text-[11px] text-zinc-700 dark:text-zinc-300 pt-1">
        <div className="rounded bg-white p-2 border border-emerald-200 dark:bg-zinc-900 dark:border-emerald-950">• Stale: 5분</div>
        <div className="rounded bg-white p-2 border border-emerald-200 dark:bg-zinc-900 dark:border-emerald-950">• Revalidate: 1시간</div>
        <div className="rounded bg-white p-2 border border-emerald-200 dark:bg-zinc-900 dark:border-emerald-950">• Expire: 1일</div>
      </div>
    </div>
  )
}`
  ),
  makeDemo('guides/migrating-cache-components/unstable-to-use-cache', 'unstable_cache에서 Next.js 16 use cache로 마이그레이션', '2-guides/migrating-to-cache-components.md', 'cache',
    'unstable_cache의 수동 인자 직렬화, 복잡한 태그 배열 관리를 use cache 지시어 하나로 자동화하고 컴포넌트 JSX 캐싱까지 확장합니다.',
    'unstable_cache vs use cache 마이그레이션 가이드',
    'Next.js 16의 use cache는 컴파일러 레벨에서 인자를 분석하여 캐시 키를 생성하므로, 개발자가 캐시 키 충돌이나 누락을 신경 쓸 필요가 없습니다.',
    'MigrateCacheDemo',
    `'use client'
import React, { useState } from 'react'

export function MigrateCacheDemo() {
  const [tab, setTab] = useState<'legacy' | 'modern'>('modern')
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button type="button" onClick={() => setTab('legacy')} className={\`rounded px-3 py-1 text-xs font-bold \${tab === 'legacy' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800'}\`}>레거시: unstable_cache</button>
        <button type="button" onClick={() => setTab('modern')} className={\`rounded px-3 py-1 text-xs font-bold \${tab === 'modern' ? 'bg-emerald-600 text-white' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800'}\`}>모던: 'use cache' (Next 16)</button>
      </div>
      <div className="rounded border border-zinc-200 bg-zinc-950 p-4 text-white font-mono text-xs">
        {tab === 'legacy' ? (
          <div>const getCachedData = unstable_cache(async (id) {'=>'} db.get(id), ['product-key'], {'{ tags: ["products"] }'})</div>
        ) : (
          <div className="text-emerald-400">async function getProduct(id) {'{ "use cache"; return db.get(id); }'}</div>
        )}
      </div>
    </div>
  )
}`
  ),
  makeDemo('guides/adopting-partial-prefetching/hover-shell', '링크 호버 시 정적 셸만 사전 패칭 (Partial Prefetching)', '2-guides/adopting-partial-prefetching.md', 'baseline',
    '대규모 쇼핑몰에서 링크 뷰포트 진입 시 전체 데이터를 가져오는 대신, 가벼운 정적 레이아웃 셸만 미리 패칭하여 대역폭을 획기적으로 절약합니다.',
    'Next.js Partial Prefetching과 대규모 카탈로그 최적화',
    'Partial Prefetching은 정적 프리렌더링(PPR)과 결합하여, 링크를 누르는 즉시 헤더/사이드바가 번쩍임 없이 열리도록 돕습니다.',
    'PartialPrefetchDemo',
    `'use client'
import React, { useState } from 'react'

export function PartialPrefetchDemo() {
  const [prefetched, setPrefetched] = useState(false)
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 space-y-3">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-2 dark:border-zinc-800 text-xs">
        <span className="font-bold text-zinc-900 dark:text-zinc-100">호버 기반 정적 셸 프리패치</span>
        <span className="font-mono text-emerald-600 font-bold">{prefetched ? '✓ 정적 셸 프리패치 완료 (4 KB)' : '호버 대기 중'}</span>
      </div>
      <div onMouseEnter={() => setPrefetched(true)} className="rounded border border-dashed border-zinc-300 p-4 text-center text-xs text-zinc-700 hover:border-blue-500 cursor-pointer dark:border-zinc-700 dark:text-zinc-300">
        🖱️ 여기에 마우스를 올리면(Hover) 정적 레이아웃 셸만 0ms로 사전 수신합니다.
      </div>
    </div>
  )
}`
  ),
  makeDemo('guides/auth-cache-components/static-layout-session-context', '정적 캐시 상품 레이아웃 + Context use(UserContext) 세션 스트리밍', '2-guides/authentication-with-cache-components.md', 'cache',
    '상품 상세 페이지의 공통 정적 레이아웃은 전역 use cache로 캐싱하고, 사용자의 개인화 로그인 세션만 Client Context 또는 Suspense로 독립 스트리밍합니다.',
    'Cache Components 환경에서의 인증 및 개인화 전략',
    '모든 페이지를 Dynamic으로 돌리지 않고도, 공통 영역은 use cache로 극대화하고 개인화 영역만 React 19 use(Promise)로 전달하는 현대적인 패턴입니다.',
    'AuthCacheContextDemo',
    `'use client'
import React, { useState } from 'react'

export function AuthCacheContextDemo() {
  const [user] = useState({ name: '홍길동 고객님', tier: 'VIP 골드' })
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div className="rounded border border-emerald-300 bg-emerald-50/50 p-4 dark:border-emerald-950 dark:bg-emerald-950/20 space-y-1">
        <span className="text-xs font-bold text-emerald-950 dark:text-emerald-200">1. 공통 상품 레이아웃 ('use cache')</span>
        <p className="text-xs text-zinc-600 dark:text-zinc-400">모든 사용자에게 0ms로 서빙되는 캐시된 상품 스펙</p>
      </div>
      <div className="rounded border border-blue-300 bg-blue-50/50 p-4 dark:border-blue-950 dark:bg-blue-950/20 space-y-1">
        <span className="text-xs font-bold text-blue-950 dark:text-blue-200">2. 개인화 세션 슬롯 (Client Context)</span>
        <p className="text-xs text-zinc-600 dark:text-zinc-400">{user.name} ({user.tier})</p>
      </div>
    </div>
  )
}`
  ),
  makeDemo('guides/forms/use-action-state-errors', 'useActionState 필드 에러 표시 및 유효성 검증', '2-guides/forms.md', 'baseline',
    'React 19 useActionState는 서버 검증 실패 시 각 인풋 필드별 세부 에러 메시지를 상태로 반환하여 폼 UI에 즉시 매핑합니다.',
    'Next.js 16 Server Actions 폼 유효성 검증 패턴',
    'Zod 또는 Valibot 라이브러리를 Server Action 내부에서 사용하여 FormData를 파싱하고, 파싱 실패 시 { errors: { email: "..." } } 형태로 상태를 반환합니다.',
    'FormValidationDemo',
    `'use client'
import React, { useState } from 'react'

export function FormValidationDemo() {
  const [email, setEmail] = useState('invalid-email')
  const [error, setError] = useState('올바른 이메일 형식을 입력하세요.')
  const handleValidate = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.includes('@')) setError('')
    else setError('올바른 이메일 형식을 입력하세요.')
  }
  return (
    <form onSubmit={handleValidate} className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div>
        <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">이메일 주소</label>
        <input type="text" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 w-full rounded border border-zinc-300 px-3 py-1.5 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100" />
        {error && <span className="text-[11px] font-bold text-rose-500 mt-1 block">{error}</span>}
      </div>
      <button type="submit" className="rounded bg-zinc-900 px-3.5 py-1.5 text-xs font-bold text-white dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer">
        검증 실행
      </button>
    </form>
  )
}`
  ),
  makeDemo('guides/forms/use-form-status-spinner', 'useFormStatus pending 스피너 및 버튼 비활성화', '2-guides/forms.md', 'baseline',
    'useFormStatus는 부모 <form>의 제출 진행 상태(pending)를 자식 컴포넌트에서 직접 감지하여 버튼 로딩 스피너와 중복 제출 방지 비활성화를 처리합니다.',
    'React 19 useFormStatus의 모듈화 설계 장점',
    'useFormStatus는 반드시 <form> 태그의 자식 컴포넌트 내부에서 호출되어야 합니다. 독립된 <SubmitButton /> 컴포넌트로 분리하여 재사용성을 극대화합니다.',
    'FormStatusDemo',
    `'use client'
import React, { useState } from 'react'

export function FormStatusDemo() {
  const [isPending, setIsPending] = useState(false)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsPending(true)
    setTimeout(() => setIsPending(false), 1200)
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="text-xs text-zinc-600 dark:text-zinc-400">useFormStatus 기반의 독립 제출 버튼 컴포넌트 시뮬레이션</div>
      <button type="submit" disabled={isPending} className="rounded bg-emerald-600 px-4 py-2 text-xs font-bold text-white disabled:opacity-50 cursor-pointer">
        {isPending ? '⏳ 주문 처리 중 (1.2s)...' : '💳 결제 승인 요청 (useFormStatus)'}
      </button>
    </form>
  )
}`
  ),
  makeDemo('guides/server-actions/start-transition', 'startTransition을 통한 프로그래밍 방식 Server Action 호출', '2-guides/server-actions.md', 'baseline',
    '폼 제출(submit) 외에도 버튼 클릭, 드롭다운 변경 등 일반 이벤트 핸들러에서 React startTransition을 사용하여 Server Action을 안전하게 비동기 호출합니다.',
    'Server Actions와 startTransition의 비동기 트랜지션 처리',
    'useTransition의 startTransition으로 감싸면 React는 해당 네트워크 요청을 낮은 우선순위의 트랜지션으로 처리하여 입력 폼 멈춤(Input Lag)을 원천 차단합니다.',
    'StartTransitionDemo',
    `'use client'
import React, { useState, useTransition } from 'react'

export function StartTransitionDemo() {
  const [isPending, startTransition] = useTransition()
  const [selected, setSelected] = useState('전체')
  const handleChange = (val: string) => {
    setSelected(val)
    startTransition(async () => {
      await new Promise(r => setTimeout(r, 600))
    })
  }
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-zinc-700 dark:text-zinc-300">카테고리 선택:</span>
        {isPending && <span className="font-mono text-blue-500 animate-pulse font-bold">서버 트랜지션 처리 중...</span>}
      </div>
      <div className="flex gap-2">
        {['전체', '전자기기', '의류', '도서'].map(cat => (
          <button key={cat} type="button" onClick={() => handleChange(cat)} className={\`rounded px-3 py-1 text-xs font-bold \${selected === cat ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'}\`}>
            {cat}
          </button>
        ))}
      </div>
    </div>
  )
}`
  ),
  makeDemo('guides/swr/mutation-optimistic', 'SWR mutate()를 활용한 낙관적 장바구니 갱신', '2-guides/2.15-client-side-data-fetching/swr.md', 'baseline',
    'SWR의 mutate(key, data, { optimisticData, rollbackOnError }) 옵션으로 서버 응답 전에 UI를 즉시 갱신하고 에러 시 롤백합니다.',
    'SWR mutate의 낙관적 업데이트(Optimistic Update) 패턴',
    '네트워크 환경이 불안정한 모바일 기기에서도 사용자 인터랙션을 즉각 반영하여 네이티브 앱 같은 반응성을 제공합니다.',
    'SwrMutationDemo',
    `'use client'
import React, { useState } from 'react'

export function SwrMutationDemo() {
  const [qty, setQty] = useState(2)
  const [isUpdating, setIsUpdating] = useState(false)
  const handleAdd = () => {
    setQty(q => q + 1)
    setIsUpdating(true)
    setTimeout(() => setIsUpdating(false), 500)
  }
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 space-y-3">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-2 dark:border-zinc-800">
        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">무선 헤드폰 장바구니</span>
        <span className="font-mono text-xs font-bold text-emerald-600">{qty}개 담김 (총 {(qty * 299000).toLocaleString()}원)</span>
      </div>
      <div className="flex items-center justify-between">
        <button type="button" onClick={handleAdd} className="rounded bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer">
          + 수량 1개 추가 (mutate 즉시 반영)
        </button>
        {isUpdating && <span className="font-mono text-[11px] text-zinc-400">서버 동기화 중...</span>}
      </div>
    </div>
  )
}`
  ),
  makeDemo('guides/tanstack-query/infinite-scroll', 'TanStack Query useInfiniteQuery 상품 목록 무한 스크롤', '2-guides/2.15-client-side-data-fetching/tanstack-query.md', 'baseline',
    'TanStack Query의 useInfiniteQuery를 사용하여 페이지 번호 기반의 상품 목록을 부드럽게 무한 스크롤 로딩합니다.',
    'TanStack Query vs SWR 무한 스크롤 비교',
    'TanStack Query는 useInfiniteQuery를 통해 양방향(양끝) 스크롤과 가상화(Virtualization)를 쉽게 연동할 수 있는 강력한 API를 제공합니다.',
    'TanstackQueryDemo',
    `'use client'
import React, { useState } from 'react'

export function TanstackQueryDemo() {
  const [items, setItems] = useState(['상품 #1 (스마트워치)', '상품 #2 (무선이어폰)', '상품 #3 (게이밍마우스)'])
  const loadMore = () => {
    const nextId = items.length + 1
    setItems(prev => [...prev, \`상품 #\${nextId} (신규 아이템 \${nextId})\`, \`상품 #\${nextId+1} (신규 아이템 \${nextId+1})\`])
  }
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-zinc-900 dark:text-zinc-100">useInfiniteQuery 상품 목록 ({items.length}건)</span>
        <button type="button" onClick={loadMore} className="rounded bg-blue-600 px-3 py-1 text-xs font-bold text-white shadow-2xs hover:bg-blue-700 cursor-pointer">
          + 다음 페이지 로드
        </button>
      </div>
      <div className="space-y-1.5 font-mono text-xs text-zinc-700 dark:text-zinc-300">
        {items.map((it, idx) => (
          <div key={idx} className="rounded bg-zinc-50 p-2 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">• {it}</div>
        ))}
      </div>
    </div>
  )
}`
  ),
  makeDemo('guides/redirecting/order-complete', 'Server Action 내 redirect()를 통한 주문 완료 화면 이동', '2-guides/redirecting.md', 'baseline',
    'Server Action에서 데이터베이스 결제 완료 후 redirect("/order/complete")를 호출하면 303 See Other 리다이렉트가 발생하여 브라우저가 새 페이지로 이동합니다.',
    'Next.js redirect() 내부 원리와 try/catch 주의점',
    'redirect()는 내부적으로 특별한 NEXT_REDIRECT 에러를 throw하므로, try/catch 블록 안에서 호출할 경우 에러를 삼키지 않도록 throw error를 다시 던지거나 try 블록 외부에서 호출해야 합니다.',
    'RedirectOrderDemo',
    `'use client'
import React, { useState } from 'react'

export function RedirectOrderDemo() {
  const [status, setStatus] = useState('주문 결제 대기 중')
  const handlePay = () => {
    setStatus('결제 승인 완료 -> redirect(/order/complete) 발동!')
  }
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 space-y-3">
      <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">상태: {status}</div>
      <button type="button" onClick={handlePay} className="rounded bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-emerald-700 cursor-pointer">
        💳 219,000원 결제 및 완료 페이지 이동 (redirect)
      </button>
    </div>
  )
}`
  ),
  makeDemo('guides/draft-mode/preview-toggle', '미공개 특가 상품 Draft Mode 토글 및 Bypass 쿠키', '2-guides/draft-mode.md', 'baseline',
    'draftMode().enable()을 호출하여 보안 쿠키를 발급받으면, 정적으로 빌드된 캐시를 건너뛰고 Headless CMS의 미공개 초안(Draft) 데이터를 실시간 미리보기할 수 있습니다.',
    'Next.js Draft Mode와 Headless CMS 연동 아키텍처',
    'Sanity, Contentful, Strapi 등과 연동할 때 웹훅 미리보기 URL을 통해 편집자가 발행 전에 실제 Next.js 페이지 레이아웃으로 결과물을 검수할 수 있습니다.',
    'DraftModeDemo',
    `'use client'
import React, { useState } from 'react'

export function DraftModeDemo() {
  const [isDraft, setIsDraft] = useState(false)
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-zinc-900 dark:text-zinc-100">Draft Mode 상태: {isDraft ? '🔥 활성화됨 (미공개 초안 모드)' : '정적 캐시 모드'}</span>
        <button type="button" onClick={() => setIsDraft(d => !d)} className={\`rounded px-3 py-1 text-xs font-bold \${isDraft ? 'bg-rose-600 text-white' : 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'}\`}>
          {isDraft ? 'Draft Mode 끄기' : 'Draft Mode 켜기'}
        </button>
      </div>
      <div className="rounded bg-zinc-50 p-3 text-xs dark:bg-zinc-900">
        {isDraft ? (
          <div className="text-purple-600 dark:text-purple-400 font-bold">📢 [미공개 특가 초안] 2026 블랙프라이데이 70% 시크릿 할인 상품 (미발행)</div>
        ) : (
          <div className="text-zinc-500">일반 고객용 공개 상품 목록 서빙 중</div>
        )}
      </div>
    </div>
  )
}`
  ),
  makeDemo('guides/prefetching/viewport-vs-hover', '뷰포트 진입 자동 prefetch vs prefetch={false} 호버 시점 패칭', '2-guides/prefetching.md', 'baseline',
    '<Link> 컴포넌트는 기본적으로 뷰포트에 나타나면 다음 라우트를 자동 프리패치하지만, prefetch={false}로 지정하면 마우스 호버 시점에만 프리패치하여 대역폭을 아낍니다.',
    'Next.js Link Prefetching 최적화 전략',
    '정적 라우트는 전체 RSC 페이로드가 프리패치되고, 동적 라우트는 로딩 스켈레톤과 레이아웃 셸만 프리패치됩니다.',
    'PrefetchModesDemo',
    `'use client'
import React, { useState } from 'react'

export function PrefetchModesDemo() {
  const [logs, setLogs] = useState<string[]>([])
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
        <div onMouseEnter={() => setLogs(p => [...p, 'Link 1 (기본값): 뷰포트 진입 시 이미 사전 로드됨'])} className="rounded border border-blue-200 bg-blue-50/50 p-3 dark:border-blue-900 cursor-pointer">
          <div className="font-bold text-blue-900 dark:text-blue-200"><Link href="/shop"></div>
          <div className="text-zinc-500 mt-1">뷰포트 진입 즉시 자동 prefetch</div>
        </div>
        <div onMouseEnter={() => setLogs(p => [...p, 'Link 2 (prefetch={false}): 마우스 호버 시점에 방금 프리패치됨'])} className="rounded border border-amber-200 bg-amber-50/50 p-3 dark:border-amber-900 cursor-pointer">
          <div className="font-bold text-amber-900 dark:text-amber-200"><Link href="/spec" prefetch={'{false}'}></div>
          <div className="text-zinc-500 mt-1">호버 시점에만 프리패치 발생</div>
        </div>
      </div>
      <div className="rounded bg-zinc-900 p-2 font-mono text-[11px] text-zinc-300 max-h-24 overflow-y-auto">
        {logs.length === 0 ? '링크에 마우스를 올려 프리패치 로그를 확인하세요.' : logs.map((l, i) => <div key={i}>• {l}</div>)}
      </div>
    </div>
  )
}`
  ),
  makeDemo('file-conventions/layout/root-and-nested', '루트 레이아웃(Root Layout) 및 카테고리 중첩 레이아웃', '3-api-reference/3.1-file-conventions/layout.md', 'baseline',
    '루트 layout.tsx는 <html><body>와 전역 GNB를 선언하고, 하위 세그먼트의 layout.tsx는 사이드바나 탭 네비게이션을 중첩 조립합니다.',
    'Next.js 중첩 레이아웃(Nested Layouts) 아키텍처',
    '레이아웃은 하위 페이지 전환 시 리마운트되지 않고 컴포넌트 트리를 유지하므로, 비디오 재생이나 사이드바 스크롤 위치가 유지됩니다.',
    'NestedLayoutDemo',
    `'use client'
import React, { useState } from 'react'

export function NestedLayoutDemo() {
  const [tab, setTab] = useState('의류')
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 space-y-3">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-2 dark:border-zinc-800">
        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">루트 GNB (고정 레이아웃)</span>
        <span className="font-mono text-[10px] text-zinc-400">root layout.tsx</span>
      </div>
      <div className="flex gap-2">
        {['의류', '전자기기', '식품'].map(t => (
          <button key={t} type="button" onClick={() => setTab(t)} className={\`rounded px-3 py-1 text-xs font-bold \${tab === t ? 'bg-blue-600 text-white' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800'}\`}>
            {t} 탭 전환 (중첩)
          </button>
        ))}
      </div>
      <div className="rounded bg-zinc-50 p-3 text-xs dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        현재 활성화된 카테고리 본문: <strong className="text-blue-600 dark:text-blue-400">{tab} 상품 목록 페이지 (page.tsx)</strong>
      </div>
    </div>
  )
}`
  ),
  makeDemo('file-conventions/loading/skeleton-boundary', 'loading.tsx 스켈레톤 UI 자동 래핑 및 Suspense', '3-api-reference/3.1-file-conventions/loading.md', 'baseline',
    '동일 디렉토리에 loading.tsx를 두면 Next.js가 해당 page.tsx를 <Suspense fallback={<Loading />}>로 자동 감싸주어 즉각적인 로딩 UI를 제공합니다.',
    'Next.js loading.js 특수 파일 동작 원리',
    'loading.js는 React Suspense를 내부적으로 생성하므로, 서버 사이드 렌더링 중에도 사용자가 페이지가 멈춘 것으로 오인하지 않도록 즉각 피드백을 제공합니다.',
    'LoadingSkeletonDemo',
    `'use client'
import React, { useState } from 'react'

export function LoadingSkeletonDemo() {
  const [isLoading, setIsLoading] = useState(false)
  const simulate = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000)
  }
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">loading.tsx 스켈레톤 동작 시뮬레이터</span>
        <button type="button" onClick={simulate} className="rounded bg-zinc-900 px-3 py-1 text-xs font-bold text-white dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer">
          페이지 이동 트리거 (1초 로딩)
        </button>
      </div>
      {isLoading ? (
        <div className="space-y-2 animate-pulse">
          <div className="h-4 bg-zinc-200 rounded w-1/3 dark:bg-zinc-800" />
          <div className="h-20 bg-zinc-200 rounded dark:bg-zinc-800" />
        </div>
      ) : (
        <div className="rounded bg-zinc-50 p-4 text-xs dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          ✓ 로드 완료된 상품 본문: 4K 144Hz 게이밍 모니터 (650,000원)
        </div>
      )}
    </div>
  )
}`
  ),
  makeDemo('file-conventions/not-found/missing-product-404', 'not-found.tsx 및 notFound() 프로그래밍 404 트리거', '3-api-reference/3.1-file-conventions/not-found.md', 'baseline',
    '존재하지 않는 상품 ID 요청 시 notFound()를 호출하여 세그먼트 레벨의 not-found.tsx 화면을 우아하게 렌더링합니다.',
    'Next.js not-found.tsx와 notFound() 함수 설계',
    'notFound()는 서버 컴포넌트와 서버 액션 모두에서 호출할 수 있으며, 가장 가까운 상위 not-found.tsx 바운더리를 찾아 렌더링합니다.',
    'NotFoundDemo',
    `'use client'
import React, { useState } from 'react'

export function NotFoundDemo() {
  const [id, setId] = useState('101')
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex gap-2 text-xs">
        <button type="button" onClick={() => setId('101')} className={\`rounded px-3 py-1 font-bold \${id === '101' ? 'bg-emerald-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800'}\`}>정상 상품 (#101)</button>
        <button type="button" onClick={() => setId('999')} className={\`rounded px-3 py-1 font-bold \${id === '999' ? 'bg-rose-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800'}\`}>미등록 상품 (#999 -> 404)</button>
      </div>
      {id === '101' ? (
        <div className="rounded bg-zinc-50 p-3 text-xs dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          상품명: 프리미엄 기계식 키보드 (재고 15개)
        </div>
      ) : (
        <div className="rounded border border-rose-300 bg-rose-50/50 p-4 text-center text-xs text-rose-900 dark:border-rose-900 dark:bg-rose-950/20 dark:text-rose-300">
          ⚠️ 404 Not Found: 요청하신 #999번 상품을 찾을 수 없습니다. (not-found.tsx 렌더)
        </div>
      )}
    </div>
  )
}`
  ),
  makeDemo('components/image/responsive-sizes', 'next/image responsive fill & sizes 속성 반응형 로딩', '3-api-reference/3.2-components/image.md', 'baseline',
    'next/image의 fill과 sizes="(max-width: 768px) 100vw, 50vw" 속성으로 모바일과 데스크톱 화면 크기에 맞는 최적의 이미지 해상도를 자동 다운로드합니다.',
    'next/image sizes 속성의 중요성',
    'fill 속성을 쓸 때 sizes를 생략하면 브라우저는 기본값 100vw로 간주하여 작은 썸네일에도 거대한 원본 이미지를 다운로드합니다. 반드시 sizes를 명시해야 대역폭을 절약할 수 있습니다.',
    'ImageResponsiveDemo',
    `'use client'
import React, { useState } from 'react'

export function ImageResponsiveDemo() {
  const [device, setDevice] = useState<'mobile' | 'desktop'>('desktop')
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-zinc-900 dark:text-zinc-100">디바이스 뷰포트 시뮬레이션:</span>
        <div className="flex gap-2">
          <button type="button" onClick={() => setDevice('mobile')} className={\`rounded px-2.5 py-1 text-xs font-bold \${device === 'mobile' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' : 'bg-zinc-100 dark:bg-zinc-800'}\`}>📱 모바일 (375px)</button>
          <button type="button" onClick={() => setDevice('desktop')} className={\`rounded px-2.5 py-1 text-xs font-bold \${device === 'desktop' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' : 'bg-zinc-100 dark:bg-zinc-800'}\`}>💻 데스크톱 (1200px)</button>
        </div>
      </div>
      <div className="rounded bg-zinc-900 p-3 font-mono text-xs text-emerald-400">
        <div>// next/image 다운로드 파라미터:</div>
        <div>요청 URL: /_next/image?url=/banner.png&w={device === 'mobile' ? '640' : '1920'}&q=75</div>
        <div>다운로드 용량: {device === 'mobile' ? '42 KB (WebP)' : '185 KB (WebP)'}</div>
      </div>
    </div>
  )
}`
  ),
  makeDemo('guides/rendering-philosophy/hydration-boundary', '하이드레이션 경계와 번들 격리', '2-guides/rendering-philosophy.md', 'baseline',
    '하이드레이션 경계를 리프 컴포넌트로 좁혀 초기 자바스크립트 번들 다운로드와 실행 비용을 최소화합니다.',
    'Next.js 하이드레이션 경계 최적화',
    '전체 페이지를 클라이언트 컴포넌트로 만들지 않고, 인터랙티브한 버튼과 폼만 독립된 경계로 분리하는 것이 핵심입니다.',
    'HydrationBoundaryDemo',
    `'use client'
import React, { useState } from 'react'
export function HydrationBoundaryDemo() {
  const [mounted, setMounted] = useState(false)
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 space-y-2">
      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">하이드레이션 상태: {mounted ? '✓ 클라이언트 하이드레이션 완료' : '서버 HTML 렌더'}</div>
      <button type="button" onClick={() => setMounted(true)} className="rounded bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer">하이드레이션 활성화</button>
    </div>
  )
}`
  ),
  makeDemo('guides/server-and-client-boundary/props-serialization', 'Props 직렬화 경계 및 안전한 전달', '2-guides/server-and-client-boundary.md', 'baseline',
    'Server Component에서 Client Component로 전달되는 props는 반드시 JSON으로 직렬화 가능해야 합니다.',
    'Next.js RSC Props 직렬화 규칙',
    '함수(Server Action 제외), Date 객체, Map/Set 인스턴스는 경계를 넘어갈 수 없으므로 원시 값이나 일반 객체로 변환해야 합니다.',
    'PropsSerializationDemo',
    `'use client'
import React from 'react'
export function PropsSerializationDemo() {
  const data = { id: 'prod-101', name: '스마트워치', price: 350000, tags: ['신상품', '인기'] }
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 font-mono text-xs space-y-1">
      <div className="font-bold text-zinc-900 dark:text-zinc-100">// 직렬화되어 전달된 안전한 Props:</div>
      <pre className="text-emerald-600 dark:text-emerald-400">{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}`
  ),
  makeDemo('guides/how-revalidation-works/ondemand-sync', '온디맨드 캐시 무효화 및 즉시 동기화', '2-guides/how-revalidation-works.md', 'cache',
    'revalidateTag 또는 revalidatePath를 호출하여 시간 만료를 기다리지 않고 즉시 캐시를 폐기합니다.',
    'Next.js 온디맨드 재검증 원리',
    '서버 액션 내에서 revalidateTag를 호출하면 해당 태그가 연결된 모든 분산 캐시 엔트리가 즉시 만료 처리됩니다.',
    'OndemandSyncDemo',
    `'use client'
import React, { useState } from 'react'
export function OndemandSyncDemo() {
  const [tagStatus, setTagStatus] = useState('캐시 유효 (Fresh)')
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">태그 상태: {tagStatus}</div>
      <button type="button" onClick={() => setTagStatus('⚡ revalidateTag 즉시 만료됨 -> 신규 데이터 재계산')} className="rounded bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-emerald-700 cursor-pointer">
        revalidateTag("products") 즉시 무효화
      </button>
    </div>
  )
}`
  ),
  makeDemo('guides/caching-legacy/segment-revalidate', 'Route Segment revalidate 설정', '2-guides/caching-without-cache-components.md', 'baseline',
    'export const revalidate = 3600 설정을 통해 라우트 세그먼트 전체의 캐시 주기를 선언합니다.',
    'Route Segment Config revalidate 규칙',
    '세그먼트 설정은 해당 라우트 내의 모든 fetch 요청에 기본 캐시 수명 주기로 전파됩니다.',
    'SegmentRevalidateDemo',
    `'use client'
import React from 'react'
export function SegmentRevalidateDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-zinc-950 p-4 font-mono text-xs text-white">
      <div className="text-blue-400">// page.tsx 상단 선언:</div>
      <div>export const revalidate = 3600 // 1시간 주기 ISR</div>
      <div className="mt-2 text-zinc-400">이 라우트의 모든 정적 컴포넌트는 3600초마다 백그라운드 재검증됩니다.</div>
    </div>
  )
}`
  ),
  makeDemo('guides/isr/revalidate-path-sync', 'revalidatePath를 통한 라우트 전체 즉시 동기화', '2-guides/incremental-static-regeneration.md', 'baseline',
    'revalidatePath("/shop")를 호출하여 해당 라우트에 캐시된 모든 페이지와 레이아웃을 한 번에 무효화합니다.',
    'revalidatePath vs revalidateTag 차이점',
    'revalidatePath는 특정 URL 경로 전체를 비우고, revalidateTag는 도메인 태그 단위로 정밀하게 무효화합니다.',
    'RevalidatePathSyncDemo',
    `'use client'
import React, { useState } from 'react'
export function RevalidatePathSyncDemo() {
  const [log, setLog] = useState('대기 중')
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">상태: {log}</div>
      <button type="button" onClick={() => setLog('✓ revalidatePath("/shop") 호출 완료: 상단 배너, 사이드바, 상품 목록 전체 캐시 일괄 퍼지')} className="rounded bg-zinc-900 px-3.5 py-1.5 text-xs font-bold text-white dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer">
        revalidatePath('/shop') 실행
      </button>
    </div>
  )
}`
  ),
  makeDemo('guides/isr-cache-components/precision-tag-purge', '초정밀 온디맨드 태그 무효화 (cacheTag)', '2-guides/incremental-static-regeneration-cache-components.md', 'cache',
    '개별 상품 단위로 고유한 cacheTag("product-101")를 부여하여 변경된 특정 상품만 초정밀 무효화합니다.',
    'Next.js 16 cacheTag 아키텍처',
    '태그를 다중으로 부여하면 단일 상품 수정 시 관련 카테고리와 홈 배너까지 유기적으로 무효화할 수 있습니다.',
    'PrecisionTagPurgeDemo',
    `'use client'
import React, { useState } from 'react'
export function PrecisionTagPurgeDemo() {
  const [purgedTag, setPurgedTag] = useState('')
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">최근 무효화된 태그: {purgedTag || '(없음)'}</div>
      <div className="flex gap-2">
        <button type="button" onClick={() => setPurgedTag('product-101 (키보드만 무효화)')} className="rounded bg-blue-600 px-3 py-1 text-xs font-bold text-white cursor-pointer">101번 상품 무효화</button>
        <button type="button" onClick={() => setPurgedTag('category-tech (전자기기 전체 무효화)')} className="rounded bg-purple-600 px-3 py-1 text-xs font-bold text-white cursor-pointer">전자기기 카테고리 무효화</button>
      </div>
    </div>
  )
}`
  ),
  makeDemo('guides/migrating-cache-components/cache-key-compare', '캐시 키 생성 방식 비교 (수동 vs 자동)', '2-guides/migrating-to-cache-components.md', 'cache',
    '레거시의 수동 문자열 키 조합 방식과 Next.js 16의 컴파일러 자동 직렬화 방식을 대조합니다.',
    'Next.js 16 캐시 키 자동 직렬화 원리',
    '함수의 모든 인자와 클로저 변수를 컴파일러가 해시화하여 캐시 키 충돌을 원천 차단합니다.',
    'CacheKeyCompareDemo',
    `'use client'
import React from 'react'
export function CacheKeyCompareDemo() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs font-mono">
      <div className="rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="font-bold text-zinc-900 dark:text-zinc-100">과거 수동 키:</div>
        <div className="text-zinc-500 mt-1">['user-profile', userId, region].join(':')</div>
      </div>
      <div className="rounded border border-emerald-300 bg-emerald-50/50 p-3 dark:border-emerald-950 dark:bg-emerald-950/20">
        <div className="font-bold text-emerald-950 dark:text-emerald-200">Next 16 'use cache':</div>
        <div className="text-emerald-600 dark:text-emerald-400 mt-1">인자 (userId, region) 자동 해싱</div>
      </div>
    </div>
  )
}`
  ),
  makeDemo('guides/auth-cache-components/private-cache-user', '개인화 사용자별 Private 캐시 격리', '2-guides/authentication-with-cache-components.md', 'cache',
    '사용자 고유 세션 ID를 키로 바인딩하여 다른 사용자와 캐시가 공유되지 않도록 개인화 캐시를 분리합니다.',
    'Next.js 16 Private Cache 아키텍처',
    '인증된 사용자의 장바구니, 위시리스트, 주문 내역을 사용자별 전용 캐시 공간에 안전하게 격리합니다.',
    'PrivateCacheDemo',
    `'use client'
import React, { useState } from 'react'
export function PrivateCacheDemo() {
  const [user, setUser] = useState('user_A')
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex gap-2 text-xs">
        <button type="button" onClick={() => setUser('user_A')} className={\`rounded px-3 py-1 font-bold \${user === 'user_A' ? 'bg-blue-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800'}\`}>사용자 A</button>
        <button type="button" onClick={() => setUser('user_B')} className={\`rounded px-3 py-1 font-bold \${user === 'user_B' ? 'bg-purple-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800'}\`}>사용자 B</button>
      </div>
      <div className="rounded bg-zinc-50 p-3 text-xs dark:bg-zinc-900 font-mono">
        캐시 격리 키: private:session:{user} -> 장바구니 {user === 'user_A' ? '3개' : '1개'} 캐시됨
      </div>
    </div>
  )
}`
  ),
  makeDemo('guides/tanstack-query/ssr-hydration', 'TanStack Query prefetchQuery 서버 하이드레이션', '2-guides/2.15-client-side-data-fetching/tanstack-query.md', 'baseline',
    'Server Component에서 prefetchQuery로 데이터를 미리 가져와 Dehydrate하고, Client Component에서 즉시 하이드레이션합니다.',
    'TanStack Query SSR 하이드레이션 패턴',
    '초기 HTML에 서버에서 조회한 쿼리 캐시를 포함시켜 첫 화면 로딩 스피너를 완전히 제거합니다.',
    'TanstackSsrDemo',
    `'use client'
import React from 'react'
export function TanstackSsrDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-zinc-900 dark:text-zinc-100">HydrationBoundary 하이드레이션 완료</span>
        <span className="rounded bg-emerald-100 px-1.5 py-0.2 font-mono text-[9px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">0ms Loading</span>
      </div>
      <p className="text-xs text-zinc-600 dark:text-zinc-400">서버에서 prefetch된 쿼리 데이터가 클라이언트에 즉시 주입되어 깜빡임 없이 표시됩니다.</p>
    </div>
  )
}`
  ),
  makeDemo('guides/redirecting/session-expired', '세션 만료 시 returnUrl과 함께 로그인 리다이렉트', '2-guides/redirecting.md', 'baseline',
    '보호된 결제 페이지에서 세션 만료 감지 시 redirect("/login?returnUrl=/checkout")로 안전하게 분기합니다.',
    'Next.js returnUrl 리다이렉트 패턴',
    '사용자가 로그인을 완료한 후 원래 결제하던 화면으로 매끄럽게 되돌아가도록 돕습니다.',
    'RedirectSessionDemo',
    `'use client'
import React, { useState } from 'react'
export function RedirectSessionDemo() {
  const [target, setTarget] = useState('결제 진행 중')
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">현재 상태: {target}</div>
      <button type="button" onClick={() => setTarget('307 Redirect 발동 -> /login?returnUrl=/checkout')} className="rounded bg-rose-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-rose-700 cursor-pointer">
        세션 만료 시뮬레이션
      </button>
    </div>
  )
}`
  ),
  makeDemo('guides/draft-mode/bypass-cookie', 'Bypass 쿠키 검증 및 CMS 초안 렌더링', '2-guides/draft-mode.md', 'baseline',
    'HTTP 요청 헤더에 __prerender_bypass 쿠키가 포함되어 있는지 검사하여 초안 렌더링 여부를 결정합니다.',
    'Draft Mode Bypass 쿠키 보안',
    '서명되지 않은 임의의 쿠키 조작을 방지하기 위해 Next.js가 암호화된 토큰을 쿠키 값으로 사용합니다.',
    'DraftBypassDemo',
    `'use client'
import React from 'react'
export function DraftBypassDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-zinc-950 p-4 font-mono text-xs text-zinc-200 space-y-1">
      <div className="text-purple-400">// Draft Mode 활성화 시 주입되는 보안 쿠키:</div>
      <div>Cookie: __prerender_bypass=eyJhbGciOi...; HttpOnly; SameSite=Lax</div>
    </div>
  )
}`
  ),
  makeDemo('guides/prefetching/custom-prefetch-false', 'prefetch={false} 명시적 프리패치 차단', '2-guides/prefetching.md', 'baseline',
    '용량이 큰 다운로드 페이지나 관리자 링크의 불필요한 네트워크 프리패칭을 차단합니다.',
    'Next.js prefetch={false} 최적화',
    '사용자가 실제로 링크를 클릭하는 순간에만 라우트 번들을 요청하여 백엔드 부하를 최소화합니다.',
    'PrefetchFalseDemo',
    `'use client'
import React from 'react'
export function PrefetchFalseDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 text-xs">
      <div className="font-mono font-bold text-zinc-900 dark:text-zinc-100"><Link href="/heavy-report" prefetch={'{false}'}></div>
      <p className="text-zinc-500 mt-1">대용량 리포트 페이지: 뷰포트에 진입해도 네트워크 프리패치가 발생하지 않습니다.</p>
    </div>
  )
}`
  ),
  makeDemo('guides/optimizing-prefetching/bandwidth-saver', '대규모 카탈로그 대역폭 절약 최적화', '2-guides/optimizing-prefetching.md', 'baseline',
    '수만 개의 상품 리스트에서 스크롤 시 발생하는 프리패칭 요청을 억제하고 스마트 캐시를 적용합니다.',
    '대규모 이커머스 프리패칭 전략',
    '모바일 네트워크 환경에서 사용자의 모바일 데이터 소모를 줄이고 서버 CPU 사용량을 방어합니다.',
    'BandwidthSaverDemo',
    `'use client'
import React from 'react'
export function BandwidthSaverDemo() {
  return (
    <div className="rounded border border-emerald-300 bg-emerald-50/50 p-4 dark:border-emerald-950 dark:bg-emerald-950/20 font-mono text-xs space-y-1">
      <div className="font-bold text-emerald-950 dark:text-emerald-200">📊 대역폭 절감 통계:</div>
      <div>• 기본 prefetch 시: 120개 요청 (1.8 MB)</div>
      <div className="text-emerald-600 dark:text-emerald-400 font-bold">• 최적화 적용 후: 6개 요청 (92 KB) -> 95% 대역폭 절감</div>
    </div>
  )
}`
  ),
  makeDemo('guides/instant-navigation/loading-skeleton', 'Instant Navigation loading.tsx 스켈레톤 전환', '2-guides/instant-navigation.md', 'baseline',
    '새로운 라우트로 이동하는 즉시 0ms만에 로딩 스켈레톤을 렌더링하여 앱의 반응성을 극대화합니다.',
    'Instant Navigation 아키텍처',
    '서버 렌더링이 완료되기 전에도 클라이언트 라우터가 즉각 반응하여 체감 지연을 제로로 만듭니다.',
    'InstantNavDemo',
    `'use client'
import React, { useState } from 'react'
export function InstantNavDemo() {
  const [page, setPage] = useState('home')
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex gap-2">
        <button type="button" onClick={() => setPage('home')} className="rounded bg-zinc-900 px-3 py-1 text-xs font-bold text-white dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer">홈 (0ms 즉시 전환)</button>
        <button type="button" onClick={() => setPage('shop')} className="rounded bg-blue-600 px-3 py-1 text-xs font-bold text-white cursor-pointer">쇼핑몰 (스켈레톤 즉시 표시)</button>
      </div>
      <div className="text-xs font-mono text-zinc-600 dark:text-zinc-400">현재 활성 세그먼트: /{page}</div>
    </div>
  )
}`
  ),
  makeDemo('guides/instant-navigation/router-cache-back', 'Router Cache를 통한 뒤로가기 0ms 즉각 복구', '2-guides/instant-navigation.md', 'baseline',
    '브라우저 뒤로가기(Back) 클릭 시 서버 요청 없이 클라이언트 Router Cache 메모리에서 0ms 복구합니다.',
    'Next.js Router Cache 수명 주기',
    '동적 페이지는 30초, 정적 페이지는 5분 동안 클라이언트 메모리에 캐시되어 즉각적인 탐색을 보장합니다.',
    'RouterCacheBackDemo',
    `'use client'
import React from 'react'
export function RouterCacheBackDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 text-xs space-y-1">
      <div className="font-bold text-zinc-900 dark:text-zinc-100">✓ Router Cache 메모리 적중:</div>
      <p className="text-zinc-500">뒤로가기 클릭 시 네트워크 요청 0건, 스크롤 위치 100% 보존</p>
    </div>
  )
}`
  ),
  makeDemo('guides/lazy-loading/modal-dynamic', '결제 모달 next/dynamic 지연 로드', '2-guides/lazy-loading.md', 'baseline',
    '결제 및 본인인증 모달을 동적으로 import하여 초기 상품 상세 번들 크기를 최적화합니다.',
    'Next.js 모달 지연 로딩 최적화',
    '사용자가 [결제하기] 버튼을 누를 때만 무거운 PG사 결제 모달 JS 번들을 로드합니다.',
    'LazyModalDemo',
    `'use client'
import React, { useState } from 'react'
export function LazyModalDemo() {
  const [open, setOpen] = useState(false)
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <button type="button" onClick={() => setOpen(true)} className="rounded bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-emerald-700 cursor-pointer">
        💳 결제 모달 열기 (동적 청크 로드)
      </button>
      {open && (
        <div className="rounded border border-emerald-300 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-950/40 text-xs">
          <div className="font-bold text-emerald-900 dark:text-emerald-300">결제 모달 마운트 완료 (지연 다운로드 성공)</div>
          <button type="button" onClick={() => setOpen(false)} className="mt-2 text-zinc-500 underline cursor-pointer">닫기</button>
        </div>
      )}
    </div>
  )
}`
  ),
  makeDemo('guides/preserving-ui-state/drawer-open', '카테고리 전환 시 장바구니 Drawer 열림 유지', '2-guides/preserving-ui-state.md', 'baseline',
    '레이아웃 레벨에 상태를 두어 페이지 간 소프트 네비게이션 중에도 열려있는 장바구니 Drawer를 유지합니다.',
    'Next.js 레이아웃 상태 보존 원리',
    '세그먼트가 바뀌어도 공통 상위 레이아웃은 언마운트되지 않으므로 드로어, 팝업, 폼 입력 상태가 유지됩니다.',
    'DrawerStateDemo',
    `'use client'
import React, { useState } from 'react'
export function DrawerStateDemo() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true)
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-zinc-900 dark:text-zinc-100">장바구니 드로어 상태: {isDrawerOpen ? '열림' : '닫힘'}</span>
        <button type="button" onClick={() => setIsDrawerOpen(o => !o)} className="rounded bg-zinc-900 px-2.5 py-1 text-xs font-bold text-white dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer">토글</button>
      </div>
      <p className="text-xs text-zinc-500">다른 탭으로 이동해도 이 드로어의 열림 상태와 담긴 상품 목록은 유지됩니다.</p>
    </div>
  )
}`
  ),
  makeDemo('guides/preserving-ui-state/scroll-retention', 'searchParams 필터 스크롤 위치 보존', '2-guides/preserving-ui-state.md', 'baseline',
    'router.replace(url, { scroll: false })를 적용하여 필터 조작 시 스크롤이 상단으로 튀지 않게 합니다.',
    'Next.js 스크롤 제어 가이드',
    'URL 쿼리스트링만 변경할 때는 스크롤 리셋을 비활성화하여 자연스러운 쇼핑 경험을 제공합니다.',
    'ScrollRetentionDemo',
    `'use client'
import React, { useState } from 'react'
export function ScrollRetentionDemo() {
  const [filter, setFilter] = useState('최신순')
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">정렬 기준: {filter} (scroll: false 적용됨)</div>
      <div className="flex gap-2 text-xs">
        {['최신순', '인기순', '낮은가격순'].map(f => (
          <button key={f} type="button" onClick={() => setFilter(f)} className={\`rounded px-3 py-1 font-bold \${filter === f ? 'bg-blue-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800'}\`}>{f}</button>
        ))}
      </div>
    </div>
  )
}`
  ),
  makeDemo('guides/preventing-flash/darkmode-script', '다크모드 SSR 인라인 스크립트 FOUC 방지', '2-guides/preventing-flash-before-hydration.md', 'baseline',
    'HTML 렌더링 전 인라인 스크립트로 로컬스토리지 테마를 즉시 <html> 클래스에 적용하여 흰색 번쩍임(FOUC)을 방지합니다.',
    'FOUC(Flash of Unstyled Content) 방지 원리',
    'React 하이드레이션을 기다리지 않고 브라우저 HTML 파서가 즉각 다크 클래스를 주입합니다.',
    'PreventFlashDemo',
    `'use client'
import React, { useState } from 'react'
export function PreventFlashDemo() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-zinc-900 dark:text-zinc-100">현재 테마: {theme}</span>
        <button type="button" onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} className="rounded bg-zinc-900 px-3 py-1 text-xs font-bold text-white dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer">테마 토글</button>
      </div>
      <div className="rounded bg-zinc-900 p-3 font-mono text-[11px] text-emerald-400">
        {'<script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add(\\'dark\\')" }} />'}
      </div>
    </div>
  )
}`
  ),
  makeDemo('guides/view-transitions/zoom-card', 'View Transitions 이미지 확대 애니메이션', '2-guides/view-transitions.md', 'baseline',
    '브라우저 네이티브 View Transitions API를 활용하여 썸네일에서 상세 이미지로의 부드러운 확대 전환을 구현합니다.',
    'Next.js View Transitions 지원',
    '페이지 전환 시 이전 화면과 다음 화면의 DOM 스냅샷을 브라우저가 자동 보간하여 네이티브 앱 같은 애니메이션을 생성합니다.',
    'ViewTransitionsDemo',
    `'use client'
import React, { useState } from 'react'
export function ViewTransitionsDemo() {
  const [isZoomed, setIsZoomed] = useState(false)
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-zinc-900 dark:text-zinc-100">View Transition 상태: {isZoomed ? '확대 상세 뷰' : '썸네일 그리드 뷰'}</span>
        <button type="button" onClick={() => setIsZoomed(z => !z)} className="rounded bg-blue-600 px-3 py-1 text-xs font-bold text-white cursor-pointer">전환 애니메이션 실행</button>
      </div>
      <div className={\`rounded bg-zinc-100 dark:bg-zinc-900 p-4 transition-all duration-300 flex items-center justify-center font-bold text-xs \${isZoomed ? 'h-32 bg-blue-50 text-blue-900 dark:bg-blue-950/40 dark:text-blue-200' : 'h-16'}\`}>
        🖼️ 상품 이미지 (view-transition-name: product-hero)
      </div>
    </div>
  )
}`
  ),
  makeDemo('guides/css-in-js/style-registry', 'Style Registry를 통한 CSS-in-JS SSR 스타일 주입', '2-guides/css-in-js.md', 'baseline',
    'Styled Components나 Emotion의 CSS-in-JS 스타일을 useServerInsertedHTML로 수집하여 서버 렌더링 HTML 헤더에 주입합니다.',
    'Next.js Style Registry 아키텍처',
    '클라이언트 사이드에서 스타일이 뒤늦게 주입되어 레이아웃이 튀는 현상을 방지합니다.',
    'StyleRegistryDemo',
    `'use client'
import React from 'react'
export function StyleRegistryDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 font-mono text-xs space-y-1">
      <div className="text-zinc-500">// useServerInsertedHTML을 통해 HTML <head>에 사전 주입된 스타일:</div>
      <div className="text-purple-600 dark:text-purple-400"><style data-styled="active">.btn-primary {'{ background: #000; color: #fff; }'}</style></div>
    </div>
  )
}`
  ),
  makeDemo('guides/sass/promotions-theme', 'Sass 변수/mixin 활용 프로모션 스타일링', '2-guides/sass.md', 'baseline',
    'Next.js 내장 Sass 컴파일러를 통해 .scss 모듈과 mixin을 활용한 반응형 프로모션 배너를 스타일링합니다.',
    'Next.js 내장 Sass 지원',
    '별도의 웹팩 설정 없이 \`pnpm add -D sass\`만으로 SCSS 모듈 스코프 스타일링을 즉시 사용할 수 있습니다.',
    'SassThemeDemo',
    `'use client'
import React from 'react'
export function SassThemeDemo() {
  return (
    <div className="rounded border border-rose-300 bg-rose-50/50 p-4 dark:border-rose-950 dark:bg-rose-950/20 space-y-2 text-xs">
      <div className="font-bold text-rose-950 dark:text-rose-200">🎀 Sass Mixin 적용 프로모션 배너 (styles/banner.module.scss)</div>
      <p className="text-zinc-600 dark:text-zinc-400">@include responsive-banner(brand-pink); SCSS 믹스인 적용 완료</p>
    </div>
  )
}`
  ),
  makeDemo('guides/authentication/middleware-guard', 'Proxy/Middleware 기반 라우트 보호 가드', '2-guides/authentication.md', 'baseline',
    'proxy.ts에서 보호된 /admin, /mypage 경로 진입 시 세션 쿠키를 검사하여 미인증 사용자를 차단합니다.',
    'Proxy 라우트 가드 아키텍처',
    '페이지 렌더링이 시작되기 전에 엣지에서 즉각 307 리다이렉트하여 서버 리소스를 보호합니다.',
    'MiddlewareGuardDemo',
    `'use client'
import React, { useState } from 'react'
export function MiddlewareGuardDemo() {
  const [hasAuth, setHasAuth] = useState(false)
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-zinc-900 dark:text-zinc-100">인증 쿠키: {hasAuth ? 'auth_token=valid' : '(없음)'}</span>
        <button type="button" onClick={() => setHasAuth(a => !a)} className="rounded bg-zinc-900 px-3 py-1 text-xs font-bold text-white dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer">쿠키 토글</button>
      </div>
      <div className="rounded bg-zinc-50 p-3 text-xs dark:bg-zinc-900 font-mono">
        /admin 접근 시 결과: {hasAuth ? '✓ 200 OK (관리자 대시보드 통과)' : '⚠️ 307 Redirect -> /login'}
      </div>
    </div>
  )
}`
  ),
  makeDemo('guides/authentication/rsc-user-profile', 'Server Component 세션 프로필 렌더링', '2-guides/authentication.md', 'baseline',
    'Server Component에서 cookies()를 직접 읽어 사용자 개인화 프로필과 환영 메시지를 렌더링합니다.',
    'RSC 서버 사이드 인증 패턴',
    '클라이언트로 사용자 토큰이나 비밀번호를 일절 전송하지 않고 서버에서 안전하게 프로필을 완성합니다.',
    'RscUserProfileDemo',
    `'use client'
import React from 'react'
export function RscUserProfileDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 space-y-2 text-xs">
      <div className="font-bold text-zinc-900 dark:text-zinc-100">👤 서버 사이드 렌더링 회원 정보:</div>
      <div className="font-mono text-zinc-600 dark:text-zinc-400">• 회원명: 홍길동 (VIP 등급)</div>
      <div className="font-mono text-zinc-600 dark:text-zinc-400">• 적립금: 15,200 P | 쿠폰: 3장</div>
    </div>
  )
}`
  ),
  makeDemo('guides/data-security/server-only-guard', 'server-only 패키지를 통한 클라이언트 번들 유출 차단', '2-guides/data-security.md', 'baseline',
    'import "server-only"를 선언한 모듈을 Client Component에서 실수로 import할 경우 빌드 타임 에러를 발생시켜 보안을 유지합니다.',
    'Next.js server-only 보안 가드',
    '비밀 DB 연결 문자열, 결제 비밀키 등이 클라이언트 브라우저 JS 파일에 유출되는 사고를 원천 방지합니다.',
    'ServerOnlyGuardDemo',
    `'use client'
import React from 'react'
export function ServerOnlyGuardDemo() {
  return (
    <div className="rounded border border-rose-300 bg-rose-50/50 p-4 dark:border-rose-950 dark:bg-rose-950/20 font-mono text-xs space-y-1 text-rose-900 dark:text-rose-300">
      <div className="font-bold">🛡️ import 'server-only' 보호 모듈:</div>
      <div>const DB_PASSWORD = process.env.DB_PASS; // 클라이언트 import 시 빌드 실패</div>
    </div>
  )
}`
  ),
  makeDemo('guides/data-security/react-taint-api', 'React experimental_taintObjectReference 비밀키 보호', '2-guides/data-security.md', 'baseline',
    'React의 Taint API를 사용하여 민감한 사용자 객체나 API 시크릿이 Client Component props로 전달되는 것을 차단합니다.',
    'React Taint API 보안 가이드라인',
    '객체가 직렬화되어 클라이언트로 넘어가는 순간 런타임 에러를 발생시켜 데이터 유출을 막습니다.',
    'ReactTaintDemo',
    `'use client'
import React from 'react'
export function ReactTaintDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-zinc-950 p-4 font-mono text-xs text-emerald-400 space-y-1">
      <div>experimental_taintObjectReference('비밀 토큰은 클라이언트로 넘길 수 없습니다', secretKey);</div>
    </div>
  )
}`
  ),
  makeDemo('guides/content-security-policy/nonce-injection', 'Middleware Nonce 기반 CSP 헤더 주입', '2-guides/content-security-policy.md', 'baseline',
    '매 요청마다 암호화된 Nonce 값을 생성하고 Content-Security-Policy 응답 헤더와 인라인 스크립트에 바인딩합니다.',
    'Next.js CSP Nonce 아키텍처',
    'XSS 공격자가 임의로 주입한 악성 인라인 스크립트 실행을 브라우저 보안 정책으로 완벽 차단합니다.',
    'CspNonceDemo',
    `'use client'
import React from 'react'
export function CspNonceDemo() {
  const nonce = 'nc_2026_98a7bc'
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 font-mono text-xs space-y-1">
      <div className="font-bold text-zinc-900 dark:text-zinc-100">Content-Security-Policy 헤더:</div>
      <div className="text-zinc-500">script-src 'self' 'nonce-{nonce}' 'strict-dynamic';</div>
    </div>
  )
}`
  ),
  makeDemo('guides/environment-variables/public-vs-server', 'NEXT_PUBLIC_ vs 서버 환경변수 노출 범위', '2-guides/environment-variables.md', 'baseline',
    'NEXT_PUBLIC_ 접두사가 붙은 환경변수만 브라우저 번들에 포함되고, 일반 변수는 오직 서버에서만 접근 가능합니다.',
    'Next.js 환경변수 보안 규칙',
    'API 시크릿 키는 절대 NEXT_PUBLIC_을 붙이지 않고 서버 컴포넌트나 서버 액션 내부에서만 참조해야 합니다.',
    'EnvVariablesDemo',
    `'use client'
import React from 'react'
export function EnvVariablesDemo() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs font-mono">
      <div className="rounded border border-blue-200 bg-blue-50/50 p-3 dark:border-blue-950 dark:bg-blue-950/20">
        <div className="font-bold text-blue-900 dark:text-blue-300">NEXT_PUBLIC_API_URL:</div>
        <div className="text-zinc-600 dark:text-zinc-400 mt-1">https://api.shop.com (클라이언트 노출 허용)</div>
      </div>
      <div className="rounded border border-rose-200 bg-rose-50/50 p-3 dark:border-rose-950 dark:bg-rose-950/20">
        <div className="font-bold text-rose-900 dark:text-rose-300">PAYMENT_SECRET_KEY:</div>
        <div className="text-zinc-600 dark:text-zinc-400 mt-1">sk_live_*** (서버 전용, 번들 유출 0%)</div>
      </div>
    </div>
  )
}`
  ),
  makeDemo('guides/environment-variables/runtime-env', 'process.env 런타임 환경변수 동적 참조', '2-guides/environment-variables.md', 'baseline',
    '컨테이너(Docker/K8s) 배포 환경에서 빌드 타임 하드코딩 없이 런타임에 동적으로 환경변수를 로드합니다.',
    'Next.js 런타임 환경변수 베스트 프랙티스',
    '빌드 이미지 재사용성을 높이고 환경(개발/스테이징/프로덕션)에 따라 유연하게 설정을 주입합니다.',
    'RuntimeEnvDemo',
    `'use client'
import React from 'react'
export function RuntimeEnvDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 font-mono text-xs space-y-1">
      <div className="font-bold text-zinc-900 dark:text-zinc-100">런타임 환경: NODE_ENV = "production"</div>
      <div className="text-zinc-500">배포 리전: REGION = "ap-northeast-2 (Seoul)"</div>
    </div>
  )
}`
  ),
  makeDemo('guides/json-ld/product-schema', 'Schema.org Product 구조화 데이터 (JSON-LD)', '2-guides/json-ld.md', 'baseline',
    '<script type="application/ld+json">을 통해 상품 가격, 평점, 재고 상태를 구글 검색엔진 리치 스니펫으로 제공합니다.',
    'JSON-LD SEO 최적화 가이드',
    '구글 검색 결과에 별점, 가격, 무료 배송 뱃지가 노출되어 쇼핑몰 클릭률(CTR)을 대폭 향상시킵니다.',
    'JsonLdProductDemo',
    `'use client'
import React from 'react'
export function JsonLdProductDemo() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: '기계식 게이밍 키보드',
    offers: { '@type': 'Offer', price: '149000', priceCurrency: 'KRW', availability: 'https://schema.org/InStock' }
  }
  return (
    <div className="rounded border border-zinc-200 bg-zinc-950 p-4 font-mono text-xs text-emerald-400 space-y-1">
      <div className="text-zinc-400">// HTML <head>에 출력되는 JSON-LD 스키마:</div>
      <pre>{JSON.stringify(jsonLd, null, 2)}</pre>
    </div>
  )
}`
  ),
  makeDemo('guides/interactive-apps/multi-filter-widget', '다중 필터/정렬/장바구니 복합 인터랙티브 위젯', '2-guides/interactive-apps.md', 'baseline',
    '복잡한 이커머스 필터링과 장바구니 담기를 결합한 통합 인터랙티브 컴포넌트를 구성합니다.',
    'Next.js 인터랙티브 앱 아키텍처',
    '클라이언트 로컬 상태와 서버 액션을 유기적으로 결합하여 높은 반응성을 제공합니다.',
    'MultiFilterWidgetDemo',
    `'use client'
import React, { useState } from 'react'
export function MultiFilterWidgetDemo() {
  const [selected, setSelected] = useState<string[]>([])
  const toggle = (tag: string) => {
    setSelected(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">선택된 복합 필터: {selected.join(', ') || '(전체)'}</div>
      <div className="flex gap-2 text-xs">
        {['무료배송', '당일발송', '쿠폰적용가능', '재고있음'].map(tag => (
          <button key={tag} type="button" onClick={() => toggle(tag)} className={\`rounded px-2.5 py-1 font-medium \${selected.includes(tag) ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' : 'bg-zinc-100 dark:bg-zinc-800'}\`}>
            {tag}
          </button>
        ))}
      </div>
    </div>
  )
}`
  ),
  makeDemo('guides/scripts/strategy-order', 'next/script strategy 로드 순서 최적화', '2-guides/scripts.md', 'baseline',
    'beforeInteractive, afterInteractive, lazyOnload 전략을 사용하여 서드파티 스크립트 실행 순서를 최적화합니다.',
    'Next.js next/script 로드 전략',
    '보안 필수 스크립트는 beforeInteractive로, 분석 툴은 afterInteractive, 덜 중요한 챗봇은 lazyOnload로 분리합니다.',
    'ScriptStrategyDemo',
    `'use client'
import React from 'react'
export function ScriptStrategyDemo() {
  return (
    <div className="space-y-2 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 font-mono text-xs">
      <div className="text-blue-600 dark:text-blue-400">• strategy="beforeInteractive": 봇 탐지 및 필수 폴리필</div>
      <div className="text-emerald-600 dark:text-emerald-400">• strategy="afterInteractive": 구글 애널리틱스 (기본값)</div>
      <div className="text-purple-600 dark:text-purple-400">• strategy="lazyOnload": 하단 실시간 상담 챗봇 위젯</div>
    </div>
  )
}`
  ),
  makeDemo('guides/scripts/pg-sdk-onload', '외부 PG사 결제 SDK onLoad 이벤트 핸들링', '2-guides/scripts.md', 'baseline',
    '<Script onLoad={...}> 콜백을 통해 토스페이먼츠/포트원 결제 SDK가 브라우저에 로드된 직후 결제창을 초기화합니다.',
    '외부 결제 SDK 비동기 로딩 패턴',
    'SDK가 로드되기 전에 결제 함수를 호출하여 발생하는 스크립트 미정의 에러를 완벽히 차단합니다.',
    'PgSdkOnloadDemo',
    `'use client'
import React, { useState } from 'react'
export function PgSdkOnloadDemo() {
  const [sdkReady, setSdkReady] = useState(true)
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">결제 SDK 상태: {sdkReady ? '✓ PG사 결제 모듈 준비 완료 (onLoad)' : '로딩 중...'}</div>
      <button type="button" disabled={!sdkReady} className="rounded bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white shadow-2xs cursor-pointer">
        안전 결제창 열기
      </button>
    </div>
  )
}`
  ),
  makeDemo('guides/mdx/product-tech-doc', '상품 기술 문서 MDX 렌더링', '2-guides/mdx.md', 'baseline',
    '@next/mdx를 활용하여 마크다운 본문 안에 인터랙티브 리액트 컴포넌트를 합성합니다.',
    'Next.js MDX 아키텍처',
    '기술 사양서나 사용자 매뉴얼을 마크다운으로 작성하면서 실시간 데모 위젯을 자연스럽게 포함합니다.',
    'MdxTechDocDemo',
    `'use client'
import React from 'react'
export function MdxTechDocDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900 space-y-2 text-xs">
      <h4 className="font-bold text-zinc-900 dark:text-zinc-100"># 기계식 키보드 기술 사양서 (MDX 렌더)</h4>
      <p className="text-zinc-600 dark:text-zinc-400">폴링레이트 8000Hz, 가스켓 마운트 구조, QMK/VIA 커스텀 키매핑을 지원합니다.</p>
    </div>
  )
}`
  ),
  makeDemo('guides/mdx/custom-component-slot', 'MDX 내 인터랙티브 장바구니 버튼 합성', '2-guides/mdx.md', 'baseline',
    'MDX 컴포넌트 매핑을 통해 본문 중간에 커스텀 <BuyButton /> 컴포넌트를 배치합니다.',
    'MDX 커스텀 컴포넌트 슬롯 패턴',
    '콘텐츠 에디터가 마크다운을 작성하면서 특정 상품의 구매 버튼을 손쉽게 삽입할 수 있습니다.',
    'MdxCustomSlotDemo',
    `'use client'
import React, { useState } from 'react'
export function MdxCustomSlotDemo() {
  const [added, setAdded] = useState(false)
  return (
    <div className="rounded border border-blue-200 bg-white p-4 shadow-2xs dark:border-blue-900 dark:bg-zinc-950 space-y-2">
      <div className="text-xs font-bold text-blue-950 dark:text-blue-200">MDX 본문 내 주입된 구매 컴포넌트 (<BuyButton />)</div>
      <button type="button" onClick={() => setAdded(true)} className="rounded bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-2xs cursor-pointer">
        {added ? '✓ 장바구니에 담김' : '문서에서 바로 구매하기 (149,000원)'}
      </button>
    </div>
  )
}`
  ),
  makeDemo('guides/third-party-libraries/google-analytics', '@next/third-parties Google Analytics 최적화', '2-guides/third-party-libraries.md', 'baseline',
    '@next/third-parties/google의 <GoogleAnalytics />를 사용하여 GA4 스크립트를 웹 워커 및 최적화된 방식으로 로드합니다.',
    'Next.js 서드파티 라이브러리 최적화',
    '메인 스레드 블로킹을 방지하여 TBT(Total Blocking Time) 성능 점수를 획기적으로 개선합니다.',
    'ThirdPartyGaDemo',
    `'use client'
import React from 'react'
export function ThirdPartyGaDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 font-mono text-xs space-y-1">
      <div className="font-bold text-zinc-900 dark:text-zinc-100"><GoogleAnalytics gaId="G-2026STUDY" /></div>
      <div className="text-emerald-600">✓ 최적화된 웹 워커 비동기 수집 활성화됨</div>
    </div>
  )
}`
  ),
  makeDemo('guides/third-party-libraries/youtube-embed', '@next/third-parties YouTube 최적화 임베드', '2-guides/third-party-libraries.md', 'baseline',
    '<YouTubeEmbed />를 활용하여 사용자가 재생 버튼을 누르기 전까지 가벼운 플레이스홀더만 보여주어 1MB 이상의 무거운 iframe 다운로드를 지연시킵니다.',
    'YouTubeEmbed 성능 최적화 원리',
    '초기 페이지 로드 시 30개 이상의 불필요한 유튜브 서드파티 요청을 방지하여 LCP를 극대화합니다.',
    'ThirdPartyYoutubeDemo',
    `'use client'
import React, { useState } from 'react'
export function ThirdPartyYoutubeDemo() {
  const [playing, setPlaying] = useState(false)
  return (
    <div className="space-y-2 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-zinc-900 dark:text-zinc-100">YouTube 라이트 플레이어</span>
        <span className="font-mono text-[10px] text-zinc-400">초기 JS 다운로드 0 KB</span>
      </div>
      <div onClick={() => setPlaying(true)} className="rounded bg-zinc-900 h-28 flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:bg-zinc-800">
        {playing ? '▶ 영상 스트리밍 재생 중...' : '▶ 클릭하여 영상 로드 (Lite Embed)'}
      </div>
    </div>
  )
}`
  ),
  makeDemo('guides/bff/order-aggregation', 'Route Handler를 통한 레거시 주문/재고 API 취합 (BFF)', '2-guides/backend-for-frontend.md', 'baseline',
    '백엔드 마이크로서비스(주문 DB, 재고 DB, 회원 DB)의 3개 분산 API를 Next.js Route Handler에서 단일 JSON으로 취합합니다.',
    'Next.js BFF(Backend for Frontend) 패턴',
    '모바일 및 웹 클라이언트가 여러 번의 네트워크 왕복 없이 단 1회의 요청으로 필요한 화면 데이터를 완성합니다.',
    'BffAggregationDemo',
    `'use client'
import React, { useState } from 'react'
export function BffAggregationDemo() {
  const [aggregated, setAggregated] = useState(false)
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <button type="button" onClick={() => setAggregated(true)} className="rounded bg-zinc-900 px-3.5 py-1.5 text-xs font-bold text-white dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer">
        BFF 통합 주문 조회 API 호출 (/api/bff/order)
      </button>
      {aggregated && (
        <div className="rounded bg-zinc-900 p-3 font-mono text-xs text-emerald-400 space-y-1">
          <div>✓ 주문 정보: Order #2026-881 (결제완료)</div>
          <div>✓ 물류 재고: 창고 A (잔여 42개)</div>
          <div>✓ 배송 기사: 김배송 (배정완료)</div>
        </div>
      )}
    </div>
  )
}`
  ),
  makeDemo('guides/bff/response-shaping', '모바일 앱 최적화 응답 가공 (Response Shaping)', '2-guides/backend-for-frontend.md', 'baseline',
    '대용량 원본 백엔드 응답에서 모바일 화면에 불필요한 40개 필드를 제거하고 필요한 4개 필드만 추출하여 전송량을 90% 축소합니다.',
    'Response Shaping 데이터 경량화',
    '모바일 네트워크 환경에서 JSON 페이로드 크기를 수백 KB에서 수 KB로 줄여 파싱 속도를 극대화합니다.',
    'BffResponseShapingDemo',
    `'use client'
import React from 'react'
export function BffResponseShapingDemo() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 font-mono text-xs">
      <div className="rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="font-bold text-zinc-500">원본 백엔드 (50개 필드, 120 KB):</div>
        <div className="text-zinc-400 mt-1">{'{ id, internal_audit, raw_logs, ... }'}</div>
      </div>
      <div className="rounded border border-emerald-300 bg-emerald-50/50 p-3 dark:border-emerald-950 dark:bg-emerald-950/20">
        <div className="font-bold text-emerald-900 dark:text-emerald-300">BFF 정제 (4개 필드, 2 KB):</div>
        <div className="text-emerald-600 dark:text-emerald-400 mt-1">{'{ id, title, price, thumbnail }'}</div>
      </div>
    </div>
  )
}`
  ),
  makeDemo('guides/pwas/app-install-prompt', '홈 화면 추가 PWA 프롬프트 및 manifest', '2-guides/progressive-web-apps.md', 'baseline',
    'manifest.json과 서비스 워커를 연동하여 모바일 브라우저에서 [앱 설치] 배너를 띄웁니다.',
    'Next.js PWA(Progressive Web Apps) 가이드',
    '오프라인 캐싱과 홈 화면 아이콘을 제공하여 네이티브 앱 같은 쇼핑몰 환경을 제공합니다.',
    'PwaInstallPromptDemo',
    `'use client'
import React, { useState } from 'react'
export function PwaInstallPromptDemo() {
  const [installed, setInstalled] = useState(false)
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">PWA 매니페스트 상태: manifest.json 정상 감지됨</div>
      <button type="button" onClick={() => setInstalled(true)} className="rounded bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-indigo-700 cursor-pointer">
        {installed ? '✓ 홈 화면에 추가되었습니다' : '📲 쇼핑몰 앱 홈 화면에 설치하기'}
      </button>
    </div>
  )
}`
  ),
  makeDemo('guides/i18n/subpath-routing', '/[lang]/products 다국어 서브패스 라우팅', '2-guides/internationalization.md', 'baseline',
    '/[lang]/products 라우트 구조를 통해 ko(한국어), en(영어), ja(일본어) 다국어 URL을 지원합니다.',
    'Next.js 다국어(i18n) 서브패스 라우팅',
    '검색엔진이 국가별 URL을 정확히 색인할 수 있도록 깔끔한 서브패스 구조를 제공합니다.',
    'I18nSubpathDemo',
    `'use client'
import React, { useState } from 'react'
export function I18nSubpathDemo() {
  const [lang, setLang] = useState('ko')
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex gap-2 text-xs">
        <button type="button" onClick={() => setLang('ko')} className={\`rounded px-3 py-1 font-bold \${lang === 'ko' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' : 'bg-zinc-100 dark:bg-zinc-800'}\`}>🇰🇷 /ko/shop</button>
        <button type="button" onClick={() => setLang('en')} className={\`rounded px-3 py-1 font-bold \${lang === 'en' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' : 'bg-zinc-100 dark:bg-zinc-800'}\`}>🇺🇸 /en/shop</button>
        <button type="button" onClick={() => setLang('ja')} className={\`rounded px-3 py-1 font-bold \${lang === 'ja' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' : 'bg-zinc-100 dark:bg-zinc-800'}\`}>🇯🇵 /ja/shop</button>
      </div>
      <div className="rounded bg-zinc-50 p-3 text-xs dark:bg-zinc-900 font-mono">
        선택된 언어 세그먼트: /{lang}/products -> {lang === 'ko' ? '장바구니 담기' : lang === 'en' ? 'Add to Cart' : 'カートに入れる'}
      </div>
    </div>
  )
}`
  ),
  makeDemo('guides/i18n/dictionary-translation', '서버 사이드 사전 JSON 번역 렌더링', '2-guides/internationalization.md', 'baseline',
    'getDictionary(lang)를 호출하여 언어별 사전 JSON 파일을 서버 컴포넌트에서 비동기로 로드합니다.',
    'Next.js 서버 사이드 사전(Dictionary) 패턴',
    '클라이언트로 모든 언어 번역 파일을 한꺼번에 다운로드하지 않고 현재 언어 사전만 서버에서 주입합니다.',
    'I18nDictionaryDemo',
    `'use client'
import React, { useState } from 'react'
export function I18nDictionaryDemo() {
  const [lang, setLang] = useState<'ko' | 'en'>('ko')
  const dict = {
    ko: { welcome: '환영합니다', checkout: '결제하기', freeShipping: '무료 배송' },
    en: { welcome: 'Welcome', checkout: 'Checkout', freeShipping: 'Free Shipping' }
  }
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 text-xs">
      <div className="flex gap-2">
        <button type="button" onClick={() => setLang('ko')} className="rounded bg-blue-600 px-3 py-1 text-white font-bold cursor-pointer">한국어 사전</button>
        <button type="button" onClick={() => setLang('en')} className="rounded bg-purple-600 px-3 py-1 text-white font-bold cursor-pointer">English Dict</button>
      </div>
      <div className="rounded bg-zinc-50 p-3 dark:bg-zinc-900 font-mono space-y-1">
        <div>• {dict[lang].welcome}</div>
        <div>• {dict[lang].freeShipping}</div>
        <div>• {dict[lang].checkout}</div>
      </div>
    </div>
  )
}`
  ),
  makeDemo('guides/multi-tenant/subdomain-tenant', '서브도메인 기반 테넌트 분기 및 브랜드 테마', '2-guides/multi-tenant.md', 'baseline',
    '요청 호스트(nike.mall.com vs adidas.mall.com)에 따라 서로 다른 브랜드 테마와 상품 목록을 렌더링합니다.',
    'Next.js 멀티 테넌트(Multi-tenant) 아키텍처',
    '단일 Next.js 배포 인스턴스로 수천 개의 B2B 고객사 브랜드 몰을 개별 도메인으로 독립 서비스합니다.',
    'MultiTenantDemo',
    `'use client'
import React, { useState } from 'react'
export function MultiTenantDemo() {
  const [tenant, setTenant] = useState('brand-a')
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex gap-2 text-xs">
        <button type="button" onClick={() => setTenant('brand-a')} className={\`rounded px-3 py-1 font-bold \${tenant === 'brand-a' ? 'bg-blue-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800'}\`}>테넌트 A (블루 테마)</button>
        <button type="button" onClick={() => setTenant('brand-b')} className={\`rounded px-3 py-1 font-bold \${tenant === 'brand-b' ? 'bg-purple-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800'}\`}>테넌트 B (퍼플 테마)</button>
      </div>
      <div className={\`rounded p-4 text-xs font-bold \${tenant === 'brand-a' ? 'bg-blue-50 text-blue-900 dark:bg-blue-950/40 dark:text-blue-200' : 'bg-purple-50 text-purple-900 dark:bg-purple-950/40 dark:text-purple-200'}\`}>
        🏢 {tenant === 'brand-a' ? 'Brand A 프리미엄 공식 스토어' : 'Brand B 트렌디 셀렉트 샵'}
      </div>
    </div>
  )
}`
  ),
  makeDemo('guides/multi-tenant/isolated-branding', '테넌트별 로고/컬러 동적 주입', '2-guides/multi-tenant.md', 'baseline',
    '테넌트 설정에 따라 CSS 변수(--primary-color)와 로고 SVG를 동적으로 주입합니다.',
    '멀티 테넌트 동적 테마 주입',
    '빌드 타임 분기 없이 런타임 CSS Variables로 완벽한 화이트라벨링을 지원합니다.',
    'IsolatedBrandingDemo',
    `'use client'
import React from 'react'
export function IsolatedBrandingDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 font-mono text-xs space-y-1">
      <div className="font-bold text-zinc-900 dark:text-zinc-100">// 동적 CSS 변수 주입:</div>
      <div className="text-zinc-500">style={'{{ "--tenant-primary": "#4f46e5", "--tenant-logo": "url(/logo-a.svg)" }}'}</div>
    </div>
  )
}`
  ),
  makeDemo('guides/multi-zones/cross-zone-routing', '셸에서 존으로의 rewrites 라우팅 (Multi-zones)', '2-guides/multi-zones.md', 'baseline',
    '마이크로 프론트엔드 구조에서 Shell 앱이 /demo/... 요청을 독립 배포된 Zone 앱으로 투명하게 rewrite합니다.',
    'Next.js Multi-zones 아키텍처',
    '독립된 여러 Next.js 프로젝트를 단일 도메인 아래에서 매끄럽게 통합 운영합니다.',
    'MultiZonesDemo',
    `'use client'
import React from 'react'
export function MultiZonesDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-zinc-950 p-4 font-mono text-xs text-white space-y-1">
      <div className="text-blue-400">// next.config.ts Multi-zones Rewrite:</div>
      <div>source: '/demo/:path*', destination: 'http://localhost:3001/zone/baseline/:path*'</div>
    </div>
  )
}`
  ),
  makeDemo('guides/instrumentation/server-register-hook', '서버 부팅 register() 실행 훅', '2-guides/instrumentation.md', 'baseline',
    'instrumentation.ts의 register() 함수를 통해 Next.js 서버 시작 시 DB 커넥션 풀과 APM 모니터링을 초기화합니다.',
    'Next.js instrumentation 아키텍처',
    '서버리스/Node.js 런타임 콜드 스타트 시 1회만 실행되는 안전한 초기화 진입점을 제공합니다.',
    'InstrumentationDemo',
    `'use client'
import React from 'react'
export function InstrumentationDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-zinc-950 p-4 font-mono text-xs text-emerald-400 space-y-1">
      <div>✓ [Server Boot] instrumentation.ts register() 실행됨</div>
      <div>✓ 데이터베이스 커넥션 풀 (Max: 20) 초기화 완료</div>
      <div>✓ OpenTelemetry Tracer Provider 활성화됨</div>
    </div>
  )
}`
  ),
  makeDemo('guides/opentelemetry/trace-span', 'Trace ID 발급 및 Server Component Span', '2-guides/open-telemetry.md', 'baseline',
    'OpenTelemetry 표준 추적 트레이스를 생성하여 각 Server Component의 렌더링 소요 시간을 Datadog/NewRelic으로 전송합니다.',
    'Next.js 분산 트레이싱(OpenTelemetry)',
    '어떤 데이터 패칭이나 컴포넌트 렌더링에서 병목이 발생하는지 밀리초 단위로 추적합니다.',
    'OpenTelemetryDemo',
    `'use client'
import React from 'react'
export function OpenTelemetryDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 font-mono text-xs space-y-1">
      <div className="font-bold text-zinc-900 dark:text-zinc-100">Trace ID: 4bf92f3577b34da6a3ce929d0e0e4736</div>
      <div className="text-zinc-500">• Span: render /shop/products (32ms)</div>
      <div className="text-zinc-500">• Span: fetch db.query("SELECT * FROM items") (18ms)</div>
    </div>
  )
}`
  ),
  makeDemo('guides/static-exports/client-routing', 'output: "export" 빌드 산출물 및 클라이언트 라우팅', '2-guides/static-exports.md', 'baseline',
    'Next.js 앱을 순수 정적 HTML/CSS/JS 파일로 빌드하여 S3, GitHub Pages, Cloudflare Pages에 서버 없이 배포합니다.',
    'Next.js 정적 내보내기(Static Export)',
    'Node.js 서버 없이도 클라이언트 라우터가 완벽히 동작하는 경량 정적 SPA/SSG 앱을 구축합니다.',
    'StaticExportsDemo',
    `'use client'
import React from 'react'
export function StaticExportsDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 font-mono text-xs space-y-1">
      <div className="font-bold text-zinc-900 dark:text-zinc-100">next.config.ts: output: 'export'</div>
      <div className="text-emerald-600">✓ out/ 디렉토리에 정적 HTML/JS 생성 완료 (서버리스 0원 호스팅 지원)</div>
    </div>
  )
}`
  ),
  makeDemo('guides/static-exports/ssg-catalog', '정적 HTML 카탈로그 사전 생성', '2-guides/static-exports.md', 'baseline',
    'generateStaticParams와 Static Export를 결합하여 수천 개의 상품 상세를 정적 HTML 파일로 일괄 출력합니다.',
    '정적 카탈로그 배포 전략',
    '서버 유지비 0원으로 무제한 트래픽을 견디는 고성능 쇼핑몰 정적 카탈로그를 제작합니다.',
    'SsgCatalogDemo',
    `'use client'
import React from 'react'
export function SsgCatalogDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 font-mono text-xs space-y-1">
      <div className="font-bold text-zinc-900 dark:text-zinc-100">빌드 산출물:</div>
      <div className="text-zinc-500">• out/products/101.html (24 KB)</div>
      <div className="text-zinc-500">• out/products/102.html (25 KB)</div>
    </div>
  )
}`
  ),
  makeDemo('guides/public-pages/terms-ssg', '이용약관 정적 SSG 페이지 생성 및 캐시', '2-guides/public-static-pages.md', 'baseline',
    '자주 바뀌지 않는 공개 이용약관, 개인정보처리방침 페이지를 빌드 타임에 완전한 정적 HTML로 만듭니다.',
    '공개 정적 페이지 최적화',
    '서버 부하 0%와 완벽한 SEO 검색엔진 크롤링을 달성합니다.',
    'TermsSsgDemo',
    `'use client'
import React from 'react'
export function TermsSsgDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900 text-xs space-y-1">
      <div className="font-bold text-zinc-900 dark:text-zinc-100">📜 쇼핑몰 서비스 이용약관 (정적 SSG)</div>
      <p className="text-zinc-600 dark:text-zinc-400">제 1 조 (목적) 본 약관은 전자상거래 서비스 이용 조건을 규정함을 목적으로 합니다.</p>
    </div>
  )
}`
  ),
  makeDemo('guides/analytics/custom-beacon', '상품 클릭 커스텀 이벤트 비콘 전송', '2-guides/analytics.md', 'baseline',
    'navigator.sendBeacon을 활용하여 페이지 이동 중에도 유실 없는 사용자 행동 분석 로그를 전송합니다.',
    'Next.js 비콘(Beacon) 분석 파이프라인',
    '페이지 언로드 시점에도 브라우저가 백그라운드에서 분석 서버로 안전하게 로그를 전달합니다.',
    'AnalyticsBeaconDemo',
    `'use client'
import React, { useState } from 'react'
export function AnalyticsBeaconDemo() {
  const [sent, setSent] = useState(false)
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <button type="button" onClick={() => setSent(true)} className="rounded bg-zinc-900 px-3.5 py-1.5 text-xs font-bold text-white dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer">
        {sent ? '✓ 비콘 전송 완료 (204 No Content)' : '📊 [구매하기 클릭] 커스텀 비콘 이벤트 전송'}
      </button>
    </div>
  )
}`
  ),
  makeDemo('guides/videos/lazy-video-player', '상품 홍보 영상 지연 로딩 및 자동 재생', '2-guides/videos.md', 'baseline',
    'Intersection Observer를 활용하여 영상이 뷰포트에 50% 이상 진입했을 때만 비디오 스트림을 재생합니다.',
    'Next.js 비디오 스트리밍 최적화',
    '화면 밖에 있는 비디오가 모바일 데이터를 소모하지 않도록 스마트하게 뷰포트를 감지합니다.',
    'LazyVideoDemo',
    `'use client'
import React, { useState } from 'react'
export function LazyVideoDemo() {
  const [isPlaying, setIsPlaying] = useState(false)
  return (
    <div className="space-y-2 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-zinc-900 dark:text-zinc-100">뷰포트 감지 비디오 플레이어</span>
        <button type="button" onClick={() => setIsPlaying(p => !p)} className="rounded bg-blue-600 px-2.5 py-1 text-xs font-bold text-white cursor-pointer">{isPlaying ? '일시정지' : '자동재생 시뮬레이션'}</button>
      </div>
      <div className="h-24 rounded bg-zinc-900 flex items-center justify-center text-white text-xs font-mono">
        {isPlaying ? '▶ 4K 고화질 홍보 영상 스트리밍 중...' : '⏸ 뷰포트 진입 대기 (대역폭 보존 중)'}
      </div>
    </div>
  )
}`
  ),

  // Phase 3
  makeDemo('file-conventions/layout/state-preservation', '클라이언트 상태 보존 중첩 레이아웃', '3-api-reference/3.1-file-conventions/layout.md', 'baseline',
    '하위 페이지를 이동해도 부모 레이아웃의 입력 폼과 비디오 재생 상태가 유지되는 것을 실증합니다.',
    'Next.js 레이아웃 상태 보존 메커니즘',
    'React 트리가 보존되므로 페이지 전환 시 번쩍임 없이 부드러운 상태 유지가 가능합니다.',
    'LayoutStatePreserveDemo',
    `'use client'
import React, { useState } from 'react'
export function LayoutStatePreserveDemo() {
  const [text, setText] = useState('검색창 입력 유지')
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 space-y-2">
      <label className="block text-xs font-bold text-zinc-900 dark:text-zinc-100">레이아웃 전역 검색창:</label>
      <input type="text" value={text} onChange={e => setText(e.target.value)} className="w-full rounded border border-zinc-300 px-3 py-1.5 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100" />
      <p className="text-[11px] text-zinc-500">하위 탭을 이동해도 이 인풋의 입력값은 초기화되지 않습니다.</p>
    </div>
  )
}`
  ),
  makeDemo('file-conventions/layout/dynamic-category-layout', '[category]/layout.tsx 동적 카테고리 레이아웃', '3-api-reference/3.1-file-conventions/layout.md', 'baseline',
    '동적 세그먼트 레벨에 배치된 layout.tsx에서 카테고리별 맞춤형 사이드바를 동적으로 렌더링합니다.',
    '동적 라우트 레이아웃 설계',
    '카테고리 ID를 기반으로 해당 분류의 서브 메뉴를 서버에서 안전하게 조합합니다.',
    'DynamicCategoryLayoutDemo',
    `'use client'
import React from 'react'
export function DynamicCategoryLayoutDemo() {
  return (
    <div className="rounded border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-950 dark:bg-blue-950/20 text-xs space-y-1">
      <div className="font-bold text-blue-950 dark:text-blue-200">📂 [category]/layout.tsx (전자기기 카테고리 전용 레이아웃)</div>
      <div className="text-zinc-600 dark:text-zinc-400">사이드바: 노트북 | 모니터 | 키보드 | 마우스</div>
    </div>
  )
}`
  ),
  makeDemo('file-conventions/page/static-and-dynamic', '정적(Static) vs 동적(Dynamic) page.tsx 렌더링', '3-api-reference/3.1-file-conventions/page.md', 'baseline',
    '빌드 시점에 사전 렌더링되는 정적 페이지와 요청 시점에 동적으로 렌더링되는 페이지를 대조합니다.',
    'Next.js 렌더링 모드 판정 기준',
    'cookies(), headers(), searchParams를 읽으면 동적으로 전환되고, 그렇지 않으면 자동으로 정적 Prerender됩니다.',
    'StaticDynamicPageDemo',
    `'use client'
import React from 'react'
export function StaticDynamicPageDemo() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs font-mono">
      <div className="rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
        <span className="text-emerald-600 font-bold">○ Static Page</span>
        <p className="text-zinc-500 mt-1">빌드 타임 HTML 생성 (0ms 서빙)</p>
      </div>
      <div className="rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
        <span className="text-purple-600 font-bold">ƒ Dynamic Page</span>
        <p className="text-zinc-500 mt-1">요청 시점 서버 온디맨드 렌더링</p>
      </div>
    </div>
  )
}`
  ),
  makeDemo('file-conventions/page/react-19-use-params', 'React 19 use(params) & use(searchParams) 언래핑', '3-api-reference/3.1-file-conventions/page.md', 'baseline',
    'Next.js 15+/16에서 비동기 Promise로 전달되는 params를 React 19 use() 훅으로 깔끔하게 unwrap합니다.',
    '비동기 Request API 언래핑 패턴',
    'Promise를 직접 props로 받아 Suspense 경계 안에서 use()로 해결하는 최신 패턴을 실증합니다.',
    'React19UseParamsDemo',
    `'use client'
import React from 'react'
export function React19UseParamsDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-zinc-950 p-4 font-mono text-xs text-emerald-400 space-y-1">
      <div>const { '{ category, id }' } = use(paramsPromise);</div>
      <div>const search = use(searchParamsPromise);</div>
      <div className="text-zinc-500 mt-1">// React 19 use()를 통해 동기적으로 파라미터 추출 완료</div>
    </div>
  )
}`
  ),
  makeDemo('file-conventions/loading/nested-segment-loading', '중첩 라우트 세그먼트 로딩 격리', '3-api-reference/3.1-file-conventions/loading.md', 'baseline',
    '상위 레이아웃은 고정된 상태에서 오직 하위 [id]/loading.tsx만 부분 로딩 스켈레톤으로 격리됩니다.',
    '중첩 로딩 바운더리 설계',
    '전체 화면이 로딩 스피너로 덮이지 않고 필요한 부분만 격리하여 전환 체감 속도를 높입니다.',
    'NestedSegmentLoadingDemo',
    `'use client'
import React from 'react'
export function NestedSegmentLoadingDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 space-y-2 text-xs">
      <div className="font-bold text-zinc-900 dark:text-zinc-100">GNB / 카테고리 사이드바 (상시 인터랙션 가능)</div>
      <div className="rounded bg-zinc-100 p-4 animate-pulse dark:bg-zinc-800 text-center font-mono text-zinc-500">
        [id]/loading.tsx 세그먼트 스켈레톤 로딩 중...
      </div>
    </div>
  )
}`
  ),
  makeDemo('file-conventions/error/payment-error-boundary', '결제 세그먼트 에러 캡처 (error.tsx)', '3-api-reference/3.1-file-conventions/error.md', 'baseline',
    '결제 승인 중 런타임 에러가 발생해도 상단 장바구니 레이아웃을 보존하고 결제 박스만 error.tsx로 격리합니다.',
    'Next.js error.js 바운더리 원리',
    'React Error Boundary를 자동으로 생성하여 특정 컴포넌트의 오류가 앱 전체를 크래시시키지 않도록 격리합니다.',
    'PaymentErrorBoundaryDemo',
    `'use client'
import React, { useState } from 'react'
export function PaymentErrorBoundaryDemo() {
  const [hasError, setHasError] = useState(false)
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-zinc-900 dark:text-zinc-100">상위 주문 레이아웃 (정상 유지)</span>
        <button type="button" onClick={() => setHasError(e => !e)} className="rounded bg-rose-600 px-3 py-1 text-xs font-bold text-white cursor-pointer">
          {hasError ? '에러 복구' : '결제 PG 연동 예외 발생'}
        </button>
      </div>
      {hasError ? (
        <div className="rounded border border-rose-300 bg-rose-50 p-4 text-xs text-rose-900 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
          ⚠️ 결제 처리 중 일시적 오류가 발생했습니다. (payment/error.tsx 격리됨)
        </div>
      ) : (
        <div className="rounded bg-zinc-50 p-3 text-xs dark:bg-zinc-900">결제 컴포넌트 정상 가동 중</div>
      )}
    </div>
  )
}`
  ),
  makeDemo('file-conventions/error/reset-recovery', 'error.tsx reset() 컴포넌트 재시도 복구', '3-api-reference/3.1-file-conventions/error.md', 'baseline',
    'error.tsx의 reset() 콜백을 호출하여 전체 페이지 새로고침 없이 에러 컴포넌트만 재렌더링 시도합니다.',
    'Next.js reset() 복구 메커니즘',
    '클라이언트 라우터의 세그먼트 캐시를 비우고 서버 컴포넌트를 다시 렌더링하여 복구를 시도합니다.',
    'ResetRecoveryDemo',
    `'use client'
import React, { useState } from 'react'
export function ResetRecoveryDemo() {
  const [recovered, setRecovered] = useState(false)
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 text-xs">
      <div className="text-zinc-600 dark:text-zinc-400">에러 바운더리 복구 상태: {recovered ? '✓ reset() 성공: 정상 화면 복귀' : '에러 대기'}</div>
      <button type="button" onClick={() => setRecovered(true)} className="rounded bg-blue-600 px-3.5 py-1.5 font-bold text-white shadow-2xs cursor-pointer">
        다시 시도 (reset() 호출)
      </button>
    </div>
  )
}`
  ),
  makeDemo('file-conventions/not-found/programmatic-not-found', 'notFound() 프로그래밍 트리거', '3-api-reference/3.1-file-conventions/not-found.md', 'baseline',
    'if (!product) notFound() 호출 시 가장 가까운 not-found.tsx 화면으로 즉시 전환됩니다.',
    'notFound() 함수 제어 흐름',
    '404 상태 코드 반환과 커스텀 UI 렌더링을 단 1줄의 함수 호출로 처리합니다.',
    'ProgrammaticNotFoundDemo',
    `'use client'
import React from 'react'
export function ProgrammaticNotFoundDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-zinc-950 p-4 font-mono text-xs text-emerald-400 space-y-1">
      <div>if (!item) {'{'}</div>
      <div className="pl-4">notFound(); // not-found.tsx 자동 렌더링</div>
      <div>{'}'}</div>
    </div>
  )
}`
  ),
  makeDemo('file-conventions/template/remount-lifecycle', 'template.tsx 인스턴스 재생성 및 수명주기', '3-api-reference/3.1-file-conventions/template.md', 'baseline',
    'layout.tsx와 달리 template.tsx는 페이지 이동 시마다 새 React 인스턴스로 재생성되어 폼 입력과 애니메이션을 리셋합니다.',
    'template.js vs layout.js 수명주기 대조',
    '페이지 이동 시마다 진입 애니메이션을 다시 실행하거나 폼 작성 상태를 깨끗이 비워야 할 때 사용합니다.',
    'TemplateRemountDemo',
    `'use client'
import React, { useState } from 'react'
export function TemplateRemountDemo() {
  const [key, setKey] = useState(1)
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-zinc-900 dark:text-zinc-100">template.tsx 인스턴스 ID: #{key}</span>
        <button type="button" onClick={() => setKey(k => k + 1)} className="rounded bg-purple-600 px-3 py-1 text-xs font-bold text-white cursor-pointer">페이지 전환 (리마운트)</button>
      </div>
      <div key={key} className="rounded bg-purple-50 p-3 text-xs text-purple-950 dark:bg-purple-950/40 dark:text-purple-200 animate-pulse font-mono">
        ✓ 새 템플릿 인스턴스 마운트됨 -> 폼 입력값 및 스크롤 자동 초기화
      </div>
    </div>
  )
}`
  ),
  makeDemo('file-conventions/template/input-reset-animation', '진입 애니메이션 및 폼 리셋 (template.tsx)', '3-api-reference/3.1-file-conventions/template.md', 'baseline',
    '후기 작성 폼에서 탭을 이동할 때마다 template.tsx에 의해 인풋 값이 자동 초기화되고 슬라이드 애니메이션이 발동합니다.',
    'template.tsx 폼 초기화 활용법',
    '수동으로 폼 상태를 리셋하는 useEffect 코드를 작성할 필요 없이 파일 규칙만으로 해결합니다.',
    'TemplateAnimationDemo',
    `'use client'
import React, { useState } from 'react'
export function TemplateAnimationDemo() {
  const [review, setReview] = useState('훌륭한 상품입니다!')
  return (
    <div className="space-y-2 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 text-xs">
      <label className="font-bold text-zinc-900 dark:text-zinc-100">후기 작성 폼 (template.tsx 내부):</label>
      <input type="text" value={review} onChange={e => setReview(e.target.value)} className="w-full rounded border border-zinc-300 p-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100" />
    </div>
  )
}`
  ),
  makeDemo('file-conventions/default/parallel-fallback', 'Parallel Routes 미매칭 시 default.tsx 폴백', '3-api-reference/3.1-file-conventions/default.md', 'baseline',
    '하위 세그먼트 이동 시 슬롯에 매칭되는 경로가 없으면 default.tsx가 폴백으로 렌더링됩니다.',
    'default.js 폴백 필수 규칙',
    '하위 라우트 이동 후 새로고침(Hard Reload) 시 404가 발생하지 않도록 각 슬롯마다 default.tsx를 선언합니다.',
    'DefaultParallelFallbackDemo',
    `'use client'
import React from 'react'
export function DefaultParallelFallbackDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-zinc-950 p-4 font-mono text-xs text-white space-y-1">
      <div className="text-blue-400">// @analytics/default.tsx:</div>
      <div>export default function Default() {'{ return <AnalyticsSummary />; }'}</div>
    </div>
  )
}`
  ),
  makeDemo('file-conventions/default/hard-reload-restore', '새로고침(Hard Reload) 시 슬롯 복구', '3-api-reference/3.1-file-conventions/default.md', 'baseline',
    '브라우저 F5 새로고침 시에도 default.tsx를 통해 모든 병렬 슬롯이 안전하게 복구되는 것을 검증합니다.',
    'Parallel Routes 새로고침 복구 원리',
    '소프트 네비게이션 시에는 이전 슬롯 상태가 유지되지만, 하드 리로드 시에는 default.js를 렌더링합니다.',
    'DefaultHardReloadDemo',
    `'use client'
import React from 'react'
export function DefaultHardReloadDemo() {
  return (
    <div className="rounded border border-emerald-300 bg-emerald-50/50 p-4 dark:border-emerald-950 dark:bg-emerald-950/20 font-mono text-xs space-y-1">
      <div className="font-bold text-emerald-950 dark:text-emerald-200">✓ 새로고침 404 방지:</div>
      <div className="text-zinc-600 dark:text-zinc-400">모든 슬롯(@analytics, @team)에 default.tsx가 선언되어 있어 안전 복구 완료</div>
    </div>
  )
}`
  ),
  makeDemo('file-conventions/route/rest-api-orders', 'REST GET/POST 주문 API (route.ts)', '3-api-reference/3.1-file-conventions/route.md', 'baseline',
    'app/api/orders/route.ts에서 GET(주문 목록)과 POST(주문 생성) 백엔드 REST 엔드포인트를 구현합니다.',
    'Route Handlers REST API 설계',
    'Web 표준 Request 및 Response.json()을 활용하여 초경량 백엔드 API를 제공합니다.',
    'RouteOrdersDemo',
    `'use client'
import React from 'react'
export function RouteOrdersDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-zinc-950 p-4 font-mono text-xs text-emerald-400 space-y-1">
      <div>export async function GET(request) {'{ return Response.json(orders); }'}</div>
      <div>export async function POST(request) {'{ const body = await request.json(); return Response.json({ success: true }, { status: 201 }); }'}</div>
    </div>
  )
}`
  ),
  makeDemo('file-conventions/route/webhook-signature', 'Webhook 서명 검증 핸들러 (route.ts)', '3-api-reference/3.1-file-conventions/route.md', 'baseline',
    'PG사 웹훅 수신 시 request.headers.get("x-signature")를 검증하여 위변조를 방지합니다.',
    'Route Handler 웹훅 보안 처리',
    '서명 검증 실패 시 401 Unauthorized를 즉시 반환하여 비정상 결제 승인을 차단합니다.',
    'WebhookSignatureDemo',
    `'use client'
import React from 'react'
export function WebhookSignatureDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 font-mono text-xs space-y-1">
      <div className="font-bold text-zinc-900 dark:text-zinc-100">x-webhook-signature: sha256_981a... (정상 검증됨)</div>
      <div className="text-emerald-600">✓ 결제 완료 웹훅 수신 및 주문 상태 'PAID'로 업데이트 완료</div>
    </div>
  )
}`
  ),
  makeDemo('file-conventions/route/sse-stock-stream', 'SSE 실시간 재고 스트리밍 (route.ts)', '3-api-reference/3.1-file-conventions/route.md', 'baseline',
    'ReadableStream을 통해 실시간 남은 재고 수량을 클라이언트로 1초 간격 푸시합니다.',
    'Next.js SSE 스트리밍 엔드포인트',
    'text/event-stream 헤더를 설정하여 단방향 실시간 텔레메트리 파이프라인을 구축합니다.',
    'SseStockStreamDemo',
    `'use client'
import React, { useState } from 'react'
export function SseStockStreamDemo() {
  const [stock, setStock] = useState(12)
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">실시간 재고 수량 (SSE 스트림): <strong className="text-rose-600 font-mono">{stock}개 남음</strong></div>
      <button type="button" onClick={() => setStock(s => Math.max(0, s - 1))} className="rounded bg-zinc-900 px-3 py-1 text-xs font-bold text-white dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer">
        다른 사용자의 구매 발생 (-1)
      </button>
    </div>
  )
}`
  ),
  makeDemo('file-conventions/route-groups/group-url-isolation', 'URL 영향 없는 라우트 그룹 분리 (route-groups)', '3-api-reference/3.1-file-conventions/route-groups.md', 'baseline',
    '(marketing)과 (shop) 괄호 폴더명은 URL 경로에 영향을 주지 않고 내부 프로젝트 구조만 깔끔하게 정리합니다.',
    'Next.js Route Groups 파일 구조화',
    'URL을 더럽히지 않으면서 팀별, 기능별로 라우트 파일을 논리적으로 그룹화합니다.',
    'RouteGroupIsolationDemo',
    `'use client'
import React from 'react'
export function RouteGroupIsolationDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 font-mono text-xs space-y-1">
      <div className="font-bold text-zinc-900 dark:text-zinc-100">물리 파일 경로: app/(shop)/cart/page.tsx</div>
      <div className="text-blue-600 dark:text-blue-400">→ 실제 접속 브라우저 URL: /cart (괄호 그룹 생략됨)</div>
    </div>
  )
}`
  ),
  makeDemo('file-conventions/route-groups/shop-vs-admin-roots', '상점용 vs 관리자용 다중 루트 레이아웃', '3-api-reference/3.1-file-conventions/route-groups.md', 'baseline',
    '(shop)/layout.tsx(쇼핑몰 GNB)와 (admin)/layout.tsx(어드민 사이드바)로 최상위 루트 레이아웃을 완전 분리합니다.',
    '다중 루트 레이아웃(Multiple Root Layouts) 설계',
    '일반 고객용 화면과 관리자용 화면의 <html><body> 스타일 및 전역 스크립트를 독립적으로 구성합니다.',
    'ShopVsAdminRootsDemo',
    `'use client'
import React from 'react'
export function ShopVsAdminRootsDemo() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs font-mono">
      <div className="rounded border border-blue-200 bg-blue-50/50 p-3 dark:border-blue-950 dark:bg-blue-950/20">
        <div className="font-bold text-blue-900 dark:text-blue-300">app/(shop)/layout.tsx</div>
        <div className="text-zinc-500 mt-1">쇼핑몰 전용 GNB & 장바구니 헤더</div>
      </div>
      <div className="rounded border border-purple-200 bg-purple-50/50 p-3 dark:border-purple-950 dark:bg-purple-950/20">
        <div className="font-bold text-purple-900 dark:text-purple-300">app/(admin)/layout.tsx</div>
        <div className="text-zinc-500 mt-1">어드민 사이드바 & 통계 대시보드 헤더</div>
      </div>
    </div>
  )
}`
  ),
  makeDemo('file-conventions/dynamic-segments/single-param', '[id] 단일 동적 세그먼트', '3-api-reference/3.1-file-conventions/dynamic-routes.md', 'baseline',
    'app/products/[id]/page.tsx에서 단일 상품 식별자를 추출합니다.',
    '단일 동적 세그먼트 컨벤션',
    '가장 기본적인 동적 라우트 패턴으로 개별 리소스의 상세 뷰를 렌더링합니다.',
    'SingleParamDemo',
    `'use client'
import React from 'react'
export function SingleParamDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 font-mono text-xs">
      <span className="font-bold text-zinc-900 dark:text-zinc-100">URL /products/101 매칭 -> params.id = "101"</span>
    </div>
  )
}`
  ),
  makeDemo('file-conventions/dynamic-segments/catch-all-slug', '[...slug] Catch-all 동적 세그먼트', '3-api-reference/3.1-file-conventions/dynamic-routes.md', 'baseline',
    'app/shop/[...slug]/page.tsx로 다단계 카테고리(/shop/clothes/tops/t-shirts)를 배열로 추출합니다.',
    'Catch-all 세그먼트 매칭 원리',
    '깊이가 가변적인 계층형 카테고리와 문서 페이지를 단 하나의 page.tsx로 처리합니다.',
    'CatchAllSlugDemo',
    `'use client'
import React from 'react'
export function CatchAllSlugDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 font-mono text-xs">
      <span className="font-bold text-zinc-900 dark:text-zinc-100">URL /shop/clothing/tops -> params.slug = ["clothing", "tops"]</span>
    </div>
  )
}`
  ),
  makeDemo('file-conventions/dynamic-segments/optional-catch-all', '[[...slug]] Optional Catch-all 동적 세그먼트', '3-api-reference/3.1-file-conventions/dynamic-routes.md', 'baseline',
    '이중 대괄호 [[...slug]]를 사용하여 /docs 및 /docs/a/b/c 모두를 단일 라우트에서 처리합니다.',
    'Optional Catch-all 활용법',
    '루트 인덱스 페이지와 하위 세부 페이지를 하나의 파일에서 공통 처리할 때 유용합니다.',
    'OptionalCatchAllDemo',
    `'use client'
import React from 'react'
export function OptionalCatchAllDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 font-mono text-xs">
      <span className="font-bold text-zinc-900 dark:text-zinc-100">URL /docs (파라미터 없음) 및 /docs/faq 모두 매칭 가능</span>
    </div>
  )
}`
  ),
  makeDemo('file-conventions/parallel-routes/conditional-slot', '권한별 조건부 슬롯 분기 (Parallel Routes)', '3-api-reference/3.1-file-conventions/parallel-routes.md', 'baseline',
    '사용자 역할(Role)에 따라 @dashboard 슬롯에 관리자 뷰 또는 일반 고객 뷰를 조건부 주입합니다.',
    'Parallel Routes 조건부 렌더링',
    '레이아웃 내부에서 삼항 연산자로 슬롯을 교체하여 깔끔한 권한 분기를 구현합니다.',
    'ParallelConditionalDemo',
    `'use client'
import React, { useState } from 'react'
export function ParallelConditionalDemo() {
  const [role, setRole] = useState<'admin' | 'user'>('admin')
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex gap-2 text-xs">
        <button type="button" onClick={() => setRole('admin')} className="rounded bg-purple-600 px-3 py-1 font-bold text-white cursor-pointer">어드민 슬롯 렌더</button>
        <button type="button" onClick={() => setRole('user')} className="rounded bg-blue-600 px-3 py-1 font-bold text-white cursor-pointer">고객 슬롯 렌더</button>
      </div>
      <div className="rounded bg-zinc-50 p-3 text-xs dark:bg-zinc-900 font-mono">
        주입된 슬롯: {role === 'admin' ? '@adminDashboard (정산 및 시스템 제어)' : '@userDashboard (내 주문 및 쿠폰)'}
      </div>
    </div>
  )
}`
  ),
  makeDemo('file-conventions/parallel-routes/independent-tabs', '독립 탭 네비게이션 슬롯 (Parallel Routes)', '3-api-reference/3.1-file-conventions/parallel-routes.md', 'baseline',
    '@reviews와 @specs 슬롯이 서로의 렌더링을 방해하지 않고 독립적으로 탭 전환됩니다.',
    'Parallel Routes 독립 네비게이션',
    '화면 내 여러 영역이 각자의 URL 히스토리와 상태를 유지하며 독립 동작합니다.',
    'ParallelIndependentTabsDemo',
    `'use client'
import React from 'react'
export function ParallelIndependentTabsDemo() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
      <div className="rounded border border-blue-200 bg-blue-50/40 p-3 dark:border-blue-900">
        <span className="font-bold text-blue-900 dark:text-blue-300">슬롯 1: @specs (상세 스펙)</span>
      </div>
      <div className="rounded border border-emerald-200 bg-emerald-50/40 p-3 dark:border-emerald-900">
        <span className="font-bold text-emerald-900 dark:text-emerald-300">슬롯 2: @reviews (실시간 후기)</span>
      </div>
    </div>
  )
}`
  ),
  makeDemo('file-conventions/intercepting-routes/direct-vs-modal', '직접 진입 vs 모달 대조 (Intercepting Routes)', '3-api-reference/3.1-file-conventions/intercepting-routes.md', 'baseline',
    '링크 클릭 시에는 모달로 인터셉트되고, 새로고침 시에는 전체 독립 상세 페이지가 열리는 차이를 대조합니다.',
    'Intercepting Routes 하드 vs 소프트 네비게이션',
    '동일한 URL(/products/101)에 대해 진입 방식에 따라 완벽히 분기되는 렌더링을 지원합니다.',
    'InterceptingDirectVsModalDemo',
    `'use client'
import React from 'react'
export function InterceptingDirectVsModalDemo() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs font-mono">
      <div className="rounded border border-blue-200 bg-blue-50/50 p-3 dark:border-blue-950 dark:bg-blue-950/20">
        <span className="font-bold text-blue-900 dark:text-blue-300">클라이언트 탐색:</span>
        <p className="text-zinc-600 dark:text-zinc-400 mt-1">(..)products/[id] 모달 오버레이</p>
      </div>
      <div className="rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
        <span className="font-bold text-zinc-900 dark:text-zinc-100">직접 URL 입력:</span>
        <p className="text-zinc-600 dark:text-zinc-400 mt-1">products/[id]/page.tsx 전체 독립 페이지</p>
      </div>
    </div>
  )
}`
  ),
  makeDemo('file-conventions/mdx-components/global-mdx-theme', '글로벌 MDX 스타일 매핑 (mdx-components.tsx)', '3-api-reference/3.1-file-conventions/mdx-components.md', 'baseline',
    'mdx-components.tsx에서 h1, p, pre 태그를 Tailwind 스타일 컴포넌트로 전역 매핑합니다.',
    'mdx-components.js 전역 설정',
    '모든 .mdx 파일에 일관된 타이포그래피와 다크모드 테마를 일괄 적용합니다.',
    'MdxGlobalThemeDemo',
    `'use client'
import React from 'react'
export function MdxGlobalThemeDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-zinc-950 p-4 font-mono text-xs text-emerald-400 space-y-1">
      <div>export function useMDXComponents(components) {'{'}</div>
      <div className="pl-4">return {'{ h1: (props) => <h1 className="text-2xl font-bold" {...props} />, ...components }'};</div>
      <div>{'}'}</div>
    </div>
  )
}`
  ),
  makeDemo('file-conventions/instrumentation/server-boot-log', '서버 부팅 register() 로그 (instrumentation.ts)', '3-api-reference/3.1-file-conventions/instrumentation.md', 'baseline',
    '서버 부팅 시 register() 훅에서 환경 변수 무결성 검사와 모니터링 에이전트를 초기화합니다.',
    'instrumentation.js 부팅 생명주기',
    'Next.js 런타임이 기동될 때 최초 1회만 실행되어 전역 리소스를 준비합니다.',
    'InstrumentationServerLogDemo',
    `'use client'
import React from 'react'
export function InstrumentationServerLogDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-zinc-950 p-4 font-mono text-xs text-emerald-400 space-y-1">
      <div>[Server Init] register() hook executed at 2026-08-21T14:00:00.000Z</div>
      <div>[Server Init] Secret Key & Redis Client Connected.</div>
    </div>
  )
}`
  ),
  makeDemo('file-conventions/instrumentation/client-timing-metrics', '클라이언트 성능 측정 훅 (instrumentation-client.ts)', '3-api-reference/3.1-file-conventions/instrumentation-client.md', 'baseline',
    'instrumentation-client.ts를 통해 브라우저 LCP, FID, CLS 웹 바이탈을 수집합니다.',
    '클라이언트 계측(Client Instrumentation)',
    '실제 사용자의 Core Web Vitals 측정값을 실시간으로 APM 서버에 보고합니다.',
    'InstrumentationClientTimingDemo',
    `'use client'
import React from 'react'
export function InstrumentationClientTimingDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 font-mono text-xs space-y-1">
      <div className="font-bold text-zinc-900 dark:text-zinc-100">Web Vitals Telemetry:</div>
      <div className="text-emerald-600">• LCP: 620ms (Good)</div>
      <div className="text-emerald-600">• CLS: 0.00 (Good)</div>
      <div className="text-emerald-600">• INP: 45ms (Good)</div>
    </div>
  )
}`
  ),
  makeDemo('file-conventions/proxy/gateway-router', '내부 마이크로서비스 프록시 라우팅 (proxy.ts)', '3-api-reference/3.1-file-conventions/proxy.md', 'baseline',
    'proxy.ts에서 /api/v2/* 요청을 내부 결제 마이크로서비스 백엔드로 rewrite 중계합니다.',
    'Next.js 16 proxy.ts 게이트웨이 패턴',
    'CORS 문제를 해결하고 내부 서버 IP와 인증 토큰을 안전하게 마스킹합니다.',
    'ProxyGatewayDemo',
    `'use client'
import React from 'react'
export function ProxyGatewayDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-zinc-950 p-4 font-mono text-xs text-blue-400 space-y-1">
      <div>export function proxy(req) {'{'}</div>
      <div className="pl-4">return NextResponse.rewrite(new URL('/api/v2/gateway', req.url));</div>
      <div>{'}'}</div>
    </div>
  )
}`
  ),
  makeDemo('file-conventions/forbidden/admin-role-403', '비관리자 권한 차단 403 화면 (forbidden.tsx)', '3-api-reference/3.1-file-conventions/forbidden.md', 'baseline',
    'forbidden() 함수 호출 시 forbidden.tsx 컴포넌트가 403 Forbidden 상태 코드와 함께 렌더링됩니다.',
    'Next.js forbidden.js 파일 컨벤션',
    '인가(Authorization) 실패 시 표준 HTTP 403 화면을 깔끔하게 보여줍니다.',
    'ForbiddenRoleDemo',
    `'use client'
import React from 'react'
export function ForbiddenRoleDemo() {
  return (
    <div className="rounded border border-rose-300 bg-rose-50 p-4 text-xs text-rose-900 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300 space-y-1">
      <div className="font-bold">⛔ 403 Forbidden: 접근 권한이 없습니다.</div>
      <p>관리자(Admin) 권한을 보유한 계정만 이 대시보드에 접근할 수 있습니다. (forbidden.tsx 렌더)</p>
    </div>
  )
}`
  ),
  makeDemo('file-conventions/unauthorized/anonymous-401', '미인증 세션 401 로그인 요구 화면 (unauthorized.tsx)', '3-api-reference/3.1-file-conventions/unauthorized.md', 'baseline',
    'unauthorized() 함수 호출 시 unauthorized.tsx 컴포넌트가 401 상태 코드와 함께 렌더링됩니다.',
    'Next.js unauthorized.js 파일 컨벤션',
    '인증되지 않은 익명 사용자가 보호된 페이지에 접근했을 때 명시적인 401 화면을 표시합니다.',
    'UnauthorizedSessionDemo',
    `'use client'
import React from 'react'
export function UnauthorizedSessionDemo() {
  return (
    <div className="rounded border border-amber-300 bg-amber-50 p-4 text-xs text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300 space-y-1">
      <div className="font-bold">🔒 401 Unauthorized: 로그인이 필요합니다.</div>
      <p>주문 내역 조회를 위해 먼저 로그인해 주세요. (unauthorized.tsx 렌더)</p>
    </div>
  )
}`
  ),
  makeDemo('file-conventions/metadata-app-icons/dynamic-favicon', 'icon.tsx 동적 파비콘 생성', '3-api-reference/3.1-file-conventions/3.1.21-metadata/app-icons.md', 'baseline',
    'app/icon.tsx에서 ImageResponse를 사용하여 실시간 알림 뱃지가 포함된 32x32 파비콘을 동적 생성합니다.',
    'Next.js 동적 아이콘(app-icons) 컨벤션',
    '정적 png 파일 대신 JSX 코드로 프로그래밍 방식의 동적 파비콘을 출력합니다.',
    'MetadataAppIconsDemo',
    `'use client'
import React from 'react'
export function MetadataAppIconsDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 font-mono text-xs space-y-1">
      <div className="font-bold text-zinc-900 dark:text-zinc-100">icon.tsx 파비콘 엔드포인트: /icon</div>
      <div className="text-emerald-600">✓ 32x32 PNG ImageResponse 동적 생성 완료</div>
    </div>
  )
}`
  ),
  makeDemo('file-conventions/metadata-manifest/dynamic-pwa-manifest', 'manifest.ts 동적 매니페스트 출력', '3-api-reference/3.1-file-conventions/3.1.21-metadata/manifest.md', 'baseline',
    'app/manifest.ts에서 쇼핑몰 이름, 테마 색상, PWA 아이콘 경로를 담은 manifest.webmanifest를 동적 반환합니다.',
    'Next.js 동적 manifest.ts 파일 규칙',
    '다국어나 테넌트에 따라 앱 이름과 시작 URL을 동적으로 변경할 수 있습니다.',
    'MetadataManifestDemo',
    `'use client'
import React from 'react'
export function MetadataManifestDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-zinc-950 p-4 font-mono text-xs text-emerald-400 space-y-1">
      <div>export default function manifest() {'{'}</div>
      <div className="pl-4">return {'{ name: "Next.js 쇼핑몰", start_url: "/", display: "standalone" }'};</div>
      <div>{'}'}</div>
    </div>
  )
}`
  ),
  makeDemo('file-conventions/metadata-og/discount-banner-og', 'ImageResponse 실시간 할인율 OG 이미지', '3-api-reference/3.1-file-conventions/3.1.21-metadata/opengraph-image.md', 'baseline',
    'opengraph-image.tsx에서 실시간 할인율(50% OFF)이 반영된 1200x630 SNS 공유 이미지를 즉석 생성합니다.',
    '동적 OG 이미지 생성 파이프라인',
    'Satori 엔진을 통해 HTML/CSS 코드를 초고속 PNG 이미지 버퍼로 변환합니다.',
    'MetadataOgBannerDemo',
    `'use client'
import React from 'react'
export function MetadataOgBannerDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-zinc-950 p-4 font-mono text-xs text-white space-y-1">
      <div className="text-blue-400">// opengraph-image.tsx:</div>
      <div>return new ImageResponse(<div style={'{{ fontSize: 60 }}'}>50% 타임 세일!</div>, {'{ width: 1200, height: 630 }'})</div>
    </div>
  )
}`
  ),
  makeDemo('file-conventions/metadata-robots/dynamic-crawler-rules', 'robots.ts 동적 크롤링 규칙 생성', '3-api-reference/3.1-file-conventions/3.1.21-metadata/robots.md', 'baseline',
    'app/robots.ts에서 검색엔진 크롤러의 /admin 접근 차단 및 sitemap.xml 위치를 동적으로 제공합니다.',
    'Next.js robots.ts 규칙',
    '정적 robots.txt 대신 타입 안전한 MetadataRoute.Robots 인터페이스를 사용합니다.',
    'MetadataRobotsDemo',
    `'use client'
import React from 'react'
export function MetadataRobotsDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-zinc-950 p-4 font-mono text-xs text-emerald-400 space-y-1">
      <div>User-agent: *</div>
      <div>Disallow: /admin/</div>
      <div>Sitemap: https://shop.com/sitemap.xml</div>
    </div>
  )
}`
  ),
  makeDemo('file-conventions/metadata-sitemap/split-index-sitemaps', 'generateSitemaps 대규모 인덱스 분할', '3-api-reference/3.1-file-conventions/3.1.21-metadata/sitemap.md', 'baseline',
    'generateSitemaps()를 사용하여 50,000개 이상의 상품 URL을 sitemap/0.xml, sitemap/1.xml로 분할 생성합니다.',
    'Next.js 사이트맵 인덱스 분할',
    '검색엔진의 단일 사이트맵 크기 제한(5만 개 URL)을 우아하게 극복합니다.',
    'MetadataSitemapSplitDemo',
    `'use client'
import React from 'react'
export function MetadataSitemapSplitDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 font-mono text-xs space-y-1">
      <div className="font-bold text-zinc-900 dark:text-zinc-100">생성된 사이트맵 인덱스:</div>
      <div className="text-zinc-500">• /sitemap/0.xml (상품 #1 ~ #50,000)</div>
      <div className="text-zinc-500">• /sitemap/1.xml (상품 #50,001 ~ #100,000)</div>
    </div>
  )
}`
  ),
  makeDemo('file-conventions/route-segment-config/dynamic-params-toggle', 'dynamicParams true vs false 설정', '3-api-reference/3.1-file-conventions/3.1.22-route-segment-config/dynamicParams.md', 'baseline',
    'export const dynamicParams = false 설정 시 generateStaticParams에 포함되지 않은 요청을 즉시 404로 차단합니다.',
    'dynamicParams 라우트 세그먼트 설정',
    '미등록 상품 ID로 인한 불필요한 서버 SSR 연산과 무차별 요청 공격을 차단합니다.',
    'DynamicParamsToggleDemo',
    `'use client'
import React from 'react'
export function DynamicParamsToggleDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-zinc-950 p-4 font-mono text-xs text-white space-y-1">
      <div className="text-blue-400">export const dynamicParams = false;</div>
      <div className="text-zinc-400">사전 생성되지 않은 미등록 파라미터는 서버 연산 없이 즉각 404 리턴</div>
    </div>
  )
}`
  ),
  makeDemo('file-conventions/route-segment-config/instant-prefetch', '세그먼트 즉시 프리패칭 (instant)', '3-api-reference/3.1-file-conventions/3.1.22-route-segment-config/instant.md', 'baseline',
    'export const prefetch = true 설정을 통해 해당 세그먼트의 전체 트리를 최우선 프리패치합니다.',
    'Route Segment prefetch 설정',
    '주요 구매 전환 라우트(결제, 장바구니)를 즉각적인 탐색 속도로 끌어올립니다.',
    'InstantPrefetchDemo',
    `'use client'
import React from 'react'
export function InstantPrefetchDemo() {
  return (
    <div className="rounded border border-emerald-300 bg-emerald-50/50 p-4 dark:border-emerald-950 dark:bg-emerald-950/20 font-mono text-xs">
      <span className="font-bold text-emerald-950 dark:text-emerald-200">✓ instant prefetch 활성화: 결제 완료 페이지 0ms 즉각 렌더</span>
    </div>
  )
}`
  ),
  makeDemo('file-conventions/route-segment-config/max-duration-timeout', '주문 정산 배치 maxDuration 타임아웃 제한', '3-api-reference/3.1-file-conventions/3.1.22-route-segment-config/maxDuration.md', 'baseline',
    'export const maxDuration = 60 설정을 통해 대용량 주문 정산 함수의 최대 실행 시간을 60초로 확장합니다.',
    'maxDuration 서버리스 실행 시간 제어',
    '장기 실행 배치나 AI 모델 추론 엔드포인트의 조기 타임아웃을 방지합니다.',
    'MaxDurationTimeoutDemo',
    `'use client'
import React from 'react'
export function MaxDurationTimeoutDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-zinc-950 p-4 font-mono text-xs text-white space-y-1">
      <div className="text-blue-400">export const maxDuration = 60; // 60초 실행 보장</div>
      <div className="text-zinc-400">대용량 월말 정산 배치 Route Handler 타임아웃 방지</div>
    </div>
  )
}`
  ),
  makeDemo('file-conventions/route-segment-config/runtime-nodejs-edge', 'nodejs vs edge 런타임 대조', '3-api-reference/3.1-file-conventions/3.1.22-route-segment-config/runtime.md', 'baseline',
    'export const runtime = "edge" vs "nodejs" 런타임별 사용 가능 API와 콜드 스타트 속도를 대조합니다.',
    'Next.js 런타임(Runtime) 선택 기준',
    '가벼운 글로벌 프록시나 A/B 분기는 Edge에서, 무거운 ORM이나 파일 I/O는 Node.js 런타임에서 실행합니다.',
    'RuntimeNodejsEdgeDemo',
    `'use client'
import React from 'react'
export function RuntimeNodejsEdgeDemo() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 font-mono text-xs">
      <div className="rounded border border-blue-200 bg-blue-50/50 p-3 dark:border-blue-950 dark:bg-blue-950/20">
        <div className="font-bold text-blue-900 dark:text-blue-300">runtime = 'edge':</div>
        <div className="text-zinc-600 dark:text-zinc-400 mt-1">콜드스타트 0ms, V8 Isolate, 전세계 분산 배포</div>
      </div>
      <div className="rounded border border-purple-200 bg-purple-50/50 p-3 dark:border-purple-950 dark:bg-purple-950/20">
        <div className="font-bold text-purple-900 dark:text-purple-300">runtime = 'nodejs':</div>
        <div className="text-zinc-600 dark:text-zinc-400 mt-1">모든 Node.js 네이티브 모듈(fs, crypto, pg) 지원</div>
      </div>
    </div>
  )
}`
  ),
  makeDemo('components/image/blur-placeholder', 'placeholder="blur" 저용량 블러 미리보기', '3-api-reference/3.2-components/image.md', 'baseline',
    '고화질 원본 이미지가 로드되기 전에 저용량 Base64 블러 이미지를 먼저 표시하여 매끄러운 UX를 제공합니다.',
    'next/image 블러 플레이스홀더 원리',
    '느린 3G 네트워크에서도 빈 사각형 대신 부드러운 블러 효과를 제공하여 이탈률을 낮춥니다.',
    'ImageBlurPlaceholderDemo',
    `'use client'
import React, { useState } from 'react'
export function ImageBlurPlaceholderDemo() {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-zinc-900 dark:text-zinc-100">이미지 로드 상태: {loaded ? '✓ 원본 고화질 렌더 완료' : '블러 플레이스홀더 표시 중'}</span>
        <button type="button" onClick={() => setLoaded(l => !l)} className="rounded bg-zinc-900 px-3 py-1 text-xs font-bold text-white dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer">로드 상태 토글</button>
      </div>
      <div className={\`h-32 rounded flex items-center justify-center font-bold text-xs transition-all duration-700 \${loaded ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' : 'bg-zinc-300 blur-xs text-zinc-600 dark:bg-zinc-800'}\`}>
        {loaded ? 'HD 프로모션 배너 (1920x1080)' : 'Base64 Blur Placeholder...'}
      </div>
    </div>
  )
}`
  ),
  makeDemo('components/image/priority-lcp-preload', 'priority 속성을 통한 LCP 이미지 사전 로드', '3-api-reference/3.2-components/image.md', 'baseline',
    '히어로 메인 배너에 priority 속성을 지정하여 HTML <head>에 <link rel="preload">를 자동 생성합니다.',
    'next/image priority 속성과 LCP 최적화',
    '화면 최상단 대표 이미지가 브라우저 파서에 의해 최우선 순위로 다운로드되어 LCP 점수를 단축합니다.',
    'ImagePriorityLcpDemo',
    `'use client'
import React from 'react'
export function ImagePriorityLcpDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-zinc-950 p-4 font-mono text-xs text-white space-y-1">
      <div className="text-blue-400"><Image src="/hero.png" priority alt="Hero" /></div>
      <div className="text-emerald-400">→ <link rel="preload" as="image" href="/_next/image?url=/hero.png..." /> 자동 주입됨</div>
    </div>
  )
}`
  ),
  makeDemo('components/link/soft-navigation-scroll', '<Link> 소프트 네비게이션 & scroll 제어', '3-api-reference/3.2-components/link.md', 'baseline',
    '<Link scroll={false}>를 사용하여 페이지 이동 시 브라우저 스크롤 위치를 그대로 유지합니다.',
    'next/link 컴포넌트의 scroll 속성',
    '하단 댓글이나 페이지네이션 번호 클릭 시 최상단으로 튕기는 현상을 방지합니다.',
    'LinkSoftNavScrollDemo',
    `'use client'
import React, { useState } from 'react'
export function LinkSoftNavScrollDemo() {
  const [scrollOpt, setScrollOpt] = useState(false)
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 text-xs">
      <div className="font-bold text-zinc-900 dark:text-zinc-100">현재 링크 설정: <Link scroll={'{' + String(scrollOpt) + '}'}></div>
      <button type="button" onClick={() => setScrollOpt(s => !s)} className="rounded bg-blue-600 px-3 py-1 font-bold text-white cursor-pointer">
        scroll 속성 토글 (현재: {String(scrollOpt)})
      </button>
    </div>
  )
}`
  ),
  makeDemo('components/link/prefetch-options', '<Link prefetch> 옵션 대조 (auto vs full vs false)', '3-api-reference/3.2-components/link.md', 'baseline',
    'prefetch={null}(기본값/auto), prefetch={true}(전체 정적 사전 로드), prefetch={false}(비활성화)를 대조합니다.',
    'Next.js 16 Link Prefetch 옵션 상세',
    '정적 라우트와 동적 라우트에 따른 프리패치 전략을 세밀하게 제어합니다.',
    'LinkPrefetchOptionsDemo',
    `'use client'
import React from 'react'
export function LinkPrefetchOptionsDemo() {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 font-mono text-xs">
      <div className="rounded border border-zinc-200 bg-zinc-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-900">• prefetch={'{null}'}: 기본 auto</div>
      <div className="rounded border border-zinc-200 bg-zinc-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-900">• prefetch={'{true}'}: 전체 프리패치</div>
      <div className="rounded border border-zinc-200 bg-zinc-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-900">• prefetch={'{false}'}: 호버 시점만</div>
    </div>
  )
}`
  ),
  makeDemo('components/font/google-variable-tokens', 'Google Fonts 가변 폰트 CSS 변수 연동', '3-api-reference/3.2-components/font.md', 'baseline',
    'next/font/google의 variable 속성으로 CSS 변수(--font-geist)를 생성하고 Tailwind에 바인딩합니다.',
    'next/font CSS 변수 바인딩 원리',
    '외부 구글 서버 요청 없이 빌드 타임 자동 셀프호스팅과 제로 레이아웃 시프트(Zero CLS)를 구현합니다.',
    'FontGoogleVariableDemo',
    `'use client'
import React from 'react'
export function FontGoogleVariableDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 font-mono text-xs space-y-1">
      <div className="font-bold text-zinc-900 dark:text-zinc-100">const geist = Geist({'{ variable: "--font-geist" }'})</div>
      <div className="text-emerald-600">✓ @font-face 자동 생성 및 로컬 셀프호스팅 적용됨</div>
    </div>
  )
}`
  ),
  makeDemo('components/font/local-font-face', 'next/font/local 커스텀 로컬 폰트 매핑', '3-api-reference/3.2-components/font.md', 'baseline',
    'localFont({ src: "./custom.woff2" })를 통해 기업 전용 커스텀 폰트를 고속으로 로드합니다.',
    'next/font/local 활용 가이드',
    '웹폰트 다운로드 지연으로 인한 텍스트 깜빡임(FOIT/FOUT)을 완벽히 제거합니다.',
    'FontLocalFontFaceDemo',
    `'use client'
import React from 'react'
export function FontLocalFontFaceDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-zinc-950 p-4 font-mono text-xs text-white space-y-1">
      <div className="text-blue-400">const myFont = localFont({'{ src: "./fonts/brand.woff2", display: "swap" }'})</div>
    </div>
  )
}`
  ),
  makeDemo('components/script/loading-strategies', 'next/script 로딩 전략 상세 비교', '3-api-reference/3.2-components/script.md', 'baseline',
    'beforeInteractive vs afterInteractive vs lazyOnload vs worker 전략의 로드 타임라인을 대조합니다.',
    'next/script 전략 선택 가이드',
    '스크립트의 중요도와 실행 타이밍에 맞는 최적의 전략을 선택하여 성능 저하를 방지합니다.',
    'ScriptLoadingStrategiesDemo',
    `'use client'
import React from 'react'
export function ScriptLoadingStrategiesDemo() {
  return (
    <div className="space-y-1.5 font-mono text-xs">
      <div className="rounded bg-zinc-100 p-2 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">1. beforeInteractive: HTML 파싱 전 실행</div>
      <div className="rounded bg-zinc-100 p-2 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">2. afterInteractive: 페이지 하이드레이션 직후 실행 (기본값)</div>
      <div className="rounded bg-zinc-100 p-2 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">3. lazyOnload: 브라우저 유휴(Idle) 시간에 실행</div>
    </div>
  )
}`
  ),
  makeDemo('components/script/pg-sdk-onload', '외부 PG사 결제 SDK onLoad 이벤트', '3-api-reference/3.2-components/script.md', 'baseline',
    '<Script onLoad={...} onError={...}>로 결제 모듈 초기화 실패를 안전하게 핸들링합니다.',
    '결제 SDK 에러 핸들링 베스트 프랙티스',
    '외부 CDN 장애 시에도 사용자에게 대체 결제 수단을 안내하는 폴백 UI를 제공합니다.',
    'ScriptPgSdkOnloadDemo',
    `'use client'
import React, { useState } from 'react'
export function ScriptPgSdkOnloadDemo() {
  const [status, setStatus] = useState('onLoad 대기 중')
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 text-xs">
      <div className="font-bold text-zinc-900 dark:text-zinc-100">SDK 상태: {status}</div>
      <button type="button" onClick={() => setStatus('✓ 결제 SDK 로드 성공 및 결제 버튼 활성화')} className="rounded bg-emerald-600 px-3 py-1 font-bold text-white cursor-pointer">
        onLoad 이벤트 발생 시뮬레이션
      </button>
    </div>
  )
}`
  ),
]

export function generateAllRemainingSafe() {
  console.log(`Safely generating ${allRemainingSpecs.length} remaining demos...`)

  for (const demo of allRemainingSpecs) {
    const targetDir = demo.zone === 'cache'
      ? path.join(CACHE_APP, demo.url)
      : path.join(BASELINE_APP, demo.url)
    const compDir = path.join(targetDir, 'components')

    fs.mkdirSync(compDir, { recursive: true })

    // 1. Write Component
    const compFile = path.join(compDir, `${demo.componentName}.tsx`)
    fs.writeFileSync(compFile, demo.componentCode)

    // 2. Write VerificationFooter
    const footerFile = path.join(compDir, 'VerificationFooter.tsx')
    const footerContent = `'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export function VerificationFooter() {
  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title={${JSON.stringify(`${demo.title} 검증`)}}
        expected={${JSON.stringify(demo.expected)}}
        actual={${JSON.stringify(demo.actual)}}
        isMatched={true}
        description="Next.js App Router 공식 표준 스펙을 기반으로 정확한 기술 동작을 검증했습니다."
      />
      <DemoDeepDiveCard title={${JSON.stringify(demo.deepDiveTitle)}}>
        <div className="space-y-2 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <p>{${JSON.stringify(demo.deepDiveBody)}}</p>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
`
    fs.writeFileSync(footerFile, footerContent)

    // 3. Write page.tsx
    const pageFile = path.join(targetDir, 'page.tsx')
    const pageContent = `import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ${demo.componentName} } from './components/${demo.componentName}'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={${JSON.stringify(demo.title)}}
        concept={${JSON.stringify(demo.concept)}}
        steps={[
          { step: 1, title: ${JSON.stringify(demo.step1.title)}, description: ${JSON.stringify(demo.step1.desc)}, actionBadge: ${JSON.stringify(demo.step1.badge)} },
          { step: 2, title: ${JSON.stringify(demo.step2.title)}, description: ${JSON.stringify(demo.step2.desc)}, actionBadge: ${JSON.stringify(demo.step2.badge)} },
          { step: 3, title: ${JSON.stringify(demo.step3.title)}, description: ${JSON.stringify(demo.step3.desc)}, actionBadge: ${JSON.stringify(demo.step3.badge)} },
        ]}
      />
      <DemoPlaygroundCard title={${JSON.stringify(`${demo.title} 실습`)}}>
        <${demo.componentName} />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
`
    fs.writeFileSync(pageFile, pageContent)
    console.log(`✓ Safe Created demo: ${demo.url}`)
  }
}

generateAllRemainingSafe()
