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

  const defaultExpected = "• React experimental_taintObjectReference 비밀키 보호의 동작과 기대 결과를 확인합니다."
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
        title="React experimental_taintObjectReference 비밀키 보호 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
      <DemoDeepDiveCard title="React experimental_taintObjectReference 비밀키 보호">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>React Taint API(<code>experimental_taintObjectReference</code> / <code>experimental_taintUniqueValue</code>)는 서버 시크릿 키나 사용자 비밀번호 등 민감 객체/값을 오염(Tainted) 상태로 등록하여, 클라이언트 컴포넌트의 Props나 Server Action 반환값에 직렬화될 때 빌드/런타임 에러를 발생시키는 원천 차단 표준 API입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 PG사 가맹점 라이브 시크릿 키(<code>sk_live_9a8b7c...</code>)가 담긴 객체를 Taint로 보호하여, 서버 컴포넌트에서 클라이언트 결제 위젯으로 해당 객체를 실수로 전달하려 할 때 React 직렬화 엔진이 이를 감지하고 전송을 즉시 차단합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>금융/인증 시크릿 유출 원천 방지</strong>: 개발자의 단순한 Props 전달 실수로 결제 API 비밀키나 DB 비밀번호가 브라우저 네트워크 탭에 평문 노출되는 사고를 원천 방어합니다.</li>
              <li><strong>심층 객체 탐지(Deep Inspection)</strong>: 원시 문자열뿐만 아니라 객체 내부에 중첩된 프로퍼티까지 React 직렬화 파이프라인에서 전수 검사합니다.</li>
              <li><strong>보안 컴플라이언스 준수</strong>: ISMS-P, PCI-DSS 등 엔터프라이즈 전자금융 보안 규정의 민감정보 노출 방지 요구사항을 만족합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>토스페이먼츠/이니시스 결제 비밀키 및 Webhook HMAC 서명 Secret 보호</li>
              <li>사용자 계정 비밀번호 해시, 주민등록번호, 카드 CVC 등 민감 개인정보 누출 차단</li>
              <li>AWS S3 Private Bucket Access Key 및 외부 결제 Gateway 토큰 보호</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>experimental 플래그 활성화 필요</strong>: <code>next.config.ts</code>에서 <code>experimental.taint: true</code> 설정이 활성화되어 있어야 Taint API가 동작합니다.</li>
              <li><strong>server-only 패키지와 병행 사용 권장</strong>: Taint API는 값의 직렬화 누출을 막으며, 모듈 파일 자체의 클라이언트 임포트를 방지하기 위해서는 <code>import 'server-only'</code>를 함께 사용하는 것이 표준입니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
