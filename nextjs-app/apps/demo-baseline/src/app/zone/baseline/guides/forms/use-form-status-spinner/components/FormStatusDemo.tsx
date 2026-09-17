'use client'

import { useActionState, useCallback, useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { DemoPlaygroundCard, DemoResetButton, MOCK_PRODUCTS } from '@study/demo-kit'
import { submitExampleOrder } from '../actions'
import type { Attempt, Observation } from '../types'
import { SubmitButton } from './SubmitButton'
import { VerificationFooter } from './VerificationFooter'

export function FormStatusDemo() {
  const [version, setVersion] = useState(0)
  return <OrderExercise key={version} onReset={() => setVersion(value => value + 1)} />
}

function OrderExercise({ onReset }: { onReset: () => void }) {
  const product = MOCK_PRODUCTS[0]!
  const [result, formAction, pending] = useActionState(submitExampleOrder, null)
  // 이 컴포넌트가 반환하는 form은 훅의 부모가 아니므로 구독 대상이 아니다.
  const outside = useFormStatus()
  const [attempt, setAttempt] = useState<Attempt | null>(null)
  const [quantity, setQuantity] = useState('2')
  // React가 제출 이벤트를 처리할 때 이미 FormData를 읽을 수 있으므로 미리 렌더링한다.
  const nextRequestId = String(Number(result?.input.requestId ?? 0) + 1)
  const latest = useRef<Observation | null>(null)
  const onObserve = useCallback((observation: Observation) => {
    latest.current = observation
    setAttempt(current => {
      if (!current) return current
      if (observation.input && observation.input.requestId !== current.input.requestId) return current
      const last = current.observations.at(-1)
      if (JSON.stringify(last) === JSON.stringify(observation)) return current
      return { ...current, observations: [...current.observations, observation] }
    })
  }, [])
  const currentResult = result?.input.requestId === attempt?.input.requestId ? result : null

  return (
    <>
      <DemoPlaygroundCard title="예시 상품 주문 접수">
        <div className="space-y-4 text-sm">
          <p className="font-semibold">{product.name} · {product.price.toLocaleString('ko-KR')}원</p>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            실제 서버 요청에 관측용 1.2초 지연을 둡니다. 예시 입력만 검사하며 결제·메일 발송·영구 주문 저장은 하지 않습니다.
          </p>
          <form action={formAction} noValidate className="space-y-3" onSubmitCapture={event => {
            if (pending) { event.preventDefault(); return }
            const data = new FormData(event.currentTarget)
            setAttempt({
              input: { requestId: String(data.get('requestId')), productId: String(data.get('productId')), quantity: String(data.get('quantity')) },
              observations: latest.current ? [latest.current] : [],
            })
          }}>
            <input type="hidden" name="requestId" value={nextRequestId} />
            <input type="hidden" name="productId" value={product.id} />
            <label htmlFor="status-quantity" className="block font-medium">주문 수량</label>
            <input id="status-quantity" name="quantity" type="number" min="1" max="10" step="1"
              value={quantity} onChange={event => setQuantity(event.target.value)} disabled={pending}
              aria-invalid={Boolean(currentResult?.errors.quantity)} aria-describedby="quantity-help quantity-error"
              className="w-full rounded border border-zinc-400 bg-transparent px-3 py-2" />
            <p id="quantity-help" className="text-xs">1~10의 정수를 입력하세요. 0도 제출할 수 있도록 noValidate를 적용해 서버의 거절을 관찰합니다.</p>
            <p id="quantity-error" aria-live="polite" className="text-rose-700 dark:text-rose-300">{currentResult?.errors.quantity}</p>
            <SubmitButton outsidePending={outside.pending} onObserve={onObserve} />
          </form>
          <p className="font-mono text-xs">폼 밖: pending={String(outside.pending)} · data={outside.data ? '있음' : 'null'}</p>
          <div role="status" className="rounded border border-zinc-300 p-3 dark:border-zinc-700">
            {currentResult ? <>
              <p>{currentResult.status === 'success' ? '예시 주문 접수 완료' : '서버 접수 거절 — 주문 성공이 아닙니다.'}</p>
              <p className="text-xs">서버가 받은 입력: 제출 {currentResult.input.requestId} / {currentResult.input.productId} / 수량 {currentResult.input.quantity}</p>
              {Object.entries(currentResult.errors).filter(([key]) => key !== 'quantity').map(([key, message]) => <p key={key}>{message}</p>)}
            </> : pending ? '서버 응답 대기 중' : '이번 제출의 서버 응답이 없습니다.'}
          </div>
          <DemoResetButton onReset={onReset} disabled={pending} />
        </div>
      </DemoPlaygroundCard>
      <VerificationFooter attempt={attempt} result={currentResult} pending={pending} />
    </>
  )
}
