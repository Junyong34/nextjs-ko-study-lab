'use client'

import { useActionState, useState } from 'react'
import { DemoPlaygroundCard, DemoResetButton, MOCK_PRODUCTS } from '@study/demo-kit'
import { validateOrderFormAction } from '../actions'
import type { ExpectedScenario, FormState } from '../types'
import { scenarioLabels } from '../verification'
import { VerificationFooter } from './VerificationFooter'

const initialState: FormState = { status: 'idle', errors: {}, fields: null, data: null }
const product = MOCK_PRODUCTS[0]
const inputClass = 'mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900'

export function FormValidationDemo() {
  const [generation, setGeneration] = useState(0)
  return <OrderForm key={generation} onReset={() => setGeneration((value) => value + 1)} />
}

function OrderForm({ onReset }: { onReset: () => void }) {
  const [state, formAction, isPending] = useActionState(validateOrderFormAction, initialState)
  const [email, setEmail] = useState('invalid-email')
  const [quantity, setQuantity] = useState('0')
  const [scenario, setScenario] = useState<ExpectedScenario>('both-errors')

  return (
    <>
      <DemoPlaygroundCard title="주문서 입력 확인">
        <form action={formAction} noValidate className="space-y-4 text-sm" aria-busy={isPending}>
          <div className="rounded border border-zinc-200 p-3 dark:border-zinc-800">
            <h3 className="font-semibold">{product.name}</h3>
            <p className="mt-1 text-xs text-zinc-500">개당 {product.price.toLocaleString('ko-KR')}원 · 예시 상품</p>
            <p className="mt-2 text-xs">입력 정보만 서버에서 검사합니다. 주문 저장·결제·이메일 발송은 하지 않습니다.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="order-email" className="font-medium">주문자 이메일 주소</label>
              <input id="order-email" name="email" type="email" required value={email}
                onChange={(event) => setEmail(event.target.value)} disabled={isPending}
                aria-invalid={Boolean(state.errors.email)}
                aria-describedby={state.errors.email ? 'order-email-error' : undefined}
                className={inputClass} />
              {state.errors.email && <p id="order-email-error" className="mt-1 text-xs text-rose-600 dark:text-rose-400">{state.errors.email}</p>}
            </div>
            <div>
              <label htmlFor="order-quantity" className="font-medium">주문 수량 (1~10개)</label>
              <input id="order-quantity" name="quantity" type="number" min="1" max="10" step="1"
                required value={quantity} onChange={(event) => setQuantity(event.target.value)} disabled={isPending}
                aria-invalid={Boolean(state.errors.quantity)}
                aria-describedby={state.errors.quantity ? 'order-quantity-error' : undefined}
                className={inputClass} />
              {state.errors.quantity && <p id="order-quantity-error" className="mt-1 text-xs text-rose-600 dark:text-rose-400">{state.errors.quantity}</p>}
            </div>
          </div>
          <p className="text-xs text-zinc-500">서버의 오류 응답을 관찰하도록 noValidate로 브라우저 기본 검사를 생략했습니다. 오류 안내는 마지막 제출 결과입니다.</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={isPending} className="rounded border px-3 py-1.5 text-xs"
              onClick={() => { setEmail('customer@example.com'); setQuantity('2') }}>올바른 예시 입력</button>
            <button type="button" disabled={isPending} className="rounded border px-3 py-1.5 text-xs"
              onClick={() => { setEmail('invalid-email'); setQuantity('0') }}>오류 예시 입력</button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" disabled={isPending}
              className="rounded bg-zinc-900 px-4 py-2 font-semibold text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900">
              {isPending ? '서버 검증 중...' : '주문서 제출 및 검증'}
            </button>
            <DemoResetButton onReset={onReset} disabled={isPending} />
          </div>
          <div role="status" aria-live="polite" className="rounded bg-zinc-100 p-3 text-xs dark:bg-zinc-900">
            <p>{isPending ? '서버 응답을 기다리고 있습니다.' : state.status === 'idle' ? '아직 제출하지 않았습니다.' :
              state.status === 'error' ? '서버가 입력을 거절했습니다. 각 필드의 오류를 수정해 주세요.' : '서버 입력 검사에 통과했습니다.'}</p>
            <p className="mt-1 font-mono">state.status: {state.status} · isPending: {String(isPending)}</p>
            {state.fields && <p className="mt-2 break-all">마지막 제출: 이메일 “{state.fields.email}” · 수량 “{state.fields.quantity}”</p>}
            {state.data && <p className="mt-1 break-all">성공 결과: {state.data.email} · {state.data.quantity}개</p>}
          </div>
        </form>
        <div className="mt-4 border-t border-zinc-200 pt-3 dark:border-zinc-800">
          <label htmlFor="expected-scenario" className="text-xs font-semibold">기대 시나리오</label>
          <select id="expected-scenario" value={scenario} disabled={isPending}
            onChange={(event) => setScenario(event.target.value as ExpectedScenario)} className={inputClass}>
            {Object.entries(scenarioLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          <p className="mt-1 text-xs text-zinc-500">입력 예시 버튼은 기대 시나리오를 바꾸지 않습니다. 마지막 서버 응답과 다른 기대를 골라 불일치도 비교하세요.</p>
        </div>
      </DemoPlaygroundCard>
      <VerificationFooter state={state} scenario={scenario} isPending={isPending} />
    </>
  )
}
