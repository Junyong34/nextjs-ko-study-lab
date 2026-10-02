'use client'
import React from 'react'
import { DemoDeepDiveCard, ExpectedActualPanel } from '@study/demo-kit'
import type { FetchRun } from '../types'
import { URL_LIMIT } from '../lib/logLine'
import { content } from '../content'

interface Props {
  runs: FetchRun[]
  answers: (number | null)[]
  submitted: boolean
}

const EXPECTED = (
  <ul className="list-disc space-y-1 pl-4">
    <li>서버 fetch가 200으로 끝나고, Route Handler가 받은 쿼리스트링이 보낸 쿼리스트링과 한 글자도 다르지 않다.</li>
    <li>요청 URL이 {URL_LIMIT}자를 넘는다 — fetches를 켜고 fullUrl을 끄면 터미널 표시가 잘리는 길이다.</li>
    <li>[서버 렌더 다시 실행] 후 Route Handler 요청 번호가 증가한다 (cache: &apos;no-store&apos;라 렌더마다 fetch가 실제로 나감).</li>
    <li>개념 확인 두 문항을 모두 맞힌다.</li>
  </ul>
)

const mark = (ok: boolean) => (ok ? '일치' : '불일치')

export function VerificationFooter({ runs, answers, submitted }: Props) {
  const [latest, prev] = runs
  const correctCount = content.questions.filter((q, i) => answers[i] === q.correct).length
  const ready = runs.length >= 2 && submitted

  let isMatched: boolean | undefined
  let actual: React.ReactNode = (
    <span>대기 중: [서버 렌더 다시 실행]을 한 번 이상 누르고, 개념 확인의 [답안 확인]을 누르세요. (렌더 {runs.length}회 · 답안 {submitted ? '제출됨' : '미제출'})</span>
  )

  if (ready) {
    const fetched = latest.ok && latest.status === 200
    const intact = latest.ok && latest.echo.receivedSearch === latest.sentSearch
    const long = latest.url.length > URL_LIMIT
    const reExecuted = latest.ok && prev.ok && latest.echo.requestCount > prev.echo.requestCount
    const quizOk = correctCount === content.questions.length
    isMatched = fetched && intact && long && reExecuted && quizOk
    actual = (
      <ul className="space-y-1 break-words">
        <li>{mark(fetched)}: 상태 {latest.ok ? latest.status : `실패(${latest.error})`}</li>
        <li>{mark(intact)}: 보낸 쿼리 {latest.ok ? latest.sentSearch.length : 0}자 / 받은 쿼리 {latest.ok ? latest.echo.receivedSearch.length : 0}자</li>
        <li>{mark(long)}: 요청 URL {latest.url.length}자 (기준 {URL_LIMIT}자)</li>
        <li>{mark(reExecuted)}: Route Handler 요청 #{prev.ok ? prev.echo.requestCount : '-'} → #{latest.ok ? latest.echo.requestCount : '-'}</li>
        <li>{mark(quizOk)}: 개념 확인 정답 {correctCount} / {content.questions.length}</li>
        {content.questions.map((q, i) => (
          <li key={q.prompt} className="pl-3 text-zinc-600 dark:text-zinc-400">
            {i + 1}. 선택 &quot;{q.choices[answers[i]!]}&quot; — {q.reason}
          </li>
        ))}
        <li>
          터미널 출력: 판정 불가 — 이 화면은 dev 서버 stdout을 읽지 않습니다.
          {latest.nodeEnv === 'production' ? ' 현재 NODE_ENV=production이라 fetch 로그 자체가 출력되지 않습니다.' : ` 현재 NODE_ENV=${latest.nodeEnv}이므로 dev 터미널에서 직접 확인하세요.`}
        </li>
      </ul>
    )
  }

  return (
    <div className="space-y-4">
      <div aria-live="polite">
        <ExpectedActualPanel
          title="서버 fetch 실측과 개념 확인"
          className="min-w-0 break-words"
          expected={EXPECTED}
          actual={actual}
          isMatched={isMatched}
          description="fetch 결과는 서버 렌더가 내려준 실측값으로, 개념 확인은 선택한 답으로 판정합니다. 터미널 로그 형식은 판정에 넣지 않습니다."
        />
      </div>
      <DemoDeepDiveCard title="logging.fetches에서 정리할 개념" className="min-w-0 break-words">
        {content.concepts.map((concept) => (
          <section key={concept.title} className="space-y-1.5">
            <h3 className="font-semibold">{concept.title}</h3>
            <p className="leading-relaxed">{concept.body}</p>
          </section>
        ))}
        <p className="text-zinc-500">Next.js 16.3.2 기준. 옵션 기본값은 next/dist/server/config-shared.js(logging: {'{ serverFunctions: true }'})로 확인했습니다.</p>
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
