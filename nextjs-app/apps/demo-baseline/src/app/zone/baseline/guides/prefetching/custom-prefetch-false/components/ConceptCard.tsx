import { DemoDeepDiveCard } from '@study/demo-kit'
import { LAYOUT_COST_MS, PAGE_COST_MS } from '../types'

export function ConceptCard() {
  return (
    <DemoDeepDiveCard title="prefetch를 끌 때 얻는 것과 잃는 것">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">1. 왜 끄는가 — 링크 수 × 목적지 비용</h5>
          <p>
            production에서 기본 <code>{'<Link>'}</code>는 뷰포트에 들어온 링크마다 목적지를 prefetch합니다. 이 실습의 목적지는
            동적 라우트 + <code>loading.tsx</code>라서, 기본 prefetch가 <code>layout.tsx</code>부터 loading 경계까지를 서버에서
            실제로 렌더합니다. 레인 A의 &quot;서버 layout 렌더&quot;가 클릭 없이 링크 수만큼(3회) 올라가고, 클릭하지 않은 링크의
            렌더는 그대로 버려집니다. 링크가 수백 개인
            목록(무한 스크롤·푸터·페이지네이션)이나 목적지 layout이 비싼 경우, 이 비용이 방문자 수만큼 곱해집니다. 공식 가이드의
            &quot;Preventing too many prefetches&quot;가 다루는 상황입니다.
          </p>
        </div>
        <div>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">2. 끄면 무엇을 치르는가 — 클릭 시점 비용</h5>
          <p>
            App Router의 <code>prefetch={'{false}'}</code>는 뷰포트 진입과 hover 모두에서 prefetch하지 않습니다(Pages Router는
            hover 시 prefetch — 서로 다름). 그래서 레인 B는 클릭한 순간에야 요청을 보내고, 목적지 layout({LAYOUT_COST_MS}ms)을
            서버가 끝낼 때까지 스켈레톤조차 볼 수 없습니다. 가이드 표현대로 &quot;동적 라우트는 서버 렌더를 기다린 뒤
            이동&quot;합니다. 반면 loading 경계 아래의 page({PAGE_COST_MS}ms)는 어느 레인이든 클릭 후 요청하므로, prefetch가
            줄여주는 것은 &quot;첫 화면 반응&quot;이지 전체 데이터 대기가 아닙니다. 서버 카운터로 보면 prefetch된 링크는 클릭 시
            layout을 다시 렌더하지 않고(prefetch 결과 재사용) page만 렌더합니다 — 클릭한 링크만 보면 서버 작업 총량은 같고, 언제 치르느냐가 다릅니다.
          </p>
        </div>
        <div>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">3. 중간 해법 — hover 때만 prefetch</h5>
          <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
            <li>
              <strong>HoverPrefetchLink</strong>(레인 C): <code>prefetch={'{active ? null : false}'}</code>. hover 전에는
              false라 비용 0, hover하면 null(기본 prefetch)로 바뀌어 그 링크 하나만 예열합니다.
            </li>
            <li>
              <strong>router.prefetch()</strong>(레인 D): <code>useRouter().prefetch(href)</code>를 onMouseEnter에서 직접
              호출합니다. 카드 전체 hover·스크롤·분석 신호 등 원하는 시점에 예열할 수 있습니다.
            </li>
            <li>
              두 방식 모두 hover가 짧으면 prefetch 응답이 오기 전에 클릭해 B와 비슷해질 수 있고, 터치 기기에는 hover가 없습니다.
              가이드도 Link 확장은 prefetch·캐시 무효화·접근성을 직접 책임지는 선택이라고 경고합니다.
            </li>
          </ul>
        </div>
        <div>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">4. development와 production의 차이</h5>
          <p>
            자동 prefetch는 production 전용입니다. <code>next dev</code>에서는 A도 0건이라 모든 레인이 클릭 후 요청으로 같아지므로,
            레인 간 차이는 <code>next build</code> 후 <code>next start</code>로 확인하세요.
          </p>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
