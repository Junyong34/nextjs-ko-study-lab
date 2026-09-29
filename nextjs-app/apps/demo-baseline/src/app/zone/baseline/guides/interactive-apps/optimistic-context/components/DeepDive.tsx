import { DemoDeepDiveCard } from '@study/demo-kit'

const h = 'mb-1 font-bold text-zinc-900 dark:text-zinc-100'
const ul = 'list-disc list-inside space-y-1 pl-1 text-zinc-600 dark:text-zinc-400'

export function DeepDive() {
  return (
    <DemoDeepDiveCard title="낙관적 변경을 트리 전체에서 공유하기">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className={h}>1. 서버 데이터가 아니라 변경 목록을 Context에 둔다</h5>
          <p>
            <code>useOptimistic</code>의 업데이트 함수는 항상 기준 상태 위에서 실행됩니다. 이벤트를 옮기고 지우는
            리듀서의 기준은 이벤트 목록 자체인데, 그 목록은 공급자 아래 Server Component가 각자 읽어 옵니다.
            그래서 공급자는 빈 배열로 시작해 변경만 덧붙이는 <code>pendingChanges</code>를 보유하고, 각 뷰가
            <code>pendingChanges.reduce(eventChangeReducer, events)</code>로 자기 데이터에 재적용합니다.
          </p>
        </div>
        <div>
          <h5 className={h}>2. Server Component가 사이에 있어도 된다</h5>
          <p>
            공급자를 Server Component 위에 두고 <code>children</code>으로 감싸면, 그 아래 Client Component는
            사이의 Server Component와 상관없이 Context를 읽을 수 있습니다. 화면 전체를 Client Component로
            올리지 않아도 서버 데이터 소유 구조가 유지됩니다.
          </p>
        </div>
        <div>
          <h5 className={h}>3. 저장 큐와 롤백</h5>
          <p>
            저장은 공급자의 <code>useActionState</code> 큐에서 순서대로 실행됩니다. 서버가 실패를 돌려주면 서버
            이벤트는 그대로이고, Action이 끝나면 임시 변경이 버려져 뷰가 서버 이벤트로 돌아갑니다. 역변경을
            계산하지 않습니다.
          </p>
        </div>
        <div>
          <h5 className={h}>4. 상태/디스패치 Context를 나누는 이유와 조건</h5>
          <p>
            변경만 보내는 컴포넌트가 <code>pendingChanges</code> 변화에 리렌더되지 않게 Context를 둘로 나눕니다.
            단, 디스패치 Context 값(<code>mutate</code>)이 렌더마다 새 함수라면 분리해도 소비자가 리렌더됩니다.
            이 저장소는 React Compiler를 <code>annotation</code> 모드로 쓰므로 자동 메모이제이션이 없고,
            <code>useCallback</code>과 <code>useMemo</code>로 직접 안정화해야 합니다. 위 체크박스로 직접 비교해 보세요.
          </p>
        </div>
        <div>
          <h5 className={h}>5. 언제 클라이언트 데이터 라이브러리를 쓰는가</h5>
          <ul className={ul}>
            <li>이 패턴은 확정 데이터를 서버가 소유하고, 낙관적 상태가 Action 종료와 함께 사라지는 경우에 맞습니다.</li>
            <li>메시지 폴링처럼 사용자가 조작하지 않아도 데이터가 바뀌면 SWR·TanStack Query가 맞습니다. 이때는 Next.js 캐시와 클라이언트 캐시 두 곳을 함께 갱신해야 합니다.</li>
            <li>채널 저장 큐 자체의 조율은 <code>optimistic-queue</code> 실습에서 다룹니다.</li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
