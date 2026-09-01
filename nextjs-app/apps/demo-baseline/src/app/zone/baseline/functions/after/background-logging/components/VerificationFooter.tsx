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

  const defaultExpected = "• after() 백그라운드 주문 로깅의 동작과 기대 결과를 확인합니다."
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
        title="after() 백그라운드 주문 로깅 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
            <DemoDeepDiveCard title="after() 백그라운드 감사 로깅 및 APM 텔레메트리">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>after()</code>를 활용하여 API 호출 및 Server Action의 실행 결과, 파라미터 해시, 시스템 성능 메트릭을 클라이언트 응답 블로킹 없이 백그라운드 로깅 서버(Datadog, CloudWatch, Sentry)로 전송합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 중요 관리자 권한 변경 요청을 처리한 후, <code>after()</code> 콜백 내에서 관리자 IP, 변경 전후 스냅샷, 타임스탬프를 조합하여 외부 보안 SIEM 시스템으로 로그를 비동기 전송합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>사용자 요청 처리 속도 극대화</strong>: 로깅 네트워크 I/O 병목을 사용자 렌더링 경로에서 완전히 분리합니다.</li>
              <li><strong>신뢰성 있는 로그 수집</strong>: 서버리스 인스턴스 조기 종료에 따른 로그 유실(Log Loss) 위험을 제거합니다.</li>
              <li><strong>보안 감사 무결성</strong>: 중요한 관리자 조작 기록을 응답 지연 없이 100% 누락 없이 기록합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>개인정보 열람 및 비밀번호 변경 등 민감 보안 작업의 비동기 감사 로깅</li>
              <li>성능 APM 지표(DB 쿼리 시간, 외부 API 레이턴시) 백그라운드 수집</li>
              <li>비정상 트래픽 및 보안 공격 의심 요청의 백그라운드 SIEM 알림</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>에러 핸들링 필수</strong>: <code>after()</code> 내부에서 예외가 발생할 경우 사용자에게는 보이지 않으므로 내부에서 <code>try/catch</code>로 에러를 안전하게 로깅해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
