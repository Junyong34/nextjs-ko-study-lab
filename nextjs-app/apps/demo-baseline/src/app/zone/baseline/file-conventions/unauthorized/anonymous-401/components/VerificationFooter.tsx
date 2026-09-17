import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import type { SessionState } from '../types'

export function VerificationFooter({ currentSession }: { currentSession: SessionState }) {
  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="unauthorized.tsx 파일 배치 규칙 검증 결과"
        expected="같은 unauthorized() 호출이라도, 전용 unauthorized.tsx가 없는 order-history는 상위 anonymous-401/unauthorized.tsx를 렌더링하고, 전용 unauthorized.tsx가 있는 payment-methods는 그 파일을 렌더링한다. 둘 다 실제 HTTP 401이지만 렌더링되는 파일 경로와 문구는 다르다."
        actual={`• 현재 세션 상태(쿠키): ${currentSession.toUpperCase()}\n• 위 [주문 내역 조회 →] / [결제 수단 관리 →]를 각각 눌러 실제 이동 결과를 비교하세요. 두 경로 모두 하단에 실측 상태 코드 패널이 있습니다.`}
        isMatched={undefined}
        description="이 검증은 실제 라우트 이동 이후에 완성됩니다 — unauthorized()는 별도 세그먼트의 렌더링 도중 발생하므로, 지금 이 페이지에서 결과를 미리 보여주지 않습니다."
      />
      <DemoDeepDiveCard title="unauthorized.tsx 파일 컨벤션의 역할과 배치 규칙">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. unauthorized.tsx는 unauthorized()의 UI일 뿐, 위치가 동작을 결정한다</h5>
            <p>
              <code>unauthorized()</code> 자체는 어느 세그먼트에서 호출하든 항상 같은 방식으로{' '}
              <code>NEXT_HTTP_ERROR_FALLBACK;401</code> 예외를 던진다. 실제로 어떤 화면이 뜨는지는 이 예외가 어느{' '}
              <code>unauthorized.tsx</code> 파일에 도달하느냐로 결정된다 — 즉 <strong>파일이 파일 트리 어디에 있는지가
              곧 동작 규칙</strong>이다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 가장 가까운 조상 unauthorized.tsx로 전파된다</h5>
            <p>
              공식 문서(<code>app/api-reference/functions/unauthorized</code>)는 &quot;예외가 가장 가까운{' '}
              <code>unauthorized</code> 경계로 전파된다(propagates to the nearest unauthorized boundary)&quot;고 명시한다. 이
              데모의 <code>order-history/</code>에는 전용 <code>unauthorized.tsx</code>가 없으므로, 예외는 한 단계 위인{' '}
              <code>anonymous-401/unauthorized.tsx</code>까지 올라가 그 파일이 렌더링된다 — <code>error.tsx</code>/
              <code>not-found.tsx</code>/<code>forbidden.tsx</code>와 같은 &quot;가장 가까운 경계&quot; 규칙을 그대로 따른다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 같은 위치의 전용 unauthorized.tsx가 상위 파일을 가린다</h5>
            <p>
              <code>payment-methods/</code> 폴더에는 같은 위치에 자체 <code>unauthorized.tsx</code>가 있다. 이 경우 예외는
              더 멀리(상위 <code>anonymous-401/unauthorized.tsx</code>까지) 전파되지 않고, 더 가까운 세그먼트 전용 파일이
              우선 렌더링된다. 세그먼트별로 서로 다른 401 UI(주문 내역은 일반 로그인 유도, 결제 수단은 보안 강조 안내)를 두고
              싶을 때 이 규칙을 이용해 원하는 깊이에만 파일을 추가하면 된다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 401 vs 403 — unauthorized()와 forbidden()의 구분</h5>
            <p>
              <code>unauthorized()</code>는 사용자의 신원이 아예 확인되지 않은 상태(비로그인)에 사용하는 반면,{' '}
              <code>forbidden()</code>은 신원은 확인됐지만 해당 리소스에 대한 권한이 없는 상태에 사용한다. 이 둘은 서로 다른
              파일 컨벤션(<code>unauthorized.tsx</code> / <code>forbidden.tsx</code>)과 서로 다른 상태 코드(401 / 403)로
              분리되어 있다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>
                <code>unauthorized.tsx</code>는 props를 받지 않는다 — 어떤 세그먼트에서 호출됐는지 파일 자체는 알 수 없다.
                안내 문구를 세그먼트별로 다르게 하려면 이 데모처럼 그 위치에 별도 파일을 두어야 한다.
              </li>
              <li>
                루트 레이아웃(<code>app/layout.tsx</code>)에서는 <code>unauthorized()</code>를 호출할 수 없으므로, 루트{' '}
                <code>unauthorized.tsx</code>는 그 아래 모든 세그먼트의 최종 폴백 역할만 한다.
              </li>
              <li>
                여전히 experimental 기능이며 <code>next.config.ts</code>의{' '}
                <code>experimental.authInterrupts: true</code> 없이는 unauthorized()/unauthorized.tsx 모두 동작하지 않는다.
              </li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
