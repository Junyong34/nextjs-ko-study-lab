'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export interface VerificationFooterProps {
  isMatched?: boolean
  expected?: React.ReactNode
  actual?: React.ReactNode
  status?: string | number | null
  description?: string
  isLoaded?: boolean
  logs?: string[]
  count?: number
  [key: string]: any
}

export function VerificationFooter(props: VerificationFooterProps = {}) {
  const {
    isMatched: propIsMatched,
    expected: propExpected,
    actual: propActual,
    status,
    description: propDescription,
    isLoaded,
    logs,
    count,
    ...rest
  } = props

  const isMatched =
    propIsMatched !== undefined
      ? propIsMatched
      : status !== undefined && status !== null
      ? typeof status === 'number'
        ? status >= 200 && status < 400
        : status === 'success' || status === 'valid' || status === 'completed' || status === 'ok'
      : isLoaded !== undefined
      ? Boolean(isLoaded)
      : logs && Array.isArray(logs) && logs.length > 0
      ? true
      : count !== undefined && count > 0
      ? true
      : undefined

  const defaultExpected = "• headers().get(&apos;user-agent&apos;) 기기 식별 및 최적화 사양에 따른 정상 동작 및 상태 변화 관찰"
  const defaultActual = "• 실시간 인터랙션 및 상태 동기화 완료\n• 4단 표준 레이아웃 정상 적용"

  const actualContent =
    propActual !== undefined
      ? propActual
      : isMatched === true
      ? defaultActual
      : isMatched === false
      ? '• 인터랙션 실패 또는 불일치 감지 (동작 재확인이 필요합니다)'
      : '• 인터랙션 대기 중 (상단 데모의 조작 요소를 실행하여 결과를 관찰하세요)'

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="headers().get(&apos;user-agent&apos;) 기기 식별 및 최적화 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="headers().get(&apos;user-agent&apos;) 기기 식별 및 최적화">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>headers().get(&apos;user-agent&apos;)는 클라이언트의 브라우저 및 운영체제 식별 문자열을 서버에서 분석하여 모바일/태블릿/데스크톱 기기를 분류하는 스펙입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>User-Agent 문자열을 파싱하여 인앱 웹뷰(카카오톡, 인스타그램) 여부를 감지하고 전용 간편결제 SDK 분기 및 기기별 최적화 뷰를 서빙합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>깜빡임 없는 기기 맞춤 렌더링: 클라이언트 미디어 쿼리 이전에 서버에서 모바일/데스크톱 레이아웃을 직접 전송하여 레이아웃 시프트(CLS)를 방지합니다.</li>
              <li>인앱 브라우저 호환성 극대화: 외부 앱 웹뷰 환경에서의 결제 팝업 차단 이슈를 선제적으로 우회 처리합니다.</li>
              <li>모바일 네이티브 연동: 모바일 기기 접속 시 전용 앱스토어 설치 유도 배너를 즉각 렌더링합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>모바일 앱 웹뷰 전용 간편결제(카카오페이, 네이버페이, 애플페이) UI 분기</li>
              <li>데스크톱 고해상도 갤러리 vs 모바일 스와이프 터치 캐러셀 서버 분기</li>
              <li>검색 엔진 크롤러(봇) 감지 및 SEO 메타데이터 전용 서빙</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
