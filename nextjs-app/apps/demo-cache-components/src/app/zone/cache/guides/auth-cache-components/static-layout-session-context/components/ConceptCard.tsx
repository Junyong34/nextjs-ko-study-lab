import { DemoDeepDiveCard } from '@study/demo-kit'

const TREE = `page.tsx (◐ Partial Prerender)
├─ DemoGuideCard · 측정 패널           ← static shell
└─ <Suspense fallback={StoreFallback}>
   └─ Storefront()                     ← getCurrentUser() 호출, await 안 함
      └─ <UserProvider userPromise>    ← Context에 Promise 저장
         └─ CatalogShell 'use cache'   ← 상품 목록·셸 렌더 ID (static shell)
            ├─ accountSlot: <Suspense fallback={BadgeFallback}>
            │    └─ UserBadge   use(userPromise)  ← 요청 시점 스트리밍
            └─ children:    <Suspense fallback={AccountPanelFallback}>
                 └─ AccountPanel use(userPromise) ← 같은 Promise 재사용`

const HTML = `<div data-demo-marker="catalog-shell" ...>     ← 앞부분(prerender)
  <!--$?--><template id="B:0"></template>
  <div data-demo-marker="session-fallback">  ← fallback
...
<div hidden id="S:0">                        ← 요청 시점에 뒤따라 도착
  <div data-demo-marker="session-ready" data-session-request-id="...">
<script>$RC("B:0","S:0")</script>            ← fallback 자리와 교체`

export function ConceptCard() {
  return (
    <DemoDeepDiveCard title="정적 셸은 그대로, 세션만 Suspense 뒤에서 스트리밍">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <section>
          <h4 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">1. 왜 세션은 static shell에 못 들어가나</h4>
          <p>
            <code>cacheComponents</code>에서 <code>cookies()</code>는 요청 시점 API입니다. 빌드 시점 prerender에서는
            값이 없으므로, 세션을 기다리는 컴포넌트는 가장 가까운 <code>Suspense</code>의 fallback으로 대체되고
            요청이 올 때 채워집니다. 경계 밖에서 세션을 기다리면 빌드가 실패합니다. 반대로 <code>&apos;use cache&apos;</code>로
            감싼 <code>CatalogShell</code>은 prerender 결과에 들어가 모든 방문자가 같은 셸 렌더 ID를 받습니다.
          </p>
        </section>

        <section>
          <h4 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">2. 컴포넌트 트리 (가이드 2·3단계)</h4>
          <pre className="overflow-x-auto rounded border border-zinc-200 bg-zinc-50 p-3 font-mono text-[11px] leading-relaxed dark:border-zinc-800 dark:bg-zinc-900/60">{TREE}</pre>
          <ul className="mt-2 list-inside list-disc space-y-1 text-zinc-600 dark:text-zinc-400">
            <li>세션 Promise는 레이아웃 최상위가 아니라 <code>Suspense</code> 경계 안의 <code>Storefront</code>에서 만들고 기다리지 않습니다.</li>
            <li><code>CatalogShell</code>은 슬롯(<code>accountSlot</code>, <code>children</code>)을 들여다보지 않고 통과시키므로 캐시 키에 들어가지 않습니다 (use cache Interleaving).</li>
            <li>두 위젯이 같은 Promise를 <code>use()</code>로 풀기 때문에 세션 요청 ID가 배지와 계정 패널에서 같습니다.</li>
          </ul>
        </section>

        <section>
          <h4 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">3. 측정 패널이 읽는 HTML 구조</h4>
          <pre className="overflow-x-auto rounded border border-zinc-200 bg-zinc-50 p-3 font-mono text-[11px] leading-relaxed dark:border-zinc-800 dark:bg-zinc-900/60">{HTML}</pre>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            로컬에서는 전체 응답이 수 ms 안에 끝나 브라우저가 여러 청크를 한 번에 읽을 수 있습니다. 그래서 판정은 청크 번호가
            아니라 HTML 안의 순서와 <code>S:n</code> 세그먼트 여부로 합니다. dev 서버에서 파일을 고친 직후 첫 요청은
            캐시를 새로 만드느라 전체가 한 번에 렌더되어 fallback이 없을 수 있습니다.
          </p>
        </section>

        <section>
          <h4 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">4. 실무 주의사항</h4>
          <ul className="list-inside list-disc space-y-1 text-zinc-600 dark:text-zinc-400">
            <li>클라이언트로 가는 Promise에는 <code>{'{ id, name, tier, points }'}</code>처럼 필요한 필드만 담습니다. 원시 세션·이메일·토큰은 넘기지 않습니다.</li>
            <li>로그인 Action은 클라이언트가 보낸 사용자 ID를 저장 전에 서버에서 다시 확인합니다. 데모 쿠키는 httpOnly이며 이 데모 경로로 path를 한정합니다.</li>
            <li>가이드의 <code>getCurrentUser()</code>는 <code>&apos;use cache: private&apos;</code>로 세션별 prefetch까지 노리며, 미인증이면 <code>redirect(&apos;/login&apos;)</code>합니다. 이 데모는 스트리밍 구조에 집중하려고 캐시 없이 매 요청 읽고 게스트 UI를 보여 줍니다.</li>
            <li>fallback 크기를 실제 위젯과 맞춰 스트리밍 도착 시 레이아웃 이동(CLS)을 줄입니다.</li>
          </ul>
        </section>
      </div>
    </DemoDeepDiveCard>
  )
}
