'use client'
import React, { useState, useTransition } from 'react'
import { DemoPlaygroundCard, DemoResetButton } from '@study/demo-kit'
import { applyCouponAction, type CouponActionResult } from '../actions'
import { VerificationFooter } from './VerificationFooter'

const ORDER_AMOUNT = 189000
const INITIAL_COUPON_CODE = 'WELCOME2026'

export function DirectiveUseServerDemo() {
  const [couponCode, setCouponCode] = useState(INITIAL_COUPON_CODE)
  const [result, setResult] = useState<CouponActionResult | null>(null)
  const [requestCount, setRequestCount] = useState(0)
  const [isPending, startTransition] = useTransition()

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      // applyCouponAction은 actions.ts 최상단 'use server'로 선언된 별도 모듈의 함수다.
      // 일반 함수처럼 호출하지만 실제로는 Network 탭에 기록되는 POST 요청으로 전송된다.
      const res = await applyCouponAction(couponCode, ORDER_AMOUNT)
      setResult(res)
      setRequestCount(c => c + 1)
    })
  }

  const handleReset = () => {
    setCouponCode(INITIAL_COUPON_CODE)
    setResult(null)
    setRequestCount(0)
  }

  const appliedCoupon = result?.success ? result.coupon : undefined
  const discountVal = result?.success ? result.discount ?? 0 : 0
  const finalAmount = result?.success ? result.finalAmount ?? ORDER_AMOUNT : ORDER_AMOUNT

  const statusText = !result
    ? '대기 중'
    : result.success
      ? `쿠폰 적용 성공! (${result.coupon?.name}) - 할인액: ${discountVal.toLocaleString()}원`
      : result.error || '쿠폰 적용에 실패했습니다.'

  return (
    <>
      <DemoPlaygroundCard title="장바구니 할인 쿠폰 적용 (파일 레벨 Server Action)">
        <div className="space-y-4 text-xs">
          <p className="text-zinc-500 text-[11px] leading-relaxed">
            별도 파일(actions.ts) 최상단에 선언된 <code>'use server'</code> 함수를 클라이언트 폼에서 직접 임포트해 호출한다.
            제출할 때마다 브라우저 개발자 도구 Network 탭에서 이 액션의 POST 요청을 확인할 수 있다.
          </p>

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
              <span className="font-mono font-bold">{ORDER_AMOUNT.toLocaleString()}원</span>
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
                {finalAmount.toLocaleString()}원
              </span>
            </div>
            <div className="text-[11px] text-zinc-500 pt-1 font-mono">
              상태: {statusText}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] text-zinc-500 font-mono">
              Server Action 호출 횟수: {requestCount}회
              {result ? ` · 서버 처리 시각: ${result.processedAt}` : ''}
            </span>
            <DemoResetButton onReset={handleReset} label="쿠폰 초기화" />
          </div>
        </div>
      </DemoPlaygroundCard>

      <VerificationFooter
        isMatched={result ? result.success : undefined}
        expected="쿠폰 코드를 서버(actions.ts)에서 검증해 정상 코드는 할인을 적용하고 잘못된 코드는 오류를 반환한다. 매 호출은 Network 탭에 기록되는 POST 요청이다."
        actual={
          result
            ? result.success
              ? `• ${requestCount}번째 서버 응답 성공 (처리 시각 ${result.processedAt})\n• 할인 적용: -${discountVal.toLocaleString()}원 → 최종 ${finalAmount.toLocaleString()}원`
              : `• ${requestCount}번째 서버 응답 실패 (처리 시각 ${result.processedAt})\n• 오류: ${result.error}`
            : undefined
        }
        description={
          result
            ? statusText
            : '쿠폰 코드를 입력하고 [쿠폰 적용]을 눌러 실제 Server Action 응답을 확인한다.'
        }
      />
    </>
  )
}
