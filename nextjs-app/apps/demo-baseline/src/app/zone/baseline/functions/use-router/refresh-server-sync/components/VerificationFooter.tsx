'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

interface VerificationFooterProps {
  /** 이 페이지의 서버 컴포넌트가 이번 렌더링에서 실제로 읽어온 재고 값 */
  renderedStock: number
  /** Server Action 응답으로 확인한 서버의 실제 재고. 아직 액션을 실행하지 않았으면 null */
  trueStock: number | null
}

export function VerificationFooter({ renderedStock, trueStock }: VerificationFooterProps) {
  const isMatched = trueStock === null ? undefined : trueStock === renderedStock

  const expected =
    trueStock === null
      ? '아직 [재고 1개 감소] Server Action을 실행하지 않았습니다.'
      : `서버 실제 재고: ${trueStock}개 (Server Action 응답으로 방금 확인한 값)`

  const actual = `화면에 렌더링된 재고: ${renderedStock}개 (이 라우트의 서버 컴포넌트가 마지막으로 렌더링한 값)`

  const description =
    isMatched === false
      ? '서버의 실제 재고는 이미 바뀌었지만, 이 라우트의 서버 컴포넌트는 아직 다시 렌더링되지 않아 화면에는 예전 값이 남아 있습니다. [새로고침 → router.refresh()]를 눌러 동기화해 보세요.'
      : isMatched === true
      ? 'router.refresh()가 서버 컴포넌트를 다시 렌더링해 화면 값과 서버 실제 값이 일치합니다. 위 메모 입력값이 그대로 남아 있는지도 함께 확인하세요.'
      : undefined

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="서버 실제 재고 vs 화면 렌더링 재고"
        expected={expected}
        actual={actual}
        isMatched={isMatched}
        description={description}
      />

      <DemoDeepDiveCard title="router.refresh()로 서버 데이터 갱신">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙</h5>
            <p>
              <code>useRouter()</code>가 제공하는 <code>router.refresh()</code>는 현재 라우트에 대해 서버로 새 요청을
              보내 데이터 요청을 다시 수행하고 Server Component를 다시 렌더링한 뒤, 새 RSC Payload를 클라이언트에
              병합하는 클라이언트 메서드입니다. 이 라우트의 클라이언트 라우터 캐시만 비우며, <code>useState</code> 같은
              클라이언트 상태나 스크롤 위치 같은 브라우저 상태는 잃지 않습니다. 서버측 데이터 캐시는 무효화하지
              않으므로, 캐시된 데이터까지 갱신하려면 <code>revalidatePath</code>/<code>revalidateTag</code>가 별도로
              필요합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 이 데모에서 관찰한 것</h5>
            <p>
              [재고 1개 감소] Server Action은 서버 메모리의 실제 재고를 바꾸지만 <code>revalidatePath</code>나
              서버측 <code>refresh</code>를 호출하지 않으므로, 이 라우트는 그 응답만으로는 다시 렌더링되지 않습니다.
              그래서 화면 재고(Actual)와 서버 실제 재고(Expected)가 어긋난 채로 남습니다. [새로고침 →
              router.refresh()]를 눌러야 서버 컴포넌트가 다시 렌더링되어 두 값이 일치하게 됩니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. Server Action과의 관계</h5>
            <p>
              Server Action이 <code>revalidatePath</code>, <code>revalidateTag</code>, <code>redirect</code>, 또는
              서버측 <code>refresh()</code>(<code>next/cache</code>, Server Action 내부에서만 호출 가능) 중 하나를
              호출하면 그 액션의 응답에 최신 RSC Payload가 함께 실려 화면이 같은 요청 안에서 즉시 갱신됩니다. 이
              데모의 [예제 초기화] 버튼은 <code>revalidatePath</code>를 호출하므로 클릭 즉시 화면이 갱신되는 것을
              대조해 확인할 수 있습니다. 반면 아무것도 호출하지 않는 액션은 서버 데이터를 실제로 바꾸고도 화면을
              그대로 두며, 이때 클라이언트에서 명시적으로 <code>router.refresh()</code>를 호출해야 합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>외부 REST API/웹훅으로 서버 데이터가 바뀐 뒤 현재 화면을 최신 상태로 동기화할 때</li>
              <li>외부 결제 팝업이 완료된 뒤 메인 화면의 결제/주문 상태를 다시 읽어올 때</li>
              <li>다른 사용자의 변경 사항을 주기적으로(폴링) 반영해야 할 때</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 주의사항</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>
                브라우저 새로고침(F5)과 다릅니다. F5는 문서를 통째로 다시 불러와 이 메모 입력 같은 클라이언트 상태를
                모두 초기화하지만, <code>router.refresh()</code>는 그 상태를 보존합니다.
              </li>
              <li>
                fetch 요청에 캐시가 걸려 있으면 <code>router.refresh()</code>를 호출해도 같은 캐시된 응답이 다시
                올 수 있습니다 — 서버측 캐시까지 무효화하려면 <code>revalidatePath</code>/<code>revalidateTag</code>를
                함께 사용해야 합니다.
              </li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
