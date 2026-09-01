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

  const defaultExpected = "• 상품 클릭 커스텀 이벤트 비콘 전송의 동작과 기대 결과를 확인합니다."
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
        title="상품 클릭 커스텀 이벤트 비콘 전송 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
      <DemoDeepDiveCard title="상품 클릭 커스텀 이벤트 비콘 전송">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>navigator.sendBeacon()</code> 기반의 커스텀 애널리틱스 비콘은 사용자가 페이지를 이탈하거나 다른 링크로 이동하는 순간에도 네트워크 요청이 취소되지 않고, 브라우저 백그라운드 프로세스를 통해 로그 수집 서버로 비동기 전송되는 원격 계측 표준 API입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 사용자가 추천 상품 배너를 클릭하거나 장바구니 담기 버튼을 누를 때 <code>sendBeacon('/api/analytics/click', payload)</code>를 호출하여, UI 반응 지연 없이 로그 페이로드가 서버로 전송되는 과정을 실시간 로그 뷰어로 확인합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>페이지 이탈 시 데이터 유실률 0%</strong>: 일반 <code>fetch</code>와 달리 탭 닫기나 빠른 페이지 전환 중에도 브라우저가 전송 완료를 보장하여 클릭 로그 유실을 방지합니다.</li>
              <li><strong>메인 스레드 비차단(Non-blocking)</strong>: 비콘 전송은 백그라운드 큐에서 비동기로 처리되므로 UI 애니메이션이나 페이지 전환을 전혀 방해하지 않습니다.</li>
              <li><strong>네트워크 리소스 최적화</strong>: 소량의 JSON/텍스트 페이로드를 POST 요청으로 전송하여 불필요한 브라우저 핸드셰이크를 최소화합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>쇼핑몰 추천 상품 배너 클릭 및 노출(Impression) 로그 수집</li>
              <li>결제 단계 이탈 지점 및 장바구니 체류 시간 추적</li>
              <li>Next.js <code>useReportWebVitals</code> 성능 메트릭(CLS, LCP, INP) 로그 원격 전송</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>페이로드 크기 64KB 제한</strong>: <code>navigator.sendBeacon()</code>은 브라우저 규격상 한 번에 최대 64KB까지만 전송 가능하므로 대용량 데이터는 청크로 분할해야 합니다.</li>
              <li><strong>브라우저 지원 여부 폴백</strong>: 구형 브라우저 환경을 대비하여 <code>navigator.sendBeacon</code>이 없을 경우 <code>fetch(url, {'{'} keepalive: true {'}'})</code>로 폴백 처리해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
