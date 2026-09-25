'use client'

import React from 'react'
import { ExpectedActualPanel } from '@study/demo-kit'
import { RUN_MODE } from '../probe'
import { useProbe } from './ProbeContext'

/**
 * 이 파일은 클라이언트 번들에 들어간다. 사전 문자열을 여기 적으면 "청크에 없음" 검증이 스스로 깨지므로
 * 기대값은 키 개수·상태 코드처럼 번역과 무관한 표현만 쓴다.
 */
const COMMON =
  '• /ko · /en · /ja: 200, <article data-dict-lang>가 요청 언어와 같고, 사전 원본(source/[lang])의 문자열 6개가 전부 SSR HTML 본문에 존재\n' +
  '• 각 page가 참조하는 JS 청크와 현재 문서가 로드한 스크립트 어디에도 다른 언어(와 자기 언어) 사전 문자열 0건\n' +
  '• 대조군: 클라이언트 컴포넌트(LangNav)의 문자열은 청크에서 발견 → 스캔 방법이 유효함\n' +
  '• /fr: 404 (hasLocale() 실패 → notFound())'

const EXPECTED_BY_MODE = {
  production:
    COMMON +
    '\n• 3개 언어 page 모두 x-nextjs-cache 존재 — next build 라우트 표의 ● [lang] 아래 /ko · /en · /ja로 미리 만든 HTML',
  development: COMMON + '\n• x-nextjs-cache는 판정하지 않음 — dev 응답에도 붙을 수 있지만, ● 사전 생성의 근거는 next build 라우트 표와 next start 응답',
}

export function VerificationFooter() {
  const { report, running } = useProbe()
  const isMatched = !running && report ? report.ok : undefined

  const actual = report
    ? report.checks.map((c) => `${c.ok ? '[O]' : '[X]'} ${c.label}`).join('\n')
    : '• 아직 실측하지 않았습니다. 위 [사전·번들 실측 실행] 버튼을 누르세요.'

  return (
    <ExpectedActualPanel
      title={`언어별 SSR 번역 · 청크 내 사전 부재 · 미지원 언어 404 (현재 ${RUN_MODE})`}
      expected={<>{EXPECTED_BY_MODE[RUN_MODE]}</>}
      actual={<>{actual}</>}
      isMatched={isMatched}
      description="판정은 브라우저가 실제로 받은 page HTML, 사전 원본 JSON 응답, JS 청크 파일 본문, 상태 코드와 응답 헤더로만 합니다. 청크 검색은 원문과 \uXXXX 이스케이프 표기를 모두 찾습니다."
    />
  )
}
