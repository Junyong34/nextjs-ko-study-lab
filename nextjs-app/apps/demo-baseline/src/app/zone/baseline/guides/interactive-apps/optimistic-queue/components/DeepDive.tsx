import { DemoDeepDiveCard } from '@study/demo-kit'

const h = 'mb-1 font-bold text-zinc-900 dark:text-zinc-100'
const ul = 'list-disc list-inside space-y-1 pl-1 text-zinc-600 dark:text-zinc-400'

export function DeepDive() {
  return (
    <DemoDeepDiveCard title="겹치는 낙관적 저장 조율">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className={h}>1. 왜 마지막 쓰기가 앞선 변경을 지우는가</h5>
          <p>
            <code>naive</code>는 확정 상태(<code>confirmed</code>)에서 다음 레이아웃을 계산해 전체를 저장합니다.
            첫 저장이 끝나기 전에 두 번째 변경이 들어오면 <code>confirmed</code>는 아직 옛 값이라 두 번째
            스냅샷에는 첫 변경이 없습니다. Next.js가 Server Action을 순서대로 보내도(현재 구현 세부사항이며
            바뀔 수 있습니다) 나중 요청이 마지막에 저장되어 첫 변경이 사라집니다.
          </p>
        </div>
        <div>
          <h5 className={h}>2. useActionState가 큐 역할을 하는 방식</h5>
          <p>
            <code>useActionState</code>의 콜백은 <code>(previousState, payload)</code>를 받고, 여러 번 dispatch하면
            앞선 콜백이 끝난 뒤 그 반환값이 다음 콜백의 <code>previousState</code>가 됩니다. 서버 Action에는 완성된
            배열 대신 <em>이전 저장본과 변경 하나</em>를 넘기고, 서버가 리듀서로 결과를 계산해 돌려줍니다.
          </p>
        </div>
        <div>
          <h5 className={h}>3. useOptimistic과 같은 리듀서</h5>
          <p>
            <code>useOptimistic(state.groups, reducer)</code>는 확정 상태 위에 변경을 적용한 임시 값을 즉시
            보여 줍니다. 서버와 화면이 <code>channelLayoutReducer</code> 하나를 공유하므로 계산 규칙이 갈라지지
            않습니다. 확정 상태가 바뀌면 React가 그 위에서 리듀서를 다시 실행합니다.
          </p>
        </div>
        <div>
          <h5 className={h}>4. 롤백에 역변경이 필요 없는 이유</h5>
          <p>
            임시 값은 Action이 끝나면 버려지고 <code>useActionState</code>가 가진 확정 상태가 렌더됩니다. 콜백이
            실패 시 <code>previousState</code>를 그대로 반환하면 화면은 마지막으로 저장이 확인된 레이아웃으로
            돌아갑니다.
          </p>
        </div>
        <div>
          <h5 className={h}>5. 주의사항</h5>
          <ul className={ul}>
            <li>dispatch와 <code>addOptimistic</code>은 <code>startTransition</code> 안에서 호출해야 합니다.</li>
            <li>서버 저장본이 다른 곳에서 바뀔 수 있다면(다른 사용자, 폴링) 이전 상태 기반 계산만으로는 부족합니다. 그런 데이터는 SWR·TanStack Query 같은 클라이언트 데이터 라이브러리가 맞습니다.</li>
            <li>이 예제의 서버 저장소는 모듈 메모리입니다. 실제 앱에서는 DB 트랜잭션과 <code>revalidatePath</code>/<code>revalidateTag</code>가 필요합니다.</li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
