'use client'

import React from 'react'
import { DemoDeepDiveCard, ExpectedActualPanel } from '@study/demo-kit'
import { overall } from '../lib/judge'
import { content } from '../content'
import type { Check } from '../types'

const BADGE = { wait: '대기', pass: '일치', fail: '불일치' } as const

const TREE = `client-routing/layout.tsx   ← 탐색 중 유지 (요청 기록·장바구니 상태)
├─ page.tsx                  /            → 목록
└─ products/[id]/page.tsx    /products/:id
     generateStaticParams → running-shoes, windbreaker
     dynamicParams = false → 그 밖의 id는 404

<Link> 클릭
  서버 모드(이 앱): GET /…/products/running-shoes?_rsc=…  (rsc: 1) → text/x-component
  export 빌드    : GET /…/products/running-shoes.txt          → text/plain`

export function VerificationFooter({ checks }: { checks: Check[] }) {
  return (
    <div className="space-y-4">
      <div aria-live="polite">
        <ExpectedActualPanel
          title="클라이언트 라우팅 실측 검증"
          description="패치한 window.fetch가 기록한 라우터 요청, Performance API, 상세 경로의 문서 응답 상태로만 판정합니다. export 빌드의 .txt 요청은 이 앱에서 실측하지 않으므로 판정에 들어가지 않습니다."
          expected={<ul className="list-disc space-y-1 pl-4">{checks.map((c) => <li key={c.id}>{c.label}: {c.expected}</li>)}</ul>}
          actual={
            <ul className="list-disc space-y-1 break-all pl-4">
              {checks.map((c) => (
                <li key={c.id}><strong>[{BADGE[c.state]}]</strong> {c.label}: {c.actual}</li>
              ))}
            </ul>
          }
          isMatched={overall(checks)}
        />
      </div>
      <DemoDeepDiveCard title="정적 export와 클라이언트 탐색" className="min-w-0 break-words">
        <pre className="max-w-full overflow-x-auto rounded bg-zinc-100 p-3 font-mono text-[11px] leading-relaxed dark:bg-zinc-900">{TREE}</pre>
        {content.concepts.map((concept) => (
          <section key={concept.title} className="space-y-1.5">
            <h3 className="font-semibold">{concept.title}</h3>
            <p className="leading-relaxed">{concept.body}</p>
          </section>
        ))}
        <p className="text-zinc-500">Next.js 16.3.2 기준. export 빌드 경로 규칙은 next/dist/client/components/router-reducer/fetch-server-response.js에서 확인했습니다.</p>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {content.references.map((reference) => (
            <a key={reference.url} href={reference.url} target="_blank" rel="noreferrer" className="underline underline-offset-4">
              {reference.label}
            </a>
          ))}
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
