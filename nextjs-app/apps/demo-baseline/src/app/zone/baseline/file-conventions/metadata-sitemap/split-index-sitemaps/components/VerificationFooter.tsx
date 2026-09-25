'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import type { ProbeResult, SitemapPlan } from '../types'
import { evaluate } from './evaluate'

interface VerificationFooterProps {
  plan: SitemapPlan
  results: ProbeResult[]
  isComplete: boolean
}

export function VerificationFooter({ plan, results, isComplete }: VerificationFooterProps) {
  const checks = isComplete ? evaluate(plan, results) : []
  const isMatched = isComplete ? checks.every((c) => c.ok) : undefined

  // ExpectedActualPanel은 문자열 두 개를 받으면 자동 비교로 "불일치"를 띄우므로 JSX로 감싼다.
  const expected = (
    <ul className="space-y-1 font-mono text-[11px]">
      {Array.from({ length: plan.sitemapCount }, (_, id) => {
        const count = Math.min(plan.urlsPerSitemap, plan.totalProducts - id * plan.urlsPerSitemap)
        return <li key={id}>• sitemap/{id}.xml → &lt;url&gt; {count}개</li>
      })}
      <li>• sitemap/{plan.sitemapCount}.xml (없는 id) → 404</li>
      <li>• 세그먼트 sitemap.xml → 404 (인덱스 자동 생성 없음)</li>
      <li>• sitemap-index.xml (직접 작성) → &lt;sitemap&gt; {plan.sitemapCount}개</li>
    </ul>
  )

  const actual = !isComplete ? (
    <p className="text-xs">• 요청 대기 중 (상단 [실제 sitemap XML 요청]을 눌러 주세요)</p>
  ) : (
    <ul className="space-y-1 font-mono text-[11px]">
      {checks.map((c) => (
        <li key={c.label} className={c.ok ? '' : 'text-rose-600 dark:text-rose-400'}>
          {c.ok ? '•' : '✕'} {c.label} → {c.actual}
          {!c.ok && <span className="block pl-3 text-zinc-500">기대: {c.expected}</span>}
        </li>
      ))}
    </ul>
  )

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="generateSitemaps() 분할 결과 실측"
        expected={expected}
        actual={actual}
        isMatched={isMatched}
        description="catalog.ts로 계산한 파일별 기대 URL 수·SKU 범위와, 브라우저가 실제로 받은 XML을 DOMParser로 센 값을 대조합니다."
      />
      <DemoDeepDiveCard title="generateSitemaps()와 분할 sitemap URL 규칙">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">1. 생성 URL과 id 시그니처 (16.x)</h5>
            <p>
              <code>{'<세그먼트>'}/sitemap.ts</code>에서 <code>generateSitemaps()</code>를 export하면 반환한 id마다{' '}
              <code>{'<세그먼트>'}/sitemap/[id].xml</code>이 생깁니다(v15부터 dev·prod 같은 형식). v16부터 기본 함수는{' '}
              <code>{'{ id: Promise<string> }'}</code>를 받습니다. <code>{'{ id: 0 }'}</code>처럼 숫자로 반환해도{' '}
              <code>await props.id</code>는 문자열 <code>&quot;0&quot;</code>이므로, 이 데모는 <code>Number(id)</code>로 바꾼 뒤
              오프셋(<code>id × 1,000</code>)을 계산합니다.
            </p>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">2. 파일 구조</h5>
            <pre className="overflow-x-auto rounded bg-zinc-100 p-2.5 font-mono text-[11px] dark:bg-zinc-900">{`split-index-sitemaps/
├─ catalog.ts              상품 3,500개 생성, 파일당 1,000개
├─ sitemap.ts              generateSitemaps() → [{id:0}..{id:3}]
│                          → sitemap/0.xml ~ sitemap/3.xml
└─ sitemap-index.xml/
   └─ route.ts             <sitemapindex> 직접 작성 (force-static)`}</pre>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">3. 인덱스는 자동으로 생기지 않는다</h5>
            <p>
              공식 문서는 분할 파일 URL(<code>/.../sitemap/[id].xml</code>)만 설명하고 <code>&lt;sitemapindex&gt;</code> 생성은
              언급하지 않습니다. 실측에서도 세그먼트의 <code>sitemap.xml</code>은 404입니다. 검색엔진에 URL 하나로 제출하려면{' '}
              <code>sitemap-index.xml/route.ts</code>처럼 Route Handler로 인덱스를 직접 만들거나, 각 분할 URL을{' '}
              <code>robots.ts</code>의 <code>sitemap</code> 배열에 나열합니다.
            </p>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">4. 실무 주의사항</h5>
            <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
              <li>
                <strong>50,000개 상한</strong>: Google 기준 파일 하나에 URL 50,000개까지입니다. 실서비스에서는{' '}
                <code>URLS_PER_SITEMAP</code>을 50,000으로 두고 <code>ceil(전체 수 / 50,000)</code>개의 id를 반환합니다. 이 데모는
                화면에서 확인하기 쉽도록 1,000개로 줄였습니다.
              </li>
              <li>
                <strong>없는 id는 404</strong>: <code>generateSitemaps()</code>가 반환하지 않은 id를 요청하면 기본 함수가 실행되지
                않고 404가 됩니다.
              </li>
              <li>
                <strong>기본 캐시</strong>: sitemap.ts는 요청 시점 API나 dynamic 설정을 쓰지 않으면 캐시되는 특수 Route
                Handler입니다. 16.3.2 <code>next build</code> 출력에서 이 데모는 <code>sitemap/[__metadata_id__]</code> 아래 <code>● 0.xml ~ 3.xml</code>(SSG), <code>sitemap-index.xml</code>은 <code>○</code>(Static)으로 표시됩니다.
              </li>
              <li>
                <strong>절대 URL</strong>: <code>&lt;loc&gt;</code>에는 도메인을 포함해야 합니다. 이 데모는 layout의{' '}
                <code>metadataBase</code>와 같은 <code>siteUrl</code>(<code>NEXT_PUBLIC_SITE_URL</code>)을 씁니다.
              </li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
