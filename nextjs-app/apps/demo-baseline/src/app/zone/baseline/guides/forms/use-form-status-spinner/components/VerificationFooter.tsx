'use client'

import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import type { Attempt, OrderResult } from '../types'
import { verifyAttempt } from '../verification'

export function VerificationFooter({ attempt, result, pending }: {
  attempt: Attempt | null
  result: OrderResult | null
  pending: boolean
}) {
  const isMatched = pending ? undefined : verifyAttempt(attempt, result)
  return (
    <>
      <ExpectedActualPanel title="이번 제출의 pending·data·서버 응답"
        isMatched={isMatched}
        description="검증 완료는 훅의 관측과 예상 응답이 일치했다는 뜻입니다. 서버의 수량 거절을 확인해도 학습 검증은 완료될 수 있습니다."
        expected={<div className="space-y-1">
          <p>폼 안 pending: false → true → false</p>
          <p>처리 중 disabled=true, data와 이번 제출 입력 일치</p>
          <p>폼 밖 pending=false 유지, 완료 후 버튼 활성화·data=null</p>
          <p>수량 1~10 정수: 서버 접수 / 그 외: 수량 오류로 거절</p>
        </div>}
        actual={<div className="space-y-2">
          {!attempt ? <p>제출 전 대기 중입니다.</p> : <>
            <p>제출 {attempt.input.requestId} · 입력 수량 {attempt.input.quantity || '(빈 값)'}</p>
            <ol className="list-inside list-decimal">
              {attempt.observations.map((observation, index) => <li key={index}>
                pending={String(observation.pending)}, disabled={String(observation.disabled)}, 밖={String(observation.outsidePending)}
                {observation.input ? ` / data: 제출 ${observation.input.requestId}, 수량 ${observation.input.quantity}` : ' / data=null'}
              </li>)}
            </ol>
            <p>{result ? result.status === 'success' ? '서버: 접수 완료' : '서버: 접수 거절 (수량 오류 등 확인)' : '이번 서버 응답을 아직 받지 못했습니다.'}</p>
            <p>{isMatched ? '이번 제출의 관측과 예상 응답이 모두 일치합니다.' : '관측 또는 응답 조건이 아직 충족되지 않았습니다.'}</p>
          </>}
        </div>} />
      <DemoDeepDiveCard title="부모 form의 상태를 구독하는 useFormStatus" className="min-w-0">
        <div className="space-y-3 text-sm">
          <p><code>useFormStatus()</code>는 호출한 컴포넌트의 부모 form을 구독합니다. SubmitButton을 form 안에 두면 pending과 제출된 FormData를 읽을 수 있습니다.</p>
          <pre className="overflow-x-auto rounded bg-zinc-100 p-3 text-xs dark:bg-zinc-900">{'OrderExercise (폼 밖 훅: false)\n└─ form action={formAction}\n   └─ SubmitButton (자식 훅: false → true → false)'}</pre>
          <p><code>actions.ts</code>의 <code>use server</code> 함수가 수량을 검사합니다. 응답 표시는 useActionState가 맡고, 버튼과 관측값은 자식의 useFormStatus에서 읽습니다. Network 탭에서 실제 POST를 확인할 수 있습니다.</p>
          <p>pending=false는 처리가 끝났다는 뜻이며 접수 성공을 뜻하지 않습니다. 수량 0을 보내면 서버가 거절하지만 pending은 다시 false가 됩니다.</p>
          <p>버튼 비활성화는 화면에서 반복 클릭을 줄이는 장치입니다. 실제 서비스의 중복 주문 방지는 별도의 서버 검증과 멱등성 처리가 필요합니다.</p>
        </div>
      </DemoDeepDiveCard>
    </>
  )
}
