'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export interface VerificationFooterProps {
  isMatched?: boolean
  expected?: React.ReactNode
  actual?: React.ReactNode
  description?: string
}

export function VerificationFooter({
  isMatched,
  expected,
  actual,
  description,
}: VerificationFooterProps = {}) {
  const defaultExpected =
    '• 역할 버튼을 선택하면 cookies().set()이 session-token(httpOnly)과 user-role 쿠키를 실제로 발급합니다.'
  const defaultActual = '• 상호작용 대기 중 (상단 예제에서 역할 버튼을 눌러 결과를 확인해 주세요.)'

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="cookies().get() 읽기 & cookies().set() 세션 쿠키 발급 검증 결과"
        expected={expected || defaultExpected}
        actual={actual || defaultActual}
        isMatched={isMatched}
        description={description || '서버가 실제로 읽은 쿠키 값과 브라우저 JS가 document.cookie로 읽을 수 있는 값을 대조합니다.'}
      />
      <DemoDeepDiveCard title="cookies() 세션 쿠키 읽기/쓰기 및 만료 수명 제어">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>cookies()</code> (<code>next/headers</code>)는 Next.js 15부터 <strong>비동기 함수</strong>로 바뀌어
              <code>await cookies()</code>로 호출해야 합니다. <code>get()</code>/<code>getAll()</code>/<code>has()</code>로 읽고,
              <code>set()</code>/<code>delete()</code>로 쓰는데, 쓰기는 <strong>Server Action 또는 Route Handler</strong>에서만
              가능합니다 — 스트리밍이 시작된 뒤에는 HTTP 스펙상 Set-Cookie 헤더를 보낼 수 없기 때문입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              역할 버튼을 클릭하면 Server Action <code>issueSessionAction</code>이{' '}
              <code>(await cookies()).set(&apos;session-token&apos;, jwt, {'{'} httpOnly: true {'}'})</code>와{' '}
              <code>(await cookies()).set(&apos;user-role&apos;, role)</code>을 실제로 호출합니다. 응답에 담긴 Set-Cookie
              헤더 2개를 브라우저가 실제로 저장하고, 페이지가 다시 렌더링될 때 서버 컴포넌트가{' '}
              <code>(await cookies()).get()</code>으로 그 값을 그대로 읽어옵니다. 동시에 브라우저 JS의{' '}
              <code>document.cookie</code>를 직접 스캔해, httpOnly 쿠키(session-token)는 보이지 않고 일반 쿠키(user-role)만
              보이는 것을 실제로 확인합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>XSS 공격 방어</strong>: <code>httpOnly: true</code> 쿠키는 악성 스크립트가 <code>document.cookie</code>로 세션 토큰을 탈취하는 것을 원천 차단합니다.</li>
              <li><strong>CSRF 방어 강화</strong>: <code>sameSite: &apos;lax&apos; | &apos;strict&apos;</code> 설정으로 타 사이트에서의 위조 요청을 방어합니다.</li>
              <li><strong>선언적 수명 관리</strong>: <code>maxAge</code>로 자동 만료되는 세션/장바구니 쿠키를 손쉽게 구성합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>사용자 로그인 인증 JWT 세션 토큰 발급 및 만료 제어</li>
              <li>비회원 사용자의 임시 장바구니 ID 쿠키 바인딩</li>
              <li>다크모드/라이트모드 및 최근 본 상품 ID 목록의 쿠키 저장</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>Server Component 쓰기 제한</strong>: Server Component 본문에서는 쿠키 읽기만 가능하며, <code>set()</code>/<code>delete()</code>는 Server Action 또는 Route Handler에서만 호출할 수 있습니다.</li>
              <li><strong>동적 렌더링 전환</strong>: <code>cookies()</code>를 읽는 라우트는 요청별로 값이 달라지므로 동적(Dynamic) 렌더링으로 처리됩니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
