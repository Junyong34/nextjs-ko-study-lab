'use client'
import React from 'react'
import { DemoDeepDiveCard, ExpectedActualPanel } from '@study/demo-kit'
import type { IndicatorProbe } from '../types'
import { content } from '../content'

interface Props {
  probes: IndicatorProbe[]
  answers: (number | null)[]
  submitted: boolean
}

// 이 앱의 next.config.ts에는 devIndicators가 없으므로 기본값(config-shared.js의 position: 'bottom-left')이 기대값이다.
const DEFAULT_CORNER = 'bottom-left'

const EXPECTED = (
  <ul className="list-disc space-y-1 pl-4">
    <li>development: &lt;nextjs-portal&gt;이 1개 있고 open shadow root 안에서 표시기를 찾으며, 위치는 기본값 {DEFAULT_CORNER} 사분면이다.</li>
    <li>production: &lt;nextjs-portal&gt;이 없다 (dev 오버레이 코드가 번들에 없음).</li>
    <li>개념 확인 두 문항을 모두 맞힌다.</li>
  </ul>
)

const mark = (ok: boolean) => (ok ? '일치' : '불일치')

export function VerificationFooter({ probes, answers, submitted }: Props) {
  const latest = probes[0]
  const correctCount = content.questions.filter((q, i) => answers[i] === q.correct).length

  let isMatched: boolean | undefined
  let actual: React.ReactNode = (
    <span>대기 중: [표시기 측정]을 누르고, 개념 확인의 [답안 확인]을 누르세요. (측정 {probes.length}회 · 답안 {submitted ? '제출됨' : '미제출'})</span>
  )

  if (latest && submitted) {
    const isDev = latest.nodeEnv === 'development'
    const dom = isDev
      ? latest.portalCount === 1 && latest.shadowReadable && latest.indicatorFound
      : latest.portalCount === 0
    const corner = isDev ? latest.corner === DEFAULT_CORNER : true
    const quizOk = correctCount === content.questions.length
    isMatched = dom && corner && quizOk
    actual = (
      <ul className="space-y-1 break-words">
        <li>
          {mark(dom)}: NODE_ENV={latest.nodeEnv}, nextjs-portal {latest.portalCount}개, shadowRoot {latest.shadowReadable ? '읽음' : '못 읽음'}, 표시기 {latest.indicatorFound ? '있음' : '없음'}
        </li>
        <li>
          {isDev ? `${mark(corner)}: 측정 사분면 ${latest.corner ?? '없음'} / 기대 ${DEFAULT_CORNER}` : '위치: production에는 표시기가 없어 해당 없음'}
        </li>
        <li>{mark(quizOk)}: 개념 확인 정답 {correctCount} / {content.questions.length}</li>
        {content.questions.map((q, i) => (
          <li key={q.prompt} className="pl-3 text-zinc-600 dark:text-zinc-400">
            {i + 1}. 선택 &quot;{q.choices[answers[i]!]}&quot; — {q.reason}
          </li>
        ))}
        <li>참고(판정 제외): Dev Tools 메뉴 Route 값 {latest.routeType ?? '읽지 못함 — 표시기를 눌러 메뉴를 연 뒤 다시 측정'}</li>
        <li>position 변경·false 설정의 효과: 판정 불가 — 이 앱에서는 적용하지 않았습니다.</li>
      </ul>
    )
  }

  return (
    <div className="space-y-4">
      <div aria-live="polite">
        <ExpectedActualPanel
          title="개발 표시기 DOM 측정과 개념 확인"
          className="min-w-0 break-words"
          expected={EXPECTED}
          actual={actual}
          isMatched={isMatched}
          description="NODE_ENV와 표시기 요소는 [표시기 측정]을 누른 순간의 DOM에서 읽습니다. 개념 확인은 선택한 답으로 판정합니다."
        />
      </div>
      <DemoDeepDiveCard title="devIndicators에서 정리할 개념" className="min-w-0 break-words">
        {content.concepts.map((concept) => (
          <section key={concept.title} className="space-y-1.5">
            <h3 className="font-semibold">{concept.title}</h3>
            <p className="leading-relaxed">{concept.body}</p>
          </section>
        ))}
        <p className="text-zinc-500">Next.js 16.3.2 기준. 기본값과 옵션은 내장 문서(devIndicators.md)와 next/dist/server/config-schema.js로 확인했습니다.</p>
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
