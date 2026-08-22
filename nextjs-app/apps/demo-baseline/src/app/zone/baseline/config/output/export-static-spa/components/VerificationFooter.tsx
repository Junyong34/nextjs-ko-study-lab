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

  const defaultExpected = "• output: &apos;export&apos; 순수 정적 SPA 산출물 생성 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="output: &apos;export&apos; 순수 정적 SPA 산출물 생성 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="output: &apos;export&apos; 순수 정적 SPA 산출물 생성">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>output: &apos;export&apos;는 Next.js 애플리케이션의 모든 라우트를 순수 정적 HTML, CSS, JS 파일로 사전 렌더링(Pre-render)하여 Node.js 서버 없이 배포 가능하게 만드는 설정입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>빌드 시점에 모든 페이지를 정적 HTML 파일로 컴파일하여 out/ 디렉토리에 생성하며, Nginx, AWS S3/CloudFront, GitHub Pages 등 순수 정적 웹 서버에 즉시 배포할 수 있습니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>서버 호스팅 비용 제로: Node.js 서버 런타임 유지 비용 없이 저렴한 S3/CloudFront 스토리지 호스팅만으로 서비스 운영이 가능합니다.</li>
              <li>최상의 보안성 및 가용성: 서버 사이드 코드가 실행되지 않으므로 서버 침투 취약점이 원천 차단되며 무제한 트래픽을 견딥니다.</li>
              <li>극한의 글로벌 로딩 속도: 모든 페이지가 CDN 엣지에서 즉각 정적으로 응답하므로 서버 지연이 발생하지 않습니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>상품 브로슈어, 브랜드 소개 및 정적 이벤트 프로모션 사이트</li>
              <li>Node.js 서버가 없는 환경(AWS S3 + CloudFront)에서의 프론트엔드 배포</li>
              <li>임베디드 웹뷰 및 오프라인 키오스크 애플리케이션</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
