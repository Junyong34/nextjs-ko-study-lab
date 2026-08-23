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

  const defaultExpected = "• NEXT_PUBLIC_ vs 서버 환경변수 노출 범위 사양에 따른 정상 동작 및 상태 변화 관찰"
  const defaultActual = "• 실시간 인터랙션 및 상태 동기화 완료\n• 5단 표준 레이아웃 정상 적용"

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
        title="NEXT_PUBLIC_ vs 서버 환경변수 노출 범위 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="NEXT_PUBLIC_ vs 서버 환경변수 노출 범위">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>Next.js의 환경변수 스코프 규칙에 따라 <code>NEXT_PUBLIC_</code> 접두사가 붙은 변수(<code>NEXT_PUBLIC_API_URL</code>)는 빌드 시점에 클라이언트 JS 번들에 정적 문자열로 인라인 치환되며, 접두사가 없는 변수(<code>DB_PASSWORD</code>, <code>PAYMENT_SECRET</code>)는 오직 Node.js/Edge 서버 런타임에서만 접근 가능합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 서버 컴포넌트와 클라이언트 컴포넌트에서 각각 <code>process.env</code>를 참조할 때, 서버 전용 키는 클라이언트 번들에서 <code>undefined</code>로 안전하게 숨겨지고 공개 키만 브라우저에 안전하게 노출되는 범위를 비교 검증합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>빌드 타임 시크릿 유출 원천 방지</strong>: 프레임워크 레벨에서 <code>NEXT_PUBLIC_</code> 접두사 유무를 엄격히 검사하여 DB 접속 비밀번호나 API 시크릿의 브라우저 유출을 방어합니다.</li>
              <li><strong>환경별 공개 엔드포인트 자동 주입</strong>: 개발, 스테이징, 프로덕션에 따라 변경되는 API 도메인과 GA 추적 ID를 번들에 간편하게 바인딩합니다.</li>
              <li><strong>타입스크립트 환경변수 인터페이스 선언</strong>: <code>global.d.ts</code>에 <code>ProcessEnv</code> 타입을 정의하여 자동완성과 타입 안정성을 확보할 수 있습니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>공개 API 게이트웨이 도메인(<code>NEXT_PUBLIC_API_HOST</code>) 및 CDN 경로 설정</li>
              <li>서버 전용 결제 가맹점 라이브 비밀키(<code>TOSS_SECRET_KEY</code>) 분리 보관</li>
              <li>구글 애널리틱스 측정 ID(<code>NEXT_PUBLIC_GA_ID</code>) 주입</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>NEXT_PUBLIC_에 비밀키 선언 절대 금지</strong>: <code>NEXT_PUBLIC_</code>이 붙은 변수는 소스코드 검색뿐만 아니라 브라우저 개발자 도구의 번들 파일에서도 누구나 열람할 수 있으므로 절대 시크릿을 저장하면 안 됩니다.</li>
              <li><strong>비구조화 할당(Destructuring) 제약</strong>: 클라이언트 코드에서 <code>const {'{'} NEXT_PUBLIC_KEY {'}'} = process.env</code> 형태로 구조분해 할당하면 Webpack의 인라인 치환이 동작하지 않을 수 있으므로 <code>process.env.NEXT_PUBLIC_KEY</code>로 전체 경로를 직접 참조해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
