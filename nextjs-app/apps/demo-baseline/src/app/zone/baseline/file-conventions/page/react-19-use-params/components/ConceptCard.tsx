import React from 'react'
import { DemoDeepDiveCard } from '@study/demo-kit'

const TREE = `react-19-use-params/
├─ layout.tsx               가이드 + <ProbeProvider> + 링크 + 검증 패널
├─ page.tsx                 기본 경로 안내
├─ server/[sku]/page.tsx    async Server Component → await params / await searchParams
│   └─ <Suspense>
│       └─ <ForwardedUnwrap params={params} searchParams={searchParams} />
│            'use client' → use(params) / use(searchParams)
└─ client/[sku]/page.tsx    'use client' page → use(params) / use(searchParams)`

export function ConceptCard() {
  return (
    <DemoDeepDiveCard title="page props Promise: await와 use()의 역할 분담">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">1. 핵심 스펙</h5>
          <p>
            <code>page</code>의 <code>params</code>는 다이나믹 세그먼트 객체로, <code>searchParams</code>는 URL 쿼리 객체로
            resolve되는 <strong>Promise</strong>입니다. 공식 문서는 &quot;prop이 promise이므로 <code>async/await</code> 또는
            React의 <code>use</code> 함수로 값에 접근해야 한다&quot;고 명시합니다. <code>searchParams</code>는
            <code> URLSearchParams</code>가 아닌 평범한 객체이며, 같은 키가 반복되면 값이 배열(<code>?size=L&amp;size=XL</code>
            → <code>{'{ size: ["L", "XL"] }'}</code>)이 됩니다.
          </p>
        </div>

        <div>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">2. 이 데모의 파일 구조</h5>
          <pre className="overflow-x-auto rounded bg-zinc-950 p-3 font-mono text-[11px] text-zinc-300">{TREE}</pre>
        </div>

        <div>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">3. 어디서 풀리는가</h5>
          <ul className="list-disc space-y-1 pl-4 text-zinc-600 dark:text-zinc-400">
            <li>
              <strong>Server page</strong>: <code>async</code> 함수라 <code>await</code>를 씁니다. 검사와 언래핑은 항상 서버에서
              실행되며, 쿼리만 바꿔도 서버가 다시 렌더링합니다(<code>searchParams</code>는 요청 시점 API → 동적 렌더링).
            </li>
            <li>
              <strong>&apos;use client&apos; page</strong>: Client Component는 <code>async</code>일 수 없으므로 <code>use()</code>로
              렌더 중에 Promise를 풉니다. 하드 로드 시에는 SSR 단계에서 서버가 먼저 한 번 <code>use()</code>를 실행하고(카드의 렌더
              환경이 <code>server (SSR)</code>로 HTML에 찍힘), 하이드레이션·soft navigation 이후에는 브라우저에서 실행됩니다.
            </li>
            <li>
              <strong>Promise 전달 패턴</strong>: Server page가 <code>await</code> 없이 같은 Promise를 Client Component prop으로
              넘기면, RSC 페이로드로 직렬화된 Promise를 클라이언트가 <code>use()</code>로 풉니다. 아직 resolve되지 않았다면 가장
              가까운 <code>&lt;Suspense&gt;</code> fallback이 표시됩니다.
            </li>
          </ul>
        </div>

        <div>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">4. 주의사항</h5>
          <ul className="list-disc space-y-1 pl-4 text-zinc-600 dark:text-zinc-400">
            <li>
              <code>useParams()</code>/<code>useSearchParams()</code>는 props 없이 라우터 컨텍스트에서 읽는 훅입니다. 이 데모의{' '}
              <code>use(params)</code>는 <em>page가 props로 받은 Promise</em>를 푸는 것으로 경로가 다릅니다.
            </li>
            <li>
              Next.js 14 이하의 동기식 접근(<code>params.sku</code>)은 호환용으로만 남아 있고 향후 제거 예정입니다. 타입은{' '}
              <code>Promise&lt;{'{ sku: string }'}&gt;</code> 또는 전역 헬퍼 <code>PageProps&lt;&apos;/route/[sku]&apos;&gt;</code>로 선언합니다.
            </li>
            <li>
              Client page에서 Promise 여부 검사는 <code>useEffect</code>에서 실행합니다. 렌더 중 서버·브라우저 값이 달라지면
              하이드레이션 불일치가 나기 때문입니다.
            </li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
