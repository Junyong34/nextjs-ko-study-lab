import React from 'react'
import { DemoDeepDiveCard } from '@study/demo-kit'

const h = 'mb-1 font-bold text-zinc-900 dark:text-zinc-100'
const pre = 'overflow-x-auto rounded bg-zinc-950 p-3 font-mono text-[11px] text-zinc-300'

export function InfiniteDeepDive() {
  return (
    <DemoDeepDiveCard title="useInfiniteQuery는 페이지 배열 하나를 캐시한다">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className={h}>1. 커서가 다음 요청을 정한다</h5>
          <pre className={pre}>{`infiniteQueryOptions({
  queryKey: ['guides-tanstack-infinite-scroll', 'products'],
  queryFn: ({ pageParam, signal }) => fetchPage(pageParam, signal),
  initialPageParam: null as string | null,
  getNextPageParam: (lastPage) => lastPage.nextCursor, // null이면 hasNextPage=false
  staleTime: 60_000,
})`}</pre>
          <p className="mt-1">
            캐시에는 <code>{`{ pages, pageParams }`}</code> 하나가 저장되고 <code>fetchNextPage()</code>는 마지막 페이지로 다음 커서를 계산해 배열 끝에 붙입니다.
            커서는 Route Handler(<code>api/products?cursor=…</code>)가 마지막 상품 id로 돌려주므로, 중간에 상품이 추가돼도 오프셋 방식처럼 같은 상품이 두 번 나오지 않습니다.
          </p>
        </div>
        <div>
          <h5 className={h}>2. 센티널 + 가드</h5>
          <pre className={pre}>{`new IntersectionObserver(([e]) => {
  if (e.isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage()
}, { root: scrollBox })`}</pre>
          <p className="mt-1">
            <code>fetchNextPage()</code>의 기본값은 <code>cancelRefetch: true</code>라, 받는 중에 다시 부르면 진행 중 요청을 취소하고 새로 시작합니다.
            <code>signal</code>을 fetch에 넘겼기 때문에 취소는 실제 HTTP 요청 중단으로 이어집니다. 그래서 IntersectionObserver처럼 여러 번 불릴 수 있는 곳에서는 <code>isFetchingNextPage</code> 가드를 두거나 <code>{`{ cancelRefetch: false }`}</code>로 진행 중 요청을 재사용합니다.
            취소된 요청이 서버까지 도착했는지는 타이밍에 따라 달라서, 실습의 &quot;서버가 이 커서를 받은 횟수&quot;는 1보다 클 수 있습니다.
          </p>
        </div>
        <div>
          <h5 className={h}>3. 언마운트 후 재진입</h5>
          <p>
            Provider(<code>layout.tsx</code>)는 [공지사항]으로 이동해도 남고, 목록(<code>page.tsx</code>)만 언마운트됩니다. observer가 0이 된 쿼리는 <code>gcTime</code>(기본 5분) 동안 캐시에 남아 있다가,
            다시 마운트되면 첫 렌더부터 그 페이지들을 그립니다. <code>staleTime</code>(여기서는 60초) 안이면 요청하지 않고, 지났으면 불러온 페이지 전부를 첫 페이지부터 차례로 다시 요청해 일관된 목록을 만듭니다.
            페이지가 많을 때 이 재요청 비용이 크므로 <code>maxPages</code>로 보관 페이지 수를 제한할 수 있습니다.
          </p>
        </div>
        <div>
          <h5 className={h}>4. QueryClient 위치</h5>
          <p>
            서버 렌더에서는 요청마다 새 <code>QueryClient</code>를 만들고, 브라우저에서는 이 데모 모듈의 인스턴스 하나를 재사용합니다(<code>environmentManager.isServer()</code>로 구분).
            Provider는 zone 루트가 아니라 이 데모의 <code>layout.tsx</code>에만 둬 다른 데모와 캐시를 공유하지 않습니다.
          </p>
        </div>
        <div>
          <h5 className={h}>5. 측정 방법과 한계</h5>
          <ul className="list-disc space-y-1 pl-4 text-zinc-600 dark:text-zinc-400">
            <li>queryFn 실행·취소는 이 데모의 fetch 함수가 직접 기록하고, 실제 네트워크 요청은 PerformanceObserver로 받은 Resource Timing 항목으로 셉니다. 전역 fetch는 바꾸지 않습니다.</li>
            <li>dev 서버에서는 React StrictMode가 마운트 직후 effect를 정리했다가 다시 실행해, 첫 페이지 요청이 한 번 취소(observer 0 → signal abort)되고 다시 나갈 수 있습니다. 검증 패널은 이 취소를 따로 표시하고 완료된 요청 수로 판정합니다. production 빌드에서는 생기지 않습니다(이 화면에서 production은 검증하지 않았습니다).</li>
            <li>staleTime이 지난 뒤의 재요청을 보려면 60초 넘게 기다린 뒤 돌아와야 합니다. 서버 카운터는 dev 서버 한 프로세스의 메모리라 배포 환경(여러 인스턴스)에서는 값이 다를 수 있으며, 배포 환경은 검증하지 않았습니다.</li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
