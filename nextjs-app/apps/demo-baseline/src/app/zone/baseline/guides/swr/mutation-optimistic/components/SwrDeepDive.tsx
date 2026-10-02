import React from 'react'
import { DemoDeepDiveCard } from '@study/demo-kit'

const h = 'mb-1 font-bold text-zinc-900 dark:text-zinc-100'
const pre = 'overflow-x-auto rounded bg-zinc-950 p-3 font-mono text-[11px] text-zinc-300'

export function SwrDeepDive() {
  return (
    <DemoDeepDiveCard title="SWR 캐시 키와 mutate()의 낙관적 갱신">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className={h}>1. 캐시 키 하나를 여러 컴포넌트가 공유한다</h5>
          <p>
            <code>useSWR(CART_KEY)</code>를 부르는 목록과 헤더 배지는 서로 props를 주고받지 않지만, SWR 캐시의 같은 칸(키 = <code>api/cart</code> URL 문자열)을 구독합니다.
            그래서 처음 마운트될 때 fetcher는 한 번만 실행되고(<code>dedupingInterval</code> 기본 2초 안의 같은 키 요청은 합쳐짐), <code>mutate(CART_KEY, …)</code>로 칸을 바꾸면 두 컴포넌트가 함께 다시 그려집니다.
            React <code>useOptimistic</code>(mutating-data/optimistic-cart 데모)이 한 컴포넌트 트리 안의 전환 동안만 값을 덮어쓰는 것과 달리, SWR의 낙관적 값은 이 캐시 칸에 들어가 키를 읽는 모든 곳에 퍼집니다.
          </p>
        </div>
        <div>
          <h5 className={h}>2. 이 데모의 mutate() 호출</h5>
          <pre className={pre}>{`await mutate(CART_KEY, patchCart({ itemId, delta, delayMs, fail }), {
  optimisticData: (current) => withQty(current, itemId, optimisticQty),
  rollbackOnError: true,   // 실패하면 mutate 직전의 확정값으로 되돌림
  populateCache: true,     // 성공 응답(장바구니 전체)을 그대로 캐시에 기록
  revalidate: settings.revalidate, // 끝난 뒤 GET으로 한 번 더 확인할지
})`}</pre>
          <p className="mt-1">
            SWR은 <code>optimisticData</code>를 넣기 전에 확정값을 따로 보관해 두고, 쓰기 Promise가 거부되면 그 값으로 칸을 되돌립니다. <code>throwOnError</code> 기본값이 true라 실패한 <code>mutate()</code>는 예외를 던지므로 호출한 쪽에서 잡아야 합니다.
            <code>revalidate</code>는 성공·실패와 관계없이 끝난 뒤 실행되며, 이때는 진행 중 요청 표시를 지워 중복 제거에 걸리지 않습니다.
          </p>
        </div>
        <div>
          <h5 className={h}>3. populateCache와 revalidate 고르기</h5>
          <ul className="list-disc space-y-1 pl-4 text-zinc-600 dark:text-zinc-400">
            <li>쓰기 API가 변경 후 전체 리소스를 돌려주면 <code>populateCache: true</code> + <code>revalidate: false</code>로 GET 한 번을 아낄 수 있습니다. 이 데모의 PATCH가 그런 응답입니다.</li>
            <li>쓰기 API가 일부만 돌려주거나 다른 사용자의 변경이 섞일 수 있으면 <code>revalidate: true</code>로 최종 정합성을 서버에서 다시 받습니다. 실패한 경우에도 재검증 GET이 나가는 것을 기록에서 볼 수 있습니다.</li>
            <li>낙관적 값은 &quot;요청이 그대로 성공한다&quot;는 추측입니다. 서버 규칙(여기서는 재고 상한)이 바꾼 결과는 응답이 와야 화면에 반영되므로, 사용자가 잠깐 다른 숫자를 볼 수 있습니다.</li>
          </ul>
        </div>
        <div>
          <h5 className={h}>4. 서버 캐시와의 관계</h5>
          <p>
            SWR 캐시는 브라우저 메모리에만 있습니다. 서버 읽기를 <code>&apos;use cache&apos;</code>·<code>cacheTag</code>로 캐시하는 앱이라면, 쓰기 쪽(Server Action 등)에서 <code>updateTag</code>를 함께 호출해야 다음 서버 렌더도 새 값을 읽습니다.
            이 데모의 <code>api/cart</code>는 <code>dynamic = &apos;force-dynamic&apos;</code>라 서버 캐시가 없고, 저장소는 서버 메모리(<code>globalThis</code>)입니다.
          </p>
        </div>
        <div>
          <h5 className={h}>5. 측정 방법과 한계</h5>
          <ul className="list-disc space-y-1 pl-4 text-zinc-600 dark:text-zinc-400">
            <li>GET·PATCH 시각은 이 데모의 fetcher와 쓰기 함수가 직접 기록하고(전역 fetch는 건드리지 않음), 화면 값은 목록 컴포넌트가 새 값을 커밋한 직후 effect에서 기록합니다.</li>
            <li>SWRConfig에 <code>provider: () =&gt; new Map()</code>을 줘 이 데모만의 캐시를 쓰며, 초기화하면 캐시와 서버 저장소를 함께 비웁니다. 실습 기록이 섞이지 않도록 <code>revalidateOnFocus</code>는 껐습니다.</li>
            <li>서버 저장소는 dev 서버 한 프로세스의 메모리라, 여러 인스턴스로 뜨는 배포 환경에서는 요청마다 다른 인스턴스가 응답할 수 있습니다. 배포 환경은 검증하지 않았습니다.</li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
