import React from 'react'
import { DemoDeepDiveCard } from '@study/demo-kit'
import { content } from '../content'

const FLOW = `요청 /…/catalog/?sort=price
  └─ 내부 리다이렉트 규칙 (redirects 목록 맨 앞, priority)
       false: /:path+/  →  /:path+          ← 이 앱
       true : /:notfile →  /:notfile/       (확장자·.well-known 제외)
              /:file/   →  /:file
  └─ 308 Location: /…/catalog?sort=price  (page.tsx는 실행되지 않음)
  └─ 브라우저가 Location으로 다시 요청 → catalog/page.tsx 200`

export function TrailingSlashDeepDive() {
  return (
    <DemoDeepDiveCard title="URL 끝 슬래시 정규화의 위치와 범위" className="min-w-0 break-words">
      <pre className="max-w-full overflow-x-auto rounded bg-zinc-100 p-3 font-mono text-[11px] leading-relaxed dark:bg-zinc-900">{FLOW}</pre>
      {content.concepts.map((concept) => (
        <section key={concept.title} className="space-y-1.5">
          <h3 className="font-semibold">{concept.title}</h3>
          <p className="leading-relaxed">{concept.body}</p>
        </section>
      ))}
      <p className="text-zinc-500">Next.js 16.3.2 기준. 실측(현재 설정)과 설명(true 적용 시)을 구분해서 읽어 보세요.</p>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {content.references.map((reference) => (
          <a key={reference.url} href={reference.url} target="_blank" rel="noreferrer" className="underline underline-offset-4">
            {reference.label}
          </a>
        ))}
      </div>
    </DemoDeepDiveCard>
  )
}
