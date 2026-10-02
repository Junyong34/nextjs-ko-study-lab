'use client'
import React from 'react'
import { ExpectedActualPanel } from '@study/demo-kit'
import { COUNTED_TAGS, type DomCensus, type Prediction, type RouteProbe } from '../types'
import { EXPECTED_COUNTS, EXPECTED_JSX_TABLES, EXPECTED_PIPE_PARAGRAPHS, SPEC_SHEET_TITLE } from '../expectations'
import { TechDocDeepDive } from './TechDocDeepDive'

interface Props {
  census: DomCensus | null
  route: RouteProbe | null
  prediction: Prediction | null
}

const EXPECTED = (
  <ul className="list-disc space-y-1 pl-4">
    <li>렌더된 영역의 태그 개수가 spec.mdx 원본에서 센 값과 같다 (h1 1, h2 4, li 6, pre 1, code 5, a 1 …).</li>
    <li>remark-gfm이 없으므로 파이프 표는 &lt;table&gt;이 되지 않고 문단 1개로 남으며, &lt;table&gt;은 JSX로 쓴 1개뿐이다 — 예측과 일치해야 한다.</li>
    <li>spec-sheet/page.mdx는 라우트로 200을 돌려주고, &lt;title&gt;에 MDX의 export const metadata 값이 들어간다.</li>
  </ul>
)

const mark = (ok: boolean) => (ok ? '✅' : '❌')

export function VerificationFooter({ census, route, prediction }: Props) {
  let isMatched: boolean | undefined
  let actual: React.ReactNode = '• 대기 중: 예측을 고르고 [렌더된 DOM 측정]과 [page.mdx 라우트 요청]을 모두 실행하세요.'

  if (census && route && prediction) {
    const wrongTags = COUNTED_TAGS.filter((tag) => census.counts[tag] !== EXPECTED_COUNTS[tag])
    const countsOk = wrongTags.length === 0
    const tableLimitOk = census.pipeParagraphs === EXPECTED_PIPE_PARAGRAPHS && census.jsxTables === EXPECTED_JSX_TABLES && census.counts.table === EXPECTED_JSX_TABLES
    const predictionOk = (prediction === 'text') === (census.pipeParagraphs > 0)
    const routeOk = route.status === 200 && (route.title ?? '').startsWith(SPEC_SHEET_TITLE)
    isMatched = countsOk && tableLimitOk && predictionOk && routeOk
    actual = (
      <ul className="space-y-1">
        <li>{mark(countsOk)} 태그 개수 {countsOk ? '모두 일치' : `불일치: ${wrongTags.map((t) => `${t} ${census.counts[t]}/${EXPECTED_COUNTS[t]}`).join(', ')}`}</li>
        <li>{mark(tableLimitOk)} 파이프 텍스트 문단 {census.pipeParagraphs}개, &lt;table&gt; {census.counts.table}개(JSX {census.jsxTables}개)</li>
        <li>{mark(predictionOk)} 예측 &quot;{prediction === 'table' ? '<table>이 된다' : '문단 텍스트로 남는다'}&quot;</li>
        <li>{mark(routeOk)} spec-sheet 응답 {route.status}, title &quot;{route.title ?? '(없음)'}&quot;</li>
      </ul>
    )
  }

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="MDX → HTML 변환 실측 결과"
        expected={EXPECTED}
        actual={actual}
        isMatched={isMatched}
        description="렌더된 DOM과 page.mdx 라우트의 실제 응답으로만 판정합니다. 예측이 틀리면 실패로 표시됩니다."
      />
      <TechDocDeepDive />
    </div>
  )
}
