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

  const defaultExpected = "• Server Actions 자동 CSRF Origin 헤더 검증의 동작과 기대 결과를 확인합니다."
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
        title="Server Actions 자동 CSRF Origin 헤더 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
      <DemoDeepDiveCard title="Server Actions 자동 CSRF Origin 헤더 검증">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>Next.js Server Actions의 빌트인 CSRF 방어 메커니즘은 모든 액션 요청 시 HTTP <code>Origin</code> 헤더와 <code>Host</code>(또는 <code>X-Forwarded-Host</code>) 헤더를 엄격하게 비교 검증하고, 오직 <code>POST</code> 메서드와 프레임워크가 생성한 고유 Action ID만을 허용하여 제3자 사이트로부터의 교차 사이트 요청 위조(CSRF) 공격을 원천 차단하는 보안 아키텍처입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 정상 도메인(<code>localhost:3000</code>)에서의 Server Action 호출은 승인되는 반면, 악의적인 외부 피싱 사이트(<code>attacker-site.com</code>)에서 전송된 <code>Origin</code> 불일치 요청은 Next.js 보안 계층에서 즉시 403 Forbidden으로 거부되는 과정을 시뮬레이션합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>CSRF 토큰 발급/검증 보일러플레이트 제거</strong>: 별도의 숨겨진 CSRF 토큰(Hidden Token) 발급 및 쿠키 동기화 로직 없이 프레임워크가 100% 자동으로 요청 무결성을 보장합니다.</li>
              <li><strong>암호화된 고유 Action ID 바인딩</strong>: 각 Server Action 함수는 빌드 시 16진수 해시 ID로 매핑되어 임의의 서버 엔드포인트 조작을 방지합니다.</li>
              <li><strong>SameSite 쿠키와의 이중 방어</strong>: 브라우저의 <code>SameSite=Lax/Strict</code> 쿠키 정책과 결합하여 완벽한 다층 보안 체계를 수립합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>전자상거래 결제 승인, 주문 취소 및 환불 요청 Server Action</li>
              <li>사용자 비밀번호 변경, 회원 탈퇴 및 이메일 주소 수정 폼</li>
              <li>관리자 권한 변경 및 파트너 정산 계좌 등록 액션</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>allowedOrigins 설정 구성</strong>: 리버스 프록시(Nginx/Cloudflare)나 다중 도메인 환경에서 <code>Host</code> 헤더가 변경되는 경우 <code>next.config.ts</code>의 <code>experimental.serverActions.allowedOrigins</code> 배열에 허용 도메인을 등록해야 오작동을 방지할 수 있습니다.</li>
              <li><strong>GET 메서드 지원 불가</strong>: Server Actions는 CSRF 보안 규격에 따라 오직 <code>POST</code> 요청으로만 트리거될 수 있으며 <code>GET</code> 링크로는 호출할 수 없습니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
