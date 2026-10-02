import React from 'react'
import { DemoDeepDiveCard } from '@study/demo-kit'
import { content } from '../content'

export function VerificationFooter() {
  return (
    <DemoDeepDiveCard title="formats가 정하는 것과 이 앱에서 확인한 것" className="min-w-0 break-words">
      {content.concepts.map((concept) => (
        <section key={concept.title} className="space-y-1.5">
          <h3 className="font-semibold">{concept.title}</h3>
          <p className="leading-relaxed">{concept.body}</p>
        </section>
      ))}
      <pre className="max-w-full overflow-x-auto rounded bg-zinc-950 p-3 text-xs text-zinc-100"><code>{`optimizer 켜짐(기본값)
  <img src="/_next/image?url=/hero.jpg&w=1080&q=75">  Accept: image/avif,image/webp,…
    → formats와 Accept로 출력 포맷 결정 → 변환·캐시(포맷별) → Content-Type: image/avif, Vary: Accept
images.unoptimized: true (이 zone)
  <img src="/hero.jpg">  → 원본 포맷 그대로   (/_next/image 라우트 없음: 404, formats 무시)`}</code></pre>
      <p className="text-zinc-500">Next.js 16.3.2 기준. 실측(검증 패널), 설정 예제와 확인 절차, 협상 계산(개념 확인)을 구분해서 읽어 보세요.</p>
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
