'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export interface VerificationFooterProps {
  isMatched: boolean
  expected: string
  actual: string
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="mt-1.5 overflow-x-auto rounded-md bg-zinc-950 p-3 text-[11px] leading-relaxed text-zinc-100 dark:bg-black">
      <code>{code}</code>
    </pre>
  )
}

const PAGE_TSX_SNIPPET = [
  "const headersList = await headers()",
  "const authorizationHeader = headersList.get('authorization')",
  "",
  "// 인입된 요청에서 읽은 값을 그대로 주문 조회 함수에 넘긴다",
  "const result = await fetchOrdersWithAuthorization(authorizationHeader)",
].join('\n')

const PROXY_TS_SNIPPET = [
  "// apps/demo-baseline/src/proxy.ts",
  "if (pathname.includes('/functions/headers/custom-auth-token')) {",
  "  const sessionToken = request.cookies.get('demo_headers_auth_token')?.value",
  "  if (sessionToken) {",
  "    const requestHeaders = new Headers(request.headers)",
  "    requestHeaders.set('authorization', `Bearer ${sessionToken}`)",
  "    return NextResponse.next({ request: { headers: requestHeaders } })",
  "  }",
  "  return NextResponse.next()",
  "}",
].join('\n')

const ORDERS_TS_SNIPPET = [
  "// orders.ts",
  "export async function fetchOrdersWithAuthorization(authorizationHeader: string | null) {",
  "  if (!authorizationHeader?.startsWith('Bearer ')) {",
  "    return { status: 401, authorizationReceived: authorizationHeader }",
  "  }",
  "  const token = authorizationHeader.slice('Bearer '.length)",
  "  if (token !== VALID_SESSION_TOKEN) {",
  "    return { status: 401, authorizationReceived: authorizationHeader }",
  "  }",
  "  return { status: 200, authorizationReceived: authorizationHeader, orders: MOCK_ORDERS }",
  "}",
].join('\n')

export function VerificationFooter({ isMatched, expected, actual }: VerificationFooterProps) {
  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="Authorization 헤더 포워딩 무결성 검증"
        expected={expected}
        actual={actual}
        isMatched={isMatched}
        description="headers()로 읽은 원본 값이 변형 없이 주문 조회 함수까지 전달되는지, 그리고 유효 토큰 여부에 따라 상태 코드가 올바르게 갈리는지 확인합니다."
      />
      <DemoDeepDiveCard title="headers() 를 이용한 Authorization 헤더 포워딩">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>headers()</code>(<code>next/headers</code>)는 Server Component, Server Action, Route Handler에서 인입된 HTTP 요청 헤더를 읽는 비동기 함수(Next.js 15+ <code>await headers()</code>)다. 반환값은 읽기 전용 Web Headers 인스턴스이며, 호출 시 해당 라우트는 다이나믹 렌더링으로 전환된다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 이번 예제의 실제 동작</h5>
            <p>
              브라우저는 페이지 이동 시 커스텀 <code>Authorization</code> 헤더를 자동으로 실어 보내지 않는다. 그래서 [로그인]을 누르면 먼저 실제 쿠키(<code>demo_headers_auth_token</code>)를 발급하고, 이후 요청부터는 브라우저가 그 쿠키를 자동으로 실어 보낸다. <code>proxy.ts</code>가 이 쿠키를 읽어 <code>Authorization: Bearer &lt;token&gt;</code> 요청 헤더로 바꿔 넘겨주면, 서버 컴포넌트가 <code>(await headers()).get(&apos;authorization&apos;)</code>으로 그 값을 읽어 주문 조회 함수에 그대로 전달한다. 위 [검증] 패널의 <em>Actual</em>이 매번 실제 헤더 값·전달값·상태 코드를 그대로 보여준다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실제 코드</h5>
            <p>이 페이지가 실제로 실행하는 코드를 그대로 발췌했다. 위 [로그인]/[토큰 변조]/[로그아웃]을 누를 때마다 이 세 코드가 순서대로 실행된다.</p>

            <p className="mt-2.5 font-semibold text-zinc-800 dark:text-zinc-200">① 서버 컴포넌트 — headers()로 읽어서 그대로 전달</p>
            <CodeBlock code={PAGE_TSX_SNIPPET} />

            <p className="mt-2.5 font-semibold text-zinc-800 dark:text-zinc-200">② 게이트웨이(proxy.ts) — 세션 쿠키를 Authorization 헤더로 변환</p>
            <CodeBlock code={PROXY_TS_SNIPPET} />

            <p className="mt-2.5 font-semibold text-zinc-800 dark:text-zinc-200">③ 데이터 조회 함수 — 전달받은 헤더 값으로 인증 판정</p>
            <CodeBlock code={ORDERS_TS_SNIPPET} />
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>인증 로직이 데이터 조회 함수 안으로 들어간다</strong>: 호출하는 쪽은 인증을 신경 쓰지 않고 데이터만 요청하면 되며, 헤더 추출·전달은 조회 함수 내부에 캡슐화된다.</li>
              <li><strong>마이크로서비스/BFF 인증 전파</strong>: 게이트웨이가 세션을 표준 <code>Authorization</code> 헤더로 정규화해두면, 내부 서비스들은 쿠키 형식을 몰라도 된다.</li>
              <li><strong>읽기 전용 안정성</strong>: <code>headers()</code>는 값을 바꿀 수 없어 요청 헤더를 실수로 오염시키는 부수 효과가 없다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>API 게이트웨이가 발급한 Bearer 토큰을 내부 서비스 호출에 그대로 전달할 때</li>
              <li><code>x-forwarded-for</code>, <code>x-correlation-id</code> 등 프록시가 주입한 추적 헤더를 서버 컴포넌트에서 읽어야 할 때</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">6. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>Client Component에서 직접 사용 불가</strong>: <code>next/headers</code>를 가져오는 파일은 Client Component 트리에 포함될 수 없다. 실제로 시도하면 <code>&quot;You&apos;re importing a component that needs next/headers. That only works in a Server Component...&quot;</code> 에러로 빌드가 즉시 실패한다. 이 에러는 다른 데모까지 깨뜨릴 수 있어 이 페이지에서 실제로 재현하지는 않았다.</li>
              <li><strong>이 데모는 네트워크 호출 대신 함수 호출을 쓴다</strong>: 공식 문서 예제는 추출한 헤더를 <code>fetch()</code>로 외부 API에 전달하지만, 이 zone은 셸의 rewrite 뒤에 있어 서버 컴포넌트가 자기 자신을 절대 URL로 다시 호출하는 것이 이 데모의 학습 목표와 무관하게 취약하다. 그래서 <code>fetchOrdersWithAuthorization()</code>이라는 같은 프로세스 내 함수로 &quot;백엔드 조회&quot;를 대신하되, <code>headers()</code>로 읽은 값을 그 함수에 그대로 넘기는 핵심 동작은 그대로 실행한다.</li>
              <li><strong>응답 헤더는 여기서 설정할 수 없다</strong>: <code>headers()</code>는 읽기 전용이며, 응답 헤더를 바꾸려면 <code>NextResponse</code>나 <code>proxy.ts</code>를 사용해야 한다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
