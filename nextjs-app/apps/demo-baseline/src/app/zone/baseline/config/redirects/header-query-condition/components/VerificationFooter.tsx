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

  const defaultExpected = "• redirects() 요청 헤더 및 쿼리 기반 조건부 리다이렉트의 동작과 기대 결과를 확인합니다."
  const defaultActual = "• 사용자 조작 후 실제 결과를 표시합니다."

  const actualContent =
    propActual !== undefined
      ? propActual
      : isMatched === true
      ? defaultActual
      : isMatched === false
      ? '• 상호작용 실패 또는 불일치가 확인되었습니다. 동작을 다시 확인해 주세요.'
      : '• 상호작용 대기 중 (상단 예제의 조작 요소를 실행해 결과를 확인해 주세요.)'

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="redirects() 요청 헤더 및 쿼리 기반 조건부 리다이렉트 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
      <DemoDeepDiveCard title="next.config.ts redirects() 헤더 및 쿼리 조건부 리다이렉트 (has/missing)">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>next.config.ts</code>의 <code>redirects()</code> 규칙 내 <code>has</code> 및 <code>missing</code> 배열은 HTTP 헤더(<code>header</code>), 쿠키(<code>cookie</code>), 쿼리 스트링(<code>query</code>), 호스트명(<code>host</code>) 조건을 정밀하게 검사하여 조건이 일치할 때만 리다이렉트를 발동시키는 표준 설정 스펙입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 요청에 <code>x-legacy-client: true</code> 헤더나 <code>?view=old</code> 쿼리가 포함된 경우(<code>has</code>), 또는 최신 인증 쿠키가 누락된 경우(<code>missing</code>)를 감지하여 적절한 레거시 호환 페이지나 로그인 안내 경로로 즉시 라우팅합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>클라이언트별 지능형 분기</strong>: 모바일 앱 버전(헤더 검사)이나 마케팅 유입 출처(쿼리 검사)에 따라 서버 렌더링 전 사전 분기합니다.</li>
              <li><strong>미들웨어 부하 절감</strong>: 복잡한 Edge 미들웨어 코드를 작성하지 않고도 선언적 설정만으로 다수의 헤더/쿠키 라우팅 룰을 고속 처리합니다.</li>
              <li><strong>안전한 카나리 배포</strong>: 특정 사내 테스트 쿠키를 보유한 사용자만 신규 기능 프리뷰 경로로 유도할 수 있습니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>구형 네이티브 앱(<code>User-Agent</code> 또는 커스텀 헤더) 사용자의 강제 앱 업데이트 안내 페이지 리다이렉트</li>
              <li>마케팅 캠페인 쿼리(<code>?utm_source=partner_a</code>) 유입 고객의 전용 프로모션 랜딩 분기</li>
              <li>지역별 서브도메인(<code>host: us.shop.com</code>) 요청의 글로벌 통화 전용 스토어로의 분기</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>has 조건의 AND 결합</strong>: <code>has</code> 배열 내에 여러 항목을 정의하면 모든 조건이 동시에 참(AND)이어야 리다이렉트가 발동하므로, OR 조건이 필요한 경우 규칙 객체를 분리해야 합니다.</li>
              <li><strong>캡처 변수 활용</strong>: 헤더나 쿼리의 정규식 매치값을 <code>key: 'value'</code> 형태로 캡처하여 <code>destination: '/dest/:value'</code>와 같이 대상 URL에 동적으로 전달할 수 있습니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
