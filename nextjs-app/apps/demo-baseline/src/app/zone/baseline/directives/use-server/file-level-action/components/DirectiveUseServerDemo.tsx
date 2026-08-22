'use client'
import React, { useState, useTransition } from 'react'
import { type Coupon } from '@study/demo-kit'
import { applyCouponAction } from '../actions'

export function DirectiveUseServerDemo() {
  const [couponCode, setCouponCode] = useState('WELCOME2026')
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null)
  const [status, setStatus] = useState<string>('대기 중')
  const [isPending, startTransition] = useTransition()

  const orderAmount = 189000

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const res = await applyCouponAction(couponCode, orderAmount)
      if (res.success && res.coupon) {
        setAppliedCoupon(res.coupon)
        setStatus(`쿠폰 적용 성공! (${res.coupon.name}) - 할인액: ${res.discount?.toLocaleString()}원`)
      } else {
        setAppliedCoupon(null)
        setStatus(res.error || '쿠폰 적용에 실패했습니다.')
      }
    })
  }

  const discountVal = appliedCoupon
    ? appliedCoupon.discountType === 'PERCENT'
      ? (orderAmount * appliedCoupon.discountValue) / 100
      : appliedCoupon.discountValue
    : 0

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-950 text-xs">
      <div className="border-b border-zinc-200 pb-2.5 dark:border-zinc-800">
        <h4 className="font-bold text-zinc-900 dark:text-zinc-100">장바구니 할인 쿠폰 적용 (File-Level Server Action)</h4>
        <p className="text-zinc-500 text-[11px] mt-0.5">별도 모듈에 선언된 파일 레벨 'use server' 함수를 클라이언트 폼에서 직접 호출합니다.</p>
      </div>

      <form onSubmit={handleApply} className="flex gap-2">
        <input
          type="text"
          value={couponCode}
          onChange={e => setCouponCode(e.target.value)}
          placeholder="쿠폰 코드 입력 (예: WELCOME2026, VIPSPECIAL)"
          className="flex-1 rounded border border-zinc-300 bg-white px-3 py-1.5 text-zinc-900 font-mono dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded bg-blue-600 px-4 py-1.5 font-bold text-white shadow-2xs hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
        >
          {isPending ? '검증 중...' : '쿠폰 적용'}
        </button>
      </form>

      <div className="rounded bg-zinc-50 p-3 dark:bg-zinc-900/50 space-y-2 border border-zinc-200/80 dark:border-zinc-800">
        <div className="flex justify-between">
          <span className="text-zinc-500">주문 상품 금액:</span>
          <span className="font-mono font-bold">{orderAmount.toLocaleString()}원</span>
        </div>
        {appliedCoupon && (
          <div className="flex justify-between text-rose-600 dark:text-rose-400">
            <span>쿠폰 할인 ({appliedCoupon.name}):</span>
            <span className="font-mono font-bold">-{discountVal.toLocaleString()}원</span>
          </div>
        )}
        <div className="flex justify-between border-t border-dashed pt-2 font-bold text-zinc-900 dark:text-zinc-100">
          <span>최종 결제 예정 금액:</span>
          <span className="text-blue-600 dark:text-blue-400 font-extrabold text-sm">
            {(orderAmount - discountVal).toLocaleString()}원
          </span>
        </div>
        <div className="text-[11px] text-zinc-500 pt-1 font-mono">
          상태: {status}
        </div>
      </div>
    </div>
  )
}
