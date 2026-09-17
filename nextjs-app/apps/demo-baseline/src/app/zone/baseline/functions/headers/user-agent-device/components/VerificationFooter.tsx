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
  "const userAgent = headersList.get('user-agent') ?? ''",
  "const deviceType = detectDeviceType(userAgent)",
].join('\n')

const PROXY_TS_SNIPPET = [
  '// apps/demo-baseline/src/proxy.ts',
  "if (pathname.includes('/functions/headers/user-agent-device')) {",
  "  const forcedDevice = url.searchParams.get('device')",
  "  if (forcedDevice === 'mobile' || forcedDevice === 'desktop') {",
  '    const requestHeaders = new Headers(request.headers)',
  "    requestHeaders.set('user-agent', DEVICE_USER_AGENTS[forcedDevice])",
  '    return NextResponse.next({ request: { headers: requestHeaders } })',
  '  }',
  '  return NextResponse.next()',
  '}',
].join('\n')

const DEVICE_DETECTION_SNIPPET = [
  '// deviceDetection.ts',
  'export const MOBILE_UA_PATTERN = /Mobile|Android|iPhone|iPad/i',
  '',
  'export function detectDeviceType(userAgent: string) {',
  "  return MOBILE_UA_PATTERN.test(userAgent) ? 'mobile' : 'desktop'",
  '}',
].join('\n')

export function VerificationFooter({ isMatched, expected, actual }: VerificationFooterProps) {
  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="User-Agent 판별 무결성 검증"
        expected={expected}
        actual={actual}
        isMatched={isMatched}
        description="headers()로 읽은 User-Agent 원문과, 그 값으로 판별한 기기 타입이 서로 논리적으로 일치하는지 확인합니다."
      />
      <DemoDeepDiveCard title="headers() 를 이용한 User-Agent 기기 판별">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>headers()</code>(<code>next/headers</code>)는 Server Component에서 인입된 HTTP 요청 헤더를 읽는 비동기 함수다. <code>user-agent</code>는 브라우저가 모든 요청에 항상 실어 보내는 표준 헤더라서, 별도의 로그인이나 쿠키 없이도 서버가 실제로 받은 값을 그대로 관찰할 수 있다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 이번 예제의 실제 동작</h5>
            <p>
              [모바일로 보기]/[데스크톱으로 보기]를 누르면 URL에 <code>?device=</code> 쿼리가 붙어 다시 요청이 일어난다. <code>proxy.ts</code>가 이 쿼리를 보고 실제 요청의 <code>User-Agent</code> 헤더를 해당 기기의 진짜 User-Agent 문자열로 바꿔 넘긴다. 서버 컴포넌트는 <code>(await headers()).get(&apos;user-agent&apos;)</code>로 그 값을 그대로 읽어 <code>detectDeviceType()</code>에 넘기고, 그 결과로 위 [실습 화면]의 모바일/데스크톱 뷰가 갈린다. [실제 브라우저 값 사용]을 누르면 헤더를 건드리지 않아 지금 쓰고 있는 실제 브라우저의 User-Agent가 그대로 읽힌다 — 크롬 개발자 도구의 기기 툴바로 실제 User-Agent를 바꿔도 똑같이 동작한다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실제 코드</h5>
            <p>이 페이지가 실제로 실행하는 코드를 그대로 발췌했다. [모바일로 보기]/[데스크톱으로 보기]/[실제 브라우저 값 사용]을 누를 때마다 이 세 코드가 순서대로 실행된다.</p>

            <p className="mt-2.5 font-semibold text-zinc-800 dark:text-zinc-200">① 게이트웨이(proxy.ts) — 쿼리로 지정한 기기의 실제 User-Agent로 교체</p>
            <CodeBlock code={PROXY_TS_SNIPPET} />

            <p className="mt-2.5 font-semibold text-zinc-800 dark:text-zinc-200">② 서버 컴포넌트 — headers()로 읽어서 판별 함수에 그대로 전달</p>
            <CodeBlock code={PAGE_TSX_SNIPPET} />

            <p className="mt-2.5 font-semibold text-zinc-800 dark:text-zinc-200">③ 판별 함수 — 전달받은 값만으로 기기 타입 결정</p>
            <CodeBlock code={DEVICE_DETECTION_SNIPPET} />
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>Zero CLS 디바이스 최적화</strong>: 클라이언트에서 하이드레이션 후 화면이 바뀌는 레이아웃 이동 없이, 첫 HTML 응답부터 기기에 맞는 뷰가 그려진다.</li>
              <li><strong>클라이언트 JS 불필요</strong>: 이 예제의 실습 화면(<code>HeadersUserAgentDemo</code>)은 <code>&apos;use client&apos;</code>가 없다 — 뷰 전환이 전부 서버에서 결정되기 때문이다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>모바일/데스크톱 뷰포트별 적응형 레이아웃 사전 렌더링</li>
              <li>봇/크롤러(Googlebot 등) 감지 시 맞춤 SEO 콘텐츠 렌더링</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">6. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>다이나믹 렌더링 전환</strong>: <code>headers()</code> 호출은 요청 시점에만 알 수 있는 값을 읽으므로 이 라우트는 정적 생성 없이 항상 다이나믹 렌더링으로 처리된다.</li>
              <li><strong>User-Agent 문자열은 스푸핑 가능</strong>: 클라이언트가 값을 자유롭게 바꿔 보낼 수 있으므로, 보안이 걸린 판단(예: 결제 승인)에는 쓰지 않고 UI/UX 최적화 용도로만 쓴다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
