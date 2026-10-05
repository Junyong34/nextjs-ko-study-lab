import { DemoDeepDiveCard } from '@study/demo-kit'

const h = 'mb-1 font-bold text-zinc-900 dark:text-zinc-100'

export function DeepDive() {
  return (
    <DemoDeepDiveCard title="Link prefetch와 정적 셸 · 동적 데이터 경계">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className={h}>1. 이 화면의 구조</h5>
          <pre className="overflow-x-auto rounded bg-zinc-100 p-2 text-[11px] dark:bg-zinc-900">{`hover-shell/layout.tsx          ← 관측 훅(fetch 계측), 이동 중에도 유지
├─ page.tsx                     ← 목록: 실제 <Link> 3개 (prefetch 기본 / true / false)
└─ products/[id]/
   ├─ loading.tsx               ← prefetch(auto)가 닿는 loading 경계
   └─ page.tsx                  ← 정적 상품 정보 + <Suspense><LiveStock/></Suspense>`}</pre>
        </div>
        <div>
          <h5 className={h}>2. 이 zone에서 확인할 수 있는 것과 없는 것</h5>
          <p>
            Partial Prefetching(<code>partialPrefetching: true</code>, <code>export const prefetch = &apos;partial&apos;</code>)은 <code>cacheComponents</code>가 켜져 있을 때만 동작합니다.
            이 zone(<code>demo-baseline</code>)은 <code>cacheComponents</code>를 쓰지 않으므로 App Shell prefetch 자체는 시연하지 못하고, 같은 구조(정적 셸 + Suspense 뒤 동적 데이터)에서 <code>&lt;Link&gt;</code>의 기본 prefetch 동작과 클릭 뒤 스트리밍을 실측합니다.
            App Shell 공유 prefetch(<code>prefetch = &apos;partial&apos;</code>)는 cache zone의 <code>guides/adopting-partial-prefetching/app-shell</code> 실습에서 확인할 수 있습니다.
          </p>
        </div>
        <div>
          <h5 className={h}>3. 개발 모드의 한계</h5>
          <p>
            <code>&lt;Link&gt;</code>의 prefetch(viewport 진입·hover)는 production에서만 동작합니다. <code>next dev</code>의 0건은 오류가 아니라 정상입니다.
            요청 헤더 <code>Next-Router-Prefetch</code>와 <code>_rsc</code> 쿼리는 DevTools Network 탭에서도 확인할 수 있습니다.
          </p>
        </div>
        <div>
          <h5 className={h}>4. 링크 prop별 의도</h5>
          <ul className="list-disc space-y-1 pl-4 text-zinc-600 dark:text-zinc-400">
            <li>기본값: 정적 라우트는 전체, 동적 라우트는 가장 가까운 <code>loading</code> 경계까지 미리 가져옵니다.</li>
            <li><code>prefetch</code>(true): 동적 라우트도 전체를 미리 가져옵니다.</li>
            <li><code>prefetch=&#123;false&#125;</code>: viewport 진입과 hover 모두 prefetch하지 않습니다.</li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
