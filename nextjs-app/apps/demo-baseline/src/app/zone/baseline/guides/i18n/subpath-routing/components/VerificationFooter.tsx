'use client'
import React from 'react'
import { ExpectedActualPanel } from '@study/demo-kit'
import { useProbe } from './ProbeContext'
import { LOCALES } from '../locales'

const EXPECTED = [
  '/ko · /en · /ja /products → 200, 응답 HTML의 data-route-lang가 요청한 [lang]과 같고 언어별 제목이 서로 다름',
  '/fr/products → 404 (hasLocale 실패 → notFound())',
].join('\n')

export function VerificationFooter() {
  const { checks, running, error } = useProbe()

  const headings = checks?.filter((c) => c.expectedStatus === 200).map((c) => c.heading) ?? []
  const distinct = headings.length === LOCALES.length && headings.every(Boolean) && new Set(headings).size === headings.length
  const matched = checks ? checks.every((c) => c.ok) && distinct : error ? false : undefined

  const actual = error
    ? `측정 실패: ${error}`
    : checks
      ? [
          ...checks.map(
            (c) =>
              `[${c.ok ? 'O' : 'X'}] /${c.lang}/products → ${c.status} (기대 ${c.expectedStatus}) · data-route-lang=${c.renderedLang ?? '없음'}${c.heading ? ` · 제목="${c.heading}"` : ''}`,
          ),
          `[${distinct ? 'O' : 'X'}] 언어별 제목이 서로 다름`,
        ].join('\n')
      : running
        ? '측정 중...'
        : '대기 중 — [경로 실측 실행]을 눌러 실제 응답을 확인하세요.'

  // expected/actual이 둘 다 문자열이고 isMatched가 undefined이면 공용 패널이 문자열을 자동 비교해
  // 대기 상태를 '불일치'로 표시한다. ReactNode로 감싸 자동 비교를 피하고 isMatched만 판정에 쓴다.
  return (
    <ExpectedActualPanel
      title="[lang] 서브패스 라우팅 검증"
      expected={<span className="whitespace-pre-line">{EXPECTED}</span>}
      actual={<span className="whitespace-pre-line">{actual}</span>}
      isMatched={matched}
      description="브라우저가 각 언어 경로를 실제로 요청해 얻은 상태 코드와 서버 렌더링 HTML로 판정합니다."
    />
  )
}
