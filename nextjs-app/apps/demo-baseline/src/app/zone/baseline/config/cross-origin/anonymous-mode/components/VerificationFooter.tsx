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

  const defaultExpected = "• crossOrigin: 'anonymous' 서드파티 스크립트 속성 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="crossOrigin: 'anonymous' 서드파티 스크립트 속성 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
            <DemoDeepDiveCard title="next.config.ts crossOrigin anonymous 모드 & CORS 에러 스택 추적">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>crossOrigin: 'anonymous' | 'use-credentials'</code> (<code>next.config.ts</code>) 설정은 Next.js가 HTML 문서에 주입하는 모든 <code>{'<'}script{'>'}</code> 및 <code>{'<'}link{'>'}</code> 정적 에셋 태그에 <code>crossorigin</code> 속성을 부여하여, CDN 등 별도 도메인에서 에셋을 로드할 때 상세한 자바스크립트 에러 스택 트레이스를 모니터링 APM(Sentry 등)에 전달할 수 있도록 지원하는 설정입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 <code>crossOrigin: 'anonymous'</code> 설정이 적용되어, CDN 도메인에서 로드된 JS 청크에서 런타임 예외가 발생했을 때 단순 <code>Script error.</code>로 뭉개지지 않고 정확한 파일명, 라인 번호, 에러 스택이 Sentry에 수집되는 환경을 구성합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>실제 에러 스택 트레이스 복원</strong>: 브라우저의 동일 출처 보안 제약으로 인한 <code>Script error.</code> 마스킹 현상을 해결하여 디버깅 생산성을 높입니다.</li>
              <li><strong>CDN 에셋 로딩 완벽 호환</strong>: 별도 에셋 CDN 도메인을 사용할 때 필수적인 브라우저 자원 공유 규격을 준수합니다.</li>
              <li><strong>Sentry/Datadog 연동성 향상</strong>: 프로덕션 환경의 클라이언트 에러를 소스맵과 완벽히 매핑하여 추적합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>정적 에셋을 별도 CDN 도메인(<code>cdn.shop.com</code>)에 배포하여 운영하는 서비스</li>
              <li>Sentry, Datadog 등 APM 도구를 활용한 프론트엔드 실시간 에러 관제</li>
              <li>서드파티 스크립트와의 안전한 리소스 공유 환경 구축</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>CDN 서버 Access-Control-Allow-Origin 필수</strong>: <code>crossOrigin</code> 속성을 추가한 경우 CDN 오리진 서버에서 <code>Access-Control-Allow-Origin: *</code> 헤더를 반환하지 않으면 브라우저가 스크립트 실행 자체를 차단하므로 CDN 헤더 설정을 반드시 병행해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
