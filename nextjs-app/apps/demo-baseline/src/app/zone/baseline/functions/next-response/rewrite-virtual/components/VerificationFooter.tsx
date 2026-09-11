'use client'
import React from 'react'
import { usePathname } from 'next/navigation'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import { TARGET_EVENT_PATH, type RouteAccessMode } from '../types'

interface VerificationFooterProps {
  variant: 'root' | 'result'
  mode?: RouteAccessMode
  originPath?: string | null
}

export function VerificationFooter({ variant, mode = 'direct', originPath = null }: VerificationFooterProps) {
  const actualPathname = usePathname()

  if (variant === 'root') {
    return (
      <div className="space-y-4">
        <ExpectedActualPanel
          title="가상 라우팅 관찰 대기"
          expected="[가상 세일 페이지 입장]을 누르면 주소창이 그대로 유지된 채 실제 이벤트 콘텐츠가 서빙되고, [레거시 상품 링크]를 누르면 주소창이 target-event 실제 경로로 바뀌어야 한다."
          actual={`현재 위치(usePathname): ${actualPathname}\n아직 실습 링크를 클릭하지 않았습니다.`}
          description="아래 [실습 화면]의 두 링크 중 하나를 눌러 실제 브라우저 내비게이션을 발생시켜 보세요."
        />
        <RootDeepDive />
      </div>
    )
  }

  const expectedPathname = mode === 'rewrite' && originPath ? originPath : TARGET_EVENT_PATH
  const isMatched = mode === 'direct' ? undefined : actualPathname === expectedPathname

  const expected =
    mode === 'rewrite'
      ? `NextResponse.rewrite() 적용 → 주소창이 요청 경로(${originPath})를 그대로 유지해야 함`
      : mode === 'redirect'
        ? `NextResponse.redirect() 적용 → 주소창이 실제 목적지(${TARGET_EVENT_PATH})로 변경돼야 함`
        : '이 페이지에 직접 접근했습니다 (rewrite/redirect를 거치지 않음)'

  const actual = `usePathname() 실측값: ${actualPathname}${
    mode !== 'direct' ? `\nproxy.ts가 표시한 진입 모드: ${mode}` : ''
  }`

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="rewrite vs redirect 주소창 실측 검증"
        expected={expected}
        actual={actual}
        isMatched={isMatched}
        description="이 화면(target-event/page.tsx)은 rewrite와 redirect 두 경로 모두에서 동일하게 렌더링되는 단 하나의 실제 파일입니다. usePathname()으로 지금 브라우저가 보여주는 실제 주소를 읽어, 프록시가 어떤 방식으로 여기까지 연결했는지에 따라 주소가 유지되는지/바뀌는지를 직접 대조합니다."
      />
      <ResultDeepDive mode={mode} originPath={originPath} />
    </div>
  )
}

function RootDeepDive() {
  return (
    <DemoDeepDiveCard title="NextResponse.rewrite() 가상 라우팅 중계">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">1. 핵심 스펙 및 개념 요약</h5>
          <p>
            <code>NextResponse.rewrite(destination)</code>(<code>next/server</code>)는 브라우저 주소창의 URL은 그대로
            유지한 채, 서버 내부적으로 다른 경로의 콘텐츠를 대신 서빙(프록시)하는 정적 메서드입니다.{' '}
            <code>NextResponse.redirect()</code>가 3xx 응답과 <code>Location</code> 헤더로 브라우저 스스로 새 요청을
            보내게 만드는 것과 달리, rewrite는 서버가 내부적으로만 목적지를 바꿔 처리하므로 클라이언트는 원래
            요청한 URL을 벗어난 적이 없다고 인식합니다.
          </p>
        </div>
        <div>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">2. Proxy(Middleware) 전용 API</h5>
          <p>
            이 프로젝트의 기준 버전(Next.js 16.3.2)에서 <code>NextResponse.rewrite()</code>는 <code>src/proxy.ts</code>
            (Proxy, 과거의 Middleware) 안에서만 실제로 동작합니다. App Router Route Handler(<code>route.ts</code>)
            안에서 반환하면 프레임워크가 즉시 런타임 에러로 막습니다 — 이 저장소에서 직접 실측한 에러 메시지는
            다음과 같습니다: <code>&quot;NextResponse.rewrite() was used in a app route handler, this is not
            currently supported.&quot;</code>
          </p>
        </div>
        <div>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">3. 실무적 장점 (Why Use This)</h5>
          <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
            <li>
              <strong>사용자 친화적 단축 URL</strong>: 복잡한 내부 구조를 숨기고 깔끔한 가상 URL을 그대로 보여줍니다.
            </li>
            <li>
              <strong>A/B 테스트 및 카나리 배포</strong>: 동일한 URL에서 사용자 그룹에 따라 다른 내부 경로로
              무중단 분기합니다.
            </li>
            <li>
              <strong>멀티 테넌트 매핑</strong>: <code>tenant1.app.com</code> 요청을 내부 <code>/_tenants/tenant1</code>
              경로로 URL 변경 없이 렌더링합니다.
            </li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}

function ResultDeepDive({ mode, originPath }: { mode: RouteAccessMode; originPath: string | null }) {
  return (
    <DemoDeepDiveCard title="지금 이 화면이 도착한 방식">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">1. 이 데모의 검증 방식</h5>
          <p>
            <code>rewrite-virtual/page.tsx</code>에서 링크를 클릭하면 <code>proxy.ts</code>가 <code>?scenario=</code>
            쿼리를 읽어 분기합니다. rewrite 시나리오는 요청 헤더에 <code>x-rewrite-origin</code>을 실어 이
            페이지(<code>target-event/page.tsx</code>)를 내부적으로 렌더링하고, redirect 시나리오는 실제 307
            응답으로 브라우저를 이 경로로 새로 이동시킵니다. 이 화면은 <code>usePathname()</code>(
            <code>next/navigation</code>)으로 지금 브라우저가 실제로 보여주는 주소를 읽어, 위 [검증] 패널에서
            기대값과 그대로 대조합니다.
          </p>
        </div>
        <div>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">2. 지금 관찰된 것</h5>
          <p>
            {mode === 'rewrite' && (
              <>
                주소창이 <code>{originPath}</code>로 유지된 채 이 target-event 콘텐츠가 보이고 있다면, rewrite가
                실제로 내부 프록시 역할을 수행했다는 뜻입니다 — 브라우저는 <code>/target-event</code>라는 경로가
                존재한다는 사실조차 알지 못합니다.
              </>
            )}
            {mode === 'redirect' && (
              <>
                주소창이 <code>/target-event</code>로 바뀌어 있다면, redirect가 브라우저에게 &quot;새 URL로
                다시 요청하라&quot;고 지시했고 브라우저가 그 지시를 그대로 따랐다는 뜻입니다. 서버 관점에서는
                완전히 새로운 요청입니다.
              </>
            )}
            {mode === 'direct' && (
              <>이 페이지에 rewrite/redirect 없이 직접 접근했습니다 — 이 경우는 그냥 실제 파일 경로 그대로입니다.</>
            )}
          </p>
        </div>
        <div>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">3. 실무 주의사항</h5>
          <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
            <li>
              <strong>정적 자산 상대 경로</strong>: rewrite로 도착한 페이지의 CSS/이미지가 상대 경로를 쓰면 원래
              요청 경로 기준으로 어긋날 수 있어 절대 경로(<code>/images/...</code>)를 써야 합니다.
            </li>
            <li>
              <strong>헤더 전달 비대칭</strong>: rewrite는 <code>{'{ request: { headers } }'}</code> 옵션으로
              프록시가 만든 커스텀 헤더를 목적지까지 그대로 전달할 수 있지만(이 데모의 <code>x-rewrite-origin</code>
              이 그 예), redirect는 브라우저가 새로 보내는 요청이라 그런 헤더가 전달되지 않습니다 — 대신 쿼리
              파라미터처럼 URL에 남는 정보만 전달됩니다.
            </li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
