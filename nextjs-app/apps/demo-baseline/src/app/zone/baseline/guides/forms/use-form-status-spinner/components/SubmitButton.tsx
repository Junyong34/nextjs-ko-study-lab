'use client'

import { useEffect, useRef } from 'react'
import { useFormStatus } from 'react-dom'
import type { Observation } from '../types'

export function SubmitButton({ outsidePending, onObserve }: {
  outsidePending: boolean
  onObserve: (observation: Observation) => void
}) {
  const { pending, data } = useFormStatus()
  const button = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!button.current) return
    onObserve({
      pending,
      disabled: button.current.disabled,
      outsidePending,
      input: data ? {
        requestId: String(data.get('requestId') ?? ''),
        productId: String(data.get('productId') ?? ''),
        quantity: String(data.get('quantity') ?? ''),
      } : null,
    })
  }, [pending, data, outsidePending, onObserve])

  return (
    <div className="space-y-3">
      <button ref={button} type="submit" disabled={pending}
        className="w-full rounded bg-emerald-700 px-4 py-2 text-white disabled:cursor-wait disabled:opacity-60">
        {pending ? <><span aria-hidden="true" className="mr-2 inline-block animate-spin">◌</span>서버 접수 처리 중…</> : '예시 주문 접수'}
      </button>
      <div role="status" className="rounded bg-zinc-100 p-3 font-mono text-xs dark:bg-zinc-900">
        <p>폼 안: pending={String(pending)} · disabled={String(pending)}</p>
        <p>data: {data ? `상품 ${data.get('productId')} / 수량 ${data.get('quantity')} / 제출 ${data.get('requestId')}` : 'null'}</p>
      </div>
    </div>
  )
}
