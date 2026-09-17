import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export function VerificationFooter() {
  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="notFound() 호출 위치별 실측 검증 결과"
        expected={
          '• STORE-999 진입 -> stores/[storeId]/layout.tsx의 notFound() -> 실제 HTTP 404 + not-found.tsx 렌더\n' +
          '• GET /api/inventory/SKU-999 -> Route Handler의 notFound() -> 실제 HTTP 404 응답(HTML 없음)'
        }
        actual="• 위 [실습 화면]에서 두 시나리오를 각각 실행해 실제 상태 코드를 관찰하세요. 매장 시나리오는 이동한 not-found.tsx 하단 패널에, 재고 API 시나리오는 실습 화면의 응답 로그에 실측 결과가 표시됩니다."
        isMatched={undefined}
        description="notFound()는 이 검증이 별도 라우트 이동/요청 이후에 완성됩니다 — 호출 즉시 렌더링·응답을 중단시키므로 이 페이지 자체에서 결과를 미리 보여주지 않습니다."
      />
      <DemoDeepDiveCard title="notFound() 호출 위치와 공통 예외 메커니즘">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>notFound()</code> (<code>next/navigation</code>)는 호출 즉시 <code>NEXT_HTTP_ERROR_FALLBACK;404</code>{' '}
              예외를 던져 해당 라우트 세그먼트의 렌더링을 그 자리에서 중단시키는 함수다. Next.js 16.3.2 공식 문서 기준{' '}
              <strong>Server Components, Server Functions(Server Actions), Route Handlers</strong> 어디서 호출해도 동일하게
              동작한다 — 즉 page.tsx 전용 함수가 아니다.
            </p>
          </div>

          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">2. 이 데모에서 실제로 호출한 두 위치</h5>
            <p>
              <strong>① layout.tsx</strong>: <code>stores/[storeId]/layout.tsx</code>가 지점 존재 여부를 검사해
              notFound()를 호출한다. 어느 한쪽이 예외를 던지면 같은 세그먼트가 같은 폴더의 not-found.tsx로 대체된다.
              실제로 이 프로젝트에서 layout.tsx만 가드하고 page.tsx의 방어 코드를 지운 채 실행해 보면, 같은 storeId로
              layout과 page가 각각 독립적으로 렌더링을 시도하다가 layout의 notFound()와는 별개로 page 쪽에서 &ldquo;존재하지
              않는 store를 읽으려는&rdquo; TypeError가 함께 발생한다 — 즉 layout이 상위에서 걸러준다고 해서 하위 page.tsx가
              실행 자체를 건너뛰는 것은 아니므로, page.tsx도 스스로 같은 조건을 다시 확인해야 한다.
            </p>
            <p className="mt-1.5">
              <strong>② Route Handler</strong>: <code>api/inventory/[sku]/route.ts</code>의 GET 핸들러가 재고 카탈로그에
              없는 SKU를 조회하면 notFound()를 호출한다. 렌더링할 HTML 트리 자체가 없으므로 not-found.tsx 대신 순수
              HTTP 404 응답으로 끝난다 — 공식 문서의 &ldquo;Serving a 404 from a Route Handler&rdquo; 예제와 동일한 패턴이다.
            </p>
          </div>

          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">3. missing-product-404와의 차이</h5>
            <p>
              같은 not-found 계열의 다른 데모(<code>file-conventions/not-found/missing-product-404</code>)는 동적 세그먼트{' '}
              <code>items/[id]/page.tsx</code>에서 notFound()를 호출해 &ldquo;존재하지 않는 상품 상세&rdquo; 시나리오를
              보여준다. 이 데모는 그 page.tsx 위치 대신 <strong>layout.tsx</strong>와 <strong>Route Handler</strong> 두
              위치에 초점을 맞춰, notFound() 자체가 호출 위치와 무관하게 같은 예외 메커니즘으로 동작한다는 점을
              보여준다.
            </p>
          </div>

          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">4. 실무적 장점 (Why Use This)</h5>
            <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
              <li>
                <strong>레이아웃 단위 조기 차단</strong>: 상위 리소스(지점, 조직 등) 자체가 없을 때 layout.tsx에서 한 번에
                검사하면, 그 아래 모든 하위 page.tsx에서 같은 검사를 반복하지 않아도 된다.
              </li>
              <li>
                <strong>API와 화면의 일관된 404</strong>: Route Handler에서도 같은 함수로 404를 표현할 수 있어, 화면
                라우트와 API 라우트가 서로 다른 404 규약을 만들 필요가 없다.
              </li>
            </ul>
          </div>

          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
              <li>
                <strong>try/catch 블록 안에서 호출 금지</strong>: notFound()는 예외를 던져 동작하므로 try/catch로 감싸면
                예외가 잡혀 not-found UI가 렌더링되지 않는다. 근처에서 에러를 가로채야 한다면{' '}
                <code>unstable_rethrow</code>로 먼저 통과시켜야 한다.
              </li>
              <li>
                <strong>반환값 불필요</strong>: notFound()는 <code>never</code> 타입을 반환하므로{' '}
                <code>return notFound()</code> 대신 단독 호출로 충분하다.
              </li>
              <li>
                <strong>루트 레이아웃(app/layout.tsx)에서는 호출 불가</strong>: 그 위로는 not-found 바운더리를 세워줄
                부모 세그먼트가 없기 때문이다. 로컬 1차 문서(<code>next/dist/docs</code>)의 notFound() 레퍼런스에는 이
                제한이 명시돼 있지 않지만, forbidden() 문서와 Next.js 소스(
                <code>dev-root-http-access-fallback-boundary.tsx</code>, context7로 교차 확인)의 동일한 렌더링 경계
                메커니즘상 notFound()도 루트 레이아웃에서는 차단된다. 이 데모는 루트가 아닌 중첩 레이아웃(
                <code>stores/[storeId]/layout.tsx</code>)에서 호출하므로 문제없이 동작한다.
              </li>
              <li>
                <strong>스트리밍 중에는 실제 404가 아닐 수 있음</strong>: <code>loading.tsx</code>로 셸이 이미 200으로
                스트리밍을 시작한 뒤에는 상태 코드를 바꿀 수 없다. 이 데모의 두 세그먼트는 모두 loading.tsx가 없어
                notFound()가 스트리밍 이전에 던져지므로, 검증 패널이 실제 404를 그대로 관측한다.
              </li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
