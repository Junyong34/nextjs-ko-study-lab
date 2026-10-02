import React from 'react'
import { DemoDeepDiveCard } from '@study/demo-kit'

const h = 'mb-1 font-bold text-zinc-900 dark:text-zinc-100'
const pre = 'overflow-x-auto rounded bg-zinc-950 p-3 font-mono text-[11px] text-zinc-300'

export function HydrationDeepDive() {
  return (
    <DemoDeepDiveCard title="서버에서 채운 캐시를 브라우저 QueryClient로 옮기는 방법">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className={h}>1. 이 데모의 page.tsx (서버 컴포넌트)</h5>
          <pre className={pre}>{`export default async function DemoPage() {
  await connection()                       // 요청 시점에 렌더 (빌드 때 미리 만들지 않음)
  const queryClient = new QueryClient()    // 요청마다 새로
  await queryClient.prefetchQuery({
    ...dealsQuery('prefetched'),           // 브라우저와 같은 queryKey·staleTime
    queryFn: () => getDeals('server-prefetch', 'prefetched'), // 서버에서는 함수를 직접 호출
  })
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HydrationLab ... />                 // 안쪽 useQuery(dealsQuery('prefetched'))가 캐시를 바로 읽음
    </HydrationBoundary>
  )
}`}</pre>
          <p className="mt-1">
            <code>dehydrate()</code>는 캐시를 직렬화 가능한 객체로 만들고, 이것이 클라이언트 컴포넌트인 <code>HydrationBoundary</code>의 props로 RSC Payload에 실립니다.
            브라우저에서 <code>HydrationBoundary</code>가 그 상태를 Provider의 QueryClient에 넣기 때문에 <code>useQuery</code>는 첫 렌더부터 <code>status: &apos;success&apos;</code>이고, 서버 렌더도 같은 데이터로 HTML을 그립니다.
            <code>dataUpdatedAt</code>은 서버가 읽은 시각 그대로 넘어옵니다.
          </p>
        </div>
        <div>
          <h5 className={h}>2. 서버 QueryClient를 전역으로 공유하면 안 되는 이유</h5>
          <p>
            서버 모듈 최상단에 <code>const queryClient = new QueryClient()</code>를 두면 모든 요청·모든 사용자가 같은 캐시를 씁니다. A 사용자의 장바구니나 권한별 데이터가 캐시에 남아 B 사용자의 <code>dehydrate()</code> 결과에 함께 실릴 수 있습니다.
            그래서 서버에서는 렌더(요청)마다 새로 만들고, 브라우저에서는 탭 하나에 하나만 만들어 재사용합니다(<code>providers.tsx</code>의 <code>environmentManager.isServer()</code> 분기). 실습의 &quot;new QueryClient() 직후 캐시 쿼리 수 0&quot;과 새로고침마다 바뀌는 렌더 id가 그 근거입니다.
          </p>
        </div>
        <div>
          <h5 className={h}>3. staleTime이 hydration 직후 재요청을 막는다</h5>
          <p>
            <code>staleTime</code> 기본값 0이면 hydrate된 데이터도 곧바로 오래된 것으로 보여, 마운트되는 순간 브라우저가 같은 데이터를 다시 요청합니다. 이 데모는 계약 객체에 <code>staleTime: 60_000</code>을 넣어 막았고,
            [staleTime: 0 구독 추가]는 같은 키를 0으로 구독해 그 재요청을 직접 보여 줍니다. 60초가 지난 뒤 [60초 구독 추가]를 누르면 그쪽도 재요청합니다.
          </p>
        </div>
        <div>
          <h5 className={h}>4. 대조군과 스트리밍 변형</h5>
          <ul className="list-disc space-y-1 pl-4 text-zinc-600 dark:text-zinc-400">
            <li><code>client-only/page.tsx</code>는 prefetch 없이 같은 컴포넌트만 그립니다. 서버 HTML은 로딩 표시뿐이고, 하이드레이션 뒤에야 요청이 시작돼 화면이 한 번 더 바뀝니다.</li>
            <li>이 데모는 <code>await</code>로 prefetch를 끝낸 뒤 HTML을 보냅니다. TanStack Query 5.40 이상은 <code>void prefetchQuery()</code> + <code>shouldDehydrateQuery</code>에 pending 포함 + <code>useSuspenseQuery</code> 조합으로, 기다리지 않고 데이터를 나중에 스트리밍할 수도 있습니다.</li>
            <li>설치된 5.104.0에서 <code>prefetchQuery</code>는 <code>@deprecated</code> 표시가 붙어 있고 <code>queryClient.query(options).catch(noop)</code>가 대체 API로 안내됩니다. 동작은 같으며, 이 데모는 Next.js 문서와 같은 이름을 보여 주려고 <code>prefetchQuery</code>를 씁니다.</li>
          </ul>
        </div>
        <div>
          <h5 className={h}>5. 측정 방법과 한계</h5>
          <ul className="list-disc space-y-1 pl-4 text-zinc-600 dark:text-zinc-400">
            <li>&quot;첫 렌더 데이터&quot;는 하이드레이션 직후 첫 effect에서 DOM의 상품 행을 센 값입니다. 하이드레이션은 서버 HTML의 DOM을 그대로 재사용하므로 하드 로드에서는 HTML에 있던 행 수와 같습니다. 클라이언트 이동으로 들어오면 HTML이 아니라 RSC Payload로 전달되므로 판정 문구가 바뀝니다.</li>
            <li>요청 수는 PerformanceObserver(Resource Timing)로 셉니다. 전역 fetch는 바꾸지 않습니다. 서버 읽기 기록은 dev 서버 한 프로세스의 메모리이며, 배포 환경은 검증하지 않았습니다.</li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
