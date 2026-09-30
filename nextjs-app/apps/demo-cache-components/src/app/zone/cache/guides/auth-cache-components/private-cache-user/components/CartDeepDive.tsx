import { DemoDeepDiveCard } from '@study/demo-kit'

export function CartDeepDive() {
  return (
    <DemoDeepDiveCard title="'use cache: private'가 사용자별로 격리하는 방식">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 인자가 아니라 쿠키가 사용자를 정한다</h5>
          <p>
            <code>getPrivateCart()</code>는 인자가 없다. 스코프 안에서 <code>cookies()</code>를 읽어 사용자를 판별하고 그 사용자의
            장바구니를 만든다. 일반 <code>'use cache'</code>는 스코프 안의 <code>cookies()</code>·<code>headers()</code>를
            허용하지 않아서, 쿠키를 밖에서 읽어 인자로 넘겨야 한다.
          </p>
        </div>
        <div>
          <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 결과는 서버가 아니라 브라우저 메모리에만 남는다</h5>
          <p>
            서버는 결과를 저장하지 않는다. 그래서 <code>router.refresh()</code>처럼 서버에 다시 요청하면 bodyRuns가 늘고 cacheId도
            새로 발급된다. 사용자 A의 결과가 사용자 B에게 서빙될 저장소가 서버에 없으므로 격리는 구조적으로 보장된다.
            <code>cacheLife({'{'} stale: 60 {'}'})</code>는 클라이언트가 서버 확인 없이 재사용해도 되는 시간이다.
          </p>
        </div>
        <div>
          <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 주의사항</h5>
          <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
            <li>런타임 데이터를 읽으므로 static shell에는 포함되지 않고 요청마다 실행된다.</li>
            <li><code>connection()</code>은 일반·private 모두에서 금지된다.</li>
            <li>서버에 임시로도 저장하면 안 되는 요구사항이나, 인자 리팩터링이 어려울 때 쓴다. 그렇지 않으면 서버 캐시를 쓰는 표준 패턴이 낫다.</li>
            <li>이 화면은 학습용 쿠키(<code>private-cache-user-uid</code>)이며 실제 인증이 아니다.</li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
