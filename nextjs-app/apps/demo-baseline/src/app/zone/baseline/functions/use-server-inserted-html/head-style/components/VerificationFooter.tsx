'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export interface VerificationFooterProps {
  isMatched?: boolean
  expected?: React.ReactNode
  actual?: React.ReactNode
}

export function VerificationFooter({ isMatched, expected, actual }: VerificationFooterProps = {}) {
  const defaultExpected =
    '• with-hook 라우트의 원본 응답에는 </head> 앞에 <style data-demo-registry="active">가 있고, without-hook 라우트에는 없어야 한다.'
  const defaultActual = '• 상호작용 대기 중 (위에서 "두 라우트 실제 SSR 응답 비교" 버튼을 눌러 확인하세요.)'

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="useServerInsertedHTML 원본 SSR 응답 검증 결과"
        expected={expected || defaultExpected}
        actual={actual || defaultActual}
        isMatched={isMatched}
        description="두 라우트에 대한 Node http 실제 요청 결과를 정규식으로 대조합니다."
      />
      <DemoDeepDiveCard title="useServerInsertedHTML() 서버 삽입 HTML과 CSS-in-JS 스트리밍">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>useServerInsertedHTML()</code> (<code>next/navigation</code>)는 반드시 Client Component에서
              호출해야 하는 훅으로, 인자로 준 콜백이 반환한 React 노드를 서버가 <strong>스트리밍 응답을 플러시할
              때마다</strong> 문자열로 렌더링해 그 자리에 끼워 넣는다. styled-components·styled-jsx 같은
              CSS-in-JS 라이브러리가 렌더 중 수집한 스타일 규칙을 이 훅으로 흘려보내 서버가 보낸 최초 HTML에
              바로 반영되게 만드는 것이 공식 문서의 표준 사용법이다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              이 데모는 실제 라이브러리 대신 <code>StyleRuleRegistry</code>라는 최소 레지스트리를 직접 구현했다.
              <code>ThemeBadge</code>가 렌더링 도중 <code>registry.add()</code>로 CSS 규칙을 등록하면,{' '}
              <code>HookEnabledProvider</code>가 <code>useServerInsertedHTML</code> 콜백에서 <code>registry.flush()</code>
              한 결과를 <code>&lt;style data-demo-registry&gt;</code>로 반환한다. Next.js 소스(
              <code>createHeadInsertionTransformStream</code>)를 직접 확인한 결과, <strong>최초 플러시만 실제로
              &lt;/head&gt; 앞에 삽입되고</strong>, Suspense로 지연된 두 번째 상품 배지가 resolve되며 발생하는 후속
              플러시는 head가 이미 닫힌 뒤라 <strong>해당 스트리밍 청크 바로 앞 body 안에 인라인으로</strong>
              삽입된다 — 위 대조 패널의 "body 인라인 삽입" 칸이 그 두 번째 삽입을 가리킨다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>
                <strong>FOUC 원천 방지</strong>: without-hook 라우트처럼 훅을 빠뜨리면 스타일이 하이드레이션 이후에야
                DOM에 붙어 무스타일 화면이 실제로 노출된다 — 이 데모의 두 라우트 원본 응답 차이가 그 증거다.
              </li>
              <li>
                <strong>스트리밍 SSR 완전 호환</strong>: Suspense 경계마다 새 스타일을 계속 흘려보낼 수 있어, 나중에
                도착하는 컴포넌트의 스타일도 해당 청크와 함께 즉시 적용된다.
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 실무 주의사항 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>Client Component에서만 호출 가능하며, 최초 서버 렌더링(및 재개) 중에만 실행된다.</li>
              <li>
                반환 노드는 부수효과 없는 순수 마크업(<code>&lt;style&gt;</code>/<code>&lt;script&gt;</code>)이어야
                한다 — 등록과 flush 로직은 콜백 밖의 레지스트리 인스턴스가 담당한다.
              </li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
