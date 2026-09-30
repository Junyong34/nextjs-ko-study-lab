import React from 'react'
import { DemoDeepDiveCard } from '@study/demo-kit'
import { content } from '../content'

export function VerificationFooter() {
  return (
    <DemoDeepDiveCard title="설정 예제에서 정리할 개념" className="min-w-0 break-words">
      {content.concepts.map(concept => (
        <section key={concept.title} className="space-y-1.5">
          <h3 className="font-semibold">{concept.title}</h3>
          <p className="leading-relaxed">{concept.body}</p>
        </section>
      ))}
      <p className="text-zinc-500">Next.js 16.3.2 기준. 설정 예제, 확인 절차, 개념 확인을 구분해서 읽어 보세요.</p>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {content.references.map(reference => (
          <a key={reference.url} href={reference.url} target="_blank" rel="noreferrer" className="underline underline-offset-4">
            {reference.label}
          </a>
        ))}
      </div>
    </DemoDeepDiveCard>
  )
}
