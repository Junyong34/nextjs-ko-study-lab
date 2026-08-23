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

  const defaultExpected = "• env 필드를 통한 빌드 타임 환경변수 주입 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="env 필드를 통한 빌드 타임 환경변수 주입 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="next.config.ts env 빌드 타임 인라인 주입 & 환경변수 보안 격리 원칙">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>next.config.ts</code>의 <code>env</code> 객체는 빌드(컴파일) 시점에 코드 내 <code>process.env.KEY</code> 참조를 정적 문자열로 직접 치환(Inlining)하여 클라이언트 및 서버 번들에 주입하는 빌드 설정 스펙입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 <code>env: {'{'} NEXT_PUBLIC_SHOP_API_HOST: 'https://api.shop.com' {'}'}</code>와 같이 빌드 시점에 상수를 매핑하여 런타임 <code>process.env</code> 접근 오버헤드 없이 즉시 브라우저와 서버 컴포넌트에서 동일한 API 호스트 값을 참조하도록 구성합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>런타임 제로 오버헤드</strong>: 빌드 시점에 원시 문자열로 직접 치환되므로 런타임 환경변수 파싱 및 조회 비용이 발생하지 않습니다.</li>
              <li><strong>빌드 타임 상수화</strong>: 번들러가 미사용 코드(Dead Code)를 트리쉐이킹(Tree-shaking)할 수 있도록 정적 상수 플래그를 제공합니다.</li>
              <li><strong>배포 환경별 설정 주입</strong>: CI/CD 빌드 파이프라인에서 빌드 버전 번호, 배포 타임스탬프 등을 번들에 영구 각인합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>앱 릴리즈 버전 번호(<code>APP_VERSION</code>) 및 빌드 해시의 정적 표시</li>
              <li>공개 API 게이트웨이 엔드포인트 및 CDN 정적 에셋 도메인 기본값 매핑</li>
              <li>빌드 타임 기능 플래그(Feature Flags)의 불리언 상수화</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>시크릿 키 등록 절대 금지 (보안 위험)</strong>: <code>next.config.ts</code>의 <code>env</code>에 선언된 모든 변수는 클라이언트 자바스크립트 번들에 그대로 포함되므로, DB 비밀번호나 결제 Private Key를 여기에 절대 선언해서는 안 됩니다.</li>
              <li><strong>진정한 시크릿 분리 원칙</strong>: 비밀 키는 <code>NEXT_PUBLIC_</code> 접두사가 없는 <code>.env.local</code>에 두고 서버 컴포넌트/Route Handler에서만 접근하며, <code>import 'server-only'</code> 및 React 19 Taint API로 보호해야 합니다.</li>
              <li><strong>Docker 이미지 승격 제약</strong>: 빌드 타임에 인라인 치환되므로, 단일 Docker 이미지를 Staging에서 Production으로 환경변수만 바꿔 승격하는 구조에서는 런타임 환경변수(Node.js process.env) 방식을 사용해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
